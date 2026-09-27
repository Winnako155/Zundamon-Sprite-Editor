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
