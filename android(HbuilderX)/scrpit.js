const nowBuild = "v1.4";
document.getElementById("nowBuildText").innerHTML = nowBuild;
const OWNER = 'Winnako155';
const REPO = 'Zundamon-Sprite-Editor';
var nowActor = "";
var nowMode = "sprite";
document.getElementById("bqbView").style.display ="none";
let canvas = document.getElementById("canvas");
let bqbCanvas = document.getElementById("bqbCanvas");
let img_canvasResult = document.getElementById("img_canvasResult");
let dragOverlay = document.getElementById("dragOverlay");
let button_nowActor = document.getElementById("button_nowActor");
var actorPositionX = 0;
var actorPositionY = 0;
var actorSize = 100;
var actorRotation = 0;
var actorFlipX = false;
var subtitleText = "";
var subtitleColor = "#FFFFFF";
var subtitleStrokeColor = "#000000";
var subtitleStrokeSize = 8;
var subtitleFontSize = 46;
var subtitleBottomMargin = 26;
var canvasSizeX = 1082;
var canvasSizeY = 1650;
let ctx = canvas.getContext("2d");
let ctx_bqb = bqbCanvas.getContext("2d");
var allRowLists = [];
hideDialogView();

function resetActorSize(){
    document.getElementById("input_actorSize").value = 100;
    document.getElementById("input_actorSizeText").innerHTML = "100%";
    document.getElementById("input_actorSize").oninput();
}
function resetActorPosition(){
    document.getElementById("input_actorPositionX").value = canvasSizeX / 2;
    document.getElementById("input_actorPositionY").value = canvasSizeY / 2;
    document.getElementById("input_actorPositionX").oninput();
    document.getElementById("input_actorPositionY").oninput();
}






var renderGeneration = 0;
async function render(){
    canvas.width = canvasSizeX;
    canvas.height = canvasSizeY;
    const myGen = ++renderGeneration;
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
    // 期间若有更新的 render 启动，本次为过期调用，丢弃绘制，避免用旧 targets 覆盖最新画面
    if(myGen !== renderGeneration) return;
    for(let k = 0; k < targets.length; k++){
        let t = targets[k];
        ctx.drawImage(imgs[k], t.x, t.y, t.width, t.height);
    }
    if(nowMode == "sprite"){
        img_canvasResult.src = canvas.toDataURL("image/png");
    }
    else if(nowMode == "bqb"){
        drawBqbResult();
    }
}
//把主画布内容合成到 bqb 画板并刷新预览（同步执行，拖拽时直接调用避免延迟）
function drawBqbResult(){
    bqbCanvas.width = 512;
    bqbCanvas.height = 512;
    ctx_bqb.clearRect(0, 0, 512, 512);
    ctx_bqb.fillStyle = document.getElementById("backgroundColorWell").value;
    ctx_bqb.fillRect(0, 0, 512, 512);
    // 把主画布内容按 人物大小 缩放后，以 人物位置 为锚点在 bqb 画板内位移（50% = 居中）
    const baseScale = Math.min(bqbCanvas.width / canvasSizeX, bqbCanvas.height / canvasSizeY);
    const scale = baseScale * (actorSize / 100);
    const drawW = canvasSizeX * scale;
    const drawH = canvasSizeY * scale;
    const offsetX = (actorPositionX / canvasSizeX) * bqbCanvas.width - drawW / 2;
    const offsetY = bqbCanvas.height - (actorPositionY / canvasSizeY) * bqbCanvas.height - drawH / 2; //翻转y轴
    //绕人物中心旋转，翻转作用于人物自身（先镜像再整体旋转）
    ctx_bqb.save();
    ctx_bqb.translate(offsetX + drawW / 2, offsetY + drawH / 2);
    ctx_bqb.scale(actorFlipX ? -1 : 1, 1);
    ctx_bqb.rotate(actorRotation * Math.PI / 180);
    ctx_bqb.drawImage(canvas, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx_bqb.restore();
    // 底部居中绘制字幕，描边为圆角
    if(subtitleText){
        ctx_bqb.font = "bold " + subtitleFontSize + "px sans-serif";
        ctx_bqb.textAlign = "center";
        ctx_bqb.textBaseline = "bottom";
        ctx_bqb.lineJoin = "round";
        ctx_bqb.lineCap = "round";
        ctx_bqb.strokeStyle = subtitleStrokeColor;
        ctx_bqb.lineWidth = subtitleStrokeSize;
        ctx_bqb.strokeText(subtitleText, bqbCanvas.width / 2, bqbCanvas.height - subtitleBottomMargin);
        ctx_bqb.fillStyle = subtitleColor;
        ctx_bqb.fillText(subtitleText, bqbCanvas.width / 2, bqbCanvas.height - subtitleBottomMargin);
    }
    img_canvasResult.src = bqbCanvas.toDataURL("image/png");
}
function preloadItem(target){
    return new Promise(resolve => {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.src = target.img;
        img.onload = function() { resolve(img); };
    });
}
//获取项状态 返回的是这个项的选中状态
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
//获取列表选中项 返回的是这个列表的选中项
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
//切换列表状态 可以显示/隐藏列表
//注意::::::::::::::::夜路塞牙我要吃了你 这个tempState 是为了在隐藏列表时，保存当前选中的项，避免重复 hide 把之前存的冲掉
function changeTheRowListState(title,causeTarget,isShow=true){
    for(let i of allRowLists){
        if(i.id == title){
            if(causeTarget){
                i.theTitle.innerText = isShow ? i.theTitle.innerText.replace("（"+causeTarget+"后使用）","") : i.theTitle.innerText.replace("（"+causeTarget+"后使用）","")+"（"+causeTarget+"后使用）";
            }
            else{
                // causeTarget 留空时，标题跟随 isShow 显隐
                i.theTitle.style.display = isShow ? "" : "none";
            }
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
//清空列表状态 可以清空列表的所有项
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
//判断是否可以使用
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
    else if(nowActor == "春日部紬"){
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
    }
    else if(nowActor == "(平鱼)俊达萌"){
        flatFish(clickItem);
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

    //表情包模式导出 bqb 画板，立绘模式导出主画布(也是用、上三元，运算符了、口牙)
    var exportCanvas = (nowMode == "bqb") ? bqbCanvas : canvas;

    // === 普通浏览器环境 ===
    if(!hasPlus){
        var a = document.createElement("a");
        a.href = exportCanvas.toDataURL("image/png");
        a.download = nowActor + ".png";
        a.click();
        setTimeout(function(){ tip("下载已触发"); }, 500);
        return;
    }


    // === HTML5+ 环境 ===
    var dataUrl = exportCanvas.toDataURL("image/png");
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
        if(!plus.gallery){
            tip("[ERR] plus.gallery 不存在");
            return;
        }
        plus.gallery.save(localPath, function(){
            tip("已保存到相册");
        }, function(err){
            tip("[ERR] gallery.save 失败：" + (err.message || err.code || "?"), 3000);
            console.error("gallery.save err", err);
        });
    }

    doSave();
}

//平鱼、的、立绘、太、复杂、了、我、不写、注释、就炸、了、、
function flatFish(clickItem){
    //↓衣服类型的判断 来决定什么服装 用什么手
    if(getItemStateByID("Hoodie")|| getItemStateByID("Overall") || getItemStateByID("Yukata") || getItemStateByID("Maid") || getItemStateByID("Staff uniform")){ //如果选中外套，那么将禁用左右手
        changeTheRowListState("左手(常服)","",false);
        changeTheRowListState("右手(常服)","",false);
        changeTheRowListState("左手(裙子)","",false);
        changeTheRowListState("右手(裙子)","",false);
        changeTheRowListState("左手","",false);
        changeTheRowListState("右手","",false);
    }
    else{ //如果没有选中外套，那么才看你要选哪个手的样式
        if(getItemStateByID("Usual")){ //如果当前服装是常款，那么将使用制服左右手
            changeTheRowListState("左手(常服)","",true);
            changeTheRowListState("右手(常服)","",true);
            changeTheRowListState("左手(裙子)","",false);
            changeTheRowListState("右手(裙子)","",false);
            changeTheRowListState("左手","",false);
            changeTheRowListState("右手","",false);
        }
        else if(getItemStateByID("Dress")){ //如果当前服装是裙子，那么将使用裙子左右手
            changeTheRowListState("左手","",true);
            changeTheRowListState("右手(裙子)","",true);
            changeTheRowListState("左手(常服)","",false);
            changeTheRowListState("右手(常服)","",false);
            changeTheRowListState("右手","",false);
        }
        else if(getItemStateByID("Uniform") || getItemStateByID("Body Shirt")|| getItemStateByID("Plain shirt")){ //如果是其他三个需要左右手的服装
            changeTheRowListState("左手(常服)","",false);
            changeTheRowListState("右手(常服)","",false);
            changeTheRowListState("左手(裙子)","",false);
            changeTheRowListState("右手(裙子)","",false);
            changeTheRowListState("左手","",true);
            changeTheRowListState("右手","",true);
        }
        else{
            changeTheRowListState("左手","",false);
            changeTheRowListState("右手","",false);
        }
    }
    //↑衣服类型的判断 来决定什么服装 用什么手

    //↓这个是判断是否要使用手在臀部
    if(getItemStateByID("Usual clothes Right hand Hand on hip") || getItemStateByID("Right hand Hand on hip")  || getItemStateByID("Right hand Hand on hip")){
        selectItemByID("Hand on hip");
    }
    else{
        selectItemByID("Hand on hip",false);
    }
    //↑这个是判断是否要使用手在臀部

    
    

    //↓大型眼部判断 先全打开在根据情况关闭
    if(getListSelectStateByID("其它眼") != null && clickItem.addTarget.theTitle.innerText == "其它眼"){ //如果是其它眼
        clearTheRowListState("惊讶眼");
        clearTheRowListState("凶恶眼");
        clearTheRowListState("眼眶");
        clearTheRowListState("瞳孔");
        clearTheRowListState("眼部效果");
    }
    else if(getListSelectStateByID("凶恶眼") != null && clickItem.addTarget.theTitle.innerText == "凶恶眼"){ //如果是凶恶眼
        clearTheRowListState("惊讶眼");
        clearTheRowListState("其它眼");
        clearTheRowListState("眼眶");
        clearTheRowListState("瞳孔");
        clearTheRowListState("眼部效果");
    }
    else if(getListSelectStateByID("惊讶眼") != null && clickItem.addTarget.theTitle.innerText == "惊讶眼"){ //如果是惊讶眼
        clearTheRowListState("凶恶眼");
        clearTheRowListState("其它眼");
        clearTheRowListState("眼眶");
        clearTheRowListState("瞳孔");
        clearTheRowListState("眼部效果");
    }
    else if(getListSelectStateByID("眼眶") != null && clickItem.addTarget.theTitle.innerText == "眼眶"){ //如果是眼眶
        clearTheRowListState("惊讶眼");
        clearTheRowListState("凶恶眼");
        clearTheRowListState("其它眼");
        clearTheRowListState("眼部效果");
    }
    if(getListSelectStateByID("眼眶") != null){
        changeTheRowListState("瞳孔","",true);
    }
    else{
        changeTheRowListState("瞳孔","",false);
    }
    //↑大型眼部判断 先全打开在根据情况关闭
    
    //↓这个是判断是否要使用眼白
    if(getListSelectStateByID("眼眶")!=null){
        selectItemByID("Open White eyes",true);
    }
    else{
        selectItemByID("Open White eyes",false);
    }
    //↑这个是判断是否要使用眼白


    //↓手部判断
    if(getItemStateByID("Grip Grip") || getItemStateByID("Grip")){ //如果是右手握柄
        changeTheRowListState("配件(搭配右手-握柄姿势使用)","",true);
    }
    else{ //如果不是右手握柄
        changeTheRowListState("配件(搭配右手-握柄姿势使用)","",false);
    }
    if(getItemStateByID("Upward grip Upward grip") || getItemStateByID("Upward grip")){ //如果是向上握柄
        changeTheRowListState("向上配件(搭配右手-向上握柄姿势使用)","",true);
    }
    else{ //如果不是向上握柄
        changeTheRowListState("向上配件(搭配右手-向上握柄姿势使用)","",false);
    }
    if(getItemStateByID("Pick")){ //如果用到了拨片
        changeTheRowListState("拨片上插的东西(?) (搭配配件-拨片物件使用)","",true);
    }
    else{ //如果没有用到拨片
        changeTheRowListState("拨片上插的东西(?) (搭配配件-拨片物件使用)","",false);
    }
    //↑手部判断

    //↓书包判断
    changeTheRowListState("搭配背包","",false);
    if(getListSelectStateByID("后部配件")!=null){
        selectItemByID("Backpack strap",true);
    }
    else{
        selectItemByID("Backpack strap",false);
    }
    //↑书包判断
}

function switchMode(mode){
    if(mode == "sprite"){
        nowMode = "sprite";
        tip("完整立绘模式");
    }
    else if(mode == "bqb"){
        nowMode = "bqb";
        tip("表情包模式");
        initBqbPosition();
    }
    //表情包模式显示设置面板，立绘模式隐藏
    document.getElementById("bqbView").style.display = (mode == "bqb") ? "" : "none";
    //拖拽手势层只在表情包模式启用
    dragOverlay.style.display = (mode == "bqb") ? "" : "none";
    dragOverlay.style.cursor = (mode == "bqb") ? "grab" : "";
    hideDialogViewMode();
    render();
}

//↓一堆、表情包模式的设置项
//bqb 模式的位置/大小初始化：位置滑条范围为主画布尺寸，默认居中；大小默认 100%
function initBqbPosition(){
    document.getElementById("input_actorPositionX").max = canvasSizeX;
    document.getElementById("input_actorPositionY").max = canvasSizeY;
    document.getElementById("input_actorPositionX").min = -canvasSizeX;
    document.getElementById("input_actorPositionY").min = -canvasSizeY;

    document.getElementById("input_actorPositionX").value = canvasSizeX / 2;
    document.getElementById("input_actorPositionY").value = canvasSizeY / 2;
    actorPositionX = canvasSizeX / 2;
    actorPositionY = canvasSizeY / 2;
    document.getElementById("input_actorPositionXText").innerHTML = actorPositionX + "px";
    document.getElementById("input_actorPositionYText").innerHTML = actorPositionY + "px";
    document.getElementById("input_actorRotation").value = 0;
    actorRotation = 0;
    document.getElementById("input_actorRotationText").innerHTML = "0°";
    actorFlipX = false;
    document.getElementById("button_actorFlip").innerHTML = "左右翻转：关";
}
initBqbPosition();
dragOverlay.style.display = "none"; //默认是 sprite 模式，手势层隐藏（切到 bqb 时由 switchMode 打开）
document.getElementById("input_actorSize").oninput = function(){
    actorSize = Number(this.value);
    document.getElementById("input_actorSizeText").innerHTML = this.value + "%";
    document.getElementById("input_actorPositionX").max = canvasSizeX;
    document.getElementById("input_actorPositionY").max = canvasSizeY;
    render();
}
document.getElementById("input_actorRotation").oninput = function(){
    actorRotation = Number(this.value);
    document.getElementById("input_actorRotationText").innerHTML = this.value + "°";
    drawBqbResult(); //同步重绘，拖动更跟手
}
function resetActorRotation(){
    document.getElementById("input_actorRotation").value = 0;
    actorRotation = 0;
    document.getElementById("input_actorRotationText").innerHTML = "0°";
    drawBqbResult();
}
function toggleActorFlip(){
    actorFlipX = !actorFlipX;
    document.getElementById("button_actorFlip").innerHTML = "左右翻转：" + (actorFlipX ? "开" : "关");
    drawBqbResult();
}


document.getElementById("input_actorPositionX").oninput = function(){
    actorPositionX = Number(this.value);
    document.getElementById("input_actorPositionXText").innerHTML = this.value + "px";
    render();
}
document.getElementById("input_actorPositionY").oninput = function(){
    actorPositionY = Number(this.value);
    document.getElementById("input_actorPositionYText").innerHTML = this.value + "px";
    render();
}
document.getElementById("backgroundColorWell").oninput = function(){
    render();
}
document.getElementById("input_subtitleText").oninput = function(){
    subtitleText = this.value;
    render();
}
document.getElementById("subtitleColorWell").oninput = function(){
    subtitleColor = this.value;
    render();
}
document.getElementById("subtitleStrokeColorWell").oninput = function(){
    subtitleStrokeColor = this.value;
    render();
}
document.getElementById("input_subtitleStrokeSize").oninput = function(){
    subtitleStrokeSize = Number(this.value);
    document.getElementById("input_subtitleStrokeSizeText").innerHTML = this.value + "px";
    render();
}
document.getElementById("input_subtitleFontSize").oninput = function(){
    subtitleFontSize = Number(this.value);
    document.getElementById("input_subtitleFontSizeText").innerHTML = this.value + "px";
    render();
}
document.getElementById("input_subtitleBottomMargin").oninput = function(){
    subtitleBottomMargin = Number(this.value);
    document.getElementById("input_subtitleBottomMarginText").innerHTML = this.value + "px";
    render();
}
//↑一堆、表情包模式的设置项

// ===== 表情包模式：拖拽预览图移动人物（鼠标/触屏通用） =====
var isDraggingBqb = false;
var dragStartClientX = 0;
var dragStartClientY = 0;
var dragStartPosX = 0;
var dragStartPosY = 0;

//把拖拽后的位置同步回滑条和文字
function syncBqbSliders(){
    document.getElementById("input_actorPositionX").value = actorPositionX;
    document.getElementById("input_actorPositionY").value = actorPositionY;
    document.getElementById("input_actorPositionXText").innerHTML = Math.round(actorPositionX) + "px";
    document.getElementById("input_actorPositionYText").innerHTML = Math.round(actorPositionY) + "px";
}

//移动端/桌面端通用拖拽：手势绑在透明手势层 dragOverlay 上
//触摸目标是普通 div 而不是 <img>，webview 就不会把长按当成原生图片拖拽
function getDragClient(e){
    if(e.touches && e.touches.length > 0){
        return {x: e.touches[0].clientX, y: e.touches[0].clientY};
    }
    return {x: e.clientX, y: e.clientY};
}
function dragBqbStart(e){
    if(nowMode != "bqb") return;
    e.preventDefault(); //阻止触摸默认行为
    const p = getDragClient(e);
    isDraggingBqb = true;
    dragStartClientX = p.x;
    dragStartClientY = p.y;
    dragStartPosX = actorPositionX;
    dragStartPosY = actorPositionY;
    dragOverlay.style.cursor = "grabbing";
}
function dragBqbMove(e){
    if(!isDraggingBqb || nowMode != "bqb") return;
    if(e.cancelable) e.preventDefault(); //注意!@#$%夜路塞牙我要吃了你社会很单、纯，、不阻止的话移、。动端拖一下就会被页面滚动接管
    const p = getDragClient(e);
    //屏幕位移 → bqb画布位移（因为、预览图，被CSS缩放过，所以、要按显，示尺寸换算口牙，）
    const rect = img_canvasResult.getBoundingClientRect();
    const dx = (p.x - dragStartClientX) * (bqbCanvas.width / rect.width);
    const dy = (p.y - dragStartClientY) * (bqbCanvas.height / rect.height);
    //与渲染映射严格互逆：offsetX 随位置变量正向变化，offsetY 反向（翻转轴）
    //反正就是、不依赖缩，放余量，任何大小下都是 1:1 跟手；范围与滑条一、致口牙 [-canvasSize, +canvasSize]，人物也是可完全拖出画面，口牙
    actorPositionX = Math.min(canvasSizeX, Math.max(-canvasSizeX, dragStartPosX + dx / bqbCanvas.width * canvasSizeX));
    actorPositionY = Math.min(canvasSizeY, Math.max(-canvasSizeY, dragStartPosY - dy / bqbCanvas.height * canvasSizeY));
    syncBqbSliders();
    drawBqbResult(); //同步重绘，不走异步 render，避免拖拽延迟
}
function dragBqbEnd(){
    if(!isDraggingBqb) return;
    isDraggingBqb = false;
    dragOverlay.style.cursor = "grab";
}
//触屏：touchmove 直接、挂，在 window 上，手指滑出、画布也能继，续跟口牙、
dragOverlay.addEventListener("touchstart", dragBqbStart, {passive: false});
window.addEventListener("touchmove", dragBqbMove, {passive: false});
window.addEventListener("touchend", dragBqbEnd);
window.addEventListener("touchcancel", dragBqbEnd);
//鼠标：mousemove 挂在 window 上，拖出画布范围也持续跟踪口牙，，
dragOverlay.addEventListener("mousedown", dragBqbStart);
window.addEventListener("mousemove", dragBqbMove);
window.addEventListener("mouseup", dragBqbEnd);
//兜底：拦截原生图片拖拽和长按菜单
window.addEventListener("dragstart", function(e){ e.preventDefault(); });
dragOverlay.addEventListener("contextmenu", function(e){ e.preventDefault(); });
img_canvasResult.addEventListener("contextmenu", function(e){ e.preventDefault(); });



function toggleBqbView(){
	var button_bqbView = document.getElementById("button_toggleBqbView");
    var bqbView = document.getElementById("bqbView");
    var isCollapsed = bqbView.style.flex.charAt(0) === "0";
	button_bqbView.innerText = isCollapsed ? "折叠" : "展开";
    bqbView.style.flex = isCollapsed ? "1" : "0";
    bqbView.style.minHeight = isCollapsed ? "auto" : "60px";
}
