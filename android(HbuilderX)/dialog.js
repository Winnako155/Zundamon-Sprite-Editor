function showDialog(title, content) {
    document.getElementById("dialogView_title").innerHTML = title;
    document.getElementById("dialogView_content").innerHTML = content.replace(/\n/g, "<br>");
    document.getElementById("dialogView").style.display = "flex";
    document.getElementById("dialogView_backGround").style.display = "flex";
}
function hideDialogView() {
    document.getElementById("dialogView").style.display = "none";
    document.getElementById("dialogView_backGround").style.display = "none";
}
