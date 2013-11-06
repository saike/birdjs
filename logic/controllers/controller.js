//////////////////////
///Basic Controller///
exports.basicController = function(name, obj){


        this.name = name;
        this.owner = obj;
        this.sensors = [];
        this.actuators = [];
        this.activate = function(){

            var sensPositive = true;
            var targets = [];
            this.sensors.forEach(function(sens){

                if(!sens.positive()){

                    sensPositive = false;

                }
                else{

                    if(sens.targets && sens.targets.length > 0){
                        sens.targets.forEach(function(target){

                            targets.push(target);

                        });

                    }

                }

            });
            if (sensPositive){
                this.actuators.forEach(function(actu){

                    actu.activate(targets);

                });

            }
        };

}

///////////////////
///Or controller///
exports.orController = function(name, obj){


    this.name = name;
    this.owner = obj;
    this.sensors = [];
    this.actuators = [];
    this.activate = function(){
        var targets = [];
        var sensPositive = false;

        this.sensors.forEach(function(sens){

            if(sens.positive()){

                sensPositive = true;
                if(sens.targets && sens.targets.length > 0){
                    sens.targets.forEach(function(target){

                        targets.push(target);

                    });

                }
            }

        });
        if (sensPositive){

            this.actuators.forEach(function(actu){

                actu.activate(targets);

            });

        }
    };

}

