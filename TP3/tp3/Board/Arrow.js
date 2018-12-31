DEGREE_TO_RAD = Math.PI/180;

function Arrow(scene){
    CGFobject.call(this, scene);
    this.scene = scene;

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

    this.arrowMaterial = new CGFappearance(this.scene);
    this.arrowMaterial.setAmbient(0.9, 1.0, 0.1, 1.0);
    this.arrowMaterial.setDiffuse(0.9, 1.0, 0.1, 1.0);
    this.arrowMaterial.setSpecular(0.9, 1.0, 0.1, 1.0);
    this.arrowMaterial.setShininess(10.0);
}
Arrow.prototype = Object.create(CGFobject.prototype);
Arrow.prototype.constructor = Arrow;

/**
 * Display a arrow
 */
Arrow.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.translate(0.0, 0.01, 1.2);
    this.scene.scale(1.3, 1.0, 0.6);
    this.arrowMaterial.apply();
    this.arrow.display();
    this.scene.popMatrix();
};