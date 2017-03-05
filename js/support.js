/**
 * Created by 王宜明 on 2017/3/5.
 */
//判断元素的top值
function getTop(i) {
    return 20 + i * 120 + "px";
}

//判断元素的left值
function getLeft(j) {
    return 20 + j * 120 + "px";
}

//根据元素的数值设置背景颜色
function getNumberBackgroundColor(num) {
    switch (num) {
        case 2 :
            return "#eee4ad";
            braek;
        case 4 :
            return "#ede0c8";
            braek;
        case 8 :
            return "#f2b179";
            braek;
        case 16 :
            return "#f56593";
            braek;
        case 32 :
            return "#f67c5f";
            braek;
        case 64 :
            return "#f65e3b";
            braek;
        case 128 :
            return "#edcf72";
            braek;
        case 256 :
            return "#edcc61";
            braek;
        case 512 :
            return "#99cc00";
            braek;
        case 1024 :
            return "#33b5e5";
            braek;
        case 2048 :
            return "#aa88ee";
            braek;
        case 4096 :
            return "#66cc34";
            braek;
        case 8192 :
            return "#224ac9";
            braek;
    }
    return "black";
}

//根据元素的数值设置字体颜色.
function getNumberColr(num) {
    if (num <= 4) {
        return "#776e65";
    } else {
        return "#fff";
    }
}

function nospace(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) return false;
        }
    }

    return true;
}