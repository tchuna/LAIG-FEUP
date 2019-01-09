/*
* TODO: Fix game over
* TODO: set movement animation
* TODO: create computer player
* TODO: Connect to Prolog
*/

function Game(scene, numberOfPlayers) {
    CGFobject.call(this, scene);
    this.scene = scene;

    this.directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    this.colors = ['red', 'green', 'blue', 'white', 'black'];
    this.init(numberOfPlayers);

    this.scene.interface.addPlayerTurnGroup(this.playerTurn);
    this.scene.interface.addGameModeGroup();
}

Game.prototype = Object.create(CGFobject.prototype);
Game.prototype.constructor = Game;

/**
 * Initialize game parameters
 * @param numberOfPlayers
 */
Game.prototype.init = function (numberOfPlayers) {
    if (numberOfPlayers >= 2 && numberOfPlayers <= 4) {
        this.numberOfPlayers = numberOfPlayers;
    } else {
        console.warn('Warning: invalid number of players. Accepted values: 2 ~ 4. Setting to default (2 players)');
        this.numberOfPlayers = 2;
    }
    this.playersColor = [];
    for (let i = 0; i < this.numberOfPlayers; i++) {
        this.playersColor.push(this.colors[i]);
    }
    this.initializeBoard();
    this.gameOver = false;
    this.turn = 0;
    this.playerTurn = this.playersColor[0];
    this.printed = false;
    this.lastTurn = false;
    this.lastColor = null;



    switch (this.numberOfPlayers) {
        case 2:
            this.setPiece(0, this.playersColor[1], 'NW');
            this.setPiece(2, this.playersColor[0], 'N');
            this.setPiece(6, this.playersColor[1], 'N');
            this.setPiece(36, this.playersColor[0], 'W');
            this.setPiece(44, this.playersColor[1], 'E');
            this.setPiece(74, this.playersColor[0], 'S');
            this.setPiece(78, this.playersColor[1], 'S');
            this.setPiece(80, this.playersColor[0], 'SE');
            break;
        case 3:
            this.setPiece(2, this.playersColor[0], 'N');
            this.setPiece(4, this.playersColor[1], 'N');
            this.setPiece(6, this.playersColor[2], 'N');
            this.setPiece(18, this.playersColor[1], 'W');
            this.setPiece(26, this.playersColor[1], 'E');
            this.setPiece(36, this.playersColor[0], 'W');
            this.setPiece(44, this.playersColor[2], 'E');
            this.setPiece(74, this.playersColor[0], 'S');
            this.setPiece(78, this.playersColor[2], 'S');
            break;
        case 4:
            this.setPiece(2, this.playersColor[0], 'N');
            this.setPiece(4, this.playersColor[1], 'N');
            this.setPiece(6, this.playersColor[2], 'N');
            this.setPiece(18, this.playersColor[1], 'W');
            this.setPiece(26, this.playersColor[1], 'E');
            this.setPiece(36, this.playersColor[0], 'W');
            this.setPiece(44, this.playersColor[2], 'E');
            this.setPiece(54, this.playersColor[3], 'W');
            this.setPiece(62, this.playersColor[3], 'E');
            this.setPiece(74, this.playersColor[0], 'S');
            this.setPiece(76, this.playersColor[3], 'S');
            this.setPiece(78, this.playersColor[2], 'S');
            break;
    }

    this.gameMode = "PvP";
};

Game.prototype.start = function() {
  this.display();


  if (!this.gameOver) {
      if (this.gameMode === 'CvC') {
          if (this.computer(this.playerTurn)) {
              this.playerTurn = this.playersColor[++this.turn % this.numberOfPlayers];
              this.scene.interface.updatePlayerTurn(this.playerTurn);
          }
      } else if (this.gameMode === 'PvC') {
          if (this.playerTurn !== this.playersColor[0]) {
              this.computer(this.playerTurn);
              this.playerTurn = this.playersColor[++this.turn % this.numberOfPlayers];
              this.scene.interface.updatePlayerTurn(this.playerTurn);
          }
      }
  }
};

/**
 * Display game
 */
Game.prototype.display = function () {
    this.checkGameOver();
    this.scene.pushMatrix();
    if (!this.printed && this.lastTurn && this.playerTurn === this.lastColor) {
        this.setGameOver(true);
        this.printed = true;
    }
    if (this.board !== undefined) {
        this.board.display();
    }
    this.scene.popMatrix();
};

/**
 * Restart game
 */
Game.prototype.restart = function () {
    let players;

    while (true) {
        players = prompt('Number of Players (min: 2 | max: 5)');
        players = (players === null) ? null : parseInt(players);

        if (players !== null && players >= 2 && players <= 4) {
            break;
        }
    }
    if (players !== null) {
        this.scene.index = 1;
        this.scene.interface.updateGameModeGroup();
        this.init(players);
    }
};

/**
 * Set whether game is over
 * @param gameOver
 */
Game.prototype.setGameOver = function (gameOver) {
    if (gameOver) {
        this.gameOver = gameOver;
        if (gameOver) {
            if (confirm('Game Over. Would you like to play again?')) {
                this.restart();
            }
        }
    }
};

/**
 * Return true if game is over and false otherwise
 * @returns {boolean|*}
 */
Game.prototype.getGameOver = function () {
    return this.gameOver;
};

/**
 * Check if game meets the over conditions
 */
Game.prototype.checkGameOver = function () {
    let existence = this.board.checkPieceExistence();
    let mobility = this.board.checkPiecesMobility();
    let color;

    for (let i = 0; i < this.colors.length; i++) {
        color = this.playersColor[i];
        if (!existence[color] || !mobility[color]) {
            this.lastTurn = true;
            this.lastColor = color;
            return;
        }
    }
};

/**
 * Set the number of players
 * @param number
 */
Game.prototype.setNumberOfPlayers = function (number) {
    if (number > 0 && number < 6) {
        this.numberOfPlayers = number
    } else {
        console.warn('Warning: passing argument number to function setNumberOfPlayers on Game is invalid');
    }
};

/**
 * return number of players
 * @returns {number}
 */
Game.prototype.getNumberOfPlayers = function () {
    return this.numberOfPlayers;
};

/**
 * Initialize a new board
 */
Game.prototype.initializeBoard = function () {
    this.board = new Board(this.scene);
};

/**
 * Set game board
 * @param board
 */
Game.prototype.setBoard = function (board) {
    if (board instanceof Board) {
        this.board = board;
    } else {
        console.warn('Warning: passing argument board to function setBoard on Game is invalid');
    }
};

/**
 * Return game board
 * @returns {Board}
 */
Game.prototype.getBoard = function () {
    return this.board
};

/**
 * Place piece in cell given by cellID
 * @param index
 * @param color
 * @param direction
 */
Game.prototype.setPiece = function (index, color, direction) {
    if (index < 0 || index > 80) {
        console.warn('Warning: passing argument index to function setPiece on Game is invalid');
    } else if (!this.colors.includes(color)) {
        console.warn('Warning: passing argument color to function setPiece on Game is invalid');
    } else if (!this.directions.includes(direction)) {
        console.warn('Warning: passing argument direction to function setPiece on Game is invalid');
    } else {
        this.board.placePiece(index, color, direction);
    }
};

/**
 * Return the piece given by index
 * @param index
 * @returns {piece | null}
 */
Game.prototype.getPiece = function (index) {
    if (index >= 82 && index <= 81 + (4 * this.getNumberOfPlayers())) {
        return this.board.getPiece(index);
    } else {
        console.warn('Warning: passing argument index to function getPiece on Game is invalid');
    }
    return null;
};

/**
 * Returns the piece in cell given by index
 * @param index
 * @returns {piece}
 */
Game.prototype.getPieceByCellId = function (index) {
    if (index >= 0 && index < 81) {
        return this.board.getPieceByCellId(index);
    } else {
        console.warn('Warning: passing argument index to function getPieceByCellId on Game is invalid');
        return null;
    }
};

/**
 * Highlight piece
 * @param id
 */
Game.prototype.highlightPiece = function (id) {
    if (id >= 82 && id <= 81 + (4 * this.getNumberOfPlayers())) {
        this.board.highlightPiece(id);
    } else {
        console.warn('Warning: passing argument id to function setSelectedPiece on Game is invalid');
    }
};

/**
 * Clear all pieces highlight
 */
Game.prototype.clearAllPiecesHighlight = function () {
    this.board.clearAllPiecesHighlight();
};

/**
 * Set selected piece
 * @param id
 */
Game.prototype.setSelectedPiece = function (id) {
    if (id === -1 || (id > 81 && id <= 81 + (4 * this.getNumberOfPlayers()))) {
        this.board.setSelectedPieceID(id);
    } else {
        console.warn('Warning: passing argument id to setSelectedPiece on Game is invalid');
    }
};

/**
 * Return the selected piece id
 * @returns {number}
 */
Game.prototype.getSelectedPiece = function () {
    return this.board.getSelectedPieceID();
};

/**
 * Enable dot display in cell given by index
 * @param index
 */
Game.prototype.enableDot = function (index) {
    if (index >= 0 && index < 81) {
        this.board.enableDot(index);
    } else {
        console.warn('Warning: passing argument index to function enableDot on Game is invalid');
    }
};

/**
 * Set the color of the dot located in the cell given by index
 * @param color
 * @param index
 */
Game.prototype.setDotColor = function (color, index) {
    this.board.setDotColor(index, color);
};

/**
 * Returns the color of the dot located in the cell given by index
 * @param index
 * @returns {color}
 */
Game.prototype.getDotColor = function (index) {
    if (index >= 0 && index < 81) {
        return this.board.getDotColor(index);
    } else {
        console.warn('Warning: passing argument index to function getDotColor on Game is invalid');
        return null;
    }
};

/**
 * Move piece to cell given by index
 * @param index
 */
Game.prototype.move = function (index) {
    if (!this.getGameOver()) {
        let id = this.board.getSelectedPieceID();
        if (id !== -1) {
            if (this.getPiece(id).color === this.playerTurn) {
                if (index > 0 && index <= 81) {
                    this.board.movePiece(index);
                    this.playerTurn = this.playersColor[++this.turn % this.numberOfPlayers];
                    this.scene.interface.updatePlayerTurn(this.playerTurn);
                } else {
                    console.warn('Warning: passing argument index to function move on Game is invalid');
                }
            }
        }
    } else {
        console.warn('Warning: game is over!');
    }
};

/**
 * Computer movement logic
 * @param color
 * @returns {boolean}
 */
Game.prototype.computer = function (color) {
    let indexes = [];
    let random;
    let cell;
    let piece;
    let directions;
    let power;
    let cellsToMove;
    let directionToMove;
    let destinationCell;
    let area_i;
    let area_f;
    let multiplier;
    let pieceInTheWay = false;
    let dotInTheWay = false;
    let attempts = 10;

    this.board.cells.forEach(function (value, index) {
       if (value.hasPiece()) {
           piece = value.getPiece();
           if (piece.color === color && piece.ableToMove) {
               indexes.push(index);
           }
       }
    });

    if (indexes.length > 0) {
        /* Get cell id and piece */
        random = this.getRandomInt(indexes.length);
        cell = indexes[random];
        piece = this.getPieceByCellId(cell);

        /* Get piece power */
        power = this.board.getMaximumCellsToMove(this.board.determineAreaByCellID(cell), piece.color);

        /* Get movement direction */
        directions = this.getRangeFromDirection(piece.direction);
        random = this.getRandomInt(directions.length);
        directionToMove = directions[random];

        while (attempts--) {
            /* Get number of cells to move */
            cellsToMove = this.getRandomInt(power + 1);
            if (cellsToMove === 0) {
                cellsToMove = 1;
            }

            /* Get destination cell */
            switch (directionToMove) {
                case 'N':
                    destinationCell = cell + (cellsToMove * 9);
                    multiplier = 9;
                    break;
                case 'NE':
                    destinationCell = cell + (cellsToMove * 8);
                    multiplier = 8;
                    break;
                case 'E':
                    destinationCell = cell - cellsToMove;
                    multiplier = -1;
                    break;
                case 'SE':
                    destinationCell = cell - (cellsToMove * 10);
                    multiplier = -10;
                    break;
                case 'S':
                    destinationCell = cell - (cellsToMove * 9);
                    multiplier = -9;
                    break;
                case 'SW':
                    destinationCell = cell - (cellsToMove * 8);
                    multiplier = -8;
                    break;
                case 'W':
                    destinationCell = cell + cellsToMove;
                    multiplier = 1;
                    break;
                case 'NW':
                    destinationCell = cell + (cellsToMove * 10);
                    multiplier = 10;
                    break;
            }

            if (destinationCell >= 0 &&
                destinationCell < 81 &&
                this.getPieceByCellId(destinationCell) === null &&
                (this.getDotColor(destinationCell) === null || this.getDotColor(destinationCell) === piece.dotColor)) {
                break;
            }
        }

        if (attempts === 0) {
            return true;
        }

        /* Movement */
        this.board.cells[cell].setPiece2(null);

        if (this.getDotColor(destinationCell) !== null) { /* Connection movement */
            if (destinationCell > cell) {
                for (let i = cell+multiplier; destinationCell - i >= 0 ; i+=multiplier) {
                    if (this.getPieceByCellId(i) !== null) {
                        pieceInTheWay = true;
                    } else if (this.getDotColor(i) !== null && this.getDotColor(i) !== piece.dotColor) {
                        dotInTheWay = true;
                    }
                }
            } else {
                for (let i = cell+multiplier; i - destinationCell >= 0 ; i+=multiplier) {
                    if (this.getPieceByCellId(i) !== null) {
                        pieceInTheWay = true;
                    } else if (this.getDotColor(i) !== null && this.getDotColor(i) !== piece.dotColor) {
                        dotInTheWay = true;
                    }
                }
            }
            if (!pieceInTheWay) {
                if (destinationCell > cell) {
                    for (let i = cell+multiplier; destinationCell - i > 0 ; i+=multiplier) {
                        this.enableDot(i);
                        this.setDotColor(piece.dotColor, i);
                    }
                } else {
                    for (let i = cell+multiplier; i - destinationCell > 0 ; i+=multiplier) {
                        this.enableDot(i);
                        this.setDotColor(piece.dotColor, i);
                    }
                }
                if (!dotInTheWay) {
                    this.board.cells[destinationCell].setPiece2(piece);
                    this.board.cells[destinationCell].setPieceDirection(directionToMove);
                }
            } else {
                this.board.cells[destinationCell].setPiece2(piece);
                this.board.cells[destinationCell].setPieceDirection(directionToMove);
            }
        } else { /* Standard movement */
            this.board.cells[destinationCell].setPiece2(piece);
            this.board.cells[destinationCell].setPieceDirection(directionToMove);
        }
        this.enableDot(destinationCell);
        this.setDotColor(piece.dotColor, destinationCell);

        /* Determine initial and final areas */
        area_i = this.board.determineAreaByCellID(cell);
        area_f = this.board.determineAreaByCellID(destinationCell);

        /* Change direction of area change */
        if (area_i !== area_f) {
            random = this.getRandomInt(2);
            if (random) {
                directions = this.getRangeFromDirection(piece.direction);
                random = this.getRandomInt(directions.length);
                this.board.cells[destinationCell].setPieceDirection(directions[random]);
            }
        }

        this.board.updateDotsCounter();
        this.board.updatePieces();
        return true;
    } else {
        return false;
    }
};

/**
 * Returns a random int between zero and max (inclusive of zero, but not max)
 * @param max
 * @returns {number}
 */
Game.prototype.getRandomInt = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

/**
 * Return the range of directions given by a direction
 * @param direction
 * @returns {Array | null}
 */
Game.prototype.getRangeFromDirection = function (direction) {
  if (this.board.directions.includes(direction)) {
      return this.board.directionToRange[direction];
  } else {
      return null;
  }
};