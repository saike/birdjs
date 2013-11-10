exports.scenes = [];

exports.globalObjectList = [];

exports.clients = [];

///Games list

exports.games = [];

exports.getGame = function(name){

    var returnGame = false;
    exports.games.forEach(function(game){

        if(game.name == name){

            returnGame = game;

        }

    });
    return returnGame;
};

exports.getClient = function(address){

    var c = false;
    exports.clients.forEach(function(client){

        if(client.address == address || client.address == "127.0.0.1"){

            c = client;

        }

    });
    return c;

};

exports.removeClient = function(address){

    var c = false;
    exports.clients.forEach(function(client){

        if(client.address == address || client.address == "127.0.0.1"){

            c = client;

        }

    });
    if(c.game){

        var g = exports.getGame(c.game);
        if(g){

            g.clients.splice(g.clients.indexOf(c), 1);

        }
    }
    exports.clients.splice(exports.clients.indexOf(c), 1);

}


