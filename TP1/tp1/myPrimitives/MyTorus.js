function MyTorus(scene, reference) {
    CGFobject.call(this, scene);

    this.inner = reference.inner;
    this.outer = reference.outer;
    this.slices = reference.slices;
    this.loops = reference.loops;

    this.initBuffers();
};


MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor = MyTorus;

MyTorus.prototype.initBuffers = function() {

    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords=[];
    this.initTexCoords = [];

    var c = (this.outer + this.inner) / 2;
    var verts = 0;

    var angCircle = 2 * Math.PI / this.slices;
    var angBTCircle = 2 * Math.PI / this.loops;



    for (var i= 0; i <= this.slices; i++) {
        for (var j = 0; j <= this.loops; j++) {

            let x = (this.outer + this.inner * Math.cos(j * angBTCircle)) * Math.cos(i * angCircle);
            let y = (this.outer + this.inner * Math.cos(j * angBTCircle)) * Math.sin(i * angCircle);
            let z = this.inner * Math.sin(j * angCircle)

            let nx = (this.inner * Math.cos(j * angBTCircle)) * Math.cos(i * angCircle);
            let ny = (this.inner * Math.cos(j * angBTCircle)) * Math.sin(i * angCircle);
            let nz = this.inner * Math.sin(j * angCircle)

            this.vertices.push(x, y, z);
            this.normals.push(nx, ny, nz);

            let xCoord = Math.acos(x / this.inner) / (2 * Math.PI);
            let yCoord = 2 * Math.PI * Math.acos(z / (this.inner + this.outer * Math.cos(2 * Math.PI * xCoord)));

            yCoord = i / this.slices;
            xCoord = (j % (this.loops + 1)) / this.slices;

            this.texCoords.push(xCoord, yCoord);

            verts++;

            if (i > 0 && j > 0) {
                this.indices.push(verts - this.loops - 2, verts - 2, verts - 1);
                this.indices.push(verts - 2, verts - this.loops - 2, verts - this.loops - 3);
            }
        }
    }

    this.initTexCoords= this.texCoords;
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();

}

MyTorus.prototype.updateTexCoords = function(l_s, l_t) {

  for (let i = 0; i < this.initialTexCoords.length; i += 2) {
    this.texCoords[i] = this.initialTexCoords[i] / l_s;
    this.texCoords[i + 1] = this.initialTexCoords[i + 1] / l_t;
  }


  this.updateTexCoordsGLBuffers();
}
