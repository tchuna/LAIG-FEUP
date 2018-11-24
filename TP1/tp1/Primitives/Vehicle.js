
function Vehicle(scene){
  CGFobject.call(this,scene);

  this.scene=scene;


  var points=[	// U = 0
							// V = 0..3;
								 [-3.0, -1.5, 0.0, 1],
                 [-3.5, -2.0, 2.0, 1],
   							 [-3.5,  2.0, 2.0, 1],
   							 [-3.0,  1.5, 0.0, 1],

							// U = 1
							 // V = 0..
                [0.0,  0.0, 3.0, 1],
                [0.0, -3.0, 2.5, 5],
                [0.0,  3.0, 2.5, 5],
                [0.0,  0.0, 3.0, 1],

							// U = 2
							// V = 0..3
                [3.0, -1.5, 0.0, 1],
                [3.5, -2.0, 2.0, 1],
                [3.5,  2.0, 2.0, 1],
                [3.0,  1.5, 0.0, 1]

						];





  primitive={
    npointU: 2,
    npointV: 3,
    npartsU: 20,
    npartsV: 20,
    controlPoints: points
  };

  this.vehicle=new Patch(this.scene,primitive);

}

Vehicle.prototype=Object.create(CGFobject.prototype);
Vehicle.prototype.constructor=Vehicle;

Vehicle.prototype.display=function(){
  this.scene.pushMatrix();
  this.vehicle.display();
  this.scene.popMatrix();

};

Vehicle.prototype.updateTexCoords= function (aS, aT) {}
