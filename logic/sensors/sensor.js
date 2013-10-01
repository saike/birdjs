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
