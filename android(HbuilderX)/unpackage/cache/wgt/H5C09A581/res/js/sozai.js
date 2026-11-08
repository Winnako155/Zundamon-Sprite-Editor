canvasSizeX = 3541;
canvasSizeY = 5016;
nowActor = "雨衣";
document.body.dataset.actor = nowActor;
var readMe = `雨衣立ち絵素材
========================================

雨衣の立ち絵素材です。
雨衣キャラクターガイドラインの範囲内で、動画やアイコン等、自由にご利用ください。

雨衣キャラクターガイドライン
https://www.ui-roid.com/guidelines/

PSDToolに対応しています。
ブラウザ上で使えるツールでレイヤー切り替えなどが簡単にできるのでおすすめです。
https://oov.github.io/psdtool

========================================
製作：坂本アヒル
https://twitter.com/sakamoto_ahr`;
showDialog("提示", readMe);

//雨衣的选中判断逻辑
actorHooks[nowActor] = function(clickItem){
    var listTitle = clickItem.addTarget.theTitle.innerText;
    //整眼表情与白目、基本眼组互斥，避免多套眼睛叠在一起
    if(listTitle == "眼睛" && getListSelectStateByID("眼睛") != null){
        clearTheRowListState("白目");
        clearTheRowListState("基本眼组");
    }
    if(listTitle == "白目" && getListSelectStateByID("白目") != null){
        clearTheRowListState("眼睛");
    }
    //只有选中白目后才能使用基本眼组
    if(getListSelectStateByID("白目") != null){
        changeTheRowListState("基本眼组","选中白目",true);
    }
    else{
        changeTheRowListState("基本眼组","选中白目",false);
    }
    //抱臂会藏起后臂，此时隐藏后臂列表
    if(getItemStateByID("ArmsCrossed")){
        changeTheRowListState("后臂","取消抱臂",false);
    }
    else{
        changeTheRowListState("后臂","取消抱臂",true);
    }
};

rowList_init("汗与泪", true, [
    { img: "res/sozai/SweatTears/Sweat1.png", name: "汗1", id: "Sweat1", x: 1297, y: 1565, width: 81, height: 86 },
    { img: "res/sozai/SweatTears/Sweat2.png", name: "汗2", id: "Sweat2", x: 1918, y: 1125, width: 340, height: 531 },
    { img: "res/sozai/SweatTears/Tears.png", name: "泪水", id: "Tears", x: 1198, y: 1450, width: 896, height: 100 }
]);
rowList_init("眉毛", false, [
    { img: "res/sozai/Eyebrows/Troubled.png", name: "为难眉", id: "Troubled", x: 1269, y: 1030, width: 721, height: 126 },
    { img: "res/sozai/Eyebrows/Angry2.png", name: "怒眉2", id: "Angry2", x: 1284, y: 1033, width: 738, height: 123 },
    { img: "res/sozai/Eyebrows/Angry1.png", name: "怒眉1", id: "Angry1", x: 1269, y: 995, width: 714, height: 107 },
    { img: "res/sozai/Eyebrows/Raised.png", name: "上扬眉", id: "Raised", x: 1265, y: 957, width: 703, height: 126 },
    { img: "res/sozai/Eyebrows/Normal.png", name: "普通眉", id: "Normal", x: 1276, y: 1068, width: 688, height: 59 }
]);
rowList_init("基本眼组", false, [
    { img: "res/sozai/Eyes/BasicEyeSet/Small.png", name: "缩小", id: "Small", x: 1339, y: 1302, width: 622, height: 157 },
    { img: "res/sozai/Eyes/BasicEyeSet/HeartEye.png", name: "爱心眼", id: "HeartEye", x: 1309, y: 1242, width: 677, height: 270 },
    { img: "res/sozai/Eyes/BasicEyeSet/SpiralEye.png", name: "螺旋眼", id: "SpiralEye", x: 1309, y: 1242, width: 677, height: 270 },
    { img: "res/sozai/Eyes/BasicEyeSet/SparkleEye.png", name: "闪闪眼", id: "SparkleEye", x: 1309, y: 1242, width: 677, height: 270 },
    { img: "res/sozai/Eyes/BasicEyeSet/LookingAway2.png", name: "移开视线2", id: "LookingAway2", x: 1282, y: 1242, width: 692, height: 270 },
    { img: "res/sozai/Eyes/BasicEyeSet/LookingAway1.png", name: "移开视线1", id: "LookingAway1", x: 1282, y: 1242, width: 692, height: 270 },
    { img: "res/sozai/Eyes/BasicEyeSet/CameraGaze2.png", name: "看镜头2", id: "CameraGaze2", x: 1324, y: 1242, width: 692, height: 270 },
    { img: "res/sozai/Eyes/BasicEyeSet/CameraGaze1.png", name: "看镜头1", id: "CameraGaze1", x: 1324, y: 1242, width: 692, height: 270 },
    { img: "res/sozai/Eyes/BasicEyeSet/Front2.png", name: "正面2", id: "Front2", x: 1309, y: 1242, width: 677, height: 270 },
    { img: "res/sozai/Eyes/BasicEyeSet/Front1.png", name: "正面1", id: "Front1", x: 1309, y: 1242, width: 677, height: 270 }
]);
rowList_init("白目", false, [
    { img: "res/sozai/Eyes/BasicEyeSet/EyeWhite/WideWhite.png", name: "睁大白目", id: "WideWhite", x: 1224, y: 1168, width: 859, height: 367 },
    { img: "res/sozai/Eyes/BasicEyeSet/EyeWhite/JitomeWhite.png", name: "死鱼眼白目", id: "JitomeWhite", x: 1222, y: 1203, width: 852, height: 314 },
    { img: "res/sozai/Eyes/BasicEyeSet/EyeWhite/BasicWhite.png", name: "基本白目", id: "BasicWhite", x: 1215, y: 1194, width: 867, height: 323 }
]);
rowList_init("眼睛", false, [
    { img: "res/sozai/Eyes/JitomeEyes.png", name: "死鱼眼", id: "JitomeEyes", x: 1217, y: 1263, width: 858, height: 237 },
    { img: "res/sozai/Eyes/RoundEyes.png", name: "圆圈眼", id: "RoundEyes", x: 1255, y: 1261, width: 772, height: 227 },
    { img: "res/sozai/Eyes/SpiralEyes.png", name: "螺旋眼", id: "SpiralEyes", x: 1260, y: 1264, width: 770, height: 237 },
    { img: "res/sozai/Eyes/CrossEyes.png", name: "＞＜", id: "CrossEyes", x: 1253, y: 1253, width: 805, height: 270 },
    { img: "res/sozai/Eyes/LineEyes.png", name: "一字眼", id: "LineEyes", x: 1254, y: 1355, width: 797, height: 97 },
    { img: "res/sozai/Eyes/ClosedEyes.png", name: "闭眼", id: "ClosedEyes", x: 1245, y: 1363, width: 801, height: 118 },
    { img: "res/sozai/Eyes/SmileEyes2.png", name: "笑眼2", id: "SmileEyes2", x: 1255, y: 1312, width: 790, height: 141 },
    { img: "res/sozai/Eyes/SmileEyes1.png", name: "笑眼1", id: "SmileEyes1", x: 1233, y: 1332, width: 826, height: 136 },
    { img: "res/sozai/Eyes/OutletEyes.png", name: "插座眼", id: "OutletEyes", x: 1363, y: 1240, width: 573, height: 273 },
    { img: "res/sozai/Eyes/NarrowHeart.png", name: "细眼爱心", id: "NarrowHeart", x: 1204, y: 1213, width: 878, height: 289 },
    { img: "res/sozai/Eyes/NarrowEyes.png", name: "细眼", id: "NarrowEyes", x: 1204, y: 1236, width: 878, height: 266 },
    { img: "res/sozai/Eyes/LookUp2.png", name: "上看2", id: "LookUp2", x: 1224, y: 1167, width: 859, height: 352 },
    { img: "res/sozai/Eyes/LookUp1.png", name: "上看1", id: "LookUp1", x: 1224, y: 1167, width: 859, height: 352 }
]);
rowList_init("嘴巴", false, [
    { img: "res/sozai/Mouth/Ii.png", name: "咿——", id: "Ii", x: 1558, y: 1634, width: 209, height: 73 },
    { img: "res/sozai/Mouth/Uwaa.png", name: "呜哇——", id: "Uwaa", x: 1550, y: 1553, width: 223, height: 221 },
    { img: "res/sozai/Mouth/Eaa.png", name: "诶啊——", id: "Eaa", x: 1534, y: 1600, width: 251, height: 140 },
    { img: "res/sozai/Mouth/Ee.png", name: "诶——", id: "Ee", x: 1551, y: 1628, width: 221, height: 78 },
    { img: "res/sozai/Mouth/Nn.png", name: "嗯——", id: "Nn", x: 1553, y: 1654, width: 209, height: 33 },
    { img: "res/sozai/Mouth/Mu.png", name: "呣", id: "Mu", x: 1599, y: 1647, width: 138, height: 64 },
    { img: "res/sozai/Mouth/Triangle.png", name: "三角嘴", id: "Triangle", x: 1583, y: 1598, width: 135, height: 120 },
    { img: "res/sozai/Mouth/Oo.png", name: "哦哦——", id: "Oo", x: 1553, y: 1548, width: 205, height: 212 },
    { img: "res/sozai/Mouth/Oh.png", name: "哦——", id: "Oh", x: 1583, y: 1591, width: 141, height: 145 },
    { img: "res/sozai/Mouth/E.png", name: "诶", id: "E", x: 1585, y: 1633, width: 138, height: 85 },
    { img: "res/sozai/Mouth/O.png", name: "哦", id: "O", x: 1608, y: 1636, width: 76, height: 71 },
    { img: "res/sozai/Mouth/N.png", name: "嗯", id: "N", x: 1603, y: 1665, width: 89, height: 24 },
    { img: "res/sozai/Mouth/Yu.png", name: "呦", id: "Yu", x: 1620, y: 1647, width: 48, height: 46 },
    { img: "res/sozai/Mouth/Hooa.png", name: "呼啊——", id: "Hooa", x: 1544, y: 1563, width: 214, height: 182 },
    { img: "res/sozai/Mouth/Howa.png", name: "呼哇", id: "Howa", x: 1572, y: 1593, width: 171, height: 120 },
    { img: "res/sozai/Mouth/Mufu.png", name: "呣呼", id: "Mufu", x: 1569, y: 1636, width: 177, height: 46 },
    { img: "res/sozai/Mouth/Nishi.png", name: "嘻笑", id: "Nishi", x: 1558, y: 1624, width: 209, height: 84 },
    { img: "res/sozai/Mouth/Ahaa.png", name: "啊哈——", id: "Ahaa", x: 1528, y: 1539, width: 256, height: 232 },
    { img: "res/sozai/Mouth/Aha.png", name: "啊哈", id: "Aha", x: 1566, y: 1584, width: 175, height: 151 },
    { img: "res/sozai/Mouth/A.png", name: "啊", id: "A", x: 1571, y: 1625, width: 165, height: 91 },
    { img: "res/sozai/Mouth/Ehe.png", name: "诶嘿", id: "Ehe", x: 1558, y: 1636, width: 187, height: 64 },
    { img: "res/sozai/Mouth/GentleSmile.png", name: "浅笑", id: "GentleSmile", x: 1580, y: 1652, width: 142, height: 53 }
]);
rowList_init("脸颊与脸色", true, [
    { img: "res/sozai/CheeksColor/Shadow.png", name: "阴影", id: "Shadow", x: 1196, y: 965, width: 917, height: 424 },
    { img: "res/sozai/CheeksColor/Pale2.png", name: "苍白2", id: "Pale2", x: 1215, y: 1273, width: 848, height: 371 },
    { img: "res/sozai/CheeksColor/Pale1.png", name: "苍白1", id: "Pale1", x: 1246, y: 1352, width: 804, height: 199 },
    { img: "res/sozai/CheeksColor/Blush2.png", name: "脸红2", id: "Blush2", x: 1197, y: 1190, width: 915, height: 565 },
    { img: "res/sozai/CheeksColor/Blush1.png", name: "脸红1", id: "Blush1", x: 1214, y: 1434, width: 865, height: 192 },
    { img: "res/sozai/CheeksColor/Cheeks2.png", name: "脸颊2", id: "Cheeks2", x: 1145, y: 1406, width: 968, height: 271 },
    { img: "res/sozai/CheeksColor/Cheeks1.png", name: "脸颊1", id: "Cheeks1", x: 1221, y: 1472, width: 840, height: 147 }
]);
rowList_init("前臂", false, [
    { img: "res/sozai/FrontArm/ArmsCrossed.png", name: "抱臂（藏起后臂）", id: "ArmsCrossed", x: 1207, y: 1895, width: 957, height: 667 },
    { img: "res/sozai/FrontArm/HandsUp.png", name: "万岁", id: "HandsUp", x: 1893, y: 948, width: 903, height: 1249 },
    { img: "res/sozai/FrontArm/Beckoning.png", name: "招呼", id: "Beckoning", x: 1756, y: 1646, width: 515, height: 991 },
    { img: "res/sozai/FrontArm/Fist.png", name: "握拳", id: "Fist", x: 1688, y: 1703, width: 475, height: 863 },
    { img: "res/sozai/FrontArm/HandAtMouth.png", name: "手放嘴边", id: "HandAtMouth", x: 1676, y: 1690, width: 487, height: 876 },
    { img: "res/sozai/FrontArm/Thinking.png", name: "思考", id: "Thinking", x: 1518, y: 1751, width: 626, height: 846 },
    { img: "res/sozai/FrontArm/PointFront.png", name: "指向前方", id: "PointFront", x: 1868, y: 1900, width: 441, height: 523 },
    { img: "res/sozai/FrontArm/PalmUp.png", name: "手掌向上", id: "PalmUp", x: 2009, y: 1922, width: 462, height: 831 },
    { img: "res/sozai/FrontArm/HandsOnHips.png", name: "叉腰", id: "HandsOnHips", x: 1961, y: 1866, width: 509, height: 1037 },
    { img: "res/sozai/FrontArm/Basic.png", name: "基本", id: "Basic", x: 2015, y: 1915, width: 532, height: 1342 }
]);
rowList_init("后臂", false, [
    { img: "res/sozai/BackArm/Umbrella.png", name: "撑伞", id: "Umbrella", x: 743, y: 74, width: 2163, height: 2587 },
    { img: "res/sozai/BackArm/HandsUp.png", name: "万岁", id: "HandsUpBackArm", x: 565, y: 934, width: 1025, height: 1365 },
    { img: "res/sozai/BackArm/Beckoning.png", name: "招呼", id: "BeckoningBackArm", x: 1028, y: 1654, width: 488, height: 987 },
    { img: "res/sozai/BackArm/Fist.png", name: "握拳", id: "FistBackArm", x: 1162, y: 1709, width: 375, height: 850 },
    { img: "res/sozai/BackArm/HandAtMouth.png", name: "手放嘴边", id: "HandAtMouthBackArm", x: 1162, y: 1688, width: 375, height: 871 },
    { img: "res/sozai/BackArm/Microphone.png", name: "麦克风", id: "Microphone", x: 1022, y: 1683, width: 485, height: 831 },
    { img: "res/sozai/BackArm/PointSide.png", name: "侧指", id: "PointSide", x: 642, y: 1779, width: 929, height: 727 },
    { img: "res/sozai/BackArm/PalmUp.png", name: "手掌向上", id: "PalmUpBackArm", x: 572, y: 1922, width: 869, height: 776 },
    { img: "res/sozai/BackArm/HandsOnHips.png", name: "叉腰", id: "HandsOnHipsBackArm", x: 997, y: 1871, width: 542, height: 1033 },
    { img: "res/sozai/BackArm/Basic.png", name: "基本", id: "BasicBackArm", x: 785, y: 1917, width: 664, height: 1342 }
]);
rowList_init("根图层", true, [
    { img: "res/sozai/Body.png", name: "身体", id: "Body", x: 882, y: 494, width: 1705, height: 4455 }
]);
selectItemByID("Normal", true);
selectItemByID("Front1", true);
selectItemByID("BasicWhite", true);
selectItemByID("N", true);
selectItemByID("Cheeks1", true);
selectItemByID("Basic", true);
selectItemByID("BasicBackArm", true);
selectItemByID("Body", true);
