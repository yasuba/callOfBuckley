var Firebase = require('firebase');
var db = new Firebase('https://intense-inferno-3591.firebaseio.com/');
var Player = require('./player.js');
var Handlebars = require('handlebars');

var players = [];

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
			},
			close: 'false'
		});
		$('#playerName').val('');
	});
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
	});
}

db.on('value', function(snapshot) {
	var all = [];
	snapshot.forEach(function(childSnapshot) {
		var player = {};
		var childData = childSnapshot.val();
		player.name = childData.player;
		player.location = [childData.location.lat, childData.location.long];
		all.push(player);
	});

	var lat1 = parseFloat(all[0].location[0]);
	var lat2 = parseFloat(all[1].location[0]);
	var long1 = parseFloat(all[0].location[1]);
	var long2 = parseFloat(all[1].location[1]);

	if (calculateDistance(lat1, long1, lat2, long2) < 1) {
		for (var key in snapshot.val()) {
			var player = new Firebase('https://intense-inferno-3591.firebaseio.com/' + key);
			player.update({close: "true"})
		}
	}
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
