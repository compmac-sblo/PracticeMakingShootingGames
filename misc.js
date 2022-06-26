//
//その他、共通のもの
//

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
        vcon.fillStyle = rand(0,2) != 0 ? "#66f" : "#aef";
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

