DEGREE_TO_RAD = Math.PI/180;

function Dot(scene, material){
    CGFobject.call(this, scene);
    this.scene = scene;

    if (material instanceof CGFappearance) {
        this.material = material;
    } else {
        this.material = new Color(this.scene, 'white');
    }

    this.color = null;

    this.circle = new MyCircle(this.scene, {
        slices: 8
    });
}
Dot.prototype = Object.create(CGFobject.prototype);
Dot.prototype.constructor = Dot;

/**
 * Display Dot
 */
Dot.prototype.display = function(){
    this.scene.pushMatrix();
    this.scene.translate(0.0, 0.01, 0.0);
    this.scene.scale(0.8, 1.0, 0.8);
    this.scene.rotate(22.5 * DEGREE_TO_RAD, 0, 1, 0);
    this.scene.rotate(-90 * DEGREE_TO_RAD, 1, 0, 0);
    this.material.apply();
    this.circle.display();
    this.scene.popMatrix();
};

/**
 * Set dot color
 * @param color
 */
Dot.prototype.setColor = function (color) {
    this.color = color;
    this.material = new Color(this.scene, color);
};

/**
 * Get dot color
 * @returns {color}
 */
Dot.prototype.getColor = function () {
    return this.color;
};