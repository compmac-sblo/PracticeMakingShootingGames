//
//自機関連
//

//弾クラス
class Tama extends CharaBase {
    constructor( x, y, vx, vy){
        super(6, x, y, vx, vy);
        this.r = 4;
    }

    update(){
        super.update();

        for (let i = 0; i < teki.length; i++) {
            if (!teki[i].kill) {
                if (checkHit(this.x, this.y, this.r,
                    teki[i].x, teki[i].y, teki[i].r)) {
                        teki[i].kill = true;
                        this.kill = true;
                        explosion(teki[i].x,teki[i].y,teki[i].vx>>3,teki[i].vy>>3);
                         break;
                }
            }
            
        }
    }

    draw(){
        super.draw();
    }
}

//自機クラス
class Jiki{
    constructor(){
        this.x = (FIELD_W/2)<<8; //8bitシフトで固定小数点を使用して内部で1/256 pixel化
        this.y = (FIELD_H - 50)<<8; //8bitシフトで固定小数点を使用して内部で1/256 pixel化
        this.speed  = 512; //60fps 2p
        this.anime  = 0;
        this.reload = 0;
        this.relo2  = 0;
        this.r      = 10;
        this.damage = 0;
        this.muteki = 0;
        this.count  = 0;
    }
    //自機の移動
    update(){
        this.count++;
        if (this.damage) this.damage--; //毎フレームdamegeを減らす
        if (this.muteki) this.muteki--; //無敵時間をカウント
        if(key["Space"] && this.reload===0){
            tama.push(new Tama(this.x + (4<<8),this.y - (10<<8),  0,-2000));
            tama.push(new Tama(this.x - (4<<8),this.y - (10<<8),  0,-2000));
            tama.push(new Tama(this.x + (8<<8),this.y - (5<<8), 80,-2000));
            tama.push(new Tama(this.x - (8<<8),this.y - (5<<8),-80,-2000));
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
        if (this.muteki && (this.count&1))return;
        drawSprite(2 + (this.anime>>2), this.x, this.y); //4で割らずに2bitシフトで少数点を出さない
        if (this.count&1)return;
        drawSprite(9 + (this.anime>>2), this.x, this.y + (24<<8));
    }
}