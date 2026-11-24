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

            //加载窗口先出现，主窗口同时开始加载但保持透明、不抢焦点
            welcomePage loading = new welcomePage();
            loading.Show();

            MainWindow main = new MainWindow();
            main.Show(); //Opacity=0 + 不激活：WebView2 在后台真实加载，用户看不到空窗口
            bool ok = await main.LoadWebViewAsync();

            main.FinishLoading();
            loading.Close();

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
