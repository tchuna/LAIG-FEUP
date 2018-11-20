/**
* LinearAnimation
* @constructor
*/
class LinearAnimation extends Animation{

  constructor(scene, id, duration, controlPoints){

    super(scene, id, duration);
    // Control Points
    this.controlPoints = controlPoints;
    // Current position
    this.currentPosition = vec3.create();
    // Travelled distance since last point
    this.travelledDistance = 0;
    // Index of current line segment
    this.index = 0;
    // Enable/Distable animation
    this.enable = true;


    this.updateDistanceAndVelocity();
    this.updateMovementDirection();

  }

  /**
  * Calculate the distance between conscutive control points,
  * the total distance, and the velocity
  *
  */
  updateDistanceAndVelocity() {
    var distance = vec3.create();
    this.totalDistance = 0;
    this.distancePerSegment = [];

    for (let i = 0; i < this.controlPoints.length-1; i++) {
      vec3.sub(distance, this.controlPoints[i+1], this.controlPoints[i]);
      this.totalDistance += vec3.length(distance);
      this.distancePerSegment.push(vec3.length(distance));
    }

    this.velocity = this.totalDistance / this.duration;
  }

  /**
  * Update current initial and final position and the angle of
  * the movement
  *
  */
  updateMovementDirection() {
    this.direction = vec3.create();
    vec3.sub(this.direction,
             this.controlPoints[this.index+1],
             this.controlPoints[this.index]);

    this.xi = this.controlPoints[this.index][0];
    this.yi = this.controlPoints[this.index][1];
    this.zi = this.controlPoints[this.index][2];
    this.xf = this.controlPoints[this.index + 1][0];
    this.yf = this.controlPoints[this.index + 1][1];
    this.zf = this.controlPoints[this.index + 1][2];


    this.angle = Math.atan2(this.zf - this.zi, this.xf - this.xi);
  }

  /**
  * Update variables
  *
  * @param {Float}  deltaTime
  */
  update(deltaTime) {
    var distance = deltaTime * this.velocity;
    this.travelledDistance += distance;
    if (this.travelledDistance >= this.distancePerSegment[this.index]) {
      this.travelledDistance -= this.distancePerSegment[this.index];
      this.index++;
      if (this.index == this.controlPoints.length - 1) {
        this.reset();
      }
      else {
        this.updateMovementDirection();
      }
    }
    vec3.scale(this.currentPosition,
               this.direction,
               this.travelledDistance / this.distancePerSegment[this.index]);
  }

  /**
  * Apply transformations to the scene
  *
  */
  apply() {
    this.scene.translate(this.xi, this.yi, this.zi);
    this.scene.translate(this.currentPosition[0],
                         this.currentPosition[1],
                         this.currentPosition[2]);
    this.scene.rotate((Math.PI / 2) - this.angle, 0, 1, 0);
  }

  /**
  * Reset variables to default value
  *
  */
  reset() {
    this.index = 0;
    this.currentPosition = vec3.create();
    this.travelledDistance = 0;
    this.updateDistanceAndVelocity();
    this.updateMovementDirection();
  }

  /**
  * Enable the animation
  *
  */
  enableAnimation() {
    this.enable = true;
  }

  /**
  * Disable the animation
  *
  */
  disableAnimation() {
    this.enable = false;
  }
}
