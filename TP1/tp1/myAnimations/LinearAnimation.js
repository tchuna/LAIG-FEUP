

class LinearAnimation extends Animation{

  constructor(scene ,id,duration,contPoints){
    super(scene,id,duration);
    this.controlPoints=controlPoints;
    this.velocity=0;
    this.initialAng;
    this.totalDistance=0;
    this.distance;
    this.finished=false;
    this.segDistance=[];
    this.direction=vec3.create();

    this.initValues();

  }

  initValues(){
    var dir = vec3.create();

    for (let i = 1; i < this.controlPoints.length; i++) {
      vec3.sub(dir, this.controlPoints[i], this.controlPoints[i - 1]);
      this.totalDist += vec3.length(dir);
    }



  }



}
