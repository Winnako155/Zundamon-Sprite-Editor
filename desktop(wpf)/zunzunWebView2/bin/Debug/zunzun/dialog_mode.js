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