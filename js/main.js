/**
 * Created by 王宜明 on 2017/3/5.
 */
var board = [],
    score = 0;

$(document).ready(function () {
    newGame();
})

function newGame() {
    // 初始化棋盘格
    init();
}

function init() {
    for (var i=0;i<4;i++) {
        for (var j=0;j<4;j++) {
            var gridCell = $("#grid_cell_"+i+"_"+j);
            gridCell.css({
                "top" : getTop(i),
                "left" : getLeft(j)
            })
        }
    }
}