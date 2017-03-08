/**
 * Created by 王宜明 on 2017/3/5.
 */
var board = [],
    hasConflicted = [],
    score = 0,
    startX,
    startY,
    endX,
    endY;

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
    var i = 0,j = 0;
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
                    "width": "0",
                    "height": "0",
                    "top": getTop(i) + '5rem',
                    "left": getLeft(j) + '5rem'
                })
            } else {
                //元素值不为0时的样式.
                $theNumberCell.css({
                    "width": "10rem",
                    "height": "10rem",
                    "top": getTop(i) + "rem",
                    "left": getLeft(j) + "rem",
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
    var ran = [];
    //获取所有的空格,并传入数组ran中.
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                var XY = [i, j];
                ran.push(XY);
            }
        }
    }
    // 随机一个位置
    var randomNumber = parseInt(Math.floor(Math.random() * ran.length));
    ranX = ran[randomNumber][0];
    ranY = ran[randomNumber][1];

    //随机一个数
    var randNum = Math.random() < 0.5 ? 2 : 4;

    //在随机的位置上显示随机数
    board[ranX][ranY] = randNum;
    showNumberWithAnimation(ranX, ranY, randNum);

}

//给页面绑定"keydown"事件.使其按下方向键时执行对应操作.
$(document).on("keydown", function (event) {
    event.preventDefault();
    switch (event.keyCode) {
        case 37: //left
            event.preventDefault();
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
            break;
        case 38: //top
            event.preventDefault();
            if (moveTop()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
            break;
        case 39: //right
            event.preventDefault();
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
            break;
        case 40: //down
            event.preventDefault();
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
            break;
        default:
            break;
    }
});

//针对移动端的触摸事件.进行配置.
document.addEventListener("touchstart", function (event) {
    startX = event.touches[0].pageX;
    startY = event.touches[0].pageY;
});

// document.addEventListener("touchmove", function (event) {
//     event.preventDefault();
// })

document.addEventListener("touchend", function (event) {
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;

    var subtractX = endX - startX;
    var subtractY = endY - startY;

    if (Math.abs(subtractX) < 10 && Math.abs(subtractY) < 10) return;

    if (Math.abs(subtractX) >= Math.abs(subtractY)) {
        if (subtractX > 0) {
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
        } else {
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
        }
    } else {
        if (subtractY > 0) {
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
        } else {
            if (moveTop()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 500);
            }
        }
    }
});

//判断是否结束游戏.
function isGameOver() {
    if (nospace(board) && nomove(board)) {
        gameOver();
    }
}

//结束游戏
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