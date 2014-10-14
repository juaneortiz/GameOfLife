require(['GameOfLife'], function(GameOfLife) {
	var elem = document.getElementById('myCanvas');
    var game = new GameOfLife(elem, 50, 100);
    game.play();
});
