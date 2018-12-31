DEGREE_TO_RAD = Math.PI/180;

function Cell(id, scene){
    CGFobject.call(this, scene);
    this.scene = scene;

    this.id = id;

    this.cell = new MyRectangle(this.scene, {
        x1: -0.5,
        y1: -0.5,
        x2: 0.5,
        y2: 0.5
    });

    // Board dot
    this.dotEnabled = false;
    this.dot = new Dot(this.scene);

    // Board Arrows
    this.boardArrow = [];
    for (let i = 0; i < 8; i++) {
        this.boardArrow[i] = new Arrow(this.scene);
    }
    // Active Arrows (Arrows displayed in the scene)
    this.activeArrows = [false, false, false, false, false, false, false, false];

    this.piece = null;

    this.directionMap = [];
    this.directionMap['N'] = 0;
    this.directionMap['NE'] = 1;
    this.directionMap['E'] = 2;
    this.directionMap['SE'] = 3;
    this.directionMap['S'] = 4;
    this.directionMap['SW'] = 5;
    this.directionMap['W'] = 6;
    this.directionMap['NW'] = 7;

    this.cellMaterial = new Color(this.scene, 'white');
    this.cellMaterial.loadTexture("/tp3/scenes/images/wood_grain.png");
}
Cell.prototype = Object.create(CGFobject.prototype);
Cell.prototype.constructor = Cell;

/**
 * Display Cell
 */
Cell.prototype.display = function(){

    if (this.dotEnabled) {
        this.scene.pushMatrix();
        this.dot.display();
        this.scene.popMatrix();
    }

    for (let i = 0; i < 8; i++) {
        if (this.activeArrows[i]) {
            this.scene.pushMatrix();
            this.scene.translate(0.0, 0.01, 0.0);
            this.scene.rotate(-45 * i * DEGREE_TO_RAD, 0, 1, 0);
            this.boardArrow[i].display();
            this.scene.popMatrix();
        }
    }

    if (this.piece !== null && this.piece.object instanceof Piece) {
        this.scene.pushMatrix();
        this.scene.rotate(-45 * this.directionMap[this.piece.direction] * DEGREE_TO_RAD, 0, 1, 0);
        this.scene.registerForPick(this.piece.id, this.piece.object);
        this.piece.object.display();
        this.scene.popMatrix();
    }

    this.scene.pushMatrix();
    this.scene.scale(3.0, 1.0, 3.0);
    this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
    this.cellMaterial.apply();
    this.cell.display();
    this.scene.popMatrix();

    this.scene.clearPickRegistration();

};

/**
 * enable arrows identified indexes passed by argument
 */
Cell.prototype.enableArrow = function (indexes) {
    if (indexes instanceof Array) {
        for (let i = 0; i < indexes.length; i++) {
            if (indexes[i] >= 0 && indexes[i] < 8) {
                this.activeArrows[indexes[i]] = true;
            }
            else {
                console.warn('Warning: passing argument indexes to function enableArrow in Cell ' +
                            'contains an invalid index');
            }
        }
    }
    else {
        console.warn("Warning: passing argument indexes to function enableArrow in Cell is invalid");
    }
};

/**
 * Disable all arrows
 */
Cell.prototype.disableAllArrows = function () {
    for (let i = 0; i < this.activeArrows.length; i++) {
        this.activeArrows[i] = false;
    }
};

/**
 * Set dot color
 * @param color
 */
Cell.prototype.setDotColor = function (color) {
    this.dot.setColor(color);
};

/**
 * Get dot color
 * @returns {color}
 */
Cell.prototype.getDotColor = function () {
    return this.dot.getColor();
};

/**
 * Enable dot display
 */
Cell.prototype.enableDot = function () {
    this.dotEnabled = true;
};

/**
 * Return true if cell has a dot enabled and false otherwise
 * @returns {boolean}
 */
Cell.prototype.hasDot = function () {
    return this.dotEnabled;
};

/**
 * Place piece in cell
 * @param color
 * @param direction
 */
Cell.prototype.setPiece = function (color, direction) {
    this.piece = {
        id: this.scene.index++,
        object: new Piece(this.scene.index, this.scene, new Color(this.scene, color)),
        color: color,
        direction: direction,
        ableToMove: true
    };

    switch (color) {
        case 'red':
            this.piece.dotColor = 'dark_red';
            break;
        case 'green':
            this.piece.dotColor = 'dark_green';
            break;
        case 'blue':
            this.piece.dotColor = 'dark_blue';
            break;
        case 'white':
            this.piece.dotColor = 'light_gray';
            break;
        case 'black':
            this.piece.dotColor = 'dark_gray';
            break;
    }
};

/**
 * Set Piece
 * @param piece
 */
Cell.prototype.setPiece2 = function (piece) {
    this.piece = piece;
};

/**
 * Get piece placed in cell
 * @returns {*}
 */
Cell.prototype.getPiece = function () {
    return this.piece;
};

/**
 * Set piece direction to <direction>
 * @param direction
 */
Cell.prototype.setPieceDirection = function (direction) {
    if (['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].includes(direction)) {
        this.piece.direction = direction;
    } else {
        console.warn('Warning: passing argument direction to function setPieceDirection in Cell is invalid');
    }
};

/**
 * Return true if cell has a piece and false otherwise
 * @returns {boolean}
 */
Cell.prototype.hasPiece = function () {
    return this.piece !== null;
};

/**
 * Set the cell material
 * @param material
 */
Cell.prototype.setCellMaterial = function (material) {
    if (material instanceof CGFappearance) {
        this.cellMaterial = material;
    } else {
        console.warn('Warning: passing argument material to function setCellMaterial on Cell is invalid');
    }
};