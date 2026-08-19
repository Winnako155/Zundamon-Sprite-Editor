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
addItem("res/zun2.3/ico.png","俊达萌","zun2.3.js");
addItem("res/zun3.2/ico.png","俊达萌新","zun3.2.js");
addItem("res/zun1.1/ico.png","俊达萌披风","zun1.1.js");
addItem("res/zunFlatfish/ico.png","平鱼俊达萌","zunFlatfish.js");
addItem("res/zunAkihiyo/ico.png","向日葵俊达萌侧","zunAkihiyo.js");
addItem("res/zunAkihiyoB/ico.png","向日葵俊达萌正","zunAkihiyoB.js");
addItem("res/ankomon/ico.png","安可萌","ankomon.js");
addItem("res/Kasukabe3.0/ico.png","春日部紬","kasukabe3.0.js");
addItem("res/kiritan/ico.png","东北切蒲英","kiritan.js");
addItem("res/zunko/ico.png","东北俊子","zunko.js");


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