DEGREE_TO_RAD = Math.PI/180;

function BoardCell(scene){
    CGFobject.call(this, scene);
    this.scene = scene;

    this.circle = new MyCircle(this.scene, {
        slices: 8
    });
    this.arrow = new MyTriangle(this.scene, {
        x1: 0.5 ,
        y1: 0.0,
        z1: -0.5,
        x2: -0.5,
        y2: 0.0,
        z2: -0.5,
        x3: 0.0,
        y3: 0.0,
        z3: 0.5
    });
    this.cell = new MyRectangle(this.scene, {
        x1: -0.5,
        y1: -0.5,
        x2: 0.5,
        y2: 0.5
    });

    this.cellMaterial = new CGFappearance(this.scene);
    this.cellMaterial.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.cellMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.cellMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.cellMaterial.setShininess(10.0);
    this.cellMaterial.loadTexture("/tp3/scenes/images/wood_grain.png");

    this.circleMaterial = new CGFappearance(this.scene);
    this.circleMaterial.setAmbient(0.0, 0.0, 0.0, 1.0);
    this.circleMaterial.setDiffuse(0.0, 0.0, 0.0, 1.0);
    this.circleMaterial.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.circleMaterial.setShininess(10.0);

    this.arrowMaterial = new CGFappearance(this.scene);
    this.arrowMaterial.setAmbient(1.0, 0.0, 0.0, 1.0);
    this.arrowMaterial.setDiffuse(1.0, 0.0, 0.0, 1.0);
    this.arrowMaterial.setSpecular(1.0, 0.0, 0.0, 1.0);
    this.arrowMaterial.setShininess(10.0);
}
BoardCell.prototype = Object.create(CGFobject.prototype);
BoardCell.prototype.constructor = BoardCell;

BoardCell.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.translate(0.0, 0.01, 0.0);
    this.scene.scale(0.8, 1.0, 0.8);
    this.scene.rotate(22.5 * DEGREE_TO_RAD, 0, 1, 0);
    this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
    this.circleMaterial.apply();
    this.circle.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.0, 0.01, 1.2);
    this.scene.scale(1.3, 1.0, 0.6);
    this.arrowMaterial.apply();
    this.arrow.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(3.0, 1.0, 3.0);
    this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
    this.cellMaterial.apply();
    this.cell.display();
    this.scene.popMatrix();

};