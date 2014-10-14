require(['GameOfLife'], function(GameOfLife) {
	var elem = document.getElementById('myCanvas');
    var game = new GameOfLife(elem, 100 /*size*/, 100 /*frequency*/);
    game.play();
});
