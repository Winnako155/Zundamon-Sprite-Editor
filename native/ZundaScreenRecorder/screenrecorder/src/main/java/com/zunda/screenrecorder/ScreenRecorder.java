package com.zunda.screenrecorder;

import android.content.Context;
import android.hardware.display.DisplayManager;
import android.hardware.display.VirtualDisplay;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioPlaybackCaptureConfiguration;
import android.media.AudioRecord;
import android.media.MediaCodec;
import android.media.MediaCodecInfo;
import android.media.MediaFormat;
import android.media.MediaMuxer;
import android.media.projection.MediaProjection;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.Surface;

import java.io.File;
import java.nio.ByteBuffer;

/**
 * MediaProjection 屏幕录制核心：
 * - 视频：MediaCodec(H.264) + VirtualDisplay，系统编码；
 * - 音频：AudioPlaybackCapture(API 29+) + AudioRecord + MediaCodec(AAC)；
 * - 封装：MediaMuxer 输出 MP4。
 *
 * 说明：本类只做“拿到 MediaProjection 之后”的事情，授权弹窗与前台服务在
 * PermissionActivity / ScreenRecordService 里处理。
 */
public class ScreenRecorder {
    private static final String TAG = "ZundaScreenRecorder";
    private static final String MIME_VIDEO = MediaFormat.MIMETYPE_VIDEO_AVC;
    private static final String MIME_AUDIO = MediaFormat.MIMETYPE_AUDIO_AAC;
    private static final int SAMPLE_RATE = 44100;
    private static final int CHANNELS = 2;
    private static final int AUDIO_BITRATE = 128000;

    public interface Listener {
        void onError(String message);
    }

    private final Context context;
    private final MediaProjection projection;
    private final String outputPath;
    private final int width;
    private final int height;
    private final int bitrate;
    private final int fps;
    private final boolean audioRequested;

    private Listener listener;
    private MediaCodec videoEncoder;
    private Surface inputSurface;
    private VirtualDisplay virtualDisplay;
    private MediaCodec audioEncoder;
    private AudioRecord audioRecord;
    private MediaMuxer muxer;
    private MediaProjection.Callback projectionCallback;

    private Thread videoThread;
    private Thread audioThread;
    private final Object muxerLock = new Object();
    private boolean muxerStarted;
    private int videoTrack = -1;
    private int audioTrack = -1;
    private volatile boolean running;
    private volatile boolean audioEnabled;
    private volatile String error;
    private long audioPtsUs;

    public ScreenRecorder(Context context, MediaProjection projection, String outputPath,
                          int width, int height, int bitrate, int fps, boolean audio) {
        this.context = context;
        this.projection = projection;
        this.outputPath = outputPath;
        // H.264 要求宽高为偶数，桥接层已经处理过一次，这里再兜底
        this.width = Math.max(2, width & ~1);
        this.height = Math.max(2, height & ~1);
        this.bitrate = bitrate;
        this.fps = fps;
        this.audioRequested = audio;
    }

    public void setListener(Listener listener) {
        this.listener = listener;
    }

    public String getError() {
        return error;
    }

    public boolean isRunning() {
        return running;
    }

    public void start() {
        if (outputPath == null || outputPath.length() == 0) {
            fail("没有指定输出文件路径");
            return;
        }
        try {
            prepareVideo();
            prepareMuxer();
            if (audioRequested) {
                if (Build.VERSION.SDK_INT < 29) {
                    error = "Android 10 以下不支持内部音频捕获，将只录制画面";
                    Log.w(TAG, error);
                } else {
                    try {
                        prepareAudio();
                        audioEnabled = true;
                    } catch (Exception e) {
                        audioEnabled = false;
                        error = "音频捕获不可用：" + messageOf(e);
                        Log.w(TAG, error, e);
                    }
                }
            }

            // Android 14 起，createVirtualDisplay 之前必须先注册回调，否则会抛异常
            projectionCallback = new MediaProjection.Callback() {
                @Override
                public void onStop() {
                    if (running) {
                        fail("录屏已被系统或用户停止");
                    }
                }
            };
            projection.registerCallback(projectionCallback, new Handler(Looper.getMainLooper()));

            running = true;
            videoThread = new Thread(new Runnable() {
                @Override
                public void run() {
                    videoLoop();
                }
            }, "ZundaVideoEncoder");
            videoThread.start();

            if (audioEnabled) {
                audioThread = new Thread(new Runnable() {
                    @Override
                    public void run() {
                        audioLoop();
                    }
                }, "ZundaAudioEncoder");
                audioThread.start();
            }

            createVirtualDisplay();
        } catch (Exception e) {
            fail("启动录制失败：" + messageOf(e));
        }
    }

    private void prepareVideo() throws Exception {
        MediaFormat format = MediaFormat.createVideoFormat(MIME_VIDEO, width, height);
        format.setInteger(MediaFormat.KEY_COLOR_FORMAT,
                MediaCodecInfo.CodecCapabilities.COLOR_FormatSurface);
        format.setInteger(MediaFormat.KEY_BIT_RATE, bitrate);
        format.setInteger(MediaFormat.KEY_FRAME_RATE, fps);
        format.setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 1);

        videoEncoder = MediaCodec.createEncoderByType(MIME_VIDEO);
        videoEncoder.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE);
        inputSurface = videoEncoder.createInputSurface();
        videoEncoder.start();
    }

    private void prepareMuxer() throws Exception {
        File file = new File(outputPath);
        File parent = file.getParentFile();
        if (parent != null && !parent.exists() && !parent.mkdirs()) {
            throw new IllegalStateException("无法创建输出目录：" + parent);
        }
        muxer = new MediaMuxer(outputPath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4);
    }

    private void prepareAudio() throws Exception {
        AudioPlaybackCaptureConfiguration config =
                new AudioPlaybackCaptureConfiguration.Builder(projection)
                        .addMatchingUsage(AudioAttributes.USAGE_MEDIA)
                        .addMatchingUsage(AudioAttributes.USAGE_GAME)
                        .addMatchingUsage(AudioAttributes.USAGE_UNKNOWN)
                        .build();

        AudioFormat audioFormat = new AudioFormat.Builder()
                .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                .setSampleRate(SAMPLE_RATE)
                .setChannelMask(AudioFormat.CHANNEL_IN_STEREO)
                .build();

        int min = AudioRecord.getMinBufferSize(SAMPLE_RATE,
                AudioFormat.CHANNEL_IN_STEREO, AudioFormat.ENCODING_PCM_16BIT);
        if (min <= 0) {
            min = 16384;
        }
        int bufferSize = Math.max(min * 2, 32768);

        audioRecord = new AudioRecord.Builder()
                .setAudioFormat(audioFormat)
                .setBufferSizeInBytes(bufferSize)
                .setAudioPlaybackCaptureConfig(config)
                .build();
        if (audioRecord.getState() != AudioRecord.STATE_INITIALIZED) {
            throw new IllegalStateException("AudioRecord 初始化失败");
        }
        audioRecord.startRecording();

        MediaFormat format = MediaFormat.createAudioFormat(MIME_AUDIO, SAMPLE_RATE, CHANNELS);
        format.setInteger(MediaFormat.KEY_AAC_PROFILE, MediaCodecInfo.CodecProfileLevel.AACObjectLC);
        format.setInteger(MediaFormat.KEY_BIT_RATE, AUDIO_BITRATE);
        format.setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, 16384);

        audioEncoder = MediaCodec.createEncoderByType(MIME_AUDIO);
        audioEncoder.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE);
        audioEncoder.start();
    }

    private void createVirtualDisplay() {
        int dpi = context.getResources().getDisplayMetrics().densityDpi;
        virtualDisplay = projection.createVirtualDisplay(
                "ZundaScreen",
                width,
                height,
                dpi,
                DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
                inputSurface,
                null,
                null);
    }

    private void videoLoop() {
        MediaCodec.BufferInfo info = new MediaCodec.BufferInfo();
        boolean eos = false;
        while (running || !eos) {
            int index;
            try {
                index = videoEncoder.dequeueOutputBuffer(info, 10000);
            } catch (Exception e) {
                fail("视频编码器异常：" + messageOf(e));
                return;
            }
            if (index == MediaCodec.INFO_TRY_AGAIN_LATER) {
                continue;
            }
            if (index == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
                synchronized (muxerLock) {
                    if (videoTrack < 0) {
                        try {
                            videoTrack = muxer.addTrack(videoEncoder.getOutputFormat());
                        } catch (Exception e) {
                            fail("添加视频轨失败：" + messageOf(e));
                            return;
                        }
                        maybeStartMuxerLocked();
                    }
                }
                continue;
            }
            if (index < 0) {
                continue;
            }

            try {
                ByteBuffer buffer = videoEncoder.getOutputBuffer(index);
                if (buffer != null && info.size > 0
                        && (info.flags & MediaCodec.BUFFER_FLAG_CODEC_CONFIG) == 0) {
                    synchronized (muxerLock) {
                        if (muxerStarted && videoTrack >= 0) {
                            buffer.position(info.offset);
                            buffer.limit(info.offset + info.size);
                            muxer.writeSampleData(videoTrack, buffer, info);
                        }
                    }
                }
            } catch (Exception e) {
                fail("写入视频数据失败：" + messageOf(e));
                return;
            } finally {
                try {
                    videoEncoder.releaseOutputBuffer(index, false);
                } catch (Exception ignored) {
                }
            }

            if ((info.flags & MediaCodec.BUFFER_FLAG_END_OF_STREAM) != 0) {
                eos = true;
            }
        }
    }

    private void audioLoop() {
        byte[] pcm = new byte[4096];
        MediaCodec.BufferInfo info = new MediaCodec.BufferInfo();
        boolean eosQueued = false;
        boolean eos = false;

        while (running || !eos) {
            if (running) {
                int read;
                try {
                    read = audioRecord.read(pcm, 0, pcm.length);
                } catch (Exception e) {
                    fail("读取音频失败：" + messageOf(e));
                    return;
                }
                if (read > 0) {
                    feedAudio(pcm, read);
                }
            } else if (!eosQueued) {
                eosQueued = queueAudioEndOfStream();
                if (!eosQueued) {
                    sleepQuietly(10);
                }
            }

            while (true) {
                int index;
                try {
                    index = audioEncoder.dequeueOutputBuffer(info, 0);
                } catch (Exception e) {
                    fail("音频编码器异常：" + messageOf(e));
                    return;
                }
                if (index == MediaCodec.INFO_TRY_AGAIN_LATER) {
                    break;
                }
                if (index == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
                    synchronized (muxerLock) {
                        if (audioTrack < 0) {
                            try {
                                audioTrack = muxer.addTrack(audioEncoder.getOutputFormat());
                            } catch (Exception e) {
                                fail("添加音频轨失败：" + messageOf(e));
                                return;
                            }
                            maybeStartMuxerLocked();
                        }
                    }
                    continue;
                }
                if (index < 0) {
                    break;
                }

                try {
                    ByteBuffer buffer = audioEncoder.getOutputBuffer(index);
                    if (buffer != null && info.size > 0
                            && (info.flags & MediaCodec.BUFFER_FLAG_CODEC_CONFIG) == 0) {
                        synchronized (muxerLock) {
                            if (muxerStarted && audioTrack >= 0) {
                                buffer.position(info.offset);
                                buffer.limit(info.offset + info.size);
                                muxer.writeSampleData(audioTrack, buffer, info);
                            }
                        }
                    }
                } catch (Exception e) {
                    fail("写入音频数据失败：" + messageOf(e));
                    return;
                } finally {
                    try {
                        audioEncoder.releaseOutputBuffer(index, false);
                    } catch (Exception ignored) {
                    }
                }

                if ((info.flags & MediaCodec.BUFFER_FLAG_END_OF_STREAM) != 0) {
                    eos = true;
                }
            }

            if (!running && eosQueued && !eos) {
                sleepQuietly(5);
            }
        }
    }

    private void feedAudio(byte[] pcm, int length) {
        try {
            int index = audioEncoder.dequeueInputBuffer(10000);
            if (index < 0) {
                return;
            }
            ByteBuffer input = audioEncoder.getInputBuffer(index);
            if (input == null) {
                return;
            }
            input.clear();
            input.put(pcm, 0, length);
            audioEncoder.queueInputBuffer(index, 0, length, audioPtsUs, 0);
            audioPtsUs += (long) length * 1000000L / (SAMPLE_RATE * CHANNELS * 2L);
        } catch (Exception e) {
            fail("送入音频数据失败：" + messageOf(e));
        }
    }

    /** @return 是否成功把 EOS 送进编码器。 */
    private boolean queueAudioEndOfStream() {
        try {
            int index = audioEncoder.dequeueInputBuffer(100000);
            if (index < 0) {
                return false;
            }
            audioEncoder.queueInputBuffer(index, 0, 0, audioPtsUs,
                    MediaCodec.BUFFER_FLAG_END_OF_STREAM);
            return true;
        } catch (Exception e) {
            fail("结束音频编码失败：" + messageOf(e));
            return true; // 已经出错，别再重试
        }
    }

    private void maybeStartMuxerLocked() {
        if (muxerStarted) {
            return;
        }
        if (videoTrack >= 0 && (!audioEnabled || audioTrack >= 0)) {
            try {
                muxer.start();
                muxerStarted = true;
            } catch (Exception e) {
                fail("启动 MP4 封装失败：" + messageOf(e));
            }
        }
    }

    /** 停止录制并返回错误信息（正常时为 null）。 */
    public String stopAndGetError() {
        running = false;
        try {
            if (audioRecord != null) {
                audioRecord.stop();
            }
        } catch (Exception ignored) {
        }
        try {
            if (videoEncoder != null) {
                videoEncoder.signalEndOfStream();
            }
        } catch (Exception ignored) {
        }

        joinQuietly(videoThread, 5000);
        joinQuietly(audioThread, 5000);
        release();
        return error;
    }

    private void release() {
        if (virtualDisplay != null) {
            try {
                virtualDisplay.release();
            } catch (Exception ignored) {
            }
            virtualDisplay = null;
        }
        if (inputSurface != null) {
            try {
                inputSurface.release();
            } catch (Exception ignored) {
            }
            inputSurface = null;
        }
        if (videoEncoder != null) {
            try {
                videoEncoder.stop();
            } catch (Exception ignored) {
            }
            try {
                videoEncoder.release();
            } catch (Exception ignored) {
            }
            videoEncoder = null;
        }
        if (audioEncoder != null) {
            try {
                audioEncoder.stop();
            } catch (Exception ignored) {
            }
            try {
                audioEncoder.release();
            } catch (Exception ignored) {
            }
            audioEncoder = null;
        }
        if (audioRecord != null) {
            try {
                audioRecord.stop();
            } catch (Exception ignored) {
            }
            try {
                audioRecord.release();
            } catch (Exception ignored) {
            }
            audioRecord = null;
        }
        synchronized (muxerLock) {
            if (muxer != null) {
                if (muxerStarted) {
                    try {
                        muxer.stop();
                    } catch (Exception ignored) {
                    }
                }
                try {
                    muxer.release();
                } catch (Exception ignored) {
                }
                muxer = null;
                muxerStarted = false;
            }
        }
        if (projectionCallback != null) {
            try {
                projection.unregisterCallback(projectionCallback);
            } catch (Exception ignored) {
            }
            projectionCallback = null;
        }
        try {
            projection.stop();
        } catch (Exception ignored) {
        }
    }

    private void fail(String message) {
        if (error == null) {
            error = message;
        }
        Log.e(TAG, message);
        running = false;
        Listener l = listener;
        if (l != null) {
            l.onError(message);
        }
    }

    private static void joinQuietly(Thread thread, long timeoutMs) {
        if (thread == null) {
            return;
        }
        try {
            thread.join(timeoutMs);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private static void sleepQuietly(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private static String messageOf(Throwable e) {
        return e == null ? "未知错误" : (e.getMessage() == null ? e.toString() : e.getMessage());
    }
}
