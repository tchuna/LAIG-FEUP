function Plane(scene, parts) {
	this.scene = scene;
	CGFobject.call(this,scene);






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

	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

  this.plane =this.makeSurface(2, // degree on U: 3 control vertexes U
						 1, // degree on V: 2 control vertexes on V
						[	// U = 0
							[ // V = 0..1;
								 [ -1.5, -1.5, 0.0, 1 ],
								 [ -1.5,  1.5, 0.0, 1 ]

							],
							// U = 1
							[ // V = 0..1
								 [ 0, -1.5, 3.0, 1 ],
								 [ 0,  1.5, 3.0, 1 ]
							],
							// U = 2
							[ // V = 0..1
								[ 1.5, -1.5, 0.0, 1 ],
								[ 1.5,  1.5, 0.0, 1 ]
							]
						]);
	//this.makeSurface(1,1,controlPoints);//new CGFnurbsObject(this.scene,40,80,nurbsSurface);


}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;



Plane.prototype.display = function() {

		this.scene.pushMatrix();
	  this.plane.display();
    //CGFnurbsObject.prototype.display.call(this.plane);
		this.scene.popMatrix();
}

Plane.prototype.updateTexCoords = function (aS, aT) {}


Plane.prototype.makeSurface=function(degree1, degree2,c) {

		var nurbsSurface = new CGFnurbsSurface(degree1, degree2, c);

		var obj = new CGFnurbsObject(this.scene, 30, 30, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)

		return obj;
	};
