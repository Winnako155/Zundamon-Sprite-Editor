using Microsoft.Web.WebView2.Core;
using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Animation;

namespace zunzunWebView2
{
    // 暴露给网页的桥：把成品图写进系统剪贴板，以及拖出为真实 PNG 文件
    // WebView2 通过 chrome.webview.hostObjects.zunzunBridge 调用这些方法
    [ComVisible(true)]
    public class ZunzunBridge
    {
        private readonly Window dragSource;

        public ZunzunBridge(Window dragSource)
        {
            this.dragSource = dragSource;
        }

        // 参数是 PNG 的 Base64（不带 data:image/png;base64, 前缀）
        public void CopyPng(string base64)
        {
            if (string.IsNullOrEmpty(base64)) { return; }
            byte[] bytes = Convert.FromBase64String(base64);
            Application.Current.Dispatcher.Invoke(() =>
            {
                // 直接放 PNG 原始字节：WPF 的 SetImage/Bitmap 会转成 DIB，透明区域会变成黑色
                DataObject data = new DataObject();
                data.SetData("PNG", new MemoryStream(bytes), false);
                data.SetData("image/png", new MemoryStream(bytes), false);
                // true：应用关闭后剪贴板里的图片仍然保留
                Clipboard.SetDataObject(data, true);
            });
        }

        // 把成品图拖到其它软件。
        // Chromium 的 DownloadURL 拖放给的是虚拟文件（CFSTR_FILECONTENTS），资源管理器能识别并另存，
        // 但剪映、Premiere 这类软件只接受 CF_HDROP 的真实文件路径，所以这里先落一个临时 PNG，
        // 再用标准文件列表启动系统拖放。
        public void StartDragPng(string base64, string fileName)
        {
            if (string.IsNullOrEmpty(base64) || dragSource == null) { return; }
            byte[] bytes = Convert.FromBase64String(base64);
            string baseName = SanitizeFileName(fileName);
            Application.Current.Dispatcher.BeginInvoke(new Action(delegate
            {
                try
                {
                    string path = WriteDragTempPng(bytes, baseName);
                    if (path == null) { return; }
                    DataObject data = new DataObject();
                    // 标准 CF_HDROP 文件列表：资源管理器、剪映、Premiere 等都能接收
                    data.SetData(DataFormats.FileDrop, new string[] { path });
                    DragDrop.DoDragDrop(dragSource, data, DragDropEffects.Copy);
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("拖出 PNG 失败：" + ex);
                }
            }));
        }

        // 清理上次运行遗留的拖出临时文件：保留 1 天内，避免其它软件延迟读取时文件已消失
        public static void CleanupTempFiles()
        {
            try
            {
                string dir = GetTempDir();
                if (!Directory.Exists(dir)) { return; }
                foreach (string file in Directory.GetFiles(dir, "*.png"))
                {
                    try
                    {
                        if (File.GetLastWriteTime(file) < DateTime.Now.AddDays(-1)) { File.Delete(file); }
                    }
                    catch { } // 被占用就留给下次清理
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("清理拖出临时文件失败：" + ex);
            }
        }

        // 只保留文件名主体，统一用 .png 落盘（防非法字符、防 .png.png）
        private static string SanitizeFileName(string fileName)
        {
            string name = Path.GetFileNameWithoutExtension(fileName == null ? "" : fileName);
            foreach (char c in Path.GetInvalidFileNameChars()) { name = name.Replace(c, '_'); }
            name = name.Trim();
            if (name.Length > 80) { name = name.Substring(0, 80); }
            return string.IsNullOrEmpty(name) ? "zundamon" : name;
        }

        private static string GetTempDir()
        {
            return Path.Combine(Path.GetTempPath(), "ZundamonSpriteEditor");
        }

        // 写临时 PNG；同名文件被目标软件占用时自动加序号，避免覆盖对方正在读取的文件
        private static string WriteDragTempPng(byte[] bytes, string baseName)
        {
            string dir = GetTempDir();
            Directory.CreateDirectory(dir);
            for (int i = 1; i <= 20; i++)
            {
                string path = Path.Combine(dir, i == 1 ? baseName + ".png" : baseName + " (" + i + ").png");
                try
                {
                    using (FileStream stream = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.Read))
                    {
                        stream.Write(bytes, 0, bytes.Length);
                    }
                    return path;
                }
                catch (IOException)
                {
                    // 被占用，换下一个名字
                }
            }
            return null;
        }
    }

    public partial class MainWindow : Window
    {
        private bool webViewInitialized;
        private TaskCompletionSource<bool> loadingTcs;

        public MainWindow()
        {
            InitializeComponent();
            // 加载期间放到屏幕外：WebView2 是独立 HWND，单靠 Opacity 可能遮不住白底
            WindowStartupLocation = WindowStartupLocation.Manual;
            Left = -32000;
            Top = -32000;
            // WindowChrome 在无边框时会关掉 DWM 投影，这里重新打开
            Loaded += delegate { EnableDwmShadow(); };
            // 清掉上次运行遗留的拖出临时图，避免临时目录越积越多
            ZunzunBridge.CleanupTempFiles();
        }

        // ---------- 窗口投影 ----------
        [StructLayout(LayoutKind.Sequential)]
        private struct MARGINS
        {
            public int Left;
            public int Right;
            public int Top;
            public int Bottom;
        }

        [DllImport("dwmapi.dll")]
        private static extern int DwmExtendFrameIntoClientArea(IntPtr hwnd, ref MARGINS margins);

        [DllImport("dwmapi.dll")]
        private static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int value, int size);

        protected override void OnSourceInitialized(EventArgs e)
        {
            base.OnSourceInitialized(e);
            EnableDwmShadow();
            // WindowChrome 的无边框窗口最大化时会铺满整块屏幕，底部被任务栏遮住；
            // 拦下 WM_GETMINMAXINFO，把最大化区域限制在当前显示器的工作区
            HwndSource source = HwndSource.FromHwnd(new WindowInteropHelper(this).Handle);
            if (source != null) { source.AddHook(WndProc); }
            ApplyWindowIcons();
        }

        private void EnableDwmShadow()
        {
            IntPtr hwnd = new WindowInteropHelper(this).Handle;
            if (hwnd == IntPtr.Zero) { return; }
            // 允许 DWM 绘制非客户区（无边框窗口靠这个恢复系统投影）
            int enabled = 2; // DWMNCRP_ENABLED
            DwmSetWindowAttribute(hwnd, 2 /* DWMWA_NCRENDERING_POLICY */, ref enabled, sizeof(int));
            // 留 1px 玻璃边框，DWM 才会为窗口绘制阴影
            MARGINS margins = new MARGINS { Left = 1, Right = 1, Top = 1, Bottom = 1 };
            DwmExtendFrameIntoClientArea(hwnd, ref margins);
        }

        // ---------- 窗口图标（标题栏 / 任务栏 / Alt-Tab） ----------
        private const int WM_SETICON = 0x0080;
        private const int ICON_SMALL = 0;
        private const int ICON_BIG = 1;
        private IntPtr smallIcon = IntPtr.Zero;
        private IntPtr bigIcon = IntPtr.Zero;

        [DllImport("user32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        private static extern IntPtr LoadImage(IntPtr hinst, string name, uint type, int cx, int cy, uint load);

        [DllImport("user32.dll")]
        private static extern IntPtr SendMessage(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam);

        [DllImport("user32.dll")]
        private static extern bool DestroyIcon(IntPtr hIcon);

        // 从 ICO 里按目标像素取帧，避免系统/WPF 拿 512 大图缩放导致发糊：
        // 标题栏和任务栏用小图标（16 DIP），Alt-Tab 用大图标（32 DIP），按当前 DPI 换算成物理像素
        private void ApplyWindowIcons()
        {
            IntPtr hwnd = new WindowInteropHelper(this).Handle;
            if (hwnd == IntPtr.Zero) { return; }
            string iconPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "ico_256x256.ico");
            if (!File.Exists(iconPath)) { return; }

            DpiScale dpi = VisualTreeHelper.GetDpi(this);
            IntPtr small = LoadImage(IntPtr.Zero, iconPath, 1 /* IMAGE_ICON */,
                (int)Math.Round(16 * dpi.DpiScaleX), (int)Math.Round(16 * dpi.DpiScaleY), 0x0010 /* LR_LOADFROMFILE */);
            IntPtr big = LoadImage(IntPtr.Zero, iconPath, 1 /* IMAGE_ICON */,
                (int)Math.Round(32 * dpi.DpiScaleX), (int)Math.Round(32 * dpi.DpiScaleY), 0x0010 /* LR_LOADFROMFILE */);

            if (small != IntPtr.Zero)
            {
                SendMessage(hwnd, WM_SETICON, (IntPtr)ICON_SMALL, small);
                if (smallIcon != IntPtr.Zero) { DestroyIcon(smallIcon); }
                smallIcon = small;
            }
            if (big != IntPtr.Zero)
            {
                SendMessage(hwnd, WM_SETICON, (IntPtr)ICON_BIG, big);
                if (bigIcon != IntPtr.Zero) { DestroyIcon(bigIcon); }
                bigIcon = big;
            }
        }

        // 跨显示器拖动导致 DPI 变化时，重新按新的物理像素尺寸取图标
        protected override void OnDpiChanged(DpiScale oldDpi, DpiScale newDpi)
        {
            base.OnDpiChanged(oldDpi, newDpi);
            ApplyWindowIcons();
        }

        protected override void OnClosed(EventArgs e)
        {
            // WM_SETICON 设置的 HICON 由调用方释放
            if (smallIcon != IntPtr.Zero) { DestroyIcon(smallIcon); smallIcon = IntPtr.Zero; }
            if (bigIcon != IntPtr.Zero) { DestroyIcon(bigIcon); bigIcon = IntPtr.Zero; }
            base.OnClosed(e);
        }

        // ---------- 最大化区域（避开任务栏） ----------
        private const int WM_GETMINMAXINFO = 0x0024;
        private const uint MONITOR_DEFAULTTONEAREST = 0x00000002;

        [StructLayout(LayoutKind.Sequential)]
        private struct POINT
        {
            public int X;
            public int Y;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct MINMAXINFO
        {
            public POINT Reserved;
            public POINT MaxSize;
            public POINT MaxPosition;
            public POINT MinTrackSize;
            public POINT MaxTrackSize;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct RECT
        {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct MONITORINFO
        {
            public int Size;
            public RECT Monitor;
            public RECT Work;
            public uint Flags;
        }

        [DllImport("user32.dll")]
        private static extern IntPtr MonitorFromWindow(IntPtr hwnd, uint flags);

        [DllImport("user32.dll")]
        private static extern bool GetMonitorInfo(IntPtr monitor, ref MONITORINFO info);

        private IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            if (msg != WM_GETMINMAXINFO) { return IntPtr.Zero; }

            IntPtr monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);
            if (monitor == IntPtr.Zero) { return IntPtr.Zero; }

            MONITORINFO monitorInfo = new MONITORINFO();
            monitorInfo.Size = Marshal.SizeOf(typeof(MONITORINFO));
            if (!GetMonitorInfo(monitor, ref monitorInfo)) { return IntPtr.Zero; }

            MINMAXINFO info = (MINMAXINFO)Marshal.PtrToStructure(lParam, typeof(MINMAXINFO));
            // ptMaxPosition 相对显示器左上角；最大尺寸取工作区，最大化后正好停在任务栏上沿
            info.MaxPosition.X = monitorInfo.Work.Left - monitorInfo.Monitor.Left;
            info.MaxPosition.Y = monitorInfo.Work.Top - monitorInfo.Monitor.Top;
            info.MaxSize.X = monitorInfo.Work.Right - monitorInfo.Work.Left;
            info.MaxSize.Y = monitorInfo.Work.Bottom - monitorInfo.Work.Top;

            // 这条消息被接管后 WPF 不会再替我们处理 MinWidth/MinHeight，
            // 这里把最小尺寸按当前 DPI 换算成物理像素写回，拖拽缩放时才会停在最小尺寸
            DpiScale dpi = VisualTreeHelper.GetDpi(this);
            if (!double.IsNaN(MinWidth) && MinWidth > 0)
            {
                info.MinTrackSize.X = Math.Max(info.MinTrackSize.X, (int)Math.Ceiling(MinWidth * dpi.DpiScaleX));
            }
            if (!double.IsNaN(MinHeight) && MinHeight > 0)
            {
                info.MinTrackSize.Y = Math.Max(info.MinTrackSize.Y, (int)Math.Ceiling(MinHeight * dpi.DpiScaleY));
            }

            Marshal.StructureToPtr(info, lParam, true);
            handled = true;
            return IntPtr.Zero;
        }

        // 启动时由 App 调用：初始化 WebView2 并等待页面加载完成
        // true = 导航成功且页面已可交互；false = 初始化异常 / 导航失败 / 超时
        public async Task<bool> LoadWebViewAsync()
        {
            loadingTcs = new TaskCompletionSource<bool>();
            try
            {
                if (!webViewInitialized)
                {
                    // 1. 拼接本地文件夹的真实物理路径
                    string localFolderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "zunzun");

                    // 2. 初始化 WebView2 环境
                    await webView.EnsureCoreWebView2Async();

                    // 3. 设置虚拟主机名映射，解决画布污染问题
                    webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                        "zunzunWebView2.local",
                        localFolderPath,
                        CoreWebView2HostResourceAccessKind.Allow);

                    // 3.1 注册网页端可调用的桥（复制成品图到剪贴板 / 拖出为真实 PNG 文件）
                    webView.CoreWebView2.AddHostObjectToScript("zunzunBridge", new ZunzunBridge(this));

                    webView.CoreWebView2.NavigationCompleted += CoreWebView2_NavigationCompleted;
                    webView.CoreWebView2.ProcessFailed += CoreWebView2_ProcessFailed;
                    webViewInitialized = true;
                }

                // 4. 导航到虚拟域名下的 index.html
                webView.Source = new Uri("https://zunzunWebView2.local/index.html");
            }
            catch (Exception ex)
            {
                Debug.WriteLine("WebView2 初始化失败：" + ex);
                return false;
            }

            // 20 秒还没加载完就当作失败，交给 App 显示重试提示，避免卡在 Loading
            Task timeout = Task.Delay(TimeSpan.FromSeconds(20));
            Task finished = await Task.WhenAny(loadingTcs.Task, timeout);
            if (finished == timeout) { return false; }
            return await loadingTcs.Task;
        }

        private async void CoreWebView2_NavigationCompleted(object sender, CoreWebView2NavigationCompletedEventArgs e)
        {
            TaskCompletionSource<bool> tcs = loadingTcs;
            if (tcs == null) { return; }
            if (!e.IsSuccess)
            {
                tcs.TrySetResult(false);
                return;
            }
            try
            {
                // 等页面真正可交互（readyState 至少到 interactive），再放行主窗口
                string state = await webView.CoreWebView2.ExecuteScriptAsync("document.readyState");
                if (state != null && (state.Contains("interactive") || state.Contains("complete")))
                {
                    // 给首帧渲染留一点时间，避免显示出来时还是空白
                    await Task.Delay(100);
                    tcs.TrySetResult(true);
                    return;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine("读取页面状态失败：" + ex);
            }
            tcs.TrySetResult(false);
        }

        private void CoreWebView2_ProcessFailed(object sender, CoreWebView2ProcessFailedEventArgs e)
        {
            if (loadingTcs != null) { loadingTcs.TrySetResult(false); }
        }

        // 加载完成后把主窗口移到屏幕中央并淡入；加载窗口的关闭与焦点的接收由 App 处理
        public void FinishLoading()
        {
            Rect workArea = SystemParameters.WorkArea;
            Left = workArea.Left + (workArea.Width - ActualWidth) / 2;
            Top = workArea.Top + (workArea.Height - ActualHeight) / 2;
            ShowInTaskbar = true;
            BeginAnimation(OpacityProperty, new DoubleAnimation(1, TimeSpan.FromMilliseconds(320))
            {
                EasingFunction = new QuadraticEase { EasingMode = EasingMode.EaseOut }
            });
        }

        // ---------- 自绘标题栏 ----------
        private void button_pin_Checked(object sender, RoutedEventArgs e)
        {
            Topmost = true;
        }
        private void button_pin_Unchecked(object sender, RoutedEventArgs e)
        {
            Topmost = false;
        }
        private void button_min_Click(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }
        private void button_max_Click(object sender, RoutedEventArgs e)
        {
            WindowState = (WindowState == WindowState.Maximized)
                ? WindowState.Normal
                : WindowState.Maximized;
        }
        private void button_close_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
        private void Window_StateChanged(object sender, EventArgs e)
        {
            // 最大化后把按钮换成“还原”图标，保持和系统标题栏一致
            if (button_max == null) { return; }
            bool maximized = WindowState == WindowState.Maximized;
            button_max.Content = maximized ? "\uE923" : "\uE922";
            button_max.ToolTip = maximized ? "还原" : "最大化";
        }
    }
}
