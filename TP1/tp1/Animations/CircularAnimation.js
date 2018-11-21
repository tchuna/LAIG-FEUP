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
    this.currAngle = this.startAngle;
    // Angular Speed = Angle / Duration;
    this.angularSpeed = (this.rotateAngle - this.startAngle) / this.duration;
    // Enable/Disable animation
    this.enable = true;

  }


  /**
  * Update variables
  *
  * @param time  elapsed time
  */
  update(deltaTime) {
    if (Math.abs(this.currAngle) >= Math.abs(this.rotateAngle)) {
      this.reset();
      this.enable = false;
    }

    this.currAngle -= (this.angularSpeed * deltaTime);
  }

  /**
  * Apply transformations to the scene
  *
  */
  apply() {
    this.scene.translate(this.centerPoint[0], this.centerPoint[1],  this.centerPoint[2]);
    this.scene.rotate(this.currAngle, 0, 1, 0);
    this.scene.translate(this.radius, 0, 0);
  }

  reset() {
    this.currAngle = this.startAngle;
  }

  enableAnimation() {
    this.enable = true;
  }

  disableAnimation() {
    this.enable = false;
  }

}
