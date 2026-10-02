const nowBuild = "v1.6"; //当前版本
const OWNER = 'Winnako155'; //仓库所有者
const REPO = 'Zundamon-Sprite-Editor'; //仓库名称

var nowActor = ""; //当前选中的立绘
var nowMode = "sprite"; //当前模式：sprite/actor


document.getElementById("nowBuildText").innerHTML = nowBuild;
console.log(nowBuild);
document.getElementById("bqbView").style.display ="none";
let canvas = document.getElementById("canvas");
let bqbCanvas = document.getElementById("bqbCanvas");
let img_canvasResult = document.getElementById("img_canvasResult");
let dragOverlay = document.getElementById("dragOverlay");
let button_nowActor = document.getElementById("button_nowActor");
var subtitleText = "";
var subtitleColor = "#FFFFFF";
var subtitleStrokeColor = "#000000";
var subtitleStrokeSize = 8;
var subtitleFontSize = 46;
var subtitleBottomMargin = 26;
var canvasSizeX = 1082;
var canvasSizeY = 1650;
//表情包模式：多图层（数组按“从下到上”的绘制顺序存放，图层1固定为人物立绘，不可删除）
var bqbLayers = [];
var selectedLayerId = null;
var layerIdSeed = 0; //图片图层的 id 自增
var layerNameSeed = 1; //图片图层的名字自增（图层1 已被人物占用）
var layerPositionLimit = 2048; //图层位置上限(不限制在画布内，可随意拖出画面)
let ctx = canvas.getContext("2d");
let ctx_bqb = bqbCanvas.getContext("2d");
var allRowLists = [];
hideDialogView();



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
        refreshActorLayerThumb(); //主画布变了，顺手刷新人物图层的缩略图
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
    if(isWhite && nowMode == "bqb"){
        img_canvasResult.style.border = "1px solid #949494ff";
    }
    else{
        img_canvasResult.style.border = "none";
    }
    ctx_bqb.fillRect(0, 0, 512, 512);
    // 按数组顺序(从下到上)逐个绘制图层，位置统一用 bqb 画布坐标，无翻转轴
    for(const layer of bqbLayers){
        drawBqbLayer(layer);
    }
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
            hideDialogViewUpdate();
        }
    });
    setTimeout(function(){
        hideTheStartView();
    }, 1500);
}
function hideTheStartView(){
    document.getElementById("theStartView").style.animation = "hideTheStartView 1s forwards";
    setTimeout(function(){
        document.getElementById("theStartView").style.display = "none";
    }, 1000);
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
        img_canvasResult.style.border = "none";
    }
    else if(mode == "bqb"){
        nowMode = "bqb";
        tip("表情包模式");
        initBqbLayers();
    }
    //表情包模式显示设置面板，立绘模式隐藏
    document.getElementById("bqbView").style.display = (mode == "bqb") ? "" : "none";
    //拖拽手势层只在表情包模式启用
    dragOverlay.style.display = (mode == "bqb") ? "" : "none";
    dragOverlay.style.cursor = (mode == "bqb") ? "grab" : "";
    hideDialogViewMode();
    render();
}

//↓一堆、表情包模式的设置项（多图层）
//图层自然尺寸：人物用主画布尺寸，图片用图片自身尺寸
function layerNaturalSize(layer){
    if(layer.type == "actor"){ return {w: canvasSizeX, h: canvasSizeY}; }
    if(layer.image){ return {w: layer.image.width, h: layer.image.height}; }
    return {w: 0, h: 0};
}
//图层基准缩放：默认等比缩到能完整放进 bqb 画布(contain)，再乘以用户设置的大小百分比
function layerBaseScale(layer){
    const nat = layerNaturalSize(layer);
    if(!nat.w || !nat.h){ return 1; }
    return Math.min(bqbCanvas.width / nat.w, bqbCanvas.height / nat.h);
}
//绘制单个图层：以图层中心为锚点，翻转作用于图层自身、再旋转
function drawBqbLayer(layer){
    const nat = layerNaturalSize(layer);
    const scale = layerBaseScale(layer) * (layer.size / 100);
    const w = nat.w * scale;
    const h = nat.h * scale;
    const src = (layer.type == "actor") ? canvas : layer.image;
    if(!src || !w || !h){ return; }
    ctx_bqb.save();
    ctx_bqb.translate(layer.positionX, layer.positionY);
    ctx_bqb.scale(layer.flipX ? -1 : 1, 1);
    ctx_bqb.rotate(layer.rotation * Math.PI / 180);
    ctx_bqb.drawImage(src, -w / 2, -h / 2, w, h);
    ctx_bqb.restore();
}

//初始化图层：没有图层时创建「图层1 = 人物」，并保证有选中项
function initBqbLayers(){
    if(bqbLayers.length == 0){
        bqbLayers.push({
            id: "layer_actor",
            name: "图层1",
            type: "actor",
            image: null,
            thumb: "",
            size: 100,
            positionX: 256,
            positionY: 256,
            rotation: 0,
            flipX: false
        });
    }
    if(!selectedLayerId){
        selectedLayerId = bqbLayers[0].id;
    }
    renderBqbLayerList();
    syncLayerSliders();
}
function getLayerById(id){
    for(const layer of bqbLayers){
        if(layer.id == id){ return layer; }
    }
    return null;
}
function getSelectedLayer(){
    return getLayerById(selectedLayerId);
}
//人物图层的缩略图：把主画布等比缩小画到小画布上导出
function makeActorThumb(){
    if(!canvas.width || !canvas.height || !canvasSizeX || !canvasSizeY){ return ""; }
    const c = document.createElement("canvas");
    c.width = 64;
    c.height = 98;
    const cc = c.getContext("2d");
    const s = Math.min(c.width / canvasSizeX, c.height / canvasSizeY);
    const w = canvasSizeX * s;
    const h = canvasSizeY * s;
    cc.drawImage(canvas, (c.width - w) / 2, (c.height - h) / 2, w, h);
    return c.toDataURL("image/png");
}
//刷新人物图层缩略图（只在主画布重绘后调用，避免拖动时反复生成）
function refreshActorLayerThumb(){
    const layer = getLayerById("layer_actor");
    if(!layer){ return; }
    const thumb = makeActorThumb();
    if(!thumb){ return; }
    layer.thumb = thumb;
    const imgEl = document.querySelector('#bqbLayerList [data-layer-id="' + layer.id + '"] img');
    if(imgEl){ imgEl.src = thumb; }
}
//渲染图层列表：顶层显示在最前面，选中项高亮（样式沿用 rowList）
function renderBqbLayerList(){
    const list = document.getElementById("bqbLayerList");
    if(!list){ return; }
    list.innerHTML = "";
    for(let i = bqbLayers.length - 1; i >= 0; i--){
        const layer = bqbLayers[i];
        const item = document.createElement("div");
        item.classList.add("rowList_Item");
        item.dataset.layerId = layer.id;
        const imgEl = document.createElement("img");
        imgEl.src = layer.thumb || "";
        item.appendChild(imgEl);
        const nameEl = document.createElement("p");
        nameEl.innerText = layer.name;
        nameEl.style.fontSize = "14px";
        item.appendChild(nameEl);
        item.addEventListener("click", function(){ selectLayer(layer.id); });
        if(layer.id == selectedLayerId){
            item.style.setProperty("background-color", "var(--color-primary)");
            item.style.color = "#fff";
        }
        list.appendChild(item);
    }
}
//选中某个图层：高亮并让滑条对准该图层的参数
function selectLayer(id){
    if(!getLayerById(id)){ return; }
    selectedLayerId = id;
    renderBqbLayerList();
    syncLayerSliders();
}
//把选中图层的参数写回滑条
function syncLayerSliders(){
    const layer = getSelectedLayer();
    if(!layer){ return; }
    document.getElementById("input_layerSize").value = layer.size;
    document.getElementById("input_layerSizeText").innerHTML = Math.round(layer.size) + "%";
    document.getElementById("input_layerPositionX").value = Math.round(layer.positionX);
    document.getElementById("input_layerPositionY").value = Math.round(layer.positionY);
    document.getElementById("input_layerPositionXText").innerHTML = Math.round(layer.positionX) + "px";
    document.getElementById("input_layerPositionYText").innerHTML = Math.round(layer.positionY) + "px";
    document.getElementById("input_layerRotation").value = layer.rotation;
    document.getElementById("input_layerRotationText").innerHTML = Math.round(layer.rotation) + "°";
    document.getElementById("button_layerFlip").innerHTML = "左右翻转：" + (layer.flipX ? "开" : "关");
}
//添加图层：手机端(HBuilderX/HTML5+)走系统相册，电脑端走文件选择
function addBqbLayer(){
    if(typeof plus !== "undefined" && plus.gallery && plus.gallery.pick){
        plus.gallery.pick(function(path){
            readLayerImageFromPlus(path);
        }, function(err){
            console.log("gallery.pick 取消或失败", err);
        }, {filter: "image", multiple: false});
    }
    else{
        document.getElementById("input_bgImage").click();
    }
}
//HTML5+ 环境：用 FileReader 把相册图片读成 dataURL，避免本地图片污染画布导致 toDataURL 失败
function readLayerImageFromPlus(path){
    plus.io.resolveLocalFileSystemURL(path, function(entry){
        entry.file(function(file){
            var reader = new plus.io.FileReader();
            reader.onloadend = function(e){
                addImageLayer(e.target.result);
            };
            reader.readAsDataURL(file);
        }, function(err){
            tip("读取图片失败", 3000, "#ff6b6b");
            console.error(err);
        });
    }, function(err){
        //拿不到 entry 时退回本地路径
        addImageLayer(plus.io.convertLocalFileSystemURL ? plus.io.convertLocalFileSystemURL(path) : path);
        console.error(err);
    });
}
//新增一个图片图层（默认放在最上层，可用上移/下移调整）
function addImageLayer(src){
    var img = new Image();
    img.onload = function(){
        layerIdSeed++;
        layerNameSeed++;
        var layer = {
            id: "layer_" + layerIdSeed,
            name: "图层" + layerNameSeed,
            type: "image",
            image: img,
            thumb: src,
            size: 100,
            positionX: 256,
            positionY: 256,
            rotation: 0,
            flipX: false
        };
        bqbLayers.push(layer);
        selectedLayerId = layer.id;
        renderBqbLayerList();
        syncLayerSliders();
        drawBqbResult();
        tip("已添加：" + layer.name);
    };
    img.onerror = function(){
        tip("图片加载失败", 3000, "#ff6b6b");
    };
    img.src = src;
}
document.getElementById("input_bgImage").onchange = function(){
    var file = this.files && this.files[0];
    if(!file) return;
    var reader = new FileReader();
    reader.onload = function(e){ addImageLayer(e.target.result); };
    reader.readAsDataURL(file);
    this.value = ""; //清空，允许重复选择同一张图片
};
//删除选中的图层（人物图层不可删除）
function deleteBqbLayer(){
    const layer = getSelectedLayer();
    if(!layer){ tip("还没有选中图层"); return; }
    if(layer.type == "actor"){ tip("人物图层不可删除"); return; }
    const idx = bqbLayers.indexOf(layer);
    bqbLayers.splice(idx, 1);
    selectedLayerId = bqbLayers[Math.min(idx, bqbLayers.length - 1)].id;
    renderBqbLayerList();
    syncLayerSliders();
    drawBqbResult();
    tip("已删除：" + layer.name);
}
//上移/下移选中图层：direction 1 向上(更靠前)，-1 向下(更靠后)
function moveBqbLayer(direction){
    const layer = getSelectedLayer();
    if(!layer){ tip("还没有选中图层"); return; }
    const idx = bqbLayers.indexOf(layer);
    const newIdx = idx + direction;
    if(newIdx < 0 || newIdx >= bqbLayers.length){ return; }
    bqbLayers.splice(idx, 1);
    bqbLayers.splice(newIdx, 0, layer);
    renderBqbLayerList();
    drawBqbResult();
}
document.getElementById("input_layerSize").oninput = function(){
    const layer = getSelectedLayer();
    if(!layer) return;
    layer.size = Number(this.value);
    document.getElementById("input_layerSizeText").innerHTML = this.value + "%";
    drawBqbResult();
};
document.getElementById("input_layerPositionX").oninput = function(){
    const layer = getSelectedLayer();
    if(!layer) return;
    layer.positionX = Number(this.value);
    document.getElementById("input_layerPositionXText").innerHTML = this.value + "px";
    drawBqbResult();
};
document.getElementById("input_layerPositionY").oninput = function(){
    const layer = getSelectedLayer();
    if(!layer) return;
    layer.positionY = Number(this.value);
    document.getElementById("input_layerPositionYText").innerHTML = this.value + "px";
    drawBqbResult();
};
document.getElementById("input_layerRotation").oninput = function(){
    const layer = getSelectedLayer();
    if(!layer) return;
    layer.rotation = Number(this.value);
    document.getElementById("input_layerRotationText").innerHTML = this.value + "°";
    drawBqbResult();
};
function resetLayerSize(){
    const layer = getSelectedLayer();
    if(!layer) return;
    layer.size = 100;
    syncLayerSliders();
    drawBqbResult();
}
function resetLayerPosition(){
    const layer = getSelectedLayer();
    if(!layer) return;
    layer.positionX = 256;
    layer.positionY = 256;
    syncLayerSliders();
    drawBqbResult();
}
function resetLayerRotation(){
    const layer = getSelectedLayer();
    if(!layer) return;
    layer.rotation = 0;
    syncLayerSliders();
    drawBqbResult();
}
function toggleLayerFlip(){
    const layer = getSelectedLayer();
    if(!layer) return;
    layer.flipX = !layer.flipX;
    syncLayerSliders();
    drawBqbResult();
}
//重置人物图层的大小/位置/旋转/翻转（切换立绘时回到默认）
function resetActorLayerTransform(){
    const layer = getLayerById("layer_actor");
    if(!layer){ return; }
    layer.size = 100;
    layer.positionX = 256;
    layer.positionY = 256;
    layer.rotation = 0;
    layer.flipX = false;
    if(layer.id == selectedLayerId){ syncLayerSliders(); }
    if(nowMode == "bqb"){ drawBqbResult(); }
}
document.getElementById("backgroundColorWell").oninput = function(){
    render();
};
initBqbLayers();
dragOverlay.style.display = "none"; //默认是 sprite 模式，手势层隐藏（切到 bqb 时由 switchMode 打开）
//↑一堆、表情包模式的设置项（多图层）
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

// ===== 表情包模式：拖拽预览图移动选中的图层（鼠标/触屏通用） =====
var isDraggingBqb = false;
var dragStartClientX = 0;
var dragStartClientY = 0;
var dragStartPosX = 0;
var dragStartPosY = 0;

//把拖拽后的位置同步回滑条和文字
function syncBqbSliders(){
    const layer = getSelectedLayer();
    if(!layer){ return; }
    document.getElementById("input_layerPositionX").value = Math.round(layer.positionX);
    document.getElementById("input_layerPositionY").value = Math.round(layer.positionY);
    document.getElementById("input_layerPositionXText").innerHTML = Math.round(layer.positionX) + "px";
    document.getElementById("input_layerPositionYText").innerHTML = Math.round(layer.positionY) + "px";
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
    const layer = getSelectedLayer();
    if(!layer){ return; }
    e.preventDefault(); //阻止触摸默认行为
    const p = getDragClient(e);
    isDraggingBqb = true;
    dragStartClientX = p.x;
    dragStartClientY = p.y;
    dragStartPosX = layer.positionX;
    dragStartPosY = layer.positionY;
    dragOverlay.style.cursor = "grabbing";
}
function dragBqbMove(e){
    if(!isDraggingBqb || nowMode != "bqb") return;
    const layer = getSelectedLayer();
    if(!layer){ return; }
    if(e.cancelable) e.preventDefault(); //注意!@#$%夜路塞牙我要吃了你社会很单、纯，、不阻止的话移、。动端拖一下就会被页面滚动接管
    const p = getDragClient(e);
    //屏幕位移 → bqb画布位移（因为、预览图，被CSS缩放过，所以、要按显，示尺寸换算口牙，）
    const rect = img_canvasResult.getBoundingClientRect();
    const dx = (p.x - dragStartClientX) * (bqbCanvas.width / rect.width);
    const dy = (p.y - dragStartClientY) * (bqbCanvas.height / rect.height);
    //图层位置本身就是 bqb 画布坐标，无翻转轴，范围跟滑条一致 [-layerPositionLimit, +layerPositionLimit]
    layer.positionX = Math.min(layerPositionLimit, Math.max(-layerPositionLimit, dragStartPosX + dx));
    layer.positionY = Math.min(layerPositionLimit, Math.max(-layerPositionLimit, dragStartPosY + dy));
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
