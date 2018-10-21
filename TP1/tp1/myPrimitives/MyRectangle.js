function MyRectangle(scene, reference) {
    CGFobject.call(this, scene);

    this.x1 = reference.x1;
    this.x2 = reference.x2;
    this.y1 = reference.y1;
    this.y2 = reference.y2;

    this.initBuffers();
};

MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor = MyRectangle;

MyRectangle.prototype.initBuffers = function() {


    this.minS = 0;
    this.maxS = 1;
    this.minT = 0;
    this.maxT = 1;

    this.initialTexCoords=[];

    this.vertices = [
        this.x1, this.y1, 0,
        this.x2, this.y1, 0,
        this.x1, this.y2, 0,
        this.x2, this.y2, 0
    ];

    this.indices = [
        0, 1, 2,
        3, 2, 1
    ];



    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    this.texCoords = [
        this.maxS, this.minT,
        this.maxS, this.maxT,
        this.minS, this.minT,
        this.minS, this.maxT
    ];


    this.initialTexCoords=this.texCoords;

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

};

MyRectangle.prototype.updateTexCoords = function(l_s, l_t) {
  var minS = 0;
  var minT = 0;
  var maxS = (this.x2 - this.x1)/l_s;
  var maxT = (this.y2 - this.y1)/l_t;

  this.texCoords = [
      maxS, minT,
      maxS, maxT,
      minS, minT,
      minS, maxT
  ];

  this.updateTexCoordsGLBuffers();
};
