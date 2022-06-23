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
let box = []; //коробки для разбивания
let lvl = 0; //уровень игры



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

//функция движения шара----------------------------------------
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

//столкновение с краем игрового поля, меняет направление --------------------
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

//столкновение с коробками, меняет направление, убирает блок ------------------------------
function checkBox() {
    for (let i = 0; i < box.length; i++) {
        //колизия столкновение с коробкой
        if (((xPos + 5 >= box[i].x) && (xPos - 5 <= box[i].x + box[i].width)) && ((yPos + 5 >= box[i].y) && (yPos - 5 <= box[i].y + box[i].height))) {
            // изменение направления шара
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
                    if (yPos < box[i].y + box[i].height) direction = 7; //влево вверх
                    if (yPos > box[i].y + box[i].height) direction = 5; //вправо вниз
                    break;
                case 5: //вправо вниз
                    if (yPos > box[i].y) direction = 6; //влево вниз
                    if (yPos < box[i].y) direction = 4; //вправо вверх
                    break;
                case 6: //влево вниз
                    if (yPos > box[i].y) direction = 5; //вправо вниз
                    if (yPos < box[i].y) direction = 7; //влево вверх
                    break;
                case 7: //влево вверх
                    if (yPos < box[i].y + box[i].height) direction = 4; //вправо вверх
                    if (yPos > box[i].y + box[i].height) direction = 6; //влево вниз
                    break;
            }
            //убирает блок с поля
            box[i].y = - 500;
            box[i].id = 0; //разбитый блок
        }
    }
}
//---------------------------------------------------------------------------

//отрисовка кадра (основная функция потока игры)-------------------------------------------
function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHight); //очистить лист

    //Отрисовка шара
    ctx.beginPath(); //начало новой фигуры
    ctx.moveTo(xPos, yPos); //установка начальных координат
    ctx.lineTo(xPos, yPos); //установка координат для рисования
    ctx.strokeStyle = "black"; //цвет
    ctx.lineWidth = "20"; //размер шара
    ctx.lineCap = "round"; //форма края
    ctx.stroke(); //отрисовка фигуры

    //Отрисовка игрового блока
    ctx.beginPath(); //начало новой фигуры
    ctx.moveTo(xBlockStart, yBlock); //установка начальных координат
    ctx.lineTo(xBlockFinish, yBlock); //установка координат для рисования
    ctx.strokeStyle = "black"; //цвет
    ctx.lineWidth = "10"; //толщина блока
    ctx.lineCap = "round"; //форма края
    ctx.stroke(); //отрисовка фигуры

    //Отрисовка коробок для разбивания
    for (let i = 0; i < box.length; i++) {
        ctx.beginPath(); //начало новой фигуры
        ctx.moveTo(box[i].x, box[i].y); //установка начальных координат
        ctx.strokeStyle = "black"; //цвет
        ctx.lineWidth = "3"; //толщина лини
        ctx.lineCap = "round"; //форма края
        ctx.strokeRect(box[i].x, box[i].y, box[i].width, box[i].height);
    }

    //таймер потока (рекурсия основной функции игры) 
    drawTimer = setTimeout(draw, drawSpeed);

    drawFly(); //функция движения обьекта
    move(); //движение игровго блока
    change(); //проверка на столкновение с краем игрового поля
    check(); //проверка на столкновение с игровым блоком
    checkBox(); //проверка на столкновение с ломающимся блоком
    win(); //проверка на разбите всеx коробок (победа)
    loss(); //вылет шара с поля (проиграш)

}
//--------------------------------------------------------------------------------------

//вылет шара с поля (проиграш)------------------------------------------------
function loss() {
    if (yPos > canvasHight - 10) { //проверка на вылет за пределы поля
        clearTimeout(drawTimer); //остановка потока игры
        ctx.clearRect(0, 0, canvasWidth, canvasHight); //очистить лист
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.font = `35px Verdana`;
        ctx.fillText("You lost", canvasWidth / 2 - 80, canvasHight / 2); //текс вы проиграли
    }
}

//проверка на разбите всеx коробок (победа)-----------------------------------
function win() {
    let checkSUM = 0; //контрольная сумма
    for(let i = 0; i < box.length; i++){ //подсчитывает сумму ИД всех коробок
        checkSUM += box[i].id; 
    }
    if(checkSUM == 0){ //если сумма ИД  всех коробок = 0 коробки разбиты
        clearTimeout(drawTimer); //остановка потока игры
        ctx.clearRect(0, 0, canvasWidth, canvasHight); //очистить лист
        ctx.fillStyle = 'rgb(0, 255, 0)';
        ctx.font = `35px Verdana`;
        ctx.fillText("You win", canvasWidth / 2 - 80, canvasHight / 2); //текст вы выиграли
    }
}
//-----------------------------------------------------------------------------

//функция старта игры------------------------------------------------------------------------
document.querySelector(".btnStart").addEventListener("click", () => {
    clearTimeout(drawTimer); //останавливает поток текущей игры
    //сброс всех переменных к базовым значениям
    xPos = canvasWidth / 2; // стартовые координаты обьекта шара
    yPos = canvasHight - 20; // стартовые координаты обьекта шара
    xBlockStart = canvasWidth / 2 - 50; //координаты игрового блока
    xBlockFinish = canvasWidth / 2 + 50;; //координаты игрового блока
    yBlock = canvasHight - 5; //координаты игрового блока
    direction = Math.floor(4 * Math.random() + 4); //случайное направление движения 4-7
    speed = 5; //скорость движения шара
    lvl = 1; //уровень игры
    changeLVL(); //установки текущего уровня
    //Запуск основного потока игры
    draw();
});

//----------------------------------------------------------------------------------------

//установки уровня------------------------------------------------------------------------
function changeLVL() {
    if (lvl == 1) {
        box = [ // установка массив коробок для разбивания
            { x: 200, y: 200, width: 100, height: 100, id: 1 },
            { x: 350, y: 200, width: 100, height: 100, id: 1 },
            { x: 500, y: 200, width: 100, height: 100, id: 1 },
            { x: 650, y: 200, width: 100, height: 100, id: 1 },
            { x: 200, y: 350, width: 100, height: 100, id: 1 },
            { x: 350, y: 350, width: 100, height: 100, id: 1 },
            { x: 500, y: 350, width: 100, height: 100, id: 1 },
            { x: 650, y: 350, width: 100, height: 100, id: 1 }
        ];
    }
}
//---------------------------------------------------------------------------------------