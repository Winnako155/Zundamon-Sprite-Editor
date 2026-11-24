using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace zunzunWebView2
{
    /// <summary>
    /// App.xaml 的交互逻辑
    /// </summary>
    public partial class App : Application
    {
        protected override async void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // 1. 先显示加载窗口，并等它真正渲染出来再做重活，避免启动时迟迟看不到加载窗口
            welcomePage loading = new welcomePage();
            TaskCompletionSource<bool> rendered = new TaskCompletionSource<bool>();
            loading.ContentRendered += delegate { rendered.TrySetResult(true); };
            loading.Show();
            await rendered.Task;

            // 2. 加载窗口已显示，再异步创建主窗口并初始化 WebView2
            //    Opacity=0 + 屏幕外：WebView2 在后台真实加载，用户看不到空窗口
            MainWindow main = new MainWindow();
            main.Show();
            bool ok = await main.LoadWebViewAsync();

            // 3. 真实加载结束：进度条冲到 100%，加载窗口淡出、主窗口同时淡入
            await loading.CompleteProgressAsync();
            loading.Activate(); // 让加载窗口压在正在淡入的主窗口上方，形成淡出淡入的过渡
            main.FinishLoading();
            await loading.FadeOutAsync();
            loading.Close();
            main.Activate();

            //加载失败或超时：不要一直卡在 Loading，给出重试入口
            while (!ok)
            {
                MessageBoxResult result = MessageBox.Show(
                    main,
                    "网页加载失败或超时。\n请确认程序目录下的 zunzun 文件夹完整，或点击“是”重新加载。",
                    "加载失败",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning);
                if (result != MessageBoxResult.Yes) { break; }
                ok = await main.LoadWebViewAsync();
            }
        }
    }
}
