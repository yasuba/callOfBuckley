var Firebase = require('firebase');
var db = new Firebase('https://intense-inferno-3591.firebaseio.com/');
var Player = require('./player.js');
var Handlebars = require('handlebars');

$(document).ready(function(){
	$('#playerForm').on('submit', function(e) {
		e.preventDefault();
		var name = $('#playerName').val();
		var lat = $('#lat').val();
		var long = $('#long').val();
		db.push({
			player: name,
			location: {
				lat: lat,
				long: long
			}
		});
		$('#playerName').val('');
	});
	getPlayerLocation('Maya');

});

db.on('child_added', function(snapshot) {
	var message = snapshot.val();
	var source = $('#entry-template').html();
	var template = Handlebars.compile(source);
	var html    = template(message);
	$('#target').prepend(html);
	playerCount();
});

function playerCount() {
	db.once('value', function(snapshot) {
		var count = snapshot.numChildren();
		$('.js-player-count').text('count: ' + count);
	});
}

function getPlayer(name) {
	var player = "s";
	db.orderByChild('player').equalTo(name).on('child_added', function(snapshot) {
		var player = "hello";
	});
	console.log(player);
	return player;
}

function getPlayerLocation(name) {
	var location = getPlayer("Maya");
	console.log(getPlayer("Maya"));
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
