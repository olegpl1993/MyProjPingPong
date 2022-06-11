//адаптив и создание канваса
let cWidth = document.documentElement.clientWidth; //шырина екрана
let cHight = document.documentElement.clientHeight; //высота екрана
let mobileMod = false;
if (cWidth > 1000) {
    document.querySelector(".canvasBox").innerHTML = `<canvas id="canvas" width="1000px" height="${cHight - 52}px"></canvas>`;
}
else {
    document.querySelector(".canvasBox").innerHTML = `<canvas id="canvas" width="${cWidth}px" height="${cHight - 52}px"></canvas>`;
    mobileMod = true;
}
//----------------------------------------------------
let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");
//----------------------------------------------------
let canvasHight = cvs.clientHeight; //высота канваса
let canvasWidth = cvs.clientWidth; //шырина канваса
let drawTimer; //таймер игрового потока
let drawSpeed = 15; //скорость отрисовки в МС (ФПС)
let xPos; //координаты шара
let yPos; //координаты шара
let speed; //скорость движения шара
let xBlockStart; //координаты игрового блока
let xBlockFinish; //координаты игрового блока
let yBlock; //координаты игрового блока
let blockSpeed = 10; //скорость перемещения игрового блока
let direction; //направление движения
let moveRight, moveLeft; //движение игрового блока


//движение игрового блока ----------------------------------------------------
function move() {
    if (moveRight == true && xBlockFinish < canvasWidth) { //проверка нажатой кнопки и размера игрового поля
        xBlockStart += blockSpeed; //перемещение блока вправо
        xBlockFinish += blockSpeed; //перемещение блока вправо
    }
    if (moveLeft == true && xBlockStart > 0) { //проверка нажатой кнопки и размера игрового поля
        xBlockStart -= blockSpeed; //перемещение блока влево
        xBlockFinish -= blockSpeed; //перемещение блока влево
    }
}

//управление клавиатура ------------------------------------------------------------------
document.addEventListener("keydown", function keyboarddown(e) { //срабатывает при нажатии кнопки
    switch (e.code) {  // проверка нажатой кнопки
        case "ArrowRight": //вправо
            moveRight = true;
            break;
        case "ArrowLeft": //влево
            moveLeft = true;
            break;
    }
});
document.addEventListener("keyup", function keyboarddown(e) { //срабатывает при отпускании кнопки
    switch (e.code) {  // проверка отпущеной кнопки
        case "ArrowRight": //вправо
            moveRight = false;
            break;
        case "ArrowLeft": //влево
            moveLeft = false;
            break;
    }
});
//--------------------------------------------------------------------------------------------

//функция движения обьекта----------------------------------------
function drawFly() {
    switch (direction) {
        case 0:
            //вверх
            yPos = yPos - speed;
            break;
        case 1:
            //вправо
            xPos = xPos + speed;
            break;
        case 2:
            //вниз
            yPos = yPos + speed;
            break;
        case 3:
            //влево
            xPos = xPos - speed;
            break;
        case 4:
            //вправо вверх
            xPos = xPos + speed;
            yPos = yPos - speed;
            break;
        case 5:
            //вправо вниз
            xPos = xPos + speed;
            yPos = yPos + speed;
            break;
        case 6:
            //влево вниз
            xPos = xPos - speed;
            yPos = yPos + speed;
            break;
        case 7:
            //влево вверх
            xPos = xPos - speed;
            yPos = yPos - speed;
            break;
    }
};
//----------------------------------------------------------------------------

//столкновение с краем игрового поля, меняет направление--------------------
function change() {
    if (xPos < 10 || xPos > canvasWidth - 10 || yPos < 10 || yPos > canvasHight - 10) {
        switch (direction) {
            case 0: //вверх
                direction = 2; //вниз
                break;
            case 1: //вправо
                direction = 3; //влево
                break;
            case 2: //вниз
                direction = 0; //вверх
                break;
            case 3: //влево
                direction = 1; //вправо
                break;
            case 4: //вправо вверх
                if (yPos > 10) direction = 7; //влево вверх
                if (yPos < 10) direction = 5; //вправо вниз
                break;
            case 5: //вправо вниз
                if (yPos < canvasHight - 10) direction = 6; //влево вниз
                if (yPos > canvasHight - 10) direction = 4; //вправо вверх
                break;
            case 6: //влево вниз
                if (yPos < canvasHight - 10) direction = 5; //вправо вниз
                if (yPos > canvasHight - 10) direction = 7; //влево вверх
                break;
            case 7: //влево вверх
                if (yPos > 10) direction = 4; //вправо вверх
                if (yPos < 10) direction = 6; //влево вниз
                break;
        }
    }
}
//столкновение с игровым блоком, меняет направление--------------------
function check() {
    if (yPos > canvasHight - 20 && xPos > xBlockStart && xPos < xBlockFinish) {
        if (direction == 5) direction = 4; //вправо вверх
        if (direction == 6) direction = 7; //влево вверх
    }
}
//---------------------------------------------------------------------------

//отрисовка кадра (основная функция потока игры)-------------------------------------------
function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHight); //очистить лист

    //Отрисовка шара
    ctx.beginPath() //начало новой фигуры
    ctx.moveTo(xPos, yPos); //установка начальных координат
    ctx.lineTo(xPos, yPos); //установка координат для рисования
    ctx.strokeStyle = "black"; //цвет
    ctx.lineWidth = "20"; //размер шара
    ctx.lineCap = "round"; //форма края
    ctx.stroke(); //отрисовка фигуры

    //Отрисовка игрового блока
    ctx.beginPath() //начало новой фигуры
    ctx.moveTo(xBlockStart, yBlock); //установка начальных координат
    ctx.lineTo(xBlockFinish, yBlock); //установка координат для рисования
    ctx.strokeStyle = "black"; //цвет
    ctx.lineWidth = "10"; //толщина блока
    ctx.lineCap = "round"; //форма края
    ctx.stroke(); //отрисовка фигуры

    //таймер потока (рекурсия основной функции игры) 
    drawTimer = setTimeout(draw, drawSpeed);
    drawFly(); //функция движения обьекта
    move(); //движение игровго блока
    loss(); //вылет шара с поля (пропуск)
    change(); //проверка на столкновение с краем игрового поля
    check(); //проверка на столкновение с игровым блоком
}
//--------------------------------------------------------------------------------------

//вылет шара с поля (пропуск)
function loss() {
    if (yPos > canvasHight - 10) { //проверка на вылет за пределы поля
        clearTimeout(drawTimer); //остановка потока игры
        ctx.clearRect(0, 0, canvasWidth, canvasHight); //очистить лист
        //возврат обьектов на стартовы координаты
        xBlockStart = canvasWidth / 2 - 50; //координаты игрового блока
        xBlockFinish = canvasWidth / 2 + 50;; //координаты игрового блока
        yBlock = canvasHight - 5; //координаты игрового блока
        xPos = canvasWidth / 2; // стартовые координаты обьекта шара
        yPos = canvasHight - 20; // стартовые координаты обьекта шара

        //отрисовка фигур на стандартных координатах------------
        ctx.beginPath() //начало новой фигуры
        ctx.moveTo(xPos, yPos); //установка начальных координат
        ctx.lineTo(xPos, yPos); //установка координат для рисования
        ctx.lineWidth = "20"; //размер шара
        ctx.stroke(); //отрисовка фигуры
        ctx.beginPath() //начало новой фигуры
        ctx.moveTo(xBlockStart, yBlock); //установка начальных координат
        ctx.lineTo(xBlockFinish, yBlock); //установка координат для рисования
        ctx.lineWidth = "10"; //толщина блока
        ctx.stroke(); //отрисовка фигуры
    }
}

//функция старта игры------------------------------------------------------------------------
function startGame() {
    clearTimeout(drawTimer); //останавливает поток текущей игры
    //сброс всех переменных к базовым значениям
    xPos = canvasWidth / 2; // стартовые координаты обьекта шара
    yPos = canvasHight - 20; // стартовые координаты обьекта шара
    xBlockStart = canvasWidth / 2 - 50; //координаты игрового блока
    xBlockFinish = canvasWidth / 2 + 50;; //координаты игрового блока
    yBlock = canvasHight - 5; //координаты игрового блока
    direction = Math.floor(4 * Math.random() + 4); //случайное направление движения 4-7
    speed = 5; //скорость движения шара
    //Запуск основного потока игры
    draw();
};
//------------------------------------------------------------------------------------


startGame();