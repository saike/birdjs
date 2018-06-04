/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
console.log(routes);
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var swig = require('swig');
var walk = require('walk');


///Checking and Loading sprites
var sprites = [];

var walker = walk.walk('./public/animations', {followLinks: false});

walker.on('file', function (root, stat, next) {
  // Add this file to the list of files
  sprites.push((root + '/' + stat.name).split("./public/")[1]);
  next();
});

walker.on('end', function () {
  console.log(sprites);
});

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
io.set('log level', 1);
var bge = require('./logic/bge');

var Object = require('./models/object');

var Controller = require('./logic/controllers/controller');
var Sensor = require('./logic/sensors/sensor');
var Actuator = require('./logic/actuators/actuator');
var Scene = require('./models/scene');
var Client = require('./models/client');
var Game = require('./models/game');

// all environments
app.engine('html', swig.renderFile);
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/public')));
app.set('view cache', false);
swig.setDefaults({cache: false});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/users', user.list);

app.get('/game', routes.game);

//app.get('/error', routes.error);


//Calculations per second on server
var FPS = 60;

//Updates Per Second
var UPS = FPS * 2;

var currentScene;


//CLASS CAMERA
function Camera(name, width, height) {

  this.name = name;
  this.width = width;
  this.height = height;
  this.x = 0;
  this.y = 0;
  this.controllers = [];
  this.redraw = function () {

    this.controllers.forEach(function (controller) {

      controller.activate();


    });

  }

}

function initCamera(name, obj) {

  var initCamera = new Camera(name, 400, 200);
  var followController = new Controller.basicController("follow", initCamera);
  var followActu = new Actuator.followActuator("flow", initCamera, obj, 175, 100);
  followController.actuators.push(followActu);
  initCamera.controllers.push(followController);

  return initCamera;

}

//CREATE NEW PLAYER
function newPlayer(name, game) {


  var bullet = new Object("bullet", "ghost", [200, 200], [5, 5], 8);

  bullet["bullet"] = true;
  bge.prefabs.push(bullet);
  var newPlayer = game.currentScene.addObject(name, "rigit", [500, 100], [30, 50], 2);
  newPlayer["hp"] = 100;

  var bulletController = new Controller.basicController("bulCont", newPlayer);

  var bulletSensor = new Sensor.collisionSensor("bulletSens", newPlayer, "bullet");
  bulletController.sensors.push(bulletSensor);

  var bulletActu = new Actuator.propertyActuator("minusHP", newPlayer, "hp", "add", -20.00);
  bulletController.actuators.push(bulletActu);
//    var destrActu = new Actuator.destroyActuator("dstr", newPlayer, "targets");
//    bulletController.actuators.push(destrActu);

  newPlayer.controllers.push(bulletController);

  var playerHP = game.currentScene.addObject(name + "HP", "ghost", [500, 90], [50, 5], 2);
  var hpController = new Controller.basicController("playerHP", playerHP);
  playerHP["text"] = newPlayer["hp"];
  var hpFollow = new Actuator.followActuator("followPlayer", playerHP, newPlayer, -5, 5);
  hpController.actuators.push(hpFollow);
  playerHP.controllers.push(hpController);

  var hpToTextCont = new Controller.basicController("hptotext", newPlayer);
  var hpToTextActu = new Actuator.propertyActuator("hptotextactu", playerHP, "text", "external", newPlayer.name + ".hp");
  hpToTextCont.actuators.push(hpToTextActu);
  newPlayer.controllers.push(hpToTextCont);

  var selfDestrCont = new Controller.ifController("selfDstr", newPlayer, "hp<=0");
  var selfDestrActu = new Actuator.destroyActuator("SelfDstr", newPlayer, newPlayer);
  selfDestrCont.actuators.push(selfDestrActu);
  newPlayer.controllers.push(selfDestrCont);

  var selfDestrHP = new Controller.ifController("selfDstr", playerHP, "text<=0");
  var selfDestrHPActu = new Actuator.destroyActuator("SelfDstr", playerHP, playerHP);
  selfDestrHP.actuators.push(selfDestrHPActu);
  playerHP.controllers.push(selfDestrHP);

  var shootController = new Controller.basicController("shoot", newPlayer);
  var shootSensor = new Sensor.mouseSensor("shoot", "leftClick", newPlayer, "", 10);
  shootController.sensors.push(shootSensor);
  var shootActu = new Actuator.shootActuator("shoot", newPlayer, "bullet", 10, 300, 600);
  shootController.actuators.push(shootActu);
  newPlayer.controllers.push(shootController);

  var moveRightController = new Controller.basicController("moveRight", newPlayer);
  var moveLeftController = new Controller.basicController("moveLeft", newPlayer);
  var basicAnimationController = new Controller.basicController("animation", newPlayer);

  var moveRightAnim = new Actuator.animationActuator("moveRight", newPlayer, "loop", 3, 0, 4, 1);

  moveRightController.actuators.push(moveRightAnim);

  var moveLeftAnim = new Actuator.animationActuator("moveLeft", newPlayer, "loop", 3, 0, 4, 1);
  moveLeftController.actuators.push(moveLeftAnim);

  var animActu = new Actuator.animationActuator("basicanimation", newPlayer, "loop", 5, 0, 0, 1);

  basicAnimationController.actuators.push(animActu);
  var moveRightProperty = new Actuator.propertyActuator("rightSprite", animActu, "startFrame", "assign", 0);
  moveRightController.actuators.push(moveRightProperty);
  var moveLeftProperty = new Actuator.propertyActuator("leftSprite", animActu, "startFrame", "assign", 1);
  moveLeftController.actuators.push(moveLeftProperty);
  var aKeySensor = new Sensor.keyboardSensor("A", 65, newPlayer);
  moveLeftController.sensors.push(aKeySensor);

  var moveLeftActu = new Actuator.positionActuator("mL", newPlayer);
  moveLeftActu.speedX = -10;
  moveLeftActu.forceX = -10;
  moveLeftActu.frames = "always";
  moveLeftController.actuators.push(moveLeftActu);

  var dKeySensor = new Sensor.keyboardSensor("D", 68, newPlayer);
  moveRightController.sensors.push(dKeySensor);

  var moveRightActu = new Actuator.positionActuator("mR", newPlayer);
  moveRightActu.speedX = 10;
  moveRightActu.forceX = 10;

  moveRightActu.frames = "always";
  moveRightController.actuators.push(moveRightActu);

  var jumpController = new Controller.basicController("jump", newPlayer);

  var spaceSensor = new Sensor.keyboardSensor("SPACE", 32, newPlayer);
  jumpController.sensors.push(spaceSensor)

  var jumpActu = new Actuator.positionActuator('jump', newPlayer);
  jumpActu.speedY = -10;
  jumpActu.forceY = -10;
  jumpActu.frames = "always";
  jumpController.actuators.push(jumpActu);

  var mouseCont = new Controller.basicController("mouse", newPlayer);
  var mouseSens = new Sensor.mouseSensor("Plhover", "hover", newPlayer, "grabme", 0);
  var clickSens = new Sensor.mouseSensor("click", "rightClick", newPlayer, "", 0);
  mouseCont.sensors.push(clickSens);
  mouseCont.sensors.push(mouseSens);
  var mouseActu = new Actuator.mouseActuator("grab", newPlayer, "targets", "targetsFollow");
  mouseCont.actuators.push(mouseActu);


  newPlayer.controllers.push(mouseCont);
  newPlayer.controllers.push(moveRightController);
  newPlayer.controllers.push(jumpController);
  newPlayer.controllers.push(moveLeftController);
  newPlayer.controllers.push(basicAnimationController);
  return newPlayer;
}

io.sockets.on('connection', function (socket) {

  socket.on('new_client', function (data) {
    var newClient = false;
    var clientGame = false;
    var clientObject = false;
    bge.clients.forEach(function (client) {
      console.log(client.address + " check client " + socket.request.connection.remoteAddress);
      if (client.address == socket.request.connection.remoteAddress || client.address == "127.0.0.1") {

        newClient = client;
        clientGame = newClient.getGame();
        clientObject = getObject(socket.request.connection.remoteAddress, clientGame.currentScene);
      }

    });
    if (newClient && clientObject) {

      console.log(newClient.address + "  " + clientObject.name);

    }
    if (!clientObject && newClient && clientGame) {

      var newPlObj = newPlayer(socket.request.connection.remoteAddress, clientGame);
      var newCamera = initCamera(socket.request.connection.remoteAddress, newPlObj);
      newClient.activeCamera = newCamera;
      newClient.clientObjects.push(newPlObj);

      ///basic ui element
      var timer = newClient.addUIObject("timer", [160, 20], [100, 20], 9);
      var timerController = new Controller.basicController("timer", timer);
      var timerChangeActu = new Actuator.propertyActuator("timeChange", timer, "text", "add", 5);
      timerController.actuators.push(timerChangeActu);
      timer.controllers.push(timerController);
      timer.text = 1;


      ///move right touch controller
      var rightButton = newClient.addUIObject("moveRight", [60, 150], [40, 25], 9);

      var moveRightController = new Controller.orController("moveRight", rightButton);

      var moveRightSensor = new Sensor.touchSensor("mR", rightButton);
      moveRightController.sensors.push(moveRightSensor);

      var hoverRightSens = new Sensor.mouseSensor("hoverRight", "hoverMe", rightButton, "", 0);
      moveRightController.sensors.push(hoverRightSens);

      var moveRightActu = new Actuator.positionActuator("mR", newClient.clientObjects[0]);
      moveRightActu.speedX = 10;
      moveRightActu.forceX = 10;

      moveRightActu.frames = "always";
      moveRightController.actuators.push(moveRightActu);
      rightButton.controllers.push(moveRightController);

      ///move left touch controller
      var leftButton = newClient.addUIObject("moveRight", [10, 150], [40, 25], 9);
      var moveLeftController = new Controller.basicController("moveLeft", leftButton);
      var moveLeftSensor = new Sensor.touchSensor("mL", leftButton);
      moveLeftController.sensors.push(moveLeftSensor);
      var moveLeftActu = new Actuator.positionActuator("mL", newClient.clientObjects[0]);
      moveLeftActu.speedX = -10;
      moveLeftActu.forceX = -10;

      moveLeftActu.frames = "always";
      moveLeftController.actuators.push(moveLeftActu);
      leftButton.controllers.push(moveLeftController);

      ///jump touch controller
      var jumpButton = newClient.addUIObject("jumpSens", [340, 150], [40, 25], 9);
      var jumpController = new Controller.basicController("jump", jumpButton);

      var jumpSensor = new Sensor.touchSensor("jump", jumpButton);
      jumpController.sensors.push(jumpSensor)

      var jumpActu = new Actuator.positionActuator('jump', newClient.clientObjects[0]);
      jumpActu.speedY = -10;
      jumpActu.forceY = -10;
      jumpActu.frames = "always";
      jumpController.actuators.push(jumpActu);

      jumpButton.controllers.push(jumpController);


    }

    if (clientGame.currentScene && newClient.activeCamera) {
      var renderScene = {name: currentScene.name, width: currentScene.width, height: currentScene.height};
      var updateCamera = {

        name: newClient.activeCamera.name,
        width: newClient.activeCamera.width,
        height: newClient.activeCamera.height,
        x: newClient.activeCamera.x,
        y: newClient.activeCamera.y

      };

      socket.emit('set_scene', {camera: updateCamera, scene: renderScene, sprites: sprites});

    }
  });

  socket.on('client_event', function (data) {
    var updateClient = bge.getClient(socket.request.connection.remoteAddress);

    if (updateClient) {
      if (data.keyboard) {

        updateClient.keyboardState = data.keyboard;
        updateClient.clientMouseState = {x: data.mouse_pos.x, y: data.mouse_pos.y, clicked: data.mouse};
        if (updateClient.activeCamera) {

          updateClient.mouseState = {
            x: parseInt(data.mouse_pos.x) + updateClient.activeCamera.x,
            y: parseInt(data.mouse_pos.y) + updateClient.activeCamera.y,
            clicked: data.mouse
          };

        }
      }
      else {

        updateClient.touchState = data.touches;

      }
      updateClient.clientObjects.forEach(function (object) {

        object.keyboardState = updateClient.keyboardState;
        object.mouseState = updateClient.mouseState;
        object.touchState = updateClient.touchState;

      });
      updateClient.ui.forEach(function (ui) {

        ui.keyboardState = updateClient.keyboardState;
        ui.mouseState = updateClient.clientMouseState;
        ui.touchState = updateClient.touchState;

      });
    }

//        console.log(data.mouse_pos.x + "  " + data.mouse_pos.x + "  " + data.mouse + "  " + data.keyboard);

  });

  socket.on('disconnect', function () {
    var ca = socket.request.connection.remoteAddress;
    console.log("disconnect  " + ca);
//        bge.removeClient(ca);

  });
});

//MAIN UPDATE LOOP
function updateClients() {

  for(var s_id in io.sockets.connected){

    var socket = io.sockets.connected[s_id];
    
    var updateClient = false;
    var updateCamera = false;
    var renderObjects = [];
    var clientGame = false;
    bge.clients.forEach(function (client) {

      if (client.address == socket.request.connection.remoteAddress || client.address == "127.0.0.1") {

        updateClient = client;
        clientGame = updateClient.getGame();
      }

    });
    if (updateClient && updateClient.activeCamera && clientGame) {

      clientGame.currentScene.objects.forEach(function (object) {


        var camera = updateClient.activeCamera;
        var l1 = object.x;
        var t1 = object.y;
        var r1 = object.x + object.width;
        var b1 = object.y + object.height;

        var l2 = camera.x;
        var t2 = camera.y;
        var r2 = camera.x + camera.width;
        var b2 = camera.y + camera.height;

        if (b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
          return false;

        }

        else {
          if (object.visible) {

            var newRenderObject = new renderObject(object, updateClient.activeCamera);
            renderObjects.push(newRenderObject);
          }

        }

      });
      var updateUI = [];
      updateClient.ui.forEach(function (el) {

        var newRenderObject = new renderObject(el, updateClient.activeCamera);
        updateUI.push(newRenderObject);

      });

      updateCamera = {

        name: updateClient.activeCamera.name,
        width: updateClient.activeCamera.width,
        height: updateClient.activeCamera.height,
        x: updateClient.activeCamera.x.toFixed(2),
        y: updateClient.activeCamera.y.toFixed(2)

      };

      socket.emit('update', {camera: updateCamera, uiList: updateUI, objectList: renderObjects});


    }


  }

}

//MAIN GET OBJECT FUNCTION
function getObject(name, scene) {
  var objects = [];
  scene.objects.forEach(function (object) {

    if (object.name == name) {

      objects.push(object);

    }

  });
  return objects[0];
}

//RENDER CLASS FOR OBJECT
function renderObject(object, camera) {
  if (object.type == "ui") {

    this.x = object.x;
    this.y = object.y;

  }
  else {

    this.x = (object.x - camera.x).toFixed(2);
    this.y = (object.y - camera.y).toFixed(2);

  }

  this.width = object.width;
  this.height = object.height;
  this.animations = object.animations;
  this.layer = object.layer;
  if (object.text) {

    this.text = object.text;

  }
}

//APP START FUNCTION
function init() {
  var demoGame = new Game("startGame");
  bge.games.push(demoGame);
  var initScene = new Scene("start", demoGame.name, 800, 800);
  initScene.gravity = 0.5;

  demoGame.addScene(initScene);
  demoGame.setCurrentScene("start");
  currentScene = demoGame.currentScene;
  var floor = currentScene.addObject("floor", "static", [0, initScene.height - 100], [initScene.width, 100], "all");
  var leftWall = currentScene.addObject("leftWall", "static", [0, 0], [100, initScene.height - 101], "all");
  var leftWall = currentScene.addObject("rightWall", "static", [initScene.width - 100, 0], [100, initScene.height - 101], "all");

  var penis = currentScene.addObject("penis", "rigit", [200, 100], [70, 70], 2);
  penis["grabme"] = true;
  var boxCont = new Controller.basicController("boxCont", penis);
  var boxActu = new Actuator.animationActuator("box1", penis, "loop", 1, 0, 0, 0);
  boxCont.actuators.push(boxActu);
  penis.controllers.push(boxCont);
  var penis1 = currentScene.addObject("penis1", "static", [300, 500], [100, 100], 1);
  penis1["hp"] = 100.00;


  var bulletController = new Controller.basicController("bulCont", penis1);

  var bulletSensor = new Sensor.collisionSensor("bulletSens", penis1, "bullet");
  bulletController.sensors.push(bulletSensor);

  var bulletActu = new Actuator.propertyActuator("minusHP", penis1, "hp", "add", -20.00);
  bulletController.actuators.push(bulletActu);
  var destrActu = new Actuator.destroyActuator("dstr", penis1, "targets");
  bulletController.actuators.push(destrActu);

  penis1.controllers.push(bulletController);

  var selfDestrCont = new Controller.ifController("selfDstr", penis1, "hp<=0");
  var selfDestrActu = new Actuator.destroyActuator("SelfDstr", penis1, penis1);
  selfDestrCont.actuators.push(selfDestrActu);
  penis1.controllers.push(selfDestrCont);

  penis1["grabme"] = true;


  var penis1HP = currentScene.addObject("penis1HP", "ghost", [280, 500], [100, 5], 1);

  var hpToTextCont = new Controller.basicController("hptotext", penis1);
  var hpToTextActu = new Actuator.propertyActuator("hptotextactu", penis1HP, "text", "external", "penis1.hp");
  hpToTextCont.actuators.push(hpToTextActu);
  penis1.controllers.push(hpToTextCont);

  var hpController = new Controller.basicController("penis1HP", penis1HP);
  penis1HP.text = penis1["hp"];
  var hpFollow = new Actuator.followActuator("followPlayer", penis1HP, penis1, -5, 10);
  hpController.actuators.push(hpFollow);
  penis1HP.controllers.push(hpController);


  var selfDestrHP = new Controller.ifController("selfDstr", penis1HP, "text<=0");
  var selfDestrHPActu = new Actuator.destroyActuator("SelfDstr", penis1HP, penis1HP);
  selfDestrHP.actuators.push(selfDestrHPActu);
  penis1HP.controllers.push(selfDestrHP);
  penis1HP["text"] = penis1["hp"];

  function main_loop() {
    currentScene.redraw();

    bge.clients.forEach(function (client) {

      if (client.activeCamera) {

        client.activeCamera.redraw();

      }
      client.ui.forEach(function (el) {

        el.redraw();

      });
    });

    updateClients();
    currentScene.resetAnimations();
    setTimeout(main_loop, 1000 / FPS);
  };
  main_loop();
}

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
  init();

});













