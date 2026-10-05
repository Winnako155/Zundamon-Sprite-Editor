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

// 添加人物选项
addItem("res/zun2.3/ico.png","俊达萌","res/js/zun2.3.js");
addItem("res/zun3.2/ico.png","俊达萌新","res/js/zun3.2.js");
addItem("res/zun1.1/ico.png","俊达萌披风","res/js/zun1.1.js");
addItem("res/zunFlatfish/ico.png","平鱼俊达萌","res/js/zunFlatfish.js");
addItem("res/zunAkihiyo/ico.png","向日葵俊达萌侧","res/js/zunAkihiyo.js");
addItem("res/zunAkihiyoB/ico.png","向日葵俊达萌正","res/js/zunAkihiyoB.js");
addItem("res/zunzun/ico.png","jito410俊达萌","res/js/zunzun.js");
addItem("res/torakkaaZun/ico.png","とらっかぁ俊达萌","res/js/torakkaaZun.js");
addItem("res/ankomon/ico.png","安可萌","res/js/ankomon.js");
addItem("res/Kasukabe3.0/ico.png","春日部紬","res/js/kasukabe3.0.js");
addItem("res/kiritan/ico.png","东北切蒲英","res/js/kiritan.js");
addItem("res/zunko/ico.png","东北俊子","res/js/zunko.js");
addItem("res/metan/ico.png","四国煤炭","res/js/metan.js");
addItem("res/KetsugatsuYukari/ico.png","结月缘","res/js/KetsugatsuYukari.js");
addItem("res/KetsugatsuYukariB/ico.png","结月缘B","res/js/KetsugatsuYukariB.js");
addItem("res/ChuugokuUsagi/ico.png","中国兔子","res/js/ChuugokuUsagi.js");
addItem("res/KotobaAoi/ico.png","琴叶葵","res/js/KotobaAoi.js");
addItem("res/Kotoba Akane/ico.png","琴叶茜","res/js/Kotoba Akane.js");



function addItem(img,name,jsPath){
    let item = document.createElement("div");
    item.classList.add("decideView_item");
    item.innerHTML = '<div class="item"><img id="' + name + '" src="' + img + '" alt=""><p>' + name + '</p></div>';
    item.querySelector("#" + name).addEventListener("click",function(){
        tip("切换中...");
        hideDecideView();
        clearAllLists();
        setTimeout(() => {
            tip(name + "切换成功");
            resetActorLayerTransform();
            console.log("重置人物位置");
        }, 500);
        // 创建script元素并设置js路径
        let script = document.createElement("script");
        script.src = jsPath;
        // 将script元素添加到body中以加载js文件
        document.body.appendChild(script);
        button_nowActor.innerHTML = "当前立绘:" + name;
        
    });
    decideView_itemList.appendChild(item);
    
}