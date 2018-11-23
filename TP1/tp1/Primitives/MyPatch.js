

function Patch(scene,reference){
  CGFobject.call(this,scene);

  this.scene=scene;
  this.npartsU=reference.npartsU;
  this.npartsV=reference.npartsV;
  this.pointU=reference.npointU;
  this.pointV=reference.npointV;

  this.buildControlPoints(reference.controlPoints);
  console.log(this.controlPoints);

  // var ex=[	// U = 0
	// 						[ // V = 0..3;
	// 							 [ -2.0, -2.0, 1.0, 1 ],
	// 							 [ -2.0, -1.0, -2.0, 1 ],
	// 							 [ -2.0, 1.0, 5.0, 1 ],
	// 							 [ -2.0, 2.0, -1.0, 1 ]
	// 						],
	// 						// U = 1
	// 						[ // V = 0..3
	// 							 [ 0, -2.0, 0, 1 ],
	// 							 [ 0, -1.0, -1.0, 5 ],
	// 							 [ 0, 1.0, 1.5, 5 ],
	// 							 [ 0, 2.0, 0, 1 ]
	// 						],
	// 						// U = 2
	// 						[ // V = 0..3
	// 							 [ 2.0, -2.0, -1.0, 1 ],
	// 							 [ 2.0, -1.0, 2.0, 1 ],
	// 							 [ 2.0, 1.0, -5.0, 1 ],
	// 							 [ 2.0, 2.0, 1.0, 1 ]
	// 						]
	// 					];


  this.patch=this.makeSurface(this.pointU,this.pointV,this.npartsU,this.npartsV, this.controlPoints);

}

Patch.prototype=Object.create(CGFobject.prototype);
Patch.prototype.constructor=Patch;

Patch.prototype.buildControlPoints = function(controlPoints) {
  var index = 0;
  var matrix = [];
  var length = controlPoints.length;
  this.controlPoints = [];
  
  while (true) {
    if (index == length) {
      break;
    }

    const element = controlPoints.splice(0,1)[0];
    matrix.push(element);

    if( !( ++index % (this.pointV+1) ) ) {
      this.controlPoints.push(matrix);
      matrix = [];
    }
  }
};

Patch.prototype.getKnotsVector_ = function(degree){

  var aux=new Array();

  for(var i=0;i<degree;i++){
    aux.push(0);

  }

  for(var i=0;i<degree;i++){
    aux.push(1);

  }

  return aux;

};

Patch.prototype.makeSurface= function(degreeU,degreeV,npartsU,npartsV,cP){

  var nurbsSurface=new CGFnurbsSurface(degreeU,degreeV,cP);

  getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

  var nurbs = new CGFnurbsObject(this.scene,npartsU,npartsV,nurbsSurface);
  return nurbs;
};


Patch.prototype.display=function(){
  this.scene.pushMatrix();
  this.patch.display();
  this.scene.popMatrix();

};

Patch.prototype.updateTexCoords= function (aS, aT) {}
