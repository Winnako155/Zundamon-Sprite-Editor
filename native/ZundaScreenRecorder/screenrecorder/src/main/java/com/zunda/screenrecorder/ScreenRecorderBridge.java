package com.zunda.screenrecorder;

import android.content.Context;
import android.content.Intent;
import android.hardware.display.DisplayManager;
import android.os.Build;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;

import java.io.File;

/**
 * 给 HBuilderX 5+ App 的 JS 调用的静态桥。
 *
 * JS 用法（plus.android.importClass 后直接调静态方法）：
 *   var Bridge = plus.android.importClass("com.zunda.screenrecorder.ScreenRecorderBridge");
 *   Bridge.requestPermissionAndStart(0, 0, 0, 30, true, "/sdcard/.../a.mp4");
 *   Bridge.getState();      // idle / requesting / starting / recording / error
 *   Bridge.stop();
 *   Bridge.getLastFilePath();
 *   Bridge.getLastFileSize();
 *
 * 注意：宽度/高度传 0 表示使用当前屏幕真实分辨率；bitrate 传 0 表示按分辨率自动计算。
 */
public final class ScreenRecorderBridge {
    private static final String TAG = "ZundaScreenRecorder";

    private ScreenRecorderBridge() {
    }

    /** 是否支持 MediaProjection（Android 5.0+）。 */
    public static boolean isSupported() {
        return Build.VERSION.SDK_INT >= 21;
    }

    /** 是否支持内部音频捕获（Android 10+）。 */
    public static boolean canCaptureAudio() {
        return Build.VERSION.SDK_INT >= 29;
    }

    public static String getState() {
        synchronized (PermissionStore.LOCK) {
            return PermissionStore.state;
        }
    }

    public static String getLastError() {
        synchronized (PermissionStore.LOCK) {
            return PermissionStore.lastError == null ? "" : PermissionStore.lastError;
        }
    }

    public static String getLastFilePath() {
        synchronized (PermissionStore.LOCK) {
            return PermissionStore.lastFilePath == null ? "" : PermissionStore.lastFilePath;
        }
    }

    /** 录制文件大小；文件不存在时返回 0。 */
    public static long getLastFileSize() {
        String path;
        synchronized (PermissionStore.LOCK) {
            path = PermissionStore.lastFilePath;
        }
        if (path == null || path.length() == 0) {
            return 0L;
        }
        try {
            File f = new File(path);
            return f.exists() ? f.length() : 0L;
        } catch (Exception e) {
            return 0L;
        }
    }

    /**
     * 打开系统录屏授权弹窗，授权通过后自动开始录制。
     * 该方法立即返回，调用方需要轮询 getState()。
     */
    public static void requestPermissionAndStart(int width, int height, int bitrate,
                                                 int fps, boolean audio, String outputPath) {
        Context ctx = RecorderInitializer.appContext;
        if (ctx == null) {
            setError("插件还没有初始化（ApplicationContext 为空）");
            return;
        }
        if (Build.VERSION.SDK_INT < 21) {
            setError("系统版本过低，不支持屏幕录制（需要 Android 5.0+）");
            return;
        }
        if (outputPath == null || outputPath.trim().length() == 0) {
            setError("没有指定输出文件路径");
            return;
        }

        synchronized (PermissionStore.LOCK) {
            if ("recording".equals(PermissionStore.state)
                    || "starting".equals(PermissionStore.state)
                    || "requesting".equals(PermissionStore.state)) {
                PermissionStore.lastError = "正在录制或等待授权，请不要重复点击";
                return;
            }
        }

        if (width <= 0 || height <= 0) {
            DisplayMetrics metrics = realDisplayMetrics(ctx);
            width = metrics.widthPixels;
            height = metrics.heightPixels;
        }
        width &= ~1;   // H.264 要求偶数
        height &= ~1;
        if (width < 2) {
            width = 2;
        }
        if (height < 2) {
            height = 2;
        }
        if (bitrate <= 0) {
            // 经验值：约 4Mbps 起步，分辨率越高越高
            bitrate = Math.max(4_000_000, width * height * 4);
        }
        if (fps <= 0 || fps > 60) {
            fps = 30;
        }
        if (audio && Build.VERSION.SDK_INT < 29) {
            audio = false; // 低版本没有 AudioPlaybackCapture，只能录画面
        }

        synchronized (PermissionStore.LOCK) {
            PermissionStore.config = new PermissionStore.Config(
                    width, height, bitrate, fps, audio, outputPath);
            PermissionStore.state = "requesting";
            PermissionStore.lastError = null;
            PermissionStore.resultCode = 0;
            PermissionStore.resultData = null;
            PermissionStore.lastFilePath = outputPath;
        }

        Intent intent = new Intent(ctx, PermissionActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_NO_ANIMATION);
        try {
            ctx.startActivity(intent);
        } catch (Exception e) {
            setError("无法打开录屏授权界面：" + messageOf(e));
        }
    }

    /** 结束录制；实际文件在服务停止后才写完，调用后继续轮询 getState()。 */
    public static void stop() {
        Context ctx = RecorderInitializer.appContext;
        if (ctx == null) {
            return;
        }
        Intent intent = new Intent(ctx, ScreenRecordService.class);
        intent.setAction(ScreenRecordService.ACTION_STOP);
        try {
            ctx.startService(intent);
        } catch (Exception e) {
            Log.w(TAG, "停止录制服务失败", e);
            synchronized (PermissionStore.LOCK) {
                PermissionStore.state = "idle";
                PermissionStore.lastError = "停止录制服务失败：" + messageOf(e);
            }
        }
    }

    private static void setError(String message) {
        synchronized (PermissionStore.LOCK) {
            PermissionStore.state = "error";
            PermissionStore.lastError = message;
        }
        Log.e(TAG, message);
    }

    private static DisplayMetrics realDisplayMetrics(Context ctx) {
        DisplayMetrics metrics = new DisplayMetrics();
        try {
            DisplayManager manager = (DisplayManager) ctx.getSystemService(Context.DISPLAY_SERVICE);
            Display display = manager == null ? null : manager.getDisplay(Display.DEFAULT_DISPLAY);
            if (display != null) {
                display.getRealMetrics(metrics);
                return metrics;
            }
        } catch (Exception e) {
            Log.w(TAG, "读取真实屏幕尺寸失败，退回应用窗口尺寸", e);
        }
        return ctx.getResources().getDisplayMetrics();
    }

    private static String messageOf(Throwable e) {
        return e == null ? "未知错误" : (e.getMessage() == null ? e.toString() : e.getMessage());
    }
}
