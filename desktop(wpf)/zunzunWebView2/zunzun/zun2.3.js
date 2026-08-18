canvas.width = 1082;
canvas.height = 1650;
nowActor = "俊达萌";
document.body.dataset.actor = nowActor;
rowList_init("装饰", true, [
    {
        img: "res/zun2.3/Symbols etc/Duckling.png",
        name: "小鸭子",
        id: "Duckling",
        x: 435,
        y: 87,
        width: 158,
        height: 116
    },
    {
        img: "res/zun2.3/Symbols etc/Tears.png",
        name: "泪",
        id: "Tears",
        x: 373,
        y: 439,
        width: 239,
        height: 29
    },
    {
        img: "res/zun2.3/Symbols etc/Sweat 1.png",
        name: "汗1",
        id: "Sweat 1",
        x: 625,
        y: 345,
        width: 23,
        height: 26
    },
    {
        img: "res/zun2.3/Symbols etc/Sweat 2.png",
        name: "汗2",
        id: "Sweat 2",
        x: 397,
        y: 487,
        width: 20,
        height: 24
    },
    {
        img: "res/zun2.3/Symbols etc/Sweat 3.png",
        name: "汗3",
        id: "Sweat 3",
        x: 542,
        y: 522,
        width: 26,
        height: 29
    }
]);

rowList_init("毛豆", false, [
    {
        img: "res/zun2.3/Edamame/Hoodie (use with lining).png",
        name: "连帽衫",
        id: "Hoodie (use with lining)",
        x: 249,
        y: 161,
        width: 538,
        height: 930
    },
    {
        img: "res/zun2.3/Edamame/Edamame normal.png",
        name: "毛豆正常",
        id: "Edamame normal",
        x: 258,
        y: 109,
        width: 549,
        height: 423
    },
    {
        img: "res/zun2.3/Edamame/Edamame wilted.png",
        name: "毛豆枯萎",
        id: "Edamame wilted",
        x: 235,
        y: 166,
        width: 580,
        height: 359
    }
]);

rowList_init("眉毛", false, [
    {
        img: "res/zun2.3/Eyebrows/Normal brows.png",
        name: "普通眉",
        id: "Normal brows",
        x: 383,
        y: 305,
        width: 216,
        height: 18
    },
    {
        img: "res/zun2.3/Eyebrows/Angry brows.png",
        name: "怒眉",
        id: "Angry brows",
        x: 386,
        y: 285,
        width: 209,
        height: 45
    },
    {
        img: "res/zun2.3/Eyebrows/Raised brows.png",
        name: "上扬眉",
        id: "Raised brows",
        x: 386,
        y: 293,
        width: 215,
        height: 40
    },
    {
        img: "res/zun2.3/Eyebrows/Troubled brows 1.png",
        name: "为难眉1",
        id: "Troubled brows 1",
        x: 364,
        y: 316,
        width: 245,
        height: 24
    },
    {
        img: "res/zun2.3/Eyebrows/Troubled brows 2.png",
        name: "为难眉2",
        id: "Troubled brows 2",
        x: 388,
        y: 281,
        width: 209,
        height: 48
    }
]);

rowList_init("眼睛", false, [
    {
        img: "res/zun2.3/Eyes/Looking up.png",
        name: "向上看",
        id: "Looking up",
        x: 367,
        y: 348,
        width: 249,
        height: 110
    },
    {
        img: "res/zun2.3/Eyes/Looking up 2.png",
        name: "向上看2",
        id: "Looking up 2",
        x: 367,
        y: 348,
        width: 249,
        height: 110
    },
    {
        img: "res/zun2.3/Eyes/Looking up 3.png",
        name: "向上看3",
        id: "Looking up 3",
        x: 367,
        y: 348,
        width: 249,
        height: 110
    },
    {
        img: "res/zun2.3/Eyes/Squinting heart eyes.png",
        name: "眯眼爱心",
        id: "Squinting heart eyes",
        x: 368,
        y: 372,
        width: 250,
        height: 72
    },
    {
        img: "res/zun2.3/Eyes/Squinting eyes.png",
        name: "眯眼",
        id: "Squinting eyes",
        x: 368,
        y: 372,
        width: 250,
        height: 72
    },
    {
        img: "res/zun2.3/Eyes/Half-closed eyes.png",
        name: "半闭眼",
        id: "Half-closed eyes",
        x: 364,
        y: 369,
        width: 247,
        height: 83
    },
    {
        img: "res/zun2.3/Eyes/Gentle eyes.png",
        name: "温和眼",
        id: "Gentle eyes",
        x: 378,
        y: 397,
        width: 227,
        height: 40
    },
    {
        img: "res/zun2.3/Eyes/Smile.png",
        name: "微笑",
        id: "Smile",
        x: 376,
        y: 406,
        width: 231,
        height: 33
    },
    {
        img: "res/zun2.3/Eyes/Smile 2.png",
        name: "微笑2",
        id: "Smile 2",
        x: 379,
        y: 396,
        width: 222,
        height: 48
    },
    {
        img: "res/zun2.3/Eyes/UU.png",
        name: "UU",
        id: "UU",
        x: 380,
        y: 408,
        width: 224,
        height: 44
    },
    {
        img: "res/zun2.3/Eyes/X-X.png",
        name: "><",
        id: "X-X",
        x: 373,
        y: 372,
        width: 234,
        height: 85
    },
    {
        img: "res/zun2.3/Eyes/OO.png",
        name: "〇〇",
        id: "OO",
        x: 382,
        y: 372,
        width: 218,
        height: 84
    },
    {
        img: "res/zun2.3/Eyes/Swirl eyes.png",
        name: "晕眩眼",
        id: "Swirl eyes",
        x: 380,
        y: 367,
        width: 216,
        height: 84
    }
]);
rowList_init("瞳孔", false, [
    {
        img: "res/zun2.3/Eyes/Eye set/Pupils/Normal eyes.png",
        name: "普通眼",
        id: "Normal eyes",
        x: 388,
        y: 372,
        width: 207,
        height: 83
    },
    {
        img: "res/zun2.3/Eyes/Eye set/Pupils/Normal eyes 2.png",
        name: "普通眼2",
        id: "Normal eyes 2",
        x: 388,
        y: 372,
        width: 207,
        height: 83
    },
    {
        img: "res/zun2.3/Eyes/Eye set/Pupils/Normal eyes 3.png",
        name: "普通眼3",
        id: "Normal eyes 3",
        x: 388,
        y: 372,
        width: 207,
        height: 83
    },
    {
        img: "res/zun2.3/Eyes/Eye set/Pupils/Camera gaze.png",
        name: "看镜头",
        id: "Camera gaze",
        x: 391,
        y: 372,
        width: 212,
        height: 83
    },
    {
        img: "res/zun2.3/Eyes/Eye set/Pupils/Camera gaze 2.png",
        name: "看镜头2",
        id: "Camera gaze 2",
        x: 391,
        y: 372,
        width: 212,
        height: 83
    },
    {
        img: "res/zun2.3/Eyes/Eye set/Pupils/Camera gaze 3.png",
        name: "看镜头3",
        id: "Camera gaze 3",
        x: 391,
        y: 372,
        width: 212,
        height: 83
    },
    {
        img: "res/zun2.3/Eyes/Eye set/Pupils/Averting eyes.png",
        name: "移开视线",
        id: "Averting eyes",
        x: 380,
        y: 372,
        width: 211,
        height: 83
    },
    {
        img: "res/zun2.3/Eyes/Eye set/Pupils/Averting eyes 2.png",
        name: "移开视线2",
        id: "Averting eyes 2",
        x: 380,
        y: 372,
        width: 211,
        height: 83
    },
    {
        img: "res/zun2.3/Eyes/Eye set/Pupils/Averting eyes 3.png",
        name: "移开视线3",
        id: "Averting eyes 3",
        x: 380,
        y: 372,
        width: 211,
        height: 83
    }
]);
rowList_init("眼眶", false, [
    {
        img: "res/zun2.3/Eyes/Eye set/Normal whites.png",
        name: "普通白眼",
        id: "Normal whites",
        x: 366,
        y: 351,
        width: 250,
        height: 107
    },
    {
        img: "res/zun2.3/Eyes/Eye set/Half-closed whites.png",
        name: "半闭白眼",
        id: "Half-closed whites",
        x: 363,
        y: 352,
        width: 256,
        height: 106
    },
    {
        img: "res/zun2.3/Eyes/Eye set/Wide open whites.png",
        name: "睁大白眼",
        id: "Wide open whites",
        x: 367,
        y: 348,
        width: 249,
        height: 118
    }
]);

rowList_init("脸色", true, [
    {
        img: "res/zun2.3/Face Color/Cheeks.png",
        name: "脸颊",
        id: "Cheeks",
        x: 363,
        y: 433,
        width: 271,
        height: 51
    },
    {
        img: "res/zun2.3/Face Color/Cheeks 2.png",
        name: "脸颊2",
        id: "Cheeks 2",
        x: 362,
        y: 413,
        width: 279,
        height: 101
    },
    {
        img: "res/zun2.3/Face Color/Cheeks reddish.png",
        name: "脸颊泛红",
        id: "Cheeks reddish",
        x: 357,
        y: 382,
        width: 283,
        height: 146
    },
    {
        img: "res/zun2.3/Face Color/Pale.png",
        name: "苍白",
        id: "Pale",
        x: 345,
        y: 376,
        width: 300,
        height: 132
    },
    {
        img: "res/zun2.3/Face Color/Shadow.png",
        name: "阴影",
        id: "Shadow",
        x: 362,
        y: 282,
        width: 276,
        height: 150
    }
]);

rowList_init("嘴巴", false, [
    {
        img: "res/zun2.3/Mouth/Mu-.png",
        name: "姆~",
        id: "Mu-",
        x: 475,
        y: 483,
        width: 43,
        height: 29
    },
    {
        img: "res/zun2.3/Mouth/Yu.png",
        name: "呀",
        id: "Yu",
        x: 476,
        y: 488,
        width: 25,
        height: 28
    },
    {
        img: "res/zun2.3/Mouth/O.png",
        name: "哦",
        id: "O",
        x: 480,
        y: 487,
        width: 33,
        height: 39
    },
    {
        img: "res/zun2.3/Mouth/Ohoo.png",
        name: "噢嗬",
        id: "Ohoo",
        x: 473,
        y: 477,
        width: 55,
        height: 61
    },
    {
        img: "res/zun2.3/Mouth/Hahee.png",
        name: "哈嘿",
        id: "Hahee",
        x: 472,
        y: 485,
        width: 56,
        height: 43
    },
    {
        img: "res/zun2.3/Mouth/Nn-.png",
        name: "嗯~",
        id: "Nn-",
        x: 463,
        y: 504,
        width: 68,
        height: 15
    },
    {
        img: "res/zun2.3/Mouth/Nheh-.png",
        name: "嗯嘿~",
        id: "Nheh-",
        x: 462,
        y: 497,
        width: 71,
        height: 30
    },
    {
        img: "res/zun2.3/Mouth/Nah-.png",
        name: "嗯啊~",
        id: "Nah-",
        x: 460,
        y: 482,
        width: 77,
        height: 48
    },
    {
        img: "res/zun2.3/Mouth/Triangle.png",
        name: "三角",
        id: "Triangle",
        x: 478,
        y: 480,
        width: 37,
        height: 38
    },
    {
        img: "res/zun2.3/Mouth/Mufu.png",
        name: "姆呼",
        id: "Mufu",
        x: 466,
        y: 496,
        width: 58,
        height: 16
    },
    {
        img: "res/zun2.3/Mouth/Ho-.png",
        name: "呼~",
        id: "Ho-",
        x: 467,
        y: 484,
        width: 51,
        height: 39
    },
    {
        img: "res/zun2.3/Mouth/Hoa.png",
        name: "哈",
        id: "Hoa",
        x: 466,
        y: 483,
        width: 60,
        height: 44
    },
    {
        img: "res/zun2.3/Mouth/Hoah.png",
        name: "哈啊~",
        id: "Hoah",
        x: 460,
        y: 474,
        width: 66,
        height: 61
    }
]);

rowList_init("右臂", false, [
    {
        img: "res/zun2.3/Outfit 1/Right arm/Basic.png",
        name: "基本",
        id: "1RBasic",
        x: 271,
        y: 599,
        width: 202,
        height: 474
    },
    {
        img: "res/zun2.3/Outfit 1/Right arm/Waist.png",
        name: "腰部",
        id: "1RWaist",
        x: 281,
        y: 596,
        width: 194,
        height: 326
    },
    {
        img: "res/zun2.3/Outfit 1/Right arm/Hand raised.png",
        name: "举手",
        id: "1RHand raised",
        x: 181,
        y: 315,
        width: 292,
        height: 451
    },
    {
        img: "res/zun2.3/Outfit 1/Right arm/Mouth area.png",
        name: "嘴部",
        id: "1RMouth area",
        x: 307,
        y: 521,
        width: 177,
        height: 264
    },
    {
        img: "res/zun2.3/Outfit 1/Right arm/Suffering.png",
        name: "痛苦",
        id: "1RSuffering",
        x: 338,
        y: 547,
        width: 150,
        height: 252
    },
    {
        img: "res/zun2.3/Outfit 1/Right arm/Pointing.png",
        name: "指向",
        id: "1RPointing",
        x: 244,
        y: 593,
        width: 226,
        height: 237
    },
    {
        img: "res/zun2.3/Outfit 1/Right arm/Microphone.png",
        name: "麦克风",
        id: "1RMicrophone",
        x: 303,
        y: 507,
        width: 168,
        height: 320
    },
    {
        img: "res/zun2.3/Outfit 2/Right arm/Basic.png",
        name: "基本",
        id: "2RBasic",
        x: 272,
        y: 592,
        width: 209,
        height: 478
    },
    {
        img: "res/zun2.3/Outfit 2/Right arm/Waist.png",
        name: "腰部",
        id: "2RWaist",
        x: 282,
        y: 596,
        width: 201,
        height: 323
    },
    {
        img: "res/zun2.3/Outfit 2/Right arm/Hand raised.png",
        name: "举手",
        id: "2RHand raised",
        x: 182,
        y: 312,
        width: 317,
        height: 411
    },
    {
        img: "res/zun2.3/Outfit 2/Right arm/Mouth area.png",
        name: "嘴部",
        id: "2RMouth area",
        x: 308,
        y: 518,
        width: 180,
        height: 264
    },
    {
        img: "res/zun2.3/Outfit 2/Right arm/Suffering.png",
        name: "痛苦",
        id: "2RSuffering",
        x: 338,
        y: 547,
        width: 150,
        height: 252
    },
    {
        img: "res/zun2.3/Outfit 2/Right arm/Pointing.png",
        name: "指向",
        id: "2RPointing",
        x: 245,
        y: 595,
        width: 235,
        height: 232
    },
    {
        img: "res/zun2.3/Outfit 2/Right arm/Microphone.png",
        name: "麦克风",
        id: "2RMicrophone",
        x: 303,
        y: 507,
        width: 184,
        height: 320
    },
    {
        img: "res/zun2.3/Outfit 2/Right arm/Chest area.png",
        name: "胸口",
        id: "2RChest area",
        x: 357,
        y: 587,
        width: 143,
        height: 241
    }
]);

rowList_init("左臂", false, [
    {
        img: "res/zun2.3/Outfit 1/Left arm/Basic.png",
        name: "基本",
        id: "1LBasic",
        x: 591,
        y: 600,
        width: 171,
        height: 475
    },
    {
        img: "res/zun2.3/Outfit 1/Left arm/Waist.png",
        name: "腰部",
        id: "1LWaist",
        x: 583,
        y: 593,
        width: 182,
        height: 332
    },
    {
        img: "res/zun2.3/Outfit 1/Left arm/Hand raised.png",
        name: "举手",
        id: "1LHand raised",
        x: 585,
        y: 322,
        width: 291,
        height: 457
    },
    {
        img: "res/zun2.3/Outfit 1/Left arm/Mouth area.png",
        name: "嘴部",
        id: "1LMouth area",
        x: 512,
        y: 518,
        width: 195,
        height: 257
    },
    {
        img: "res/zun2.3/Outfit 1/Left arm/Suffering.png",
        name: "痛苦",
        id: "1LSuffering",
        x: 514,
        y: 554,
        width: 158,
        height: 240
    },
    {
        img: "res/zun2.3/Outfit 1/Left arm/Thinking.png",
        name: "思考",
        id: "1LThinking",
        x: 470,
        y: 537,
        width: 205,
        height: 255
    },
    {
        img: "res/zun2.3/Outfit 1/Left arm/Whispering.png",
        name: "窃窃私语",
        id: "1LWhispering",
        x: 527,
        y: 478,
        width: 157,
        height: 286
    },
    {
        img: "res/zun2.3/Outfit 2/Left arm/Basic.png",
        name: "基本",
        id: "2LBasic",
        x: 580,
        y: 595,
        width: 182,
        height: 477
    },
    {
        img: "res/zun2.3/Outfit 2/Left arm/Waist.png",
        name: "腰部",
        id: "2LWaist",
        x: 580,
        y: 598,
        width: 185,
        height: 324
    },
    {
        img: "res/zun2.3/Outfit 2/Left arm/Hand raised.png",
        name: "举手",
        id: "2LHand raised",
        x: 575,
        y: 319,
        width: 301,
        height: 427
    },
    {
        img: "res/zun2.3/Outfit 2/Left arm/Mouth area.png",
        name: "嘴部",
        id: "2LMouth area",
        x: 512,
        y: 515,
        width: 195,
        height: 257
    },
    {
        img: "res/zun2.3/Outfit 2/Left arm/Suffering.png",
        name: "痛苦",
        id: "2LSuffering",
        x: 514,
        y: 554,
        width: 149,
        height: 240
    },
    {
        img: "res/zun2.3/Outfit 2/Left arm/Thinking.png",
        name: "思考",
        id: "2LThinking",
        x: 470,
        y: 534,
        width: 200,
        height: 255
    },
    {
        img: "res/zun2.3/Outfit 2/Left arm/Chest area.png",
        name: "胸口",
        id: "2LChest area",
        x: 533,
        y: 591,
        width: 150,
        height: 253
    },
    {
        img: "res/zun2.3/Outfit 2/Left arm/Whispering.png",
        name: "窃窃私语",
        id: "2LWhispering",
        x: 527,
        y: 478,
        width: 157,
        height: 286
    } 
]);
rowList_init("服装", false, [
    {
        img: "res/zun2.3/Outfit 1/Usual clothes.png",
        name: "日常服装",
        id: "1Usual clothes",
        x: 306,
        y: 167,
        width: 445,
        height: 1415
    },
    {
        img: "res/zun2.3/Outfit 1/Uniform.png",
        name: "制服",
        id: "1Uniform",
        x: 306,
        y: 167,
        width: 445,
        height: 1415
    },
    {
        img: "res/zun2.3/Outfit 2/Bath towel.png",
        name: "浴巾",
        id: "2Bath towel",
        x: 306,
        y: 167,
        width: 445,
        height: 1412
    },
    {
        img: "res/zun2.3/Outfit 2/School swimsuit.png",
        name: "学校泳装",
        id: "2School swimsuit",
        x: 306,
        y: 167,
        width: 445,
        height: 1412
    },
    {
        img: "res/zun2.3/Outfit 2/Panties.png",
        name: "内裤",
        id: "2Panties",
        x: 306,
        y: 167,
        width: 445,
        height: 1412
    },
    {
        img: "res/zun2.3/Outfit 2/Base body.png",
        name: "素体",
        id: "2Base body",
        x: 306,
        y: 167,
        width: 445,
        height: 1412
    }
]);

rowList_init("其他", true, [
    {
        img: "res/zun2.3/Hoodie lining.png",
        name: "连帽衫内衬",
        id: "Hoodie lining",
        x: 308,
        y: 217,
        width: 382,
        height: 457
    },
    {
        img: "res/zun2.3/Tail-like thing.png",
        name: "尾巴之类的东西",
        id: "Tail-like thing",
        x: 578,
        y: 555,
        width: 386,
        height: 255
    }
]);



selectItemByID("Edamame normal");
selectItemByID("Angry brows");
selectItemByID("Cheeks");
selectItemByID("Hoah");
selectItemByID("1LBasic");
selectItemByID("1RBasic");
selectItemByID("1Usual clothes");
selectItemByID("Normal whites");
selectItemByID("Normal eyes");
selectItemByID("Tail-like thing");