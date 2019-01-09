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
        this.scenes = this.gui.addFolder("Scenes");
        this.scenes.open();
        this.scenesList = this.scenes.add({Scene: "Scene_1.xml"}, 'Scene', {Scene_1: 'Scene_1.xml', Scene_2: 'Scene_2.xml'});
        this.scenesList.onFinishChange(function (value) {
            this.removeFolder("Lights");
            this.scene.graph.reader.open('scenes/'+value, this.scene.graph);
        }.bind(this));
        return true;
    }

    /**
    * processKeyboard
    * @param event {Event}
    */
    processKeyboard(event) {
      CGFinterface.prototype.processKeyboard.call(this,event);

      switch (event.code) {
        case "KeyC":
          this.scene.changeCamera();
          break;
        case "KeyM":
          this.scene.changeMaterial();
          break;
        default:

      }

    }

    removeFolder(name,parent) {
        if(!parent)
            parent = this.gui;
        var folder = parent.__folders[name];


        if (!folder) {
            return;
        }

        folder.close();

        parent.__ul.removeChild(folder.domElement.parentNode);
        delete parent.__folders[name];

        parent.onResize();
    };

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

    addPlayerTurnGroup(player) {
      this.playerGroup = this.gui.addFolder('Players Turn');
      this.playerGroup.open();

      this.item = this.playerGroup.add({Player: player}, 'Player');
    }

    updatePlayerTurn(player) {
        this.playerGroup.remove(this.item);
        this.item = this.playerGroup.add({Player: player}, 'Player');
    }

    addGameModeGroup() {
        this.gameModeGroup = this.gui.addFolder('Game Mode');
        this.gameModeGroup.open();

        this.gameMode = this.gameModeGroup.add({Mode: 'PvP'}, 'Mode', ['PvP', 'PvC', 'CvC']);
        this.gameMode.onFinishChange(function (value) {
            this.scene.graph.game.gameMode = value;
        }.bind(this));
    }

    updateGameModeGroup() {
        this.gameModeGroup.remove(this.gameMode);
        this.gameMode = this.gameModeGroup.add({Mode: 'PvP'}, 'Mode', ['PvP', 'PvC', 'CvC']);
        this.gameMode.onFinishChange(function (value) {
            this.scene.graph.game.gameMode = value;
        }.bind(this));
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
