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
    for (let i = 0; i < 64; i++) {
        this.cells.push(new Cell(this.scene));
    }

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

    this.scene.pushMatrix();
    this.scene.scale(15.0, 1.0, 15.0);
    this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
    this.boardMaterial.apply();
    this.board.display();
    this.scene.popMatrix();

    for (let i = -3.5, k = 0; i < 4.5; i++) {
        for (let j = -3.5; j < 4.5; j++, k++) {
            this.scene.pushMatrix();
            this.scene.scale(0.5, 1.0, 0.5);
            this.scene.translate(j*3.5, 0.01, i*3.5);
            this.cells[k].display();
            this.scene.popMatrix();
        }
    }

};

Board.prototype.enableDot = function (index) {
    if (index < 0 || index >= 64) {
        console.warn("Warning: invalid index for function enableDot")
    } else {
        this.cells[index].enableDot();
    }
};