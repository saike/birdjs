var Object = module.exports = function(name, type, position, size){

    this.name = name;
    this.type = type;
    this.x = position[0];
    this.y = position[1];
    this.forceX = 0;
    this.forceY = 0;
    this.width = size[0];
    this.height = size[1];
    this.top = function(){return this.y};
    this.bottom = function(){return (this.y + this.height)};
    this.left = function(){return this.x};
    this.right = function(){return (this.x + this.width)};
    this.vx = 0;
    this.vy = 0;
    this.g = 0;
    this.keyboardState = [];
    this.mouseState = {x: 0, y: 0, clicked: []};
    this.controllers = [];
    this.distanceTo = function(object){

        var thisMidX = this.x + (this.width/2);
        var thisMidY = this.y + (this.height/2);
        var targetMidX = object.x + (object.width/2);
        var targetMidY = object.y + (object.height/2);
        var distanceX = Math.abs(thisMidX - targetMidX);
        var distanceY = Math.abs(thisMidY - targetMidY);
        return { distanceX: distanceX, distanceY: distanceY };
    };
    this.vectorTo = function(x, y){

        var thisMidX = this.x + (this.width/2);
        var thisMidY = this.y + (this.height/2);
        return null;

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
