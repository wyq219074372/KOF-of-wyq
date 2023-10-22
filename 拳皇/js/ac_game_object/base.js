let AC_GAME = [];

class AcGame {
    constructor() {
        AC_GAME.push(this);
        this.timedalta = 0;
        this.has_call_start = false;//判断是否执行过
    }

    start (){ // 初始执行一次

    }

    update(){ // 每一帧执行一次（除了第一次）

    }

    destroy() { // 删除当前对象
        for (let i in AC_GAME) {
            if (AC_GAME[i] === this) {
                AC_GAME.splice(i, 1);//删除一个元素
                break;
            }
        }
    }
}

let last_timestamp;

let AC_GAME_FRAME = function(timestamp) {
    for (let obj of AC_GAME) {
        if (!obj.has_call_start){//判断是否执行过
            obj.start();
            obj.has_call_start = true;
        }else {
            obj.timedalta = timestamp - last_timestamp;
            obj.update();
        }
    }

    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_FRAME);
}

requestAnimationFrame(AC_GAME_FRAME);

export {
    AcGame
}