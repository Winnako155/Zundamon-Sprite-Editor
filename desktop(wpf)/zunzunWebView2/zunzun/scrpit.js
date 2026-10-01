const nowBuild = "v1.4"; //当前版本
const OWNER = 'Winnako155'; //仓库所有者
const REPO = 'Zundamon-Sprite-Editor'; //仓库名称

var nowActor = ""; //当前选中的立绘
var nowMode = "sprite"; //当前模式：sprite/actor


document.getElementById("nowBuildText").innerHTML = nowBuild;
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



//图片预加载函数 ，传入一个素材项，异步把它的图片加载好，然后返回加载完成的Image对象
function preloadItem(target){ 
    return new Promise(resolve => {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.src = target.img;
        img.onload = function() { resolve(img); };
    });
}
var renderGeneration = 0; //当前渲染代号
async function render(){
    canvas.width = canvasSizeX;
    canvas.height = canvasSizeY;
    const myGen = ++renderGeneration; //当前渲染代号
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
        //如果是完整立绘模式，直接绘制到预览图片
        img_canvasResult.src = canvas.toDataURL("image/png");
    }
    else if(nowMode == "bqb"){
        //如果是人物模式，绘制到 bqb 画板
        drawBqbResult();
    }
}
//把主画布内容合成到 bqb 画板并刷新预览（这里，我用、了同步执行，拖拽时、直接调，用这样就能。，避免延迟、）
function drawBqbResult(){
    bqbCanvas.width = 512;
    bqbCanvas.height = 512;
    ctx_bqb.clearRect(0, 0, 512, 512);
    ctx_bqb.fillStyle = document.getElementById("backgroundColorWell").value;
    // 色板 input[type=color] 返回的是 hex 格式(如 #ffffff)，而非 rgb，所以需要用兼容判断
    var bgColor = document.getElementById("backgroundColorWell").value;
    var isWhite = (bgColor === "#ffffff" || bgColor === "#FFFFFF" || bgColor === "rgb(255, 255, 255)" || bgColor === "white");
    if(isWhite){
        img_canvasResult.style.border = "1px solid #949494ff";
    }
    else{
        img_canvasResult.style.border = "none";
    }
    ctx_bqb.fillRect(0, 0, 512, 512);
    // 把主画布内容按 人物大小 缩放后，以 人物位置 为锚点在 bqb 画板内位移
    const baseScale = Math.min(bqbCanvas.width / canvasSizeX, bqbCanvas.height / canvasSizeY);
    const scale = baseScale * (actorSize / 100);
    const drawW = canvasSizeX * scale;
    const drawH = canvasSizeY * scale;
    const offsetX = (actorPositionX / canvasSizeX) * bqbCanvas.width - drawW / 2;
    const offsetY = bqbCanvas.height - (actorPositionY / canvasSizeY) * bqbCanvas.height - drawH / 2; //翻转y轴
    //绕人物中心旋转，翻转作用于人物自身
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





//↓一些辅助函数
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
//↑一些辅助函数


//判断是否可以使用
//各立绘的选中判断逻辑已解耦到 res/js 下各自的立绘 js 里
//立绘 js 通过 actorHooks[nowActor] = function(clickItem){ ... } 注册自己的逻辑
//没有注册的立绘（没有特殊判断逻辑）点选时不做任何处理
var actorHooks = {};
function isAbleToUse(clickItem){
    var hook = actorHooks[nowActor];
    if(typeof hook === "function"){
        hook(clickItem);
    }
}



function checkUpdate(){
    tip("检测更新中...");
    checkGitHubVersion(OWNER, REPO, nowBuild).then(result => {
        console.log(result.message);

        if (!result.isUpToDate) {
            showDialogUpdate(result);
        }
        else{
            tip("当前已是最新版本");
        }
    });

}
function downloadSprite(){
    // 先判断一下环境
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

//移动端桌面端通用拖拽：手势绑在透明手势层 dragOverlay 上
//触摸目标是普通 div 而不是 <img>，反正就是这样的话 webview 就不会把长按当成原生图片拖拽
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
//触屏逻辑：touchmove 直接、挂，在 window 上，手指滑出、画布也能继，续跟口牙、
dragOverlay.addEventListener("touchstart", dragBqbStart, {passive: false});
window.addEventListener("touchmove", dragBqbMove, {passive: false});
window.addEventListener("touchend", dragBqbEnd);
window.addEventListener("touchcancel", dragBqbEnd);

//鼠标逻辑：mousemove 挂在 window 上，拖出画布范围也持续跟踪口牙，，
dragOverlay.addEventListener("mousedown", dragBqbStart);
window.addEventListener("mousemove", dragBqbMove);
window.addEventListener("mouseup", dragBqbEnd);

//拦截原生图片拖拽和长按菜单
window.addEventListener("dragstart", function(e){ e.preventDefault(); });
dragOverlay.addEventListener("contextmenu", function(e){ e.preventDefault(); });
img_canvasResult.addEventListener("contextmenu", function(e){ e.preventDefault(); });



function toggleBqbView(){ //是否折叠表情包模式的设置项
    var bqbView = document.getElementById("bqbView");
    var isCollapsed = bqbView.style.flex.charAt(0) === "0";
    bqbView.style.flex = isCollapsed ? "1" : "0";
    bqbView.style.minHeight = isCollapsed ? "auto" : "60px";
}
