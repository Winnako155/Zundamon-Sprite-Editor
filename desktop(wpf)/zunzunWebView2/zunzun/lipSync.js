// ============================================================
// 朗读对口型模式（lipSync.js）
// 思路：
// 1. 用 WebAudio 解码用户上传的朗读音频
// 2. 每 20ms 统计一次能量(RMS)和音高(自相关)，合成 0~1 的“张嘴程度”包络
// 3. 播放时按 audio.currentTime 查包络，从当前立绘的嘴部图层里挑开口最接近的素材，画到预览画布
// 4. 导出：逐帧绘制并编码 GIF89a（透明背景）；用 MediaRecorder 实时录蓝底视频（优先 MP4）
//
// 说明：本文件只负责“朗读对口型”模式，其它模式（完整立绘 / 表情包）的逻辑仍在 scrpit.js，
//       这里尽量复用 rowList 里已经选中的图层数据，不修改原有模式的任何行为。
// ============================================================

// 模式内部状态（全部集中在这里，方便调试）
var lipState = {
    audioBuffer: null,      // 解码后的音频数据（AudioBuffer）
    envelope: null,         // 口型包络，每帧 0~1，采样率 envRate
    envRate: 50,            // 包络采样率：每秒 50 帧（20ms 一帧）
    duration: 0,            // 音频总时长（秒）
    file: null,             // 用户选择的音频文件
    objectUrl: "",          // 音频 Blob URL
    loadReq: 0,             // 音频加载请求代号，避免连续选文件时旧结果覆盖新结果
    sensitivity: 1,         // 口型灵敏度（滑条）
    smoothLevel: 0.4,       // 口型平滑程度（滑条）
    smooth: 0,              // 当前平滑后的张嘴程度
    bobEnabled: true,       // 动画：说话时人物整体上下浮动
    bobAmp: 50,             // 浮动幅度（0~100，100 约为画布高度的 3%）
    bobFreq: 3,             // 浮动频率（Hz）
    transitionOn: false,    // 片段衔接：交接处“挤压—回弹”过渡（默认关闭）
    transitionSqueezeDur: 0.15, // 挤压时长（秒）：交接前逐渐压扁用多久
    transitionReboundDur: 0.40, // 回弹时长（秒）：交接后恢复、过冲并衰减用多久
    transitionSquash: 50,   // 挤压幅度（0~100，100 约压扁画布高度的 22%）
    transitionRebound: 50,  // 回弹强度（0~100，越大过冲越明显、稳定越慢）
    mouthList: null,        // 当前参与驱动的嘴部 rowList
    mouthFrames: [],        // 参与口型的嘴部素材，按高度（近似开口大小）从小到大排序
    spriteName: "",         // 上一次刷新时对应的立绘名，用于识别“播放中换立绘”
    regions: [],            // 片段样式：[{id,start,end,actor,ops}]，按添加顺序保存
    regionSeed: 0,          // 区间 id 自增
    regionHint: "",         // 上一次写入的“当前区间”提示，避免每帧重复改 DOM
    selectedRegionId: null, // 当前编辑目标的片段（列表项联动高亮）
    uiRegionId: null,       // 素材面板当前回填的是哪个片段的样式（避免重复回填）
    selectionSig: "",       // 上一次的图层勾选签名，用来判断用户是否改了立绘样式
    ops: [],                // 绘制指令：静态图层 + 一个“嘴部槽位”，保留原有图层顺序
    staticReady: false,     // 静态图层图片是否已加载完
    staticVersion: 0,       // 静态图层刷新代号
    changeTimer: 0,         // 立绘变化后的防抖定时器
    playing: false,         // 是否正在播放
    rafId: 0,               // 预览动画帧 id
    lastTick: 0,            // 上一帧时间（用于平滑）
    lastFrameAt: 0,         // 动画循环最近一次实际绘制的时间（判断 rAF 是否被节流）
    exporting: false,       // 是否正在导出
    recording: false,       // 是否正在录制视频
    recorder: null,         // MediaRecorder 实例
    exportCanvas: null,     // 导出用的离屏画布
    exportCtx: null,
    exportW: 0,
    exportH: 0,
    exportBg: "#0000FF",    // 蓝底颜色
    exportFps: 60,          // 导出帧率（GIF / MP4 共用，来自导出区设置，默认 60）
    exportLastDrawAt: 0,    // 录制时上一帧导出画面绘制的时间，用于按帧率节流
    mediaDest: null,        // 音频 MediaStreamDestination（录视频时抓音轨）
    mediaSource: null,      // <audio> 的 MediaElementAudioSourceNode
    audioCtx: null,         // 共用的 AudioContext
    cancelRecording: false, // 录制中途离开模式时用于取消
    recordResolve: null     // 录制流程的等待回调
};

// 图片缓存：素材路径 -> Image，避免每帧重复 new Image
var lipImgCache = {};

// 手动录屏（全屏演示）状态：倒计时 → 从头播放 → 结束卡 → 自动退出
var lipManual = {
    active: false,      // 是否处于全屏演示中
    ended: false,       // 播放是否已经结束（避免 ended 事件重复收尾）
    stage: null,        // 全屏遮罩
    canvas: null,       // 只画立绘的画布（背景由遮罩显示）
    ctx: null,
    countdownEl: null,  // 倒计时数字
    endCardEl: null,    // 左上角结束卡
    countdownTimer: 0,  // 倒计时 interval
    endTimer: 0,        // 结束卡停留计时
    wait: 0,            // 开始等待秒数
    bg: "#0000FF"       // 全屏底色
};

// ---------- 一些通用小工具 ----------
function lipClamp(v, min, max) {
    return v < min ? min : (v > max ? max : v);
}
function lipYield() {
    // 让出主线程，让进度文字有机会刷新
    return new Promise(function (resolve) { setTimeout(resolve, 0); });
}
function lipGetAudioEl() {
    return document.getElementById("lipAudio");
}
function lipGetAudioCtx() {
    if (!lipState.audioCtx) {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        lipState.audioCtx = new Ctx();
    }
    return lipState.audioCtx;
}
function lipSetStatus(text) {
    var el = document.getElementById("text_lipStatus");
    if (el) { el.innerHTML = text; }
}
function lipSetExportStatus(text) {
    var el = document.getElementById("text_lipExportStatus");
    if (el) { el.innerHTML = text; }
}
// 保存进度条：导出 MP4/GIF 期间显示，完成或失败后隐藏
function lipShowSaveProgress() {
    var box = document.getElementById("lipSaveProgress");
    if (!box) { return; }
    box.style.display = "flex";
    lipSetSaveProgress(0);
    // 内容区高度有限，滚动到底部确保进度条可见
    if (box.parentNode && box.parentNode.scrollHeight > box.parentNode.clientHeight) {
        box.parentNode.scrollTop = box.parentNode.scrollHeight;
    }
}
function lipSetSaveProgress(pct) {
    var bar = document.getElementById("lipSaveProgressBar");
    var label = document.getElementById("text_lipSaveProgressPct");
    var v = Number(pct);
    if (isNaN(v)) { v = 0; }
    v = Math.max(0, Math.min(100, v));
    if (bar) { bar.style.width = v + "%"; }
    if (label) { label.innerText = Math.round(v) + "%"; }
}
function lipHideSaveProgress() {
    var box = document.getElementById("lipSaveProgress");
    if (box) { box.style.display = "none"; }
    lipSetSaveProgress(0);
}
function lipSafeFileName() {
    // 立绘名字里可能有空格/符号，简单清理一下再拼文件名
    var name = nowActor || "zundamon";
    return String(name).replace(/[\\/:*?"<>|\s]/g, "_");
}

// ============================================================
// 一、模式进入 / 离开
// ============================================================

// 进入朗读模式：嘴巴列表改为可多选，收集嘴部素材、准备静态图层、画第一帧
function lipEnterMode() {
    document.body.classList.add("lipMode"); // 供样式判断：素材区的隐藏按钮只在朗读模式出现
    lipSetViewCollapsed(false); // 每次进入模式都保持素材区展开
    lipEnableMouthMultiSelect(); // 记下原状态，再把嘴巴列表切成可多选
    lipRefreshMouthLists();
    lipAutoSelectMouthFrames();  // 兜底勾选最小/最大两帧，保证一进来就能看到口型变化
    lipState.spriteName = nowActor; // 记录当前立绘，换立绘时用来识别
    lipRefreshStatic();
    lipRenderRegions(); // 同步已有的片段
    lipState.selectionSig = lipSelectionSignature(); // 记下当前勾选，避免进模式时误覆盖片段
    lipState.smooth = 0;
    lipState.playing = false;
    document.getElementById("button_lipPlay").innerHTML = "播放";
    if (!lipState.mouthFrames.length) {
        // 个别立绘（例如只提供整图素材的）没有嘴部图层
        tip("当前立绘没有可驱动的嘴部图层，换个立绘试试", 3000, "#ff6b6b");
    }
    var audio = lipGetAudioEl();
    lipUpdateProgress(audio.currentTime || 0);
    if (!lipState.file) {
        lipSetStatus("未选择音频");
    }
    else if (!lipState.envelope) {
        lipSetStatus("音频还没分析完成");
    }
    else {
        lipSetStatus("已就绪：" + lipState.duration.toFixed(1) + " 秒");
    }
    lipDrawPreviewNow(true);
}

// 进入对口型模式的手机端迁移提示：只有 HTML5+ / plus 环境才弹，桌面端直接执行 onClose
// 与原有的“测试功能”提示串行播放，由 switchMode 统一编排
function lipShowMigrationNotice(onClose) {
    var next = (typeof onClose === "function") ? onClose : null;
    if (typeof plus === "undefined") {
        if (next) { next(); }
        return;
    }
    showDialog("提示",
        "手机端正在迁移 Capacitor，暂时继续使用导出速度较慢的旧方案。\n"
        + "有条件的可以在电脑端体验，导出会快很多。",
        next);
}

// 离开朗读模式：停止播放和录制，并把嘴巴列表恢复成原来的单选状态
// （不清空已选音频，方便再切回来）
function lipLeaveMode() {
    document.body.classList.remove("lipMode");
    lipSetViewCollapsed(false); // 离开模式时恢复素材区，避免其它模式里被收起却看不到展开按钮
    lipHideExportView(); // 导出弹框只在朗读模式使用
    lipManualExit(); // 全屏演示还没结束就离开模式时，直接收掉
    lipRestoreMouthMultiSelect();
    if (lipState.recording) {
        lipState.cancelRecording = true;
        if (lipState.recordResolve) { lipState.recordResolve(); }
        try { lipGetAudioEl().pause(); } catch (e) { }
    }
    lipPause();
    if (lipState.changeTimer) {
        clearTimeout(lipState.changeTimer);
        lipState.changeTimer = 0;
    }
}

// 立绘（选中项）变化时由 scrpit.js 的 render() 通知过来，做一下防抖再刷新
function lipOnSpriteChanged() {
    if (lipState.changeTimer) { clearTimeout(lipState.changeTimer); }
    // 记下刷新前的嘴部列表：立绘被重新加载时，旧列表对象会从 allRowLists 里消失
    var prevMouthList = lipState.mouthList;
    lipState.changeTimer = setTimeout(function () {
        lipState.changeTimer = 0;
        var rebuilt = !prevMouthList || lipGetMouthLists().indexOf(prevMouthList) < 0;
        var switched = nowActor !== lipState.spriteName || rebuilt;
        // 朗读模式下换立绘时，新立绘的嘴巴列表会重新创建（默认单选），这里补上多选
        lipEnableMouthMultiSelect();
        lipRefreshMouthLists();
        // 播放中换了立绘：新立绘默认只勾了一个口型，直接驱动会“定住不动”。
        // 这里按立绘名 / 列表是否重建来判断，是的话重新兜底勾选最小/最大两帧；
        // 只是用户自己增删勾选时不干预，保留用户的选择。
        if (switched && lipState.mouthList) {
            lipAutoSelectMouthFrames();
            lipState.spriteName = nowActor;
        }
        lipRefreshStatic();
        // 自动保存：用户正在编辑某条片段时，改动图层/表情/嘴部勾选会直接写回该片段。
        // 刚换立绘的那一次只更新签名，避免把新立绘的默认勾选覆盖到旧片段上。
        if (nowMode === "lip") {
            var sig = lipSelectionSignature();
            if (switched) {
                lipState.selectionSig = sig;
            }
            else if (sig !== lipState.selectionSig) {
                lipState.selectionSig = sig;
                lipSaveCurrentRegion();
            }
        }
    }, 80);
}

// 折叠/展开设置区（与表情包模式一致）
function toggleLipView() {
    var view = document.getElementById("lipView");
    var isCollapsed = view.dataset.paneCollapsed === "1";
    view.dataset.paneCollapsed = isCollapsed ? "0" : "1";
    view.style.flex = isCollapsed ? "1" : "0";
    view.style.minHeight = isCollapsed ? "auto" : "60px";
    //电脑端视图分隔条：折叠状态变化后重建
    if(window.refreshPaneSplitters){ window.refreshPaneSplitters(); }
}

// 素材/图层选择区（#setView，包含各 rowList）的隐藏开关。
// 只在朗读模式的竖屏/窄屏可见（样式控制），收起后腾出的高度让给朗读设置区。
function lipSetViewCollapsed(collapsed) {
    var view = document.getElementById("setView");
    var btn = document.getElementById("button_toggleSetView");
    if (!view) { return; }
    view.classList.toggle("setViewCollapsed", collapsed);
    if (btn) { btn.innerHTML = collapsed ? "显示" : "折叠"; }
    //电脑端视图分隔条：素材区收起/展开后重建
    if(window.refreshPaneSplitters){ window.refreshPaneSplitters(); }
}
function toggleSetView() {
    var view = document.getElementById("setView");
    if (!view) { return; }
    lipSetViewCollapsed(!view.classList.contains("setViewCollapsed"));
}

// ============================================================
// 二、嘴部素材收集
// ============================================================

// 找出所有“嘴部”rowList。不同立绘的命名不完全一样：嘴巴 / 嘴巴(抬头) / 嘴 / 口
function lipGetMouthLists() {
    var lists = [];
    for (var i = 0; i < allRowLists.length; i++) {
        var list = allRowLists[i];
        if (!list || !list.id) { continue; }
        var id = String(list.id);
        if (id.indexOf("嘴巴") === 0 || id === "嘴" || id === "口") {
            lists.push(list);
        }
    }
    return lists;
}

// 把嘴巴 rowList 切成可多选；第一次进入时记下原来的多选状态和勾选项，离开时还原，
// 这样不会影响完整立绘 / 表情包模式里嘴巴只能单选的行为
function lipEnableMouthMultiSelect() {
    var lists = lipGetMouthLists();
    for (var i = 0; i < lists.length; i++) {
        var list = lists[i];
        if (!list._lipOrig) {
            list._lipOrig = {
                multi: !!list.isAbleToSelectMulti,
                selected: list.items.map(function (it) { return !!it.isSelected; })
            };
        }
        list.isAbleToSelectMulti = true;
    }
}

// 离开朗读模式时还原嘴巴列表：回到原来的多选开关 + 原来的勾选项
function lipRestoreMouthMultiSelect() {
    var lists = lipGetMouthLists();
    for (var i = 0; i < lists.length; i++) {
        var list = lists[i];
        var saved = list._lipOrig;
        if (!saved) { continue; }
        list.isAbleToSelectMulti = saved.multi;
        for (var j = 0; j < list.items.length; j++) {
            list.items[j].isSelected = !!saved.selected[j];
            lipPaintMouthItem(list.items[j]);
        }
        delete list._lipOrig;
    }
}

// 同步嘴巴素材的选中样式（和 rowList_update 里的高亮保持一致）
function lipPaintMouthItem(item) {
    if (!item) { return; }
    if (item.isSelected) {
        item.style.setProperty("background-color", "var(--color-primary)");
        item.style.color = "#fff";
    }
    else {
        item.style.backgroundColor = "";
        item.style.color = "";
    }
}

// 兜底勾选：第一次进模式时通常只有单选的一个口型，直接驱动几乎不动；
// 这里自动补上“最闭合”和“最张开”两帧（按高度取最小/最大），先保证口型能明显动起来。
// 用户之后可以自己增删勾选，驱动只会在勾选的这组里切换。
function lipAutoSelectMouthFrames() {
    var list = lipState.mouthList;
    if (!list || !list.items.length) { return; }
    var count = 0;
    for (var i = 0; i < list.items.length; i++) {
        if (list.items[i].isSelected) { count++; }
    }
    if (count >= 2) { return; } // 用户已经勾了多个，尊重用户的选择

    var sorted = list.items.slice().sort(function (a, b) {
        return (a.height || 0) - (b.height || 0);
    });
    sorted[0].isSelected = true;
    sorted[sorted.length - 1].isSelected = true;
    lipPaintMouthItem(sorted[0]);
    lipPaintMouthItem(sorted[sorted.length - 1]);
    lipRefreshMouthLists();
}

// 更新“参与口型”的提示文字
function lipUpdateMouthHint() {
    var el = document.getElementById("text_lipMouthHint");
    if (!el) { return; }
    var n = lipState.mouthFrames.length;
    if (!n) {
        el.innerHTML = "没有找到嘴部图层";
    }
    else {
        el.innerHTML = "参与口型：" + n + " 个（在下方「嘴巴」列表里勾选要用的口型）";
    }
}

// 刷新嘴部列表：优先选“当前有选中项”的那套嘴（有的立绘有站立/前倾两套），
// 口型只在用户勾选的素材里切换；一个都没勾时兜底用整套嘴
function lipRefreshMouthLists() {
    var lists = lipGetMouthLists();
    var visible = lists.filter(function (l) {
        return l.style.display !== "none" && l.items && l.items.length > 0;
    });
    var target = null;
    for (var i = 0; i < visible.length; i++) {
        for (var j = 0; j < visible[i].items.length; j++) {
            if (visible[i].items[j].isSelected) { target = visible[i]; break; }
        }
        if (target) { break; }
    }
    if (!target) { target = visible[0] || null; }
    lipState.mouthList = target;

    if (!target) {
        lipState.mouthFrames = [];
        lipUpdateMouthHint();
        return;
    }
    // 只取用户勾选的口型；没勾选时用整套兜底
    var chosen = target.items.filter(function (it) { return it.isSelected; });
    if (!chosen.length) { chosen = target.items.slice(); }
    // 按素材高度从小到大排序，近似从“闭口”到“张大”的开口程度
    // （立绘素材的嘴部图层高度基本能反映张嘴大小，够用了）
    lipState.mouthFrames = chosen.sort(function (a, b) {
        return (a.height || 0) - (b.height || 0);
    });
    lipUpdateMouthHint();
}

// ============================================================
// 三、静态图层缓存与绘制
// ============================================================

// 加载一张图片（带缓存）
function lipLoadImage(src) {
    if (!src) { return Promise.resolve(null); }
    if (lipImgCache[src]) { return Promise.resolve(lipImgCache[src]); }
    return new Promise(function (resolve) {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function () { lipImgCache[src] = img; resolve(img); };
        img.onerror = function () { resolve(null); };
        img.src = src;
    });
}

// 收集当前已选图层，生成绘制指令。
// 顺序与 scrpit.js 的 render() 一致：倒序遍历 rowList（越后面的列表越先画）。
// 嘴部列表不再画“选中项”，而是留一个 mouth 槽位，由口型驱动决定画哪张。
function lipRefreshStatic() {
    var version = ++lipState.staticVersion;
    var mouthSet = lipGetMouthLists();
    var ops = [];
    for (var li = allRowLists.length - 1; li >= 0; li--) {
        var list = allRowLists[li];
        if (!list || !list.items) { continue; }
        var isMouthList = mouthSet.indexOf(list) >= 0;
        if (isMouthList) {
            // 嘴部列表在朗读模式里只当作“口型素材库”，不再直接画选中项：
            // 驱动用的那套嘴留一个槽位（保持它原本的图层顺序），其余嘴部列表直接跳过
            if (list === lipState.mouthList) { ops.push({ type: "mouth" }); }
            continue;
        }
        for (var j = 0; j < list.items.length; j++) {
            var item = list.items[j];
            if (!item.isSelected) { continue; }
            ops.push({
                type: "img",
                img: item.img,
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height
            });
        }
    }
    lipState.ops = ops;
    lipState.staticReady = false;

    // 预加载静态图层 + 所有嘴部素材
    var jobs = ops.filter(function (op) { return op.type === "img"; })
        .map(function (op) { return lipLoadImage(op.img); });
    lipState.mouthFrames.forEach(function (fr) { jobs.push(lipLoadImage(fr.img)); });

    Promise.all(jobs).then(function () {
        if (version !== lipState.staticVersion) { return; } // 期间又刷新过，丢弃旧结果
        lipState.staticReady = true;
        lipDrawPreviewNow(true);
    });

    lipDrawPreviewNow(true);
}

// 根据张嘴程度挑一帧嘴部素材
function lipPickMouthFrame(openness) {
    var frames = lipState.mouthFrames;
    if (!frames.length) { return null; }
    var idx = Math.round(lipClamp(openness, 0, 1) * (frames.length - 1));
    return frames[lipClamp(idx, 0, frames.length - 1)];
}

// 计算“说话浮动”的竖直偏移（画布像素，负值向上）
// 幅度随张嘴程度变化：没有音量时不浮动，有音量时按正弦上下起伏
function lipBobOffsetPx(timeSec, openness) {
    if (!lipState.bobEnabled) { return 0; }
    var v = lipClamp(openness, 0, 1);
    if (v <= 0.01) { return 0; }
    var amp = lipState.bobAmp / 100 * canvasSizeY * 0.03; // 100% 约为画布高度的 3%
    var phase = (timeSec || 0) * lipState.bobFreq * Math.PI * 2;
    return -Math.sin(phase) * amp * (0.35 + 0.65 * v);
}

// ---------- 片段衔接：挤压—回弹 ----------
// 只在前一段结尾和后一段开头首尾相接的地方生效：
// 交接前逐渐竖直压扁（挤压），交接后按阻尼弹簧恢复，略微过冲再稳住
// 返回“竖直压扁比例”（0=不压，正数=压扁，负数=回弹时拉长），不在过渡中就返回 null
function lipJunctionSquash(timeSec) {
    if (!lipState.transitionOn) { return null; }
    var rs = lipState.regions;
    // 挤压时长和回弹时长相互独立：交接点两侧各用自己的时长，交接点处两段都等于 amp，曲线保持连续
    var Ds = lipState.transitionSqueezeDur;
    var Dr = lipState.transitionReboundDur;
    if (rs.length < 2 || !(Ds > 0) || !(Dr > 0)) { return null; }
    var amp = lipState.transitionSquash / 100 * 0.22; // 100% 约压扁画布高度的 22%
    if (!(amp > 0)) { return null; }

    // 找出离当前时间最近的“首尾相接”点（允许 0.15 秒的小空隙，重叠或隔太远都不算）
    var T = null;
    for (var i = 0; i < rs.length; i++) {
        for (var j = 0; j < rs.length; j++) {
            if (i === j) { continue; }
            var a = rs[i], b = rs[j];
            var gap = b.start - a.end;
            if (gap < -0.001 || gap > 0.15) { continue; }
            var joint = b.start - gap / 2;
            if (timeSec < joint - Ds || timeSec > joint + Dr) { continue; }
            if (T === null || Math.abs(timeSec - joint) < Math.abs(timeSec - T)) { T = joint; }
        }
    }
    if (T === null) { return null; }

    if (timeSec < T) {
        // 挤压段：越接近交接点压得越明显（二次曲线，起手轻、收尾重，不像机械线性缩放）
        var x = lipClamp((timeSec - (T - Ds)) / Ds, 0, 1);
        return amp * x * x;
    }
    // 回弹段：阻尼余弦，先回到原样再略微过冲（负值拉长），最后稳住
    // u=0 时与挤压段的终点同为 amp，衔接处不会跳变
    var u = (timeSec - T) / Dr;
    var decay = 5.4 - 3.0 * (lipState.transitionRebound / 100); // 回弹越强，衰减越慢、过冲越明显
    return amp * Math.exp(-decay * u) * Math.cos(Math.PI * 2 * u);
}

// 人物整体的缩放锚点（脚底中心）：各图层一起缩放，相对位置不变
// 用当前立绘的图层算一个稳定包围盒，避免不同片段姿势不同导致过渡中锚点跳动
function lipCharacterAnchor(drawOps) {
    var ops = (lipState.ops && lipState.ops.length) ? lipState.ops : (drawOps || []);
    var minX = Infinity, maxX = -Infinity, bottom = -Infinity;
    for (var i = 0; i < ops.length; i++) {
        var op = ops[i];
        if (op.type === "mouth") {
            for (var k = 0; k < lipState.mouthFrames.length; k++) {
                var f = lipState.mouthFrames[k];
                if (f.x < minX) { minX = f.x; }
                if (f.x + f.width > maxX) { maxX = f.x + f.width; }
                if (f.y + f.height > bottom) { bottom = f.y + f.height; }
            }
            continue;
        }
        if (op.x < minX) { minX = op.x; }
        if (op.x + op.width > maxX) { maxX = op.x + op.width; }
        if (op.y + op.height > bottom) { bottom = op.y + op.height; }
    }
    if (!isFinite(minX) || !isFinite(bottom)) {
        return { cx: canvasSizeX / 2, bottom: canvasSizeY };
    }
    return { cx: (minX + maxX) / 2, bottom: bottom };
}

// 把当前立绘画到指定画布上（预览、GIF、录像共用）
// openness: 0~1 张嘴程度；bgColor: 为 null 时保持透明背景；timeSec: 音频时间（用于浮动动画）
function lipDrawScene(ctx, w, h, openness, bgColor, timeSec) {
    if (!ctx) { return; }
    var sx = w / canvasSizeX;
    var sy = h / canvasSizeY;
    // 整体上下浮动：所有图层一起偏移，保持人物内部相对位置不变
    // （区间样式里也保留浮动，只把立绘姿势/嘴型固定住）
    var bobY = lipBobOffsetPx(timeSec, openness) * sy;
    // 播放位置落在区间内就画区间快照，否则画正常的自动口型图层
    var region = lipFindRegion(timeSec || 0);
    var ops = region ? region.ops : lipState.ops;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, w, h);
    }
    // 片段衔接的挤压—回弹：以脚底中心为锚点整体缩放，
    // 和上下浮动叠加（浮动只提供竖直位移，不参与缩放）
    var squash = lipJunctionSquash(timeSec || 0);
    ctx.save();
    if (squash) {
        var anchor = lipCharacterAnchor(ops);
        var scaleY = 1 - squash;
        var scaleX = 1 + squash * 0.5; // 轻微横向补偿，看起来像“挤压”而不是单纯缩放
        ctx.translate(anchor.cx * sx, anchor.bottom * sy + bobY);
        ctx.scale(scaleX, scaleY);
        ctx.translate(-anchor.cx * sx, -anchor.bottom * sy);
    }
    else {
        ctx.translate(0, bobY);
    }
    for (var i = 0; i < ops.length; i++) {
        var op = ops[i];
        if (op.type === "mouth") {
            var frame = lipPickMouthFrame(openness);
            if (!frame) { continue; }
            var mImg = lipImgCache[frame.img];
            if (!mImg) { continue; }
            ctx.drawImage(mImg, frame.x * sx, frame.y * sy, frame.width * sx, frame.height * sy);
        }
        else {
            var img = lipImgCache[op.img];
            if (!img) { continue; }
            ctx.drawImage(img, op.x * sx, op.y * sy, op.width * sx, op.height * sy);
        }
    }
    ctx.restore();
}

// 预览画布：内部按比例缩小（最长边约 540），逐帧重绘不卡
function lipDrawPreviewNow(instant) {
    var cv = document.getElementById("lipPreviewCanvas");
    if (!cv || !canvasSizeX) { return; }
    var scale = Math.min(1, 540 / canvasSizeX);
    var w = Math.max(2, Math.round(canvasSizeX * scale));
    var h = Math.max(2, Math.round(canvasSizeY * scale));
    if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
    }
    var audio = lipGetAudioEl();
    var t = (audio && audio.currentTime) || 0;
    if (instant && lipState.envelope) {
        lipState.smooth = lipOpennessAt(t);
    }
    lipDrawScene(cv.getContext("2d"), w, h, lipState.smooth, null, t);
}

// ============================================================
// 三·五、片段样式
// 每个片段保存一份“除嘴部以外的立绘样式”：进入片段时按这份样式显示，嘴部仍跟音频自动切换。
// 片段以列表项呈现（向 rowList 看齐）：播放进入某条片段会自动选中它并作为当前编辑目标，
// 之后用户直接改立绘勾选就会自动保存到这条片段上；时间轴只负责位置展示和点击定位。
// ============================================================

// 当前时间命中的区间：有重叠时取“起始时间最晚”的那个（后加的、更具体的优先）
function lipFindRegion(t) {
    var found = null;
    for (var i = 0; i < lipState.regions.length; i++) {
        var r = lipState.regions[i];
        if (t >= r.start && t < r.end) {
            if (!found || r.start >= found.start) { found = r; }
        }
    }
    return found;
}

function lipFindRegionById(id) {
    for (var i = 0; i < lipState.regions.length; i++) {
        if (lipState.regions[i].id === id) { return lipState.regions[i]; }
    }
    return null;
}

// 抓取当前立绘样式：按 render() 的图层顺序把选中项固化成图片指令。
// 嘴部不固化：只留一个“嘴部槽位”，区间内继续用当前勾选的口型跟音频自动切换。
function lipCaptureRegionOps() {
    var mouthSet = lipGetMouthLists();
    var ops = [];
    for (var li = allRowLists.length - 1; li >= 0; li--) {
        var list = allRowLists[li];
        if (!list || !list.items) { continue; }
        if (mouthSet.indexOf(list) >= 0) {
            if (list === lipState.mouthList) { ops.push({ type: "mouth" }); }
            continue;
        }
        for (var j = 0; j < list.items.length; j++) {
            var item = list.items[j];
            if (!item.isSelected) { continue; }
            ops.push({
                type: "img",
                img: item.img,
                x: item.x,
                y: item.y,
                width: item.width,
                height: item.height
            });
        }
    }
    return ops;
}

// 预加载区间快照里的图片，加载完重画预览（嘴部槽位不是图片，跳过）
function lipPreloadRegion(region) {
    var jobs = [];
    for (var i = 0; i < region.ops.length; i++) {
        var op = region.ops[i];
        if (op.type === "img" && op.img) { jobs.push(lipLoadImage(op.img)); }
    }
    Promise.all(jobs).then(function () {
        lipDrawPreviewNow(true);
    });
}

// 所有区间快照的图片是否都已加载（导出前检查，避免缺图层）
function lipRegionsReady() {
    for (var i = 0; i < lipState.regions.length; i++) {
        var ops = lipState.regions[i].ops;
        for (var j = 0; j < ops.length; j++) {
            if (ops[j].type !== "img" || !ops[j].img) { continue; }
            if (!lipImgCache[ops[j].img]) { return false; }
        }
    }
    return true;
}

// 当前音频时间（秒）
function lipCurrentTime() {
    var audio = lipGetAudioEl();
    return (audio && audio.currentTime) || 0;
}

// 时间轴色块上显示的编号和时长
function lipRegionLabel(region) {
    var idx = lipState.regions.indexOf(region) + 1;
    return idx + " · " + (region.end - region.start).toFixed(1) + "s";
}

// 创建片段：start/end 是秒数，select 表示建好后是否选中它
function lipCreateRegion(start, end, select) {
    var dur = lipState.duration || 0;
    if (!dur) { tip("请先选择音频"); return null; }
    end = Math.min(dur, end);
    start = Math.max(0, Math.min(start, end - 0.1));
    if (end - start < 0.1) { return null; }
    var ops = lipCaptureRegionOps();
    if (!ops.length) { tip("请先在素材面板选中立绘部件"); return null; }
    var region = {
        id: ++lipState.regionSeed,
        start: Math.round(start * 10) / 10,
        end: Math.round(end * 10) / 10,
        actor: nowActor,
        actorKey: nowActorKey, //预设码用的人物 id
        mouthPicks: presetMouthPicksFromSelection(), //预设码里额外记录嘴部 index
        ops: ops
    };
    if (region.end <= region.start) { region.end = region.start + 0.1; }
    lipState.regions.push(region);
    if (select !== false) { lipState.selectedRegionId = region.id; }
    lipPreloadRegion(region);
    lipRenderRegions();
    lipUpdateRegionHint(lipCurrentTime(), true);
    lipDrawPreviewNow(true);
    return region;
}

// 按钮「创建片段」：起点取当前播放位置，默认 3 秒；太靠近结尾时自动留出 0.3 秒
function lipAddRegion() {
    var dur = lipState.duration || 0;
    if (!dur) { tip("请先选择音频"); return; }
    var start = lipClamp(lipCurrentTime(), 0, Math.max(0, dur - 0.3));
    var end = Math.min(start + 3, dur);
    if (lipCreateRegion(start, end, true)) {
        lipUpdateRegionHint(lipCurrentTime(), true);
        tip("已创建片段");
    }
}

// 删除片段（列表项上的删除按钮）
function lipDeleteRegion(id) {
    for (var i = 0; i < lipState.regions.length; i++) {
        if (lipState.regions[i].id === id) {
            lipState.regions.splice(i, 1);
            break;
        }
    }
    if (lipState.selectedRegionId === id) { lipState.selectedRegionId = null; }
    lipRenderRegions();
    lipUpdateRegionHint(lipCurrentTime(), true);
    lipDrawPreviewNow(true);
    tip("已删除片段");
}

// 修改选中片段的起止时间（输入框回车/失焦时触发），解析规则与播放时间输入一致
function lipCommitRegionTime(field) {
    var region = lipFindRegionById(lipState.selectedRegionId);
    var dur = lipState.duration || 0;
    if (!region) { return; }
    var input = document.getElementById(field === "start" ? "input_lipRegionStart" : "input_lipRegionEnd");
    if (!input) { return; }
    var v = lipParseTimeInput(input.value);
    if (!(dur > 0) || !isFinite(v)) {
        input.value = region[field].toFixed(1); // 格式不对就回到原值
        return;
    }
    v = Math.round(lipClamp(v, 0, dur) * 10) / 10;
    if (field === "start") {
        region.start = Math.min(v, region.end - 0.1);
    }
    else {
        region.end = Math.max(v, region.start + 0.1);
    }
    lipRenderRegions(); // 同步拖动条上的色块与两个输入框
    lipUpdateRegionHint(lipCurrentTime(), true);
    lipDrawPreviewNow(true);
}

// 删除当前选中的片段（编辑区里的删除按钮）
function lipDeleteSelectedRegion() {
    if (!lipState.selectedRegionId) { return; }
    lipDeleteRegion(lipState.selectedRegionId);
}

// ---------- 播放进度条（兼片段时间轴） & 片段选中 ----------
// 播放进度条和片段时间轴合并成一个控件：片段色块直接画在拖动条上，
// 红色播放头就是拖动位置；点击/拖动仍然由原生 range 控件负责定位。
// 新建片段和改起止时间都在下方片段列表里完成。

// 定位播放头：跳音频、刷新平滑值和进度
function lipSeekTo(t) {
    var dur = lipState.duration || 0;
    if (!dur) { return; }
    t = lipClamp(t, 0, dur);
    var audio = lipGetAudioEl();
    if (audio) { try { audio.currentTime = t; } catch (e) { } }
    lipState.smooth = lipState.envelope ? lipOpennessAt(t) : 0;
    lipDrawPreviewNow(true);
    lipUpdateProgress(t);
}

// ---------- 播放时间文本：点击变输入框，回车跳转 ----------
// 编辑时隐藏文本、显示输入框；播放中的实时刷新只写被隐藏的文本，不会打断输入
var lipTimeEditing = false;

// 宽容解析时间：支持秒数 "12.5"、分:秒 "0:12.5"（也接受全角冒号），解析失败返回 NaN
function lipParseTimeInput(raw) {
    var s = String(raw == null ? "" : raw).trim().replace(/：/g, ":");
    if (!s) { return NaN; }
    var parts = s.split(":");
    if (parts.length > 2) { return NaN; } // 最多认到 分:秒
    var total = 0;
    for (var i = 0; i < parts.length; i++) {
        var p = parts[i].trim();
        if (!/^(\d+(\.\d*)?|\.\d+)$/.test(p)) { return NaN; }
        total = total * 60 + parseFloat(p);
    }
    return total;
}

// 点击时间文本：进入编辑，预填当前播放时间（秒），方便直接改数字
function lipBeginTimeEdit() {
    if (lipTimeEditing) { return; }
    if (!(lipState.duration || lipGetAudioEl().duration || 0)) { return; } // 没音频就没有可跳的位置
    var text = document.getElementById("text_lipTime");
    var input = document.getElementById("input_lipTimeJump");
    if (!text || !input) { return; }
    lipTimeEditing = true;
    input.value = lipCurrentTime().toFixed(1);
    text.style.display = "none";
    input.style.display = "inline-block";
    // 手机上键盘弹起时把输入框挪进可视区，避免被挡住
    try { input.scrollIntoView({ block: "nearest" }); } catch (e) { }
    try { input.focus(); input.select(); } catch (e) { }
}

// 退出编辑：恢复实时文本显示（不改变播放位置）
function lipEndTimeEdit() {
    if (!lipTimeEditing) { return; }
    lipTimeEditing = false;
    var text = document.getElementById("text_lipTime");
    var input = document.getElementById("input_lipTimeJump");
    if (input) { input.style.display = "none"; input.blur(); }
    if (text) { text.style.display = ""; }
    lipUpdateProgress(lipCurrentTime()); // 立刻刷新成当前时间，和拖动条/播放头一致
}

// 回车提交：合法就跳转；格式不对或超出范围就回到原值（保持原播放位置）
function lipCommitTimeEdit() {
    if (!lipTimeEditing) { return; }
    var input = document.getElementById("input_lipTimeJump");
    var dur = lipState.duration || lipGetAudioEl().duration || 0;
    var t = lipParseTimeInput(input ? input.value : "");
    var ok = dur > 0 && isFinite(t) && t >= 0 && t <= dur;
    lipEndTimeEdit(); // 先恢复文本显示
    if (ok) { lipSeekTo(t); }
}

// 只同步选中态，不重建 DOM（播放中每帧也能放心调用）
function lipApplySelection() {
    var sel = lipState.selectedRegionId;
    var bar = document.getElementById("lipRegionTimeline");
    if (bar) {
        var blocks = bar.querySelectorAll(".lipRegionBlock");
        for (var i = 0; i < blocks.length; i++) {
            if (Number(blocks[i].getAttribute("data-region-id")) === sel) { blocks[i].classList.add("selected"); }
            else { blocks[i].classList.remove("selected"); }
        }
    }
    lipRenderRegionEditor(); // 选中的片段变了，下方起止时间跟着切换
    lipSyncPanelToRegion(sel); // 选中/切换片段时，素材面板的勾选回填成该片段的样式
}

// 把选中片段的样式回填到素材面板勾选状态（点色块/播放进入片段都走这里）。
// 只回填一次：同一片段重复刷新时不覆盖用户正在做的修改。
// 回填改变了勾选签名，这里顺手同步 selectionSig，避免紧接着的 render()
// 把这次回填当成“用户改了素材”而触发自动保存、污染片段样式。
function lipSyncPanelToRegion(id) {
    if (id === lipState.uiRegionId) { return; }
    lipState.uiRegionId = id;
    var region = lipFindRegionById(id);
    if (!region) { return; }
    lipApplyRegionToSelection(region);
    lipState.selectionSig = lipSelectionSignature();
    lipRefreshStatic(); // 让静态绘制指令、预览和面板勾选保持一致
}

// 下方片段编辑区：显示选中片段的起止时间（没有选中片段时整块隐藏）
function lipRenderRegionEditor() {
    var box = document.getElementById("lipRegionEditor");
    if (!box) { return; }
    var region = lipFindRegionById(lipState.selectedRegionId);
    if (!region) {
        box.style.display = "none";
        return;
    }
    box.style.display = "flex";
    var idxEl = document.getElementById("text_lipRegionIndex");
    if (idxEl) { idxEl.innerHTML = String(lipState.regions.indexOf(region) + 1); }
    var si = document.getElementById("input_lipRegionStart");
    var ei = document.getElementById("input_lipRegionEnd");
    // 正在输入时不覆盖用户内容，避免播放中自动切换片段打断编辑
    var editing = document.activeElement;
    if (si && editing !== si) { si.value = region.start.toFixed(1); }
    if (ei && editing !== ei) { ei.value = region.end.toFixed(1); }
}

// 自动保存：把当前勾选的立绘样式写回正在编辑的片段。
// 点了某条片段后直接改图层/表情/嘴部勾选即可，不需要再点“抓取当前样式”。
function lipSaveCurrentRegion() {
    if (nowMode !== "lip") { return; }
    var region = lipFindRegionById(lipState.selectedRegionId);
    if (!region) { return; }
    var ops = lipCaptureRegionOps();
    if (!ops.length) { return; }
    region.ops = ops;
    region.actor = nowActor;
    region.actorKey = nowActorKey;
    region.mouthPicks = presetMouthPicksFromSelection(); //嘴部只用于预设码，不参与绘制
    lipPreloadRegion(region); // 内部会重新加载图片并重画预览
}

// ---------- 片段预设码：每个片段单独复制 / 导入 ----------
// 把片段快照里的图片反查成图层索引，再拼成和全局预设一致的格式；
// 嘴部单独记录在 mouthPicks 里（片段绘制本身不固化嘴部）
function lipRegionPresetCode(region) {
    if (!region) { return ""; }
    var imgs = [];
    for (var i = 0; i < region.ops.length; i++) {
        var op = region.ops[i];
        if (op.type === "img" && op.img) { imgs.push(op.img); }
    }
    var picks = presetPicksFromImages(imgs, true); //快照里不含嘴部图片
    var mouthPicks = (region.mouthPicks && region.mouthPicks.length)
        ? region.mouthPicks
        : presetMouthPicksFromSelection();
    for (var j = 0; j < mouthPicks.length; j++) { picks.push(mouthPicks[j]); }
    return buildPresetCode(region.actorKey || nowActorKey, picks);
}

// 复制当前选中片段的预设码
function lipCopySelectedRegionPreset() {
    var region = lipFindRegionById(lipState.selectedRegionId);
    if (!region) {
        tip("请先选中一个片段", 2000, "#ff6b6b");
        return;
    }
    var code = lipRegionPresetCode(region);
    var ok = copyText(code);
    tip(ok === false ? "复制失败，请手动选中预设码复制" : "本片段预设码已复制", 2000);
}

// 打开导入弹窗（目标固定为当前片段）
function lipShowRegionPresetImport() {
    var region = lipFindRegionById(lipState.selectedRegionId);
    if (!region) {
        tip("请先选中一个片段", 2000, "#ff6b6b");
        return;
    }
    showPresetImportView("region");
}

// 导入到当前选中片段：先套用勾选，再按当前素材抓取快照，覆盖该片段的样式
function lipImportRegionPreset(code) {
    var parsed = parsePresetCode(code);
    if (!parsed) {
        tip("预设码格式不正确", 3000, "#ff6b6b");
        return false;
    }
    if (parsed.actorKey !== nowActorKey) {
        tip("这个预设码属于「" + parsed.actorKey + "」，请先切换到同一立绘", 3000, "#ff6b6b");
        return false;
    }
    var region = lipFindRegionById(lipState.selectedRegionId);
    if (!region) {
        tip("请先选中一个片段", 2000, "#ff6b6b");
        return false;
    }
    //对口型模式导入舍弃嘴部，嘴由音频驱动，不能被预设覆盖
    var applied = applyPresetPicks(parsed.picks, true, true); // 不触发 render，避免自动保存抢先覆盖
    if (!applied) {
        tip("预设码里没有可用的图层", 3000, "#ff6b6b");
        return false;
    }
    lipRefreshStatic();          // 让静态绘制指令与面板勾选一致
    lipSaveCurrentRegion();      // 抓取快照写回当前片段
    lipState.selectionSig = lipSelectionSignature();
    lipRenderRegions();
    lipDrawPreviewNow(true);
    tip("已导入片段预设");
    return true;
}


// 当前所有 rowList 的勾选签名，用来判断用户是否改了立绘样式
function lipSelectionSignature() {
    var parts = [];
    for (var i = 0; i < allRowLists.length; i++) {
        var list = allRowLists[i];
        if (!list || !list.items) { continue; }
        for (var j = 0; j < list.items.length; j++) {
            if (list.items[j].isSelected) { parts.push(list.id + ":" + list.items[j].img); }
        }
    }
    return parts.join("|");
}

// 把片段记录的图层样式同步到素材列表的勾选状态。
// 嘴部不在同步范围内：片段内嘴型仍由音频和当前勾选自动驱动。
function lipApplyRegionToSelection(region) {
    var mouthSet = lipGetMouthLists();
    var imgs = [];
    for (var i = 0; i < region.ops.length; i++) {
        if (region.ops[i].type === "img" && region.ops[i].img) { imgs.push(region.ops[i].img); }
    }
    for (var li = 0; li < allRowLists.length; li++) {
        var list = allRowLists[li];
        if (!list || !list.items || mouthSet.indexOf(list) >= 0) { continue; }
        for (var j = 0; j < list.items.length; j++) {
            var item = list.items[j];
            item.isSelected = imgs.indexOf(item.img) >= 0;
            lipPaintMouthItem(item); // 该函数只是按 isSelected 刷高亮，非嘴部素材同样适用
        }
    }
}

// 重画拖动条上的片段色块，并同步下方编辑区
function lipRenderRegions() {
    var bar = document.getElementById("lipRegionTimeline");
    if (!bar) { return; }
    var dur = lipState.duration || 0;

    // 时间轴：清掉旧色块（播放头保留在 HTML 里）
    var oldBlocks = bar.querySelectorAll(".lipRegionBlock");
    for (var b = 0; b < oldBlocks.length; b++) { oldBlocks[b].parentNode.removeChild(oldBlocks[b]); }

    // 选中的片段被删掉后，清掉选中状态
    if (lipState.selectedRegionId && !lipFindRegionById(lipState.selectedRegionId)) {
        lipState.selectedRegionId = null;
    }

    if (dur > 0) {
        for (var i = 0; i < lipState.regions.length; i++) {
            var r = lipState.regions[i];
            var block = document.createElement("div");
            block.className = "lipRegionBlock" + (r.id === lipState.selectedRegionId ? " selected" : "");
            block.setAttribute("data-region-id", r.id);
            block.style.left = lipClamp(r.start / dur, 0, 1) * 100 + "%";
            block.style.width = Math.max(0.4, lipClamp((r.end - r.start) / dur, 0, 1) * 100) + "%";
            block.title = "片段 " + (i + 1) + "：" + r.start.toFixed(1) + " ~ " + r.end.toFixed(1) + "s";
            block.innerHTML = '<span class="lipRegionBlockLabel">' + lipRegionLabel(r) + '</span>';
            bar.appendChild(block);
        }
    }

    lipMarkActiveRegion(lipCurrentTime());
    lipApplySelection(); // 顺带刷新下方起止时间编辑区
}

// 清空全部片段：切换立绘时调用（片段快照绑定的是旧立绘图层，留着会画面错乱）
// 时间轴色块、编辑区、选中态、提示文字一起复位，并按当前素材重建绘制指令，
// 保证新立绘上不会残留旧片段的画面
function lipResetRegions() {
    lipState.regions = [];
    lipState.selectedRegionId = null;
    lipState.uiRegionId = null;
    lipState.regionSeed = 0;
    lipState.regionHint = "";
    lipState.selectionSig = "";
    lipRenderRegions();
    lipRefreshStatic();
}

// 高亮当前播放位置命中的色块（只做展示，自动选中在 lipUpdateProgress 里处理）
function lipMarkActiveRegion(t) {
    var active = lipFindRegion(t);
    var bar = document.getElementById("lipRegionTimeline");
    if (bar) {
        var blocks = bar.querySelectorAll(".lipRegionBlock");
        for (var i = 0; i < blocks.length; i++) {
            var id = Number(blocks[i].getAttribute("data-region-id"));
            if (active && active.id === id) { blocks[i].classList.add("active"); }
            else { blocks[i].classList.remove("active"); }
        }
    }
    lipUpdateRegionHint(t, false);
}

// 更新“当前片段”提示文字（每帧调用，内容不变就不写 DOM）
function lipUpdateRegionHint(t, force) {
    var el = document.getElementById("text_lipRegionHint");
    if (!el) { return; }
    var txt;
    var active = lipFindRegion(t);
    if (!lipState.duration) {
        txt = "请先选择音频";
    }
    else if (active) {
        txt = "当前：片段 " + (lipState.regions.indexOf(active) + 1);
    }
    else {
        txt = "当前：自动口型";
    }
    if (force || txt !== lipState.regionHint) {
        el.innerHTML = txt;
        lipState.regionHint = txt;
    }
}

// ============================================================
// 四、音频分析
// ============================================================

// 读取文件二进制（老 WebView 没有 file.arrayBuffer，退回 FileReader）
function lipReadFileArrayBuffer(file) {
    if (file.arrayBuffer) { return file.arrayBuffer(); }
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function () { resolve(reader.result); };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// 解码音频文件（兼容老 WebView 的回调式写法）
function lipDecodeAudio(file) {
    var ctx = lipGetAudioCtx();
    return lipReadFileArrayBuffer(file).then(function (data) {
        return new Promise(function (resolve, reject) {
            var ret = ctx.decodeAudioData(data, resolve, reject);
            if (ret && typeof ret.then === "function") {
                ret.then(resolve, function (err) { reject(err); });
            }
        });
    });
}

// 从 AudioBuffer 计算口型包络
function lipBuildEnvelope(buffer) {
    var sr = buffer.sampleRate;
    var len = buffer.length;
    var ch0 = buffer.getChannelData(0);
    var ch1 = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
    var hop = Math.max(1, Math.round(sr / 50)); // 20ms 一帧
    var frames = Math.max(1, Math.floor(len / hop));
    var rms = new Float32Array(frames);

    // 1. 每帧能量（双声道取平均）
    for (var f = 0; f < frames; f++) {
        var start = f * hop;
        var sum = 0;
        for (var i = 0; i < hop; i++) {
            var idx = start + i;
            var s = ch0[idx] || 0;
            if (ch1) { s = (s + (ch1[idx] || 0)) * 0.5; }
            sum += s * s;
        }
        rms[f] = Math.sqrt(sum / hop);
    }

    // 2. 用分位数归一化，尽量不受整体录音音量影响
    var sorted = Array.prototype.slice.call(rms).sort(function (a, b) { return a - b; });
    var p05 = sorted[Math.floor(sorted.length * 0.05)] || 0;
    var p95 = sorted[Math.floor(sorted.length * 0.95)] || 0;
    var gate = Math.max(p05 * 1.5, p95 * 0.04, 0.0005); // 噪声门限，静音时闭嘴
    var top = Math.max(p95, gate + 0.0001);
    var energy = new Float32Array(frames);
    for (var f2 = 0; f2 < frames; f2++) {
        var v = (rms[f2] - gate) / (top - gate);
        v = lipClamp(v, 0, 1);
        energy[f2] = Math.pow(v, 0.75); // 提升一点小音量，嘴型更跟得上
    }

    // 3. 轻量音高估计（降采样到 8kHz 提速），音高偏高时稍微再张大一点
    var pitch = lipPitchTrack(ch0, ch1, sr, frames, hop, len);

    var env = new Float32Array(frames);
    for (var f3 = 0; f3 < frames; f3++) {
        // 音高只作为辅助：乘上能量，保证静音时仍然闭嘴
        env[f3] = lipClamp(energy[f3] * 0.78 + pitch[f3] * energy[f3] * 0.22, 0, 1);
    }

    // 4. 包络平滑：起音快、收尾慢，更接近说话口型
    for (var f4 = 1; f4 < frames; f4++) {
        var target = env[f4];
        var prev = env[f4 - 1];
        var k = target > prev ? 0.6 : 0.25;
        env[f4] = prev + (target - prev) * k;
    }
    return env;
}

// 音高跟踪：归一化自相关，返回每帧 0~1 的音高活跃度
function lipPitchTrack(ch0, ch1, sr, frames, hop, len) {
    var out = new Float32Array(frames);
    var dsSr = 8000;
    var ratio = sr / dsSr;
    var dsLen = Math.max(1, Math.floor(len / ratio));
    var ds = new Float32Array(dsLen);

    // 简单平均降采样（顺便当低通滤波）
    var acc = 0;
    var cnt = 0;
    var di = 0;
    for (var i = 0; i < len && di < dsLen; i++) {
        var s = ch0[i] || 0;
        if (ch1) { s = (s + (ch1[i] || 0)) * 0.5; }
        acc += s;
        cnt++;
        if (cnt >= ratio) {
            ds[di++] = acc / cnt;
            acc = 0;
            cnt = 0;
        }
    }

    var dsHop = Math.max(1, Math.round(dsSr / 50));
    var win = 512;
    var minLag = Math.floor(dsSr / 500); // 500Hz
    var maxLag = Math.floor(dsSr / 80);  // 80Hz
    var frameCount = Math.min(frames, Math.floor(dsLen / dsHop));

    for (var f = 0; f < frameCount; f++) {
        var start = f * dsHop;
        if (start + win + maxLag >= dsLen) { break; }
        // 先看这一帧能量，静音就不做自相关（省时间）
        var e = 0;
        for (var k = 0; k < win; k += 4) {
            var v = ds[start + k] || 0;
            e += v * v;
        }
        if (e < 1e-5) { continue; }

        var bestR = 0;
        var bestLag = 0;
        for (var lag = minLag; lag <= maxLag; lag++) {
            var corr = 0;
            var e1 = 0;
            var e2 = 0;
            for (var n = 0; n < win; n++) {
                var a = ds[start + n] || 0;
                var b = ds[start + n + lag] || 0;
                corr += a * b;
                e1 += a * a;
                e2 += b * b;
            }
            var r = corr / Math.sqrt(e1 * e2 + 1e-9);
            if (r > bestR) { bestR = r; bestLag = lag; }
        }
        if (bestLag > 0 && bestR > 0.35) {
            var f0 = dsSr / bestLag;
            out[f] = lipClamp((f0 - 80) / (500 - 80), 0, 1);
        }
    }

    // 音高曲线也稍微平滑一下，避免单帧抖动
    for (var f2 = 1; f2 < frameCount; f2++) {
        out[f2] = out[f2 - 1] * 0.5 + out[f2] * 0.5;
    }
    return out;
}

// 查询某个时间点的张嘴程度（0~1）
function lipOpennessAt(t) {
    var env = lipState.envelope;
    if (!env || !env.length) { return 0; }
    var pos = Math.max(0, t) * lipState.envRate;
    var i = Math.floor(pos);
    var frac = pos - i;
    var a = env[Math.min(i, env.length - 1)] || 0;
    var b = env[Math.min(i + 1, env.length - 1)] || 0;
    return lipClamp((a + (b - a) * frac) * lipState.sensitivity, 0, 1);
}

// ============================================================
// 五、选择音频 / 播放控制
// ============================================================

function lipPickAudio() {
    document.getElementById("input_lipAudio").click();
}

// 读取并分析音频
function lipLoadFile(file) {
    lipPause();
    var reqId = ++lipState.loadReq;
    lipState.file = file;
    lipState.envelope = null;
    lipState.duration = 0;
    lipState.audioBuffer = null;
    document.getElementById("text_lipAudioName").textContent = file.name;
    document.getElementById("text_lipAudioName").title = file.name;
    lipSetStatus("正在读取音频...");

    var audio = lipGetAudioEl();
    if (lipState.objectUrl) {
        URL.revokeObjectURL(lipState.objectUrl);
        lipState.objectUrl = "";
    }
    lipState.objectUrl = URL.createObjectURL(file);
    audio.src = lipState.objectUrl;
    audio.load();

    lipDecodeAudio(file).then(function (buffer) {
        if (reqId !== lipState.loadReq) { return; } // 用户又换了文件
        lipState.audioBuffer = buffer;
        lipState.duration = buffer.duration;
        lipSetStatus("正在分析口型...（" + buffer.duration.toFixed(1) + " 秒）");
        // 分析是同步计算，先让界面刷新一下提示文字
        return lipYield().then(function () {
            if (reqId !== lipState.loadReq) { return; }
            lipState.envelope = lipBuildEnvelope(buffer);
            if (reqId !== lipState.loadReq) { return; }
            lipState.smooth = 0;
            lipDrawPreviewNow(true);
            lipUpdateProgress(0);
            lipRenderRegions(); // 时长变了，重新摆一下时间轴色块
            lipSetStatus("分析完成：" + buffer.duration.toFixed(1) + " 秒，可以播放预览了的说~");
            tip("音频分析完成");
        });
    }).catch(function (err) {
        console.error("音频解析失败", err);
        if (reqId !== lipState.loadReq) { return; }
        lipSetStatus("音频解析失败，请换成 mp3 / wav / m4a 试试");
        tip("音频解析失败", 3000, "#ff6b6b");
    });
}

// 让 <audio> 走 AudioContext，这样录视频时才能抓到音轨（只创建一次）
function lipEnsureMediaSource() {
    var audio = lipGetAudioEl();
    if (lipState.mediaSource) { return lipState.mediaSource; }
    var ctx = lipGetAudioCtx();
    lipState.mediaSource = ctx.createMediaElementSource(audio);
    lipState.mediaSource.connect(ctx.destination); // 仍然从扬声器播放
    return lipState.mediaSource;
}

function lipTogglePlay() {
    if (lipState.playing) { lipPause(); }
    else { lipPlay(); }
}

function lipPlay() {
    var audio = lipGetAudioEl();
    if (!audio.src) { tip("请先选择一段音频"); return; }
    if (!lipState.envelope) { tip("音频还在分析中，请稍等"); return; }
    try {
        var ctx = lipGetAudioCtx();
        if (ctx.state === "suspended") { ctx.resume(); }
        lipEnsureMediaSource();
    } catch (e) {
        console.warn("音频路由失败", e);
    }
    var dur = lipState.duration || audio.duration || 0;
    if (dur > 0 && audio.currentTime >= dur - 0.03) { audio.currentTime = 0; }

    lipState.playing = true;
    lipState.smooth = lipOpennessAt(audio.currentTime || 0);
    document.getElementById("button_lipPlay").innerHTML = "暂停";
    // 先启动动画循环，再开始播放：避免个别 WebView 里 play() 的 Promise 迟迟不 resolve
    // 导致预览不刷新（导出不依赖这个循环，但预览需要）
    lipStartLoop();
    audio.play().catch(function (err) {
        lipState.playing = false;
        if (lipState.rafId) {
            cancelAnimationFrame(lipState.rafId);
            lipState.rafId = 0;
        }
        document.getElementById("button_lipPlay").innerHTML = "播放";
        tip("播放失败：" + (err && err.message ? err.message : err));
    });
}

// 暂停（保留当前画面）
function lipPause() {
    var audio = lipGetAudioEl();
    lipState.playing = false;
    if (audio) { try { audio.pause(); } catch (e) { } }
    if (lipState.rafId) {
        cancelAnimationFrame(lipState.rafId);
        lipState.rafId = 0;
    }
    var btn = document.getElementById("button_lipPlay");
    if (btn) { btn.innerHTML = "播放"; }
    lipDrawPreviewNow(true);
}

// 停止（回到开头）
function lipStopPlayback() {
    var audio = lipGetAudioEl();
    lipState.playing = false;
    if (audio) {
        try { audio.pause(); audio.currentTime = 0; } catch (e) { }
    }
    if (lipState.rafId) {
        cancelAnimationFrame(lipState.rafId);
        lipState.rafId = 0;
    }
    var btn = document.getElementById("button_lipPlay");
    if (btn) { btn.innerHTML = "播放"; }
    lipState.smooth = 0;
    lipDrawPreviewNow(true);
    lipUpdateProgress(0);
}

// 播放时的动画循环：更新预览、进度，录制时顺便画导出帧
function lipStartLoop() {
    if (lipState.rafId) { return; }
    lipState.lastTick = performance.now();
    function step(now) {
        if (!lipState.playing) { lipState.rafId = 0; return; }
        var dt = (now - lipState.lastTick) / 1000;
        lipState.lastTick = now;
        if (!(dt > 0)) { dt = 0.016; }
        if (dt > 0.1) { dt = 0.1; }

        var audio = lipGetAudioEl();
        var t = audio.currentTime || 0;
        var target = lipOpennessAt(t);
        // 平滑参数越大，嘴型变化越柔和
        var tau = 0.02 + lipState.smoothLevel * 0.18;
        var k = 1 - Math.exp(-dt / tau);
        lipState.smooth += (target - lipState.smooth) * k;

        lipDrawPreviewNow(false);
        // 手动录屏：全屏舞台同步绘制当前口型（背景色由遮罩负责）
        if (lipManual.active) { lipDrawManualFrame(t); }
        lipState.lastFrameAt = now;
        if (lipState.recording) {
            // 按设置的导出帧率更新录像画布：rAF 通常有 60Hz，不能每帧都画，
            // 否则低帧率设置会被实际绘制带偏；这里按帧间隔节流。
            var frameGap = 1000 / (lipState.exportFps || 60);
            if (!lipState.exportLastDrawAt || now - lipState.exportLastDrawAt >= frameGap - 1) {
                lipDrawExportFrame(t);
                lipState.exportLastDrawAt = now;
            }
            lipSetExportStatus("正在录制... " + t.toFixed(1) + " / " + lipState.duration.toFixed(1) + " 秒");
        }
        lipUpdateProgress(t);
        lipState.rafId = requestAnimationFrame(step);
    }
    lipState.rafId = requestAnimationFrame(step);
}

function lipUpdateProgress(t) {
    var dur = lipState.duration || (lipGetAudioEl().duration || 0);
    var slider = document.getElementById("input_lipProgress");
    if (slider && dur > 0) {
        slider.value = Math.round(lipClamp(t / dur, 0, 1) * 1000);
    }
    var text = document.getElementById("text_lipTime");
    if (text) {
        text.innerHTML = (t || 0).toFixed(1) + " / " + (dur || 0).toFixed(1) + "s";
    }
    // 拖动条：已播放部分的填充 + 播放头（片段色块叠在同一条拖动条上）
    var fill = document.getElementById("lipTimelineFill");
    if (fill) {
        fill.style.width = (dur > 0 ? lipClamp(t / dur, 0, 1) * 100 : 0) + "%";
    }
    var head = document.getElementById("lipRegionPlayhead");
    if (head) {
        head.style.left = (dur > 0 ? lipClamp(t / dur, 0, 1) * 100 : 0) + "%";
    }
    // 播放/定位进入某条片段：自动把这条片段设为当前编辑目标（拖动条上的色块变成选中态）
    var active = lipFindRegion(t);
    if (active && active.id !== lipState.selectedRegionId) {
        lipState.selectedRegionId = active.id;
        lipApplySelection();
    }
    lipMarkActiveRegion(t);
}

// 导出时把一帧画到录像画布（蓝底）
function lipDrawExportFrame(t) {
    if (!lipState.exportCtx) { return; }
    lipDrawScene(lipState.exportCtx, lipState.exportW, lipState.exportH, lipOpennessAt(t), lipState.exportBg, t);
}

// ============================================================
// 六、导出 GIF（GIF89a + LZW，透明背景）
// ============================================================

// 下载 Blob：浏览器直接触发下载；HBuilder 打包环境额外写一份到 _downloads
function lipDownloadBlob(blob, filename) {
    // 桌面浏览器下载拿不到真实写入进度，这里按“开始下载 → 下载已开始”两段推进
    lipShowSaveProgress();
    lipSetSaveProgress(20);
    lipSetExportStatus("正在准备下载：" + filename);
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    lipSetSaveProgress(100);
    lipSetExportStatus("下载已开始：" + filename);
    setTimeout(lipHideSaveProgress, 800);
    setTimeout(function () {
        URL.revokeObjectURL(url);
        a.remove();
    }, 10000);

    if (typeof plus !== "undefined" && plus.io) {
        try {
            plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function (fs) {
                fs.root.getDirectory("_downloads", { create: true }, function (dir) {
                    dir.getFile(filename, { create: true }, function (entry) {
                        entry.createWriter(function (writer) {
                            writer.onwrite = function () { tip("已保存到 _downloads/" + filename, 3000); };
                            writer.onerror = function (err) { console.error("写入失败", err); };
                            writer.write(blob);
                        }, function (err) { console.error("createWriter 失败", err); });
                    }, function (err) { console.error("getFile 失败", err); });
                }, function (err) { console.error("getDirectory 失败", err); });
            }, function (err) { console.error("requestFileSystem 失败", err); });
        } catch (e) {
            console.warn("plus 保存失败", e);
        }
    }
}

// 找调色板里最接近的颜色
function lipNearestColor(palette, r, g, b) {
    var best = 0;
    var bestD = Infinity;
    for (var i = 0; i < palette.length; i++) {
        var p = palette[i];
        var dr = p[0] - r;
        var dg = p[1] - g;
        var db = p[2] - b;
        var d = dr * dr + dg * dg + db * db;
        if (d < bestD) {
            bestD = d;
            best = i;
            if (d === 0) { break; }
        }
    }
    return best;
}

// 统计若干帧的颜色，生成 255 色调色板（透明色单独占索引 255）
function lipBuildGifPalette(sampleTimes, octx, w, h) {
    var hist = new Int32Array(32768); // 每个通道取高 5 位：32*32*32
    for (var i = 0; i < sampleTimes.length; i++) {
        lipDrawScene(octx, w, h, lipOpennessAt(sampleTimes[i]), null, sampleTimes[i]);
        var data = octx.getImageData(0, 0, w, h).data;
        for (var p = 0; p < data.length; p += 8) { // 每 2 个像素采样一次
            if (data[p + 3] < 128) { continue; }
            var key = ((data[p] >> 3) << 10) | ((data[p + 1] >> 3) << 5) | (data[p + 2] >> 3);
            hist[key]++;
        }
    }
    var keys = [];
    for (var k = 0; k < 32768; k++) {
        if (hist[k] > 0) { keys.push(k); }
    }
    keys.sort(function (a, b) { return hist[b] - hist[a]; });

    var palette = [];
    var paletteKeys = [];
    var count = Math.min(255, keys.length);
    for (var n = 0; n < count; n++) {
        var kk = keys[n];
        paletteKeys.push(kk);
        palette.push([
            ((kk >> 10) & 31) * 8 + 4,
            ((kk >> 5) & 31) * 8 + 4,
            (kk & 31) * 8 + 4
        ]);
    }
    while (palette.length < 255) { palette.push([0, 0, 0]); }
    return { palette: palette, paletteKeys: paletteKeys };
}

// GIF LZW 压缩：输入每像素索引，输出按子块打包好的字节
function lipGifLzwBlocks(indices, minCodeSize) {
    var clearCode = 1 << minCodeSize;
    var eoiCode = clearCode + 1;
    var maxBits = 12;
    var nBits = minCodeSize + 1;
    var maxCode = (1 << nBits) - 1;
    var freeEnt = clearCode + 2;
    var dict = new Map();
    var accum = 0;
    var accumBits = 0;
    var out = [];

    function emit(code) {
        accum |= code << accumBits;
        accumBits += nBits;
        while (accumBits >= 8) {
            out.push(accum & 0xFF);
            accum >>= 8;
            accumBits -= 8;
        }
        // 与解码端保持同步：字典条目数超出当前位宽可表示范围时加宽
        if (freeEnt > maxCode && nBits < maxBits) {
            nBits++;
            maxCode = (nBits === maxBits) ? 4095 : ((1 << nBits) - 1);
        }
    }

    emit(clearCode);
    var ent = indices[0];
    for (var i = 1; i < indices.length; i++) {
        var c = indices[i];
        var key = (ent << 8) | c;
        var found = dict.get(key);
        if (found !== undefined) {
            ent = found;
            continue;
        }
        emit(ent);
        if (freeEnt < 4096) {
            dict.set(key, freeEnt);
            freeEnt++;
        }
        else {
            // 字典满了：发清除码，重新开始
            emit(clearCode);
            dict = new Map();
            freeEnt = clearCode + 2;
            nBits = minCodeSize + 1;
            maxCode = (1 << nBits) - 1;
        }
        ent = c;
    }
    emit(ent);
    emit(eoiCode);
    if (accumBits > 0) { out.push(accum & 0xFF); }

    // 按 GIF 规范切成 ≤255 字节的子块，末尾补 0
    var blocks = [];
    for (var pos = 0; pos < out.length; pos += 255) {
        var len = Math.min(255, out.length - pos);
        blocks.push(len);
        for (var j = 0; j < len; j++) { blocks.push(out[pos + j]); }
    }
    blocks.push(0);
    return new Uint8Array(blocks);
}

// 读取导出帧率设置（GIF / MP4 共用）：合法值直接用，非法值退回上次的有效值
function lipGetExportFps() {
    var el = document.getElementById("input_lipExportFps");
    var v = el ? Number(el.value) : NaN;
    if (!isFinite(v) || v < 1 || v > 60) { return lipState.exportFps; }
    return v;
}

// 校验帧数输入框：1~60 以外的输入回到上次的有效值（回车/失焦时生效）
function lipCommitExportFps() {
    var input = document.getElementById("input_lipExportFps");
    if (!input) { return; }
    var raw = String(input.value).trim();
    var v = Number(raw);
    if (raw === "" || !isFinite(v) || v < 1 || v > 60) {
        input.value = lipState.exportFps;
        return;
    }
    var rounded = Math.round(v * 10) / 10; // 保留一位小数，避免浮点尾巴
    lipState.exportFps = rounded;
    input.value = rounded;
}

// ---------- 导出弹框 ----------

// 手动录屏只在手机端（HTML5+ / plus 环境）可用；桌面端保留同一套 DOM、样式与逻辑，只是不启用
function lipManualSupported() {
    return typeof plus !== "undefined";
}

// 当前选择的导出格式：手机端默认手动录屏，桌面端默认 MP4输出
var lipExportKind = lipManualSupported() ? "manual" : "mp4";

// 右上角「导出」：所有模式都先打开导出弹窗；
// 立绘/表情包模式在弹窗里命名导出 PNG，对口型模式仍走 GIF / MP4
function handleExportButton() {
    lipShowExportView();
}

// 关闭动画的延时句柄：300ms 内重新打开时要取消，否则刚打开又被关掉
var lipExportHideTimer = null;

// 打开/关闭弹框（只改显示，不改任何导出状态；关闭后设置与进度文字都保留）
// 显示与动画完全照搬确认框（showConfirmView / hideConfirmView），保证视觉一致
function lipShowExportView() {
    var box = document.getElementById("dialogView_export");
    var bg = document.getElementById("dialogView_export_backGround");
    if (!box || !bg) { return; }
    lipHideSaveProgress(); // 每次打开导出面板都先复位进度条
    var isLip = nowMode === "lip";
    // 口型模式显示 GIF/MP4 选项；其它模式显示文件名 + 预设码
    var lipOptions = document.getElementById("exportLipOptions");
    var spriteOptions = document.getElementById("exportSpriteOptions");
    var presetBox = document.getElementById("exportPresetBox");
    var status = document.getElementById("text_lipExportStatus");
    var okBtn = document.getElementById("dialogView_export_ok");
    if (lipOptions) { lipOptions.style.display = isLip ? "" : "none"; }
    if (spriteOptions) { spriteOptions.style.display = isLip ? "none" : ""; }
    if (presetBox) { presetBox.style.display = isLip ? "none" : ""; }
    if (status) { status.style.display = isLip ? "" : "none"; }
    if (okBtn) { okBtn.innerHTML = isLip ? "开始导出" : "导出 PNG"; }
    // 手动录屏是手机端专属：桌面端隐藏这个标签，DOM 与逻辑仍保留，保证三份代码一致
    var tabManual = document.getElementById("button_lipExportTabManual");
    if (tabManual) { tabManual.style.display = lipManualSupported() ? "" : "none"; }
    if (!isLip) {
        // 文件名默认用当前立绘名；换过立绘才覆盖，保留用户手打的名称
        var nameInput = document.getElementById("input_exportFileName");
        if (nameInput) {
            if (nameInput.dataset.actor !== nowActor) {
                nameInput.dataset.actor = nowActor;
                nameInput.value = nowActor || "";
            }
        }
        // 预设码文本框每次打开都按当前勾选重新生成
        var codeEl = document.getElementById("text_exportPresetCode");
        if (codeEl) {
            var code = buildCurrentPresetCode();
            codeEl.value = code || "请先选择立绘";
        }
    }
    // 默认选中：手机端「手动录屏」，桌面端「MP4输出」
    lipSelectExportKind(isLip ? (lipManualSupported() ? "manual" : "mp4") : lipExportKind);
    if (lipExportHideTimer) {
        clearTimeout(lipExportHideTimer);
        lipExportHideTimer = null;
    }
    box.style.display = "flex";
    bg.style.display = "block";
    box.style.animation = "showDialog 0.3s forwards ease";
    bg.style.animation = "showDialog_BackGround 0.3s forwards ease";
}
function lipHideExportView() {
    var box = document.getElementById("dialogView_export");
    var bg = document.getElementById("dialogView_export_backGround");
    if (!box || !bg) { return; }
    lipHideSaveProgress(); // 关闭面板时一并隐藏进度条
    if (box.style.display !== "flex") { return; } // 本来就没打开，不重复播放关闭动画
    box.style.animation = "hideDialog 0.3s forwards ease";
    bg.style.animation = "hideDialog_BackGround 0.3s forwards ease";
    if (lipExportHideTimer) { clearTimeout(lipExportHideTimer); }
    lipExportHideTimer = setTimeout(function () {
        lipExportHideTimer = null;
        box.style.display = "none";
        bg.style.display = "none";
    }, 300);
}

// 选择导出格式（透明 GIF / MP4输出 / 手动录屏）
// 背景色对 MP4 和手动录屏都有意义，只有 GIF 不使用
function lipSelectExportKind(kind) {
    // 桌面端不支持手动录屏：即使被程序调用也回落到 MP4输出
    if (kind === "manual" && !lipManualSupported()) { kind = "mp4"; }
    lipExportKind = kind === "mp4" ? "mp4" : (kind === "manual" ? "manual" : "gif");
    var isGif = lipExportKind === "gif";
    var isManual = lipExportKind === "manual";
    var tabGif = document.getElementById("button_lipExportTabGif");
    var tabMp4 = document.getElementById("button_lipExportTabMp4");
    var tabManual = document.getElementById("button_lipExportTabManual");
    if (tabGif) { tabGif.classList.toggle("lipExportTabActive", lipExportKind === "gif"); }
    if (tabMp4) { tabMp4.classList.toggle("lipExportTabActive", lipExportKind === "mp4"); }
    if (tabManual) { tabManual.classList.toggle("lipExportTabActive", isManual); }
    var bg = document.getElementById("input_lipMp4Bg");
    if (bg) { bg.disabled = isGif; }
    var bgHint = document.getElementById("text_lipExportBgHint");
    if (bgHint) {
        bgHint.innerHTML = isGif ? "GIF 不使用" : (isManual ? "录屏底色" : "仅 MP4 使用");
    }
    var manualRow = document.getElementById("lipExportManualRow");
    if (manualRow) { manualRow.style.display = isManual ? "" : "none"; }
    // 手动录屏只保留背景色和等待时间：尺寸、帧数对它没有意义，直接隐藏，不留空行
    var sizeRow = document.getElementById("lipExportSizeRow");
    if (sizeRow) { sizeRow.style.display = isManual ? "none" : ""; }
    var fpsRow = document.getElementById("lipExportFpsRow");
    if (fpsRow) { fpsRow.style.display = isManual ? "none" : ""; }
    // 手动录屏不生成文件，按钮文案改成“开始录屏”
    var okBtn = document.getElementById("dialogView_export_ok");
    if (okBtn && nowMode === "lip") {
        okBtn.innerHTML = isManual ? "开始录屏" : "开始导出";
    }
}

// 开始导出：GIF / MP4 沿用原有两条流程；手动录屏只做全屏演示，不生成文件
function lipStartExport() {
    lipCommitExportFps(); // 先让输入框里的帧数生效
    if (lipExportKind === "manual") {
        lipStartManual();
        return;
    }
    if (lipExportKind === "mp4") {
        lipExportMp4();
    }
    else {
        lipExportGif();
    }
}

// ============================================================
// 手动录屏：全屏演示（不生成任何文件，也不走保存链路）
// 时间线：铺满背景色 → 倒计时 N 秒 → 从 0 播放一遍 → 左上角结束卡闪 2 秒 → 自动退出
// ============================================================

// 读取开始等待时间：默认 5 秒，限制在 0~60 秒
function lipGetManualWait() {
    var el = document.getElementById("input_lipManualWait");
    var v = el ? Number(el.value) : NaN;
    if (!isFinite(v)) { return 5; }
    v = Math.round(v);
    if (v < 0) { v = 0; }
    if (v > 60) { v = 60; }
    return v;
}
// 把输入框里的等待时间规整后再写回（回车 / 失焦时调用）
function lipCommitManualWait() {
    var el = document.getElementById("input_lipManualWait");
    if (!el) { return; }
    el.value = lipGetManualWait();
}

// 按立绘比例把画布铺进全屏遮罩：保证整张立绘完整显示，并居中
function lipResizeManualCanvas() {
    var stage = lipManual.stage || document.getElementById("lipManualStage");
    var cv = lipManual.canvas || document.getElementById("lipManualCanvas");
    if (!stage || !cv || !canvasSizeX || !canvasSizeY) { return; }
    var sw = stage.clientWidth || window.innerWidth || 1;
    var sh = stage.clientHeight || window.innerHeight || 1;
    var scale = Math.min(sw / canvasSizeX, sh / canvasSizeY);
    if (!(scale > 0)) { scale = 1; }
    var w = Math.max(1, Math.round(canvasSizeX * scale));
    var h = Math.max(1, Math.round(canvasSizeY * scale));
    var dpr = window.devicePixelRatio || 1;
    cv.width = Math.max(1, Math.round(w * dpr));
    cv.height = Math.max(1, Math.round(h * dpr));
    cv.style.width = w + "px";
    cv.style.height = h + "px";
    lipManual.ctx = cv.getContext("2d");
}

// 画一帧全屏画面：只画立绘，背景保持透明，露出遮罩铺的底色
function lipDrawManualFrame(t) {
    var cv = lipManual.canvas || document.getElementById("lipManualCanvas");
    if (!cv) { return; }
    var ctx = lipManual.ctx || cv.getContext("2d");
    if (!ctx) { return; }
    lipManual.ctx = ctx;
    lipDrawScene(ctx, cv.width || 1, cv.height || 1, lipState.smooth, null, t || 0);
}

// 窗口尺寸变化时重新铺画布（只在演示中生效）
function lipManualOnResize() {
    if (!lipManual.active) { return; }
    lipResizeManualCanvas();
    lipDrawManualFrame(lipState.playing ? (lipGetAudioEl().currentTime || 0) : 0);
}

// 开始手动录屏：检查素材 → 铺满背景 → 进入全屏遮罩 → 倒计时 → 播放
function lipStartManual() {
    // 桌面端没有 plus，手动录屏不启用（标签也已隐藏，这里再兜底一次）
    if (!lipManualSupported()) { tip("手动录屏仅支持手机端"); return; }
    lipCommitManualWait();
    if (lipState.exporting) { tip("正在导出中，请稍等"); return; }
    if (!lipState.file || !lipState.envelope) { tip("请先选择并等待音频分析完成"); return; }
    if (!lipState.staticReady) { tip("立绘还在加载，请稍等"); return; }
    if (lipManual.active) { return; }

    var stage = document.getElementById("lipManualStage");
    var cv = document.getElementById("lipManualCanvas");
    var cd = document.getElementById("lipManualCountdown");
    var card = document.getElementById("lipManualEndCard");
    if (!stage || !cv || !cd || !card) { tip("全屏演示界面缺少元素"); return; }

    var bgEl = document.getElementById("input_lipMp4Bg");
    lipManual.bg = (bgEl && bgEl.value) ? bgEl.value : "#0000FF";
    lipManual.wait = lipGetManualWait();
    lipManual.active = true;
    lipManual.ended = false;
    lipManual.stage = stage;
    lipManual.canvas = cv;
    lipManual.countdownEl = cd;
    lipManual.endCardEl = card;

    lipHideExportView();
    lipStopPlayback(); // 回到开头，停掉预览动画
    stage.style.background = lipManual.bg;
    stage.classList.add("lipManualOn");
    card.classList.remove("lipManualOn");
    cd.classList.remove("lipManualOn");
    lipResizeManualCanvas();
    lipDrawManualFrame(0);
    window.addEventListener("resize", lipManualOnResize);

    if (lipManual.wait <= 0) {
        lipManualBeginPlayback();
        return;
    }
    // 倒计时：每秒减 1，数字归零时立刻开始播放
    var left = lipManual.wait;
    cd.innerHTML = left;
    cd.classList.add("lipManualOn");
    lipManual.countdownTimer = setInterval(function () {
        left--;
        if (left <= 0) {
            clearInterval(lipManual.countdownTimer);
            lipManual.countdownTimer = 0;
            cd.classList.remove("lipManualOn");
            lipManualBeginPlayback();
            return;
        }
        cd.innerHTML = left;
    }, 1000);
}

// 倒计时结束：从头播放一遍对口型内容
function lipManualBeginPlayback() {
    if (!lipManual.active) { return; }
    var audio = lipGetAudioEl();
    try { audio.currentTime = 0; } catch (e) { }
    lipManual.ended = false;
    lipPlay();
}

// 播放结束：停住画面，左上角闪 2 秒结束卡，然后自动退出
function lipManualFinish() {
    if (!lipManual.active || lipManual.ended) { return; }
    lipManual.ended = true;
    var audio = lipGetAudioEl();
    try { audio.pause(); } catch (e) { }
    lipState.playing = false;
    if (lipState.rafId) {
        cancelAnimationFrame(lipState.rafId);
        lipState.rafId = 0;
    }
    lipDrawManualFrame(lipState.duration);
    if (lipManual.endCardEl) { lipManual.endCardEl.classList.add("lipManualOn"); }
    lipManual.endTimer = setTimeout(function () {
        lipManual.endTimer = 0;
        lipManualExit();
    }, 2000);
}

// 退出全屏演示：收掉遮罩 / 倒计时 / 结束卡，恢复主界面
function lipManualExit() {
    if (!lipManual.active) { return; }
    lipManual.active = false;
    lipManual.ended = false;
    if (lipManual.countdownTimer) { clearInterval(lipManual.countdownTimer); lipManual.countdownTimer = 0; }
    if (lipManual.endTimer) { clearTimeout(lipManual.endTimer); lipManual.endTimer = 0; }
    if (lipManual.countdownEl) { lipManual.countdownEl.classList.remove("lipManualOn"); }
    if (lipManual.endCardEl) { lipManual.endCardEl.classList.remove("lipManualOn"); }
    var stage = lipManual.stage || document.getElementById("lipManualStage");
    if (stage) { stage.classList.remove("lipManualOn"); }
    var cv = lipManual.canvas || document.getElementById("lipManualCanvas");
    if (cv && cv.getContext) {
        var ctx = cv.getContext("2d");
        if (ctx) { ctx.clearRect(0, 0, cv.width, cv.height); }
    }
    window.removeEventListener("resize", lipManualOnResize);
    lipStopPlayback(); // 回到开头，重画主界面预览
}

// 按累计时间取整计算每帧的 GIF 延时（单位 1/100 秒）。
// GIF 的延时精度只有 10ms，像 30fps 这种除不尽的帧率用固定延时会让总时长漂移，
// 这里逐帧取整，误差不会累积。
function lipGifFrameDelayCs(frameIndex, fps) {
    var next = Math.round(100 * (frameIndex + 1) / fps);
    var prev = Math.round(100 * frameIndex / fps);
    return Math.max(1, next - prev);
}

// 导出透明 GIF
function lipExportGif() {
    if (lipState.exporting) { tip("正在导出中，请稍等"); return; }
    if (!lipState.envelope) { tip("请先选择一段音频"); return; }
    if (!lipState.staticReady || !lipRegionsReady()) {
        // 图层 / 区间快照图片还没加载完，稍等一下再开始，避免导出缺图层
        lipSetExportStatus("正在准备图层...");
        setTimeout(lipExportGif, 200);
        return;
    }

    var fps = lipGetExportFps(); // 导出帧率（与 MP4 共用设置）
    var width = Number(document.getElementById("input_lipExportSize").value) || 360;
    var height = Math.max(2, Math.round(width * canvasSizeY / canvasSizeX));
    lipState.exporting = true;
    lipSetExportStatus("准备导出 GIF...");

    // 导出前先暂停，避免和预览抢时间
    lipPause();

    var oc = document.createElement("canvas");
    oc.width = width;
    oc.height = height;
    var octx = oc.getContext("2d", { willReadFrequently: true });

    var total = Math.max(1, Math.round(lipState.duration * fps));

    // 1. 用少量采样帧生成调色板
    var samples = [];
    for (var s = 0; s < 8; s++) {
        samples.push(lipState.duration * (s + 0.5) / 8);
    }
    // 区间样式可能只占很短一段，额外采一下每个区间的开头，避免调色板缺色
    for (var sr = 0; sr < lipState.regions.length; sr++) {
        samples.push(Math.min(lipState.duration, lipState.regions[sr].start + 0.05));
    }
    var pal = lipBuildGifPalette(samples, octx, width, height);
    var palette = pal.palette;
    var bucketMap = new Int16Array(32768);
    bucketMap.fill(-1);
    for (var pk = 0; pk < pal.paletteKeys.length; pk++) {
        bucketMap[pal.paletteKeys[pk]] = pk;
    }

    // 2. GIF 文件头 + 全局调色板 + 循环扩展
    var header = new Uint8Array([
        0x47, 0x49, 0x46, 0x38, 0x39, 0x61, // GIF89a
        width & 0xFF, (width >> 8) & 0xFF,
        height & 0xFF, (height >> 8) & 0xFF,
        0xF7, // 有全局调色板，颜色深度 8，表大小 256
        0x00, // 背景色索引
        0x00  // 像素宽高比
    ]);
    var paletteBytes = new Uint8Array(256 * 3);
    for (var pi = 0; pi < 255; pi++) {
        paletteBytes[pi * 3] = palette[pi][0];
        paletteBytes[pi * 3 + 1] = palette[pi][1];
        paletteBytes[pi * 3 + 2] = palette[pi][2];
    }
    // 索引 255 作为透明色，颜色值随意
    var netscape = new Uint8Array([
        0x21, 0xFF, 0x0B,
        78, 69, 84, 83, 67, 65, 80, 69, 50, 46, 48, // NETSCAPE2.0
        0x03, 0x01, 0x00, 0x00, 0x00
    ]);

    var parts = [header, paletteBytes, netscape];

    function buildFrame(t, delayCs) {
        lipDrawScene(octx, width, height, lipOpennessAt(t), null, t);
        var data = octx.getImageData(0, 0, width, height).data;
        var indices = new Uint8Array(width * height);
        for (var p = 0, j = 0; j < indices.length; j++, p += 4) {
            if (data[p + 3] < 100) { // 半透明边缘也按透明处理，避免黑边
                indices[j] = 255;
                continue;
            }
            var key = ((data[p] >> 3) << 10) | ((data[p + 1] >> 3) << 5) | (data[p + 2] >> 3);
            var ci = bucketMap[key];
            if (ci < 0) {
                ci = lipNearestColor(palette, data[p], data[p + 1], data[p + 2]);
                bucketMap[key] = ci;
            }
            indices[j] = ci;
        }
        var gce = new Uint8Array([
            0x21, 0xF9, 0x04,
            0x09, // 处置方式=2（恢复背景），带透明色
            delayCs & 0xFF, (delayCs >> 8) & 0xFF,
            0xFF, // 透明色索引
            0x00
        ]);
        var desc = new Uint8Array([
            0x2C,
            0x00, 0x00, 0x00, 0x00,
            width & 0xFF, (width >> 8) & 0xFF,
            height & 0xFF, (height >> 8) & 0xFF,
            0x00 // 无局部调色板，不隔行
        ]);
        var lzw = lipGifLzwBlocks(indices, 8);
        var minSize = new Uint8Array([8]);
        return [gce, desc, minSize, lzw];
    }

    // 3. 逐帧编码（每帧之间让出主线程刷新进度）
    var frame = 0;
    function nextFrame() {
        if (frame >= total) {
            parts.push(new Uint8Array([0x3B])); // GIF 结束符
            var blob = new Blob(parts, { type: "image/gif" });
            lipDownloadBlob(blob, lipSafeFileName() + "_对口型.gif");
            lipSetExportStatus("GIF 导出完成（" + total + " 帧）");
            tip("GIF 导出完成");
            lipState.exporting = false;
            return;
        }
        var t = frame / fps;
        var frameParts;
        try {
            frameParts = buildFrame(t, lipGifFrameDelayCs(frame, fps));
        } catch (e) {
            console.error("GIF 编码失败", e);
            lipSetExportStatus("GIF 编码失败");
            lipState.exporting = false;
            return;
        }
        for (var i = 0; i < frameParts.length; i++) { parts.push(frameParts[i]); }
        frame++;
        lipSetExportStatus("正在生成 GIF... " + Math.round(frame / total * 100) + "%");
        // 每两帧让出一次主线程
        if (frame % 2 === 0) { lipYield().then(nextFrame); }
        else { setTimeout(nextFrame, 0); }
    }
    nextFrame();
}

// ============================================================
// 七、导出蓝底视频（MediaRecorder 实时录制）
// ============================================================

// 挑选当前环境支持的录制格式，优先 MP4
function lipPickVideoMime() {
    if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) { return ""; }
    var list = [
        "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
        "video/mp4;codecs=avc1",
        "video/mp4",
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm"
    ];
    for (var i = 0; i < list.length; i++) {
        if (MediaRecorder.isTypeSupported(list[i])) { return list[i]; }
    }
    return "";
}

function lipExportMp4() {
    if (lipState.exporting) { tip("正在导出中，请稍等"); return; }
    if (!lipState.envelope) { tip("请先选择一段音频"); return; }
    if (!lipState.staticReady || !lipRegionsReady()) {
        lipSetExportStatus("正在准备图层...");
        setTimeout(lipExportMp4, 200);
        return;
    }
    if (typeof MediaRecorder === "undefined" || !HTMLCanvasElement.prototype.captureStream) {
        tip("当前环境不支持视频录制");
        return;
    }

    lipPause();
    lipState.exporting = true;
    lipState.cancelRecording = false;

    var fps = lipGetExportFps(); // 导出帧率（与 GIF 共用设置）
    var width = Number(document.getElementById("input_lipExportSize").value) || 360;
    var height = Math.max(2, Math.round(width * canvasSizeY / canvasSizeX));
    var cv = document.createElement("canvas");
    cv.width = width;
    cv.height = height;
    var ctx = cv.getContext("2d");
    lipState.exportCanvas = cv;
    lipState.exportCtx = ctx;
    lipState.exportW = width;
    lipState.exportH = height;
    lipState.exportBg = document.getElementById("input_lipMp4Bg").value || "#0000FF";
    lipDrawScene(ctx, width, height, 0, lipState.exportBg);

    var stream;
    try {
        stream = cv.captureStream(fps);
    } catch (e) {
        tip("无法录制画布：" + (e.message || e));
        lipState.exporting = false;
        return;
    }

    // 把音频轨塞进视频流里（浏览器不支持时也能继续录无声视频）
    try {
        var actx = lipGetAudioCtx();
        if (actx.state === "suspended") { actx.resume(); }
        var src = lipEnsureMediaSource();
        if (!lipState.mediaDest) {
            lipState.mediaDest = actx.createMediaStreamDestination();
            src.connect(lipState.mediaDest);
        }
        var tracks = lipState.mediaDest.stream.getAudioTracks();
        for (var i = 0; i < tracks.length; i++) { stream.addTrack(tracks[i]); }
    } catch (e) {
        console.warn("抓取音轨失败，将录制无声视频", e);
    }

    var mime = lipPickVideoMime();
    var rec;
    try {
        var recOpts = { videoBitsPerSecond: 4000000 };
        if (mime) { recOpts.mimeType = mime; }
        rec = new MediaRecorder(stream, recOpts);
    } catch (e) {
        tip("创建录制器失败：" + (e.message || e));
        lipState.exporting = false;
        return;
    }

    var chunks = [];
    rec.ondataavailable = function (e) {
        if (e.data && e.data.size > 0) { chunks.push(e.data); }
    };
    var stopped = new Promise(function (resolve) { rec.onstop = resolve; });
    lipState.recorder = rec;

    lipSetExportStatus("开始录制，请等待音频播放完...");
    lipState.recording = true;
    lipState.exportFps = fps;
    lipState.exportLastDrawAt = 0;
    lipState.smooth = 0;
    lipState.playing = true;
    lipState.lastTick = performance.now();
    document.getElementById("button_lipPlay").innerHTML = "暂停";
    lipStartLoop();
    rec.start(250);

    var audio = lipGetAudioEl();
    try { audio.currentTime = 0; } catch (e) { }
    audio.play().catch(function (err) {
        console.error("播放失败", err);
        tip("播放失败：" + (err.message || err));
        if (lipState.recordResolve) { lipState.recordResolve(); }
    });

    // 等音频播完（用户中途暂停/离开模式时提前结束）
    var waitDone = new Promise(function (resolve) {
        var finished = false;
        var timer = null;
        var poll = null;
        function finish() {
            if (finished) { return; }
            finished = true;
            lipState.recordResolve = null;
            audio.removeEventListener("ended", finish);
            if (timer) { clearTimeout(timer); }
            if (poll) { clearInterval(poll); }
            lipState.playing = false;
            if (lipState.rafId) {
                cancelAnimationFrame(lipState.rafId);
                lipState.rafId = 0;
            }
            resolve();
        }
        lipState.recordResolve = finish;
        timer = setTimeout(finish, (lipState.duration + 5) * 1000);
        audio.addEventListener("ended", finish);
        // 轮询兜底：暂停或切换模式时也能结束
        poll = setInterval(function () {
            if (!lipState.playing || lipState.cancelRecording) { finish(); }
        }, 200);
    });

    waitDone.then(function () {
        lipState.recording = false;
        var btn = document.getElementById("button_lipPlay");
        if (btn) { btn.innerHTML = "播放"; }
        return new Promise(function (resolve) {
            // 再录 250ms 收尾，避免最后一帧丢失
            setTimeout(function () {
                try { rec.stop(); } catch (e) { console.warn(e); }
                resolve();
            }, 250);
        });
    }).then(function () {
        return stopped;
    }).then(function () {
        lipState.exporting = false;
        lipState.exportCanvas = null;
        lipState.exportCtx = null;
        lipSetExportStatus("");
        if (lipState.cancelRecording) {
            lipState.cancelRecording = false;
            return; // 中途离开模式，丢弃本次录制
        }
        var blob = new Blob(chunks, { type: (rec.mimeType || mime || "video/webm").split(";")[0] });
        var isMp4 = blob.type.indexOf("mp4") >= 0;
        var ext = isMp4 ? ".mp4" : ".webm";
        lipDownloadBlob(blob, lipSafeFileName() + "_蓝底对口型" + ext);
        if (isMp4) {
            lipSetExportStatus("MP4 导出完成");
            tip("MP4 导出完成");
        }
        else {
            lipSetExportStatus("当前环境不支持 MP4，已导出 WebM");
            tip("当前环境不支持 MP4，已导出 WebM", 3000);
        }
    }).catch(function (err) {
        console.error("录制失败", err);
        lipState.recording = false;
        lipState.exporting = false;
        lipSetExportStatus("录制失败");
        tip("录制失败：" + (err && err.message ? err.message : err));
    });
}

// ============================================================
// 八、界面事件绑定
// ============================================================

document.getElementById("input_lipAudio").onchange = function () {
    var file = this.files && this.files[0];
    this.value = ""; // 清空，允许重复选择同一个文件
    if (!file) { return; }
    lipLoadFile(file);
};

document.getElementById("input_lipProgress").oninput = function () {
    var dur = lipState.duration || lipGetAudioEl().duration || 0;
    if (!dur) { return; }
    var audio = lipGetAudioEl();
    var t = dur * Number(this.value) / 1000;
    try { audio.currentTime = t; } catch (e) { }
    lipState.smooth = lipOpennessAt(t);
    lipDrawPreviewNow(true);
    lipUpdateProgress(t);
};

// 播放时间文本：点击进入编辑；回车跳转；Esc 或失焦恢复文本显示
document.getElementById("text_lipTime").onclick = lipBeginTimeEdit;
document.getElementById("input_lipTimeJump").onkeydown = function (e) {
    var key = e.key || "";
    if (key === "Enter" || key === "NumpadEnter" || e.keyCode === 13) {
        e.preventDefault();
        lipCommitTimeEdit();
    }
    else if (key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        lipEndTimeEdit();
    }
};
document.getElementById("input_lipTimeJump").onblur = function () {
    lipEndTimeEdit();
};

// 片段起止时间输入：回车或失焦生效（解析规则同播放时间输入）
function lipBindRegionTimeInput(input, field) {
    if (!input) { return; }
    input.onkeydown = function (e) {
        var key = e.key || "";
        if (key === "Enter" || key === "NumpadEnter" || e.keyCode === 13) {
            e.preventDefault();
            input.blur(); // 走 blur 统一提交，避免重复生效
        }
    };
    input.onblur = function () { lipCommitRegionTime(field); };
}
lipBindRegionTimeInput(document.getElementById("input_lipRegionStart"), "start");
lipBindRegionTimeInput(document.getElementById("input_lipRegionEnd"), "end");

document.getElementById("input_lipSensitivity").oninput = function () {
    lipState.sensitivity = Number(this.value) / 100;
    document.getElementById("text_lipSensitivity").innerHTML = this.value + "%";
    lipDrawPreviewNow(true);
};

document.getElementById("input_lipSmooth").oninput = function () {
    lipState.smoothLevel = Number(this.value) / 100;
    document.getElementById("text_lipSmooth").innerHTML = this.value + "%";
};

// 动画：是否上下浮动
document.getElementById("input_lipBob").onchange = function () {
    lipState.bobEnabled = this.checked;
    lipDrawPreviewNow(true);
};

// 动画：浮动幅度
document.getElementById("input_lipBobAmp").oninput = function () {
    lipState.bobAmp = Number(this.value);
    document.getElementById("text_lipBobAmp").innerHTML = this.value + "%";
    lipDrawPreviewNow(true);
};

// 动画：浮动频率（滑条 10~60 对应 1.0~6.0Hz）
document.getElementById("input_lipBobFreq").oninput = function () {
    lipState.bobFreq = Number(this.value) / 10;
    document.getElementById("text_lipBobFreq").innerHTML = lipState.bobFreq.toFixed(1) + "Hz";
    lipDrawPreviewNow(true);
};

// 片段衔接：是否启用交接处的“挤压—回弹”过渡（默认关闭）
document.getElementById("input_lipTransition").onchange = function () {
    lipState.transitionOn = this.checked;
    lipDrawPreviewNow(true);
};

// 片段衔接：挤压时长（交接前压扁用多久，滑条 10~100 对应 0.10~1.00 秒）
document.getElementById("input_lipTransitionSqueezeDur").oninput = function () {
    lipState.transitionSqueezeDur = Number(this.value) / 100;
    document.getElementById("text_lipTransitionSqueezeDur").innerHTML = lipState.transitionSqueezeDur.toFixed(2) + "s";
    lipDrawPreviewNow(true);
};

// 片段衔接：回弹时长（交接后弹回并过冲衰减用多久，滑条 10~100 对应 0.10~1.00 秒）
document.getElementById("input_lipTransitionReboundDur").oninput = function () {
    lipState.transitionReboundDur = Number(this.value) / 100;
    document.getElementById("text_lipTransitionReboundDur").innerHTML = lipState.transitionReboundDur.toFixed(2) + "s";
    lipDrawPreviewNow(true);
};

// 片段衔接：挤压幅度
document.getElementById("input_lipTransitionSquash").oninput = function () {
    lipState.transitionSquash = Number(this.value);
    document.getElementById("text_lipTransitionSquash").innerHTML = this.value + "%";
    lipDrawPreviewNow(true);
};

// 片段衔接：回弹强度（越大过冲越明显、稳定越慢）
document.getElementById("input_lipTransitionRebound").oninput = function () {
    lipState.transitionRebound = Number(this.value);
    document.getElementById("text_lipTransitionRebound").innerHTML = this.value + "%";
    lipDrawPreviewNow(true);
};

// ---------- 说明弹框 ----------
// 朗读面板各标题右侧的问号统一走这里：内容按功能分开维护，弹框复用现有 showDialog 外壳与动画
var lipHelpTexts = {
    main: {
        title: "朗读对口型",
        content: "上传一段朗读音频，立绘会根据音量、音高大致张嘴。\n导出选项在右上角「导出」按钮里。"
    },
    audio: {
        title: "音频",
        content: "点「选择音频」上传一段朗读音频（mp3 / wav / m4a 等）。\n上传后会自动分析口型，进度和结果显示在下方。"
    },
    preview: {
        title: "预览",
        content: "点「播放」试听音频并实时预览口型，点「停止」结束播放。\n下方进度条同时是片段时间轴：可以点击或拖动定位，上面的色块代表片段，点色块可选中片段。"
    },
    regions: {
        title: "立绘样式关键帧",
        content: "在不同时间段内显示立绘的不同样式。\n点「创建片段」添加片段；选中某个片段后，修改立绘样式会自动保存到该片段。\n片段内的嘴部仍会根据音频自动对口型。"
    },
    mouth: {
        title: "口型",
        content: "灵敏度越高，张嘴幅度越大；平滑越高，口型变化越柔和。\n具体嘴部素材会根据当前立绘自动匹配。"
    },
    bob: {
        title: "动画",
        content: "开启「说话时上下浮动」后，立绘会随声音轻微上下浮动。\n幅度控制浮动大小，频率控制浮动快慢。"
    },
    transition: {
        title: "片段衔接",
        content: "只在首尾相接的两个片段之间生效，默认关闭。\n开启后交接处会先挤压再回弹：挤压/回弹时长控制两段动画的时长，挤压幅度与回弹强度控制形变大小。"
    },
    preset: {
        title: "立绘预设码",
        content: "预设码记录人物 id 和各个图层的序号，可以直接复制分享。\n在选立绘界面粘贴后点「导入」，会切换到对应立绘并还原图层。\n对口型模式下嘴部由音频驱动，导入时会忽略预设里的嘴部。"
    },
    exportPreset: {
        title: "导出与预设码",
        content: "立绘 / 表情包模式：填写文件名后导出 PNG，下方的预设码可以复制分享。\n"
            + "朗读对口型的 GIF / MP4 不推荐：手机端要先把成品转成 base64，再经桥接写入文件，文件越大越慢，"
            + "写入期间界面会无响应，几 MB 就要几分钟。\n"
            + "推荐用「手动录屏」配合手机自带录屏：倒计时结束开始播放，播完停止录屏，瞬间完成。"
    },
    presetRegion: {
        title: "片段预设码",
        content: "复制当前片段的预设码，或粘贴别人的片段预设码导入。\n预设码会记录图层和嘴部序号；对口型模式导入时嘴部仍跟随音频，不会被覆盖。"
    }
};
function lipShowHelp(key) {
    var item = lipHelpTexts[key];
    if (!item) { return; }
    showDialog(item.title, item.content);
}

// 导出帧数输入：回车或失焦时校验，非法输入回到上次有效值
var lipExportFpsInput = document.getElementById("input_lipExportFps");
if (lipExportFpsInput) {
    lipExportFpsInput.onkeydown = function (e) {
        if (e.key === "Enter") { e.preventDefault(); lipCommitExportFps(); this.blur(); }
    };
    lipExportFpsInput.onblur = lipCommitExportFps;
}

// 手动录屏的开始等待时间：回车或失焦时夹到 0~60 秒
var lipManualWaitInput = document.getElementById("input_lipManualWait");
if (lipManualWaitInput) {
    lipManualWaitInput.onkeydown = function (e) {
        if (e.key === "Enter") { e.preventDefault(); lipCommitManualWait(); this.blur(); }
    };
    lipManualWaitInput.onblur = lipCommitManualWait;
}

// 音频自然播放结束
document.getElementById("lipAudio").addEventListener("ended", function () {
    // 手动录屏：播放一遍结束，进入结束卡流程
    if (lipManual.active) { lipManualFinish(); return; }
    if (lipState.recording) { return; } // 录制流程自己会收尾
    lipState.playing = false;
    if (lipState.rafId) {
        cancelAnimationFrame(lipState.rafId);
        lipState.rafId = 0;
    }
    var btn = document.getElementById("button_lipPlay");
    if (btn) { btn.innerHTML = "播放"; }
    lipState.smooth = 0;
    lipDrawPreviewNow(true);
    lipUpdateProgress(0);
});

// 兜底刷新：窗口最小化等情况下 rAF 会被节流，用 timeupdate 保证口型仍在推进
document.getElementById("lipAudio").addEventListener("timeupdate", function () {
    if (!lipState.playing) { return; }
    var now = performance.now();
    if (lipState.lastFrameAt && now - lipState.lastFrameAt < 300) { return; }
    var t = this.currentTime || 0;
    lipState.smooth = lipOpennessAt(t);
    lipDrawPreviewNow(true);
    lipUpdateProgress(t);
});

// 切换立绘时 decideView 会重新加载立绘 js；若正处于朗读模式，让预览跟着刷新
// （render() 里已经会调用 lipOnSpriteChanged，这里不需要额外监听）
