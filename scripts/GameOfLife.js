
define(function() {
    function GameOfLife(elem, size, updateFrequency) {
        var CELL_SIZE = 5;
        var DEAD_COLOR = '#FFFFFF';
        var ALIVE_COLOR = '#000000';

        this.elem = elem;
        this.size = size;
        this.updateFrequency = updateFrequency;
        this.ctx = this.elem.getContext('2d');

        this.board = new Array(size * size);

        this.createBoard = function() {
            var len = this.size * this.size;
            var i;
            
            for (i = 0; i < len; i++) {
                this.board[i] = Math.random() >= 0.5;
            }
        }

        this.draw = function() {
            //this.ctx.clearRect(0, 0, size * CELL_SIZE, size * CELL_SIZE);

            // DEBUG
            //ALIVE_COLOR = randomHexColor();

            for (var i = 0; i < this.size; i++) {
                for (var j = 0; j < this.size; j++) {
                    this.ctx.fillStyle = this.board[i*size + j] ? ALIVE_COLOR : DEAD_COLOR;
                    this.ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }

        this.drawCell = function(idx, change) {
            var x = this.getCol(idx) * CELL_SIZE;
            var y = this.getRow(idx) * CELL_SIZE;

            this.ctx.fillStyle = this.board[idx] ? ALIVE_COLOR : DEAD_COLOR;
            this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }

        this.init = function() {
            ALIVE_COLOR = randomHexColor();
            this.createBoard();
            this.draw();
            this.update();
        }

        this.update = function() {
            var numAliveCells = 0;
            var newBoard = new Array(this.size * this.size);

            for (var i = 0; i < this.board.length; i++) {
                newBoard[i] = this.getCellNextState(i);
                if (newBoard[i]) { numAliveCells++; }
            }
            this.board = newBoard;
            this.draw();

            if (numAliveCells === 0) {
                console.log('All cells are dead!');
                this.init();
            }
            else {
                this.timeout = setTimeout(this.update.bind(this), this.updateFrequency);
            }
        }

        this.play = function() {
            this.init();
        }

        this.stop = function() {
            clearTimeout(this.timeout);
        }

        this.updateCell = function(idx) {
            var oldVal = this.board[idx];
            this.board[idx] = this.getCellNextState(idx);
            this.drawCell(idx, oldVal !== this.board[idx]);
        }

        this.getCellNextState = function(idx) {
            var liveNeighbors = this.countLiveNeighbors(idx);
            //return this.conwayRules(this.board[idx], liveNeighbors);
            return this.experimentalRules(this.board[idx], liveNeighbors);
        }

        this.conwayRules = function(isCellAlive, liveNeighbors) {
            if (isCellAlive) {
                // Any live cell with fewer than 2 neighbors dies, by under-population.
                // Any live cell with 2 or 3 live neighbors lives onto the next generation.
                // Any live cell with more than 3 neighbors dies, by overcrowding.
                return liveNeighbors === 2 && liveNeighbors === 3; // remain alive, otherwise die
            }
            else {
                // Any dead cell with exactly 3 live neighbors becomes a live cell, by reproduction.
                return liveNeighbors === 3;
            }
        }

        this.experimentalRules = function(isCellAlive, liveNeighbors) {
            if (isCellAlive) {
                return liveNeighbors > 3;
            }
            else {
                return liveNeighbors === 0;
            }
        }

        this.getNeighbors = function(idx) {
            return [
                this.board[ this.getLeftTop(idx)    ],
                this.board[ this.getTop(idx)        ],
                this.board[ this.getTopRight(idx)   ],
                this.board[ this.getLeft(idx)       ],
                this.board[ this.getRight(idx)      ],
                this.board[ this.getBottomLeft(idx) ],
                this.board[ this.getBottom(idx)     ],
                this.board[ this.getBottomRight(idx)]
            ];
        }

        this.countLiveNeighbors = function(idx) {
            var liveNeighbors = 0;
            var neighbors = this.getNeighbors(idx, this.size);
            for (var i = 0; i < neighbors.length; i++) {
                if (neighbors[i]) {
                    liveNeighbors++;
                }
            }
            return liveNeighbors;
        }

        function randomHexColor() {
            return '#' + Math.round(Math.random() * 0xFFFFFF).toString(16);
        }

        //////////////////////////////////////////////////////////
        //  Helper Functions
        //////////////////////////////////////////////////////////
        this.getLeftTop = function(idx) {
            return this.getPrevRow(idx) * this.size + this.getPrevCol(idx);
        }

        this.getTop = function(idx) {
            return this.getPrevRow(idx) * this.size + this.getCol(idx);
        }

        this.getTopRight = function(idx) {
            return this.getPrevRow(idx) * this.size + this.getNextCol(idx);
        }

        this.getLeft = function(idx) {
            return this.getRow(idx) * this.size + this.getPrevCol(idx);
        }

        this.getRight = function(idx) {
            return this.getRow(idx) * this.size + this.getNextCol(idx);
        }

        this.getBottomLeft = function(idx) {
            return this.getNextRow(idx) * this.size + this.getPrevCol(idx);
        }

        this.getBottom = function(idx) {
            return this.getNextRow(idx) * this.size + this.getCol(idx);
        }

        this.getBottomRight = function(idx) {
            return this.getNextRow(idx) * this.size + this.getNextCol(idx);
        }

        this.getCol = function(idx) {
            return idx % this.size;
        }

        this.getRow = function(idx) {
            return Math.floor(idx/this.size);
        }

        this.getPrevCol = function(idx) {
            var col = this.getCol(idx);
            return col === 0 ? (this.size - 1) : col - 1;
        }

        this.getNextCol = function(idx) {
            var col = this.getCol(idx);
            return col === (this.size - 1) ? 0 : col + 1;
        }

        this.getPrevRow = function(idx) {
            var row = this.getRow(idx);
            return row === 0 ? this.size - 1 : row -1 
        }

        this.getNextRow = function(idx) {
            var row = this.getRow(idx);
            return row === (this.size - 1) ? 0 : row + 1;
        }

        return {
            play: this.play.bind(this),
            stop: this.stop.bind(this)
        };
    }
    return GameOfLife;
});