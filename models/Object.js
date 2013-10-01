var Object = module.exports = function(name, type, position, size){

    this.name = name;
    this.type = type;
    this.x = position[0];
    this.y = position[1];
    this.width = size[0];
    this.height = size[1];
    this.top = function(){return this.y};
    this.bottom = function(){return (this.y + this.height)};
    this.left = function(){return this.x};
    this.right = function(){return (this.x + this.width)};
    this.vx = 0;
    this.vy = 0;
    this.keyboardState = [];
    this.mouseState = {x: 0, y: 0, clicked: []};
    this.controllers = [];
    this.redraw = function(scene){
        if(this.type != "ghost"){
            this.controllers.forEach(function (controller) {

                controller.activate();


            });
            if(parseInt(this.vx) > 0) {

                this.vx = this.vx-scene.gravity;

            }
            else if(parseInt(this.vx) < 0){

                this.vx = this.vx+scene.gravity;

            }
            if(this.bottom() + this.vy < scene.height){

                this.vy = this.vy + scene.gravity;

            }
            if(this.bottom() + this.vy > scene.height){

                this.vy = 0;
                this.y = scene.height - this.height;

            }


        }

        this.x += this.vx;
        this.y += this.vy;
    };


}
