
 function MyCylinderWithOutBase(scene, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);


    this.slices =slices
    this.stacks = stacks;
    this.base = base;
    this.top = top;
    this.height = height;
    this.deltaHeight = this.height / this.stacks;
    this.delta = (this.top - this.base) / this.stacks;

    this.initBuffers();
};

MyCylinderWithOutBase.prototype = Object.create(CGFobject.prototype);
MyCylinderWithOutBase.prototype.constructor = MyCylinderWithOutBase;

MyCylinderWithOutBase.prototype.initBuffers = function() {

    

    var angl = -2 * Math.PI / this.slices;

    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];
    this.initialTexCoords = [];

    var patchLengthx = 1 / this.slices;
    var patchLengthy = 1 / this.stacks;
    var xCoord = 0;
    var yCoord = 0;


    for (var q = 0; q < this.stacks + 1; q++) {

        var z = (q * this.deltaHeight / this.stacks);
        var inc = (q * this.delta) + this.base;

        for (var i = 0; i < this.slices; i++) {
            this.vertices.push(inc * Math.cos(i * angl), inc * Math.sin(i * angl), q * this.deltaHeight);
            this.normals.push(Math.cos(i * angl), Math.sin(i * angl), 0);
            this.texCoords.push(xCoord, yCoord);
            xCoord += patchLengthx;
        }
        xCoord = 0;
        yCoord += patchLengthy;

    }


    for (var q = 0; q < this.stacks; q++) {
        for (var i = 0; i < this.slices; i++) {
            this.indices.push(this.slices * q + i, this.slices * q + i + 1, this.slices * (q + 1) + i);
            this.indices.push(this.slices * q + i + 1, this.slices * q + i, this.slices * (q + 1) + i);
            if (i != (this.slices - 1)) {
                this.indices.push(this.slices * (q + 1) + i + 1, this.slices * (q + 1) + i, this.slices * q + i + 1);
                this.indices.push(this.slices * (q + 1) + i, this.slices * (q + 1) + i + 1, this.slices * q + i + 1);
            } else {
                this.indices.push(this.slices * q, this.slices * q + i + 1, this.slices * q + i);
                this.indices.push(this.slices * q + i + 1, this.slices * q, this.slices * q + i);
            }


        }

    }

    this.initialTexCoords = this.texCoords;

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
};

MyCylinderWithOutBase.prototype.updateTexCoords = function(l_s, l_t) {

  for (let i = 0; i < this.initialTexCoords.length; i += 2) {
    this.texCoords[i] = this.initialTexCoords[i] / l_s;
    this.texCoords[i + 1] = this.initialTexCoords[i + 1] / l_t;

  }

    this.updateTexCoordsGLBuffers();
};
