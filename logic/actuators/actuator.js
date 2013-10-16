//BASIC POSITION ACTUATOR
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
        this.activate = function () {
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

exports.followActuator = function(actuName, obj, target, distanceX, distanceY){

    this.target = target;
    this.owner = obj;
    this.name = actuName;
    this.distanceX = distanceX;
    this.distanceY = distanceY;
    this.activate = function(){

//        var ownerMidX = this.owner.x + (this.owner.width/2);
//        var ownerMidY = this.owner.y + (this.owner.height/2);
        var targetMidX = this.target.x + (this.target.width/2);
        var targetMidY = this.target.y + (this.target.height/2);
        this.owner.x = this.target.x - this.distanceX;
        this.owner.y = this.target.y - this.distanceY;

    }


}

exports.animationActuator = function(actuName, obj, sprite, type){



}
