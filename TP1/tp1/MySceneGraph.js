var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;
        this.near=null;
        this.far=null;

        this.nodes = [];
        this.viewsId=[];


        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }



    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;


        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
       this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }



        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;

        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)

                return error;
        }



        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
       if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        /*if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }*/

        // <materials>
        /*if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }*/

        // <transformations>
        /*if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }*/

        // <primitives>
        /*if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }*/

        //component block
        /*if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse component block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }*/


    }



    //validade RGB COLOR_BUFFER_BIT

    validateRGBColor(c,id,comp){

      if (!(c != null && !isNaN(c) && c >= 0 && c <= 1))
          return "unable to parse " +comp +" color  component for ID = " + id;
      else{
        return null;
      }
    }

    // validate a componet COLOR_BUFFER_BIT

    validateAComponent(a,id){

      if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
          return "unable to parse A color component  for ID = " + id;
      else{
        return null;
      }

    }

    /**
    * Parses the <scene> block.
    */
    parseScene(sceneNode) {

      this.root = this.reader.getString(sceneNode, "root");
      this.axis_length = this.reader.getFloat(sceneNode, "axis_length");

      this.log("Parsed scene");

      return null;
    }



    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        this.default_view = this.reader.getString(viewsNode, 'default');
        this.views = [];


        var children = viewsNode.children;
        var grandChildren = [];
        var nodeNames = [];


        for (var i = 0; i < children.length; i++) {
          if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
            this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");
            continue;
          }


          var viewId = this.reader.getString(children[i], 'id');

          if (viewId == null) {
            return "no ID defined for <"+children[i]+">"
          }

          if (this.views[viewId] != null) {
            return "ID must be unique for each view (conflict: ID = "+viewId+")";
          }

          if (children[i].nodeName == "perspective") {
            grandChildren = children[i].children;

            for (var j = 0; j < grandChildren.length; j++) {
              if (grandChildren[j].nodeName != "from" && grandChildren[j].nodeName != "to") {
                this.onXMLMinorError("unknown tag <"+grandChildren[j].nodeName+">");
                continue;
              }

              if (grandChildren[j].nodeName == "from") {
                var from = {
                  x: this.reader.getFloat(grandChildren[j], 'x'),
                  y: this.reader.getFloat(grandChildren[j], 'y'),
                  z: this.reader.getFloat(grandChildren[j], 'z')
                }
              }
              else{
                var to = {
                  x: this.reader.getFloat(grandChildren[j], 'x'),
                  y: this.reader.getFloat(grandChildren[j], 'y'),
                  z: this.reader.getFloat(grandChildren[j], 'z')
                }
              }
            }


            this.views[viewId] = {
              near: this.reader.getFloat(children[i], 'near'),
              far: this.reader.getFloat(children[i], 'far'),
              angle: this.reader.getFloat(children[i], 'angle'),
              from: from,
              to: to
            };
            this.viewsId.push(viewId);
          }
          else if (children[i].nodeName == "ortho") {

            //por fazer !!!!!

          }
        }


        this.near=this.views[viewId].near;
        this.far=this.views[viewId].far;

        this.log("Parsed views");

        return null;
    }





    /**
    * Parses the <viewe> block.
    */
    parseAmbient(ambienNode) {

      var children=ambienNode.children;
      var nodeName=[];
      var aux;


      this.ambientValues=[0,0,0,1];
      this.backgroundValues=[0,0,0,1];

      for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName != "ambient" && children[i].nodeName != "background") {
          this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");
          continue;
      }else{
          nodeName.push(children[i]);
      }
    }

    for(var i=0;i<children.length;i++){

      if(children[i].nodeName=="ambient"){

        //red values
        var r=this.reader.getFloat(children[i],'r');
        aux=this.validateRGBColor(r,"ambient","r");

        if(aux!=null) return aux;
        this.ambientValues[0]=r;

        //green value
        var g=this.reader.getFloat(children[i],'g');
        aux=this.validateRGBColor(g,"ambient","g");

        if(aux!=null) return aux;
        this.ambientValues[1]=g;

        //blue value
        var b=this.reader.getFloat(children[i],'b');
        aux=this.validateRGBColor(b,"ambient","b");

        if(aux!=null) return aux;
        this.ambientValues[2]=b;

        //a value
        var a=this.reader.getFloat(children[i],'a');
        aux=this.validateAComponent(a,"ambient");

        if(aux!=null) return aux;
        this.ambientValues[3]=a;
      }


        //background

        if(children[i].nodeName=="background"){
          //red values
          var r=this.reader.getFloat(children[i],'r');
          aux=this.validateRGBColor(r,"ambient","r");

          if(aux!=null) return aux;
          this.backgroundValues[0]=r;

          //green value
          var g=this.reader.getFloat(children[i],'g');
          aux=this.validateRGBColor(g,"ambient","g");

          if(aux!=null) return aux;
          this.backgroundValues[1]=g;

          //blue value
          var b=this.reader.getFloat(children[i],'b');
          aux=this.validateRGBColor(b,"ambient","b");

          if(aux!=null) return aux;
          this.backgroundValues[2]=b;

          //a value
          var a=this.reader.getFloat(children[i],'a');
          aux=this.validateAComponent(a,"ambient");

          if(aux!=null) return aux;
          this.backgroundValues[3]=a;
      }
    }

      this.log("Parsed ambient");


      return null;
    }




    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;
        var enableLight=true;

        this.lights = [];
        var numLights =0
        var spotLight=[];
        var omniLight=[];

        var aux;


        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni"  && children[i].nodeName!="spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            if(children[i].nodeName=="spot"){
              var angleId=this.reader.getString(children[i], 'angle');
              var exponentId=this.reader.getString(children[i], 'exponent');
              if(angleId==null){
                return "no angle  defined for spot light";
              }

              if(exponentId==null){
                return "no exponent defined for light";
              }


            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            var enableIndex=this.reader.getString(children[i],'enabled');

            if(enableIndex==null){
              return "no enable  defined for light";
            }

            if(enableIndex=="t"){
              enableLight=true;
            }else if(enableIndex=="f"){
              enableLight=false;
            }else {
              return "Ivalid value  in enable atribute option of light"
            }


            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            //var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            //this.log(specularIndex);




            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            }
            else{
              return "light position undefined for ID = " + lightId;
            }


            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {

                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                aux=this.validateRGBColor(r,lightId,"r");

                if(aux!=null) return aux;
                ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                aux=this.validateRGBColor(g,lightId,"g");

                if(aux!=null) return aux;
                ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                aux=this.validateRGBColor(b,lightId,"b");

                if(aux!=null) return aux;
                ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                aux=this.validateAComponent(a,lightId);

                if(aux!=null) return aux;
                ambientIllumination.push(a);;
            }
            else{
              return "ambient component undefined for ID = " + lightId;
            }

            var diffuseIllumination = [];

            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                aux=this.validateRGBColor(r,lightId,"r");

                if(aux!=null) return aux;
                diffuseIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                aux=this.validateRGBColor(g,lightId,"g");

                if(aux!=null) return aux;
                diffuseIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                aux=this.validateRGBColor(b,lightId,"b");

                if(aux!=null) return aux;
                diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                aux=this.validateAComponent(a,lightId);

                if(aux!=null) return aux;
                diffuseIllumination.push(a);

            }
            else{
              return "ambient component undefined for ID = " + lightId;
            }


            var specularIllumination = [];

            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                aux=this.validateRGBColor(r,lightId,"r");

                if(aux!=null) return aux;
                specularIllumination.push(r);
                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                aux=this.validateRGBColor(g,lightId,"g");

                if(aux!=null) return aux;
                specularIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                aux=this.validateRGBColor(b,lightId,"b");

                if(aux!=null) return aux;
                specularIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                aux=this.validateAComponent(a,lightId);

                if(aux!=null) return aux;
                specularIllumination.push(a);
            }
            else{
              return "ambient component undefined for ID = " + lightId;
            }

        this.lights[lightId] = [enableLight, positionLight, ambientIllumination, diffuseIllumination, specularIllumination];
        numLights++;
      }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <TEXTURES> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // TODO: Parse block

        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // TODO: Parse block
        this.log("Parsed materials");
        return null;

    }

    /**
     * Parses the <NODES> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        // TODO: Parse block
        this.log("Parsed nodes");
        return null;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}
