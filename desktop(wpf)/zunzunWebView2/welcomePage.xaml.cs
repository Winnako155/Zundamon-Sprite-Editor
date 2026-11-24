using System;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Threading;

namespace zunzunWebView2
{
    /// <summary>
    /// welcomePage.xaml 的交互逻辑
    /// </summary>
    public partial class welcomePage : Window
    {
        // 假进度上限：真实加载完成前最多推进到这里，随后由 CompleteProgressAsync 冲满
        private const double FakeProgressLimit = 0.9;
        private readonly DispatcherTimer progressTimer;
        private double progress;

        public welcomePage()
        {
            InitializeComponent();

            // 不等真实加载进度，按时间缓慢推进；越接近上限速度越慢，看起来更自然
            progressTimer = new DispatcherTimer { Interval = TimeSpan.FromMilliseconds(30) };
            progressTimer.Tick += ProgressTimer_Tick;
            progressTimer.Start();
        }

        private void ProgressTimer_Tick(object sender, EventArgs e)
        {
            if (progress >= FakeProgressLimit) { return; }
            progress = Math.Min(FakeProgressLimit, progress + (FakeProgressLimit - progress) * 0.012 + 0.0004);
            ApplyProgress();
        }

        private void ApplyProgress()
        {
            progressScale.ScaleX = Math.Max(progress, 0.0001);
        }

        // 真实加载完成：进度条快速冲到 100%
        public async Task CompleteProgressAsync()
        {
            progressTimer.Stop();
            progress = 1;

            TaskCompletionSource<bool> done = new TaskCompletionSource<bool>();
            DoubleAnimation fill = new DoubleAnimation(1, TimeSpan.FromMilliseconds(220))
            {
                EasingFunction = new CubicEase { EasingMode = EasingMode.EaseOut }
            };
            fill.Completed += delegate { done.TrySetResult(true); };
            progressScale.BeginAnimation(ScaleTransform.ScaleXProperty, fill);
            await done.Task;
        }

        // 加载窗口淡出，供主窗口同时淡入
        public Task FadeOutAsync()
        {
            progressTimer.Stop();
            TaskCompletionSource<bool> done = new TaskCompletionSource<bool>();
            DoubleAnimation fade = new DoubleAnimation(0, TimeSpan.FromMilliseconds(300))
            {
                EasingFunction = new QuadraticEase { EasingMode = EasingMode.EaseIn }
            };
            fade.Completed += delegate { done.TrySetResult(true); };
            BeginAnimation(OpacityProperty, fade);
            return done.Task;
        }
    }
}
