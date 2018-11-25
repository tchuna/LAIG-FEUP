function Cylinder2(scene,reference){
  CGFobject.call(this,scene);

  this.slices = reference.slices;
  this.stacks = reference.stacks;
  this.height = reference.height;

  var aux=[
    [0,-4,0],
    [-4,-4,0],
    [-4,0,0],
    [-4,4,0],
    [0,4,0],
    [4,4,0],
    [4,0,0],
    [4,-4,0],
    [0,-4,0]
  ];

  this.scene=scene;
  primitive={
    npointU:2,
    npointV: 2,
    npartsU:20,
    npartsV:20,
    controlPoints: aux
  };

  this.cylinder2=new Patch(this.scene,primitive);
}



Cylinder2.prototype=Object.create(CGFobject.prototype);
Cylinder2.prototype.constructor=Cylinder2;

Cylinder2.prototype.display=function(){
  this.scene.pushMatrix();
  this.cylinder2.display();
  this.scene.popMatrix();

};

Cylinder2.prototype.updateTexCoords= function (aS, aT) {}
