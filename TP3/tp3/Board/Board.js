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
    this.dotsColor = ['dark_red', 'dark_green', 'dark_blue', 'light_gray', 'dark_gray'];

    /* Maps piece directions to possible movement directions */
    this.directionToIndex = [];
    this.directionToIndex[this.directions[0]] = [7, 0, 1];
    this.directionToIndex[this.directions[1]] = [0, 1, 2];
    this.directionToIndex[this.directions[2]] = [1, 2, 3];
    this.directionToIndex[this.directions[3]] = [2, 3, 4];
    this.directionToIndex[this.directions[4]] = [3, 4, 5];
    this.directionToIndex[this.directions[5]] = [4, 5, 6];
    this.directionToIndex[this.directions[6]] = [5, 6, 7];
    this.directionToIndex[this.directions[7]] = [6, 7, 0];

    this.directionToRange = [];
    this.directionToRange[this.directions[0]] = ['NW', 'N', 'NE'];
    this.directionToRange[this.directions[1]] = ['N', 'NE', 'E'];
    this.directionToRange[this.directions[2]] = ['NE', 'E', 'SE'];
    this.directionToRange[this.directions[3]] = ['E', 'SE', 'S'];
    this.directionToRange[this.directions[4]] = ['SE', 'S', 'SW'];
    this.directionToRange[this.directions[5]] = ['S', 'SW', 'W'];
    this.directionToRange[this.directions[6]] = ['SW', 'W', 'NW'];
    this.directionToRange[this.directions[7]] = ['W', 'NW', 'N'];

    /* ID of the selected piece */
    this.selectedPieceID = -1;

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
    this.areaMaterial[0] = new CGFappearance(this.scene);
    this.areaMaterial[0].setAmbient(0.288, 0.678, 0.145, 1.0);
    this.areaMaterial[0].setDiffuse(0.288, 0.678, 0.145, 1.0);
    this.areaMaterial[0].setSpecular(0.288, 0.678, 0.145, 1.0);
    this.areaMaterial[0].setShininess(10.0);
    this.areaMaterial[0].loadTexture("/tp3/scenes/images/wood_grain.png");
    this.areaMaterial[1] = new CGFappearance(this.scene);
    this.areaMaterial[1].setAmbient(0.614, 0.174, 0.774, 1.0);
    this.areaMaterial[1].setDiffuse(0.614, 0.174, 0.774, 1.0);
    this.areaMaterial[1].setSpecular(0.614, 0.174, 0.774, 1.0);
    this.areaMaterial[1].setShininess(10.0);
    this.areaMaterial[1].loadTexture("/tp3/scenes/images/wood_grain.png");
    this.areaMaterial[2] = new CGFappearance(this.scene);
    this.areaMaterial[2].setAmbient(0.258, 0.286, 0.927, 1.0);
    this.areaMaterial[2].setDiffuse(0.258, 0.286, 0.927, 1.0);
    this.areaMaterial[2].setSpecular(0.258, 0.286, 0.927, 1.0);
    this.areaMaterial[2].setShininess(10.0);
    this.areaMaterial[2].loadTexture("/tp3/scenes/images/wood_grain.png");
    this.areaMaterial[3] = new CGFappearance(this.scene);
    this.areaMaterial[3].setAmbient(0.663, 0.894, 0.413, 1.0);
    this.areaMaterial[3].setDiffuse(0.663, 0.894, 0.413, 1.0);
    this.areaMaterial[3].setSpecular(0.663, 0.894, 0.413, 1.0);
    this.areaMaterial[3].setShininess(10.0);
    this.areaMaterial[3].loadTexture("/tp3/scenes/images/wood_grain.png");
    this.areaMaterial[4] = new CGFappearance(this.scene);
    this.areaMaterial[4].setAmbient(0.335, 0.025, 0.940, 1.0);
    this.areaMaterial[4].setDiffuse(0.335, 0.025, 0.940, 1.0);
    this.areaMaterial[4].setSpecular(0.335, 0.025, 0.940, 1.0);
    this.areaMaterial[4].setShininess(10.0);
    this.areaMaterial[4].loadTexture("/tp3/scenes/images/wood_grain.png");
    this.areaMaterial[5] = new CGFappearance(this.scene);
    this.areaMaterial[5].setAmbient(0.489, 0.749, 0.672, 1.0);
    this.areaMaterial[5].setDiffuse(0.489, 0.749, 0.672, 1.0);
    this.areaMaterial[5].setSpecular(0.489, 0.749, 0.672, 1.0);
    this.areaMaterial[5].setShininess(10.0);
    this.areaMaterial[5].loadTexture("/tp3/scenes/images/wood_grain.png");
    this.areaMaterial[6] = new CGFappearance(this.scene);
    this.areaMaterial[6].setAmbient(0.141, 0.174, 0.655, 1.0);
    this.areaMaterial[6].setDiffuse(0.141, 0.174, 0.655, 1.0);
    this.areaMaterial[6].setSpecular(0.141, 0.174, 0.655, 1.0);
    this.areaMaterial[6].setShininess(10.0);
    this.areaMaterial[6].loadTexture("/tp3/scenes/images/wood_grain.png");
    this.areaMaterial[7] = new CGFappearance(this.scene);
    this.areaMaterial[7].setAmbient(0.181, 0.531, 0.630, 1.0);
    this.areaMaterial[7].setDiffuse(0.181, 0.531, 0.630, 1.0);
    this.areaMaterial[7].setSpecular(0.181, 0.531, 0.630, 1.0);
    this.areaMaterial[7].setShininess(10.0);
    this.areaMaterial[7].loadTexture("/tp3/scenes/images/wood_grain.png");
    this.areaMaterial[8] = new CGFappearance(this.scene);
    this.areaMaterial[8].setAmbient(0.834, 0.726, 0.724, 1.0);
    this.areaMaterial[8].setDiffuse(0.834, 0.726, 0.724, 1.0);
    this.areaMaterial[8].setSpecular(0.834, 0.726, 0.724, 1.0);
    this.areaMaterial[8].setShininess(10.0);
    this.areaMaterial[8].loadTexture("/tp3/scenes/images/wood_grain.png");
}
Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

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
 * Initialize the dots counter
 * @returns {Array}
 */
Board.prototype.initializeDotsCounter = function () {
    let array = [];
    this.dotsColor.forEach(function (value) {
        array[value] = 0;
    });
    return array;
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
 * Returns the color of the dot located in the cell given by index
 * @param index
 * @returns {color}
 */
Board.prototype.getDotColor = function (index) {
    if (index > 0 && index < 81) {
        return this.cells[index].getDotColor()
    } else {
        console.warn('Warning: passing argument index to function getDotColor on board is invalid');
        return null;
    }
};

/**
 * Count the number of dots of each color
 * @returns {Array}
 */
Board.prototype.countAllDots = function () {
    let dots = [];
    this.dotsColor.forEach(function (value) {
        dots[value] = 0;
    });

    for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i].hasDot()) {
            dots[this.cells[i].getDotColor()]++;
        }
    }

    return dots;
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
        this.cells[index].enableArrow(this.directionToIndex[direction]);
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
 * Returns the piece given by index
 * @param index
 * @returns {piece}
 */
Board.prototype.getPiece = function (index) {
    for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i].hasPiece() && this.cells[i].getPiece().id === index) {
            return this.cells[i].getPiece();
        }
    }
    return null;
};

/**
 * Returns the piece located in the cell given by index
 * @param index
 * @returns {piece}
 */
Board.prototype.getPieceByCellId = function (index) {
    if (index >= 0 && index < 81) {
        return this.cells[index].getPiece();
    } else {
        console.warn('Warning: passing argument index to function getPiece on Board is invalid');
        return null;
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
 * Update all pieces to set if it is able to move or not
 */
Board.prototype.updatePieces = function () {
    let piece = null;
    for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i].hasPiece()) {
            piece = this.cells[i].getPiece();
            if ((i >= 0 && i <= 8 && piece.direction === 'S') ||
                (i % 9 === 0 && piece.direction === 'E') ||
                ((i + 1) % 9 === 0 && piece.direction === 'W') ||
                (i >= 72 && i <= 80 && piece.direction === 'N') ||
                (i === 0 && piece.direction === 'SE') ||
                (i === 8 && piece.direction === 'SW') ||
                (i === 72 && piece.direction === 'NE') ||
                (i === 80 && piece.direction === 'NW')) {
                piece.ableToMove = false;
            }
            this.cells[i].setPiece2(piece);
        }
    }
};

/**
 * Return the mobility of all pieces of each color
 * @returns {Array}
 */
Board.prototype.checkPiecesMobility = function () {
    let mobility = [];

    this.colors.forEach(function (value) {
        mobility[value] = false;
    });

    for (let i = 0; i < this.cells.length; i++) {
        if (this.cells[i].hasPiece() && this.cells[i].getPiece().ableToMove && !mobility[this.cells[i].getPiece().color]) {
            mobility[this.cells[i].getPiece().color] = true;
        }
    }

    return mobility;
};

/**
 * Check if any piece exists
 * @returns {Array}
 */
Board.prototype.checkPieceExistence = function () {
    let existence = [];
    let piece;

    this.colors.forEach(function (value) {
        existence[value] = false;
    });
    for (let i = 0; i < this.cells.length; i++) {
        if ((piece = this.getPieceByCellId(i)) !== null) {
            existence[piece.color] = true;
        }
    }
    return existence;
};

/**
 * Updated piece direction when it moves to a different area
 * @param piece
 * @param area_i
 * @param area_f
 */
Board.prototype.updatePieceDirectionOnAreaChange = function (piece, area_i, area_f) {
    if (area_i !== area_f && confirm('Would you like to change piece direction?')) {
        let direction;
        while (true) {
            direction = prompt('New direction (' + this.directionToRange[piece.direction] + ')');
            if (direction === null || this.directionToRange[piece.direction].includes(direction.toUpperCase())) {
                break;
            }
        }
        if (direction !== null) {
            piece.direction = direction
        }
    }
};

/**
 * Return the ids of the cell within the area specified by ID <id>
 * @param id
 * @returns {Array} Cells ID
 */
Board.prototype.getCellsIdFromArea = function (id) {
    if (0 <= id && id < 9) {
        return this.boardArea[id].cells;
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

/**
 * Get the number of cells a piece of color <pieceColor> can move inside the area given by ID <areaID>
 * @param areaID
 * @param pieceColor
 * @returns {number}
 */
Board.prototype.getMaximumCellsToMove = function (areaID, pieceColor) {
    if (areaID < 0 || areaID > 8) {
        console.warn('Warning: passing argument areaID to function getMaximumCellsToMove on Board is invalid');
    } else if (!(this.colors.includes(pieceColor))) {
        console.warn('Warning: passing argument pieceColor to function getMaximumCellsToMove on Board is invalid');
    } else {
        let index = this.colors.indexOf(pieceColor);
        let dots = this.boardArea[areaID].dots[this.dotsColor[index]];
        return (dots === 0) ? 1 : dots;
    }
    return 0;
};

/**
 * Update the number of dots of each color in each area;
 */
Board.prototype.updateDotsCounter = function () {
    let ids = [];
    let count = [];

    for (let i = 0; i < 9; i++) {
        ids = this.getCellsIdFromArea(i);

        this.dotsColor.forEach(function (value) {
            count[value] = 0;
        });
        for (let j = 0; j < ids.length; j++) {
            if (this.cells[ids[j]].hasDot()) {
                count[this.cells[ids[j]].getDotColor()]++;
            }
        }
        for (let j = 0; j < this.dotsColor.length; j++) {
            this.boardArea[i].dots[this.dotsColor[j]] = count[this.dotsColor[j]];
        }
    }
};

/**
 * Move a piece from current cell to cell given by cellID
 * @param cellID
 */
Board.prototype.movePiece = function (cellID) {

    let cellid = cellID - 1;

    for (let i = 0; i < 81; i++) {
        let piece = this.cells[i].getPiece();
        /* Check if cell has any piece and if this piece is the selected one */
        if (piece !== null && piece.id === this.selectedPieceID) {
            /* Check if piece is able to move */
            if (piece.ableToMove) {
                /* Check if cell has any piece */
                if (!this.cells[cellid].hasPiece()) {
                    const cellsToMove = this.getMaximumCellsToMove(this.determineAreaByCellID(i), piece.color);
                    const area_i = this.determineAreaByCellID(i);
                    const area_f = this.determineAreaByCellID(cellid);
                    let dotInTheWay = false;
                    let pieceInTheWay = false;

                    /* Check if cell has any dot */
                    if (this.cells[cellid].hasDot()) {
                        /* Check if dot has the same color as the piece (connected movement) */
                        if (this.cells[cellid].getDotColor() === piece.dotColor) {
                            /* Movement in the North | South direction */
                            if ((Math.abs(i - cellid) % 9) === 0) {
                                if (this.directionToRange['N'].includes(piece.direction) && cellid > i && (cellid - i) / 9 <= cellsToMove) {
                                    for (let j = i; j <= cellid; j += 9) {
                                        if (j !== i && this.cells[j].hasPiece()) {
                                            pieceInTheWay = true;
                                        }
                                    }
                                    if (!pieceInTheWay) {
                                        for (let j = i; j <= cellid; j += 9) {
                                            if (this.cells[j].hasDot() && this.cells[j].getDotColor() !== piece.dotColor) {
                                                dotInTheWay = true;
                                            }
                                            this.cells[j].setDotColor(piece.dotColor);
                                            this.cells[j].enableDot();
                                        }
                                    } else {
                                        this.cells[cellid].setDotColor(piece.dotColor);
                                        this.cells[cellid].enableDot();
                                    }
                                    this.cells[i].setPiece2(null);
                                    if (!dotInTheWay) {
                                        this.cells[cellid].setPiece2(piece);
                                        this.cells[cellid].setPieceDirection('N');
                                        this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                                    }
                                } else if (this.directionToRange['S'].includes(piece.direction) && cellid < i && (i - cellid) / 9 <= cellsToMove) {
                                    for (let j = i; j >= cellid; j -= 9) {
                                        if (j !== i && this.cells[j].hasPiece()) {
                                            pieceInTheWay = true;
                                        }
                                    }
                                    if (!pieceInTheWay) {
                                        for (let j = i; j >= cellid; j -= 9) {
                                            if (this.cells[j].hasDot() && this.cells[j].getDotColor() !== piece.dotColor) {
                                                dotInTheWay = true;
                                            }
                                            this.cells[j].setDotColor(piece.dotColor);
                                            this.cells[j].enableDot();
                                        }
                                    } else {
                                        this.cells[cellid].setDotColor(piece.dotColor);
                                        this.cells[cellid].enableDot();
                                    }
                                    this.cells[i].setPiece2(null);
                                    if (!dotInTheWay) {
                                        this.cells[cellid].setPiece2(piece);
                                        this.cells[cellid].setPieceDirection('S');
                                        this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                                    }
                                } else {
                                    console.warn('Warning: Invalid position');
                                }
                            }
                            /* Movement in the Northwest | Southeast direction */
                            else if ((Math.abs(i - cellid) % 10) === 0) {
                                if (this.directionToRange['NW'].includes(piece.direction) && cellid > i && (cellid - i) / 10 <= cellsToMove) {
                                    for (let j = i; j <= cellid; j += 10) {
                                        if (j !== i && this.cells[j].hasPiece()) {
                                            pieceInTheWay = true;
                                        }
                                    }
                                    if (!pieceInTheWay) {
                                        for (let j = i; j <= cellid; j += 10) {
                                            if (this.cells[j].hasDot() && this.cells[j].getDotColor() !== piece.dotColor) {
                                                dotInTheWay = true;
                                            }
                                            this.cells[j].setDotColor(piece.dotColor);
                                            this.cells[j].enableDot();
                                        }
                                    } else {
                                        this.cells[cellid].setDotColor(piece.dotColor);
                                        this.cells[cellid].enableDot();
                                    }
                                    this.cells[i].setPiece2(null);
                                    if (!dotInTheWay) {
                                        this.cells[cellid].setPiece2(piece);
                                        this.cells[cellid].setPieceDirection('NW');
                                        this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                                    }
                                } else if (this.directionToRange['SE'].includes(piece.direction) && cellid < i && (i - cellid) / 10 <= cellsToMove) {
                                    for (let j = i; j >= cellid; j -= 10) {
                                        if (j !== i && this.cells[j].hasPiece()) {
                                            pieceInTheWay = true;
                                        }
                                    }
                                    if (!pieceInTheWay) {
                                        for (let j = i; j >= cellid; j -= 10) {
                                            if (this.cells[j].hasDot() && this.cells[j].getDotColor() !== piece.dotColor) {
                                                dotInTheWay = true;
                                            }
                                            this.cells[j].setDotColor(piece.dotColor);
                                            this.cells[j].enableDot();
                                        }
                                    } else {
                                        this.cells[cellid].setDotColor(piece.dotColor);
                                        this.cells[cellid].enableDot();
                                    }
                                    this.cells[i].setPiece2(null);
                                    if (!dotInTheWay) {
                                        this.cells[cellid].setPiece2(piece);
                                        this.cells[cellid].setPieceDirection('SE');
                                        this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                                    }
                                } else {
                                    console.warn('Warning: Invalid position');
                                }
                            }
                            /* Movement in the Northeast | Southwest direction */
                            else if ((Math.abs(i - cellid) % 8) === 0) {
                                if (this.directionToRange['NE'].includes(piece.direction) && cellid > i && (cellid - i) / 8 <= cellsToMove) {
                                    for (let j = i; j <= cellid; j += 8) {
                                        if (j !== i && this.cells[j].hasPiece()) {
                                            pieceInTheWay = true;
                                        }
                                    }
                                    if (!pieceInTheWay) {
                                        for (let j = i; j <= cellid; j += 8) {
                                            if (this.cells[j].hasDot() && this.cells[j].getDotColor() !== piece.dotColor) {
                                                dotInTheWay = true;
                                            }
                                            this.cells[j].setDotColor(piece.dotColor);
                                            this.cells[j].enableDot();
                                        }
                                    } else {
                                        this.cells[cellid].setDotColor(piece.dotColor);
                                        this.cells[cellid].enableDot();
                                    }
                                    this.cells[i].setPiece2(null);
                                    if (!dotInTheWay) {
                                        this.cells[cellid].setPiece2(piece);
                                        this.cells[cellid].setPieceDirection('NE');
                                        this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                                    }
                                } else if (this.directionToRange['SW'].includes(piece.direction) && cellid < i && (i - cellid) / 8 <= cellsToMove) {
                                    for (let j = i; j >= cellid; j -= 8) {
                                        if (j !== i && this.cells[j].hasPiece()) {
                                            pieceInTheWay = true;
                                        }
                                    }
                                    if (!pieceInTheWay) {
                                        for (let j = i; j >= cellid; j -= 8) {
                                            if (this.cells[j].hasDot() && this.cells[j].getDotColor() !== piece.dotColor) {
                                                dotInTheWay = true;
                                            }
                                            this.cells[j].setDotColor(piece.dotColor);
                                            this.cells[j].enableDot();
                                        }
                                    } else {
                                        this.cells[cellid].setDotColor(piece.dotColor);
                                        this.cells[cellid].enableDot();
                                    }
                                    this.cells[i].setPiece2(null);
                                    if (!dotInTheWay) {
                                        this.cells[cellid].setPiece2(piece);
                                        this.cells[cellid].setPieceDirection('SW');
                                        this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                                    }
                                } else {
                                    console.warn('Warning: Invalid position');
                                }
                            }
                            /* Movement in the East | West direction */
                            else if (Math.abs(i - cellid) < 9) {
                                if (this.directionToRange['W'].includes(piece.direction) && cellid > i && (cellid - i) <= cellsToMove) {
                                    for (let j = 1; j < cellid - i; j++) {
                                        if (j !== i && this.cells[j].hasPiece()) {
                                            pieceInTheWay = true;
                                        }
                                    }
                                    if (!pieceInTheWay) {
                                        for (let j = 1; j < cellid - i; j++) {
                                            if (this.cells[j].hasDot() && this.cells[j].getDotColor() !== piece.dotColor) {
                                                dotInTheWay = true;
                                            }
                                            this.cells[i + j].setDotColor(piece.dotColor);
                                            this.cells[i + j].enableDot();
                                        }
                                    } else {
                                        this.cells[cellid].setDotColor(piece.dotColor);
                                        this.cells[cellid].enableDot();
                                    }
                                    this.cells[i].setPiece2(null);
                                    if (!dotInTheWay) {
                                        this.cells[cellid].setPiece2(piece);
                                        this.cells[cellid].setPieceDirection('W');
                                        this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                                    }
                                } else if (this.directionToRange['E'].includes(piece.direction) && cellid < i && (i - cellid) <= cellsToMove) {
                                    for (let j = -1; j > cellid - i; j--) {
                                        if (j !== i && this.cells[j].hasPiece()) {
                                            pieceInTheWay = true;
                                        }
                                    }
                                    if (!pieceInTheWay) {
                                        for (let j = -1; j > cellid - i; j--) {
                                            if (this.cells[j].hasDot() && this.cells[j].getDotColor() !== piece.dotColor) {
                                                dotInTheWay = true;
                                            }
                                            this.cells[i + j].setDotColor(piece.dotColor);
                                            this.cells[i + j].enableDot();
                                        }
                                    } else {
                                        this.cells[cellid].setDotColor(piece.dotColor);
                                        this.cells[cellid].enableDot();
                                    }
                                    this.cells[i].setPiece2(null);
                                    if (!dotInTheWay) {
                                        this.cells[cellid].setPiece2(piece);
                                        this.cells[cellid].setPieceDirection('E');
                                        this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                                    }
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
                            if (this.directionToRange['N'].includes(piece.direction) && cellid > i && (cellid - i) / 9 <= cellsToMove) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('N');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                                this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                            } else if (this.directionToRange['S'].includes(piece.direction) && cellid < i && (i - cellid) / 9 <= cellsToMove) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('S');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                                this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                            } else {
                                console.warn('Warning: Invalid position');
                            }
                        } else if ((Math.abs(i - cellid) % 10) === 0) {
                            if (this.directionToRange['NW'].includes(piece.direction) && cellid > i && (cellid - i) / 10 <= cellsToMove) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('NW');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                                this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                            } else if (this.directionToRange['SE'].includes(piece.direction) && cellid < i && (i - cellid) / 10 <= cellsToMove) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('SE');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                                this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                            } else {
                                console.warn('Warning: Invalid position');
                            }
                        } else if ((Math.abs(i - cellid) % 8) === 0) {
                            if (this.directionToRange['NE'].includes(piece.direction) && cellid > i && (cellid - i) / 8 <= cellsToMove) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('NE');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                                this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                            } else if (this.directionToRange['SW'].includes(piece.direction) && cellid < i && (i - cellid) / 8 <= cellsToMove) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('SW');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                                this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                            } else {
                                console.warn('Warning: Invalid position');
                            }
                        } else if (Math.abs(i - cellid) < 9) {
                            if (this.directionToRange['W'].includes(piece.direction) && cellid > i && (cellid - i) <= cellsToMove) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('W');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                                this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
                            } else if (this.directionToRange['E'].includes(piece.direction) && cellid < i && (i - cellid) <= cellsToMove) {
                                this.cells[cellid].setPiece2(piece);
                                this.cells[cellid].setPieceDirection('E');
                                this.cells[cellid].setDotColor(piece.dotColor);
                                this.cells[cellid].enableDot();
                                this.cells[i].setPiece2(null);
                                this.updatePieceDirectionOnAreaChange(piece, area_i, area_f);
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
            this.updateDotsCounter();
            this.updatePieces();
            return;
        }
    }
    console.warn('Warning: Can not find selected piece (ID = ' + this.selectedPieceID + ')');
};