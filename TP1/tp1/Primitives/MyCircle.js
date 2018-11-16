
function MyCircle(scene ,reference){
  CGFobject.call(this, scene);
  this.slices = reference.slices;
  this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

MyCircle.prototype.initBuffers = function() {
  this.vertices = [];
  this.indices = [];
  this.normals = [];
  this.texCoords = [];
  this.initialTexCoords=[];

  var ang = 2 * Math.PI / this.slices;

  this.vertices.push(0, 0, 0);
  this.normals.push(0, 0, 1);
  this.texCoords.push(0.5, 0.5);

  for (var i = 0; i <= this.slices; i++) {
    this.vertices.push(Math.cos(i * ang), Math.sin(i * ang), 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5 + 0.5 * Math.cos(i * ang), 0.5 + 0.5 * Math.sin(i * ang));
  }

  for (var i = 0; i < this.slices; i++) {
    this.indices.push(0, i, i + 1);
  }

  this.indices.push(0, this.slices, 1);

  this.initialTexCoords=this.texCoords;

  this.primitiveType = this.scene.gl.TRIANGLES;
  this.initGLBuffers();
};

MyCircle.prototype.updateTexCoords = function(l_s, l_t) {
  for (let i = 0; i < this.initialTexCoords.length; i += 2) {
    this.texCoords[i] = this.initialTexCoords[i] / l_s;
    this.texCoords[i + 1] = this.initialTexCoords[i + 1] / l_t;
  }

  this.updateTexCoordsGLBuffers();
};
