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

};

///////////////////
///If controller

exports.ifController = function(name, obj, expression){

    this.name = name;
    this.owner = obj;
    this.expression = expression;
    this.sensors = [];
    this.actuators = [];
    this.activate = function(){
        var targets = [];
        var sensPositive = true;
        var exp = this.expression;
        var expressionResult = false;
        var owner = this.owner;
        if(exp.indexOf(">=") >= 0){

            var splittedExp = exp.split(">=");
            var a = splittedExp[0].trim();
            var b = splittedExp[1].trim();
            if(isNaN(a) && owner[a]){

                a = owner[a];

            }

            if(isNaN(b) && owner[b]){
                b = owner[b];

            }
            if(!isNaN(a) && !isNaN(b)){

                expressionResult = moreEqThan(a,b);
//                console.log("expression result: " + a + " more than " + b + "  " + expressionResult);

            }

        }
        else if(exp.indexOf("<=") >= 0){

            var splittedExp = exp.split("<=");
            var a = splittedExp[0].trim();
            var b = splittedExp[1].trim();
            if(isNaN(a) && owner[a]){

                a = owner[a];

            }

            if(isNaN(b) && owner[b]){
                b = owner[b];

            }
            if(!isNaN(a) && !isNaN(b)){

                expressionResult = minEqThan(a,b);
//                console.log("expression result: " + a + " less than " + b + "  " + expressionResult);

            }

        }
        else if(exp.indexOf(">") >= 0){

            var splittedExp = exp.split(">");
            var a = splittedExp[0].trim();
            var b = splittedExp[1].trim();
            if(isNaN(a) && owner[a]){

                a = owner[a];

            }

            if(isNaN(b) && owner[b]){
                b = owner[b];

            }
            if(!isNaN(a) && !isNaN(b)){

                expressionResult = moreThan(a,b);
//                console.log("expression result: " + a + " more than " + b + "  " + expressionResult);

            }

        }
        else if(exp.indexOf("<") >= 0){

            var splittedExp = exp.split("<");
            var a = splittedExp[0].trim();
            var b = splittedExp[1].trim();
            if(isNaN(a) && owner[a]){

                a = owner[a];

            }

            if(isNaN(b) && owner[b]){
                b = owner[b];

            }
            if(!isNaN(a) && !isNaN(b)){

                expressionResult = minThan(a,b);
//                console.log("expression result: " + a + " less than " + b + "  " + expressionResult);

            }

        }
        else if(exp.indexOf("=") >= 0){

            var splittedExp = exp.split("=");
            var a = splittedExp[0].trim();
            var b = splittedExp[1].trim();
            if(isNaN(a) && owner[a]){

                a = owner[a];

            }

            if(isNaN(b) && owner[b]){
                b = owner[b];

            }
            if(!isNaN(a) && !isNaN(b)){

                expressionResult = equals(a,b);
//                console.log("expression result: " + a + " equals " + b + "  " + expressionResult);

            }

        }
        function moreThan(a,b){return a>b;};
        function minThan(a,b){return a<b};
        function moreEqThan(a,b){return a>=b;};
        function minEqThan(a,b){return a<=b};
        function equals(a,b){return a==b};

        if(expressionResult){

            this.sensors.forEach(function(sens){

                if(!sens.positive()){

                    sensPositive = false;

                }
                else {

                    if(sens.targets && sens.targets.length > 0){
                        sens.targets.forEach(function(target){

                            targets.push(target);

                        });

                    }

                }

            });
            if (sensPositive){
                console.log("ACTIVATE FROM EXPRESSION");

                this.actuators.forEach(function(actu){
                    actu.activate(targets);

                });

            }

        }

    };


};

