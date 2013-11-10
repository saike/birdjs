var bge = require('../bge');

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
        this.owner.x = this.target.x - this.distanceX;
        this.owner.y = this.target.y - this.distanceY;

    }


}

////////////////////////
///Animation Actuator///
exports.animationActuator = function(actuName, obj, type, speed, startFrame, endFrame){
    this.name = actuName;
    this.owner = obj;
    this.type = type;
    this.speed = speed;
    this.currentFrame = startFrame;
    this.delay = 0;
    this.startFrame = startFrame;
    this.endFrame = endFrame;

    this.activate = function(targets){
        var actu = this;

        actu.owner.animations.push({n: actu.name, f: actu.currentFrame});

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

}

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

            if(actu.type == "add"){

                target[actu.property]+=actu.value;

            }

        }
        if(this.target == "targets" && targets && targets.length > 0){

            targets.forEach(function(target){

                 actuActivate(target);

            });

        }
        else {

            actuActivate(this.target);

        }


    }

}
