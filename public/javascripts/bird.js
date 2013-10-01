var FPS = 60;

var scale = 1;

var currentFPS = 0;

var currentScene = {};

var requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback, 1000 / FPS);
        };
})();

var screen = document.getElementById('screen');

var loggerValues = [];

var keysPushed = [];

var mouseClicked = [];

var mousePos = { x: 0, y: 0};

document.onkeydown = document.onkeyup = function (e) {
    e = e || event; // to deal with IE

    keysPushed[e.keyCode] = e.type == 'keydown';
    //sendToLogger("KEYS PUSHED: ", keysPushed);
}

window.onmousemove = function (event) {
    event = event || window.event; // IE-ism
    mousePos = {
        x: event.pageX,
        y: event.pageY
    };
};

document.oncontextmenu=RightMouseDown;
function RightMouseDown() { return false;}


document.onmousedown = function (event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    mouseClicked.push(event.which || event.keyCode);

    mouseDown = true;
    sendToLogger("mouse down? = ", mouseDown + " keys: " + mouseClicked);
};

document.onmouseup = function (event) {

    mouseDown = false;
    mouseClicked = [];
    sendToLogger("mouse down? = ", mouseDown);

};



var FPSmeter = setInterval(function(){
    sendToLogger("FPS: ", currentFPS);
    currentFPS = 0;

}, 1000);




//this function sends values to log

function sendToLogger(name, value){
    var loggerContainer = document.getElementById('screenLogger');
    loggerContainer.innerHTML = "";
    var loggerValue = {name: name, value: value};
    var exists = false;
    loggerValues.forEach(function(logValue){
        var cellLogger = document.createElement('p');
        cellLogger.innerHTML = logValue.name + ": " + logValue.value;
        loggerContainer.appendChild(cellLogger);
        if(logValue.name == loggerValue.name){
            exists = true;
            logValue.value = loggerValue.value;

        }

    });
    if (exists == false){


        loggerValues.push(loggerValue);

    }


}

////CLASS OBJECT
//function Object(name, type, position, size){
//
//    this.name = name;
//    this.type = type;
//    this.top = function(){return this.y};
//    this.bottom = function(){return (this.y + this.height)};
//    this.left = function(){return this.x};
//    this.right = function(){return (this.x + this.width)};
//    this.vx = 0;
//    this.vy = 0;
//    this.render = function(ctx){
//
//        ctx.beginPath();
//        ctx.rect(this.x * scale, this.y * scale, this.width * scale, this.height * scale);
//        ctx.fillStyle = 'yellow';
//        ctx.fill();
//        ctx.lineWidth = 2;
//        ctx.strokeStyle = 'black';
//        ctx.stroke();
//
//    }
//
//}

//CLASS SCENE
function Scene(name, width, height){


    this.name = name;
    this.width = width;
    this.height = height;
    this.objects = [];
    this.container = {};
    this.redraw = function(dt){
        var delay = dt;


    };
    this.render = function(){
        sendToLogger("Objects to update: ", objectList);
        var ctx = this.container.getContext("2d");
        ctx.clearRect(0, 0, this.container.width, this.container.height);
        ctx.drawImage(resources.get('images/look_from_another_planet_by_johndoop-d5ezloz.jpg'), 0, 0, this.container.width, this.container.height*2);

        objectList.forEach(function(object){

            ctx.beginPath();
            ctx.rect(object.x * scale, object.y * scale, object.width * scale, object.height * scale);
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();


        });


    };
    this.addObject = function(name, type, position, size){

        var obj = new Object(name, type, position, size);
        this.objects.push(obj);
        return obj;
    };

}

//CLASS CAMERA
function Camera(name, width, height){

   this.name = name;
   this.width = width;
   this.height = height;
   this.position = [0,0];
   this.setScene = function(scene){

       currentScene = scene;
       var sceneContainer = document.createElement('canvas');
       sceneContainer.style.top = 0;
       sceneContainer.style.left = 0;
       sceneContainer.style.position = "absolute";
       sceneContainer.width = currentScene.width * scale;
       sceneContainer.height = currentScene.height * scale;
       sceneContainer.style.backgroundColor = "red";
       sceneContainer.className = "scene";
       sceneContainer.id = currentScene.name;
       currentScene.container = sceneContainer;
       this.container.appendChild(sceneContainer);
       console.log("Set current scene: " + currentScene.name);

   }
}

//SET CAMERA TO RENDER

function setCamera(camera){

    var cameraContainer = document.createElement('div');
    cameraContainer.id = camera.name;
    cameraContainer.style.width = window.innerWidth + "px";
    var aspectRatio = camera.width/camera.height;
    var width = cameraContainer.style.width.split("px");
    cameraContainer.style.height = (parseInt(width) / aspectRatio) + "px";
    scale = parseInt(width)/camera.width;
    console.log(width + ' ' + " " + aspectRatio);
    cameraContainer.style.position = "absolute";
    cameraContainer.style.overflow = "hidden";
    camera.container = cameraContainer;
    screen.appendChild(cameraContainer);
}

var lastTime = Date.now();

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    currentScene.render();
    sendToLogger("DELAY: ", dt);
    lastTime = now;
    currentFPS++;

    requestAnimFrame(main);
};
var initScene = new Scene("start", 800, 300);
var startCamera = new Camera("initCamera", 800, 300);

resources.load([
    'images/basicAnim.png',
    'images/box_d.jpg',
    'images/Fireball_NSMB.png',
    'images/images.jpg',
    'images/look_from_another_planet_by_johndoop-d5ezloz.jpg',
    'images/Wood_Box_Texture.jpg'
]);
resources.onReady(init);

function init(){

    setCamera(startCamera);
    startCamera.setScene(initScene);
    var saike = initScene.addObject("saike", "player", [40,40],[50,50]);

    main();

}



