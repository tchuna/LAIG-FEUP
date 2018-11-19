/**
* CircularAnimation
* @constructor
*/
class CircularAnimation extends Animation {
  constructor(scene, id, duration, centerPoint, radius, startAngle, rotateAngle) {
    super(scene, id, duration);
    // Radius
    this.radius = radius;
    // Center coordinates [x,y,z]
    this.centerPoint = centerPoint;
    // Starting Angle
    this.startAngle = startAngle * DEGREE_TO_RAD;
    // Total Angle to Rotate
    this.rotateAngle = rotateAngle * DEGREE_TO_RAD;
    // Current Angle
    this.currAngle = 0;
    // Angular Speed = Angle / Time;
    this.angularSpeed = this.rotateAngle / this.time;
  }


  /**
  * Update variables
  *
  * @param time  elapsed time
  */
  update(time) {
    if (Math.abs(this.currAngle) < Math.abs(this.rotateAngle)) {
      if (time > this.duration) {
        time = this.duration;
      }

      this.currAngle = this.startAngle + (this.angularSpeed * time);
    }
  }

  /**
  * Apply transformations to the scene
  *
  */
  apply() {
    this.scene.translate(this.centerPoint[0], this.centerPoint[1], this.centerPoint[2]);
    this.scene.rotate(this.currAngle, 0, 1, 0);
    this.scene.translate(this.radius, 0, 0);
  }

}
