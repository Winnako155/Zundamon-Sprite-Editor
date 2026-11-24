package com.zunda.screenrecorder;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.media.projection.MediaProjection;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;

/**
 * 录制前台服务：
 * - Android 10+ 用 mediaProjection 类型的前台服务；
 * - Android 14+ 必须先 startForeground 再 getMediaProjection；
 * - 真正的编码在 ScreenRecorder 里做。
 */
public class ScreenRecordService extends Service {
    private static final String TAG = "ZundaScreenRecorder";

    public static final String ACTION_START = "com.zunda.screenrecorder.action.START";
    public static final String ACTION_STOP = "com.zunda.screenrecorder.action.STOP";

    private static final String CHANNEL_ID = "zunda_screen_record";
    private static final int NOTIFY_ID = 0x5A1D;

    private ScreenRecorder recorder;
    private boolean foregroundStarted = false;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent == null ? "" : intent.getAction();

        if (ACTION_STOP.equals(action)) {
            stopInternal(false);
            return START_NOT_STICKY;
        }
        if (!ACTION_START.equals(action)) {
            stopSelf();
            return START_NOT_STICKY;
        }
        if (recorder != null) {
            // 已经在录制，忽略重复启动
            return START_NOT_STICKY;
        }

        startForegroundCompat();

        PermissionStore.Config cfg = PermissionStore.takeConfig();
        int resultCode = PermissionStore.resultCode;
        Intent resultData = PermissionStore.resultData;
        if (cfg == null || resultData == null) {
            PermissionStore.lastError = "录制参数或授权结果已丢失";
            stopInternal(true);
            return START_NOT_STICKY;
        }

        MediaProjection projection;
        try {
            MediaProjectionManager manager =
                    (MediaProjectionManager) getSystemService(MEDIA_PROJECTION_SERVICE);
            projection = manager == null ? null : manager.getMediaProjection(resultCode, resultData);
        } catch (Exception e) {
            PermissionStore.lastError = "获取录屏授权失败：" + messageOf(e);
            stopInternal(true);
            return START_NOT_STICKY;
        }
        if (projection == null) {
            PermissionStore.lastError = "系统没有返回录屏授权";
            stopInternal(true);
            return START_NOT_STICKY;
        }

        final ScreenRecorder sr = new ScreenRecorder(getApplicationContext(), projection,
                cfg.outputPath, cfg.width, cfg.height, cfg.bitrate, cfg.fps, cfg.audio);
        sr.setListener(new ScreenRecorder.Listener() {
            @Override
            public void onError(String message) {
                PermissionStore.lastError = message;
                Log.e(TAG, "录制出错：" + message);
                // 不能在自己的编码线程里 join 自己，切回主线程再收尾。
                // 收尾完成后才把状态置为 failed，避免 JS 在文件还没写完时就去保存。
                new Handler(Looper.getMainLooper()).post(new Runnable() {
                    @Override
                    public void run() {
                        stopInternal(true);
                    }
                });
            }
        });
        recorder = sr;

        PermissionStore.lastFilePath = cfg.outputPath;
        PermissionStore.lastError = null;
        try {
            sr.start();
        } catch (Exception e) {
            PermissionStore.lastError = "启动录制失败：" + messageOf(e);
            stopInternal(true);
            return START_NOT_STICKY;
        }

        if (sr.isRunning()) {
            PermissionStore.state = "recording";
        } else {
            PermissionStore.lastError = sr.getError() == null ? "录制没有启动" : sr.getError();
            stopInternal(true);
        }
        return START_NOT_STICKY;
    }

    private void stopInternal(boolean failed) {
        ScreenRecorder sr = recorder;
        recorder = null;
        if (sr != null) {
            try {
                String err = sr.stopAndGetError();
                if (err != null) {
                    PermissionStore.lastError = err;
                }
            } catch (Exception e) {
                Log.w(TAG, "停止录制失败", e);
            }
        }
        PermissionStore.state = failed ? "failed" : "idle";
        try {
            if (foregroundStarted) {
                if (Build.VERSION.SDK_INT >= 24) {
                    stopForeground(Service.STOP_FOREGROUND_REMOVE);
                } else {
                    stopForeground(true);
                }
                foregroundStarted = false;
            }
        } catch (Exception ignored) {
        }
        stopSelf();
    }

    private void startForegroundCompat() {
        Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationManager manager = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
            if (manager != null) {
                NotificationChannel channel = new NotificationChannel(
                        CHANNEL_ID, "屏幕录制", NotificationManager.IMPORTANCE_LOW);
                channel.setShowBadge(false);
                manager.createNotificationChannel(channel);
            }
            builder = new Notification.Builder(this, CHANNEL_ID);
        } else {
            builder = new Notification.Builder(this);
        }
        Notification notification = builder
                .setContentTitle("俊达萌立绘编辑器")
                .setContentText("正在录制屏幕，播放结束后自动停止")
                .setSmallIcon(R.drawable.ic_record)
                .setOngoing(true)
                .build();
        if (Build.VERSION.SDK_INT >= 29) {
            startForeground(NOTIFY_ID, notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION);
        } else {
            startForeground(NOTIFY_ID, notification);
        }
        foregroundStarted = true;
    }

    @Override
    public void onDestroy() {
        ScreenRecorder sr = recorder;
        recorder = null;
        if (sr != null) {
            try {
                sr.stopAndGetError();
            } catch (Exception ignored) {
            }
        }
        if (!"failed".equals(PermissionStore.state)) {
            PermissionStore.state = "idle";
        }
        super.onDestroy();
    }

    private static String messageOf(Throwable e) {
        return e == null ? "未知错误" : (e.getMessage() == null ? e.toString() : e.getMessage());
    }
}
