var Firebase = require('firebase');
var db = new Firebase('https://intense-inferno-3591.firebaseio.com/');
var Player = require('./player.js');
var Handlebars = require('handlebars');

$(document).ready(function(){
	$('#playerForm').on('submit', function(e) {
		e.preventDefault();
		var name = $('#playerName').val();
		db.push({
			location: {
				lat: "12345",
				long: "67890"
			},
			name: name
		});
		$('#playerName').val('');
		console.log('blah');
	});
});

db.on('child_added', function(snapshot) {
	var message = snapshot.val();
	var source = $('#entry-template').html();
	var template = Handlebars.compile(source);
	var html    = template(message);
	$('#target').append(html);
});