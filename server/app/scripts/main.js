var Firebase = require('firebase');
var db = new Firebase('https://blazing-heat-4042.firebaseio.com/callOfBuckley');
var Player = require('./player.js');
var Handlebars = require('handlebars');


db.on('child_added', function(snapshot) {
	updatehandlebars(snapshot);
});

function updatehandlebars(snapshot) {
	var message = snapshot.val();
	var source = $('#entry-template').html();
	var template = Handlebars.compile(source);
	var html    = template(message);

	$('#target').prepend(html);
	playerCount();
}

function playerCount() {
	db.once('value', function(snapshot) {
		var count = snapshot.numChildren();
		checkDistance(snapshot);
	});
}

function isObject(obj) {
  return obj === Object(obj);
}

db.on('child_changed', function(snapshot) {
	var all = [];
	var player = {};
	player.name = snapshot.val().player;
	player.lat = parseFloat(snapshot.val().location.l['0']);
	player.long = parseFloat(snapshot.val().location.l['1']);
	all.push(player);

	// here possibly we need something that checks there is more than one player before calling calculateDistance and if there are then iterate through each player checking distances from each other
	
	var lat1 = 51.5503051; //hardcoding player 2's coordinates as I have no phone friends :(
	var long1 = -0.0632027;

	if (calculateDistance(player.lat, player.long, lat1, long1) < 1) {
		var player = new Firebase('https://blazing-heat-4042.firebaseio.com/callOfBuckley/' + snapshot.key());
		player.update({close: "true"});
	} else {
		console.log('no dice');
	}
	updatehandlebars(snapshot);
});

function checkDistance(snapshot) {
	var all = [];
	snapshot.forEach(function(childSnapshot) {
		var player = {};
		var childData = childSnapshot.val();
		player.name = childData.player;
		player.location = childData.location.l;
		all.push(player);
	});

	var lat1 = parseFloat(all[0].location[0]);
	var lat2 = parseFloat(all[1].location[0]);
	var long1 = parseFloat(all[0].location[1]);
	var long2 = parseFloat(all[1].location[1]);

	if (calculateDistance(lat1, long1, lat2, long2) < 1) {
		var player = new Firebase('https://blazing-heat-4042.firebaseio.com/callOfBuckley/' + snapshot.key());
		player.update({close: "true"})
		console.log(key);
	} else {
		console.log('nope');
	}
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295;    // Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((lat2 - lat1) * p)/2 + 
          c(lat1 * p) * c(lat2 * p) * 
          (1 - c((lon2 - lon1) * p))/2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
