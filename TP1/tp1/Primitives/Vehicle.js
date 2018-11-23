
function Vehicle(scene){
  CGFobject.call(this,scene);

  this.scene=scene;


  var v=[	// U = 0
							[ // V = 0..3;
								 [-3.0, -1.5, 0.0, 1],
                 [-3.5, -2.0, 2.0, 1],
   							 [-3.5,  2.0, 2.0, 1],
   							 [-3.0,  1.5, 0.0, 1]
							],
							// U = 1
							[ // V = 0..3
                [0.0,  0.0, 3.0, 1],
                [0.0, -3.0, 2.5, 5],
                [0.0,  3.0, 2.5, 5],
                [0.0,  0.0, 3.0, 1]
							],
							// U = 2
							[ // V = 0..3
                [3.0, -1.5, 0.0, 1],
                [3.5, -2.0, 2.0, 1],
                [3.5,  2.0, 2.0, 1],
                [3.0,  1.5, 0.0, 1]
							]
						];

  var co=[	// U = 0
							[ // V = 0..3;
								 [ -2.0, -2.0, 1.0, 1 ],
								 [ -2.0, -1.0, -2.0, 1 ],
								 [ -2.0, 1.0, 5.0, 1 ],
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


  this.patch=this.makeSurface(2,3,20,20,v);

}

Vehicle.prototype=Object.create(CGFobject.prototype);
Vehicle.prototype.constructor=Vehicle;

Vehicle.prototype.getKnotsVector_ = function(degree){

  var aux=new Array();

  for(var i=0;i<degree;i++){
    aux.push(0);

  }

  for(var i=0;i<degree;i++){
    aux.push(1);

  }

  return aux;

};

Vehicle.prototype.makeSurface= function(degreeU,degreeV,npartsU,npartsV,cP){

  var nurbsSurface=new CGFnurbsSurface(degreeU,degreeV,cP);

  getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

  var nurbs = new CGFnurbsObject(this.scene,npartsU,npartsV,nurbsSurface);
  return nurbs;
};


Vehicle.prototype.display=function(){
  this.scene.pushMatrix();
  this.patch.display();
  this.scene.popMatrix();

};

Vehicle.prototype.updateTexCoords= function (aS, aT) {}
