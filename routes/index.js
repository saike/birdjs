
var bge = require('../logic/bge');
var Client = require('../models/client');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { games: bge.games });
};

/*
 * GET game page.
 */

exports.game = function(req, res){
    var gameName = req.param("name");
    function getClientAddress(request){
        with(request)
            return (headers['x-forwarded-for'] || '').split(',')[0]
                || connection.remoteAddress
    }
    var address = getClientAddress(req);
    console.log(address);
    if(gameName && bge.getGame(gameName)){
        var game = bge.getGame(gameName);
        if(game.getClient(address)){

            res.render('game', { title: 'Express' });

        }
        else{

            var newClient = new Client(address, address);
            newClient.game = game.name;
            game.clients.push(newClient);
            bge.clients.push(newClient);
            res.render('game', { title: 'Express' });

        }
        console.log(game.clients);
    }
    else {

        res.render('error', { title: 'Express' });


    }

};