/**
* MyInterface class, creating a GUI interface.
*/

var obj = {
        current: "default",
};
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        return true;
    }

    /**
 * processKeyboard
 * @param event {Event}
 */
processKeyboard(event) {
  CGFinterface.prototype.processKeyboard.call(this,event);

  switch (event.code) {
    case "KeyA":
				this.scene.changeCamera();
      break;
    case 118:
				console.log("tchuna");
    break;
		case 109:
				console.log("tchuna");
    break;
		case 77:
					console.log("tchuna");
    break;
    default:

  }

}

    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key].enabled;
                group.add(this.scene.lightValues, key);
            }
        }
    }

    addViewsGroup(views) {

        var group = this.gui.addFolder("Views");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in views) {
            if (views.hasOwnProperty(key)) {
                this.scene.graph.views[key] = views[key].enabled;

            }
        }
    }
}
