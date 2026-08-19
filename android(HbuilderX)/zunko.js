// Auto-generated from zunko PSD
// Canvas: 1082 x 1873 px
canvas.width = 1082;
canvas.height = 1873;
nowActor = "东北俊子";
document.body.dataset.actor = nowActor;
var readMe = `東北ずん子立ち絵素材
========================================

東北ずん子の非公式フリー立ち絵素材です。

良識の範囲内で、動画やアイコン等、自由にご利用ください。
公式の規約に準じての商用利用や、改変・加工しての利用も可能です。
クレジット表記や、ニコニコでのコンテンツツリー登録は任意です。

↓公式ガイドラインも読んでね。（ず・ω・きょ）
https://zunko.jp/guideline.html

PSDToolに対応しています。
ブラウザ上で使えるツールでレイヤー切り替えなどが簡単にできるのでおすすめです。
https://oov.github.io/psdtool

2023/03/04 2.0
・目のスタイルを変更し、表情パーツなど多くのパーツを調整

2023/02/25 1.1
・目「基本」「基本2」「カメラ目線」「目そらし」、左腕「弓」を微調整
・眉「上がり眉」、目「・・」を追加

2023/02/20 1.0公開

========================================
製作：坂本アヒル
https://twitter.com/sakamoto_ahr`;
showDialog("提示", readMe);

rowList_init("眉毛", false, [
    {
        img: "res/zunko/Eyebrows/Normal brows.png",
        name: "普通眉",
        id: "Normal brows",
        x: 405,
        y: 303,
        width: 203,
        height: 20
    },
    {
        img: "res/zunko/Eyebrows/Raised brows.png",
        name: "上扬眉",
        id: "Raised brows",
        x: 407,
        y: 279,
        width: 198,
        height: 26
    },
    {
        img: "res/zunko/Eyebrows/Angry brows.png",
        name: "怒眉",
        id: "Angry brows",
        x: 408,
        y: 296,
        width: 195,
        height: 24
    },
    {
        img: "res/zunko/Eyebrows/Troubled brows.png",
        name: "为难眉",
        id: "Troubled brows",
        x: 403,
        y: 304,
        width: 203,
        height: 21
    }
]);
rowList_init("脸色",false,[
    {
        img: "res/zunko/Tears.png",
        name: "眼泪",
        id: "Tears",
        x: 388,
        y: 436,
        width: 251,
        height: 30
    },
    {
        img: "res/zunko/Sweat.png",
        name: "汗",
        id: "Sweat",
        x: 425,
        y: 487,
        width: 21,
        height: 23
    },
]);
rowList_init("眼睛", false, [
    {
        img: "res/zunko/Eyes/Basic.png",
        name: "基本",
        id: "Basic",
        x: 356,
        y: 342,
        width: 315,
        height: 110
    },
    {
        img: "res/zunko/Eyes/Basic 2.png",
        name: "基本2",
        id: "Basic 2",
        x: 356,
        y: 342,
        width: 315,
        height: 110
    },
    {
        img: "res/zunko/Eyes/Camera gaze.png",
        name: "看镜头",
        id: "Camera gaze",
        x: 356,
        y: 342,
        width: 315,
        height: 110
    },
    {
        img: "res/zunko/Eyes/Averting eyes.png",
        name: "移开视线",
        id: "Averting eyes",
        x: 356,
        y: 342,
        width: 315,
        height: 110
    },
    {
        img: "res/zunko/Eyes/Looking up.png",
        name: "向上看",
        id: "Looking up",
        x: 356,
        y: 342,
        width: 315,
        height: 110
    },
    {
        img: "res/zunko/Eyes/Jito eyes.png",
        name: "藐视眼",
        id: "Jito eyes",
        x: 356,
        y: 355,
        width: 315,
        height: 97
    },
    {
        img: "res/zunko/Eyes/Closed eyes.png",
        name: "闭眼",
        id: "Closed eyes",
        x: 380,
        y: 417,
        width: 274,
        height: 25
    },
    {
        img: "res/zunko/Eyes/Wink.png",
        name: "眨眼",
        id: "Wink",
        x: 380,
        y: 342,
        width: 291,
        height: 108
    },
    {
        img: "res/zunko/Eyes/Grin.png",
        name: "咧嘴笑",
        id: "Grin",
        x: 380,
        y: 390,
        width: 267,
        height: 52
    },
    {
        img: "res/zunko/Eyes/Round eyes.png",
        name: "〇〇",
        id: "Round eyes",
        x: 389,
        y: 369,
        width: 239,
        height: 80
    },
    {
        img: "res/zunko/Eyes/X-X.png",
        name: "><",
        id: "X-X",
        x: 387,
        y: 371,
        width: 248,
        height: 84
    },
    {
        img: "res/zunko/Eyes/Dot dot.png",
        name: "・・",
        id: "Dot dot",
        x: 426,
        y: 390,
        width: 172,
        height: 32
    },
    {
        img: "res/zunko/Eyes/(zu da).png",
        name: "(ず・　・だ)",
        id: "(zu da)",
        x: 385,
        y: 390,
        width: 260,
        height: 95
    },
    {
        img: "res/zunko/Eyes/(zu da) flipx.png",
        name: "(ず・　・だ)翻转",
        id: "(zu da) flipx",
        x: 387,
        y: 390,
        width: 259,
        height: 91
    }
]);

rowList_init("嘴巴", false, [
    {
        img: "res/zunko/Mouth/Smile.png",
        name: "微笑",
        id: "Smile",
        x: 491,
        y: 490,
        width: 52,
        height: 20
    },
    {
        img: "res/zunko/Mouth/Aha.png",
        name: "啊哈",
        id: "Aha",
        x: 488,
        y: 473,
        width: 60,
        height: 54
    },
    {
        img: "res/zunko/Mouth/Aha-.png",
        name: "啊哈—",
        id: "Aha-",
        x: 484,
        y: 466,
        width: 67,
        height: 61
    },
    {
        img: "res/zunko/Mouth/N.png",
        name: "嗯",
        id: "N",
        x: 508,
        y: 505,
        width: 18,
        height: 8
    },
    {
        img: "res/zunko/Mouth/O.png",
        name: "哦",
        id: "O",
        x: 501,
        y: 486,
        width: 33,
        height: 34
    },
    {
        img: "res/zunko/Mouth/Oo-.png",
        name: "哦哦—",
        id: "Oo-",
        x: 489,
        y: 468,
        width: 56,
        height: 58
    },
    {
        img: "res/zunko/Mouth/Nmu.png",
        name: "嗯唔",
        id: "Nmu",
        x: 494,
        y: 502,
        width: 53,
        height: 11
    },
    {
        img: "res/zunko/Mouth/Ae.png",
        name: "啊哎",
        id: "Ae",
        x: 485,
        y: 479,
        width: 70,
        height: 43
    },
    {
        img: "res/zunko/Mouth/Ea-.png",
        name: "哎啊—",
        id: "Ea-",
        x: 481,
        y: 462,
        width: 73,
        height: 71
    },
    {
        img: "res/zunko/Mouth/Jururi.png",
        name: "流口水",
        id: "Jururi",
        x: 485,
        y: 486,
        width: 68,
        height: 39
    },
    {
        img: "res/zunko/Mouth/Perori.png",
        name: "舔",
        id: "Perori",
        x: 494,
        y: 481,
        width: 66,
        height: 33
    },
    {
        img: "res/zunko/Mouth/omega.png",
        name: "ω",
        id: "omega",
        x: 492,
        y: 481,
        width: 57,
        height: 19
    }
]);

rowList_init("脸颊", false, [
    {
        img: "res/zunko/Cheeks/Cheeks basic.png",
        name: "脸颊基本",
        id: "Cheeks basic",
        x: 385,
        y: 435,
        width: 269,
        height: 40
    },
    {
        img: "res/zunko/Cheeks/Cheeks red.png",
        name: "脸颊泛红",
        id: "Cheeks red",
        x: 384,
        y: 425,
        width: 274,
        height: 58
    },
    {
        img: "res/zunko/Cheeks/Blush.png",
        name: "脸红",
        id: "Blush",
        x: 383,
        y: 407,
        width: 275,
        height: 86
    }
]);

rowList_init("左臂", false, [
    {
        img: "res/zunko/Left Arm/Basic.png",
        name: "基本",
        id: "LBasic",
        x: 592,
        y: 578,
        width: 343,
        height: 505
    },
    {
        img: "res/zunko/Left Arm/Hand raised.png",
        name: "举手",
        id: "LHand raised",
        x: 606,
        y: 243,
        width: 339,
        height: 523
    },
    {
        img: "res/zunko/Left Arm/Bow.png",
        name: "弓",
        id: "LBow",
        x: 515,
        y: 0,
        width: 409,
        height: 1803
    },
    {
        img: "res/zunko/Left Arm/Finger at mouth.png",
        name: "嘴边手指",
        id: "LFinger at mouth",
        x: 485,
        y: 523,
        width: 207,
        height: 341
    }
]);

rowList_init("右臂", false, [
    {
        img: "res/zunko/Right Arm/Basic.png",
        name: "基本",
        id: "RBasic",
        x: 129,
        y: 577,
        width: 341,
        height: 510
    },
    {
        img: "res/zunko/Right Arm/Hand raised.png",
        name: "举手",
        id: "RHand raised",
        x: 75,
        y: 243,
        width: 413,
        height: 484
    },
    {
        img: "res/zunko/Right Arm/Side.png",
        name: "侧",
        id: "RSide",
        x: 91,
        y: 554,
        width: 379,
        height: 286
    },
    {
        img: "res/zunko/Right Arm/Head bump.png",
        name: "头顶轻敲",
        id: "RHead bump",
        x: 245,
        y: 242,
        width: 243,
        height: 485
    }
]);

rowList_init("Root", true, [
    
    {
        img: "res/zunko/Body.png",
        name: "身体",
        id: "Body",
        x: 203,
        y: 173,
        width: 701,
        height: 1645
    },
    
    {
        img: "res/zunko/Side hair basic.png",
        name: "侧发基本",
        id: "Side hair basic",
        x: 203,
        y: 373,
        width: 577,
        height: 494
    },
    {
        img: "res/zunko/Side hair bounce.png",
        name: "侧发翘起",
        id: "Side hair bounce",
        x: 29,
        y: 387,
        width: 1042,
        height: 227
    },
    
]);
selectItemByID("Normal brows");
selectItemByID("Basic");
selectItemByID("Smile");
selectItemByID("Cheeks basic");
selectItemByID("LBasic");
selectItemByID("RBasic");
selectItemByID("Body");
