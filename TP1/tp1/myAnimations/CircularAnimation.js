/**
* CircularAnimation
* @constructor
*/
class CircularAnimation extends Animation {
  constructor(scene, id, time, radius, centerPoint, startAngle, rotateAngle) {
    super(scene, id, time);
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
  * Update Current Angle
  *
  * @param Integer time
  */
  update(time) {
    if (Math.abs(this.currAngle) < Math.abs(this.rotateAngle)) {
      if (time > this.time) {
        time = this.time;
      }

      this.currAngle = this.startAngle + (this.angularSpeed * time);
    }
  }

  /**
  * Apply transformation matrix
  *
  */
  apply() {
    this.scene.translate(this.centerPoint[0], this.centerPoint[1], this.centerPoint[2]);
    this.scene.rotate(this.currAngle, 0, 1, 0);
    this.scene.translate(this.radius, 0, 0);
  }

}
