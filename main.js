//デバッグにフラグ
const DEBUG = true;

let drawCount = 0;
let fps = 0;
let lastTIme = Date.now();

//スムージング
const SMOOTHING = false;

//ゲームスピード(ms)
//const GAME_SPEED = 1000/60; //60fps //requestAnimationFrameを使うと必要ない

//画面サイズ
const SCREEN_W = 320;
const SCREEN_H = 320;

//キャンバスサイズ
const CANVAS_W = SCREEN_W *2;
const CANVAS_H = SCREEN_H *2;

//フィールドサイズ
const FIELD_W = SCREEN_W + 120;
const FIELD_H = SCREEN_H + 40;

//星の数
const STAR_MAX = 300;

//キャンバス
let can = document.getElementById("can");
let con = can.getContext("2d");
can.width  = CANVAS_W;
can.height = CANVAS_H;
con.font = "20px 'Impact'";


//con.mozimageSmoothingEnable    = SMOOTHING;
//con.webkitimageSmoothingEnable = SMOOTHING;
con.imageSmoothingEnable       = SMOOTHING;

//フィールド(仮想画面)
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");
vcan.width  = FIELD_W;
vcan.height = FIELD_H;

//カメラの座標
let camera_x = 0;
let camera_y = 0;

//GAME OVERフラグ
let gameOver = false;
let score    = 0;

//星の実体
let star=[];

//キーボードの状態
let key=[];

//オブジェクト達
let teki = [];
let tama = [];
let jiki = new Jiki();
let teta =[];
let expl =[];

//teki[0] = new Teki(75, 200<<8, 200<<8, 0, 0);

//ファイルの読み込み(読み込みの確認処理が本来は必要)
let spriteImage = new Image();
spriteImage.src = "sprite.png";

//ゲーム初期化
function gameInit(){
    for(let i=0;i<STAR_MAX;i++) star[i]= new Star();
    //setInterval( gameLoop, GAME_SPEED ); //正確性を求めるならrequestAnimationFrmeを使う
    requestAnimationFrame(gameLoop);
}

//オブジェクトをアップデート
function updateObj(obj) {
    for(let i=obj.length-1;i>=0;i--){ //配列の途中が消失してズレるから、大きい番号から見ていく
        obj[i].update();
        if(obj[i].kill) obj.splice(i,1);
    }
    
}

//オブジェクトを描画
function drawObj(obj) {
    for(let i=0;i<obj.length;i++) obj[i].draw();
}

//移動の処理
function updateAll() {
    updateObj(star);
    updateObj(tama);
    updateObj(teta);
    updateObj(teki);
    updateObj(expl);
    if(!gameOver)jiki.update();
}

//描画の処理
function drawAll() {
    vcon.fillStyle=(jiki.damage)?"red":"black"; //ダメージがあれば赤く光らせる
    vcon.fillRect(camera_x,camera_y,SCREEN_W,SCREEN_H);

    drawObj(star);
    drawObj(tama);
    if(!gameOver)jiki.draw();
    drawObj(teta);
    drawObj(teki);
    drawObj(expl);


    //自機の範囲 0 ~ FIELD_W
   //カメラの範囲 0 ~ FIELD_W-SCREEN_W

    camera_x = (jiki.x>>8)/FIELD_W*(FIELD_W-SCREEN_W);
    camera_y = (jiki.y>>8)/FIELD_H*(FIELD_H-SCREEN_H);

    //仮想画面から実際の画面へ複製
    con.drawImage( vcan, camera_x, camera_y, SCREEN_W, SCREEN_H,
        0, 0, CANVAS_W, CANVAS_H);
}

//情報の表示
function putInfo() {
    con.fillStyle = "white";


    //GAME OVER画面
    if (gameOver) {
        let s = "GAME OVER";
        let w = con.measureText(s).width;
        let x = CANVAS_W/2 - w/2;
        let y = CANVAS_H/2 - 20;
        con.fillText(s,x,y);
        s = "Push 'R' key to restart!";
        w = con.measureText(s).width;
        x = CANVAS_W/2 - w/2;
        y = CANVAS_H/2 - 20+20;
        con.fillText(s,x,y);
    }

    //DEBUG画面
    if (DEBUG) {
        drawCount++;
        if(lastTIme + 1000 <= Date.now()){
            fps = drawCount;
            drawCount = 0;
            lastTIme = Date.now();
        }

        
        con.fillText("FPS:"+ fps, 20, 20);
        con.fillText("Tama:"+ tama.length, 20, 40);
        con.fillText("Teki:"+ teki.length, 20, 60);
        con.fillText("Teta:"+ teta.length, 20, 80);
        con.fillText("Expl:"+ expl.length, 20, 100);
        con.fillText("X:"+ (jiki.x>>8), 20, 120);
        con.fillText("Y:"+ (jiki.y>>8), 20, 140);
        con.fillText("HP:"+ jiki.hp, 20, 160);
        con.fillText("SCORE:"+ score, 20, 180);

    }
}

//ゲームループ
function gameLoop() {

    //敵の表示テスト
    if(rand(0,30) === 1){
        let r = rand(0,1);
        teki.push( new Teki(r, rand(0,FIELD_W)<<8, 0, 0, rand(300,1200)));
    }
    //移動の処理
    updateAll();

    //描画の処理
    drawAll();

    //デバッグ
    putInfo();
    requestAnimationFrame(gameLoop);
}

//オンロードでゲーム開始
window.onload=function () {
    gameInit();
}