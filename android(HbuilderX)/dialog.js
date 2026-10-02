function showDialog(title, content) {
    document.getElementById("dialogView_title").innerHTML = title;
    document.getElementById("dialogView_content").innerHTML = content.replace(/\n/g, "<br>");
    document.getElementById("dialogView").style.display = "flex";
    document.getElementById("dialogView_backGround").style.display = "flex";
    document.getElementById("dialogView").style.animation = "showDialog 0.3s forwards ease";
    document.getElementById("dialogView_backGround").style.animation = "showDialog_BackGround 0.3s forwards ease";
}
function hideDialogView() {
    document.getElementById("dialogView").style.animation = "hideDialog 0.3s forwards ease";
    document.getElementById("dialogView_backGround").style.animation = "hideDialog_BackGround 0.3s forwards ease";
    setTimeout(() => {
        document.getElementById("dialogView").style.display = "none";
        document.getElementById("dialogView_backGround").style.display = "none";
    }, 300);
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
//复制文本到剪贴板
function copyText(text) {
    if (typeof plus !== "undefined" && plus.navigator && plus.navigator.setClipboard) {
        plus.navigator.setClipboard(text);
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function(){});
    }
}
