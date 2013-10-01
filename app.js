
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var swig = require('swig');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


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
swig.setDefaults({ cache: false });
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/users', user.list);


//CLASS OBJECT
function Object(name, type, position, size){

    this.name = name;
    this.type = type;
    this.x = position[0];
    this.y = position[1];
    this.width = size[0];
    this.height = size[1];
    this.top = function(){return this.y};
    this.bottom = function(){return (this.y + this.height)};
    this.left = function(){return this.x};
    this.right = function(){return (this.x + this.width)};
    this.vx = 0;
    this.vy = 0;
    this.keyboardState =[];
    this.mouseState = {x: 0, y: 0, clicked: []};
    this.redraw = function(){
        if(this.type != "ghost"){

            if(parseInt(this.vx) > 0) {

                this.vx = this.vx-gravity;

            }
            else if(parseInt(this.vx) < 0){

                this.vx = this.vx+gravity;

            }
            if(this.bottom() + this.vy < currentScene.height){

                this.vy = this.vy + gravity;

            }
            if(this.bottom() + this.vy > currentScene.height){

                this.vy = 0;
                this.y = currentScene.height - this.height;

            }
            if(this.keyboardState[68]){

                this.vx = 5;

            }

        }

        this.x += this.vx;
        this.y += this.vy;
    };


}

//CLASS SCENE
function Scene(name, width, height){


    this.name = name;
    this.width = width;
    this.height = height;
    this.objects = [];
    this.redraw = function(){
        this.objects.forEach(function(object){

            object.redraw();

        });

    };

    this.addObject = function(name, type, position, size){

        var obj = new Object(name, type, position, size);
        this.objects.push(obj);
        return obj;
    };

}

function newPlayer(name){

    var newPlayer = currentScene.addObject(name, "rigit", [50,50], [50,50])


}

var initScene = new Scene("start", 800, 300);


//Calculations per second
var FPS = 60;
var lastTime = Date.now();
var gravity = 1;
var currentScene;

//List of clients
var clients = [];

io.sockets.on('connection', function (socket) {
    socket.on('new_client', function(data){
        var newClient = false;

        clients.forEach(function(client){

            if(client.address == socket.id){

                newClient = client;

            }

        });
        if(!newClient){

            var newClient = { address: socket.id, name: data }
            clients.push(newClient);
            newPlayer(data);

        }


    });
//    var sendInterval = setInterval(function(){
//         socket.volatile.emit('update', initScene.objects);
//
//    }, 1000/FPS);
    socket.on('client_event', function (data) {
        var updateClient = false;
        var updateObject = false;
        clients.forEach(function(client){

            if(client.address == socket.id){

                updateClient = client;

            }

        });
        if(updateClient){

            updateObject = getObject(updateClient.name);

        }
        if (updateObject){

            updateObject.keyboardState = data.keyboard;


        }
        console.log(data.mouse_pos.x + "  " + data.mouse_pos.x + "  " + data.mouse + "  " + data.keyboard);

    });
    socket.on('disconnect', function () {
        clearInterval(tweets);
    });
});



function getObject(name){
    var objects = [];
    currentScene.objects.forEach(function(object){

        if (object.name == name){

            objects.push(object);

        }

    });
    return objects[0];
}

function init(){

//    setCamera(startCamera);
//    startCamera.setScene(initScene);
    currentScene = initScene;
    var main_loop = setInterval(function(){
        currentScene.redraw();
        io.sockets.emit('update', currentScene.objects);
    }, 1000/FPS);

}

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    init();

});













