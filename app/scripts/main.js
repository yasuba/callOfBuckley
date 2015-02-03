$(document).ready(function(){
	$('.js-clickMe').on('click', function(){
		$('.js-clicked').text('It works!');
	});

	$('h1').text('hello');
});