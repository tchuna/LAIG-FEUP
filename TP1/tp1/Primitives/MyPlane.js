function Plane(scene, parts) {
	this.scene = scene;
	CGFobject.call(this, scene);

	this.npartsU = parts.npartsU;
	this.npartsV = parts.npartsV;

	this.buildControPoints(this.npartsU, this.npartsV);

	// console.log(this.controlPoints);
  	this.plane = this.makeSurface( this.npartsU, this.npartsV, this.controlPoints);
};

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;



Plane.prototype.display = function() {

	this.scene.pushMatrix();
	this.plane.display();
	this.scene.popMatrix();
};

Plane.prototype.updateTexCoords = function (aS, aT) {}

Plane.prototype.buildControPoints = function(nU, nV) {
	var matrix = [];
	const step_v = 1.0 / nV;
	const step_u = 1.0 / nU;
	this.controlPoints = [];

	for (let value_u = 0; value_u <= 1.0; value_u+=step_u) {
		for (let value_v = 0; value_v <= 1.0; value_v+=step_v) {
			matrix.push([-0.5 + value_u, 0.0, 0.5 - value_v, 1.0]);
		}
		this.controlPoints.push(matrix);
		matrix = [];
	}
}


Plane.prototype.makeSurface = function(degree1, degree2, controlVertex) {

		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, controlVertex);

		var obj = new CGFnurbsObject(this.scene, 20, 20, nurbsSurface);

		return obj;
};
