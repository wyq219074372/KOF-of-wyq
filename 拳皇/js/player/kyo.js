import { Player } from "/拳皇/js/player/base.js";
import { GIF } from "/拳皇/js/utils/gif.js";

export class kyo extends Player {
    constructor(root, info){
        super(root, info);

        this.init_animations();
    }

    init_animations() {
        let outer = this;
        let offsets = [0, -22, -22, -140, 0, 0, 0];
        for (let i = 0; i < 7; i ++) {
            let gif = GIF();
            gif.load(`/拳皇/image/player/kyo/${i}.gif`);

            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,   // 总图片数
                frame_rate: 8,  // 每五帧过度一次
                offset_y: offsets[i],    // 偏移量
                loaded: false,  // 判断是否加载进来
                scale: 2.       // 缩放
            });

            gif.onload = function() {   // 更新状态
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;  //  数量 
                obj.loaded = true;

                if (i === 3) {
                    this.frame_rate = 4;
                }
            }
        }
    }
}