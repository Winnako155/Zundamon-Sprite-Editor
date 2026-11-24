// 关闭回调：showDialog 第三个参数传入函数时，在关闭动画结束后执行一次
var dialogViewOnClose = null;
var dialogViewHideTimer = 0;

function showDialog(title, content, onClose) {
    // 新弹框替换旧内容前先取消未完成的关闭定时器，避免它把新弹框一起隐藏
    if (dialogViewHideTimer) {
        clearTimeout(dialogViewHideTimer);
        dialogViewHideTimer = 0;
    }
    dialogViewOnClose = (typeof onClose === "function") ? onClose : null;
    document.getElementById("dialogView_title").innerHTML = title;
    document.getElementById("dialogView_content").innerHTML = content.replace(/\n/g, "<br>");
    //说明弹窗可能从导出/预设/选立绘等更高层的界面打开，临时提到最上层
    document.getElementById("dialogView").style.zIndex = "10010";
    document.getElementById("dialogView_backGround").style.zIndex = "10009";
    document.getElementById("dialogView").style.display = "flex";
    document.getElementById("dialogView_backGround").style.display = "flex";
    document.getElementById("dialogView").style.animation = "showDialog 0.3s forwards ease";
    document.getElementById("dialogView_backGround").style.animation = "showDialog_BackGround 0.3s forwards ease";
}
function hideDialogView() {
    document.getElementById("dialogView").style.animation = "hideDialog 0.3s forwards ease";
    document.getElementById("dialogView_backGround").style.animation = "hideDialog_BackGround 0.3s forwards ease";
    if (dialogViewHideTimer) {
        clearTimeout(dialogViewHideTimer);
    }
    dialogViewHideTimer = setTimeout(() => {
        dialogViewHideTimer = 0;
        document.getElementById("dialogView").style.display = "none";
        document.getElementById("dialogView_backGround").style.display = "none";
        //还原层级，避免影响复用同一遮罩的模式选择弹窗
        document.getElementById("dialogView").style.zIndex = "";
        document.getElementById("dialogView_backGround").style.zIndex = "";
        //收起动画结束后再执行关闭回调：下一个弹框复用同一个遮罩，提前弹会被动画收掉
        var cb = dialogViewOnClose;
        dialogViewOnClose = null;
        if (cb) { cb(); }
    }, 300);
}

//确认对话框：点“确定”执行回调，点“取消”只关闭
//用于切换立绘这类会丢失已有数据（片段）的操作
var confirmViewCallback = null;
function showConfirmView(title, content, onOk) {
    confirmViewCallback = onOk || null;
    document.getElementById("dialogView_confirm_title").innerHTML = title;
    document.getElementById("dialogView_confirm_content").innerHTML = content.replace(/\n/g, "<br>");
    var box = document.getElementById("dialogView_confirm");
    var bg = document.getElementById("dialogView_confirm_backGround");
    box.style.display = "flex";
    bg.style.display = "block";
    box.style.animation = "showDialog 0.3s forwards ease";
    bg.style.animation = "showDialog_BackGround 0.3s forwards ease";
}
function hideConfirmView() {
    confirmViewCallback = null;
    var box = document.getElementById("dialogView_confirm");
    var bg = document.getElementById("dialogView_confirm_backGround");
    box.style.animation = "hideDialog 0.3s forwards ease";
    bg.style.animation = "hideDialog_BackGround 0.3s forwards ease";
    setTimeout(() => {
        box.style.display = "none";
        bg.style.display = "none";
    }, 300);
}
function confirmViewOk() {
    var cb = confirmViewCallback;
    confirmViewCallback = null; //先清掉，避免重复触发
    hideConfirmView();
    if (cb) { cb(); }
}

//更新下载对话框：三个下载渠道
var updateDownloadUrls = {
    "123pan": "https://1814681618.share.123pan.cn/123pan/MO1cVv-Cbqav",
    "lanzou": "https://wwazp.lanzouw.com/b00ybc45eh",
    "github": "https://github.com/Winnako155/Zundamon-Sprite-Editor"
};
var lanzouPassword = "zunzun"; //蓝奏云提取码
//info: checkGitHubVersion 的返回结果，用于展示版本号与 Release 介绍
function showDialogUpdate(info) {
    info = info || {};
    var title = "发现新版本";
    if (info.latestVersion) {
        title += " " + info.latestVersion;
    }
    document.getElementById("dialogView_update_title").innerText = title;
    //直接使用 Release 正文(含换行与图片标签)，靠 CSS 的 white-space:pre-wrap 保留换行
    document.getElementById("dialogView_update_content").innerHTML = info.releaseBody
        || "检测到有新版本啦！请选择一个渠道前往下载：";
    document.getElementById("dialogView_update").style.display = "flex";
    document.getElementById("dialogView_update_backGround").style.display = "flex";
    document.getElementById("dialogView_update").style.animation = "showDialog 0.3s forwards ease";
    document.getElementById("dialogView_update_backGround").style.animation = "showDialog_BackGround 0.3s forwards ease";
}
function hideDialogViewUpdate() {
    document.getElementById("dialogView_update").style.animation = "hideDialog 0.3s forwards ease";
    document.getElementById("dialogView_update_backGround").style.animation = "hideDialog_BackGround 0.3s forwards ease";
    setTimeout(() => {
        document.getElementById("dialogView_update").style.display = "none";
        document.getElementById("dialogView_update_backGround").style.display = "none";
    }, 300);
}
//打开下载链接：手机端(HBuilderX/HTML5+)交给系统浏览器打开，电脑端直接新标签页跳转
function openDownload(channel) {
    var url = updateDownloadUrls[channel];
    if (!url) return;
    if (channel == "lanzou") {
        copyText(lanzouPassword);
        tip("蓝奏云提取码：" + lanzouPassword, 3000, "#d6d323ff");
    }
    if (typeof plus !== "undefined" && plus.runtime && plus.runtime.openURL) {
        plus.runtime.openURL(url);
    }
    else {
        window.open(url, "_blank");
    }
}
//复制文本到剪贴板：返回 true 表示已发起复制，false 表示环境不支持
function copyText(text){
    var str = String(text == null ? "" : text);
    if (typeof plus !== "undefined" && plus.navigator && plus.navigator.setClipboard) {
        plus.navigator.setClipboard(str);
        return true;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(str).catch(function(){});
        return true;
    }
    //老 WebView / 非安全上下文：退回到临时文本框 + execCommand
    try {
        var area = document.createElement("textarea");
        area.value = str;
        area.style.position = "fixed";
        area.style.left = "-9999px";
        area.style.top = "0";
        document.body.appendChild(area);
        area.select();
        area.setSelectionRange(0, area.value.length);
        var ok = document.execCommand("copy");
        document.body.removeChild(area);
        return ok;
    }
    catch (e) {
        console.error(e);
        return false;
    }
}
