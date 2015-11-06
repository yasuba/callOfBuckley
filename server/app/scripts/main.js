var Firebase = require('firebase');
var db = new Firebase('https://intense-inferno-3591.firebaseio.com/');
var Player = require('./player.js');
var Handlebars = require('handlebars');

$(document).ready(function(){
	$('#playerForm').on('submit', function(e) {
		e.preventDefault();
		var name = $('#playerName').val();
		db.push({
			player: name,
			location: {
				lat: "12345",
				long: "67890"
			}
		});
		$('#playerName').val('');
	});
});

db.on('child_added', function(snapshot) {
	var message = snapshot.val();
	var source = $('#entry-template').html();
	var template = Handlebars.compile(source);
	var html    = template(message);
	$('#target').append(html);
	playerCount();
});

function playerCount() {
	db.once('value', function(snapshot) {
		var count = snapshot.numChildren();
		$('.js-player-count').text('count: ' + count);
	});
}
