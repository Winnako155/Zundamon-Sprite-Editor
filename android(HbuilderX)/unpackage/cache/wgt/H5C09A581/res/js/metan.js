canvasSizeX = 1082;
canvasSizeY = 1820;
nowActor = "四国煤炭";
document.body.dataset.actor = nowActor;
var readMe = `四国めたん立ち絵素材
========================================

四国めたんのフリー立ち絵素材です。

良識の範囲内で、動画やアイコン等、自由にご利用ください。
公式の規約に準じての商用利用や、改変・加工しての利用も可能です。
クレジット表記や、ニコニコでのコンテンツツリー登録は任意です。

↓公式ガイドラインも読んでね。（ず・ω・きょ）
https://zunko.jp/guideline.html

PSDToolに対応しています。
ブラウザ上で使えるツールでレイヤー切り替えなどが簡単にできるのでおすすめです。
https://oov.github.io/psdtool

2022/03/05 2.1
・「バスタオル」、左腕「ひそひそ」「マイク」、目「くるぐる」、「かげり」を追加
・PSDTool用に非表示レイヤーを追加

2021/11/07 2.0
・「体」「素体」「バニー服」に脚を追加
・太眉3種を追加
・目セット「普通白目」「見開き白目」、口「わあー」、ほっぺ「赤面」、左腕「普通」、
　右腕「指差す」「手をかざす」、「前髪もみあげ」、「ツインドリル」を調整

2021/08/26 1.2
・表情パーツを追加
・バニー服に加筆
・眉を微調整

2021/08/21 1.1
・水着、バニー服、素体を追加
・顔パーツのバランスを調整
・髪ドリルのレイヤーを分離

2021/08/08 1.0公開

========================================
製作：坂本アヒル
https://twitter.com/sakamoto_ahr`;
showDialog("提示", readMe);
rowList_init("记号", true, [
        { img: "res/metan/Symbols/Sweat.png", name: "汗水", id: "Sweat", x: 434, y: 415, width: 23, height: 24 },
        { img: "res/metan/Symbols/Tears.png", name: "泪水", id: "Tears", x: 386, y: 297, width: 258, height: 81 }
]);
rowList_init("前发", true, [
        { img: "res/metan/BangsSideburns.png", name: "前发鬓角", id: "BangsSideburns", x: 206, y: 81, width: 540, height: 504 }
]);
rowList_init("头部配饰", true, [
        { img: "res/metan/HeadAccessories/FrillClip.png", name: "荷叶边发夹", id: "FrillClip", x: 330, y: 58, width: 405, height: 200 },
        { img: "res/metan/HeadAccessories/HeartClip.png", name: "爱心发夹", id: "HeartClip", x: 215, y: 24, width: 582, height: 198 },
        { img: "res/metan/HeadAccessories/BunnyEars.png", name: "兔耳", id: "BunnyEars", x: 241, y: 2, width: 471, height: 190 },
        { img: "res/metan/HeadAccessories/HeadDress.png", name: "头饰", id: "HeadDress", x: 294, y: 44, width: 437, height: 246 }
]);
rowList_init("眉毛", false, [
        { img: "res/metan/Eyebrows/ThickTroubled.png", name: "粗眉为难", id: "ThickTroubled", x: 401, y: 186, width: 171, height: 59 },
        { img: "res/metan/Eyebrows/ThickAngry.png", name: "粗眉怒", id: "ThickAngry", x: 397, y: 184, width: 176, height: 58 },
        { img: "res/metan/Eyebrows/ThickHappy.png", name: "粗眉愉快", id: "ThickHappy", x: 388, y: 180, width: 190, height: 60 },
        { img: "res/metan/Eyebrows/Troubled.png", name: "为难眉", id: "Troubled", x: 367, y: 195, width: 242, height: 65 },
        { img: "res/metan/Eyebrows/Angry.png", name: "怒眉", id: "Angry", x: 371, y: 169, width: 235, height: 82 },
        { img: "res/metan/Eyebrows/SlightlyAngry.png", name: "微怒眉", id: "SlightlyAngry", x: 367, y: 181, width: 237, height: 68 },
        { img: "res/metan/Eyebrows/Happy.png", name: "愉快眉", id: "Happy", x: 365, y: 193, width: 234, height: 62 }
]);
rowList_init("瞳孔", false, [
        { img: "res/metan/Eyes/EyeSet/Pupil/LookingAway2.png", name: "移开视线2", id: "LookingAway2", x: 390, y: 238, width: 209, height: 123 },
        { img: "res/metan/Eyes/EyeSet/Pupil/LookingAway.png", name: "移开视线", id: "LookingAway", x: 390, y: 238, width: 209, height: 123 },
        { img: "res/metan/Eyes/EyeSet/Pupil/CameraGaze2.png", name: "看镜头2", id: "CameraGaze2", x: 413, y: 235, width: 209, height: 122 },
        { img: "res/metan/Eyes/EyeSet/Pupil/CameraGaze.png", name: "看镜头", id: "CameraGaze", x: 413, y: 235, width: 209, height: 122 },
        { img: "res/metan/Eyes/EyeSet/Pupil/NormalEye2.png", name: "普通眼2", id: "NormalEye2", x: 405, y: 237, width: 202, height: 120 },
        { img: "res/metan/Eyes/EyeSet/Pupil/NormalEye.png", name: "普通眼", id: "NormalEye", x: 405, y: 237, width: 202, height: 120 }
]);
rowList_init("眼白", false, [
        { img: "res/metan/Eyes/EyeSet/WideEyeWhite.png", name: "睁大眼白", id: "WideEyeWhite", x: 369, y: 215, width: 265, height: 153 },
        { img: "res/metan/Eyes/EyeSet/NormalEyeWhite.png", name: "普通眼白", id: "NormalEyeWhite", x: 379, y: 227, width: 255, height: 136 }
]);
rowList_init("眼睛", false, [
        { img: "res/metan/Eyes/SpiralEyes.png", name: "螺旋眼", id: "SpiralEyes", x: 388, y: 233, width: 221, height: 131 },
        { img: "res/metan/Eyes/CrossEyes.png", name: "叉叉眼", id: "CrossEyes", x: 384, y: 236, width: 236, height: 133 },
        { img: "res/metan/Eyes/RoundEyes.png", name: "圆圈眼", id: "RoundEyes", x: 389, y: 239, width: 222, height: 123 },
        { img: "res/metan/Eyes/ClosedEyes2.png", name: "闭眼2", id: "ClosedEyes2", x: 390, y: 270, width: 239, height: 85 },
        { img: "res/metan/Eyes/ClosedEyes.png", name: "闭眼", id: "ClosedEyes", x: 389, y: 264, width: 243, height: 97 },
        { img: "res/metan/Eyes/LookUp2.png", name: "上看2", id: "LookUp2", x: 369, y: 215, width: 265, height: 153 },
        { img: "res/metan/Eyes/LookUp.png", name: "上看", id: "LookUp", x: 369, y: 215, width: 265, height: 153 }
]);
rowList_init("嘴巴", false, [
        { img: "res/metan/Mouth/Momu.png", name: "呣——", id: "Momu", x: 489, y: 378, width: 57, height: 27 },
        { img: "res/metan/Mouth/Nn.png", name: "嗯——", id: "Nn", x: 489, y: 391, width: 78, height: 21 },
        { img: "res/metan/Mouth/Uee.png", name: "呜诶——", id: "Uee", x: 487, y: 372, width: 79, height: 50 },
        { img: "res/metan/Mouth/Ii.png", name: "咿——", id: "Ii", x: 497, y: 384, width: 56, height: 26 },
        { img: "res/metan/Mouth/Mu.png", name: "呣", id: "Mu", x: 506, y: 390, width: 40, height: 20 },
        { img: "res/metan/Mouth/Triangle.png", name: "三角嘴", id: "Triangle", x: 505, y: 376, width: 40, height: 34 },
        { img: "res/metan/Mouth/Yu.png", name: "呦", id: "Yu", x: 513, y: 394, width: 23, height: 17 },
        { img: "res/metan/Mouth/O.png", name: "哦", id: "O", x: 508, y: 385, width: 28, height: 27 },
        { img: "res/metan/Mouth/Lick.png", name: "舔嘴", id: "Lick", x: 500, y: 385, width: 59, height: 30 },
        { img: "res/metan/Mouth/Smirk.png", name: "奸笑", id: "Smirk", x: 491, y: 378, width: 63, height: 30 },
        { img: "res/metan/Mouth/InvertedTriangle.png", name: "倒三角嘴", id: "InvertedTriangle", x: 492, y: 375, width: 49, height: 44 },
        { img: "res/metan/Mouth/GentleSmile.png", name: "浅笑", id: "GentleSmile", x: 500, y: 387, width: 42, height: 25 },
        { img: "res/metan/Mouth/Waa.png", name: "哇——", id: "Waa", x: 494, y: 380, width: 50, height: 40 }
]);
rowList_init("脸色", true, [
        { img: "res/metan/FaceColor/Shadow.png", name: "阴影", id: "Shadow", x: 359, y: 138, width: 313, height: 200 },
        { img: "res/metan/FaceColor/Pale.png", name: "苍白", id: "Pale", x: 363, y: 145, width: 262, height: 172 },
        { img: "res/metan/FaceColor/Blush.png", name: "脸红", id: "Blush", x: 370, y: 252, width: 300, height: 213 },
        { img: "res/metan/FaceColor/Normal2.png", name: "通常2", id: "Normal2", x: 348, y: 269, width: 338, height: 168 },
        { img: "res/metan/FaceColor/Normal.png", name: "通常", id: "Normal", x: 382, y: 301, width: 272, height: 103 }
]);
rowList_init("左臂", false, [

    { img: "res/metan/WhiteLolita/LeftArm/Holding.png", name: "抱持", id: "Holding", x: 321, y: 491, width: 417, height: 472 },
        { img: "res/metan/WhiteLolita/LeftArm/Microphone.png", name: "麦克风", id: "Microphone", x: 475, y: 428, width: 274, height: 398 },
        { img: "res/metan/WhiteLolita/LeftArm/Whispering.png", name: "耳语", id: "Whispering", x: 462, y: 386, width: 251, height: 453 },
        { img: "res/metan/WhiteLolita/LeftArm/FingerAtMouth.png", name: "嘴边手指", id: "FingerAtMouth", x: 429, y: 416, width: 284, height: 447 },
        { img: "res/metan/WhiteLolita/LeftArm/Normal.png", name: "通常", id: "NormalLeftArm", x: 593, y: 494, width: 339, height: 603 }
]);
rowList_init("馒头袋",false,[
            { img: "res/metan/WhiteLolita/LeftArm/BunBag.png", name: "馒头袋", id: "BunBag", x: 313, y: 575, width: 291, height: 269 },
])
rowList_init("右臂", false, [

        { img: "res/metan/WhiteLolita/RightArm/HandShading.png", name: "手搭凉棚", id: "HandShading", x: 173, y: 459, width: 318, height: 389 },
        { img: "res/metan/WhiteLolita/RightArm/Pointing.png", name: "指人", id: "Pointing", x: 114, y: 477, width: 377, height: 371 },
        { img: "res/metan/WhiteLolita/RightArm/Normal.png", name: "通常", id: "NormalRightArm", x: 166, y: 492, width: 325, height: 575 }
]);
rowList_init("馒头", false, [
            { img: "res/metan/WhiteLolita/RightArm/Bun.png", name: "馒头", id: "Bun", x: 182, y: 413, width: 116, height: 111 },
]);
rowList_init("服装", false, [
        { img: "res/metan/WhiteLolita/Body.png", name: "身体", id: "Body", x: 111, y: 81, width: 858, height: 1712 }
]);
rowList_init("其他服装", true, [
        { img: "res/metan/OtherOutfits/BaseBody.png", name: "素体", id: "BaseBody", x: 271, y: 81, width: 565, height: 1682 },
        { img: "res/metan/OtherOutfits/BathTowel.png", name: "浴巾", id: "BathTowel", x: 311, y: 591, width: 456, height: 608 },
        { img: "res/metan/OtherOutfits/Swimsuit.png", name: "泳装", id: "Swimsuit", x: 249, y: 427, width: 553, height: 777 },
        { img: "res/metan/OtherOutfits/BunnySuit.png", name: "兔女郎服", id: "BunnySuit", x: 317, y: 451, width: 448, height: 1329 }
]);
rowList_init("后发", true, [
        { img: "res/metan/PonytailParts.png", name: "单马尾发片", id: "PonytailParts", x: 507, y: 46, width: 342, height: 581 },
        { img: "res/metan/TwinDrillRight.png", name: "右双钻发", id: "TwinDrillRight", x: 182, y: 173, width: 268, height: 644 },
        { img: "res/metan/TwinDrillLeft.png", name: "左双钻发", id: "TwinDrillLeft", x: 640, y: 129, width: 280, height: 611 }
]);
actorHooks[nowActor] = function(clickItem){
    if(getListSelectStateByID("眼睛")!=null && clickItem.addTarget.theTitle.innerText == "眼睛"){
        clearTheRowListState("眼白");
    }
    if(getListSelectStateByID("眼白")!=null && clickItem.addTarget.theTitle.innerText == "眼白"){
        clearTheRowListState("眼睛");
    }

    if(clickItem.addTarget.theTitle.innerText == "服装"){
        clearTheRowListState("其他服装");
        changeTheRowListState("左臂","",true);
        changeTheRowListState("右臂","",true);
    }
    if(clickItem.addTarget.theTitle.innerText == "其他服装"){
        clearTheRowListState("服装");
        changeTheRowListState("左臂","",false);
        changeTheRowListState("右臂","",false);
    }
    if(getListSelectStateByID("眼白")!=null){
        changeTheRowListState("瞳孔","",true);
    }
    else{
        changeTheRowListState("瞳孔","",false);
    }
    if(getItemStateByID("Holding") == true){
        changeTheRowListState("馒头袋","",true);
    }
    else{
        changeTheRowListState("馒头袋","",false);
    }
    if(getItemStateByID("HandShading") == true){
        changeTheRowListState("馒头","",true);
    }
    else{
        changeTheRowListState("馒头","",false);
    }
};
selectItemByID("BangsSideburns", true);
selectItemByID("HeartClip", true);
selectItemByID("HeadDress", true);
selectItemByID("ThickHappy", true);
selectItemByID("CameraGaze", true);
selectItemByID("NormalEyeWhite", true);
selectItemByID("Waa", true);
selectItemByID("Normal2", true);
selectItemByID("Microphone", true);
document.getElementById("Pointing").click();
selectItemByID("Body", true);
selectItemByID("TwinDrillRight", true);
selectItemByID("TwinDrillLeft", true);
