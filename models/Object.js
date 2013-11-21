var bge = require('../logic/bge');


var Object = module.exports = function(name, type, position, size, layer){
    bge.globalObjectList.push(this);
    this.game = "";
    this.scene = "";
    this.name = name;
    this.type = type;
    this.x = position[0];
    this.y = position[1];
    this.forceX = 0;
    this.forceY = 0;
    this.width = size[0];
    this.height = size[1];
    this.layer = layer;
    this.top = function(){return this.y};
    this.bottom = function(){return (this.y + this.height)};
    this.left = function(){return this.x};
    this.right = function(){return (this.x + this.width)};
    this.vx = 0;
    this.vy = 0;
    this.g = 0;
    this.keyboardState = [];
    this.animations = [];
    this.mouseState = {x: 0, y: 0, clicked: []};
    this.touchState = [];
    this.controllers = [];
    this.visible = true;
    this.text = false;
    this.trash = function(){

      bge.trash.push(this);

    };
    this.getCurrentScene = function(){

        var currentGame = bge.getGame(this.game);
        var currentScene = currentGame.currentScene;
        return currentScene;
    };
    this.distanceTo = function(object){

        var thisMidX = this.x + (this.width/2);
        var thisMidY = this.y + (this.height/2);
        var targetMidX = object.x + (object.width/2);
        var targetMidY = object.y + (object.height/2);
        var distanceX = Math.abs(thisMidX - targetMidX);
        var distanceY = Math.abs(thisMidY - targetMidY);
        return { distanceX: distanceX, distanceY: distanceY };
    };
    this.vectorTo = function(x, y, speed){
        var midX = this.x + (this.width/2);
        var midY = this.y + (this.height/2);
        var polusX = (x - midX).toFixed(2);
        var polusY = (y - midY).toFixed(2);
        var aspect = (polusX/polusY).toFixed(2);
        if(polusX<0){polusX = -1;}
        else if (polusX>=0){polusX = 1;}
        if(polusY<0){polusY = -1;}
        else if (polusY>=0){polusY = 1;}
        var speedY = Math.sqrt((speed*speed)/(aspect*aspect+1))*polusY;
        var squareSpeed = speed*speed;
        console.log(squareSpeed);
        var squareSpeedY = speedY*speedY
        var deltaSpeed = Math.abs(squareSpeed - squareSpeedY);
        var speedX = Math.sqrt(deltaSpeed)*polusX;

        return {speedX: speedX, speedY: speedY};

    };
    this.reset = function(){

        this.x += this.vx;
        this.y += this.vy;
        this.vx = 0;
        this.vy = 0;
        this.forceX = 0;
        this.forceY = 0;

    };
    this.redraw = function(scene){
        if(this.type == "static"){

            this.forceX = 10000;
            this.forceY = 10000;

        }
        this.controllers.forEach(function (controller) {

            controller.activate();

        });
        if(this.type == "rigit"){

//            if(parseInt(this.vx) > 0) {
//
//                this.vx = this.vx-scene.gravity;
//
//            }
//            else if(parseInt(this.vx) < 0){
//
//                this.vx = this.vx+scene.gravity;
//
//            }
            if(this.bottom() + this.vy < getGround(this, scene)[0] - 0.1){
                this.g += scene.gravity;
                this.forceY += this.g;
                this.vy += this.g;

            }
            if(this.bottom() + this.vy > getGround(this, scene)[0] - 0.1){

                this.vy = 0;
                this.g = 0;
                this.y = getGround(this, scene)[0] - this.height - 0.1;

            }


        }

    };


}


//find ground for object
function getGround(obj, scene){

    var groundObj;
    var groundObjList = [];
    scene.objects.forEach(function(object){
        var l1 = obj.left();
        var r1  = obj.right();
        var b1 = obj.bottom();

        var l2 = object.left();
        var r2  = object.right();
        var t2 = object.top();

        if (object.name != obj.name && object.type != "ghost"){
            if(b1 < t2){

                if (r1 >= l2 && l1 <= l2){

                    groundObjList.push(object);

                }
                else if (l1 >= l2 && r1 <= r2){

                    groundObjList.push(object);
                }
                else if (l1 <= r2 && r1 >= r2){

                    groundObjList.push(object);

                }
                else if (l1 <= l2 && r1 >= r2){

                    groundObjList.push(object);


                }
                else if (l1 == l2 && r1 == r2){

                    groundObjList.push(object);


                }
            }



        }

    });
    if(groundObjList.length){

        groundObjList.sort(function(a, b) {
            return a.y - b.y;
        });
        groundObj = groundObjList[0];
        return [groundObj.top(), groundObj.bottom()];
    }
    if(!groundObjList.length){

        return [scene.height, scene.height];

    }
    
    
}
