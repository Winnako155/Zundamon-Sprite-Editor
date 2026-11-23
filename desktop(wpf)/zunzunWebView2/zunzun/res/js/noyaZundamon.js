// noyaZundamon（のや様 ずんだもん立ち絵素材）
// Canvas: 810 x 1509 px
canvasSizeX = 810;
canvasSizeY = 1509;
nowActor = "noya俊达萌";
document.body.dataset.actor = nowActor;
var readMe = `ずんだもん立ち絵
ずんだもんの立ち絵です。
よかったら動画などで使ってください。
ポーズ4種で表情は色々フォルダ内の組み合わせて作って遊んでね！
一応PSDツールで目パチ口パクはできました（私は）

https://ux.getuploader.com/noya/download/1
pass:zundamon

※鼻や目や眉、口の位置など気に入らないとこありましたらフォトショかクリスタの矢印ツールで自分の好みの位置に移動させておｋですー。 ※グッズ作って販売みたいな商業利用はNGです。`;
showDialog("提示", readMe);

//noya俊达萌的选中判断逻辑：身体列表决定姿势，自动切换站立/前倾两套表情列表
actorHooks[nowActor] = function(clickItem){
    var body = getListSelectStateByID("身体");
    var isLean = body != null && (body.id.indexOf("LDown") == 0 || body.id.indexOf("LHip") == 0);
    var groups = ["汗", "鼻", "眉毛", "眼睛", "嘴巴", "脸颊"];
    for(var i = 0; i < groups.length; i++){
        if(isLean){
            changeTheRowListState(groups[i] + "（前倾）", "", true);
            changeTheRowListState(groups[i] + "（站立）", "", false);
        }
        else{
            changeTheRowListState(groups[i] + "（站立）", "", true);
            changeTheRowListState(groups[i] + "（前倾）", "", false);
        }
    }
};

rowList_init("汗（站立）", true, [
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Sweat/Heavy.png", name: "瀑布汗", id: "CrossSweatHeavy", x: 306, y: 258, width: 157, height: 222 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Sweat/Normal.png", name: "通常汗", id: "CrossSweatNormal", x: 421, y: 440, width: 7, height: 10 }
]);

rowList_init("鼻（站立）", false, [
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Nose/Shadow.png", name: "鼻阴影", id: "CrossNoseShadow", x: 325, y: 339, width: 54, height: 86 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Nose/Blush.png", name: "鼻脸红", id: "CrossNoseBlush", x: 327, y: 339, width: 28, height: 86 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Nose/Default.png", name: "鼻默认", id: "CrossNoseDefault", x: 325, y: 339, width: 39, height: 86 }
]);

rowList_init("眉毛（站立）", false, [
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/ClosedBrow/Droop.png", name: "闭眼下垂", id: "CrossBrowClosedDroop", x: 306, y: 361, width: 141, height: 26 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/ClosedBrow/Sharp.png", name: "闭眼锐利", id: "CrossBrowClosedSharp", x: 308, y: 351, width: 134, height: 36 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/ClosedBrow/Front.png", name: "闭眼正视", id: "CrossBrowClosedFront", x: 311, y: 352, width: 129, height: 39 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/DownBrow/Troubled.png", name: "伏眼困扰", id: "CrossBrowDownTroubled", x: 305, y: 353, width: 142, height: 20 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/DownBrow/Sharp.png", name: "伏眼锐利", id: "CrossBrowDownSharp", x: 308, y: 336, width: 124, height: 42 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/DownBrow/Default.png", name: "伏眼默认", id: "CrossBrowDownDefault", x: 311, y: 332, width: 127, height: 41 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/DefaultBrow/Troubled.png", name: "默认困扰", id: "CrossBrowDefaultTroubled", x: 302, y: 333, width: 151, height: 31 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/DefaultBrow/Subtle.png", name: "默认微妙", id: "CrossBrowDefaultSubtle", x: 302, y: 339, width: 151, height: 10 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/DefaultBrow/Question.png", name: "默认疑问", id: "CrossBrowDefaultQuestion", x: 308, y: 312, width: 142, height: 44 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/DefaultBrow/Sharp.png", name: "默认锐利", id: "CrossBrowDefaultSharp", x: 306, y: 324, width: 140, height: 38 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Brows/DefaultBrow/Front.png", name: "默认正视", id: "CrossBrowDefaultFront", x: 310, y: 318, width: 128, height: 36 }
]);

rowList_init("眼睛（站立）", false, [
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/SlantEyes/Upper.png", name: "吊眼（上）", id: "CrossEyeSlantUpper", x: 303, y: 379, width: 150, height: 40 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/SlantEyes/Lower.png", name: "吊眼（下）", id: "CrossEyeSlantLower", x: 303, y: 379, width: 150, height: 40 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/GagEyes/Shock.png", name: "震惊眼", id: "CrossEyeGagShock", x: 310, y: 328, width: 134, height: 97 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/GagEyes/Line.png", name: "线眼", id: "CrossEyeGagLine", x: 309, y: 398, width: 133, height: 16 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/GagEyes/Smile.png", name: "微笑眼", id: "CrossEyeGagSmile", x: 314, y: 364, width: 121, height: 53 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/GagEyes/Blank.png", name: "空白眼", id: "CrossEyeGagBlank", x: 315, y: 368, width: 117, height: 52 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/ClosedEyes/Closed.png", name: "闭眼", id: "CrossEyeClosedClosed", x: 311, y: 391, width: 136, height: 26 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/ClosedEyes/Smile.png", name: "微笑", id: "CrossEyeClosedSmile", x: 309, y: 385, width: 135, height: 29 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DownEyes/Camera.png", name: "伏眼（看镜头）", id: "CrossEyeDownCamera", x: 303, y: 374, width: 148, height: 48 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DownEyes/Default.png", name: "伏眼（默认）", id: "CrossEyeDownDefault", x: 303, y: 374, width: 148, height: 48 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/AnnoyedEyes/Up.png", name: "嫌弃眼（上目）", id: "CrossEyeAnnoyedUp", x: 306, y: 365, width: 144, height: 60 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/AnnoyedEyes/Camera.png", name: "嫌弃眼（看镜头）", id: "CrossEyeAnnoyedCamera", x: 306, y: 365, width: 144, height: 60 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/AnnoyedEyes/Cat.png", name: "嫌弃眼（猫眼）", id: "CrossEyeAnnoyedCat", x: 306, y: 365, width: 144, height: 60 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/AnnoyedEyes/Wide.png", name: "嫌弃眼（睁大）", id: "CrossEyeAnnoyedWide", x: 306, y: 365, width: 144, height: 60 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/AnnoyedEyes/Sanpaku.png", name: "嫌弃眼（三白）", id: "CrossEyeAnnoyedSanpaku", x: 306, y: 365, width: 144, height: 60 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DefaultEyes/UpRoll.png", name: "默认眼（上目转圈）", id: "CrossEyeDefaultUpRoll", x: 304, y: 359, width: 147, height: 65 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DefaultEyes/Up.png", name: "默认眼（上目）", id: "CrossEyeDefaultUp", x: 304, y: 359, width: 147, height: 65 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DefaultEyes/DownRoll.png", name: "默认眼（下目转圈）", id: "CrossEyeDefaultDownRoll", x: 304, y: 359, width: 147, height: 65 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DefaultEyes/Down.png", name: "默认眼（下目）", id: "CrossEyeDefaultDown", x: 304, y: 359, width: 147, height: 65 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DefaultEyes/Camera.png", name: "默认眼（看镜头）", id: "CrossEyeDefaultCamera", x: 304, y: 359, width: 147, height: 65 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DefaultEyes/WideDot.png", name: "默认眼（睁大点眼）", id: "CrossEyeDefaultWideDot", x: 304, y: 359, width: 147, height: 65 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DefaultEyes/WideRoll.png", name: "默认眼（睁大转圈）", id: "CrossEyeDefaultWideRoll", x: 304, y: 359, width: 147, height: 65 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DefaultEyes/Wide.png", name: "默认眼（睁大）", id: "CrossEyeDefaultWide", x: 304, y: 359, width: 147, height: 65 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Eyes/DefaultEyes/Front.png", name: "默认眼（正视）", id: "CrossEyeDefaultFront", x: 304, y: 359, width: 147, height: 65 }
]);

rowList_init("嘴巴（站立）", false, [
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Gritted/Smirk2.png", name: "咬牙·坏笑2", id: "CrossMouthGritSmirk2", x: 352, y: 437, width: 48, height: 37 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Gritted/Smirk1.png", name: "咬牙·坏笑1", id: "CrossMouthGritSmirk1", x: 360, y: 448, width: 42, height: 19 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Gritted/Grit.png", name: "咬牙·咬牙", id: "CrossMouthGritGrit", x: 351, y: 454, width: 50, height: 15 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Gritted/Pout.png", name: "咬牙·嘟嘴", id: "CrossMouthGritPout", x: 345, y: 450, width: 21, height: 17 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Open/Dissatisfied2.png", name: "张嘴·不满2", id: "CrossMouthOpenDissatisfied2", x: 350, y: 451, width: 53, height: 17 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Open/Dissatisfied1.png", name: "张嘴·不满1", id: "CrossMouthOpenDissatisfied1", x: 355, y: 445, width: 35, height: 29 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Open/Cat.png", name: "张嘴·猫嘴", id: "CrossMouthOpenCat", x: 352, y: 439, width: 37, height: 33 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Open/SillySmile.png", name: "张嘴·傻笑", id: "CrossMouthOpenSillySmile", x: 355, y: 442, width: 43, height: 26 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Open/JaggedTeeth.png", name: "张嘴·锯齿牙", id: "CrossMouthOpenJaggedTeeth", x: 349, y: 437, width: 45, height: 41 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Open/LaughStrong.png", name: "张嘴·大笑", id: "CrossMouthOpenLaughStrong", x: 352, y: 441, width: 30, height: 34 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Open/FoolSmile.png", name: "张嘴·呆笑", id: "CrossMouthOpenFoolSmile", x: 359, y: 438, width: 46, height: 36 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Open/Laugh.png", name: "张嘴·笑", id: "CrossMouthOpenLaugh", x: 354, y: 438, width: 39, height: 34 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/Open/Dot.png", name: "张嘴·点嘴", id: "CrossMouthOpenDot", x: 363, y: 456, width: 11, height: 12 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/HalfOpen/Dissatisfied2.png", name: "半张·不满2", id: "CrossMouthHalfDissatisfied2", x: 355, y: 456, width: 41, height: 10 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/HalfOpen/Dissatisfied1.png", name: "半张·不满1", id: "CrossMouthHalfDissatisfied1", x: 357, y: 454, width: 33, height: 15 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/HalfOpen/FoolSmile.png", name: "半张·呆笑", id: "CrossMouthHalfFoolSmile", x: 370, y: 447, width: 25, height: 21 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/HalfOpen/Laugh.png", name: "半张·笑", id: "CrossMouthHalfLaugh", x: 358, y: 445, width: 35, height: 23 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/ClosedMouth/Wave.png", name: "闭嘴·波浪嘴", id: "CrossMouthClosedWave", x: 355, y: 455, width: 39, height: 5 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/ClosedMouth/Cat.png", name: "闭嘴·猫嘴", id: "CrossMouthClosedCat", x: 355, y: 448, width: 35, height: 12 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/ClosedMouth/TrembleLaugh.png", name: "闭嘴·颤笑", id: "CrossMouthClosedTrembleLaugh", x: 352, y: 445, width: 45, height: 20 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/ClosedMouth/Smile.png", name: "闭嘴·微笑", id: "CrossMouthClosedSmile", x: 361, y: 446, width: 24, height: 19 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/ClosedMouth/FoolSmile.png", name: "闭嘴·呆笑", id: "CrossMouthClosedFoolSmile", x: 373, y: 452, width: 19, height: 13 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/ClosedMouth/Laugh.png", name: "闭嘴·笑", id: "CrossMouthClosedLaugh", x: 357, y: 450, width: 35, height: 12 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/ClosedMouth/Dissatisfied2.png", name: "闭嘴·不满2", id: "CrossMouthClosedDissatisfied2", x: 359, y: 459, width: 32, height: 5 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/ClosedMouth/Dissatisfied1.png", name: "闭嘴·不满1", id: "CrossMouthClosedDissatisfied1", x: 365, y: 461, width: 16, height: 4 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/ClosedMouth/Pout.png", name: "闭嘴·嘟嘴", id: "CrossMouthClosedPout", x: 350, y: 457, width: 9, height: 8 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Mouth/ClosedMouth/Dot.png", name: "闭嘴·点嘴", id: "CrossMouthClosedDot", x: 366, y: 460, width: 5, height: 5 }
]);

rowList_init("脸颊（站立）", false, [
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Cheeks/BlushLines.png", name: "脸红斜线", id: "CrossCheeksBlushLines", x: 298, y: 399, width: 170, height: 58 },
    { img: "res/noyaZundamon/ArmsCrossed/Expression/Cheeks/Default.png", name: "默认", id: "CrossCheeksDefault", x: 311, y: 410, width: 132, height: 40 }
]);

rowList_init("汗（前倾）", true, [
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Sweat/Heavy.png", name: "瀑布汗", id: "LHipSweatHeavy", x: 174, y: 270, width: 157, height: 223 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Sweat/Normal.png", name: "通常汗", id: "LHipSweatNormal", x: 289, y: 452, width: 7, height: 10 }
]);

rowList_init("鼻（前倾）", false, [
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Nose/Shadow.png", name: "鼻阴影", id: "LHipNoseShadow", x: 193, y: 351, width: 53, height: 87 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Nose/Blush.png", name: "鼻脸红", id: "LHipNoseBlush", x: 195, y: 351, width: 28, height: 87 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Nose/Default.png", name: "鼻默认", id: "LHipNoseDefault", x: 193, y: 351, width: 39, height: 87 }
]);

rowList_init("眉毛（前倾）", false, [
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/ClosedBrow/Droop.png", name: "闭眼下垂", id: "LHipBrowClosedDroop", x: 174, y: 373, width: 141, height: 26 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/ClosedBrow/Sharp.png", name: "闭眼锐利", id: "LHipBrowClosedSharp", x: 177, y: 364, width: 133, height: 36 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/ClosedBrow/Front.png", name: "闭眼正视", id: "LHipBrowClosedFront", x: 179, y: 365, width: 129, height: 39 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/DownBrow/Troubled.png", name: "伏眼困扰", id: "LHipBrowDownTroubled", x: 173, y: 366, width: 142, height: 20 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/DownBrow/Sharp.png", name: "伏眼锐利", id: "LHipBrowDownSharp", x: 176, y: 349, width: 124, height: 41 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/DownBrow/Default.png", name: "伏眼默认", id: "LHipBrowDownDefault", x: 179, y: 345, width: 126, height: 40 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/DefaultBrow/Troubled.png", name: "默认困扰", id: "LHipBrowDefaultTroubled", x: 170, y: 346, width: 151, height: 31 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/DefaultBrow/Subtle.png", name: "默认微妙", id: "LHipBrowDefaultSubtle", x: 173, y: 351, width: 148, height: 11 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/DefaultBrow/Question.png", name: "默认疑问", id: "LHipBrowDefaultQuestion", x: 176, y: 324, width: 142, height: 44 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/DefaultBrow/Sharp.png", name: "默认锐利", id: "LHipBrowDefaultSharp", x: 174, y: 337, width: 140, height: 37 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Brows/DefaultBrow/Front.png", name: "默认正视", id: "LHipBrowDefaultFront", x: 178, y: 331, width: 128, height: 36 }
]);

rowList_init("眼睛（前倾）", false, [
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/SlantEyes/Upper.png", name: "吊眼（上）", id: "LHipEyeSlantUpper", x: 170, y: 391, width: 151, height: 41 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/SlantEyes/Lower.png", name: "吊眼（下）", id: "LHipEyeSlantLower", x: 170, y: 391, width: 151, height: 41 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/GagEyes/Shock.png", name: "震惊眼", id: "LHipEyeGagShock", x: 178, y: 340, width: 134, height: 98 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/GagEyes/Line.png", name: "线眼", id: "LHipEyeGagLine", x: 177, y: 410, width: 133, height: 16 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/GagEyes/Smile.png", name: "微笑眼", id: "LHipEyeGagSmile", x: 182, y: 377, width: 120, height: 52 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/GagEyes/Blank.png", name: "空白眼", id: "LHipEyeGagBlank", x: 183, y: 380, width: 117, height: 52 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/ClosedEyes/Closed.png", name: "闭眼", id: "LHipEyeClosedClosed", x: 179, y: 403, width: 135, height: 27 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/ClosedEyes/Smile.png", name: "微笑", id: "LHipEyeClosedSmile", x: 177, y: 398, width: 135, height: 28 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DownEyes/Camera.png", name: "伏眼（看镜头）", id: "LHipEyeDownCamera", x: 171, y: 386, width: 148, height: 48 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DownEyes/Default.png", name: "伏眼（默认）", id: "LHipEyeDownDefault", x: 171, y: 386, width: 148, height: 48 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/AnnoyedEyes/Up.png", name: "嫌弃眼（上目）", id: "LHipEyeAnnoyedUp", x: 174, y: 377, width: 144, height: 60 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/AnnoyedEyes/Camera.png", name: "嫌弃眼（看镜头）", id: "LHipEyeAnnoyedCamera", x: 174, y: 377, width: 144, height: 60 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/AnnoyedEyes/Cat.png", name: "嫌弃眼（猫眼）", id: "LHipEyeAnnoyedCat", x: 174, y: 377, width: 144, height: 60 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/AnnoyedEyes/Wide.png", name: "嫌弃眼（睁大）", id: "LHipEyeAnnoyedWide", x: 174, y: 377, width: 144, height: 60 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/AnnoyedEyes/Sanpaku.png", name: "嫌弃眼（三白）", id: "LHipEyeAnnoyedSanpaku", x: 174, y: 377, width: 144, height: 60 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DefaultEyes/UpRoll.png", name: "默认眼（上目转圈）", id: "LHipEyeDefaultUpRoll", x: 172, y: 371, width: 147, height: 65 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DefaultEyes/Up.png", name: "默认眼（上目）", id: "LHipEyeDefaultUp", x: 172, y: 371, width: 147, height: 65 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DefaultEyes/DownRoll.png", name: "默认眼（下目转圈）", id: "LHipEyeDefaultDownRoll", x: 172, y: 371, width: 147, height: 65 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DefaultEyes/Down.png", name: "默认眼（下目）", id: "LHipEyeDefaultDown", x: 172, y: 371, width: 147, height: 65 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DefaultEyes/Camera.png", name: "默认眼（看镜头）", id: "LHipEyeDefaultCamera", x: 172, y: 371, width: 147, height: 65 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DefaultEyes/WideDot.png", name: "默认眼（睁大点眼）", id: "LHipEyeDefaultWideDot", x: 172, y: 371, width: 147, height: 65 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DefaultEyes/WideRoll.png", name: "默认眼（睁大转圈）", id: "LHipEyeDefaultWideRoll", x: 172, y: 371, width: 147, height: 65 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DefaultEyes/Wide.png", name: "默认眼（睁大）", id: "LHipEyeDefaultWide", x: 172, y: 371, width: 147, height: 65 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Eyes/DefaultEyes/Front.png", name: "默认眼（正视）", id: "LHipEyeDefaultFront", x: 172, y: 371, width: 147, height: 65 }
]);

rowList_init("嘴巴（前倾）", false, [
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Gritted/Smirk2.png", name: "咬牙·坏笑2", id: "LHipMouthGritSmirk2", x: 220, y: 449, width: 48, height: 37 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Gritted/Smirk1.png", name: "咬牙·坏笑1", id: "LHipMouthGritSmirk1", x: 228, y: 460, width: 42, height: 19 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Gritted/Grit.png", name: "咬牙·咬牙", id: "LHipMouthGritGrit", x: 219, y: 467, width: 49, height: 14 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Gritted/Pout.png", name: "咬牙·嘟嘴", id: "LHipMouthGritPout", x: 213, y: 463, width: 21, height: 17 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Open/Dissatisfied2.png", name: "张嘴·不满2", id: "LHipMouthOpenDissatisfied2", x: 218, y: 464, width: 53, height: 17 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Open/Dissatisfied1.png", name: "张嘴·不满1", id: "LHipMouthOpenDissatisfied1", x: 223, y: 457, width: 35, height: 29 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Open/Cat.png", name: "张嘴·猫嘴", id: "LHipMouthOpenCat", x: 219, y: 451, width: 37, height: 34 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Open/SillySmile.png", name: "张嘴·傻笑", id: "LHipMouthOpenSillySmile", x: 223, y: 454, width: 43, height: 26 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Open/JaggedTeeth.png", name: "张嘴·锯齿牙", id: "LHipMouthOpenJaggedTeeth", x: 216, y: 449, width: 46, height: 41 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Open/LaughStrong.png", name: "张嘴·大笑", id: "LHipMouthOpenLaughStrong", x: 220, y: 454, width: 30, height: 34 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Open/FoolSmile.png", name: "张嘴·呆笑", id: "LHipMouthOpenFoolSmile", x: 227, y: 451, width: 46, height: 35 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Open/Laugh.png", name: "张嘴·笑", id: "LHipMouthOpenLaugh", x: 221, y: 450, width: 40, height: 34 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/Open/Dot.png", name: "张嘴·点嘴", id: "LHipMouthOpenDot", x: 230, y: 468, width: 12, height: 12 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/HalfOpen/Dissatisfied2.png", name: "半张·不满2", id: "LHipMouthHalfDissatisfied2", x: 223, y: 468, width: 41, height: 10 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/HalfOpen/Dissatisfied1.png", name: "半张·不满1", id: "LHipMouthHalfDissatisfied1", x: 225, y: 466, width: 33, height: 15 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/HalfOpen/FoolSmile.png", name: "半张·呆笑", id: "LHipMouthHalfFoolSmile", x: 238, y: 459, width: 25, height: 21 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/HalfOpen/Laugh.png", name: "半张·笑", id: "LHipMouthHalfLaugh", x: 226, y: 457, width: 34, height: 24 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/ClosedMouth/Wave.png", name: "闭嘴·波浪嘴", id: "LHipMouthClosedWave", x: 223, y: 467, width: 39, height: 5 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/ClosedMouth/Cat.png", name: "闭嘴·猫嘴", id: "LHipMouthClosedCat", x: 223, y: 460, width: 35, height: 12 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/ClosedMouth/TrembleLaugh.png", name: "闭嘴·颤笑", id: "LHipMouthClosedTrembleLaugh", x: 220, y: 457, width: 45, height: 20 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/ClosedMouth/Smile.png", name: "闭嘴·微笑", id: "LHipMouthClosedSmile", x: 228, y: 459, width: 25, height: 18 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/ClosedMouth/FoolSmile.png", name: "闭嘴·呆笑", id: "LHipMouthClosedFoolSmile", x: 241, y: 464, width: 19, height: 14 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/ClosedMouth/Laugh.png", name: "闭嘴·笑", id: "LHipMouthClosedLaugh", x: 225, y: 462, width: 35, height: 12 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/ClosedMouth/Dissatisfied2.png", name: "闭嘴·不满2", id: "LHipMouthClosedDissatisfied2", x: 227, y: 471, width: 32, height: 5 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/ClosedMouth/Dissatisfied1.png", name: "闭嘴·不满1", id: "LHipMouthClosedDissatisfied1", x: 233, y: 473, width: 16, height: 4 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/ClosedMouth/Pout.png", name: "闭嘴·嘟嘴", id: "LHipMouthClosedPout", x: 218, y: 469, width: 10, height: 10 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Mouth/ClosedMouth/Dot.png", name: "闭嘴·点嘴", id: "LHipMouthClosedDot", x: 233, y: 472, width: 6, height: 5 }
]);

rowList_init("脸颊（前倾）", false, [
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Cheeks/BlushLines.png", name: "脸红斜线", id: "LHipCheeksBlushLines", x: 166, y: 411, width: 170, height: 58 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Expression/Cheeks/Default.png", name: "默认", id: "LHipCheeksDefault", x: 178, y: 422, width: 132, height: 41 }
]);

rowList_init("身体", false, [
    { img: "res/noyaZundamon/ArmsCrossed/Body/SkinNormal.png", name: "抱臂·通常", id: "CrossBodySkinNormal", x: 216, y: 23, width: 544, height: 1459 },
    { img: "res/noyaZundamon/ArmsCrossed/Body/SkinDark.png", name: "抱臂·暗影", id: "CrossBodySkinDark", x: 216, y: 23, width: 544, height: 1459 },
    { img: "res/noyaZundamon/ArmsCrossed/Body/SkinBlush.png", name: "抱臂·脸红", id: "CrossBodySkinBlush", x: 216, y: 23, width: 544, height: 1459 },
    { img: "res/noyaZundamon/HandsOnHips/Body/SkinNormal.png", name: "叉腰·通常", id: "HipBodySkinNormal", x: 216, y: 23, width: 544, height: 1459 },
    { img: "res/noyaZundamon/HandsOnHips/Body/SkinDark.png", name: "叉腰·暗影", id: "HipBodySkinDark", x: 216, y: 23, width: 544, height: 1459 },
    { img: "res/noyaZundamon/HandsOnHips/Body/SkinBlush.png", name: "叉腰·脸红", id: "HipBodySkinBlush", x: 216, y: 23, width: 544, height: 1459 },
    { img: "res/noyaZundamon/LeanArmsDown/Body/Default.png", name: "前倾垂手·默认", id: "LDownBodyDefault", x: 114, y: 36, width: 626, height: 1444 },
    { img: "res/noyaZundamon/LeanArmsDown/Body/FaceShadow.png", name: "前倾垂手·脸阴影", id: "LDownBodyFaceShadow", x: 114, y: 36, width: 626, height: 1444 },
    { img: "res/noyaZundamon/LeanArmsDown/Body/FaceBlush.png", name: "前倾垂手·脸红", id: "LDownBodyFaceBlush", x: 114, y: 36, width: 626, height: 1444 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Body/Normal.png", name: "前倾叉腰·默认", id: "LHipBodyNormal", x: 114, y: 36, width: 626, height: 1444 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Body/Shadow.png", name: "前倾叉腰·阴影", id: "LHipBodyShadow", x: 114, y: 36, width: 626, height: 1444 },
    { img: "res/noyaZundamon/LeanHandsOnHips/Body/Blush.png", name: "前倾叉腰·脸红", id: "LHipBodyBlush", x: 114, y: 36, width: 626, height: 1444 }
]);


//默认：前倾叉腰 + 默认表情
selectItemByID("LHipNoseDefault");
selectItemByID("LHipBrowDefaultTroubled");
selectItemByID("LHipEyeSlantLower");
selectItemByID("LHipMouthOpenFoolSmile");
selectItemByID("LHipCheeksDefault");
//站立姿势也预选一套默认表情，切到站立时直接可用
selectItemByID("CrossNoseDefault");
selectItemByID("CrossBrowDefaultTroubled");
selectItemByID("CrossEyeSlantLower");
selectItemByID("CrossMouthOpenFoolSmile");
selectItemByID("CrossCheeksDefault");
selectItemByID("LHipBodyNormal");
actorHooks[nowActor](); //初始化姿势：切到前倾表情组
render();
