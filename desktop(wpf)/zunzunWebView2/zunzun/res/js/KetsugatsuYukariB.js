canvasSizeX = 1082;
canvasSizeY = 1818;
nowActor = "结月缘B";
document.body.dataset.actor = nowActor;
var readMe = `*应朋友建议所加 
含有少儿不宜内容，请斟酌后再使用。
結月ゆかり立ち絵素材 触手もりもり版1.2
========================================

VOICEROID 結月ゆかりのフリー立ち絵素材です。

良識の範囲内で、動画やアイコン等、自由にご利用ください。
公式の規約に準じての商用利用や、改変・加工しての利用は可能とします。

クレジット表記や、ニコニコでのコンテンツツリー登録は任意です。


レイヤーが複雑なのでPSDToolの利用を推奨します。
https://oov.github.io/psdtool

2020/6/18 ver1.2 乳首ガード触手・黒消し・汁を追加しました。乳首を隠せばKENZEN！
2020/6/18 ver1.1 PSDTool用に服フォルダに空レイヤーを入れました
2020/6/17 公開
========================================
製作：坂本アヒル
https://twitter.com/sakamoto_ahr`;
showDialog("提示", readMe);
rowList_init("记号", true, [
    { img: "res/KetsugatsuYukariB/Symbols/FluffyAura.png", name: "蓬松气团", id: "SymFluffyAura", x: 246, y: 447, width: 570, height: 139, },
    { img: "res/KetsugatsuYukariB/Symbols/HeartsScatter.png", name: "散落爱心", id: "SymHeartsScatter", x: 234, y: 242, width: 553, height: 224, },
    { img: "res/KetsugatsuYukariB/Symbols/Bandaid.png", name: "创可贴", id: "SymBandaid", x: 425, y: 163, width: 97, height: 81, },
    { img: "res/KetsugatsuYukariB/Symbols/AngerMark.png", name: "怒纹", id: "SymAngerMark", x: 305, y: 192, width: 112, height: 106, },
    { img: "res/KetsugatsuYukariB/Symbols/SurpriseMark.png", name: "惊讶符号", id: "SymSurpriseMark", x: 235, y: 295, width: 136, height: 75, },
    { img: "res/KetsugatsuYukariB/Symbols/SweatDrop.png", name: "汗滴", id: "SymSweatDrop", x: 242, y: 392, width: 61, height: 67, },
    { img: "res/KetsugatsuYukariB/Symbols/ExclamationQuestion.png", name: "叹问号", id: "SymExclamationQuestion", x: 239, y: 505, width: 81, height: 104, },
    { img: "res/KetsugatsuYukariB/Symbols/QuestionMark.png", name: "问号", id: "SymQuestionMark", x: 227, y: 472, width: 93, height: 120, },
    { img: "res/KetsugatsuYukariB/Symbols/Sigh.png", name: "叹气", id: "SymSigh", x: 181, y: 625, width: 152, height: 78, },
]);

rowList_init("表情", true, [
    { img: "res/KetsugatsuYukariB/Expression/Drool.png", name: "口水", id: "ExprDrool", x: 516, y: 574, width: 27, height: 54, },
    { img: "res/KetsugatsuYukariB/Expression/Sweat.png", name: "汗", id: "ExprSweat", x: 429, y: 526, width: 19, height: 24, },
    { img: "res/KetsugatsuYukariB/Expression/SweatLots.png", name: "大汗", id: "ExprSweatLots", x: 344, y: 290, width: 418, height: 267, },
    { img: "res/KetsugatsuYukariB/Expression/WhiteLiquidFace.png", name: "白色液体（脸）", id: "ExprWhiteLiquidFace", x: 344, y: 200, width: 273, height: 505, },
    
]);
rowList_init("眼睛特效", true, [
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/Basic Eye Set/Eye Effects/HighlightOff.png", name: "去高光", id: "EyeFxHighlightOff", x: 421, y: 393, width: 194, height: 35, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/Basic Eye Set/Eye Effects/NoEffect.png", name: "无特效", id: "EyeFxNoEffect", x: 0, y: 0, width: 1, height: 1, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/Basic Eye Set/Eye Effects/Spiral.png", name: "圈圈", id: "EyeFxSpiral", x: 432, y: 405, width: 186, height: 60, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/Basic Eye Set/Eye Effects/Heart.png", name: "爱心", id: "EyeFxHeart", x: 438, y: 423, width: 169, height: 27, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/Basic Eye Set/Eye Effects/Shiitake.png", name: "香菇眼", id: "EyeFxShiitake", x: 433, y: 405, width: 180, height: 59, },
]);
rowList_init("眼与眉", false, [
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Tears.png", name: "泪", id: "ExprEBTears", x: 388, y: 449, width: 282, height: 50, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/AngryEyesRaisedBrow.png", name: "怒目上扬眉", id: "ExprEBAngryEyesRaisedBrow", x: 403, y: 355, width: 244, height: 132, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/StrainEyesRaisedBrow.png", name: "紧闭眼上扬眉", id: "ExprEBStrainEyesRaisedBrow", x: 405, y: 355, width: 230, height: 131, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/StrainEyesTroubledBrow.png", name: "紧闭眼困扰眉", id: "ExprEBStrainEyesTroubledBrow", x: 405, y: 353, width: 230, height: 133, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/DroopyEyesBrow.png", name: "八字眼眉", id: "ExprEBDroopyEyesBrow", x: 413, y: 331, width: 227, height: 156, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/PeacefulEyesNormalBrow.png", name: "平和眼普通眉", id: "ExprEBPeacefulEyesNormalBrow", x: 416, y: 347, width: 220, height: 129, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/PeacefulEyesTroubledBrow.png", name: "平和眼困扰眉", id: "ExprEBPeacefulEyesTroubledBrow", x: 415, y: 359, width: 221, height: 117, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/LookUp.png", name: "向上看", id: "ExprEBEyesLookUp", x: 401, y: 366, width: 254, height: 116, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/DotEyes.png", name: "圆点眼", id: "ExprEBEyesDotEyes", x: 399, y: 368, width: 242, height: 126, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/CircleEyes.png", name: "圈圈眼", id: "ExprEBEyesCircleEyes", x: 415, y: 396, width: 217, height: 87, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/SpiralEyes.png", name: "漩涡眼", id: "ExprEBEyesSpiralEyes", x: 414, y: 397, width: 221, height: 80, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/SmileEyes.png", name: "微笑眼", id: "ExprEBEyesSmileEyes", x: 406, y: 404, width: 232, height: 77, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/ClosedEyes.png", name: "闭眼", id: "ExprEBEyesClosedEyes", x: 407, y: 412, width: 232, height: 69, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/Basic Eye Set/BasicEyes.png", name: "基本眼", id: "BasicEyeBasicEyes", x: 404, y: 366, width: 251, height: 124, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/Basic Eye Set/BasicEyesLowerLid.png", name: "基本眼下睑", id: "BasicEyeBasicEyesLowerLid", x: 404, y: 366, width: 251, height: 115, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/Basic Eye Set/AnnoyedEyes.png", name: "嫌弃眼", id: "BasicEyeAnnoyedEyes", x: 401, y: 376, width: 254, height: 114, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/Basic Eye Set/AnnoyedEyesLowerLid.png", name: "嫌弃眼下睑", id: "BasicEyeAnnoyedEyesLowerLid", x: 401, y: 376, width: 254, height: 108, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Eyes/Basic Eye Set/TroubledEyes.png", name: "困扰眼", id: "BasicEyeTroubledEyes", x: 401, y: 366, width: 254, height: 115, },
]);




rowList_init("眉毛", false, [
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Brows/Normal.png", name: "普通眉", id: "ExprEBBrowNormal", x: 406, y: 322, width: 202, height: 43, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Brows/Raised.png", name: "上挑眉", id: "ExprEBBrowRaised", x: 397, y: 297, width: 221, height: 53, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Brows/Angry.png", name: "怒眉", id: "ExprEBBrowAngry", x: 403, y: 327, width: 206, height: 52, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Brows/Upturned.png", name: "上扬眉", id: "ExprEBBrowUpturned", x: 403, y: 321, width: 208, height: 45, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Brows/Troubled.png", name: "困扰眉", id: "ExprEBBrowTroubled", x: 398, y: 316, width: 220, height: 63, },
    { img: "res/KetsugatsuYukariB/Expression/Eyes And Brows/Eye Brow Set/Brows/Drooping.png", name: "下垂眉", id: "ExprEBBrowDrooping", x: 407, y: 322, width: 192, height: 41, },
]);

rowList_init("嘴", false, [
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Smile.png", name: "微笑", id: "MouthSmile", x: 524, y: 531, width: 49, height: 28, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/SmileOmega.png", name: "微笑（ω）", id: "MouthSmileOmega", x: 526, y: 538, width: 44, height: 20, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/SmileWave.png", name: "微笑（波浪）", id: "MouthSmileWave", x: 511, y: 528, width: 70, height: 31, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/LaughSmall.png", name: "笑（微张嘴）", id: "MouthLaughSmall", x: 518, y: 522, width: 53, height: 44, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/LaughBig.png", name: "笑（张大嘴）", id: "MouthLaughBig", x: 510, y: 508, width: 70, height: 64, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/LaughSmirk.png", name: "笑（坏笑）", id: "MouthLaughSmirk", x: 509, y: 519, width: 74, height: 48, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/LaughSmirkBroken.png", name: "笑（崩坏坏笑）", id: "MouthLaughSmirkBroken", x: 503, y: 525, width: 95, height: 52, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/LaughTeeth.png", name: "笑（露齿）", id: "MouthLaughTeeth", x: 523, y: 523, width: 52, height: 41, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/LaughOho.png", name: "笑（哦嚯）", id: "MouthLaughOho", x: 522, y: 526, width: 40, height: 31, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/LaughDrool.png", name: "笑（流口水）", id: "MouthLaughDrool", x: 511, y: 525, width: 67, height: 46, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Uaah.png", name: "呜啊", id: "MouthUaah", x: 504, y: 510, width: 83, height: 76, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Awawa.png", name: "惊慌", id: "MouthAwawa", x: 513, y: 533, width: 67, height: 34, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/O.png", name: "哦", id: "MouthO", x: 531, y: 531, width: 27, height: 31, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Ooh.png", name: "哦——", id: "MouthOoh", x: 508, y: 505, width: 74, height: 74, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Oah.png", name: "哦啊", id: "MouthOah", x: 505, y: 513, width: 97, height: 73, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Triangle.png", name: "三角嘴", id: "MouthTriangle", x: 519, y: 520, width: 49, height: 43, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/TriangleSmall.png", name: "三角嘴小", id: "MouthTriangleSmall", x: 519, y: 536, width: 47, height: 23, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Nho.png", name: "唔嚯", id: "MouthNho", x: 518, y: 511, width: 57, height: 58, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Hahii.png", name: "哈啊", id: "MouthHahii", x: 514, y: 513, width: 68, height: 62, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/N.png", name: "唔", id: "MouthN", x: 527, y: 541, width: 15, height: 17, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Nmu.png", name: "唔姆", id: "MouthNmu", x: 523, y: 542, width: 40, height: 11, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Nmumu.png", name: "唔姆姆", id: "MouthNmumu", x: 526, y: 538, width: 43, height: 21, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/PuffedCheek.png", name: "鼓腮", id: "MouthPuffedCheek", x: 528, y: 523, width: 31, height: 32, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/TongueOut.png", name: "吐舌", id: "MouthTongueOut", x: 520, y: 533, width: 57, height: 28, },
    { img: "res/KetsugatsuYukariB/Expression/Mouth/Grin.png", name: "咧嘴", id: "MouthGrin", x: 512, y: 526, width: 79, height: 39, },
]);
rowList_init("面部修饰",true,[
    { img: "res/KetsugatsuYukariB/Expression/Shading.png", name: "阴影", id: "ExprShading", x: 380, y: 296, width: 291, height: 146, },
    { img: "res/KetsugatsuYukariB/Expression/CheekStrong.png", name: "腮红浓", id: "ExprCheekStrong", x: 396, y: 455, width: 258, height: 63, },
    { img: "res/KetsugatsuYukariB/Expression/CheekLight.png", name: "腮红淡", id: "ExprCheekLight", x: 397, y: 461, width: 257, height: 57, },
    { img: "res/KetsugatsuYukariB/Expression/CheekBasic.png", name: "腮红基本", id: "ExprCheekBasic", x: 397, y: 467, width: 257, height: 49, },
])

rowList_init("衣服与触手", true, [
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/None.png", name: "无", id: "ClothNone", x: 0, y: 0, width: 1, height: 1, },
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/TentacleHoodie.png", name: "触手连帽衫", id: "ClothTentacleHoodie", x: 124, y: 512, width: 828, height: 1226, },
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/FullSet.png", name: "全套", id: "ClothFullSet", x: 124, y: 512, width: 828, height: 1168, },
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/NippleGuardTentacle.png", name: "乳首护具触手", id: "ClothNippleGuardTentacle", x: 330, y: 765, width: 356, height: 222, },
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/UsualOutfitWithWaist.png", name: "常服+腰饰", id: "ClothUsualOutfitWithWaist", x: 233, y: 609, width: 607, height: 855, },
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/UsualOutfit.png", name: "常服", id: "ClothUsualOutfit", x: 250, y: 609, width: 487, height: 765, },
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/WaistPart.png", name: "腰饰", id: "ClothWaistPart", x: 233, y: 1039, width: 607, height: 425, },
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/HoodieBareSkin.png", name: "连帽衫（裸装）", id: "ClothHoodieBareSkin", x: 124, y: 512, width: 828, height: 1168, },
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/TentacleJuice.png", name: "触手汁", id: "ClothTentacleJuice", x: 300, y: 779, width: 529, height: 863, },
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/TentacleLong.png", name: "触手（长）", id: "ClothTentacleLong", x: 202, y: 578, width: 717, height: 1240, },
    { img: "res/KetsugatsuYukariB/Clothes And Tentacles/TentacleShort.png", name: "触手（短）", id: "ClothTentacleShort", x: 202, y: 776, width: 666, height: 1042, },
]);

rowList_init("内衣（上）", false, [
    { img: "res/KetsugatsuYukariB/Inner Upper/None.png", name: "无", id: "InnerUpNone", x: 0, y: 0, width: 1, height: 1, },
    { img: "res/KetsugatsuYukariB/Inner Upper/InnerTop.png", name: "内搭上衣", id: "InnerUpInnerTop", x: 375, y: 618, width: 316, height: 337, },
    { img: "res/KetsugatsuYukariB/Inner Upper/ChestStickerHeart.png", name: "胸贴（爱心）", id: "InnerUpChestStickerHeart", x: 386, y: 770, width: 252, height: 79, },
    { img: "res/KetsugatsuYukariB/Inner Upper/ChestSticker.png", name: "胸贴", id: "InnerUpChestSticker", x: 384, y: 768, width: 249, height: 91, },
    { img: "res/KetsugatsuYukariB/Inner Upper/Nipple.png", name: "乳头", id: "InnerUpNipple", x: 390, y: 784, width: 228, height: 52, },
]);

rowList_init("内衣（下）", false, [
    { img: "res/KetsugatsuYukariB/Inner Lower/None.png", name: "无", id: "InnerLowNone", x: 0, y: 0, width: 1, height: 1, },
    { img: "res/KetsugatsuYukariB/Inner Lower/Panties.png", name: "内裤", id: "InnerLowPanties", x: 274, y: 1137, width: 435, height: 195, },
    { img: "res/KetsugatsuYukariB/Inner Lower/InnerBottom.png", name: "内搭下装", id: "InnerLowInnerBottom", x: 274, y: 1137, width: 435, height: 195, },
    { img: "res/KetsugatsuYukariB/Inner Lower/CrotchStickerHeart.png", name: "下体贴（爱心）", id: "InnerLowCrotchStickerHeart", x: 445, y: 1282, width: 79, height: 44, },
    { img: "res/KetsugatsuYukariB/Inner Lower/CrotchSticker.png", name: "下体贴", id: "InnerLowCrotchSticker", x: 464, y: 1284, width: 54, height: 43, },
]);

rowList_init("开菲尔大杯", false, [
    { img: "res/KetsugatsuYukariB/KefirBig/KefirBig.png", name: "开菲尔大杯", id: "KefirBig", x: 278, y: 136, width: 560, height: 1682, },
]);

rowList_init("黑色遮挡（胸）", false, [
    { img: "res/KetsugatsuYukariB/CensorChest/CensorChest.png", name: "黑色遮挡（胸）", id: "CensorChest", x: 356, y: 787, width: 308, height: 54, },
]);

rowList_init("黑色遮挡（下身）", false, [
    { img: "res/KetsugatsuYukariB/CensorCrotch/CensorCrotch.png", name: "黑色遮挡（下身）", id: "CensorCrotch", x: 415, y: 1296, width: 119, height: 45, },
]);

rowList_init("发饰", false, [
    { img: "res/KetsugatsuYukariB/HairAccessory/HairAccessory.png", name: "发饰", id: "HairAccessory", x: 621, y: 204, width: 142, height: 111, },
]);

rowList_init("鬓发", false, [
    { img: "res/KetsugatsuYukariB/Sidelocks/Sidelocks.png", name: "鬓发", id: "Sidelocks", x: 324, y: 541, width: 481, height: 252, },
]);

rowList_init("白色液体（身体）", false, [
    { img: "res/KetsugatsuYukariB/WhiteLiquidBody/WhiteLiquidBody.png", name: "白色液体（身体）", id: "WhiteLiquidBody", x: 414, y: 699, width: 163, height: 618, },
]);

rowList_init("身上汗", false, [
    { img: "res/KetsugatsuYukariB/SweatOnBody/SweatOnBody.png", name: "身上汗", id: "SweatOnBody", x: 336, y: 925, width: 260, height: 518, },
]);

rowList_init("过膝袜", false, [
    { img: "res/KetsugatsuYukariB/ThighHighs/ThighHighs.png", name: "过膝袜", id: "ThighHighs", x: 299, y: 1353, width: 481, height: 465, },
]);

rowList_init("身体", false, [
    { img: "res/KetsugatsuYukariB/Body/Body.png", name: "身体", id: "Body", x: 242, y: 106, width: 649, height: 1712, },
]);

selectItemByID("SymAngerMark");
selectItemByID("ExprSweat");
selectItemByID("ExprWhiteLiquidFace");
selectItemByID("ExprCheekStrong");
selectItemByID("BasicEyeAnnoyedEyes");
selectItemByID("ExprEBBrowAngry");
selectItemByID("MouthTriangle");
selectItemByID("ClothTentacleHoodie");
selectItemByID("InnerUpNipple");
selectItemByID("InnerLowPanties");
selectItemByID("HairAccessory");
selectItemByID("Sidelocks");
selectItemByID("WhiteLiquidBody");
selectItemByID("Body");
