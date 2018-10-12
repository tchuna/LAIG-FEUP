


function MySphere(scene, reference) {
    CGFobject.call(this, scene);

    this.radius = reference.radius;

    this.semiSphereT = new MySemiSphere(this.scene, reference.slices, reference.stacks);
    this.semiSphereB = new MySemiSphere(this.scene, reference.slices, reference.stacks);

};

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.display = function() {

    this.scene.pushMatrix();
    this.scene.scale(this.radius, this.radius, this.radius);
    this.semiSphereT.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(this.radius, this.radius, this.radius);
    this.scene.rotate(Math.PI, 1, 0, 0);
    this.semiSphereB.display();
    this.scene.popMatrix();

};

MySphere.prototype.updateTexCoords = function(l_s, l_t) {
  this.semiSphereT.updateTexCoords(l_s,l_t);
  this.semiSphereB.updateTexCoords(l_s, l_t);
};
