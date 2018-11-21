/**
* constructor of Node object
* @constructor Node
* @param {String} id    string of the id
*/

function Node(id, type) {
  this.id = id;
  this.type = type;

  if (this.type == 'component') {
    this.texture = null;
    this.materials = [];
    this.animations = [];

    this.currAnimationId = 0;

    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);
    this.transforms = [];

    this.children = [];
    this.parent = null;

  }
  else {
    this.primitive = null;
    this.parents = [];
  }

}

Node.prototype.setMatrix = function () {
  mat4.identity(this.transformMatrix);

  for (var i = 0; i < this.transforms.length; i++) {
    switch (this.transforms[i].type) {
      case "translate" :
        var x = this.transforms[i].x;
        var y = this.transforms[i].y;
        var z = this.transforms[i].z;
        mat4.translate(this.transformMatrix, this.transformMatrix, [x, y, z]);
        break;
      case "scale" :
        var x = this.transforms[i].x;
        var y = this.transforms[i].y;
        var z = this.transforms[i].z;
        mat4.scale(this.transformMatrix, this.transformMatrix, [x, y, z]);
        break;
      case "rotate" :
        switch (this.transforms[i].axis) {
          case 'x' :
            mat4.rotate(this.transformMatrix, this.transformMatrix, this.transforms[i].angle, [1,0,0]);
            break;
          case 'y' :
            mat4.rotate(this.transformMatrix, this.transformMatrix, this.transforms[i].angle, [0,1,0]);
            break;
          case 'z' :
            mat4.rotate(this.transformMatrix, this.transformMatrix, this.transforms[i].angle, [0,0,1]);
            break;
          default:
            throw new Error('There is no axis '+this.transform[i].axis);
            break;
        }
        break;
    }
  }

  mat4.copy(this.originalTransformMatrix, this.transformMatrix);
};

Node.prototype.update = function (deltaTime) {
  if (this.type == 'component') {
    if (this.animations.length > 0) {

      this.animations[this.currAnimationId].update(deltaTime);

      if (!this.animations[this.currAnimationId].enable) {
        this.animations[this.currAnimationId].enableAnimation();
        this.currAnimationId++;
      }
      if(this.currAnimationId >= this.animations.length) {
        this.currAnimationId = 0;
      }
    }
  }
};
