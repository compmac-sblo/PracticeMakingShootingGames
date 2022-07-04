//
//敵関連
//

//敵弾クラス
class Teta extends CharaBase {

    constructor(tnum,x,y,vx,vy){
        super(0,x,y,vx,vy);
        this.r = 4;
        this.tnum = tnum;

    }
    update(){
        super.update();

        if (!gameOver && !jiki.muteki && checkHit(this.x, this.y, this.r,
            jiki.x, jiki.y, jiki.r)) { //自機の当たり判定
                this.kill   = true;
                if((jiki.hp -= 30) <= 0){
                    gameOver = true;
                } else {
                    jiki.damage = 10; 
                    jiki.muteki = 60; 
                }
        }
        this.sn = 14 + ((this.count>>3)&1);
    }

}

//敵クラス
class Teki extends CharaBase {
    constructor(tnum, x, y, vx, vy){
        super(0, x, y, vx, vy);
        this.tnum = tekiMaster[tnum].tnum;
        this.r    = tekiMaster[tnum].r;
        this.hp   = tekiMaster[tnum].hp;
        this.score= tekiMaster[tnum].score;
        this.flag = false;
        
    }

    update(){
        super.update(); //共通のアップデート

        //個別のアップデート
        tekiFunc[this.tnum](this);
        

        
        
    }

}

//自機に向けて弾を発射する
function tekiShot(obj,speed) {
    if(gameOver)return;
    let an, dx, dy;
    an = Math.atan2(jiki.y-obj.y, jiki.x-obj.x); //ラジアンで弾の角度を求める

    //an += rand(-10,10)*Math.PI/180; //弾のブレをラジアンで表現

    dx = Math.cos(an)*speed; //横方向のベクトル
    dy = Math.sin(an)*speed; //縦方向のベクトル

    teta.push( new Teta( 15, obj.x, obj.y, dx, dy));
    
}

//ピンクのひよこの移動パターン
function tekiMove01(obj) {
    if(!obj.flag){
        if (jiki.x > obj.x && obj.vx < 120) obj.vx += 4; //横方向の自機へ近づく処理
        else if (jiki.x < obj.x && obj.vx > -120) obj.vx -= 4; //横方向の自機へ近づく処理
    } else {
        if (jiki.x < obj.x && obj.vx < 400) obj.vx += 30; //横方向の自機から逃げる処理
        else if (jiki.x > obj.x && obj.vx > -400) obj.vx -= 30; //横方向の自機から逃げる処理
    }
    if(Math.abs(jiki.y-obj.y) < (100<<8) && !obj.flag){ //100pxまで近付いたらフラグを建てる
        obj.flag = true;

       tekiShot(obj,600);
    }
    if (obj.flag && obj.vx > -800) obj.vy -= 30; //縦方向の逃げる処理

    //スプライトの変更
    const ptn = [39,40,39,41];
    obj.sn = ptn[(obj.count>>3)&3];
}

//黄色いひよこの移動パターン
function tekiMove02(obj) {
    if(!obj.flag){
        if (jiki.x > obj.x && obj.vx <6000) obj.vx += 4; //横方向の自機へ近づく処理
        else if (jiki.x < obj.x && obj.vx > -600) obj.vx -= 4; //横方向の自機へ近づく処理
    } else {
        if (jiki.x < obj.x && obj.vx < 600) obj.vx += 30; //横方向の自機から逃げる処理
        else if (jiki.x > obj.x && obj.vx > -600) obj.vx -= 30; //横方向の自機から逃げる処理
    }
    if(Math.abs(jiki.y-obj.y) < (100<<8) && !obj.flag){ //100pxまで近付いたらフラグを建てる
        obj.flag = true;

        tekiShot(obj,600);
    }

    //スプライトの変更
    const ptn = [33,34,34,35];
    obj.sn = ptn[(obj.count>>3)&3];
}

let tekiFunc = [
    tekiMove01,
    tekiMove02
];