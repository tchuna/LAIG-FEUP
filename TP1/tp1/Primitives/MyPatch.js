

function MyPatch(scene,reference){
  CGFobject.call(this,scene);

  this.scene=scene;
  this.npartsU=reference.npartsU;
  this.npartsV=reference.npartsV;
  this.pointU=reference.npointU;
  this.pointV=reference.npointV;
  this.controlPoints=reference.controlPoints;


  this.makeSurface(this.pointU,this.pointV,this.controlPoints);

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

MyPatch.prototype.makeSurface= function(degreeU,degreeV,cP){
  
  var nurbsSurface=new CGFnurbsSurface(degreeU,degreeV,cP);

  getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

  this.nurbs = new CGFnurbsObject(this.scene,this.npartsU,this.npartsV,nurbsSurface);
};

MyPatch.prototype.display=function(){
  this.scene.pushMatrix();
  this.nurbs.display();
  this.scene.popMatrix();

};

MyPatch.prototype.updateTexCoords= function (aS, aT) {}
