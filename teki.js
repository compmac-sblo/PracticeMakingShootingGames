//
//敵関連
//

//敵弾クラス
class Teta extends CharaBase {

}

//敵クラス
class Teki extends CharaBase {
    constructor(snum, x, y, vx, vy){
        super(snum, x, y, vx, vy);

        this.flag = false;
    }

    update(){
        super.update();

        if(!this.flag){
            if (jiki.x > this.x && this.vx < 120) this.vx += 4; //横方向の自機へ近づく処理
            else if (jiki.x < this.x && this.vx > -120) this.vx -= 4; //横方向の自機へ近づく処理
        } else {
            if (jiki.x < this.x && this.vx < 400) this.vx += 30; //横方向の自機から逃げる処理
            else if (jiki.x > this.x && this.vx > -400) this.vx -= 30; //横方向の自機から逃げる処理
        }
        if(Math.abs(jiki.y-this.y) < (100<<8) && !this.flag){ //100pxまで近付いたらフラグを建てる
            this.flag = true;

            let an, dx, dy;
            an = Math.atan2(jiki.y-this.y, jiki.x-this.x); //ラジアンで弾の角度を求める

            an += rand(-10,10)*Math.PI/180; //弾のブレをラジアンで表現

            dx = Math.cos(an)*1000; //横方向のベクトル
            dy = Math.sin(an)*1000; //縦方向のベクトル

            teta.push( new Teta( 15, this.x, this.y, dx, dy));
        }
        if (this.flag && this.vx > -800) this.vy -= 30; //縦方向の逃げる処理
        
    }

    draw(){
        super.draw();
    }
}