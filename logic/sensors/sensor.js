/////////////////////
///Keyboard Sensor///
exports.keyboardSensor = function(name, key, obj){

        this.name = name;
        this.owner = obj;
        this.key = key;
        this.power = true;
        this.disable = function(){

            this.power = false;

        };
        this.enable = function(){

            this.power = true;

        };
        this.positive = function(){
            if(this.owner.keyboardState[this.key]){

                return true;

            }
            else {

                return false;

            }
        }

}

////////////////////////
///Basic mouse sensor///
exports.mouseSensor = function(name, type, obj){

    this.name = name;
    this.type = type;
    this.owner = obj;
    this.positive = function(){
        var sensor = this;
        if(sensor.type == "leftButton"){

            if(sensor.owner.mouseState.clicked.indexOf(1) >= 0){

                return true;

            }
            else {

                return false;

            }

        }

    }

}

////////////////////////
///Basic touch sensor///
exports.touchSensor = function(name, obj){

    this.name = name;
    this.owner = obj;
    this.positive = function(){
        var sensor = this;
        var touchState = sensor.owner.touchState;
        var posTouch = false;
        touchState.forEach(function(touch){

            if(sensor.owner.type == "ui"){


                if(touch.x > sensor.owner.left() && touch.x < sensor.owner.right() && touch.y > sensor.owner.top() && touch.y < sensor.owner.bottom()){

                    posTouch = true;

                }

            }

        });
        if(posTouch){

            return true;

        }
        else {

            return false;

        }

    }

}
