

function MyPatch(scene,reference){
  CGFobject.call(this,scene);

  this.scene=scene;
  this.npartsU=reference.npartsU;
  this.npartsV=reference.npartsV;
  this.pointU=reference.npointU;
  this.pointV=reference.npointV;
  this.controlPoints=reference.controlPoints;


  var co=[	// U = 0
							[ // V = 0..3;
								 [ -2.0, -2.0, 1.0, 1 ],
								 [ -2.0, -1.0, -2.0, 1 ],
								 [ -2.0, 1.0, 5.0, 1 ],
								 [ -2.0, 2.0, -1.0, 1 ],
                [ -2.0, 2.0, -1.0, 1 ]
							],
							// U = 1
							[ // V = 0..3
								 [ 0, -2.0, 0, 1 ],
								 [ 0, -1.0, -1.0, 5 ],
								 [ 0, 1.0, 1.5, 5 ],
								 [ 0, 2.0, 0, 1 ]
							],
							// U = 2
							[ // V = 0..3
								 [ 2.0, -2.0, -1.0, 1 ],
								 [ 2.0, -1.0, 2.0, 1 ],
								 [ 2.0, 1.0, -5.0, 1 ],
								 [ 2.0, 2.0, 1.0, 1 ]
							]
						];


  this.patch=this.makeSurface(this.pointU,this.pointV,this.npartsU,this.npartsV,co);

}

MyPatch.prototype=Object.create(CGFobject.prototype);
MyPatch.prototype.constructor=MyPatch;

MyPatch.prototype.getKnotsVector_ = function(degree){

  var aux=new Array();

  for(var i=0;i<degree;i++){
    aux.push(0);

  }

  for(var i=0;i<degree;i++){
    aux.push(1);

  }

  return aux;

};

MyPatch.prototype.makeSurface= function(degreeU,degreeV,npartsU,npartsV,cP){

  var nurbsSurface=new CGFnurbsSurface(degreeU,degreeV,cP);

  getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

  var nurbs = new CGFnurbsObject(this.scene,npartsU,npartsV,nurbsSurface);
  return nurbs;
};


MyPatch.prototype.display=function(){
  this.scene.pushMatrix();
  this.patch.display();
  this.scene.popMatrix();

};

MyPatch.prototype.updateTexCoords= function (aS, aT) {}
