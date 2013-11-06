var bge = require('../bge');


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
    this.targetName = false;
    this.targets = [];
    this.positive = function(){

        var sensor = this;
        sensor.targets = [];

        var mouseState = sensor.owner.mouseState;
        console.log(mouseState.x + "  " + mouseState.y);
        if(sensor.type == "leftClick"){

            if(mouseState.clicked.indexOf(1) >= 0){

                return true;

            }


        }
        if(sensor.type == "hover"){
            bge.globalObjectList.forEach(function(object){

                if(mouseState.x > object.left() && mouseState.x < object.right() && mouseState.y > object.top() && mouseState.y < object.bottom()){
                    sensor.targets.push(object);
                }

            });
            if(sensor.targets.length > 0){
                console.log("it's true");
                return true;

            }

        }
        if(sensor.type == "hoverMe"){
            var owner = sensor.owner;
            if(mouseState.x > owner.left() && mouseState.x < owner.right() && mouseState.y > owner.top() && mouseState.y < owner.bottom()){
                return true;
            }

        }
        return false;
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
