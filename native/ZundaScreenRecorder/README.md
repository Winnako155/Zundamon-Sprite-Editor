# ZundaScreenRecorder（俊达萌立绘编辑器 · 原生整屏录制插件）

Android 原生插件：用 `MediaProjection` 录制整屏画面，用 `AudioPlaybackCapture`（Android 10+）
抓取播放声音，`MediaCodec + MediaMuxer` 直接输出 MP4。

> **重要前提（必读）**
>
> 当前项目是 **HBuilderX 5+ App**（`manifest.json` 里只有 `plus`，没有 `pages.json`）。
> DCloud 官方明确：**5+ App / Wap2App 不支持 uni-app 原生插件，也不支持 HBuilderX 的
> “自定义基座 + 云打包”携带原生插件**；原生代码只能通过 **离线打包（Android Studio + 5+ SDK）**
> 进入 APK。
>
> 所以本插件按“离线打包用的 AAR”提供。JS 侧做了特性检测：标准基座 / 云打包里没有这个类时，
> 会自动回退到原来的 WebView MediaRecorder 导出，现有功能不会失效。
>
> 如果你一定要“HBuilderX 自定义基座 / 云打包”带原生插件，需要先把项目迁移成 uni-app，
> 再把本插件改成 uni 原生插件（`UniModule` + `dcloud_uniplugins.json`），这是另一条迁移路线。

---

## 1. 目录结构

```
native/ZundaScreenRecorder/
├── settings.gradle
├── build.gradle                     # AGP 8.5.2
├── gradle.properties
├── README.md                        # 本文件
└── screenrecorder/
    ├── build.gradle                 # compileSdk 34 / minSdk 21 / targetSdk 34
    └── src/main/
        ├── AndroidManifest.xml      # 权限、前台服务、透明授权页、初始化 Provider
        ├── res/drawable/ic_record.xml
        └── java/com/zunda/screenrecorder/
            ├── ScreenRecorderBridge.java   # JS 调用的静态入口
            ├── PermissionActivity.java     # 系统录屏授权弹窗中转页
            ├── ScreenRecordService.java    # mediaProjection 前台服务
            ├── ScreenRecorder.java         # H.264 + AAC + MediaMuxer 核心
            ├── PermissionStore.java        # 插件内共享状态
            └── RecorderInitializer.java    # ContentProvider，拿 ApplicationContext
```

产物：`screenrecorder/build/outputs/aar/screenrecorder-release.aar`

---

## 2. 插件 Manifest（AAR 自带的，会被宿主自动合并）

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<application>
    <service
        android:name="com.zunda.screenrecorder.ScreenRecordService"
        android:exported="false"
        android:foregroundServiceType="mediaProjection" />

    <activity
        android:name="com.zunda.screenrecorder.PermissionActivity"
        android:excludeFromRecents="true"
        android:exported="false"
        android:theme="@android:style/Theme.Translucent.NoTitleBar" />

    <provider
        android:name="com.zunda.screenrecorder.RecorderInitializer"
        android:authorities="${applicationId}.zunda.screenrecorder.init"
        android:exported="false" />
</application>
```

如果宿主的 AGP 版本不合并 AAR Manifest，就把上面这段手动抄进宿主 `AndroidManifest.xml`
（把 `${applicationId}` 换成实际包名）。

建议宿主 `<application>` 再加上：

```xml
<application android:allowAudioPlaybackCapture="true" ... >
```

---

## 3. Gradle 依赖

插件本身 **不依赖 AndroidX / Kotlin / 第三方库**，只用到 Android Framework，
这样不会和 5+ SDK 离线工程里的依赖版本打架。

`screenrecorder/build.gradle` 的关键配置：

```gradle
android {
    namespace 'com.zunda.screenrecorder'
    compileSdk 34            // MediaProjectionConfig 需要 34
    defaultConfig {
        minSdk 21
        targetSdk 34         // Android 14 权限/前台服务要求
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}
```

宿主的 5+ 离线工程只需要：

```gradle
dependencies {
    implementation fileTree(dir: 'libs', include: ['*.aar', '*.jar'])
}
```

> 若宿主 `targetSdk = 34`，按 DCloud 要求加：
> ```gradle
> packagingOptions { jniLibs { useLegacyPackaging true } }
> ```

---

## 4. 构建 AAR

1. 用 Android Studio 打开 `native/ZundaScreenRecorder` 目录（不是整个 HBuilderX 项目）。
2. 等待 Gradle Sync 完成（AGP 8.5.2，JDK 17）。
3. 执行：
   - Android Studio 右侧 Gradle → `screenrecorder` → `Tasks` → `build` → `assembleRelease`
   - 或命令行：`gradlew :screenrecorder:assembleRelease`
4. 产物：`screenrecorder/build/outputs/aar/screenrecorder-release.aar`

本仓库没有提交 `gradle-wrapper.jar`；Android Studio 会用自己的 Gradle，命令行构建前先
`gradle wrapper --gradle-version 8.7` 生成 wrapper。

---

## 5. 5+ App 离线打包（唯一可携带本插件的方式）

### 5.1 导出 App 资源

HBuilderX → 发行 → **原生App-本地打包** → **生成本地打包App资源**。
得到 `apps/<appid>/www`（appid 与 `manifest.json` 的 `id` 一致，本项目和文件夹名一致即可）。

### 5.2 准备 Android 工程

1. 下载 DCloud Android 离线 SDK（5+ App 用的那套）。
2. Android Studio 新建 Empty Activity（Java，Minimum SDK 21），包名建议与线上一致。
   **不要用 Kotlin。**
3. 把 SDK `libs` 下的基础库拷到工程 `app/libs/`：
   `lib.5plus.base-release.aar`、`android-gif-drawable-release@1.2.23.aar`、
   `uniapp-v8-release.aar`、`oaid_sdk_1.0.25.aar`、`install-apk-release.aar`、
   `breakpad-build-release.aar`（版本以你下载的 SDK 为准）。
4. 把本插件产物 `screenrecorder-release.aar` 也放进 `app/libs/`。
5. 把 SDK `assets/data` 拷到 `app/src/main/assets/data`。
6. 把 5.1 导出的 `www` 拷到 `app/src/main/assets/apps/<appid>/www`。
7. 按 SDK 里的 `dcloud_control.xml` 模板创建文件，把 `appid` 改成你的应用 id，
   并保证与 `assets/apps/<appid>` 文件夹名一致。

### 5.3 宿主 Manifest

- 删除新建工程默认的 `MainActivity`，换成 DCloud 的：
  `io.dcloud.PandoraEntry`（LAUNCHER）和 `io.dcloud.PandoraEntryActivity`。
- `<application>` 加 Appkey：
  ```xml
  <meta-data android:name="dcloud_appkey" android:value="你的AppKey" />
  ```
- 3.3.7 以下 SDK 还需要 `io.dcloud.common.util.DCloud_FileProvider`。
- 本插件的权限 / Service / Activity / Provider 会由 AAR Manifest 自动合并；
  如果没合并，手动抄第 2 节。

### 5.4 构建与安装

1. `versionCode/versionName` 与 `manifest.json` 对齐。
2. 用自己的 keystore 签名，`applicationId` 与 DCloud 后台的包名一致。
3. `assembleRelease`（或 `assembleDebug` 先真机验证）。
4. 安装 APK，打开应用 → 朗读对口型 → 导出 → 蓝底 MP4。

> 每次改 JS/CSS/HTML，都要重新“生成本地打包App资源”，覆盖
> `assets/apps/<appid>/www`，再重新构建 APK。标准基座里跑的是没有插件的版本，
> 只能验证“回退旧导出”是否正常。

### 5.5 关于“云打包 / 自定义基座”

- **5+ App：不支持。** HBuilderX 的云打包和自定义基座不会把 `screenrecorder-release.aar`
  或任何原生插件打进 APK；标准基座也加载不到 `com.zunda.screenrecorder.*`。
- **uni-app：支持。** 需要把项目迁成 uni-app，把本插件改成 `UniModule`
  （`dcloud_uniplugins.json` 注册），然后“制作自定义基座”调试、正式版云打包。
  这是项目架构迁移，不在本插件范围内。

---

## 6. 运行行为与已知限制

- 授权弹窗：`MediaProjectionManager.createScreenCaptureIntent()` 由系统弹出，用户必须确认。
- Android 14+ 使用 `MediaProjectionConfig.createConfigForUserChoice()`：
  系统会让用户选“单个应用 / 整个屏幕”，**应用不能强制选单个应用**。
- Android 14+ 每次录制都要重新授权；令牌一次性有效。
- 音频：`AudioPlaybackCapture` 需要 Android 10+、`RECORD_AUDIO`、前台服务。
  - 只能捕获“允许被捕获”的音频（usage 为 media/game/unknown，且对方没有禁止捕获）。
  - 受 DRM 保护的内容无法捕获。
  - WebView 的播放进程/UID 在不同机型上可能不同；**能否抓到本应用 WebView 的声音必须在真机确认**。
    如果抓不到，视频仍然正常，只是没有声音。
- 输出：屏幕分辨率、屏幕比例（状态栏/导航栏是否入镜取决于用户选“单个应用”还是“整个屏幕”）。
- 文件先写到应用私有 `_doc`，停止后由 JS 调 `plus.gallery.save` 存入相册。

---

## 7. 本环境无法验证、需要你在 Android Studio / 真机确认的部分

1. **编译**：当前环境没有 Android SDK / Gradle / JDK，Java 代码没有编译过。
   请在 Android Studio 里先 `assembleDebug`，按报错修（通常是 SDK 版本、AGP 版本）。
2. **Manifest 合并**：确认最终 APK 的 Manifest 里有
   `FOREGROUND_SERVICE_MEDIA_PROJECTION`、`foregroundServiceType="mediaProjection"`。
3. **授权与前台服务**：Android 10 / 12 / 13 / 14 各测一台，确认
   - 弹窗正常；
   - 通知出现；
   - 录制期间切后台不被杀；
   - Android 14 选“单个应用”后录到的是本应用。
4. **内部音频**：确认 MP4 有声音；如果没有，记录机型/系统/WebView 版本。
5. **相册保存**：`plus.gallery.save` 对 `_doc` 下的 MP4 是否成功；失败时文件仍在应用目录。
6. **画质与帧率**：`object-fit: contain` 在旧 WebView 上是否按比例显示；
   1080 宽预览画布在低端机上是否掉帧。
7. **回退路径**：标准基座 / 云打包 APK 里导出 MP4，确认仍然走旧的 MediaRecorder 流程。
