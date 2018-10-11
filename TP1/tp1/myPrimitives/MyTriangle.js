

function MyTriangle(scene,references){
  CGFobject.call(this,scene);

  var points=[[references.x1,references.y1,references.z1],
          [references.x2,references.y2,references.z2],
          [references.x3,references.y3,references.z3]
        ];

  this.point_1=points[0];
  this.point_2=points[1];
  this.point_3=points[2];

  this.initBuffers();

};

MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor = MyTriangle;

MyTriangle.prototype.initBuffers=function(){

  this.texCoords=[0,1,
                  1,1,
                  0,0,
                  1,0
                 ];


  this.vertices=[this.point_1[0],this.point_1[1],this.point_1[2],
                 this.point_2[0],this.point_2[1],this.point_2[2],
                 this.point_3[0],this.point_3[1],this.point_3[2]
                ];


  this.indices=[0,1,2];

  //vector point_1 to point_2
  var v_2_1=[this.point_2[0]-this.point_1[0],
             this.point_2[1]-this.point_1[1],
             this.point_2[2]-this.point_1[2]
           ];

 //vector point_2 to point_3
 var v_3_2=[this.point_3[0]-this.point_2[0],
            this.point_3[1]-this.point_2[1],
            this.point_3[2]-this.point_2[2]
          ];
  //vect product
  var vecProd=[v_2_1[1]*v_3_2[2]-v_2_1[2]*v_3_2[1],
               v_2_1[2]*v_3_2[0]-v_2_1[0]*v_3_2[2],
               v_2_1[0]*v_3_2[1]-v_2_1[1]*v_3_2[0]
             ];

  //vect normal
  var normals=[vecProd[0],vecProd[1],vecProd[2],
               vecProd[0],vecProd[1],vecProd[2],
               vecProd[0],vecProd[1],vecProd[2]
               ];

  this.primitiveType=this.scene.gl.TRIANGLES;
  this.initGLBuffers();

};


MyTriangle.updateTexCoords = function (ampliFactorS, ampliFactorT){

  this.disp1_p2=Math.sqrt( Math.pow((this.point_2[0] - this.point_1[0]), 2) +
                      Math.pow((this.point_2[1] - this.point_1[1]), 2) +
                      Math.pow((this.point_2[2] - this.point_1[2]), 2));

  this.disp3_p1= Math.sqrt( Math.pow((this.point_1[0] - this.point_3[0]), 2) +
			                Math.pow((this.point_1[1] - this.point_3[1]), 2) +
                      Math.pow((this.point_1[2] - this.point_3[2]), 2));

	this.disp2_p3 = Math.sqrt( Math.pow((this.point_3[0] - this.point_2[0]), 2) +
			                Math.pow((this.point_3[1] - this.point_2[1]), 2) +
			                Math.pow((this.point_3[2] - this.point_2[2]), 2));

  var angBt = Math.acos((Math.pow(disp2_p3, 2) - Math.pow(disp3_p1, 2) + Math.pow(disp1_p2, 2)) / (2 * disp2_p3 * disp1_p2));

  var aux = disp2_p3 * Math.sin(angBt);

  this.texCoords = [0, aux/ampliFactorT,
                    disp1_p2/ampliFactorS, aux/ampliFactorT,
                    (disp1_p2-disp2_p3*Math.cos(angBt))/afS,(aux-disp2_p3*Math.sin(angBt))/ampliFactorT
                   ];

  this.updateTexCoords();

};
