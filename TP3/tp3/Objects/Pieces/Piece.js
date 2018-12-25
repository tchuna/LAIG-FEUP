DEGREE_TO_RAD = Math.PI/180;

function Piece(id, scene, material){
    CGFobject.call(this, scene);
    this.scene = scene;

    this.id = id;

    if (material instanceof CGFappearance) {
        this.material = material;
    } else {
        this.material = new Color(this.scene, 'white');
    }

    this.piece = new CGFOBJModel(this.scene, '/tp3/Objects/Pieces/arrow.obj');
}
Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

/**
 * Display Dot
 */
Piece.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.translate(0.0, 0.2, 0.0);
    this.scene.scale(0.6, 0.5, 1.1);
    this.scene.rotate(-90 * DEGREE_TO_RAD, 0, 1, 0);
    this.material.apply();
    this.piece.display();
    this.scene.popMatrix();
};