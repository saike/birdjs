var bge = require('../logic/bge');

var Game = module.exports = function(name){

    this.name = name;
    this.clients = [];
    this.currentScene = false;
    this.scenes = [];
    this.getScene = function(sceneName){
       var getScene = false;
       this.scenes.forEach(function(scene){

           if(scene.name == sceneName){

               getScene = scene;

           }

       });
       return getScene;
    };
    this.addScene = function(scene){

        this.scenes.push(scene);

    };
    this.setCurrentScene = function(name){
        var game = this;
        var curScene = false;
        game.scenes.forEach(function(scene){

            if(scene.name == name){

                curScene = scene;

            }

        });
        if(curScene){

            game.currentScene = curScene;

        }

    };
    this.getClient = function(address){

        var c = false;
        var game = this;
        game.clients.forEach(function(client){

            if(client.address == address){

                c = client;

            }

        });
        return c;

    };
};
