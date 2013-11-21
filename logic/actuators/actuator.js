var bge = require('../bge');
var Controller = require('../controllers/controller');
/////////////////////////////
///BASIC POSITION ACTUATOR///
exports.positionActuator = function (actuName, obj) {

        this.name = actuName;
        this.speedX = 0;
        this.speedY = 0;
        this.forceX = 0;
        this.forceY = 0;
        this.currentSpeedX = 0;
        this.currentSpeedY = 0;
        this.dumpSpeed = 0;
        this.frames = 0;
        this.owner = obj;
        this.activate = function (targets) {
            if (this.frames > 0 || this.frames == "always") {

                    if (this.owner.type == "ghost" || this.owner.type == "background") {
                        this.owner.vy += this.speedY;
                        this.owner.vx += this.speedX;


                    }
                    else if (this.owner.type == "rigit" || this.owner.type == "static") {
                        this.owner.vy += this.speedY;
                        this.owner.vx += this.speedX;
                        this.owner.forceX += this.forceX;
                        this.owner.forceY += this.forceY;


                    }


            }



            if (this.frames != "always") {

                this.frames--;

            }
        };


};


/////////////////////
///Follow Actuator///
exports.followActuator = function(actuName, obj, target, distanceX, distanceY){

    this.target = target;
    this.owner = obj;
    this.name = actuName;
    this.distanceX = distanceX;
    this.distanceY = distanceY;
    this.activate = function(targets){

//        var ownerMidX = this.owner.x + (this.owner.width/2);
//        var ownerMidY = this.owner.y + (this.owner.height/2);
        var targetMidX = this.target.x + (this.target.width/2);
        var targetMidY = this.target.y + (this.target.height/2);
        this.owner.x = this.target.x + this.target.vx - this.distanceX;
        this.owner.y = this.target.y + this.target.vy - this.distanceY;

    }


};

////////////////////////
///Animation Actuator///
exports.animationActuator = function(actuName, obj, type, speed, startFrame, endFrame, layer){
    this.name = actuName;
    this.owner = obj;
    this.type = type;
    this.speed = speed;
    this.currentFrame = startFrame;
    this.delay = 0;
    this.startFrame = startFrame;
    this.endFrame = endFrame;
    this.layer = layer;
    this.activate = function(targets){
        var actu = this;
        var exist = false;
        actu.owner.animations.forEach(function(animation){

            if(animation.l == actu.layer){

                exist = true;

            }

        });
        if(!exist){

            actu.owner.animations.push({n: actu.name, f: actu.currentFrame, l: actu.layer});

        }

        if(actu.type == "loop"){
            actu.delay++;
            if(actu.delay >= actu.speed){
                actu.delay = 0;
                actu.currentFrame++;


            }

            if(actu.currentFrame >= actu.endFrame){

                actu.currentFrame = actu.startFrame;

            }

        }


    }

};

///////////////////////
///Property actuator///
exports.propertyActuator = function(actuName, obj, property, type, value){

    this.target = obj;
    this.name = actuName;
    this.property = property;
    this.type = type;
    this.value = value;
    this.activate = function(targets){
        var actu = this;
        function actuActivate(target){
//            console.log(target.name + " property: " + target[actu.property]);
            if(actu.type == "add"){

                target[actu.property]+=actu.value;

            }
            if(actu.type == "assign"){

                target[actu.property] = actu.value;

            }
            if(actu.type == "external"){
                var propIndex = actu.value.lastIndexOf(".");
                var property = actu.value.slice(propIndex + 1).trim();
                var name = actu.value.slice(0, propIndex).trim();
                var scene = actu.target.getCurrentScene();
                var to = scene.getObjects(name);
//                console.log("PROPERTY CHANGED  " + name + "  " + property);
                to.forEach(function(object){

                     if(object[property]){

                         target[actu.property] = object[property];

                     }

                });

            }
        }
        if(actu.target == "targets" && targets && targets.length > 0){

            targets.forEach(function(target){

                 actuActivate(target);

            });

        }
        else {

            actuActivate(this.target);

        }


    }

};

////////////////////
///mouse actuator///

exports.mouseActuator = function(actuName, obj, target, type){

    this.name = actuName;
    this.type = type;
    this.owner = obj;
    this.target = target
    this.activate = function(targets){

        var actu = this;
        function actuActivate(target){

            if(actu.type == "targetsFollow"){

                target.x = actu.owner.mouseState.x - (target.width/2);
                target.y = actu.owner.mouseState.y - (target.height/2);


            }

        }
        if(actu.target == "targets" && targets && targets.length > 0){

            targets.forEach(function(target){

                actuActivate(target);

            });

        }
        else {

            actuActivate(this.target);

        }

    }

};
///////////////////

///////////////////
///SHOOT ACTUATOR =)

exports.shootActuator = function(actuName, obj, bullet, speed, minDamage, maxDamage){

    this.name = actuName;
    this.owner = obj;
    this.speed = speed;
    this.bullet = bullet;
    this.minDamage = minDamage;
    this.maxDamage = maxDamage;

    this.activate = function(){
        var actu = this;
        var owner = actu.owner;
        var currentScene = owner.getCurrentScene();
        var bulletID = currentScene.getObjects(actu.bullet).length+1;
        var newBullet = currentScene.addPrefab(actu.bullet);

//        console.log("bullets: " + currentScene.getObjects(actu.bullet));

        if(newBullet){

            newBullet.name = actu.bullet + bulletID;
            newBullet.owner = actu.owner;
//            console.log("created bullet: " + newBullet.name + "  " + newBullet.controllers);

            var mouse =  actu.owner.mouseState;
            var speed = actu.speed;

            newBullet.x = owner.x + (owner.width/2);
            newBullet.y = owner.y + (owner.height/2);
            var vector = owner.vectorTo(mouse.x, mouse.y, speed);
            var bulletController = new Controller.basicController("bullet", newBullet);
            var bulletPosition = new exports.positionActuator("fly", newBullet);
            bulletPosition.speedX = vector.speedX;
            bulletPosition.speedY = vector.speedY;
            bulletPosition.frames = "always";
            bulletController.actuators.push(bulletPosition);
            newBullet.controllers.push(bulletController);

        }


    };

};

///////////////////
///destroy actuator

exports.destroyActuator = function(actuName, obj, target){

    this.name = actuName;
    this.owner = obj;
    this.target = target;
    this.activate = function(targets){
        var actu = this;
        function actuActivate(target){
            target.trash();
            console.log("DESTROYED!" + target.name + "  " + bge.trash);


        }
        if(actu.target == "targets" && targets && targets.length > 1){

            targets.forEach(function(target){

                actuActivate(target);

            });

        }
        else if(actu.target == "targets" && targets && targets.length == 1){

            actuActivate(targets[0]);

        }
        else if(actu.target == "own" || actu.target == actu.owner){

            actuActivate(actu.owner);


        }

    };


};


