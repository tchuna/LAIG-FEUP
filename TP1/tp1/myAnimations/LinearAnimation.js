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
    // Current position
    this.currentPosition = 0;
    // Time between two consecutive points
    this.timePerSegment = [];
    // Index of current line segment
    this.index = 0;
    // Calculate the distance between conscutive control points, and the total distance
    var distance;
    for (let i = 0; i < this.controlPoints.length-1; i++) {
      distance = vec3.dis(vec3.fromValues(this.controlPoints[i][0], this.controlPoints[i][1], this.controlPoints[i][2]),
                               vec3.fromValues(this.controlPoints[i+1][0], this.controlPoints[i+1][1], this.controlPoints[i+1][2]));
      this.totalDistance += distance;
      this.distancePerSegment.push(distance);
    }
    // Calculate the speed
    this.speed = this.totalDistance / this.time;
    // Calculate the time between conscutive control points
    for (var i = 0; i < this.distancePerSegment.length; i++) {
      this.timePerSegment.push(this.distancePerSegment[i] / this.speed);
    }

    this.updateMovementDirection();
  }


  /**
  * Update current movement direction (starting and final points)
  * and the directional angle
  */
  updateMovementDirection() {
    this.xi = this.controlPoints[this.index][0];
    this.yi = this.controlPoints[this.index][1];
    this.zi = this.controlPoints[this.index][2];
    this.xf = this.controlPoints[this.index + 1][0];
    this.yf = this.controlPoints[this.index + 1][1];
    this.zf = this.controlPoints[this.index + 1][2];
    this.angle = Math.atan2(this.zf - this.zi, this.xf - this.xi);
  }

  update(time) {
    

  }

  apply() {

  }
}
