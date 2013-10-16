var FPS = 60;

var scale = 1;

var currentFPS = 0;

var currentScene = false;

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


var objectList = [];

var playerName = Math.random()


//////////////////////////////////////////////////////
//Viewport object
var activeCamera = {
    name: "",
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    container: false,
    render: function(){
        sendToLogger("Objects to update: ", objectList);

        this.container.width = window.innerWidth;
        var width = this.container.width;
        var aspectRatio = this.width / this.height;

        this.container.height = width / aspectRatio;
        scale = width / this.width;
        sendToLogger("scale: ", scale)
        var ctx = this.container.getContext("2d");
        ctx.clearRect(0, 0, this.container.width, this.container.height);
        ctx.drawImage(resources.get('images/look_from_another_planet_by_johndoop-d5ezloz.jpg'), 0, 0, this.container.width, this.container.height);
        var camera = this;
        objectList.forEach(function(object){

            ctx.beginPath();
            ctx.rect((object.x*scale).toFixed(2), (object.y*scale).toFixed(2), (object.width * scale).toFixed(2), (object.height * scale).toFixed(2));
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();
            sendToLogger("object: ", (object.x*scale).toFixed(2) + " " + (object.y*scale).toFixed(2) + " " + object.width*scale + "  " + object.height*scale);


        });
    }

};
//////////////////////////////////////////////////////


//////////////////////////////////////////////////////
//MAIN MULTIPLAYER LOGIC
var socket = io.connect('http://192.168.1.72:3000');
    function updateCamera(camera){

        activeCamera.name = camera.name;
        activeCamera.height = camera.height;
        activeCamera.width = camera.width;
        activeCamera.x = camera.x;
        activeCamera.y = camera.y;
    }

    socket.emit('new_client', playerName);
    socket.on('set_scene', function(data){

        updateCamera(data.camera);
        setCamera(data.camera);
        console.log("new Scene apply from server: " + currentScene.name);

    });
    socket.on('update', function (data) {
        objectList = data.objectList;
        updateCamera(data.camera);
        sendToLogger("camera: ", activeCamera.name + ' ' + activeCamera.x + "  " + activeCamera.y);
        socket.emit('client_event', { name: playerName, mouse: mouseClicked, mouse_pos: mousePos, keyboard: keysPushed });
});
//////////////////////////////////////////////////////


//////////////////////////////////////////////////////
//INPUT GRABBERS:

document.onkeydown = document.onkeyup = function (e) {
    e = e || event;

    keysPushed[e.keyCode] = e.type == 'keydown';
    //sendToLogger("KEYS PUSHED: ", keysPushed);
}

window.onmousemove = function (event) {
    event = event || window.event;
    mousePos = {
        x: ((event.pageX - parseInt(activeCamera.container.style.left))/scale + activeCamera.x).toFixed(2),
        y: ((event.pageY - parseInt(activeCamera.container.style.top))/scale + activeCamera.y).toFixed(2)
    };
    sendToLogger("mouse: ", mousePos.x + "   " + mousePos.y);

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
//////////////////////////////////////////////////////


var FPSmeter = setInterval(function(){
    sendToLogger("FPS: ", currentFPS);
    currentFPS = 0;

}, 1000);
//////////////////////////////////////////////////////


//////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////


//////////////////////////////////////////////////////
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

////CLASS SCENE
//function Scene(name, width, height){
//
//
//    this.name = name;
//    this.width = width;
//    this.height = height;
//    this.objects = [];
//    this.container = {};
//
//    this.render = function(){
//        sendToLogger("Objects to update: ", objectList);
//        this.container.width = parseInt(currentScene.width * scale);
//        this.container.height = parseInt(currentScene.height * scale);
//        var ctx = this.container.getContext("2d");
//        ctx.clearRect(0, 0, this.container.width, this.container.height);
////        ctx.drawImage(resources.get('images/look_from_another_planet_by_johndoop-d5ezloz.jpg'), 0, 0, this.container.width, this.container.height*2);
//
//        objectList.forEach(function(object){
//
//            ctx.beginPath();
//            ctx.rect(object.x * scale, object.y * scale, object.width * scale, object.height * scale);
//            ctx.fillStyle = 'yellow';
//            ctx.fill();
//            ctx.lineWidth = 2;
//            ctx.strokeStyle = 'black';
//            ctx.stroke();
//
//
//        });
//
//
//    };
//
//
//}


//////////////////////////////////////////////////////
//CLASS CAMERA
function Camera(name, width, height){

   this.name = name;
   this.width = width;
   this.height = height;
   this.x = 0;
   this.y = 0;
   this.container = {};

}

//SET CAMERA TO RENDER

function setCamera(camera){
    activeCamera.width = camera.width;
    activeCamera.height = camera.height;
    activeCamera.name = camera.name;
    activeCamera.x = camera.x;
    activeCamera.y = camera.y;
    if(activeCamera.container){

        screen.removeChild(activeCamera.container);
        activeCamera.container = false;


    }
    var cameraContainer = document.createElement('canvas');
    cameraContainer.id = camera.name;
    cameraContainer.style.width = window.innerWidth;
    var aspectRatio = camera.width/camera.height;
    var width = cameraContainer.style.width.split("px");
    cameraContainer.style.height = (parseInt(width) / aspectRatio);
    scale = parseInt(width)/camera.width;
    console.log(width + 'suka ' + " " + aspectRatio);
    cameraContainer.style.position = "absolute";
    cameraContainer.style.top = "0px";
    cameraContainer.style.left = "0px";

    camera.container = cameraContainer;
    activeCamera.container = cameraContainer;
    screen.appendChild(cameraContainer);
}
//////////////////////////////////////////////////////


//////////////////////////////////////////////////////
//Main loop
var lastTime = Date.now();

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    activeCamera.render();
//    currentScene.render();
    sendToLogger("DELAY: ", dt);
    lastTime = now;
    currentFPS++;

    requestAnimFrame(main);
}
//////////////////////////////////////////////////////

//var initScene = new Scene("start", 800, 300);
var startCamera = new Camera("initCamera", 800, 300);



//Load resources
resources.load([
    'images/basicAnim.png',
    'images/box_d.jpg',
    'images/Fireball_NSMB.png',
    'images/images.jpg',
    'images/look_from_another_planet_by_johndoop-d5ezloz.jpg',
    'images/Wood_Box_Texture.jpg'
]);




//START APP CONFIG
function init(){

    setCamera(startCamera);
//    activeCamera.setScene(initScene);
    main();

}

//START APP ON LOADED RESOURCES
resources.onReady(init);



