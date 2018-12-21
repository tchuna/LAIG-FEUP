DEGREE_TO_RAD = Math.PI/180;

function Board(scene){
    CGFobject.call(this, scene);
    this.scene = scene;


    // Board Base
    this.board = new MyRectangle(this.scene, {
        x1: -0.5,
        y1: -0.5,
        x2: 0.5,
        y2: 0.5
    });

    // Board Cell
    this.cells = [];
    for (let i = 0; i < 81; i++) {
        this.cells.push(new Cell(this.scene));
    }

    // Possible directions
    this.directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

    // Possible colors
    this.colors = ['red', 'green', 'blue', 'white', 'black'];

    // Maps piece directions to possible movement directions
    this.directionMap = [];
    this.directionMap[this.directions[0]] = [7, 0, 1];
    this.directionMap[this.directions[1]] = [0, 1, 2];
    this.directionMap[this.directions[2]] = [1, 2, 3];
    this.directionMap[this.directions[3]] = [2, 3, 4];
    this.directionMap[this.directions[4]] = [3, 4, 5];
    this.directionMap[this.directions[5]] = [4, 5, 6];
    this.directionMap[this.directions[6]] = [5, 6, 7];
    this.directionMap[this.directions[7]] = [6, 7, 0];

    // Array of pieces
    this.pieces = [];
    this.pieces[this.colors[0]] = new Piece(this.scene, new Color(this.scene, this.colors[0]));
    this.pieces[this.colors[1]] = new Piece(this.scene, new Color(this.scene, this.colors[1]));
    this.pieces[this.colors[2]] = new Piece(this.scene, new Color(this.scene, this.colors[2]));
    this.pieces[this.colors[3]] = new Piece(this.scene, new Color(this.scene, this.colors[3]));
    this.pieces[this.colors[4]] = new Piece(this.scene, new Color(this.scene, this.colors[4]));

    // Material of the board base
    this.boardMaterial = new CGFappearance(this.scene);
    this.boardMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.boardMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.boardMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.boardMaterial.setShininess(10.0);
    this.boardMaterial.loadTexture("/tp3/scenes/images/wood.jpg");
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
            this.cells[k].display();
            this.scene.popMatrix();
        }
    }
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
 * Set the color of the dot to be placed in cell given by index <Index>
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
        this.cells[index].setDotMaterial(new Color(this.scene, color));
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
        this.cells[index].setPiece(this.pieces[color], direction);
    }
};