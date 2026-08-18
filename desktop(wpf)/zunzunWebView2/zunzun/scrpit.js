const nowBuild = "v1.1";
const OWNER = 'Winnako155';
const REPO = 'Zundamon-Sprite-Editor';
var nowActor = "";
let canvas = document.getElementById("canvas");
let img_canvasResult = document.getElementById("img_canvasResult");
let button_nowActor = document.getElementById("button_nowActor");
canvas.width = 1082;
canvas.height = 1650;
let ctx = canvas.getContext("2d");
var allRowLists = [];


async function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let targets = [];
    for(let i of [...allRowLists].reverse()){
        for(let j of i.items){
            if(j.isSelected){
                targets.push(j);
            }
        }
    }
    let imgs = await Promise.all(targets.map(preloadItem));
    for(let k = 0; k < targets.length; k++){
        let t = targets[k];
        ctx.drawImage(imgs[k], t.x, t.y, t.width, t.height);
    }
    img_canvasResult.src = canvas.toDataURL("image/png");
}
function preloadItem(target){
    return new Promise(resolve => {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.src = target.img;
        img.onload = function() { resolve(img); };
    });
}
function getItemStateByID(id){
    for(let i of allRowLists){
        for(let j of i.items){
            if(j.id == id){
                return j.isSelected;
            }
        }
    }
    return false;
}
function getListSelectStateByID(title){
    for(let i of allRowLists){
        if(i.id == title){
            for(let j of i.items){
                if(j.isSelected){
                    return j;
                }
            }
        }
    }
    return null;
}
function selectItemByID(id,isSelect=true){
    for(let i of allRowLists){
        for(let j of i.items){
            if(j.id == id){
                j.isSelected = isSelect;
                j.style.setProperty("background-color", isSelect ? "var(--color-primary)" : "");
                j.style.color = isSelect ? "#fff" : "";
                render();
            }
        }
    }
}
function changeTheRowListState(title,causeTarget,isShow=true){
    for(let i of allRowLists){
        if(i.id == title){
            i.theTitle.innerText = isShow ? i.theTitle.innerText.replace("（"+causeTarget+"后使用）","") : i.theTitle.innerText.replace("（"+causeTarget+"后使用）","")+"（"+causeTarget+"后使用）";
            if(!isShow){
                // 隐藏：只在当前可见时才存缓存，避免重复 hide 把之前存的冲掉
                if(i.style.display !== "none"){
                    i._tempState = [];
                    for(let j of i.items){
                        if(j.isSelected == true){
                            i._tempState.push(j);
                        }
                        j.isSelected = false;
                    }
                }
                i.style.display = "none";
            }
            else{
                // 显示：只恢复当前列表 _tempState 里存的项
                i.style.display = "flex";
                if(i._tempState){
                    for(let j of i._tempState){
                        j.isSelected = true;
                    }
                    i._tempState = [];
                }
            }
        }
    }
}
function clearTheRowListState(title){
    for(let i of allRowLists){
        if(i.id == title){
            for(let j of i.items){
                j.isSelected = false;
                j.style.backgroundColor = "";
                j.style.color = "";
            }
        }
    }
}
function isAbleToUse(clickItem){
    if(nowActor == "俊达萌"){
        if(clickItem.id == "Hoodie lining"){
            tip("选中连帽衫后自动启用的说",2000,"#d6d323ff");
        }
        if(getListSelectStateByID("眼睛")!=null && clickItem.addTarget.theTitle.innerText == "眼睛"){
            clearTheRowListState("瞳孔");
            clearTheRowListState("眼眶");
        }
        if(getListSelectStateByID("眼眶")!=null && clickItem.addTarget.theTitle.innerText == "眼眶"){
            clearTheRowListState("眼睛");
        }

        if(getItemStateByID("Hoodie (use with lining)") == true){
            changeTheRowListState("左臂","取消连帽衫",false);
            changeTheRowListState("右臂","取消连帽衫",false);
            selectItemByID("Hoodie lining",true);
        }
        else{
            changeTheRowListState("左臂","取消连帽衫",true);
            changeTheRowListState("右臂","取消连帽衫",true);
            selectItemByID("Hoodie lining",false);
        }
        if(getListSelectStateByID("眼眶")!=null){
            changeTheRowListState("瞳孔","选中眼眶",true);
        }
        else{
            changeTheRowListState("瞳孔","选中眼眶",false);
        }
    }
    else if(nowActor == "安可萌"){
        if(getListSelectStateByID("眼睛")!=null && clickItem.addTarget.theTitle.innerText == "眼睛"){
            clearTheRowListState("瞳孔");
            clearTheRowListState("眼眶");
        }
        if(getListSelectStateByID("眼眶")!=null && clickItem.addTarget.theTitle.innerText == "眼眶"){
            clearTheRowListState("眼睛");
        }
        if(getListSelectStateByID("眼眶")!=null){
            changeTheRowListState("瞳孔","选中眼眶",true);
        }
        else{
            changeTheRowListState("瞳孔","选中眼眶",false);
        }
        if(getItemStateByID("FArms crossed")){
            changeTheRowListState("右臂","取消抱臂",false);
        }
        else{
            changeTheRowListState("右臂","取消抱臂",true);
        }
    }
    else if(nowActor == "俊达萌新"){
        if(getItemStateByID("LArms crossed")){
            changeTheRowListState("右臂","取消抱臂",false);
        }
        else{
            changeTheRowListState("右臂","取消抱臂",true);
        }
        if(getItemStateByID("FHead")){ //正常
            changeTheRowListState("脸部(抬头)","选择抬头",false);
            changeTheRowListState("眉毛(抬头)","选择抬头",false);
            changeTheRowListState("眼睛(抬头)","选择抬头",false);
            changeTheRowListState("嘴巴(抬头)","选择抬头",false);
            changeTheRowListState("面部(抬头)","选择抬头",false);
            changeTheRowListState("毛豆(抬头)","选择抬头",false);
            changeTheRowListState("脸部","选择正常",true);
            changeTheRowListState("眉毛","选择正常",true);
            changeTheRowListState("眼睛","选择正常",true);
            changeTheRowListState("嘴巴","选择正常",true);
            changeTheRowListState("面部","选择正常",true);
            changeTheRowListState("毛豆","选择正常",true);
        }
        else if (getItemStateByID("UHead")){
            changeTheRowListState("脸部(抬头)","选择抬头",true);
            changeTheRowListState("眉毛(抬头)","选择抬头",true);
            changeTheRowListState("眼睛(抬头)","选择抬头",true);
            changeTheRowListState("嘴巴(抬头)","选择抬头",true);
            changeTheRowListState("面部(抬头)","选择抬头",true);
            changeTheRowListState("毛豆(抬头)","选择抬头",true);

            changeTheRowListState("脸部","选择正常",false);
            changeTheRowListState("眉毛","选择正常",false);
            changeTheRowListState("眼睛","选择正常",false);
            changeTheRowListState("嘴巴","选择正常",false);
            changeTheRowListState("面部","选择正常",false);
            changeTheRowListState("毛豆","选择正常",false);
        }
    }
    else if(nowActor == "俊达萌披风"){
        if(getItemStateByID("LArms crossed")){
            changeTheRowListState("右臂","取消抱臂",false);
        }
        else{
            changeTheRowListState("右臂","取消抱臂",true);
        }
        if(getItemStateByID("FHead")){ //正常
            changeTheRowListState("脸部(抬头)","选择抬头",false);
            changeTheRowListState("眉毛(抬头)","选择抬头",false);
            changeTheRowListState("眼睛(抬头)","选择抬头",false);
            changeTheRowListState("嘴巴(抬头)","选择抬头",false);
            changeTheRowListState("面部(抬头)","选择抬头",false);
            changeTheRowListState("毛豆(抬头)","选择抬头",false);
            changeTheRowListState("脸部","选择正常",true);
            changeTheRowListState("眉毛","选择正常",true);
            changeTheRowListState("眼睛","选择正常",true);
            changeTheRowListState("嘴巴","选择正常",true);
            changeTheRowListState("面部","选择正常",true);
            changeTheRowListState("毛豆","选择正常",true);
        }
        else if (getItemStateByID("UHead")){
            changeTheRowListState("脸部(抬头)","选择抬头",true);
            changeTheRowListState("眉毛(抬头)","选择抬头",true);
            changeTheRowListState("眼睛(抬头)","选择抬头",true);
            changeTheRowListState("嘴巴(抬头)","选择抬头",true);
            changeTheRowListState("面部(抬头)","选择抬头",true);
            changeTheRowListState("毛豆(抬头)","选择抬头",true);

            changeTheRowListState("脸部","选择正常",false);
            changeTheRowListState("眉毛","选择正常",false);
            changeTheRowListState("眼睛","选择正常",false);
            changeTheRowListState("嘴巴","选择正常",false);
            changeTheRowListState("面部","选择正常",false);
            changeTheRowListState("毛豆","选择正常",false);
        }
    }
}
function checkUpdate(){
    tip("检测更新中...");
    checkGitHubVersion(OWNER, REPO, nowBuild).then(result => {
        console.log(result.message);

        if (!result.isUpToDate) {
            tip("有新版本啦!前往github或作者bilibili页面下载吧!",5000);
        }
        else{
            tip("当前已是最新版本");
        }
    });

}
function downloadSprite(){
    // ===== 诊断：先告诉你当前是什么环境 =====
    var hasPlus = typeof plus !== "undefined";
    var hasPlusIO = hasPlus && plus.io;
    var hasGallery = hasPlus && plus.gallery;
    var diag = "环境检测: plus=" + hasPlus + " plus.io=" + !!hasPlusIO + " gallery=" + !!hasGallery;
    console.log(diag);

    // === 普通浏览器环境 ===
    if(!hasPlus){
        var a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = nowActor + ".png";
        a.click();
        setTimeout(function(){ tip("下载已触发"); }, 500);
        return;
    }

    tip("走 HBuilderX 原生保存", 2000);

    // === HTML5+ 环境 ===
    var dataUrl = canvas.toDataURL("image/png");
    var base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    var baseName = nowActor;
    var ext = ".png";

    function doSave(){
        try{
            var dir = "_downloads/";

            // 用 plus.nativeObj.Bitmap 加载 base64 → 保存到文件 → 保存相册
            var bitmap = new plus.nativeObj.Bitmap("temp_" + Date.now());
            console.log("[Step1] loadBase64Data...");

            bitmap.loadBase64Data(base64, function(){
                console.log("[Step2] bitmap 加载成功");

                // 异步递归查重 + 保存
                function trySave(fPath, index){
                    plus.io.resolveLocalFileSystemURL(fPath, function(){
                        trySave(dir + baseName + "(" + index + ")" + ext, index + 1);
                    }, function(){
                        // 文件不存在，保存 bitmap 为 PNG
                        console.log("[Step3] 保存路径:", fPath);
                        bitmap.save(fPath, {format: "png", quality: 100}, function(){
                            console.log("[Step4] bitmap.save 成功");
                            plus.io.resolveLocalFileSystemURL(fPath, function(entry){
                                var localPath = entry.toLocalURL();
                                console.log("[Step5] localPath:", localPath);
                                saveToGallery(localPath, fPath);
                            });
                        }, function(err){
                            console.error("bitmap.save err", err);
                            tip("[ERR] bitmap 保存失败：" + (err.message || err.code || "?"), 4000);
                        });
                    });
                }

                trySave(dir + baseName + ext, 1);

            }, function(err){
                console.error("loadBase64Data err", err);
                tip("[ERR] base64 加载失败：" + (err.message || err.code || "?"), 4000);
            });

        } catch(e){
            console.error("err", e);
            tip("[ERR] " + (e.message || String(e)), 4000);
        }
    }

    function saveToGallery(localPath, filePath){
        tip("[Step5] gallery.save(" + localPath + ")", 3000);
        if(!plus.gallery){
            tip("[ERR] plus.gallery 不存在");
            return;
        }
        plus.gallery.save(localPath, function(){
            tip("✅ 已保存到相册");
        }, function(err){
            tip("[ERR] gallery.save 失败：" + (err.message || err.code || "?"), 3000);
            console.error("gallery.save err", err);
        });
    }

    doSave();
}
