DEGREE_TO_RAD = Math.PI/180;

function Board(scene){
    CGFobject.call(this, scene);
    this.scene = scene;

    /* Board Base */
    this.board = new MyRectangle(this.scene, {
        x1: -0.5,
        y1: -0.5,
        x2: 0.5,
        y2: 0.5
    });

    /* Board Cells */
    this.cells = [];
    for (let i = 0; i < 81; i++) {
        this.cells.push(new Cell(this.scene.index++, this.scene));
    }

    /* Possible directions */
    this.directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

    /* Possible colors */
    this.colors = ['red', 'green', 'blue', 'white', 'black'];

    /* Maps piece directions to possible movement directions */
    this.directionMap = [];
    this.directionMap[this.directions[0]] = [7, 0, 1];
    this.directionMap[this.directions[1]] = [0, 1, 2];
    this.directionMap[this.directions[2]] = [1, 2, 3];
    this.directionMap[this.directions[3]] = [2, 3, 4];
    this.directionMap[this.directions[4]] = [3, 4, 5];
    this.directionMap[this.directions[5]] = [4, 5, 6];
    this.directionMap[this.directions[6]] = [5, 6, 7];
    this.directionMap[this.directions[7]] = [6, 7, 0];

    /* ID of the selected piece */
    this.selectedPieceID = null;

    /* Material of the board base */
    this.boardMaterial = new CGFappearance(this.scene);
    this.boardMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.boardMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.boardMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.boardMaterial.setShininess(10.0);
    this.boardMaterial.loadTexture("/tp3/scenes/images/wood.jpg");

    /* Board Areas */
    this.boardArea = [];
    for (let i = 0, j = 0; j < this.cells.length; i += j, j += 27) {
        for (i = j; i < j + 9; i += 3) {
            this.boardArea.push({
                cells: [
                    i, i + 1, i + 2,
                    i + 9, i + 10, i + 11,
                    i + 18, i + 19, i + 20
                ],
                dots: this.initializeDotsCounter()
            });
        }
    }

    this.areaMaterial = [];
    // this.areaMaterial[0] = new CGFappearance(this.scene);
    // this.areaMaterial[0].setAmbient(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[0].setSpecular(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[0].setDiffuse(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[1] = new CGFappearance(this.scene);
    // this.areaMaterial[1].setAmbient(0.5, 1.0, 0.3, 1.0);
    // this.areaMaterial[1].setSpecular(0.5, 1.0, 0.3, 1.0);
    // this.areaMaterial[1].setDiffuse(0.5, 1.0, 0.3, 1.0);
    // this.areaMaterial[2] = new CGFappearance(this.scene);
    // this.areaMaterial[2].setAmbient(0.3, 0.5, 1.0, 1.0);
    // this.areaMaterial[2].setSpecular(0.3, 0.5, 1.0, 1.0);
    // this.areaMaterial[2].setDiffuse(0.3, 0.5, 1.0, 1.0);
    // this.areaMaterial[3] = new CGFappearance(this.scene);
    // this.areaMaterial[3].setAmbient(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[3].setSpecular(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[3].setDiffuse(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[4] = new CGFappearance(this.scene);
    // this.areaMaterial[4].setAmbient(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[4].setSpecular(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[4].setDiffuse(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[5] = new CGFappearance(this.scene);
    // this.areaMaterial[5].setAmbient(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[5].setSpecular(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[5].setDiffuse(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[6] = new CGFappearance(this.scene);
    // this.areaMaterial[6].setAmbient(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[6].setSpecular(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[6].setDiffuse(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[7] = new CGFappearance(this.scene);
    // this.areaMaterial[7].setAmbient(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[7].setSpecular(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[7].setDiffuse(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[8] = new CGFappearance(this.scene);
    // this.areaMaterial[8].setAmbient(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[8].setSpecular(1.0, 0.5, 0.3, 1.0);
    // this.areaMaterial[8].setDiffuse(1.0, 0.5, 0.3, 1.0);

    let random = [];
    for (let i = 0; i < 27; i++) {
        random[i] = Math.random();
    }
    for (let i = 0, j = 0; i < 9; i++, j += 3) {
        this.areaMaterial[i] = new CGFappearance(this.scene);
        this.areaMaterial[i].setAmbient(random[j], random[j + 1], random[j + 2], 1.0);
        this.areaMaterial[i].setDiffuse(random[j], random[j + 1], random[j + 2], 1.0);
        this.areaMaterial[i].setSpecular(random[j], random[j + 1], random[j + 2], 1.0);
        this.areaMaterial[i].setShininess(10.0);
        this.areaMaterial[i].loadTexture("/tp3/scenes/images/wood_grain.png");
    }
}
Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

/**
 * Initialize the dots counter
 * @returns {Array}
 */
Board.prototype.initializeDotsCounter = function () {
    let array = [];
    this.colors.forEach(function (value) {
        array[value] = 0;
    });
    return array;
};

/**
 * Display board
 */
Board.prototype.display = function() {
    this.scene.pushMatrix();
    this.scene.scale(20.0, 1.0, 20.0);
    this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
    this.boardMaterial.apply();
    this.board.display();
    this.scene.popMatrix();

    for (let i = -4, k = 0; i < 5; i++) {
        for (let j = -4; j < 5; j++, k++) {
            this.scene.pushMatrix();
            this.scene.scale(0.5, 1.0, 0.5);
            this.scene.translate(j*3.5, 0.01, i*3.5);
            this.scene.registerForPick(this.cells[k].id, this.cells[k]);
            this.cells[k].setCellMaterial(this.areaMaterial[this.determineAreaByCellID(this.cells[k].id - 1)]);
            this.cells[k].display();
            this.scene.popMatrix();
        }
        if (i === -2 || i === 1 || i === 4) {
            this.scene.translate(0, 0, 0.25);
        }
    }

    this.scene.clearPickRegistration();
};

/**
 * Enable the display of a dot in the cell given by index <Index>
 * @param index
 */
Board.prototype.enableDot = function (index) {
    if (index < 0 || index >= 81) {
        console.warn("Warning: invalid index for function enableDot");
    } else {
        this.cells[index].enableDot();
    }
};

/**
 * Set color <color> to the dot of the cell given by index <Index>
 * @param index
 * @param color
 */
Board.prototype.setDotColor = function (index, color) {
    if (index < 0 || index >= 81) {
        console.warn("Warning: passing argument index to function setDotColor in Board is invalid");
    }
    else if (!(this.colors.includes(color))) {
        console.warn("Warning: passing argument color to function setDotColor in Board is invalid");
    }
    else {
        this.cells[index].setDotColor(color);
    }
};

/**
 * Show direction arrows in cell given by index <Index> facing directions (<Direction> +- 45) degrees
 * @param index
 * @param direction
 */
Board.prototype.enableArrows = function (index, direction) {
    if (index < 0 || index >= 81) {
        console.warn('Warning: passing argument index to function enableArrows in Board is invalid');
    }
    else if (!(this.directions.includes(direction))) {
        console.warn('Warning: passing argument direction to function enableArrows in Board is invalid');
    }
    else {
        this.cells[index].enableArrow(this.directionMap[direction]);
    }
};

/**
 * Disable all arrows in cell given by index <index>
 * @param index
 */
Board.prototype.disableAllArrows = function(index) {
    if (index < 0 || index >= 81) {
        console.warn('Warning: passing argument index to function enableArrows in Board is invalid');
    } else {
        this.cells[index].disableAllArrows();
    }
};

/**
 * Place piece of color <Color>, facing direction <Direction>, in cell with index <Index>
 * @param index
 * @param color
 * @param direction
 */
Board.prototype.placePiece = function(index, color, direction) {
    if (index < 0 || index >= 81) {
        console.warn('Warning: passing argument index to function placePiece in Board is invalid');
    }
    else if(!(this.directions.includes(direction))) {
        console.warn('Warning: passing argument direction to function placePiece in Board is invalid');
    }
    else if (!(this.colors.includes(color))) {
        console.warn('Warning: passing argument color to function placePiece in Board is invalid');
    }
    else {
        this.cells[index].setPiece(color, direction);
    }
};

/**
 * Highlight piece given by <id>
 * @param id
 */
Board.prototype.highlightPiece = function (id) {
    for (let i = 0; i < 81; i++) {
        if (this.cells[i].piece !== null && this.cells[i].piece.id === id) {
            this.enableArrows(i, this.cells[i].piece.direction);
        }
    }
};

/**
 * Clear highlight of all pieces
 */
Board.prototype.clearAllPiecesHighlight = function () {
    for (let i = 0; i < 81; i++) {
        this.disableAllArrows(i);
    }
};

/**
 * Set <id> as the selected piece ID
 * @param id
 */
Board.prototype.setSelectedPieceID = function (id) {
    this.selectedPieceID = id;
};

/**
 * Get selected piece ID
 * @returns {number} selected piece ID
 */
Board.prototype.getSelectedPieceID = function () {
    return this.selectedPieceID;
};

/**
 * Return the ids of the cell within the area specified by ID <id>
 * @param id
 * @returns {Array} Cells ID
 */
Board.prototype.getCellsIdFromArea = function (id) {
    if (0 < id && id <= 9) {
        return this.boardArea[id - 1].cells;
    } else {
        console.warn('Warning: passing argument id to function getCellsIdFromArea on Board is invalid');
        return null;
    }
};

/**
 * Return the area ID that contains the cell given by ID <id>
 * @param id
 * @returns {number | null}
 */
Board.prototype.determineAreaByCellID = function (id) {
    for (let i = 0; i < this.boardArea.length; i++) {
        if (this.boardArea[i].cells.includes(id)) {
            return i;
        }
    }
    return null;
};

Board.prototype.getMaximumCellsToMove = function (areaID, pieceColor) {

};

/*
* TODO: Send animation info to cell and make piece in specified cell move (with animation) to the passed coordinates
* TODO: Deal with "areas" and limit number of cells to move depending on the number of dots in the current area
* */
Board.prototype.movePiece = function (cellID) {

    let cellid = cellID - 1;

    for (let i = 0; i < 81; i++) {
        let piece = this.cells[i].getPiece();
        /* Check if cell has any piece and if this piece is the selected one */
        if (piece !== null && piece.id === this.selectedPieceID) {
            /* Check if piece is able to move */
            if (piece.ableToMove) {
                if (!this.cells[cellid].hasPiece()) {
                    /* Check if cell has any dot */
                    if (this.cells[cellid].hasDot()) {
                        /* Check if dot has the same color as the piece (connected movement) */
                        if (this.cells[cellid].getDotColor() === piece.dotColor) {
                            /* Movement in the North | South direction */
                            if ((Math.abs(i - cellid) % 9) === 0) {
                                if (['N', 'NW', 'NE'].includes(piece.direction) && cellid > i) {
                                    this.cells[cellid].setPiece2(piece);
                                    this.cells[i].setPiece2(null);
                                    for (let j = i; j <= cellid; j += 9) {
                                        this.cells[j].setDotColor(piece.dotColor);
                                        this.cells[j].enableDot();
                                    }
                                    this.cells[cellid].setPieceDirection('N');
                                } else if (['S', 'SW', 'SE'].includes(piece.direction) && cellid < i) {
                                    this.cells[cellid].setPiece2(piece);
                                    this.cells[i].setPiece2(null);
                                    for (let j = i; j >= cellid; j -= 9) {
                                        this.cells[j].setDotColor(piece.dotColor);
                                        this.cells[j].enableDot();
                                    }
                                    this.cells[cellid].setPieceDirection('S');
                                } else {
                                    console.warn('Warning: Invalid position');
                                }
                            }
                            /* Movement in the Northwest | Southeast direction */
                            else if ((Math.abs(i - cellid) % 10) === 0) {
                                if (['N', 'NW', 'W'].includes(piece.direction) && cellid > i) {
                                    this.cells[cellid].setPiece2(piece);
                                    this.cells[i].setPiece2(null);
                                    for (let j = i; j <= cellid; j += 10) {
                                        this.cells[j].setDotColor(piece.dotColor);
                                        this.cells[j].enableDot();
                                    }
                                    this.cells[cellid].setPieceDirection('NW');
                                } else if (['E', 'SE', 'S'].includes(piece.direction) && cellid < i) {
                                    this.cells[cellid].setPiece2(piece);
                                    this.cells[i].setPiece2(null);
                                    for (let j = i; j >= cellid; j -= 10) {
                                        this.cells[j].setDotColor(piece.dotColor);
                                        this.cells[j].enableDot();
                                    }
                                    this.cells[cellid].setPieceDirection('SE');
                                } else {
                                    console.warn('Warning: Invalid position');
                                }
                            }
                            /* Movement in the Northeast | Southwest direction */
                            else if ((Math.abs(i - cellid) % 8) === 0) {
                                if (['N', 'NE', 'E'].includes(piece.direction) && cellid > i) {
                                    this.cells[cellid].setPiece2(piece);
                                    this.cells[i].setPiece2(null);
                                    for (let j = i; j <= cellid; j += 8) {
                                        this.cells[j].setDotColor(piece.dotColor);
                                        this.cells[j].enableDot();
                                    }
                                    this.cells[cellid].setPieceDirection('NE');
                                } else if (['S', 'SW', 'W'].includes(piece.direction) && cellid < i) {
                                    this.cells[cellid].setPiece2(piece);
                                    this.cells[i].setPiece2(null);
                                    for (let j = i; j >= cellid; j -= 8) {
                                        this.cells[j].setDotColor(piece.dotColor);
                                        this.cells[j].enableDot();
                                    }
                                    this.cells[cellid].setPieceDirection('SW');
                                } else {
                                    console.warn('Warning: Invalid position');
                                }
                            }
                            /* Movement in the East | West direction */
                            else if (Math.abs(i - cellid) < 9) {
                                if (['NW', 'W', 'SW'].includes(piece.direction) && cellid > i) {
                                    this.cells[cellid].setPiece2(piece);
                                    this.cells[i].setPiece2(null);
                                    for (let j = 1; j < cellid - i; j++) {
                                        this.cells[i + j].setDotColor(piece.dotColor);
                                        this.cells[i + j].enableDot();
                                    }
                                    this.cells[cellid].setPieceDirection('W');
                                } else if (['NE', 'E', 'SE'].includes(piece.direction) && cellid < i) {
                                    this.cells[cellid].setPiece2(piece);
                                    this.cells[i].setPiece2(null);
                                    for (let j = -1; j > cellid - i; j--) {
                                        this.cells[i + j].setDotColor(piece.dotColor);
                                        this.cells[i + j].enableDot();
                                    }
                                    this.cells[cellid].setPieceDirection('E');
                                } else {
                                    console.warn('Warning: Invalid position');
                                }
                            } else {
                                console.warn('Warning: Invalid direction');
                            }
                        } else {
                            console.warn('Warning: Can not move to this cell!');
                        }
                    } else {
                        if ((Math.abs(i - cellid) % 9) === 0) {
                            if (['N', 'NW', 'NE'].includes(piece.direction) && cellid > i) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('N');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                            } else if (['S', 'SW', 'SE'].includes(piece.direction) && cellid < i) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('S');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                            } else {
                                console.warn('Warning: Invalid position');
                            }
                        } else if ((Math.abs(i - cellid) % 10) === 0) {
                            if (['N', 'NW', 'W'].includes(piece.direction) && cellid > i) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('NW');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                            } else if (['E', 'SE', 'S'].includes(piece.direction) && cellid < i) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('SE');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                            } else {
                                console.warn('Warning: Invalid position');
                            }
                        } else if ((Math.abs(i - cellid) % 8) === 0) {
                            if (['N', 'NE', 'E'].includes(piece.direction) && cellid > i) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('NE');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                            } else if (['S', 'SW', 'W'].includes(piece.direction) && cellid < i) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('SW');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                            } else {
                                console.warn('Warning: Invalid position');
                            }
                        } else if (Math.abs(i - cellid) < 9) {
                            if (['NW', 'W', 'SW'].includes(piece.direction) && cellid > i) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('W');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                            } else if (['NE', 'E', 'SE'].includes(piece.direction) && cellid < i) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('E');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                            } else {
                                console.warn('Warning: Invalid position');
                            }
                        } else {
                            console.warn('Warning: Invalid direction');
                        }
                    }
                } else {
                    console.warn('Warning: invalid position');
                }
            } else {
                console.warn('Warning: Selected piece (ID = ' + this.selectedPieceID + ') is unable to move');
            }
            return;
        }
    }
    console.warn('Warning: Can not find selected piece (ID = '+ this.selectedPieceID || 'null' +')');
};