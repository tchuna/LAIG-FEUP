function MyPlane(scene, parts) {
	this.scene = scene;

	CGFobject.call(this,scene);
	this.npartsU=parts.npartsU;
	this.npartsV=parts.npartsV;






	var controlPoints = [
							[
								[0.5, 0, -0.5, 1],
								[0.5, 0, 0.5, 1]
							],
							[
								[-0.5, 0, -0.5, 1],
								[-0.5, 0, 0.5, 1]
							]
						];

	var nurbsSurface = new CGFnurbsSurface(1,1,controlPoints);

	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

  this.plane = new CGFnurbsObject(this.scene,this.npartsU,this.npartsV,nurbsSurface);


}

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.display = function() {

		this.scene.pushMatrix();
	  this.plane.display();
    //CGFnurbsObject.prototype.display.call(this.plane);
		this.scene.popMatrix();
}

MyPlane.prototype.updateTexCoords = function (aS, aT) {}
