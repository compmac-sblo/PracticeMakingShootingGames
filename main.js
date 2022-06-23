//デバッグにフラグ
const DEBUG = true;

let drawCount = 0;
let fps = 0;
let lastTIme = Date.now();

//ゲームスピード(ms)
//const GAME_SPEED = 1000/60; //60fps //requestAnimationFrameを使うと必要ない

//画面サイズ
const SCREEN_W = 180;
const SCREEN_H = 320;

//キャンバスサイズ
const CANVAS_W = SCREEN_W *2;
const CANVAS_H = SCREEN_H *2;

//フィールドサイズ
const FIELD_W = SCREEN_W *2;
const FIELD_H = SCREEN_H *2;

//星の数
const STAR_MAX = 300;

//キャンバス
let can = document.getElementById("can");
let con = can.getContext("2d");
can.width  = CANVAS_W;
can.height = CANVAS_H;

//フィールド(仮想画面)
let vcan = document.createElement("canvas");
let vcon = vcan.getContext("2d");
vcan.width  = FIELD_W;
vcan.height = FIELD_H;

//カメラの座標
let camera_x = 0;
let camera_y = 0;

//星の実体
let star=[];

//キーボードの状態
let key=[];

//キーを押したとき
document.onkeydown = function (e) {
    key[e.code] = true;
}
//キーを離したとき
document.onkeyup = function (e) {
    key[e.code] = false;
}

//キャラクターの基本クラス
class CharaBase{
    constructor(snum, x,y,vx,vy){
        this.sn =  snum;
        this.x  =  x;
        this.y  =  y;
        this.vx = vx;
        this.vy = vy;
        this.kill = false;
    }

    update(){
        this.x += this.vx;
        this.y += this.vy;

        if( this.x<0 || this.x > FIELD_W<<8 || this.y<0 || this.y > FIELD_H<<8){ //8bitシフトしてあるのを忘れない
            this.kill = true; //FIELD外に出たら弾消し判定をON
        } 
    }

    draw(){
        drawSprite(this.sn,this.x,this.y);
    }
}


//敵クラス
class Teki extends CharaBase {
    constructor(snum, x, y, vx, vy){
        super(snum, x, y, vx, vy);
    }

    update(){
        super.update();
    }

    draw(){
        super.draw();
    }
}
let teki = [
    new Teki(39,200<<8,200<<8,0,0)
];

//弾クラス
class Tama extends CharaBase {
    constructor( x, y, vx, vy){
        super(5, x, y, vx, vy);
    }

    update(){
        super.update();
    }

    draw(){
        super.draw();
    }
}

let tama = [];

//自機クラス
class Jiki{
    constructor(){
        this.x = (FIELD_W/2)<<8; //8bitシフトで固定小数点を使用して内部で1/256 pixel化
        this.y = (FIELD_H/2)<<8; //8bitシフトで固定小数点を使用して内部で1/256 pixel化
        this.speed  = 512; //60fps 2p
        this.anime  = 0;
        this.reload = 0;
        this.relo2  = 0;
    }
    //自機の移動
    update(){
        if(key["Space"] && this.reload===0){
            tama.push(new Tama(this.x + (4<<8),this.y - (20<<8),  0,-2000));
            tama.push(new Tama(this.x - (4<<8),this.y - (20<<8),  0,-2000));
            tama.push(new Tama(this.x + (8<<8),this.y - (20<<8), 80,-2000));
            tama.push(new Tama(this.x - (8<<8),this.y - (20<<8),-80,-2000));
            this.reload = 4; //リロード時間を指定
            if(++this.relo2===4){ //弾の連射間隔を開ける
                this.reload = 20;
                this.relo2  =  0;
            }
        }
        if(!key["Space"])this.reload = this.relo2 = 0;
        if(this.reload>0)this.reload--;
        if(key["ArrowLeft"] && this.x>this.speed){ //FIELDの端より先に行かない
            this.x -= this.speed;
            if(this.anime>-8)this.anime--; //4fで
        } else if(key["ArrowRight"] && this.x<= (FIELD_W<<8)-this.speed){ //FIELDの端より先に行かない
            this.x += this.speed;
            if(this.anime<8)this.anime++; //4fで
        } else{
            if(this.anime>0)this.anime--; //戻す処理
            if(this.anime<0)this.anime++;
        }
        if(key["ArrowUp"] && this.y>this.speed)this.y -= this.speed; //FIELDの端より先に行かない
        
        if(key["ArrowDown"]  && this.y<= (FIELD_H<<8)-this.speed)this.y += this.speed; //FIELDの端より先に行かない
    }
    //自機の描画
    draw(){
        drawSprite(2 + (this.anime>>2), this.x, this.y); //4で割らずに2bitシフトで少数点を出さない
    }
}
let jiki = new Jiki();

//ファイルの読み込み(読み込みの確認処理が本来は必要)
let spriteImage = new Image();
spriteImage.src = "sprite.png";

//スプライトクラス
class Sprite{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

//スプライト
let sprite = [
    new Sprite(  0, 0,22,42), //0 自機 左2
    new Sprite( 23, 0,33,42), //1 自機 左1
    new Sprite( 57, 0,43,42), //2 自機 正面
    new Sprite(101, 0,33,42), //3 自機 右1
    new Sprite(135, 0,22,42), //4 自機 右2

    new Sprite(  0,50, 3, 7), //5 弾1
    new Sprite(  4,50, 5, 5), //6 弾2

    new Sprite(  3,42,16, 5 ),// 7,噴射 左2
	new Sprite( 29,42,21, 5 ),// 8,噴射 左1
	new Sprite( 69,42,19, 5 ),// 9,噴射 正面
	new Sprite(108,42,21, 5 ),//10,噴射 右1
	new Sprite(138,42,16, 5 ),//11,噴射 右2
	
	new Sprite( 11,50, 7, 7 ),//12,敵弾1-1
	new Sprite( 19,50, 7, 7 ),//13,敵弾1-2
	new Sprite( 32,49, 8, 8 ),//14,敵弾2-1
	new Sprite( 42,47,12,12 ),//15,敵弾2-2
	
	new Sprite(  5,351, 9, 9),//16  ,爆発1
	new Sprite( 21,346,20,20),//17  ,爆発2
	new Sprite( 46,343,29,27),//18  ,爆発3
	new Sprite( 80,343,33,30),//19  ,爆発4
	new Sprite(117,340,36,33),//20  ,爆発5
	new Sprite(153,340,37,33),//21  ,爆発6
	new Sprite(191,341,25,31),//22  ,爆発7
	new Sprite(216,349,19,16),//23  ,爆発8
	new Sprite(241,350,15,14),//24  ,爆発9
	new Sprite(259,350,14,13),//25  ,爆発10
	new Sprite(276,351,13,12),//26  ,爆発11
	
	new Sprite(  6,373, 9, 9),//27  ,ヒット1
	new Sprite( 19,371,16,15),//28  ,ヒット2
	new Sprite( 38,373,11,12),//29  ,ヒット3
	new Sprite( 54,372,17,17),//30  ,ヒット4
	new Sprite( 75,374,13,14),//31  ,ヒット5
	
	new Sprite(  4,62,24,27),	//32  ,黄色1
	new Sprite( 36,62,24,27),	//33  ,黄色2
	new Sprite( 68,62,24,27),	//34  ,黄色3
	new Sprite(100,62,24,27),	//35  ,黄色4
	new Sprite(133,62,24,27),	//36  ,黄色5
	new Sprite(161,62,30,27),	//37  ,黄色6
	
	new Sprite(  4,95,24,26),	//38  ,ピンク1
	new Sprite( 36,95,24,26),	//39  ,ピンク2
	new Sprite( 68,95,24,26),	//40  ,ピンク3
	new Sprite(100,95,24,26),	//41  ,ピンク4
	new Sprite(133,92,24,29),	//42  ,ピンク5
	new Sprite(161,95,30,26),	//43  ,ピンク6
	
	new Sprite(  4,125,24,29),	//44  ,青グラサン1
	new Sprite( 36,125,24,29),	//45  ,青グラサン2
	new Sprite( 68,125,24,29),	//46  ,青グラサン3
	new Sprite(100,125,24,29),	//47  ,青グラサン4
	new Sprite(133,124,24,30),	//48  ,青グラサン5
	new Sprite(161,125,30,29),	//49  ,青グラサン6
	
	new Sprite(  4,160,25,27),	//50  ,ロボ1
	new Sprite( 34,160,26,27),	//51  ,ロボ2
	new Sprite( 66,160,26,27),	//52  ,ロボ3
	new Sprite( 98,160,26,27),	//53  ,ロボ4
	new Sprite(132,160,26,27),	//54  ,ロボ5
	new Sprite(161,158,30,29),	//55  ,ロボ6
	
	new Sprite(  4,194,24,28),	//56  ,にわとり1
	new Sprite( 36,194,24,28),	//57  ,にわとり2
	new Sprite( 68,194,24,28),	//58  ,にわとり3
	new Sprite(100,194,24,28),	//59  ,にわとり4
	new Sprite(133,194,24,30),	//60  ,にわとり5
	new Sprite(161,194,30,28),	//61  ,にわとり6
	
	new Sprite(  4,230,22,26),	//62  ,たまご1
	new Sprite( 41,230,22,26),	//63  ,たまご2
	new Sprite( 73,230,22,26),	//64  ,たまご3
	new Sprite(105,230,22,26),	//65  ,たまご4
	new Sprite(137,230,22,26),	//66  ,たまご5
	
	new Sprite(  6,261,24,28),	//67  ,殻帽ヒヨコ1
	new Sprite( 38,261,24,28),	//68  ,殻帽ヒヨコ2
	new Sprite( 70,261,24,28),	//69  ,殻帽ヒヨコ3
	new Sprite(102,261,24,28),	//70  ,殻帽ヒヨコ4
	new Sprite(135,261,24,28),	//71  ,殻帽ヒヨコ5
	
	new Sprite(206, 58,69,73),	//72  ,黄色(中)
	new Sprite(204,134,69,73),	//73  ,ピンク(中)
	new Sprite(205,212,69,78),	//74  ,青グラサン(中)
	
	new Sprite(337,  0,139,147),//75  ,黄色(大)
	new Sprite(336,151,139,147),//76  ,ピンク(大)
	new Sprite(336,301,139,155),//77  ,青グラサン()
];

//スプライトを描画
function drawSprite(snum, x, y) { //spriteNumber
    let sx = sprite[snum].x;
    let sy = sprite[snum].y;
    let sw = sprite[snum].w;
    let sh = sprite[snum].h;

    let px = (x>>8) - sw/2; //8bitシフトしているので使う時には戻し、起点を中心にする
    let py = (y>>8) - sh/2; //8bitシフトしているので使う時には戻し、起点を中心にする

    if ( px + sw < camera_x || px > camera_x+SCREEN_W 
        || py + sh < camera_y || py > camera_y+SCREEN_H) return; //カメラ外は描画しない

    vcon.drawImage(spriteImage, sx, sy, sw, sh, px, py, sw, sh);
}

//整数の乱数を作る
function rand(min,max) {
    return Math.floor( Math.random()*(max-min+1) )+min;
}

//星のクラス
class Star //背景の星
{
    constructor()
    {
        this.x   = rand(0,FIELD_W)<<8; //下8bitに固定小数点を使用して内部で1/256 pixel化
        this.y  = rand(0,FIELD_H)<<8; //下8bitに固定小数点を使用して内部で1/256 pixel化
        this.vx  = 0;                  //Vector
        this.vy  = rand(30,200);       //Vector
        this.sz  = rand(1,2);
    }

    draw()
    {
        let x = this.x>>8; //8bitシフトしてあるので戻す
        let y = this.y>>8; //8bitシフトしてあるので戻す
        if ( x<camera_x || x>camera_x+SCREEN_W 
             || y<camera_y || y>camera_y+SCREEN_H) return; //カメラ外は描画しない
        vcon.fillStyle = rand(0,2) != 0 ? "#66f" : "#8af";
        vcon.fillRect(x,y,this.sz,this.sz); //表示のために固定小数点を丸めて整数に
    }

    update()
    {
        this.x += this.vx;
        this.y += this.vy;
        if( this.y>FIELD_H<<8 ) // 画面下に着いたなら、上に持って来る。yはシフトしているので揃える。
        {
            this.y = 0;
            this.x = rand(0,FIELD_W)<<8;
        }
    }

}



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
    updateObj(teki);

    jiki.update();
}

//描画の処理
function drawAll() {
    vcon.fillStyle="black";
    vcon.fillRect(camera_x,camera_y,SCREEN_W,SCREEN_H);

    drawObj(star);
    drawObj(tama);
    drawObj(teki);

    jiki.draw();

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
    if (DEBUG) {
        drawCount++;
        if(lastTIme + 1000 <= Date.now()){
            fps = drawCount;
            drawCount = 0;
            lastTIme = Date.now();
        }

        con.font = "20px 'Impact'";
        con.fillStyle = "white";
        con.fillText("FPS:"+ fps, 20, 20);
        con.fillText("Tama:"+ tama.length, 20, 40);
        con.fillText("Teki:"+ teki.length, 20, 60);

    }
}

//ゲームループ
function gameLoop() {
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