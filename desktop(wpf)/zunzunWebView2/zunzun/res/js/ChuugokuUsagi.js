canvasSizeX = 1082;
canvasSizeY = 1951;

nowActor = "中国兔子";
document.body.dataset.actor = nowActor;
var readMe = `中国うさぎ立ち絵素材
========================================

中国うさぎの非公式フリー立ち絵素材です。

良識の範囲内で、動画やアイコン等、自由にご利用ください。
公式の規約に準じての商用利用や、改変・加工しての利用も可能です。
クレジット表記や、ニコニコでのコンテンツツリー登録は任意です。

↓公式ガイドラインも読んでね。（ず・ω・きょ）
https://zunko.jp/guideline.html

PSDToolに対応しています。
ブラウザ上で使えるツールでレイヤー切り替えなどが簡単にできるのでおすすめです。
https://oov.github.io/psdtool

2023/07/23 2.0
・「うさみみ」を追加
・「基本目セット」の黒目のパターンを追加
・口「うおあー」「むにゅ」「よだれ」を追加
・腕「胸元」「上」を追加
・衣装差分「袴」「バニー」「スク水」「ビキニ」「紐」「下着」「御札」「素体」を追加
・一部パーツを微調整

2023/07/16
公開

========================================
製作：坂本アヒル
https://twitter.com/sakamoto_ahr`;
showDialog("提示", readMe);

//中国兔子的选中判断逻辑
actorHooks[nowActor] = function(clickItem){
    if(getListSelectStateByID("眼睛")!=null && clickItem.addTarget.theTitle.innerText == "眼睛"){
        clearTheRowListState("眼珠");
        clearTheRowListState("眼白");
        changeTheRowListState("眼珠","",false);
    }
    if(getListSelectStateByID("眼白")!=null && clickItem.addTarget.theTitle.innerText == "眼白"){
        clearTheRowListState("眼睛");
        changeTheRowListState("眼珠","",true);
    }
    if(getListSelectStateByID("服装差分")!=null && clickItem.addTarget.theTitle.innerText == "服装差分"){
        clearTheRowListState("巫女服");
        changeTheRowListState("服装左臂","",true);
        changeTheRowListState("服装右臂","",true);
        changeTheRowListState("巫女服左臂","",false);
        changeTheRowListState("巫女服右臂","",false);
    }
    if(getListSelectStateByID("巫女服")!=null && clickItem.addTarget.theTitle.innerText == "巫女服"){
        clearTheRowListState("服装差分");
        changeTheRowListState("巫女服左臂","",true);
        changeTheRowListState("巫女服右臂","",true);
        changeTheRowListState("服装左臂","",false);
        changeTheRowListState("服装右臂","",false);
    }
};

rowList_init("记号等", true, [
    {
        img: "res/ChuugokuUsagi/Symbols/RabbitEars.png",
        name: "兔耳",
        id: "SymRabbitEars",
        x: 323,
        y: 53,
        width: 370,
        height: 308,
    },
    {
        img: "res/ChuugokuUsagi/Symbols/Inaba.png",
        name: "因幡兔",
        id: "SymInaba",
        x: 296,
        y: 51,
        width: 402,
        height: 269,
    },
    {
        img: "res/ChuugokuUsagi/Symbols/SweatHeavy.png",
        name: "多汗",
        id: "SymSweatHeavy",
        x: 352,
        y: 271,
        width: 351,
        height: 280,
    },
    {
        img: "res/ChuugokuUsagi/Symbols/Sweat.png",
        name: "汗",
        id: "SymSweat",
        x: 422,
        y: 528,
        width: 19,
        height: 23,
    },
    {
        img: "res/ChuugokuUsagi/Symbols/Tears.png",
        name: "泪",
        id: "SymTears",
        x: 370,
        y: 462,
        width: 295,
        height: 40,
    },
]);

rowList_init("眉毛", false, [
    {
        img: "res/ChuugokuUsagi/Brow/Normal.png",
        name: "普通眉",
        id: "BrowNormal",
        x: 405,
        y: 337,
        width: 162,
        height: 26,
    },
    {
        img: "res/ChuugokuUsagi/Brow/Angry.png",
        name: "怒眉",
        id: "BrowAngry",
        x: 410,
        y: 328,
        width: 155,
        height: 40,
    },
    {
        img: "res/ChuugokuUsagi/Brow/Raised.png",
        name: "上扬眉",
        id: "BrowRaised",
        x: 404,
        y: 298,
        width: 153,
        height: 36,
    },
    {
        img: "res/ChuugokuUsagi/Brow/Troubled.png",
        name: "困扰眉",
        id: "BrowTroubled",
        x: 403,
        y: 329,
        width: 171,
        height: 27,
    },
]);
rowList_init("刘海",false,[
    {
        img: "res/ChuugokuUsagi/Eye/WithBangs.png",
        name: "刘海遮眼",
        id: "EyeWithBangs",
        x: 338,
        y: 347,
        width: 321,
        height: 155,
    },
])
rowList_init("眼睛", false, [
    
    {
        img: "res/ChuugokuUsagi/Eye/Annoyed.png",
        name: "嫌弃眼",
        id: "EyeAnnoyed",
        x: 337,
        y: 375,
        width: 329,
        height: 111,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Enraptured.png",
        name: "陶醉眼",
        id: "EyeEnraptured",
        x: 337,
        y: 375,
        width: 329,
        height: 111,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Smile.png",
        name: "微笑眼",
        id: "EyeSmile",
        x: 350,
        y: 423,
        width: 307,
        height: 58,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Closed.png",
        name: "闭眼",
        id: "EyeClosed",
        x: 345,
        y: 421,
        width: 311,
        height: 61,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Strain.png",
        name: "紧闭眼",
        id: "EyeStrain",
        x: 361,
        y: 394,
        width: 289,
        height: 94,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Peaceful.png",
        name: "平和眼",
        id: "EyePeaceful",
        x: 367,
        y: 416,
        width: 295,
        height: 52,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Dizzy.png",
        name: "晕眩眼",
        id: "EyeDizzy",
        x: 376,
        y: 395,
        width: 269,
        height: 91,
    },
]);

rowList_init("眼珠", false, [
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Iris/Basic.png",
        name: "基本",
        id: "IrisBasic",
        x: 398,
        y: 384,
        width: 229,
        height: 95,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Iris/Basic2.png",
        name: "基本2",
        id: "IrisBasic2",
        x: 398,
        y: 384,
        width: 229,
        height: 95,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Iris/Camera.png",
        name: "看镜头",
        id: "IrisCamera",
        x: 400,
        y: 384,
        width: 238,
        height: 95,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Iris/Camera2.png",
        name: "看镜头2",
        id: "IrisCamera2",
        x: 400,
        y: 384,
        width: 238,
        height: 95,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Iris/LookAway.png",
        name: "移开视线",
        id: "IrisLookAway",
        x: 380,
        y: 384,
        width: 242,
        height: 95,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Iris/LookAway2.png",
        name: "移开视线2",
        id: "IrisLookAway2",
        x: 380,
        y: 384,
        width: 242,
        height: 95,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Iris/LookUp.png",
        name: "向上看",
        id: "IrisLookUp",
        x: 398,
        y: 379,
        width: 229,
        height: 90,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Iris/LookUp2.png",
        name: "向上看2",
        id: "IrisLookUp2",
        x: 398,
        y: 376,
        width: 229,
        height: 93,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Iris/Spiral.png",
        name: "圈圈眼",
        id: "IrisSpiral",
        x: 398,
        y: 384,
        width: 229,
        height: 95,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Iris/Melting.png",
        name: "迷离眼",
        id: "IrisMelting",
        x: 398,
        y: 384,
        width: 229,
        height: 95,
    },
]);

rowList_init("眼白", false, [
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Sclera/Basic.png",
        name: "眼白基本",
        id: "ScleraBasic",
        x: 352,
        y: 374,
        width: 314,
        height: 112,
    },
    {
        img: "res/ChuugokuUsagi/Eye/Basic Eye Set/Sclera/Wide.png",
        name: "眼白睁大",
        id: "ScleraWide",
        x: 343,
        y: 365,
        width: 323,
        height: 128,
    },
]);

rowList_init("嘴", false, [
    {
        img: "res/ChuugokuUsagi/Mouth/N.png",
        name: "唔",
        id: "MouthN",
        x: 502,
        y: 549,
        width: 28,
        height: 7,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/O.png",
        name: "哦",
        id: "MouthO",
        x: 502,
        y: 536,
        width: 33,
        height: 25,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Oah.png",
        name: "哦啊",
        id: "MouthOah",
        x: 495,
        y: 517,
        width: 49,
        height: 51,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Nyu.png",
        name: "唔啾",
        id: "MouthNyu",
        x: 498,
        y: 533,
        width: 23,
        height: 15,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Smile.png",
        name: "微笑",
        id: "MouthSmile",
        x: 499,
        y: 530,
        width: 39,
        height: 20,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Aha.png",
        name: "啊哈",
        id: "MouthAha",
        x: 496,
        y: 521,
        width: 42,
        height: 32,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Hehihi.png",
        name: "嘿嘿",
        id: "MouthHehihi",
        x: 495,
        y: 531,
        width: 48,
        height: 23,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Smirk.png",
        name: "坏笑",
        id: "MouthSmirk",
        x: 492,
        y: 530,
        width: 60,
        height: 23,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Waa.png",
        name: "哇啊",
        id: "MouthWaa",
        x: 493,
        y: 515,
        width: 43,
        height: 46,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Nihe.png",
        name: "嘻笑",
        id: "MouthNihe",
        x: 485,
        y: 525,
        width: 71,
        height: 42,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Slurp.png",
        name: "舔唇",
        id: "MouthSlurp",
        x: 485,
        y: 516,
        width: 74,
        height: 56,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Nnn.png",
        name: "唔嗯",
        id: "MouthNnn",
        x: 492,
        y: 541,
        width: 67,
        height: 18,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Eah.png",
        name: "诶啊",
        id: "MouthEah",
        x: 489,
        y: 523,
        width: 73,
        height: 43,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Uoah.png",
        name: "呜啊",
        id: "MouthUoah",
        x: 486,
        y: 490,
        width: 73,
        height: 79,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Pucker.png",
        name: "嘟嘴",
        id: "MouthPucker",
        x: 500,
        y: 535,
        width: 44,
        height: 20,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Tongue.png",
        name: "吐舌",
        id: "MouthTongue",
        x: 500,
        y: 536,
        width: 56,
        height: 21,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Uhe.png",
        name: "呜嘿",
        id: "MouthUhe",
        x: 488,
        y: 539,
        width: 75,
        height: 24,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Munyu.png",
        name: "抿嘴",
        id: "MouthMunyu",
        x: 484,
        y: 529,
        width: 62,
        height: 25,
    },
    {
        img: "res/ChuugokuUsagi/Mouth/Drool.png",
        name: "口水",
        id: "MouthDrool",
        x: 496,
        y: 530,
        width: 64,
        height: 143,
    },
]);

rowList_init("脸色", true, [
    {
        img: "res/ChuugokuUsagi/Face Color/Cheek.png",
        name: "腮红",
        id: "FaceCheek",
        x: 370,
        y: 450,
        width: 299,
        height: 86,
    },
    {
        img: "res/ChuugokuUsagi/Face Color/Blush.png",
        name: "脸红",
        id: "FaceBlush",
        x: 373,
        y: 392,
        width: 297,
        height: 197,
    },
    {
        img: "res/ChuugokuUsagi/Face Color/Tired.png",
        name: "睡眠不足",
        id: "FaceTired",
        x: 369,
        y: 448,
        width: 300,
        height: 74,
    },
    {
        img: "res/ChuugokuUsagi/Face Color/HiddenMarker.png",
        name: "隐藏标记",
        id: "FaceHiddenMarker",
        x: 0,
        y: 0,
        width: 1,
        height: 1,
    },
    {
        img: "res/ChuugokuUsagi/Face Color/Shading.png",
        name: "阴影",
        id: "FaceShading",
        x: 372,
        y: 337,
        width: 245,
        height: 152,
    },
]);


rowList_init("巫女服左臂", false, [
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Left Arm/Basic.png",
        name: "基本",
        id: "MikoLArmBasic",
        x: 640,
        y: 661,
        width: 184,
        height: 691,
    },
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Left Arm/FingerToMouth.png",
        name: "手指抵唇",
        id: "MikoLArmFingerToMouth",
        x: 474,
        y: 564,
        width: 347,
        height: 663,
    },
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Left Arm/Chest.png",
        name: "胸前",
        id: "MikoLArmChest",
        x: 485,
        y: 655,
        width: 278,
        height: 658,
    },
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Left Arm/HoldInaba.png",
        name: "抱因幡兔",
        id: "MikoLArmHoldInaba",
        x: 338,
        y: 658,
        width: 440,
        height: 695,
    },
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Left Arm/Up.png",
        name: "举手",
        id: "MikoLArmUp",
        x: 602,
        y: 303,
        width: 368,
        height: 726,
    },
]);

rowList_init("巫女服右臂", false, [
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Right Arm/Basic.png",
        name: "基本",
        id: "MikoRArmBasic",
        x: 231,
        y: 634,
        width: 236,
        height: 694,
    },
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Right Arm/HandToCheek.png",
        name: "手贴脸颊",
        id: "MikoRArmHandToCheek",
        x: 144,
        y: 495,
        width: 354,
        height: 728,
    },
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Right Arm/Chest.png",
        name: "胸前",
        id: "MikoRArmChest",
        x: 270,
        y: 628,
        width: 248,
        height: 688,
    },
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Right Arm/Side.png",
        name: "平举",
        id: "MikoRArmSide",
        x: 175,
        y: 628,
        width: 304,
        height: 635,
    },
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Right Arm/Up.png",
        name: "举手",
        id: "MikoRArmUp",
        x: 80,
        y: 308,
        width: 405,
        height: 695,
    },
]);
rowList_init("巫女服", false, [
    {
        img: "res/ChuugokuUsagi/Miko Outfit/Body.png",
        name: "身体",
        id: "MikoBody",
        x: 255,
        y: 185,
        width: 680,
        height: 1678,
    },
    {
        img: "res/ChuugokuUsagi/Miko Outfit/BodyFlipX.png",
        name: "身体镜像",
        id: "MikoBodyFlipX",
        x: 255,
        y: 185,
        width: 680,
        height: 1678,
    },
]);


rowList_init("服装左臂", false, [
    {
        img: "res/ChuugokuUsagi/Costume/Left Arm/Basic.png",
        name: "基本",
        id: "CostumeLArmBasic",
        x: 626,
        y: 788,
        width: 189,
        height: 391,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Left Arm/FingerToMouth.png",
        name: "手指抵唇",
        id: "CostumeLArmFingerToMouth",
        x: 489,
        y: 564,
        width: 203,
        height: 314,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Left Arm/Chest.png",
        name: "胸前",
        id: "CostumeLArmChest",
        x: 485,
        y: 655,
        width: 192,
        height: 265,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Left Arm/HoldInaba.png",
        name: "抱因幡兔",
        id: "CostumeLArmHoldInaba",
        x: 338,
        y: 725,
        width: 354,
        height: 436,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Left Arm/Up.png",
        name: "举手",
        id: "CostumeLArmUp",
        x: 598,
        y: 303,
        width: 372,
        height: 396,
    },
]);

rowList_init("服装右臂", false, [
    {
        img: "res/ChuugokuUsagi/Costume/Right Arm/Basic.png",
        name: "基本",
        id: "CostumeRArmBasic",
        x: 197,
        y: 630,
        width: 280,
        height: 568,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Right Arm/HandToCheek.png",
        name: "手贴脸颊",
        id: "CostumeRArmHandToCheek",
        x: 334,
        y: 495,
        width: 164,
        height: 362,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Right Arm/Chest.png",
        name: "胸前",
        id: "CostumeRArmChest",
        x: 325,
        y: 630,
        width: 193,
        height: 273,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Right Arm/Side.png",
        name: "平举",
        id: "CostumeRArmSide",
        x: 175,
        y: 630,
        width: 302,
        height: 272,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Right Arm/Up.png",
        name: "举手",
        id: "CostumeRArmUp",
        x: 80,
        y: 308,
        width: 405,
        height: 414,
    },
]);
rowList_init("服装差分", true, [
    {
        img: "res/ChuugokuUsagi/Costume/BaseBody.png",
        name: "素体",
        id: "CostumeBaseBody",
        x: 255,
        y: 185,
        width: 680,
        height: 1665,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Talisman.png",
        name: "符咒",
        id: "CostumeTalisman",
        x: 403,
        y: 736,
        width: 222,
        height: 407,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Underwear.png",
        name: "内衣",
        id: "CostumeUnderwear",
        x: 358,
        y: 682,
        width: 291,
        height: 462,
    },
    {
        img: "res/ChuugokuUsagi/Costume/String.png",
        name: "系带",
        id: "CostumeString",
        x: 421,
        y: 617,
        width: 186,
        height: 527,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Bikini.png",
        name: "比基尼",
        id: "CostumeBikini",
        x: 354,
        y: 617,
        width: 302,
        height: 524,
    },
    {
        img: "res/ChuugokuUsagi/Costume/SchoolSwimsuit.png",
        name: "校园泳装",
        id: "CostumeSchoolSwimsuit",
        x: 368,
        y: 616,
        width: 263,
        height: 529,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Bunny.png",
        name: "兔女郎装",
        id: "CostumeBunny",
        x: 333,
        y: 594,
        width: 348,
        height: 1305,
    },
    {
        img: "res/ChuugokuUsagi/Costume/Hakama.png",
        name: "袴",
        id: "CostumeHakama",
        x: 263,
        y: 823,
        width: 522,
        height: 873,
    },
]);

rowList_init("铃铛", true, [
    {
        img: "res/ChuugokuUsagi/Bell/Bell.png",
        name: "铃铛",
        id: "Bell",
        x: 198,
        y: 445,
        width: 716,
        height: 373,
    },
]);

selectItemByID("BrowNormal");
selectItemByID("EyeWithBangs");
selectItemByID("IrisCamera");
selectItemByID("ScleraBasic");
selectItemByID("MouthN");
selectItemByID("FaceCheek");
document.getElementById("MikoBody").click();
selectItemByID("MikoLArmHoldInaba");
selectItemByID("MikoRArmBasic");
document.getElementById("Bell").click();
