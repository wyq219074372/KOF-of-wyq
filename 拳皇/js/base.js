import { kyo } from '/拳皇/js/player/kyo.js';
import {GameMap} from '/拳皇/js/game_map/base.js';
//import { Player } from '/拳皇/js/player/base.js';

class KOF {
    constructor(id) {
        this.$kof = $('#' + id);
        console.log(11);
        this.game_map = new GameMap(this);
        this.Player = [ //创建两名角色
            new kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 150,
                height: 200,
                color: 'blue',
            }),
            
            new kyo(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 150,
                height: 200,
                color: 'red',
            }),
        ];
        console.log(22);
    }
}

export {
    KOF
}