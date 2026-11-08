canvasSizeX = 1800;
canvasSizeY = 1800;
nowActor = "jito410俊达萌";
document.body.dataset.actor = nowActor;
var readMe = `【動画用立ち絵素材】ジト目をすころう式ずんだもん
ジト目と丸眉がチャームポイントのもんちゃんをぜひ使ってみて下さい！,,⩌ω⩌,,
下記の「素材利用の際のお願い」をお読みになった上ダウンロードお願いいたします！
素材利用の際のお願い
■以下のような利用方法はお控えください
（１）原作や他者の気持ちや名誉、考え方などを傷つける目的のもの
（２）特定の政治・宗教を過度に推す、または貶すもの
（３）ファンの方々への配慮の伴わない暴力的・グロテスクなもの
（４）過度な性的描写を含むもの
（５）その他薬物、未成年飲酒など、反社会的な表現のもの
（６）他人の権利を侵害しているもの
（７）公式作品と誤認される可能性のある様態のもの
（８）公式のガイドラインに沿わない利用
　　　https://zunko.jp/guideline.html
■収益化に関するお願い
本素材は、動画制作に利用するためのものです。
動画投稿サービスの機能内での収益化は許可いたしますが、それ以外の方法での収益化にはご利用いただけません。
■クレジットについて
・クレジットは
ジト目をすころう
でお願いいたします！
・ニコニコ静画の作品ページを親子登録していただけるととても喜びます！
何か不備がございましたらX（https://x.com/jito410）までご連絡ください！！`;
showDialog("提示", readMe);
rowList_init("眉毛", false, [
        { img: "res/zunzun/Eyebrows/NormalBrows.png", name: "通常", id: "NormalBrows", x: 626, y: 598, width: 470, height: 82 },
        { img: "res/zunzun/Eyebrows/SharpBrows.png", name: "锐利", id: "SharpBrows", x: 630, y: 608, width: 455, height: 77 },
        { img: "res/zunzun/Eyebrows/DroopyBrows.png", name: "沮丧", id: "DroopyBrows", x: 631, y: 593, width: 466, height: 84 }
]);
rowList_init("自定义眼睛配件", true, [
        { img: "res/zunzun/CustomEyeParts/Sparkle.png", name: "闪闪", id: "Sparkle", x: 589, y: 728, width: 570, height: 180 },
        { img: "res/zunzun/CustomEyeParts/Tears.png", name: "泪水", id: "Tears", x: 1026, y: 854, width: 74, height: 64 },
        { img: "res/zunzun/CustomEyeParts/Spiral.png", name: "螺旋", id: "Spiral", x: 624, y: 739, width: 484, height: 123 }
]);
rowList_init("眼睛", false, [
        { img: "res/zunzun/Eyes/NormalEyes.png", name: "通常", id: "NormalEyes", x: 514, y: 694, width: 724, height: 211 },
        { img: "res/zunzun/Eyes/CrossEyes.png", name: "＞＜", id: "CrossEyes", x: 570, y: 671, width: 595, height: 224 },
        { img: "res/zunzun/Eyes/NoHighlight.png", name: "无高光", id: "NoHighlight", x: 514, y: 694, width: 724, height: 211 },
        { img: "res/zunzun/Eyes/BlankEyes.png", name: "白眼", id: "BlankEyes", x: 514, y: 694, width: 724, height: 211 },
        { img: "res/zunzun/Eyes/LineEyes.png", name: "一字眼", id: "LineEyes", x: 537, y: 769, width: 679, height: 61 },
        { img: "res/zunzun/Eyes/NarrowEyes.png", name: "细眼", id: "NarrowEyes", x: 512, y: 714, width: 724, height: 182 }
]);
rowList_init("嘴巴", false, [
        { img: "res/zunzun/Mouth/NormalMouth.png", name: "通常", id: "NormalMouth", x: 822, y: 882, width: 82, height: 32 },
        { img: "res/zunzun/Mouth/Smile.png", name: "微笑", id: "Smile", x: 810, y: 855, width: 127, height: 101 },
        { img: "res/zunzun/Mouth/BigSmile.png", name: "大笑", id: "BigSmile", x: 792, y: 845, width: 176, height: 139 },
        { img: "res/zunzun/Mouth/Oh.png", name: "哦", id: "Oh", x: 828, y: 870, width: 71, height: 67 },
        { img: "res/zunzun/Mouth/Tongue.png", name: "吐舌", id: "Tongue", x: 819, y: 866, width: 116, height: 41 },
        { img: "res/zunzun/Mouth/Dumbfounded.png", name: "呆然", id: "Dumbfounded", x: 817, y: 890, width: 110, height: 45 }
]);
rowList_init("自定义配件", true, [
        { img: "res/zunzun/CustomParts/Blush.png", name: "脸红", id: "Blush", x: 459, y: 699, width: 1000, height: 243 },
        { img: "res/zunzun/CustomParts/ThreeMark.png", name: "三", id: "ThreeMark", x: 788, y: 680, width: 152, height: 137 },
        { img: "res/zunzun/CustomParts/Sweat.png", name: "汗", id: "Sweat", x: 1229, y: 602, width: 104, height: 127 },
        { img: "res/zunzun/CustomParts/Bandage.png", name: "创可贴", id: "Bandage", x: 776, y: 314, width: 228, height: 202 },
        { img: "res/zunzun/CustomParts/HairClip.png", name: "发夹", id: "HairClip", x: 718, y: 526, width: 134, height: 105 },
        { img: "res/zunzun/CustomParts/Ribbon.png", name: "蝴蝶结", id: "Ribbon", x: 664, y: 316, width: 439, height: 214 }
]);
rowList_init("根图层", true, [
        { img: "res/zunzun/BaseBody.png", name: "素体", id: "BaseBody", x: 209, y: 266, width: 1429, height: 1357 }
]);
selectItemByID("NormalBrows", true);
selectItemByID("NormalEyes", true);
selectItemByID("Smile", true);
selectItemByID("BaseBody", true);
