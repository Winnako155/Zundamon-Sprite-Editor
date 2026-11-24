package com.zunda.screenrecorder;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.projection.MediaProjectionConfig;
import android.media.projection.MediaProjectionManager;
import android.os.Build;
import android.os.Bundle;

/**
 * 透明的授权中转 Activity：
 * 1. 需要内部音频时先申请 RECORD_AUDIO（用户拒绝也继续，只是没有声音）；
 * 2. 打开系统的 MediaProjection 授权弹窗；
 * 3. 拿到授权结果后启动 ScreenRecordService，然后立刻结束自己。
 *
 * Android 14 起使用 MediaProjectionConfig.createConfigForUserChoice()，
 * 系统弹窗里会出现“单个应用 / 整个屏幕”的选择，由用户决定，应用不能强制。
 */
public class PermissionActivity extends Activity {
    private static final int REQ_PROJECTION = 0x2A01;
    private static final int REQ_AUDIO = 0x2A02;

    private boolean projectionRequested = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        PermissionStore.Config cfg = PermissionStore.config;
        if (cfg == null) {
            PermissionStore.state = "error";
            PermissionStore.lastError = "录制参数已丢失，请重新导出";
            finish();
            return;
        }

        if (cfg.audio && Build.VERSION.SDK_INT >= 23
                && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, REQ_AUDIO);
            return;
        }
        requestProjection();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (requestCode == REQ_AUDIO) {
            boolean granted = grantResults.length > 0
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            if (!granted) {
                // 没有录音权限就退化成无声录制，不阻断整个导出
                PermissionStore.Config old = PermissionStore.config;
                if (old != null) {
                    PermissionStore.config = new PermissionStore.Config(
                            old.width, old.height, old.bitrate, old.fps, false, old.outputPath);
                }
            }
            requestProjection();
            return;
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    private void requestProjection() {
        if (projectionRequested) {
            return;
        }
        projectionRequested = true;
        try {
            MediaProjectionManager manager =
                    (MediaProjectionManager) getSystemService(MEDIA_PROJECTION_SERVICE);
            if (manager == null) {
                throw new IllegalStateException("系统不支持 MediaProjection");
            }
            Intent intent;
            if (Build.VERSION.SDK_INT >= 34) {
                intent = manager.createScreenCaptureIntent(
                        MediaProjectionConfig.createConfigForUserChoice());
            } else {
                intent = manager.createScreenCaptureIntent();
            }
            startActivityForResult(intent, REQ_PROJECTION);
        } catch (Exception e) {
            PermissionStore.state = "error";
            PermissionStore.lastError = "无法打开录屏授权弹窗：" + messageOf(e);
            finish();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode != REQ_PROJECTION) {
            super.onActivityResult(requestCode, resultCode, data);
            return;
        }
        if (resultCode == RESULT_OK && data != null) {
            PermissionStore.resultCode = resultCode;
            PermissionStore.resultData = data;
            PermissionStore.state = "starting";

            Intent service = new Intent(this, ScreenRecordService.class);
            service.setAction(ScreenRecordService.ACTION_START);
            try {
                if (Build.VERSION.SDK_INT >= 26) {
                    startForegroundService(service);
                } else {
                    startService(service);
                }
            } catch (Exception e) {
                PermissionStore.state = "error";
                PermissionStore.lastError = "启动录制服务失败：" + messageOf(e);
            }
        } else {
            PermissionStore.state = "error";
            PermissionStore.lastError = "用户取消了屏幕录制授权";
        }
        finish();
    }

    private static String messageOf(Throwable e) {
        return e == null ? "未知错误" : (e.getMessage() == null ? e.toString() : e.getMessage());
    }
}
