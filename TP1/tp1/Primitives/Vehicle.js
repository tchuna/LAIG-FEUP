
var degToRad = Math.PI / 180.0;


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

   cylnd={
    base:1,
    top:1,
    height: 1,
    slices:20,
    stacks: 20
  };

  to = {
    inner:1,
    outer: 1.2,
    slices: 20,
    loops:20
  };

  sphere= {
    radius: 1.5,
    slices: 20,
    stacks:20
  };

  this.vehicle=new Patch(this.scene,primitive);
  this.wire=new MyCylinder(this.scene,cylnd);
  this.base=new MySphere(this.scene,sphere);
  this.base_1=new MyTorus(this.scene,to);

  this.vehicl= new CGFappearance(this.scene);
  this.vehicl.loadTexture("images/c.jpg");



}

Vehicle.prototype=Object.create(CGFobject.prototype);
Vehicle.prototype.constructor=Vehicle;

Vehicle.prototype.display=function(){
  this.scene.pushMatrix();
	this.scene.translate(0, 3.0, 0);

	this.vehicle.display();

	this.scene.popMatrix();
  this.scene.pushMatrix();

  this.scene.translate(0, 3, -4.5);
  this.scene.scale(1.35, 1.35, 0.65);
  this.base_1.display();

  this.scene.popMatrix();



	this.scene.pushMatrix();
		this.scene.translate(-2.43, 3.9, -4.5);
		this.scene.rotate(15 * degToRad, 1, 0, 0);
		this.scene.rotate(20 * degToRad, 0, 0, 1);
		this.scene.rotate(-Math.PI/8, 1, 0, 0);
		this.scene.scale(0.02, 0.02, 5);
		this.wire.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(2.3, 3.9, -4.5);
		this.scene.rotate(15 * degToRad, 1, 0, 0);
		this.scene.rotate(-20 * degToRad, 0, 0, 1);
		this.scene.rotate(-Math.PI/8, 1, 0, 0);
		this.scene.scale(0.02, 0.02, 5);
		this.wire.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-2.43, 1.9, -4.5);
		this.scene.rotate(-15 * degToRad, 1, 0, 0);
		this.scene.rotate(-20 * degToRad, 0, 0, 1);
		this.scene.rotate(-Math.PI/-8, 1, 0, 0);
		this.scene.scale(0.02, 0.02, 5);
		this.wire.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(2.3, 1.9, -4.5);
		this.scene.rotate(-15 * degToRad, 1, 0, 0);
		this.scene.rotate(20 * degToRad, 0, 0, 1);
		this.scene.rotate(-Math.PI/-8, 1, 0, 0);
		this.scene.scale(0.02, 0.02, 5);
		this.wire.display();

	this.scene.popMatrix();



};

Vehicle.prototype.updateTexCoords= function (aS, aT) {}
