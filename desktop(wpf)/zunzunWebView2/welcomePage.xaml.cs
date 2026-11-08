using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace zunzunWebView2
{
    /// <summary>
    /// welcomePage.xaml 的交互逻辑
    /// </summary>
    public partial class welcomePage : Window
    {
        public MainWindow mw;
        public welcomePage()
        {
            InitializeComponent();
            openTheMainWindow();
            mw = new MainWindow();

        }
        async private void openTheMainWindow()
        {
            await Task.Delay(2000);
            mw.Show();
            this.Close();
            
        }
    }
}
