

function Plane(scene,reference) {

  CGFobject.call(this, scene);
  this.npartsU=reference.npartsU;
  this.npartsV=reference.npartsV;

  console.log(this.npartsU);
  console.log(this.npartsV);



  var controlPoints = [
							[[0.5, 0, -0.5, 1],[0.5, 0, 0.5, 1]],
							[[-0.5, 0, -0.5, 1],[-0.5, 0, 0.5, 1]]
				];

  var nSurface=new CGFnurbsSurface(1, 1,controlPoints);

  surfacePoints=function(reference.npartsU,reference.npartsV){
    return nSurface.getPoint(reference.npartsU,reference.npartsV);

  }

  this.plane = new CGFnurbsObject(this.scene,this.npartsU,this.npartsV,nSurface.getPoint(this.npartsU,this.npartsV));
}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.display = function() {
		plane.display();
}

Plane.prototype.updateTexCoords = function (aS, aT) {}



// set active shader to default = this.setActiveShader(this.defaultShader);

// npoints = n pontos e U e V
// nparts = numero de divisoes na superficie
