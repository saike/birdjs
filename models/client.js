//imports
var Object = require('./object');
var bge = require('../logic/bge');

var Client = module.exports = function(name, address){

    this.name = name;
    this.address = address;
    this.ui = [];
    this.game = false;
    this.activeCamera = false;
    this.clientObjects = [];
    this.keyboardState = [];
    this.mouseState = {x: 0, y: 0, clicked: []};
    this.clientMouseState = {x: 0, y: 0, clicked: []};
    this.touchState = [];

    this.addUIObject = function(name, position, size, layer){

        var obj = new Object(name, "ui", position, size, layer);
        obj.client = this;
        this.ui.push(obj);
        return obj;

    };
    this.getGame = function(){
        var client = this;
        var g = false;
        bge.games.forEach(function(game){

            if(game.name == client.game){

                g = game;

            }

        })
        return g;
    }


}
