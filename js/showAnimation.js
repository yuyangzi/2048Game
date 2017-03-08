/**
 * Created by 王宜明 on 2017/3/5.
 */
//设置小格子显示数字时的动画效果.
function showNumberWithAnimation(i, j, randNum) {
    //获取要传入数字的小格子
    var $theNumberCell = $("#number_cell_" + i + "_" + j);
    // 设置小格子样式并传入数值
    $theNumberCell.css({
        "background-color": getNumberBackgroundColor(randNum),
        "color": getNumberColr(randNum)
    });
    $theNumberCell.text(randNum);

    //设置动画效果
    $theNumberCell.animate({
        "width": "10rem",
        "height": "10rem",
        "top": getTop(i) +"rem",
        "left": getLeft(j) +"rem"
    }, 100);

}

//设置格子移动动画效果
function showMoveAnimation(fromX, fromY, toX, toY) {
    var $theNumberCell = $("#number_cell_" + fromX + "_" + fromY);
    $theNumberCell.animate({
        "top": getTop(toX) + "rem",
        "left": getLeft(toY) + "rem"
    }, 200)
}

//显示分数
function updateScore(score) {
    $("#score_number").text(score);
}