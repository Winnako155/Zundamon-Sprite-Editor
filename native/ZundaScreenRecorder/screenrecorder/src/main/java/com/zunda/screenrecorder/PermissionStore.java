package com.zunda.screenrecorder;

import android.content.Intent;

/**
 * 插件内的共享状态：
 * - JS 通过 ScreenRecorderBridge 发起录制，参数先放在这里；
 * - PermissionActivity 拿到系统授权后，把 resultCode / resultData 交给前台服务；
 * - JS 通过 getState() 轮询进度。
 */
final class PermissionStore {
    static final Object LOCK = new Object();

    /** idle / requesting / starting / recording / failed */
    static volatile String state = "idle";
    static volatile String lastError;
    static volatile String lastFilePath = "";

    static volatile int resultCode;
    static volatile Intent resultData;
    static volatile Config config;

    static final class Config {
        final int width;
        final int height;
        final int bitrate;
        final int fps;
        final boolean audio;
        final String outputPath;

        Config(int width, int height, int bitrate, int fps, boolean audio, String outputPath) {
            this.width = width;
            this.height = height;
            this.bitrate = bitrate;
            this.fps = fps;
            this.audio = audio;
            this.outputPath = outputPath;
        }
    }

    static void reset() {
        synchronized (LOCK) {
            state = "idle";
            lastError = null;
            resultCode = 0;
            resultData = null;
            config = null;
        }
    }

    static Config takeConfig() {
        synchronized (LOCK) {
            Config c = config;
            config = null;
            return c;
        }
    }

    private PermissionStore() {
    }
}
