using Microsoft.Web.WebView2.Core;
using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Interop;

namespace zunzunWebView2
{
    // 暴露给网页的桥：目前只负责把成品图写进系统剪贴板
    // WebView2 通过 chrome.webview.hostObjects.zunzunBridge 调用这些方法
    [ComVisible(true)]
    public class ZunzunBridge
    {
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

                    // 3.1 注册网页端可调用的桥（复制成品图到系统剪贴板）
                    webView.CoreWebView2.AddHostObjectToScript("zunzunBridge", new ZunzunBridge());

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

        // 加载完成后显示主窗口：从屏幕外移回中央并接收焦点
        public void FinishLoading()
        {
            Rect workArea = SystemParameters.WorkArea;
            Left = workArea.Left + (workArea.Width - ActualWidth) / 2;
            Top = workArea.Top + (workArea.Height - ActualHeight) / 2;
            Opacity = 1;
            ShowInTaskbar = true;
            Activate();
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
