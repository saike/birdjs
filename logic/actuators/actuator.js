//BASIC POSITION ACTUATOR
exports.positionActuator = function (actuName, obj) {
        this.name = actuName;
        this.speedX = 0;
        this.speedY = 0;
//        this.forceX = 0;
//        this.forceY = 0;
        this.currentSpeedX = 0;
        this.currentSpeedY = 0;
        this.dumpSpeed = 0;
        this.frames = 0;
        this.owner = obj;
        this.activate = function () {
            if (this.frames > 0 || this.frames == "always") {

                    if (this.owner.type == "ghost" || this.owner.type == "background") {
                        this.owner.vy = this.speedY;
                        this.owner.vx = this.speedX;


                    }
                    else if (this.owner.type == "rigit" || this.owner.type == "static") {
                        this.owner.vy = this.speedY;
                        this.owner.vx = this.speedX;
//                        this.owner.force[0] = this.owner.force[0] + this.forceY;
//                        this.owner.force[1] = this.owner.force[1] + this.forceX;


                    }


            }



            if (this.frames != "always") {

                this.frames--;

            }
        };


};
