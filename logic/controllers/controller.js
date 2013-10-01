//MAIN CONTROLLER
var Controller = module.exports = function(name, obj){


        this.name = name;
        this.owner = obj;
        this.sensors = [];
        this.actuators = [];
        this.activate = function(){

            var sensPositive = true;

            this.sensors.forEach(function(sens){

                if(!sens.positive()){

                    sensPositive = false;

                }

            });
            if (sensPositive){

                this.actuators.forEach(function(actu){

                    actu.activate();

                });

            }
        };

}
