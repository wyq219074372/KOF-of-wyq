import { AcGame } from "/拳皇/js/ac_game_object/base.js";

export class Player extends AcGame {    //  角色
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;//定义方向  1为朝右该值与vx乘机来判断正反

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400; // 水平速度
        this.speedy = -1500; // 跳起初始速度

        this.gravity = 40; //重力

        this.ctx =this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.status = 3;//状态 0: idle, 1: 向前，2：向后，3：跳跃，4：攻击，5：被打，6：死亡
        this.animations = new Map();
        this.frame_current_cnt = 0; // 计数器

        this.hp = 100;  // 血量
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);   // 找到血条
        this.$hp_div = this.$hp.find('div');
    }

    start() {

    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        } else {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        //  不实现跳跃攻击!!!
        if (this.status === 0 || this.status === 1 || this.status == 2) {
            if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    update_move() {    // 移动
        this.vy += this.gravity;
        
        this.x += this.vx * this.timedalta / 1000;//timedelta是每两帧之间的时间间隔，毫秒
        this.y += this.vy * this.timedalta / 1000;

        if (1){
        //  添加不重叠功能（待开发！！！）
        /*       
        let [a, b] = this.root.Player;
        if (a !== this) [a, b] = [b, a];
        let r1 = {
            x1: a.x,
            y1: a.y,
            x2: a.x + a.width,
            y2: a.y + a.height,
        };
        let r2 = {
            x1: b.x,
            y1: b.y,
            x2: b.x + b.width,
            y2: b.y + b.height,
        };

        if (this.is_collision(r1, r2)){
            b.x -= this.vx * this.timedalta / 1000 / 2;//timedelta是每两帧之间的时间间隔，毫秒
            b.y -= this.vy * this.timedalta / 1000 / 2;
            a.x -= this.vx * this.timedalta / 1000 / 2;
            a.y -= this.vy * this.timedalta / 1000 / 2;
            if (this.status === 3) this.status = 0; //  在空中时添加重力 
        }
        */
    }

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;
            if (this.status === 3) this.status = 0; //  在空中时添加重力 
        }

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }

        
    }

    update_direction() {
        if (this.status === 6) return ; // 倒地后停止反转图片 

        let players = this.root.Player;
        if (players[0] && players[1]) {   // 做对称
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    is_attack() {   // 被攻击到  更新状态
        if (this.status === 6) return ; // 倒地停止更新 

        this.status = 5;
        this.frame_current_cnt = 0;

        this.hp = Math.max(this.hp - 10, 0);    // 每次攻击值


        this.$hp_div.animate({
            width: this.$hp.parent().width() * this.hp / 100    // 渐变效果 拖影效果
        }, 300);
        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100   
        }, 800);

        this.$hp.width(this.$hp.parent().width() * this.hp / 100);  // 改变血量条 

        if (this.hp <= 0) { // 扣血量
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }

    is_collision(r1, r2) {  // 判断是否碰撞
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 25) {   //判断攻击在第几帧
            let me = this, you = this.root.Player[1 - this.id];
            let r1;
            if (this.direction > 0) {   // 拳头小方块
                r1 = {
                    x1: me.x + 205,
                    y1: me.y + 40,
                    x2: me.x + 205 + 20,
                    y2: me.y + 40 + 20,
                };
            } else {
                r1 = {
                    x1: me.x - 225 + me.width,
                    y1: me.y + 40,
                    x2: me.x - 225 + me.width + 20,
                    y2: me.y + 40 + 20,
                };
            }

            let r2 = {      // 整个人物的大矩形
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };

            if (this.is_collision(r1, r2)) {    // 判断是否攻击到
                you.is_attack();
            }
        };

        
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();

        this.render();
    }

    render() {
        // this.ctx.fillStyle = 'bule';
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);

        // if (this.direction > 0) {
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x + 205, this.y + 40, 20, 20);
        // } else {
        //     this.ctx.fillStyle = 'red';
        //     this.ctx.fillRect(this.x - 225 + this.width, this.y + 40, 20, 20);
        // }
        

        let status = this.status;   // 状态

        if (this.status === 1 && this.direction * this.vx < 0) { // 判断前进还是后退
            this.status = 2;
        }

        let obj = this.animations.get(status);
        if (obj && obj.loaded) {    // 存在并渲染出来
            if (this.direction > 0){
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {                            // 反转 
                this.ctx.save();    // 保存配置
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0); // 反转

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();     // 变回来 
            }
        }

        if (status === 4 || status === 5 || status === 6 || status === 2) {
            if (parseInt(this.frame_current_cnt / obj.frame_rate) === obj.frame_cnt - 1) {
                if (status === 6) {
                    this.frame_current_cnt -- ; // 倒地后最后一帧循环播放
                } else {
                    this.status = 0;    // 停下来
                    this.vx = 0;
                }
            }
            
        }

        this.frame_current_cnt ++;  // 计数器加一
    }
}

