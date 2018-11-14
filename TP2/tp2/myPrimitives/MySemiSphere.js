function MySemiSphere(scene, slices, stacks) {
    CGFobject.call(this, scene);

    this.slices = slices;
    this.stacks = stacks;


    this.initBuffers();
};

MySemiSphere.prototype = Object.create(CGFobject.prototype);
MySemiSphere.prototype.constructor = MySemiSphere;

MySemiSphere.prototype.initBuffers = function() {

    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];
    this.initialTexCoords=[];

    var angT = 2 * Math.PI / this.slices;
    var fi = (Math.PI / 2) / this.stacks;

    for (let j = 0; j <= this.stacks; j++) {

        for (let i = 0; i <= this.slices; i++) {
            this.vertices.push(Math.cos(angT * i) * Math.cos(fi * j), Math.sin(angT * i) * Math.cos(fi * j), Math.sin(fi * j));
            this.normals.push(Math.cos(angT * i) * Math.cos(fi * j), Math.sin(angT * i) * Math.cos(fi * j), Math.sin(fi * j));
            this.texCoords.push(i * 1 / this.slices, j * 1 / this.stacks);
        }
    }


    for (let i = 0; i < this.stacks; i++) {
        for (let j = 0; j < this.slices; j++) {

            this.indices.push(i * (this.slices + 1) + j, i * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + j);
            this.indices.push(i * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + j);
        }
    }

    this.initialTexCoords=this.texCoords;
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};


MySemiSphere.prototype.updateTexCoords = function(l_s, l_t) {

  for (let i = 0; i < this.initialTexCoords.length; i += 2) {
    this.texCoords[i] = this.initialTexCoords[i] / l_s;
    this.texCoords[i + 1] = this.initialTexCoords[i + 1] / l_t;
  }


    this.updateTexCoordsGLBuffers();
};
