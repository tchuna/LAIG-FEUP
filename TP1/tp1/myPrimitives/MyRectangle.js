
function MyRectangle(scene,reference){

  CGFobject.call(this,scene);


  this.x1=reference.x1;
  this.y1=reference.y1;
  this.x2=reference.x2;
  this.y2=reference.y2;

  this.minS = 0;
  this.maxS = 1;
  this.minT = 0;
  this.maxT = 1;

  this.initBuffers();

};


MyRectangle.prototype=Object.create(CGFobject.prototype);

MyRectangle.prototype.constructor=MyRectangle;

MyRectangle.prototype.initBuffers= function() {

  this.vertices=[this.x2,this.y2,0,
                 this.x2,this.y1,0,
                 this.x1,this.y2,0,
                 this.x1,this.y1,0
               ];

  this.indices=[0,1,2,
                3,,2,1
              ];



  this.mormals=[this.x2,this.y2,0,
                 this.x2,this.y1,0,
                 this.x1,this.y2,0,
                 this.x1,this.y1,0
               ];

  this.intTCoords=[this.maxS, this.maxT,
                  this.maxS, this.minT,
                  this.minS, this.maxT,
                  this.minS, this.minT
                ];


  this.texCoords=this.intTCoords.slice();

  this.primitiveType=this.scene.gl.TRIANGLES;
  this.initGLBuffers();

};


MyRectangle.prototype.updateTexCoords = function(l_s, l_t) {

  for (var i = 0; i < this.texCoords.length; i += 2) {
      this.texCoords[i] = this.intTCoords[i] / l_s;
      this.texCoords[i + 1] = this.intTCoords[i+1] / l_t;
    }

    this.updateTexCoordsGLBuffers();
};
