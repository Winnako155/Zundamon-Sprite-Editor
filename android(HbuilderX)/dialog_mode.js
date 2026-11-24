function showDialogMode(title) {
    document.getElementById("dialogView_mode_title").innerHTML = title;
    document.getElementById("dialogView_mode").style.display = "flex";
    document.getElementById("dialogView_backGround").style.display = "flex";
    document.getElementById("dialogView_mode").style.animation = "showDialogMode 0.3s forwards ease";
    document.getElementById("dialogView_backGround").style.animation = "showDialog_BackGround 0.3s forwards ease";
}
function hideDialogViewMode() {
    document.getElementById("dialogView_mode").style.animation = "hideDialogMode 0.3s forwards ease";
    document.getElementById("dialogView_backGround").style.animation = "hideDialog_BackGround 0.3s forwards ease";
    setTimeout(() => {
        document.getElementById("dialogView_mode").style.display = "none";
        document.getElementById("dialogView_backGround").style.display = "none";
    }, 300);
}
document.getElementById("dialogView_mode_sprite").onclick = function(){
    switchMode("sprite");
}
document.getElementById("dialogView_mode_bqb").onclick = function(){
    switchMode("bqb");
}
document.getElementById("dialogView_mode_lip").onclick = function(){
    switchMode("lip");
}
//点击遮罩关闭模式选择窗：只有模式窗实际显示时才处理
//遮罩是模式窗的兄弟节点，点击窗口内部不会触发这里，不影响窗口内点击和模式切换
document.getElementById("dialogView_backGround").addEventListener("click", function(){
    var modeView = document.getElementById("dialogView_mode");
    if(modeView.style.display !== "flex"){ return; }
    hideDialogViewMode();
});