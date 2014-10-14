
define(function() {
    function GameOfLife(elem, size, updateFrequency) {
        var CELL_SIZE = 10;

        this.elem = elem;
        this.size = size;
        this.updateFrequency = updateFrequency;

        this.board = new Array(size * size);

        this.createBoard = function() {
            var len = this.size * this.size;
            var i;
            
            for (i = 0; i < len; i++) {
                this.board[i] = Math.random() >= 0.5;
            }
        }

        this.draw = function() {
            var ctx = this.elem.getContext('2d');
            var WHITE = '#FFFFFF';
            var BLACK = '#000000';

            for (var i = 0; i < this.size; i++) {
                for (var j = 0; j < this.size; j++) {
                    ctx.fillStyle = this.board[i*size + j] ? BLACK : WHITE;
                    ctx.fillRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            }
        }

        this.init = function() {
            this.createBoard();

            var newBoard = new Array(this.size * this.size);
            for (var i = 0; i < this.board.length; i++) {
                newBoard[i] = this.getCellNextState(i);
            }
            this.board = newBoard;
            this.draw();
            this.timeout = setTimeout(this.update.bind(this), this.updateFrequency);
        }

        this.update = function() {
            var numAliveCells = 0;
            for (var i = 0; i < this.board.length; i++) {
                this.updateCell(i);
                if (this.board[i]) { numAliveCells++; }
            }
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
            this.board[idx] = this.getCellNextState(idx);
        }

        this.getCellNextState = function(idx) {
            var liveNeighbors = this.countLiveNeighbors(idx);
            if (this.board[idx] /*is cell alive?*/) {
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