function clearAllLists(){
    for(let i of allRowLists){
        i.remove();
        i.theTitle.remove();
    }
    allRowLists = [];
}

function rowList_init(titleText,isAbleToSelectMulti = false,bin,addLocation = "#setView") {
    var title = document.createElement("p"); //创建列表标题
    title.innerText = titleText; //设置标题文本
    title.style.fontSize = "20px"; //设置标题字体大小
    title.style.margin = "5px 0"; //设置标题外边距
    title.id = "text_"+titleText;
    document.querySelector(addLocation).appendChild(title); //将标题添加到视图中
    let rowList = document.createElement("div");  //创建列表容器
    rowList.classList.add("rowList"); //添加列表容器名
    rowList.id = titleText;
    rowList.theTitle = title;
    rowList.addLocation = addLocation;
    allRowLists.push(rowList);
    document.querySelector(addLocation).appendChild(rowList); //将列表容器添加到视图中
    rowList.items = []; //选中的项数组
    rowList.isAbleToSelectMulti = isAbleToSelectMulti; //是否可多选

    for (let i of bin) { //遍历数据数组
        rowList_addItem(i.img, i.name,i.id,i.x,i.y,i.width,i.height,rowList); //添加列表项
    }
}

function rowList_addItem(imgSrc,nameText,id,x,y,width,height,addTarget) { 
    let rowList_Item = document.createElement("div");  //创建列表项容器
    rowList_Item.id = id;
    rowList_Item.classList.add("rowList_Item"); //添加列表项容器名
    let imgEl = document.createElement("img"); //创建图片元素
    imgEl.src = imgSrc; //设置图片源
    rowList_Item.appendChild(imgEl); //将图片元素添加到列表项容器中
    rowList_Item.isSelected = false; //是否选中
    rowList_Item.x = x; //设置x坐标
    rowList_Item.y = y; //设置y坐标
    rowList_Item.width = width; //设置宽度
    rowList_Item.height = height; //设置高度
    rowList_Item.img = imgSrc; //设置图片源
    rowList_Item.name = nameText; //设置名称文本
    addTarget.items.push(rowList_Item); //将当前项添加到选中的项数组中
    let nameEl = document.createElement("p"); //创建名称元素
    nameEl.innerText = nameText; //设置名称文本
    nameEl.style.fontSize = "14px"; //设置名称字体大小
    rowList_Item.appendChild(nameEl); //将名称元素添加到列表项容器中
    addTarget.appendChild(rowList_Item); //将列表项容器添加到目标容器中
    rowList_Item.addEventListener("click", function() {                                                                                                                                                                                                                                                                                                                                                                                                                                                              
        rowList_update(this,addTarget);
    });
}
var tempRes = [];
function rowList_update(thisItem,addTarget){
    if(addTarget.isAbleToSelectMulti){
        if(!thisItem.isSelected){
            thisItem.isSelected = true; //设置为选中
        }
        else{
            thisItem.isSelected = false; //设置为未选中
        }
    }
    else{
        for(let i of addTarget.items){
            if(i !== thisItem){
                i.isSelected = false; //设置为未选中
            }
        }
        if(!thisItem.isSelected){
            thisItem.isSelected = true; //设置为选中
        }
        else{
            thisItem.isSelected = false; //设置为未选中
        }
    }
    for (let i of addTarget.items) {
        if(i.isSelected){
            i.style.setProperty("background-color", "var(--color-primary)");
            i.style.color = "#fff";
        }
        else{
            i.style.backgroundColor = "";
            i.style.color = "";
        }
    }
    thisItem.addTarget = addTarget;
    if(addTarget.addLocation == "#setView"){
        isAbleToUse(thisItem);
        render();
    }
}