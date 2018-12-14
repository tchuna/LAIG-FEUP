DEGREE_TO_RAD = Math.PI/180;

function Cell(scene){
    CGFobject.call(this, scene);
    this.scene = scene;

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

    this.cellMaterial = new CGFappearance(this.scene);
    this.cellMaterial.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.cellMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.cellMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.cellMaterial.setShininess(10.0);
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

    this.scene.pushMatrix();
    this.scene.scale(3.0, 1.0, 3.0);
    this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
    this.cellMaterial.apply();
    this.cell.display();
    this.scene.popMatrix();
};

/**
 * enable arrows identified indexes passed by argument
 */
Cell.prototype.enableArrow = function () {
    if (arguments.length > 8) {
        console.warn("Warning: arguments of function enableArrow with length higher than 8. " +
            "Extra arguments will be ignored!");
        arguments.length = 8;
    }
    for (let i = 0; i < arguments.length; i++) {
        this.activeArrows[i] = true;
    }
};

/**
 * Disable arrows identified indexes passed by argument
 */
Cell.prototype.disableArrow = function () {
    if (arguments.length > 8) {
        console.warn("Warning: arguments of function disableArrow with length higher than 8. " +
            "Extra arguments will be ignored!");
        arguments.length = 8;
    }
    for (let i = 0; i < arguments.length; i++) {
        this.activeArrows[i] = false;
    }
};

/**
 * Set dot material
 * @param material
 */
Cell.prototype.setDotMaterial = function (material) {
    if (material instanceof CGFappearance) {
        this.dotMaterial = material;
    } else {
        console.warn("Warning: passing argument of function setDotMaterial is not an instance of CGFappearance!");
    }
};

/**
 * Enable dot display
 */
Cell.prototype.enableDot = function () {
    this.dotEnabled = true;
};

/**
 * Disable dot display
 */
Cell.prototype.disableDot = function () {
    this.dotEnabled = false;
};