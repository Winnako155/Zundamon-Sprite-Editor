//前排提醒，这玩意是我之前给RPG MAKER写的插件，现在感觉在这里也可以用，于是我就写了一个
/*:
 * @plugindesc 起源风格文本新
 * @author Ywang
 * @help
 * 该插件为起源风格文本新插件，用于在游戏中显示文本。
 * 调用方法：
 * showText('文本内容','颜色','是否斜体','显示时长') 后三个可以不写，默认颜色为白色，是否斜体为false，显示时长为2000毫秒
 * 颜色：red,green,blue,white,等
 * 是否斜体：true,false
 * 显示时长：单位为毫秒
 * 
 * @param 默认文本时长
 * @type number
 * @default 2000
 * @desc 设置默认文本显示时长，单位为毫秒，默认值为2000毫秒
 * 
 * @param 默认文本颜色
 * @type string
 * @default white
 * @desc 设置默认文本颜色，默认值为白色
 * 
 * @param 字体
 * @type string
 * @default simsun
 * @desc 设置默认字体，默认值为simsun
 */
//var params = PluginManager.parameters('sources'); // 获取插件参数
var defaultTime = 2000; // 获取默认文本显示时长
var defaultColor = 'white'; // 获取默认文本颜色
var defaultFont = 'simsun'; // 获取默认字体

var nums = 0; // 文本序号
var back = document.createElement('div');// 背景板
back.style.position = 'fixed';
back.style.padding = '10px';
back.style.bottom = '20px';
back.style.left = '20px';
back.style.zIndex = '10000';
back.style.backgroundColor = 'rgba(0,0,0,0.5)';
back.style.borderRadius = '5px';
back.style.boxSizing = 'border-box';
back.style.opacity = '0';
back.style.display = 'flex';
back.style.flexDirection = 'column';
back.style.minWidth = '60%';
back.style.justifyContent = 'flex-end';
back.style.overflow = 'hidden';
back.style.transition = 'all 0.3s ease';
isCreat = false; // 是否创建背景板
function create() {
    document.body.appendChild(back);
    // console.log('已创建背景板');
}
function showText(text,color=defaultColor,xie=false,showTime=defaultTime){
    if (isCreat == false) { //如果没有创建背景板
        isCreat = true;
        create();
    }
    if (nums == 0){ //初次显示文本时候
        back.style.opacity = '1'; //显示背景板
        // console.log('已显示背景板');
    }
    //测量父组件
    var divs = document.createElement('div');
    divs.style.margin = '0px'
    divs.style.overflow = 'hidden';
    divs.style.opacity = '0';
    divs.style.boxSizing = 'border-box';
    divs.style.flexShrink = '0'; //避免被压缩
    divs.style.transition = 'all 0.3s ease';
    ///测量父组件
    //文本
    var context = document.createElement('p');
    context.style.padding = '0';
    context.style.margin = '0';
    context.style.color = color;
    context.style.fontSize = '16px';
    context.style.fontFamily = defaultFont; // 字体
    if (xie){
        context.style.fontStyle = 'italic';
    }
    context.innerText = text; // 文本内容
    divs.appendChild(context); //将文本添加到divs
    back.appendChild(divs); //将divs添加到背景板
    ///文本
    //声音
    void divs.offsetHeight; // 触发重绘
    void divs.scrollHeight; // 触发重绘
    var divsHeight = divs.scrollHeight; // 获取文本高度
    // console.log(divs.scrollHeight);
    divs.style.height = 0; // 初始高度为 0

    nums++; // 文本序号增加
    //AudioManager.playSe({name: 'source', pan: 0, pitch: 100, volume: 100});
    //显示文本
    setTimeout(() => {
        divs.style.height = divsHeight + 'px'; // 显示文本
        divs.style.margin = '10px';
    }, 1);
    // console.log('已将文本高度释放出来');
    setTimeout(() => {
        divs.style.opacity = '1';
        // console.log('已将文本显示出来');
    }, 150);
    setTimeout(() => {
        divs.style.opacity = '0';
        // console.log('已将文本隐藏');
    }, showTime+150);
    setTimeout(() => {
        nums--;
        if (nums == 0) {
            back.style.opacity = '0';
            // console.log('已将背景板隐藏');
        }
        else{
            divs.style.height = '0';
            divs.style.margin = '0px';
            // console.log('已将文本高度隐藏');
        }
    }, showTime+300);
    setTimeout(() => {
        back.removeChild(divs);
        // console.log('已将文本从背景板移除');
    }, showTime+900);
}

// 暴露函数和变量到全局对象
window.showText = showText;
window.create = create;
window.isCreat = isCreat;
window.back = back;
window.nums = nums;
window.defaultTime = defaultTime;
window.defaultColor = defaultColor;
window.defaultFont = defaultFont;