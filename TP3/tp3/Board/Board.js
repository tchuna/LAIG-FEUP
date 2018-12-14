DEGREE_TO_RAD = Math.PI/180;

function Board(scene){
    CGFobject.call(this, scene);
    this.scene = scene;

    this.scene.setPickEnabled(true);

    // Board Base
    this.board = new MyRectangle(this.scene, {
        x1: -0.5,
        y1: -0.5,
        x2: 0.5,
        y2: 0.5
    });

    // Board Cell
    this.cells = [];
    for (let i = 0; i < 64; i++) {
        this.cells.push(new Cell(this.scene));
    }

    this.directionMap = [];
    this.directionMap['N'] = [7, 0, 1];
    this.directionMap['NE'] = [0, 1, 2];
    this.directionMap['E'] = [1, 2, 3];
    this.directionMap['SE'] = [2, 3, 4];
    this.directionMap['S'] = [3, 4, 5];
    this.directionMap['SW'] = [4, 5, 6];
    this.directionMap['W'] = [5, 6, 7];
    this.directionMap['NW'] = [6, 7, 0];

    this.boardMaterial = new CGFappearance(this.scene);
    this.boardMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.boardMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.boardMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.boardMaterial.setShininess(10.0);
    this.boardMaterial.loadTexture("/tp3/scenes/images/wood.jpg");
}
Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.display = function(){
    this.logPicking();
    this.scene.clearPickRegistration();

    this.scene.pushMatrix();
    this.scene.scale(15.0, 1.0, 15.0);
    this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
    this.boardMaterial.apply();
    this.board.display();
    this.scene.popMatrix();

    for (let i = -3.5, k = 0; i < 4.5; i++) {
        for (let j = -3.5; j < 4.5; j++, k++) {
            this.scene.pushMatrix();
            this.scene.registerForPick(k+1, this.cells[k]);
            this.scene.scale(0.5, 1.0, 0.5);
            this.scene.translate(j*3.5, 0.01, i*3.5);
            this.cells[k].display();
            this.scene.popMatrix();
        }
    }
};

Board.prototype.logPicking = function () {
    if (this.scene.pickMode === false) {
        if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
            for (let i = 0; i < this.scene.pickResults.length; i++) {
                let obj = this.scene.pickResults[i][0];
                if (obj) {
                    let customId = this.scene.pickResults[i][1];
                    console.log('Picked object: ' + obj + ', with pick id ' + customId);
                    if (this.cells[customId -1].hasDot()) {
                        this.cells[customId - 1].disableDot();
                    }
                    else {
                        this.cells[customId - 1].enableDot();
                    }
                }
            }
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
        }
    }
};

Board.prototype.enableDot = function (index) {
    if (index < 0 || index >= 64) {
        console.warn("Warning: invalid index for function enableDot");
    } else {
        this.cells[index].enableDot();
    }
};

Board.prototype.setDotColor = function (index, color) {
    if (index < 0 || index >= 64) {
        console.warn("Warning: passing argument index to function setDotColor in Board is invalid");
    }
    else if (['red', 'green', 'blue', 'white', 'black'].includes(color)) {
        this.cells[index].setDotMaterial(new Color(this.scene, color));
    }
    else {
        console.warn("Warning: passing argument color to function setDotColor in Board is invalid");
    }
};

Board.prototype.enableArrows = function (index, direction) {
    if (index < 0 || index >= 64) {
        console.warn('Warning: passing argument index to function enableArrows in Board is invalid');
    }
    else if (['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].includes(direction)) {
        this.cells[index].enableArrow(this.directionMap[direction]);
    }
    else {
        console.warn('Warning: passing argument direction to function enableArrows in Board is invalid');
    }
};