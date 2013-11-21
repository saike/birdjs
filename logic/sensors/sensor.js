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
exports.mouseSensor = function(name, type, obj, property, delay){

    this.name = name;
    this.type = type;
    this.owner = obj;
    this.delay = delay;
    this.delayCounter = 0;
    this.targetName = false;
    this.targets = [];
    this.property = property;
    this.positive = function(){
        if(this.delayCounter >= this.delay){

            this.delayCounter = 0;

        }
        if(this.delayCounter == 0){


            var sensor = this;
            sensor.targets = [];
            var currentScene = sensor.owner.getCurrentScene();
            var mouseState = sensor.owner.mouseState;
            if(sensor.type == "leftClick"){

                if(mouseState.clicked.indexOf(1) >= 0){

                    this.delayCounter++;
                    return true;

                }


            }
            if(sensor.type == "rightClick"){

                if(mouseState.clicked.indexOf(3) >= 0){
                    this.delayCounter++;
                    return true;

                }


            }
            if(sensor.type == "hover"){

                currentScene.objects.forEach(function(object){

                    if(object[sensor.property] && mouseState.x > object.left() && mouseState.x < object.right() && mouseState.y > object.top() && mouseState.y < object.bottom()){
                        sensor.targets.push(object);
                    }

                });
                if(sensor.targets.length > 0){
//                    console.log("it's true");
                    this.delayCounter++;
                    return true;

                }

            }
            if(sensor.type == "hoverMe"){
                var owner = sensor.owner;
                if(mouseState.x > owner.left() && mouseState.x < owner.right() && mouseState.y > owner.top() && mouseState.y < owner.bottom()){
                    this.delayCounter++;
                    return true;
                }

            }
        }
        if(this.delayCounter>0){this.delayCounter++;}

        return false;
    };

};

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

    };

};

////////////////////
///Collision sensor

exports.collisionSensor = function(name, owner, property){

    this.name = name;
    this.property = property;
    this.owner = owner;
    this.targets = [];
    this.positive = function(){

        var sensor = this;
        sensor.targets = [];

        var owner = this.owner;
//        console.log("collision object is: " + owner.name + "  " + owner.game + "  " + owner.scene);

        var scene = owner.getCurrentScene();
        var coll = false;
        if(scene){
            scene.objects.forEach(function(object){
                if(sensor.owner == object.owner){

                    return false;

                }
                if(owner != object && !sensor.property || sensor.property == "" || object[sensor.property]){

                    var l1 = owner.x + owner.vx;
                    var t1 = owner.y + owner.vy;
                    var r1 = owner.x + owner.width + owner.vx;
                    var b1 = owner.y + owner.height + owner.vy;

                    var l2 = object.x + object.vx;
                    var t2 = object.y + object.vy;
                    var r2 = object.x + object.width + object.vx;
                    var b2 = object.y + object.height + object.vy;


                    if ( b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {

                        console.log("no collision detected: " + owner.name + " to " + object.name);

                    }
                    else{

                        coll = true;
                        sensor.targets.push(object);
                        console.log("collision detected: " + owner.hp + " to " + object.name);

                    }

                }

            });

        }

        return coll;

    };

};
