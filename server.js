


var express = require('express');
var app = express();
var serv = require('http').Server(app);
 
app.use('/client',express.static(__dirname + '/client'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
 
serv.listen(8080, function () {
  console.log(`Listening on ${serv.address().port}`);
});

var BarrelFunction;
	

	
var io = require('socket.io').listen(serv);
var players = {};
var users = 0;
var user = [];
	user[0] = 0;
	user[1] = 0;

io.sockets.on('connection', function(socket){
    console.log('new socket connection');
    users++;
    if(users > 2){
    	socket.emit('fullServer');
    	users--;
    }else{
	    console.log(users+' Users on Page');
	    // create a new player and add it to our players object
		

		if(user[0] == 0){
			players[socket.id] = {
		  	x: 100,
		  	y: 100,
		  	playerId: socket.id,
		  	turn: '-standRight'
			};
			user[0] = players[socket.id];
		}else{
			players[socket.id] = {
		  	x: 700,
		  	y: 100,
		  	playerId: socket.id,
		  	turn: '-standleft'
			};
			user[1] = players[socket.id];
		}

		if(users == 2){
			socket.broadcast.emit('countdown');
			socket.emit('countdown');
		}
		
		socket.on('playerCharakter', function (charakterData) {
		  players[socket.id].charakter = charakterData.charakter;
		  players[socket.id].playername = charakterData.playername;
		  players[socket.id].otherplayerlife = charakterData.playerlife;
		  // update all other players of the new player
		  socket.broadcast.emit('newPlayer', players[socket.id]);
		});
		
		socket.on('specialAt', function(turn){
			socket.broadcast.emit('otherSpecial', turn);
		});
		
		socket.on('beam-stop', function() {
			socket.broadcast.emit('endBeam');
		});
		
		socket.on('otherSpider', function(){
			socket.broadcast.emit('createOtherSpider');
		});
			


		socket.emit('currentPlayers', players);
		
		
		
		

	    socket.on('disconnect',function(){
	        console.log('user left the game');
	        io.emit('userleftServer');
	        users--;
	        if(user[1] == players[socket.id]){
				user[1] = 0;
				// remove this player from our players object
				delete players[socket.id];

				// emit a message to all players to remove this player
				io.emit('disconnect', socket.id);
			}
			if(user[0] == players[socket.id]){
				user[0] = 0;
				// remove this player from our players object
				delete players[socket.id];

				// emit a message to all players to remove this player
				io.emit('disconnect', socket.id);
			}
	       
	    });



	    socket.on('smashBarrelAni',function(){
	        socket.broadcast.emit('BarrelAnimation');
	    });

	    socket.on('smashBarrel',function(){
	        socket.broadcast.emit('BarrelDelet');
	    });
		
		socket.on('addProjectile',function(info){
			socket.broadcast.emit('addProjectileOtherP', {turn:info.turn, specialProj: info.specialProj});
		});
		
		socket.on('aura-start',function(){
			socket.broadcast.emit('aura-ON');
		});
		
		socket.on('aura-stop',function(){
			socket.broadcast.emit('aura-OFF');
		});

		socket.on('hurt',function(){
	        socket.broadcast.emit('lost-HP');
	    });
		
		socket.on('hurt-harder',function(){
	        socket.broadcast.emit('lost-HP-Super');
	    });

	    
		

	   

	    // when a player moves, update the player data
		socket.on('playerMovement', function (movementData) {
		  players[socket.id].x = movementData.x;
		  players[socket.id].y = movementData.y;
		  // emit a message to all players about the player that moved
		  socket.broadcast.emit('playerMoved', players[socket.id]);
		});

		

		 // when a player turns, update the player data
		socket.on('playerTurn', function (movementData) {
		  players[socket.id].turn = movementData.turn;
		  // emit a message to all players about the player that turned
		  socket.broadcast.emit('playerTurned', players[socket.id]);
		});
    }
    
});

