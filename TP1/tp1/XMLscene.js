var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.ex=[];

    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
      this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 80, 70), vec3.fromValues(25, 5, 10));
      //this.camera= new CGFcamera(0.4, 0.1, 500, vec3.fromValues(40, 5, 30), vec3.fromValues(10,0, 0));
      }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
     initLights() {
        var i = 0;
        // Lights index.
        for (var key in this.graph.lights) {
          if(i >= 8){
            break;
          }

          if (this.graph.lights.hasOwnProperty(key)) {
            var light = this.graph.lights[key];

            if(light.type=="spot"){
              var xDirct;
              var yDirct;
              var zDirct;

              this.lights[i].setSpotCutOff(light.angle);
              this.lights[i].setSpotExponent(light.exponent);

              xDirct=light.target.x-light.location.x;
              yDirct=light.target.y-light.location.y;
              zDirct=light.target.z-light.location.z;

              this.lights[i].setSpotDirection(xDirct,yDirct,zDirct);
            }

            this.lights[i].setPosition(light.location.x, light.location.y, light.location.z, light.location.w);
            this.lights[i].setAmbient(light.ambient.red, light.ambient.green, light.ambient.blue, light.ambient.alpha);
            this.lights[i].setDiffuse(light.diffuse.red, light.diffuse.green, light.diffuse.blue, light.diffuse.alpha);
            this.lights[i].setSpecular(light.specular.red, light.specular.green, light.specular.blue, light.specular.alpha);
            this.lights[i].setVisible(true);

            if (light.enabled) {
              this.lights[i].enable();
            }
            else {
              this.lights[i].disable();
            }

            this.lights[i].update();
            i++;
          }
        }
    }


    /* Handler called when the graph is finally loaded.
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.camera.near =this.graph.views[this.graph.default_view].near;
        this.camera.far =this.graph.views[this.graph.default_view].far;

        // Change reference length according to parsed graph
        this.axis = new CGFaxis(this, this.graph.axis_length);

        // Change ambient and background details according to parsed graph
        this.setGlobalAmbientLight(this.graph.ambient.ambient.red,
                                   this.graph.ambient.ambient.green,
                                   this.graph.ambient.ambient.blue,
                                   this.graph.ambient.ambient.alpha);
        this.gl.clearColor(this.graph.ambient.background.red,
                           this.graph.ambient.background.green,
                           this.graph.ambient.background.blue,
                           this.graph.ambient.background.alpha);

      this.initLights();

        // Adds lights group.
      this.interface.addLightsGroup(this.graph.lights);
      this.interface.addViews();

        //this.interface.addViewssGroup(this.graph.views);

        this.sceneInited = true;
    }


    changeCamera(){
      //var camera= new CGFcamera(0.4, 0.1, 500, vec3.fromValues(5, 5, 20), vec3.fromValues(0, 0, 0));

      setActiveCamera(camera);
    }


    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.graph.loadedOk) {
            // Draw axis

            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        //
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
           this.graph.displayScene();

        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }




}
