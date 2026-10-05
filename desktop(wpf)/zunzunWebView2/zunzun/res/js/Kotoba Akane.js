canvasSizeX = 1082;
canvasSizeY = 1820;
nowActor = "琴叶茜";
document.body.dataset.actor = nowActor;
var readMe = `
VOICEROID的追加人物~
琴葉姉妹立ち絵素材
========================================

琴葉茜・琴葉葵のフリー立ち絵素材です。

良識の範囲内で、動画やアイコン等、自由にご利用ください。
公式の規約に準じての商用利用や、改変・加工しての利用も可能です。
クレジット表記や、ニコニコでのコンテンツツリー登録は任意です。

↓公式のキャラクター利用規約も読んでね。
https://www.ai-j.jp/kotonoha

PSDToolに対応しています。
ブラウザ上で使えるツールでレイヤー切り替えなどが簡単にできるのでおすすめです。
https://oov.github.io/psdtool

2021/12/04 ver1.1 腕パーツの色と手の大きさを調整、「縦線目」「ほっぺ赤め2」を追加
2021/11/25 ver1.0.1 カラープロファイルを変更、顔や髪の色を修正
2021/11/24 公開

========================================
製作：坂本アヒル
https://twitter.com/sakamoto_ahr`;
showDialog("提示", readMe);
rowList_init("记号", true, [
    { img: "res/Kotoba Akane/Symbols/Tears.png", name: "泪水", id: "Tears", x: 388, y: 332, width: 246, height: 166 },
    { img: "res/Kotoba Akane/Symbols/Sweat2.png", name: "汗2", id: "Sweat2", x: 411, y: 165, width: 201, height: 258 },
    { img: "res/Kotoba Akane/Symbols/Sweat.png", name: "汗", id: "Sweat", x: 414, y: 397, width: 19, height: 26 }
]);
rowList_init("眉毛", true, [
    { img: "res/Kotoba Akane/Eyebrows/Angry.png", name: "怒眉", id: "Angry", x: 404, y: 206, width: 178, height: 40 },
    { img: "res/Kotoba Akane/Eyebrows/Troubled.png", name: "为难眉", id: "Troubled", x: 398, y: 211, width: 184, height: 45 },
    { img: "res/Kotoba Akane/Eyebrows/Happy.png", name: "愉快眉", id: "Happy", x: 402, y: 177, width: 180, height: 43 },
    { img: "res/Kotoba Akane/Eyebrows/Normal.png", name: "基本眉", id: "Normal", x: 408, y: 198, width: 164, height: 39 }
]);
rowList_init("瞳孔", true, [
    { img: "res/Kotoba Akane/Eyes/Eyelashes/Pupil/BlankEye.png", name: "白眼", id: "BlankEye", x: 402, y: 278, width: 207, height: 78 },
    { img: "res/Kotoba Akane/Eyes/Eyelashes/Pupil/SketchyEye.png", name: "不妙眼", id: "SketchyEye", x: 411, y: 286, width: 187, height: 59 },
    { img: "res/Kotoba Akane/Eyes/Eyelashes/Pupil/SpiralEye.png", name: "螺旋眼", id: "SpiralEye", x: 402, y: 278, width: 207, height: 78 },
    { img: "res/Kotoba Akane/Eyes/Eyelashes/Pupil/HeartEye.png", name: "爱心眼", id: "HeartEye", x: 402, y: 278, width: 207, height: 78 },
    { img: "res/Kotoba Akane/Eyes/Eyelashes/Pupil/SparkleEye.png", name: "闪闪眼", id: "SparkleEye", x: 402, y: 278, width: 207, height: 78 },
    { img: "res/Kotoba Akane/Eyes/Eyelashes/Pupil/MuddyEye.png", name: "浑浊眼", id: "MuddyEye", x: 402, y: 278, width: 207, height: 78 },
    { img: "res/Kotoba Akane/Eyes/Eyelashes/Pupil/LookingAway.png", name: "移开视线", id: "LookingAway", x: 397, y: 278, width: 207, height: 78 },
    { img: "res/Kotoba Akane/Eyes/Eyelashes/Pupil/CameraGaze.png", name: "看镜头", id: "CameraGaze", x: 407, y: 278, width: 207, height: 78 },
    { img: "res/Kotoba Akane/Eyes/Eyelashes/Pupil/BasicPupil.png", name: "基本", id: "BasicPupil", x: 402, y: 278, width: 207, height: 78 }
]);
rowList_init("睫毛", true, [
    { img: "res/Kotoba Akane/Eyes/Eyelashes/AngryLashes.png", name: "怒睫毛", id: "AngryLashes", x: 375, y: 267, width: 268, height: 38 },
    { img: "res/Kotoba Akane/Eyes/Eyelashes/HalfLashes.png", name: "半眼睫毛", id: "HalfLashes", x: 380, y: 254, width: 255, height: 73 },
    { img: "res/Kotoba Akane/Eyes/Eyelashes/BasicLashes.png", name: "基本睫毛", id: "BasicLashes", x: 383, y: 252, width: 250, height: 86 }
]);
rowList_init("眼睛", true, [
    { img: "res/Kotoba Akane/Eyes/SmileEyes.png", name: "笑眼", id: "SmileEyes", x: 389, y: 287, width: 236, height: 63 },
    { img: "res/Kotoba Akane/Eyes/CrossEyes.png", name: "＞＜", id: "CrossEyes", x: 386, y: 276, width: 232, height: 82 },
    { img: "res/Kotoba Akane/Eyes/CalmEyes.png", name: "和缓眼", id: "CalmEyes", x: 390, y: 293, width: 230, height: 56 },
    { img: "res/Kotoba Akane/Eyes/ClosedEyes.png", name: "闭眼", id: "ClosedEyes", x: 397, y: 302, width: 217, height: 51 },
    { img: "res/Kotoba Akane/Eyes/VerticalLineEyes.png", name: "竖线眼", id: "VerticalLineEyes", x: 418, y: 277, width: 171, height: 76 }
]);
rowList_init("嘴巴", true, [
    { img: "res/Kotoba Akane/Mouth/Nn.png", name: "嗯——", id: "Nn", x: 497, y: 402, width: 31, height: 17 },
    { img: "res/Kotoba Akane/Mouth/Hoo.png", name: "呼——", id: "Hoo", x: 495, y: 386, width: 43, height: 34 },
    { img: "res/Kotoba Akane/Mouth/Muu.png", name: "呣——", id: "Muu", x: 501, y: 396, width: 31, height: 20 },
    { img: "res/Kotoba Akane/Mouth/Uoo.png", name: "呜哦——！", id: "Uoo", x: 484, y: 363, width: 66, height: 81 },
    { img: "res/Kotoba Akane/Mouth/E.png", name: "诶", id: "E", x: 486, y: 395, width: 62, height: 29 },
    { img: "res/Kotoba Akane/Mouth/Oo.png", name: "哦——", id: "Oo", x: 489, y: 374, width: 55, height: 62 },
    { img: "res/Kotoba Akane/Mouth/O.png", name: "哦", id: "O", x: 493, y: 396, width: 47, height: 29 },
    { img: "res/Kotoba Akane/Mouth/Sniff.png", name: "抽鼻子", id: "Sniff", x: 494, y: 406, width: 43, height: 9 },
    { img: "res/Kotoba Akane/Mouth/Smirk.png", name: "奸笑", id: "Smirk", x: 484, y: 391, width: 63, height: 31 },
    { img: "res/Kotoba Akane/Mouth/Uhehe.png", name: "呜嘿嘿", id: "Uhehe", x: 477, y: 388, width: 81, height: 43 },
    { img: "res/Kotoba Akane/Mouth/Waa.png", name: "哇——", id: "Waa", x: 482, y: 380, width: 72, height: 54 },
    { img: "res/Kotoba Akane/Mouth/GentleSmile.png", name: "浅笑", id: "GentleSmile", x: 482, y: 389, width: 71, height: 37 }
]);
rowList_init("根图层3", true, [
    { img: "res/Kotoba Akane/SideburnPieces.png", name: "鬓角发片", id: "SideburnPieces", x: 294, y: 102, width: 449, height: 513 }
]);
rowList_init("脸色", true, [
    { img: "res/Kotoba Akane/FaceColor/EyeBags.png", name: "黑眼圈", id: "EyeBags", x: 412, y: 344, width: 192, height: 24 },
    { img: "res/Kotoba Akane/FaceColor/Blush2.png", name: "脸红2", id: "Blush2", x: 372, y: 282, width: 303, height: 159 },
    { img: "res/Kotoba Akane/FaceColor/Blush.png", name: "脸红", id: "Blush", x: 379, y: 323, width: 271, height: 68 },
    { img: "res/Kotoba Akane/FaceColor/Cheeks.png", name: "脸颊", id: "Cheeks", x: 383, y: 340, width: 250, height: 43 },
    { img: "res/Kotoba Akane/FaceColor/Shadow.png", name: "阴影", id: "Shadow", x: 370, y: 225, width: 275, height: 97 }
]);
rowList_init("根图层2", true, [
    { img: "res/Kotoba Akane/ClothingOrnament.png", name: "服饰缀饰", id: "ClothingOrnament", x: 427, y: 543, width: 149, height: 276 }
]);
rowList_init("左臂", true, [
    { img: "res/Kotoba Akane/LeftArm/SpreadArms.png", name: "张开双臂", id: "SpreadArms", x: 515, y: 509, width: 386, height: 435 },
    { img: "res/Kotoba Akane/LeftArm/HandsUp.png", name: "万岁", id: "HandsUp", x: 506, y: 170, width: 438, height: 485 },
    { img: "res/Kotoba Akane/LeftArm/Peace.png", name: "剪刀手", id: "Peace", x: 515, y: 496, width: 321, height: 300 },
    { img: "res/Kotoba Akane/LeftArm/Thinking.png", name: "思考", id: "Thinking", x: 497, y: 432, width: 218, height: 354 },
    { img: "res/Kotoba Akane/LeftArm/Basic.png", name: "基本", id: "Basic", x: 515, y: 509, width: 334, height: 559 }
]);
rowList_init("右臂", true, [
    { img: "res/Kotoba Akane/RightArm/SpreadArms.png", name: "张开双臂", id: "SpreadArmsRightArm", x: 76, y: 522, width: 426, height: 392 },
    { img: "res/Kotoba Akane/RightArm/HandsUp.png", name: "万岁", id: "HandsUpRightArm", x: 86, y: 173, width: 422, height: 462 },
    { img: "res/Kotoba Akane/RightArm/KitchenKnife.png", name: "菜刀", id: "KitchenKnife", x: 177, y: 325, width: 325, height: 477 },
    { img: "res/Kotoba Akane/RightArm/Pointing.png", name: "指人", id: "Pointing", x: 170, y: 497, width: 332, height: 305 },
    { img: "res/Kotoba Akane/RightArm/Peace.png", name: "剪刀手", id: "PeaceRightArm", x: 196, y: 489, width: 306, height: 313 },
    { img: "res/Kotoba Akane/RightArm/Basic.png", name: "基本", id: "BasicRightArm", x: 169, y: 522, width: 333, height: 528 }
]);
rowList_init("根图层", true, [
    { img: "res/Kotoba Akane/BackHair.png", name: "后发", id: "BackHair", x: 287, y: 139, width: 526, height: 669 },
    { img: "res/Kotoba Akane/Body.png", name: "身体", id: "Body", x: 145, y: 87, width: 787, height: 1622 },
    { img: "res/Kotoba Akane/FlippedHairOrnament.png", name: "左右翻转发饰", id: "FlippedHairOrnament", x: 164, y: 97, width: 226, height: 370 },
    { img: "res/Kotoba Akane/HairOrnament.png", name: "发饰", id: "HairOrnament", x: 679, y: 69, width: 228, height: 404 }
]);
selectItemByID("Normal", true);
selectItemByID("BasicPupil", true);
selectItemByID("BasicLashes", true);
selectItemByID("VerticalLineEyes", true);
selectItemByID("GentleSmile", true);
selectItemByID("SideburnPieces", true);
selectItemByID("Cheeks", true);
selectItemByID("ClothingOrnament", true);
selectItemByID("Basic", true);
selectItemByID("BasicRightArm", true);
selectItemByID("BackHair", true);
selectItemByID("Body", true);
selectItemByID("HairOrnament", true);
