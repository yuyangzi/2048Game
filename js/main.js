/**
 * Created by 王宜明 on 2017/3/5.
 */
var board = [],
    score = 0;

$(document).ready(function () {
    newGame();
})

/********绑定事件开始*******/
$("#newGameBtn").on("click", newGame);


/********绑定事件结束*******/






function newGame() {
    // 初始化棋盘格
    init();
    //在两个随机格子中生成数值
    generateOneNumber();
    generateOneNumber();
}

//初始化
function init() {
    //获取到每一个小格子.设置它们相应的位置.
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid_cell_" + i + "_" + j);
            gridCell.css({
                "top": getTop(i),
                "left": getLeft(j)
            })
        }
    }

    //初始化数组中所有的值为0
    for (var i = 0; i < 4; i++) {
        board[i] = [];
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
        }
    }

    updateBoardView();
}

//更新界面视图
function updateBoardView() {
    //移除所有class为"number_cell"的元素.
    $(".number_cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            //创建16个div元素.class为"number_cell",
            $(".grid_container").append('<div class="number_cell" id="number_cell_' + i + '_' + j + '"></div>')
            var $theNumberCell = $("#number_cell_" + i + "_" + j);

            //元素的值为0时的样式
            if (board[i][j] == 0) {
                $theNumberCell.css({
                    "width": "0px",
                    "height": "0px",
                    "top": getTop(i) + "50px",
                    "left": getLeft(j) + "50px"
                })
            } else {
                $theNumberCell.css({
                    "width": "100px",
                    "height": "100px",
                    "top": getTop(i),
                    "left": getLeft(j),
                    "background-color": getNumberBackgroundColor(board[i][j]),
                    "color": getNumberColr(board[i][j])
                });
                $theNumberCell.text(board[i][j]);
            }
        }
    }
}

function generateOneNumber() {
    if (nospace(board)) return false;

    // 随机一个位置
    var ranX = parseInt(Math.floor(Math.random() * 4));
    var ranY = parseInt(Math.floor(Math.random() * 4));
    while (true) {
        if (board[ranX][ranY] == 0) break;

        ranX = parseInt(Math.floor(Math.random() * 4));
        ranY = parseInt(Math.floor(Math.random() * 4));
    }

    //随机一个数
    var randNum = Math.random() < 0.5 ? 2 : 4;

    //在随机的位置上显示随机数
    board[ranX][ranY] == randNum;
    showNumberWithAnimation(ranX, ranY, randNum);

}