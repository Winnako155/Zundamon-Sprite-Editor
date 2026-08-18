using Microsoft.Web.WebView2.Core;
using System;
using System.IO;
using System.Windows;

namespace zunzunWebView2
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            InitializeWebView();
        }

        private async void InitializeWebView()
        {
            // 1. 拼接本地文件夹的真实物理路径
            // AppDomain.CurrentDomain.BaseDirectory 已经自带了结尾的斜杠，不需要再加 \zunzun
            string localFolderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "zunzun");

            // 2. 初始化 WebView2 环境
            await webView.EnsureCoreWebView2Async();

            // 3. 设置虚拟主机名映射
            // 将本地物理文件夹映射为虚拟域名，完美解决画布污染问题
            webView.CoreWebView2.SetVirtualHostNameToFolderMapping(
                "zunzunWebView2.local",
                localFolderPath,
                CoreWebView2HostResourceAccessKind.Allow);

            // 4. 导航到虚拟域名下的 index.html
            // 注意：既然本地文件夹已经是 zunzun，URL 里就不需要再写 /zunzun/ 了
            webView.Source = new Uri("https://zunzunWebView2.local/index.html");
        }
    }
}