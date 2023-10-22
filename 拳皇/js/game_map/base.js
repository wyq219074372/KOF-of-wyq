import {AcGame} from '/拳皇/js/ac_game_object/base.js';
import { Controller } from '/拳皇/js/controller/base.js';

class GameMap extends AcGame { // 地图
    constructor(root){
        super();

        this.root = root;
        this.$canvas = $(`<canvas id="tutorial" width="1280" height="720" tabindex=0></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');//将canvas取出来 聚焦
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();

        this.controller = new Controller(this.$canvas);

        this.root.$kof.append($(`<div class="kof-head">
        <div class="kof-head-hp-0"><div><div></div></div></div>
        <div class="kof-head-timer">60</div>
        <div class="kof-head-hp-1"><div><div></div></div></div>
    </div>`));

        this.timer_left = 60000;   // 单位：毫秒
        this.$timer = this.root.$kof.find(".kof-head-timer");
    }

    start() {
        
    }

    update() {
        this.timer_left -= this.timedalta;
        console.log(this.timer_left)
        if (this.timer_left < 0) {
            this.timer_left = 0;
            
            let [a, b] = this.root.Player;              // 平局状态
            if (a.status !== 6 && b.status !== 6) {
                a.status = b.status = 6;
                a.frame_current_cnt = b.frame_current_cnt = 0;
                a.vx = b.vx = 0;
            }
        }

        this.$timer.text(parseInt(this.timer_left / 1000));

        this.render();//每一帧清空一次
    }

    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        //console.log(this.$canvas.width());
        // this.ctx.fillStyle = 'black';
        // this.ctx.fillRect(0, 0, this.$canvas.width(), this.$canvas.height());
    }
}

export {
    GameMap
}