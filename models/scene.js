//imports
var Object = require('./object');
var bge = require('../logic/bge');

function getCollision(obj, colObj){

    var l1 = obj.x + obj.vx;
    var t1 = obj.y + obj.vy;
    var r1 = obj.x + obj.width + obj.vx;
    var b1 = obj.y + obj.height + obj.vy;

    var l2 = colObj.x + colObj.vx;
    var t2 = colObj.y + colObj.vy;
    var r2 = colObj.x + colObj.width + colObj.vx;
    var b2 = colObj.y + colObj.height + colObj.vy;

    if ( b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2) {
        return false;
    }

    return true;
}

//Collision displacement

function displacementObj(obj, colObj){



    var l1after = obj.left() + obj.vx;
    var l1before = obj.left();

    var r1after = obj.right() + obj.vx;
    var r1before = obj.right();

    var l2before = colObj.left();
    var l2after = colObj.left() + colObj.vx;

    var r2before = colObj.right();
    var r2after = colObj.right() + colObj.vx;

    var t1before = obj.top();
    var t1after = obj.top() + obj.vy;

    var b1before = obj.bottom();
    var b1after = obj.bottom() + obj.vy;

    var t2before = colObj.top();
    var t2after = colObj.top() + colObj.vy;

    var b2before = colObj.bottom();
    var b2after = colObj.bottom() + colObj.vy;
    if(obj.layer == colObj.layer || obj.layer == "all" || colObj.layer == "all"){

        if(obj.type != "ghost" && colObj.type != "ghost"){

            if(Math.abs(obj.forceX) > Math.abs(colObj.forceX)){
                if(r1before <= l2before){

                    if(r1after >= l2after){
                        colObj.vx = (obj.x + obj.width + obj.vx) - colObj.x - 0.1;
                        colObj.forceX = obj.forceX/2;
                    }

                }

                else if(l1before >= r2before){

                    if(l1after <= r2after){

                        colObj.vx = (obj.x + obj.vx) - (colObj.x + colObj.width) - 0.1;
                        colObj.forceX = obj.forceX/2;

                    }

                }

            }
            else if(Math.abs(obj.forceX) <= Math.abs(colObj.forceX)){
                if(r1before <= l2before){

                    if(r1after >= l2after){
                        obj.vx = (colObj.x + colObj.vx) - (obj.x + obj.width) - 0.1;
                        obj.forceX = colObj.forceX/2;
                    }

                }

                else if(l1before >= r2before){

                    if(l1after <= r2after){

                        obj.forceX = colObj.forceX/2;
                        obj.vx = (colObj.x + colObj.width + colObj.vx) - obj.x + 0.1;

                    }

                }

            }



            if(t1before >= b2before){

                if(t1after <= b2after){

                    if(obj.forceY >= colObj.forceY || obj.vy > colObj.vy){

                        colObj.g = 0;
                        colObj.vy = obj.top() + obj.vy - 0.1;
                    }
                    else {

                        obj.vy = obj.top() - colObj.bottom() + colObj.vy + 0.1;

                    }

                }


            }
            if(b1before <= t2before){

                if(b1after >= t2after){
                    if(obj.forceY < colObj.forceY || obj.vy > colObj.vy){

                        obj.vy = colObj.top() + colObj.vy - obj.bottom() - 0.1;
                        obj.g = 0;

                    }
                    else {

                        colObj.vy = colObj.top() - obj.bottom() + 0.1;

                    }

                }


            }


        }


    }

}

//CLASS SCENE
var Scene = module.exports = function(name, game, width, height){

    this.game = game;
    this.name = name;
    this.width = width;
    this.height = height;
    this.objects = [];
    this.gravity = 1;
    this.resetAnimations = function(){

        this.objects.forEach(function(object){

            object.animations = [];

        });

    };
    this.getCurrentGame = function(){

        var gameName = this.game;
        bge.games.forEach(function(game){

            if(game.name == gameName){return game}

        });
    };
    this.getCollisions = function(){
        var scene = this;
        var collisions = [];
        var sortedObjects = this.objects.sort(function (a, b) {

            return (Math.abs(a.forceX) + Math.abs(a.forceY)) - (Math.abs(b.forceX) + Math.abs(b.forceY));

        });
        sortedObjects.forEach(function(object){

            scene.objects.forEach(function (surObj) {

                if (surObj.name != object.name) {

                    if (getCollision(object, surObj)) {


                        var exist = false;
                        collisions.forEach(function (collision) {

                            if (collision[0] == object && collision[1] == surObj) {

                                exist = true;
                            }
                            else if (collision[1] == object && collision[0] == surObj) {

                                exist = true;

                            }
                        });
                        if (exist == false) {

                            collisions.push([object, surObj]);
                        }


                    }
                }

            });

        });
        return collisions;
    };
    this.redraw = function(){
        var scene = this;
        this.objects.forEach(function(object){

            object.redraw(scene);

        });
        for (var i = 0; i < 15; i++) {
            var collisions = scene.getCollisions();
            if (collisions.length > 0) {

                collisions.forEach(function (collision) {

                    displacementObj(collision[0], collision[1]);

                });

            }

        }

        this.objects.forEach(function(object){

            object.reset();
            if(object.x<0 || object.x>scene.width || object.y < 0 || object.y > scene.height){scene.removeObject(object)}

        });
        bge.trash.forEach(function(garbage){

            var objects = scene.objects;
            if(objects.indexOf(garbage) >= 0){
                console.log("Object removed:  " + garbage.name );
                garbage.controllers = null;
                objects.splice(objects.indexOf(garbage), 1);
                bge.globalObjectList.splice(bge.globalObjectList.indexOf(garbage), 1);
            }

        });
        bge.trash = [];
    };

    this.addObject = function(name, type, position, size, layer){

        var obj = new Object(name, type, position, size, layer);
        obj.scene = this.name;
        obj.game = this.game;
        this.objects.push(obj);
        return obj;
    };
    this.getObjects = function(name){

        var objects = this.objects;
        var objList = [];
        objects.forEach(function(object){

            if(object.name.indexOf(name)>=0){

                objList.push(object);

            }

        });
        return objList;
    };
    this.addGlobalObject = function(name){

        var go = false;
        bge.globalObjectList.forEach(function(object){

            if(object.name == name){

                go = object;

            }

        });
        if(go){
            var clone = this.cloneObject(go);
            clone.scene = this.name;
            clone.game = this.game;
            return clone;
        }
        return go;
    };
    this.addPrefab = function(name){

        var go = false;
        bge.prefabs.forEach(function(object){

            if(object.name == name){

                go = object;

            }

        });
        if(go){
            var clone = this.cloneObject(go);
            clone.scene = this.name;
            clone.game = this.game;
            console.log("prefab: "+ clone.name +"  " + clone.game + "  " + clone.scene + "  " + clone.controllers);
            return clone;
        }

    };
    this.removeObject = function(object){
        var objects = this.objects;
        if(objects.indexOf(object) >= 0){
            console.log("Object removed:  " + object.name );
            object.controllers = null;
            objects.splice(objects.indexOf(object), 1);
            bge.globalObjectList.splice(bge.globalObjectList.indexOf(object), 1);
        }

    };
    this.removeObjects = function(name){

        var objects = this.objects;
        objects.forEach(function(object){

            if(object.name == name){
                objects.splice(objects.indexOf(object), 1);
                bge.globalObjectList.splice(bge.globalObjectList.indexOf(object), 1);

            }

        });

    };
    this.cloneObject = function(o){

        var p,r = {};
        for (p in o)
        {//Needs a lot more work, just a basic example of a recursive copy function
            switch(true)
            {
                case o[p] instanceof Function:
                    r[p] = o[p];
                    break;
                case o[p] instanceof Date:
                    r[p] = new Date(o[p]);
                    break;
                case o === o[p]:
                    //simple circular references only
                    //a.some.child.object.references = a; will still cause trouble
                    r[p] = r;
                    break;
                case o[p] instanceof Array:
                    r[p] = o[p].slice(0);//copy arrays
                    break;
                default:
                    r[p] = o[p] instanceof Object ? cloneObject(o[p]) : o[p];
            }
        }
        r.controllers.forEach(function(controller){

            controller.owner = r;
            controller.sensors.forEach(function(sensor){ sensor.owner = r; });
            controller.actuators.forEach(function(actuator){ actuator.owner = r; });
        });

        this.objects.push(r);
        console.log("cloned object: " + r.game + "  " + r.scene + "  " + r.controllers);
        return r;

    };

}

