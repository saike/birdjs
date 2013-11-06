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
exports.animationActuator = function(actuName, obj, sprite, type, speed, framesX, framesY){
    bge.animationActuators.push(this);
    this.name = actuName;
    this.sprite = sprite;
    this.owner = obj;
    this.type = type;
    this.speed = speed;
    this.framesX = framesX;
    this.framesY = framesY;
    this.currentFrameX = 0;
    this.currentFrameY = 0;
    this.currentFrame = [0,0];

    this.activate = function(targets){
        var actu = this;
        var spriteWidth = actu.owner.width*framesX;
        var spriteHeight = actu.owner.height*framesY;
        actu.currentFrame[0] = actu.owner.width*actu.currentFrameX;
        actu.currentFrame[1] = actu.owner.height*actu.currentFrameY;
        actu.owner.animations.push({sprite: actu.sprite, left: actu.currentFrame[0], top: actu.currentFrame[1], framesX: actu.framesX, framesY: actu.framesY, objWidth: actu.owner.width, objHeight: actu.owner.height});

        if(actu.type == "loop"){
            actu.currentFrameX++;
            if(actu.currentFrameX >= actu.framesX){

                actu.currentFrameX = 0;
                actu.currentFrameY++;
            }
            if(actu.currentFrameY >= actu.framesY){

                actu.currentFrameY = 0;

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
