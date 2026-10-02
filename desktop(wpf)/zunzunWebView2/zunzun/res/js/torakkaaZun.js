canvasSizeX = 2584;
canvasSizeY = 4112;
nowActor = "とらっかぁ俊达萌";
document.body.dataset.actor = nowActor;
readMe = `とらっかぁ的俊达萌立绘素材！niconico【im10805015】
·该立绘素材分辨率较高，所以切换图层可能有点慢，请见谅。
我不太清楚这种方式是否属于二次配布，如果侵犯到您的利益的话请立刻联系我 我会第一时间删除的！
邮箱:ywang155@outlook.com；非常抱歉！`
showDialog("提示",readMe);
rowList_init("特效", true, [
        {
        img: "res/torakkaaZun/Effects/Sweat2.png",
        name: "汗2",
        id: "Sweat2",
        x: 858,
        y: 706,
        width: 389,
        height: 555
    },
        {
        img: "res/torakkaaZun/Effects/Sweat.png",
        name: "汗",
        id: "Sweat",
        x: 1403,
        y: 688,
        width: 51,
        height: 140
    },
        {
        img: "res/torakkaaZun/Effects/Sparkle.png",
        name: "闪光",
        id: "Sparkle",
        x: 837,
        y: 807,
        width: 437,
        height: 231
    },
        {
        img: "res/torakkaaZun/Effects/Heart.png",
        name: "爱心",
        id: "Heart",
        x: 395,
        y: 627,
        width: 1341,
        height: 373
    },
        {
        img: "res/torakkaaZun/Effects/Pale.png",
        name: "苍白",
        id: "Pale",
        x: 780,
        y: 630,
        width: 577,
        height: 532
    },
        {
        img: "res/torakkaaZun/Effects/Blush.png",
        name: "害羞",
        id: "Blush",
        x: 780,
        y: 630,
        width: 621,
        height: 657
    },
        {
        img: "res/torakkaaZun/Effects/Crying2Closed.png",
        name: "哭泣2（闭眼）",
        id: "Crying2Closed",
        x: 841,
        y: 922,
        width: 435,
        height: 414
    },
        {
        img: "res/torakkaaZun/Effects/Crying2.png",
        name: "哭泣2",
        id: "Crying2",
        x: 846,
        y: 961,
        width: 432,
        height: 375
    },
        {
        img: "res/torakkaaZun/Effects/CryingClosed.png",
        name: "哭泣（闭眼）",
        id: "CryingClosed",
        x: 839,
        y: 920,
        width: 443,
        height: 116
    },
        {
        img: "res/torakkaaZun/Effects/Crying.png",
        name: "哭泣",
        id: "Crying",
        x: 847,
        y: 960,
        width: 434,
        height: 103
    },
        {
        img: "res/torakkaaZun/Effects/Shock.png",
        name: "震惊",
        id: "Shock",
        x: 448,
        y: 599,
        width: 151,
        height: 230
    },
        {
        img: "res/torakkaaZun/Effects/QuestionMark.png",
        name: "问号",
        id: "QuestionMark",
        x: 371,
        y: 497,
        width: 166,
        height: 230
    },
        {
        img: "res/torakkaaZun/Effects/ExclamationMark.png",
        name: "感叹号",
        id: "ExclamationMark",
        x: 412,
        y: 499,
        width: 117,
        height: 225
    }
]);
rowList_init("眉毛", false, [
        {
        img: "res/torakkaaZun/Eyebrows/NormalBrows.png",
        name: "通常",
        id: "NormalBrows",
        x: 819,
        y: 641,
        width: 428,
        height: 130
    },
        {
        img: "res/torakkaaZun/Eyebrows/AngryBrows.png",
        name: "怒",
        id: "AngryBrows",
        x: 794,
        y: 655,
        width: 428,
        height: 112
    },
        {
        img: "res/torakkaaZun/Eyebrows/Sad.png",
        name: "悲伤",
        id: "Sad",
        x: 785,
        y: 657,
        width: 449,
        height: 141
    },
        {
        img: "res/torakkaaZun/Eyebrows/Huh.png",
        name: "疑惑",
        id: "Huh",
        x: 797,
        y: 670,
        width: 444,
        height: 139
    },
        {
        img: "res/torakkaaZun/Eyebrows/Serious.png",
        name: "认真",
        id: "Serious",
        x: 798,
        y: 730,
        width: 437,
        height: 119
    }
]);
rowList_init("眼睛", false, [
        {
        img: "res/torakkaaZun/Eyes/Cross.png",
        name: "＞＜",
        id: "Cross",
        x: 800,
        y: 854,
        width: 506,
        height: 208
    },
        {
        img: "res/torakkaaZun/Eyes/AngryEyes.png",
        name: "怒",
        id: "AngryEyes",
        x: 775,
        y: 799,
        width: 533,
        height: 261
    },
        {
        img: "res/torakkaaZun/Eyes/Round.png",
        name: "○○",
        id: "Round",
        x: 814,
        y: 816,
        width: 465,
        height: 204
    },
        {
        img: "res/torakkaaZun/Eyes/Blank.png",
        name: "白眼",
        id: "Blank",
        x: 770,
        y: 769,
        width: 611,
        height: 273
    },
        {
        img: "res/torakkaaZun/Eyes/Surprised.png",
        name: "吃惊",
        id: "Surprised",
        x: 766,
        y: 754,
        width: 615,
        height: 288
    },
        {
        img: "res/torakkaaZun/Eyes/NoHighlight.png",
        name: "无高光",
        id: "NoHighlight",
        x: 766,
        y: 754,
        width: 615,
        height: 298
    },
        {
        img: "res/torakkaaZun/Eyes/TroubledAway.png",
        name: "为难（侧视）",
        id: "TroubledAway",
        x: 770,
        y: 769,
        width: 611,
        height: 273
    },
        {
        img: "res/torakkaaZun/Eyes/Troubled.png",
        name: "为难",
        id: "Troubled",
        x: 770,
        y: 769,
        width: 611,
        height: 283
    },
        {
        img: "res/torakkaaZun/Eyes/JitomeAway.png",
        name: "死鱼眼（侧视）",
        id: "JitomeAway",
        x: 771,
        y: 780,
        width: 610,
        height: 262
    },
        {
        img: "res/torakkaaZun/Eyes/Jitome.png",
        name: "死鱼眼",
        id: "Jitome",
        x: 771,
        y: 782,
        width: 610,
        height: 270
    },
        {
        img: "res/torakkaaZun/Eyes/NormalAway.png",
        name: "通常（侧视）",
        id: "NormalAway",
        x: 766,
        y: 754,
        width: 615,
        height: 288
    },
        {
        img: "res/torakkaaZun/Eyes/NormalEyes.png",
        name: "通常",
        id: "NormalEyes",
        x: 766,
        y: 754,
        width: 615,
        height: 298
    },
        {
        img: "res/torakkaaZun/Eyes/SmileEyes.png",
        name: "笑眼",
        id: "SmileEyes",
        x: 798,
        y: 775,
        width: 559,
        height: 288
    },
        {
        img: "res/torakkaaZun/Eyes/Blink.png",
        name: "眨眼",
        id: "Blink",
        x: 796,
        y: 775,
        width: 568,
        height: 264
    }
]);
rowList_init("嘴巴", false, [
        {
        img: "res/torakkaaZun/Mouth/Awawa.png",
        name: "啊哇哇",
        id: "Awawa",
        x: 981,
        y: 1100,
        width: 166,
        height: 131
    },
        {
        img: "res/torakkaaZun/Mouth/O.png",
        name: "哦",
        id: "O",
        x: 987,
        y: 1104,
        width: 141,
        height: 148
    },
        {
        img: "res/torakkaaZun/Mouth/E.png",
        name: "诶",
        id: "E",
        x: 983,
        y: 1104,
        width: 164,
        height: 94
    },
        {
        img: "res/torakkaaZun/Mouth/U.png",
        name: "呜",
        id: "U",
        x: 1015,
        y: 1151,
        width: 44,
        height: 68
    },
        {
        img: "res/torakkaaZun/Mouth/Ii.png",
        name: "咿——",
        id: "Ii",
        x: 995,
        y: 1111,
        width: 178,
        height: 96
    },
        {
        img: "res/torakkaaZun/Mouth/I.png",
        name: "依",
        id: "I",
        x: 975,
        y: 1091,
        width: 201,
        height: 113
    },
        {
        img: "res/torakkaaZun/Mouth/A.png",
        name: "啊",
        id: "A",
        x: 979,
        y: 1068,
        width: 198,
        height: 188
    },
        {
        img: "res/torakkaaZun/Mouth/Sniff.png",
        name: "抽鼻子",
        id: "Sniff",
        x: 1033,
        y: 1142,
        width: 29,
        height: 14
    },
        {
        img: "res/torakkaaZun/Mouth/Pout.png",
        name: "气鼓鼓",
        id: "Pout",
        x: 1014,
        y: 1124,
        width: 65,
        height: 43
    },
        {
        img: "res/torakkaaZun/Mouth/Mu.png",
        name: "呣",
        id: "Mu",
        x: 999,
        y: 1114,
        width: 144,
        height: 47
    },
        {
        img: "res/torakkaaZun/Mouth/SmileMouth.png",
        name: "微笑",
        id: "SmileMouth",
        x: 1003,
        y: 1097,
        width: 135,
        height: 69
    },
        {
        img: "res/torakkaaZun/Mouth/Omega.png",
        name: "ω",
        id: "Omega",
        x: 997,
        y: 1124,
        width: 106,
        height: 40
    }
]);
rowList_init("身体", false, [
        {
        img: "res/torakkaaZun/Body.png",
        name: "身体",
        id: "Body",
        x: 175,
        y: 111,
        width: 2320,
        height: 3940
    }
]);
selectItemByID("ExclamationMark", true);
selectItemByID("NormalBrows", true);
selectItemByID("NormalEyes", true);
selectItemByID("Omega", true);
selectItemByID("Body", true);
