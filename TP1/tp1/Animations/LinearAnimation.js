/**
* LinearAnimation
* @constructor
*/
class LinearAnimation extends Animation{

  constructor(scene, id, duration, controlPoints){
    super(scene, id, duration);
    // Control Points
    this.controlPoints = controlPoints;
    // Linear Speed
    this.speed = 0;
    // Total Distance
    this.totalDistance = 0;
    // Distance between two conscutive points
    this.distancePerSegment = [];
    // Current position [x,y,z]
    this.currentPosition = controlPoints[0];
    // Time between two consecutive points
    this.timePerSegment = [];
    // Index of current line segment
    this.index = 0;
    // Calculate the distance between conscutive control points, and the total distance
    var distance;
    for (let i = 0; i < this.controlPoints.length-1; i++) {
      distance = vec3.dist(vec3.fromValues(this.controlPoints[i][0], this.controlPoints[i][1], this.controlPoints[i][2]),
                               vec3.fromValues(this.controlPoints[i+1][0], this.controlPoints[i+1][1], this.controlPoints[i+1][2]));
      this.totalDistance += distance;
      this.distancePerSegment.push(distance);
    }
    // Calculate the speed
    this.speed = this.totalDistance / this.duration;
    // Calculate the time between conscutive control points
    for (var i = 0; i < this.distancePerSegment.length; i++) {
      this.timePerSegment.push(this.distancePerSegment[i] / this.speed);
    }

    this.updateMovementDirection();
    this.updateSpeedComponents();
  }


  /**
  * Update current initial and final position and the angle of
  * the movement
  *
  */
  updateMovementDirection() {
    // Initial position
    this.xi = this.controlPoints[this.index][0];
    this.yi = this.controlPoints[this.index][1];
    this.zi = this.controlPoints[this.index][2];
    // Final position
    this.xf = this.controlPoints[this.index + 1][0];
    this.yf = this.controlPoints[this.index + 1][1];
    this.zf = this.controlPoints[this.index + 1][2];
    // Angle
    this.angle = Math.atan2(this.zf - this.zi, this.xf - this.xi);
  }

  /**
  * Update the components X, Y, and Z of speed
  *
  */
  updateSpeedComponents() {
    this.speed_x = this.speed * ((this.xf - this.xi) / Math.abs(this.distancePerSegment[this.index]));
    this.speed_y = this.speed * ((this.yf - this.yi) / Math.abs(this.distancePerSegment[this.index]));
    this.speed_z = this.speed * ((this.zf - this.zi) / Math.abs(this.distancePerSegment[this.index]));
  }

  /**
  * Return the sum of time from index_i to index_f (inclusive) of
  * timePerSegment array
  *
  * @param index_i  initial index
  * @param index_f  final index
  */
  timeFromTo(index_i, index_f) {
    var timeSum = 0;
    for (var i = index_i; i <= index_f; i++) {
      timeSum += this.timePerSegment[i];
    }
    return timeSum;
  }

  /**
  * Update variables
  *
  * @param time   elapsed time
  */
  update(time) {
    if (this.index != this.distancePerSegment.length - 1) {
      if (time >= this.timeFromTo(0, this.index)) {
        this.index++;
        this.updateMovementDirection();
        this.updateSpeedComponents();
      }
      else {
        this.currentPosition[0] = this.speed_x * time;
        this.currentPosition[1] = this.speed_y * time;
        this.currentPosition[2] = this.speed_z * time;
      }
    }
  }

  /**
  * Apply transformations to the scene
  *
  */
  apply() {
    this.scene.translate(this.xi, this.yi, this.zi);
    this.scene.translate(this.currentPosition[0], this.currentPosition[1], this.currentPosition[2]);
    this.scene.rotate((Math.PI / 2) - this.angle, 0, 1, 0);
  }

  /**
  * Reset variables to default value
  *
  */
  reset() {
    this.index = 0;
    this.updateMovementDirection();
    this.updateSpeedComponents();
  }
}
