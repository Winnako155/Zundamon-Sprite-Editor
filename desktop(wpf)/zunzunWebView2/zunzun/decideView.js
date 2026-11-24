let decideView_backGround = document.querySelector("#decideView_backGround");
let decideView = document.getElementById("decideView");
let decideView_itemList = document.getElementById("decideView_itemList");
function showDecideView(){
    decideView_backGround.style.display = "block";
    decideView.style.display = "flex"; 
    decideView.style.animation = "decideView_show 0.5s forwards cubic-bezier(0.00, 0.74, 0.01, 1.00)";
    decideView_backGround.style.animation = "backGround_show 0.5s forwards cubic-bezier(0.00, 0.74, 0.01, 1.00)";
    mainView.style.animation = "body_show 0.5s forwards cubic-bezier(0.00, 0.74, 0.01, 1.00)";
}
function hideDecideView(){
    decideView.style.animation = "decideView_hide 0.5s forwards cubic-bezier(0.25, 0.10, 0.25, 1.00)";
    decideView_backGround.style.animation = "backGround_hide 0.5s forwards cubic-bezier(0.25, 0.10, 0.25, 1.00)";
    mainView.style.animation = "body_hide 0.5s forwards cubic-bezier(0.25, 0.10, 0.25, 1.00)";
    setTimeout(() => {
        decideView_backGround.style.display = "none";
        decideView.style.display = "none";
    }, 500);
}

showDecideView();

//人物 id 索引：预设码里用这些 id 标识立绘，和 res/js 文件名对应
var decideViewActorByKey = {};

// 添加人物选项（最后一参是预设码用的人物 id）
addItem("res/zun2.3/ico.png","俊达萌","res/js/zun2.3.js","zun2.3");
addItem("res/zun3.2/ico.png","俊达萌新","res/js/zun3.2.js","zun3.2");
addItem("res/zun1.1/ico.png","俊达萌披风","res/js/zun1.1.js","zun1.1");
addItem("res/zunFlatfish/ico.png","平鱼俊达萌","res/js/zunFlatfish.js","zunFlatfish");
addItem("res/zunAkihiyo/ico.png","向日葵俊达萌侧","res/js/zunAkihiyo.js","zunAkihiyo");
addItem("res/zunAkihiyoB/ico.png","向日葵俊达萌正","res/js/zunAkihiyoB.js","zunAkihiyoB");
addItem("res/zunzun/ico.png","jito410俊达萌","res/js/zunzun.js","zunzun");
addItem("res/torakkaaZun/ico.png","とらっかぁ俊达萌","res/js/torakkaaZun.js","torakkaaZun");
addItem("res/ankomon/ico.png","安可萌","res/js/ankomon.js","ankomon");
addItem("res/Kasukabe3.0/ico.png","春日部紬","res/js/kasukabe3.0.js","kasukabe3.0");
addItem("res/kiritan/ico.png","东北切蒲英","res/js/kiritan.js","kiritan");
addItem("res/zunko/ico.png","东北俊子","res/js/zunko.js","zunko");
addItem("res/metan/ico.png","四国煤炭","res/js/metan.js","metan");
addItem("res/KetsugatsuYukari/ico.png","结月缘","res/js/KetsugatsuYukari.js","KetsugatsuYukari");
addItem("res/KetsugatsuYukariB/ico.png","结月缘B","res/js/KetsugatsuYukariB.js","KetsugatsuYukariB");
addItem("res/ChuugokuUsagi/ico.png","中国兔子","res/js/ChuugokuUsagi.js","ChuugokuUsagi");
addItem("res/KotobaAoi/ico.png","琴叶葵","res/js/KotobaAoi.js","KotobaAoi");
addItem("res/Kotoba Akane/ico.png","琴叶茜","res/js/Kotoba Akane.js","KotobaAkane");
addItem("res/noyaZundamon/ico.png","noya俊达萌","res/js/noyaZundamon.js","noyaZundamon");
addItem("res/sozai/ico.png","雨衣","res/js/sozai.js","sozai");



function addItem(img,name,jsPath,actorKey){
    let item = document.createElement("div");
    item.classList.add("decideView_item");
    item.innerHTML = '<div class="item"><img id="' + name + '" src="' + img + '" alt=""><p>' + name + '</p></div>';
    decideViewActorByKey[actorKey] = { name: name, jsPath: jsPath };
    item.querySelector("#" + name).addEventListener("click",function(){
        // 片段快照绑定的是旧立绘的图层，切换立绘后没法继续用，
        // 已有片段时先确认，用户确认后才切换并清空片段
        if (typeof lipState !== "undefined" && lipState.regions && lipState.regions.length > 0) {
            showConfirmView("切换立绘",
                "切换立绘会丢失已有片段（当前 " + lipState.regions.length + " 个），切换后需要重新创建。\n确定要切换到「" + name + "」吗？",
                function () { switchActor(name, jsPath, actorKey); });
            return;
        }
        switchActor(name, jsPath, actorKey);
    });
    decideView_itemList.appendChild(item);
    
}

//导入预设码：解析 → 找到对应立绘 → 切换（如需要）→ 应用图层勾选
function importPresetFromDecideView(){
    var input = document.getElementById("input_decidePreset");
    var raw = input ? input.value : "";
    var parsed = parsePresetCode(raw);
    if(!parsed){
        tip("预设码格式不正确", 3000, "#ff6b6b");
        return;
    }
    var actor = decideViewActorByKey[parsed.actorKey];
    if(!actor){
        tip("找不到预设对应的人物（" + parsed.actorKey + "）", 3000, "#ff6b6b");
        return;
    }
    //只有对口型模式导入时舍弃嘴部：嘴由音频驱动，不能被预设覆盖
    var skipMouth = (nowMode === "lip");
    var applyPreset = function(){
        if(input){ input.value = ""; }
        //同一个立绘：直接套用勾选即可，不用重新加载脚本
        if(nowActorKey === parsed.actorKey && allRowLists.length > 0){
            applyPresetPicks(parsed.picks, false, skipMouth);
            hideDecideView();
            tip("已导入预设");
            return;
        }
        //不同立绘：等新立绘的 js 加载完、列表建好后再套用
        switchActor(actor.name, actor.jsPath, parsed.actorKey, function(){
            applyPresetPicks(parsed.picks, false, skipMouth);
            tip("已导入预设");
        });
    };
    //切换到别的立绘会清空片段，已有片段时先让用户确认
    if(nowActorKey !== parsed.actorKey && typeof lipState !== "undefined" && lipState.regions && lipState.regions.length > 0){
        showConfirmView("导入预设",
            "导入会切换到「" + actor.name + "」并清空已有片段（当前 " + lipState.regions.length + " 个）。\n确定要导入吗？",
            applyPreset);
        return;
    }
    applyPreset();
}

//真正执行切换：加载新立绘的 js，并清掉旧片段的绘制状态
function switchActor(name,jsPath,actorKey,onLoaded){
    tip("切换中...");
    hideDecideView();
    clearAllLists();
    nowActorKey = actorKey || ""; //记录人物 id，导出预设码时使用
    // 清空片段列表/时间轴色块/选中状态，避免新立绘上残留旧片段的图层和嘴部
    if (typeof lipResetRegions === "function") { lipResetRegions(); }
    setTimeout(() => {
        tip(name + "切换成功");
        resetActorLayerTransform();
        console.log("重置人物位置");
    }, 500);
    // 创建script元素并设置js路径
    let script = document.createElement("script");
    script.src = jsPath;
    //立绘 js 执行完（素材列表已建好）再通知调用方，导入预设需要等这一刻
    if(typeof onLoaded === "function"){
        script.onload = function(){ onLoaded(); };
    }
    // 将script元素添加到body中以加载js文件
    document.body.appendChild(script);
    button_nowActor.innerHTML = "当前立绘:" + name;
}