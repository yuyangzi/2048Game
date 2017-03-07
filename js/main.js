/**
 * Created by 王宜明 on 2017/3/5.
 */
var board = [];
var score = 0;
var hasConflicted = [];

$(document).ready(function () {
    newGame();
});

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
    var i = 0;
    var j = 0;
    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            var gridCell = $("#grid_cell_" + i + "_" + j);
            gridCell.css({
                "top": getTop(i),
                "left": getLeft(j)
            })
        }
    }

    //初始化数组中所有的值为0
    for (i = 0; i < 4; i++) {
        board[i] = [];
        hasConflicted[i] = [];
        for (j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    score = 0;
    updateBoardView();
}

//更新界面视图
function updateBoardView() {
    //移除所有class为"number_cell"的元素.
    $(".number_cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            //创建16个div元素.class为"number_cell",
            $(".grid_container").append('<div class="number_cell" id="number_cell_' + i + '_' + j + '"></div>');
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
                //元素值不为0时的样式.
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
            hasConflicted[i][j] = false;
        }
    }
}

//在随机的位置上生成(2 || 4)随机数
function generateOneNumber() {
    if (nospace(board)) return false;

    // 随机一个位置
    var ranX = parseInt(Math.floor(Math.random() * 4));
    var ranY = parseInt(Math.floor(Math.random() * 4));
    var times = 0;
    while (times < 50) {
        if (board[ranX][ranY] === 0) break;

        ranX = parseInt(Math.floor(Math.random() * 4));
        ranY = parseInt(Math.floor(Math.random() * 4));

        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
                if (board[i][j] == 0) {
                    ranX = i;
                    ranY = j;
                }
            }
        }
    }

    //随机一个数
    var randNum = Math.random() < 0.5 ? 2 : 4;

    //在随机的位置上显示随机数
    board[ranX][ranY] = randNum;
    console.log(board[ranX][ranY]);
    showNumberWithAnimation(ranX, ranY, randNum);

}

//给页面绑定"keydown"事件.使其按下方向键时执行对应操作.
$(document).on("keydown", function (event) {
    /* Act on the event */
    switch (event.keyCode) {

        case 37: //left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
            break;
        case 38: //top
            if (moveTop()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
            break;
        case 39: //right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
            break;
        case 40: //down
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
            break;
        default:
            break;
    }
});


function isGameOver() {
    if (nospace(board) && nomove(board)) {
        gameOver();
    }
}

function gameOver() {
    alert("gameOver");
    newGame();
}

function moveLeft() {
    //判断是否能够移动.
    if (!canMoveLeft(board)) return false;

    //从左向右依次判断是否有格子可以向左移动.如果有则先移动,再进行下一次迭代
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                //循环判断要移动格子的方向前的其它格子
                for (var k = 0; k < j; k++) {
                    //判断其它格子的数值是否为0,且两者之间是否有障碍物.
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        // continue;
                        //判断其它格子的数值与要移动的格子的数值是否相等,且两者之间是否有障碍物.
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        // continue
                    }
                }
            }
        }
    }

    setTimeout(updateBoardView, 200);
    return true;
}


function moveRight() {
    //判断是否能够移动.
    if (!canMoveRight(board)) return false;

    //从右向左依次判断是否有格子可以向右移动.如果有则先移动,再进行下一次迭代
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                //循环判断要移动格子的方向前的其它格子
                for (var k = 3; k > j; k--) {
                    //判断其它格子的数值是否为0,且两者之间是否有障碍物.
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;

                        // continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //判断其它格子的数值与要移动的格子的数值是否相等,且两者之间是否有障碍物.
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        hasConflicted[i][k] = true;
                        updateScore(score);
                        // continue;
                    }
                }
            }
        }
    }

    setTimeout(updateBoardView, 200);
    return true;
}


function moveTop() {
    //判断是否能够移动.
    if (!canMoveTop(board)) return false;

    //从上向下依次判断是否有格子可以向上移动.如果有则先移动,再进行下一次迭代
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                //循环判断要移动格子的方向前的其它格子
                for (var k = 0; k < i; k++) {
                    //判断其它格子的数值是否为0,且两者之间是否有障碍物.
                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;

                        // continue;
                        //判断其它格子的数值与要移动的格子的数值是否相等,且两者之间是否有障碍物.
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        hasConflicted[k][j] = true;
                        updateScore(score);
                        // continue
                    }
                }
            }
        }
    }

    setTimeout(updateBoardView, 200);
    return true;
}


function moveDown() {
    //判断是否能够移动.
    if (!canMoveDown(board)) return false;

    //从下向上依次判断是否有格子可以向下移动.如果有则先移动,再进行下一次迭代
    for (var i = 2; i >= 0; i--) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                //循环判断要移动格子的方向前的其它格子
                for (var k = 3; k > i; k--) {
                    //判断其它格子的数值是否为0,且两者之间是否有障碍物.
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        // continue;
                        //判断其它格子的数值与要移动的格子的数值是否相等,且两者之间是否有障碍物.
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        hasConflicted[k][j] = true;
                        updateScore(score);
                        // continue
                    }
                }
            }
        }
    }

    setTimeout(updateBoardView, 200);
    return true;
}