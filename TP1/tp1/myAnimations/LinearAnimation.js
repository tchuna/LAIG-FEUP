/**
* LinearAnimation
* @constructor
*/

class LinearAnimation extends Animation{

  constructor(scene, id, time, controlPoints){
    super(scene, id, time);
    // Control Points
    this.controlPoints = controlPoints;
    // Linear Speed
    this.speed = 0;
    // Total Distance
    this.totalDistance = 0;
    // Distance between two conscutive points
    this.distancePerSegment = [];
    // Time between two consecutive points
    this.timePerSegment = [];
    // Index of current line segment
    this.index = 0;
    // Direction of the movement between two consecutive points
    this.anglePerSegment = [];

    this.initValues();

  }

  initValues(){
    // Calculate the distance between conscutive control points, and the total distance
    var distance;
    for (let i = 0; i < this.controlPoints.length-1; i++) {
      distance = vec3.dis(vec3.fromValues(this.controlPoints[i][0], this.controlPoints[i][1], this.controlPoints[i][2]),
                               vec3.fromValues(this.controlPoints[i+1][0], this.controlPoints[i+1][1], this.controlPoints[i+1][2]));
      this.totalDistance += distance;
      this.distancePerSegment.push(distance);
    }

    // Calcula the speed
    this.speed = this.totalDistance / this.time;

    // Calculate the time between conscutive control points
    for (var i = 0; i < this.distancePerSegment.length; i++) {
      this.timePerSegment.push(this.distancePerSegment[i] / this.speed);
    }
  }
}
