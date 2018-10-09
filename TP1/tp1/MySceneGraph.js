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
        if(r!=null){

          if(isNaN(r)){
            return "component r in ambiente is not a numerical value ";

          }else if(r>1||r<0){
            return "the component r in ambient must be a value between 0 and 1";
          }else{
            this.ambientValues[0]=r;
          }
        }else{
          this.onXMLMinorError("unable to parse r component of the ambient,defaul value=0");
        }

        //green value
        var g=this.reader.getFloat(children[i],'g');

        if(g!=null){

          if(isNaN(g)){
            return "component g in ambiente is not a numerical value ";

          }else if(g>1||g<0){
            return "the component g in ambient must be a value between 0 and 1";
          }else{
            this.ambientValues[1]=g;
          }
        }else{
          this.onXMLMinorError("unable to parse g component of the ambient,defaul value=0");
        }


        //blue value
        var b=this.reader.getFloat(children[i],'b');

        if(b!=null){

          if(isNaN(b)){
            return "component b in ambiente is not a numerical value ";

          }else if(b>1||b<0){
            return "the component b in ambient must be a value between 0 and 1";
          }else{
            this.ambientValues[2]=b;
          }
        }else{
          this.onXMLMinorError("unable to parse b component of the ambient,defaul value=0");
        }


        //a value
        var a=this.reader.getFloat(children[i],'a');

        if(a!=null){

          if(isNaN(a)){
            return "component a in ambiente is not a numerical value ";

          }else if(a>1||a<0){
            return "the component r in ambient must be a value between 0 and 1";
          }else{
            this.ambientValues[3]=a;
          }
        }else{
          this.onXMLMinorError("unable to parse a component of the ambient,defaul value=0");
        }
      }


        //background

        if(children[i].nodeName=="background"){
          //red values
          var r=this.reader.getFloat(children[i],'r')
          if(r!=null){

            if(isNaN(r)){
              return "component r in background is not a numerical value ";

            }else if(r>1||r<0){
              return "the component r in background must be a value between 0 and 1";
            }else{
              this.backgroundValues[0]=r;
            }
          }else{
            this.onXMLMinorError("unable to parse r component of the background,defaul value=0");
          }

          //green value
          var g=this.reader.getFloat(children[i],'g');

          if(g!=null){

            if(isNaN(g)){
              return "component g in background is not a numerical value ";

            }else if(g>1||g<0){
              return "the component g in background must be a value between 0 and 1";
            }else{
              this.backgroundValues[1]=g;
            }
          }else{
            this.onXMLMinorError("unable to parse g component of the background,defaul value=0");
          }


          //blue value
          var b=this.reader.getFloat(children[i],'b');

          if(b!=null){

            if(isNaN(b)){
              return "component b in background is not a numerical value ";

            }else if(b>1||b<0){
              return "the component b in background must be a value between 0 and 1";
            }else{
              this.backgroundValues[2]=b;
            }
          }else{
            this.onXMLMinorError("unable to parse b component of the background,defaul value=0");
          }


          //a value
          var a=this.reader.getFloat(children[i],'a');

          if(a!=null){

            if(isNaN(a)){
              return "component a in background is not a numerical value ";

            }else if(a>1||a<0){
              return "the component r in background must be a value between 0 and 1";
            }else{
              this.backgroundValues[3]=a;
            }
          }else{
            this.onXMLMinorError("unable to parse a component of the background,defaul value=0");
          }
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
        var numLights =children.length;


        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni"  && children[i].nodeName!="spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
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
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else{
              return "ambient component undefined for ID = " + lightId;
            }



            var diffuseIllumination = [];

            if (diffuseIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
            if (r != null) {
                if (isNaN(r))
                    return "diffuse 'r' is a non numeric value on the LIGHTS block";
                else if (r < 0 || r > 1)
                    return "diffuse 'r' must be a value between 0 and 1 on the LIGHTS block"
                else
                    diffuseIllumination.push(r);
            } else
                return "unable to parse R component of the diffuse illumination for ID = " + lightId;

            // G
            var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
            if (g != null) {
                if (isNaN(g))
                    return "diffuse 'g' is a non numeric value on the LIGHTS block";
                else if (g < 0 || g > 1)
                    return "diffuse 'g' must be a value between 0 and 1 on the LIGHTS block"
                else
                    diffuseIllumination.push(g);
            } else
                return "unable to parse G component of the diffuse illumination for ID = " + lightId;

            // B
            var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
            if (b != null) {
                if (isNaN(b))
                    return "diffuse 'b' is a non numeric value on the LIGHTS block";
                else if (b < 0 || b > 1)
                    return "diffuse 'b' must be a value between 0 and 1 on the LIGHTS block"
                else
                    diffuseIllumination.push(b);
            } else
                return "unable to parse B component of the diffuse illumination for ID = " + lightId;

            // A
            var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
            if (a != null) {
                if (isNaN(a))
                    return "diffuse 'a' is a non numeric value on the LIGHTS block";
                else if (a < 0 || a > 1)
                    return "diffuse 'a' must be a value between 0 and 1 on the LIGHTS block"
                else
                    diffuseIllumination.push(a);
            } else
                return "unable to parse A component of the diffuse illumination for ID = " + lightId;
        }
        else{
          return "diffuse component undefined for ID = " + lightId;
        }


        var specularIllumination = [];
        if (specularIndex != -1) {
            // R
            var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
            if (r != null) {
                if (isNaN(r))
                    return "specular 'r' is a non numeric value on the LIGHTS block";
                else if (r < 0 || r > 1)
                    return "specular 'r' must be a value between 0 and 1 on the LIGHTS block"
                else
                    specularIllumination.push(r);
            } else
                return "unable to parse R component of the specular illumination for ID = " + lightId;

            // G
            var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
            if (g != null) {
                if (isNaN(g))
                    return "specular 'g' is a non numeric value on the LIGHTS block";
                else if (g < 0 || g > 1)
                    return "specular 'g' must be a value between 0 and 1 on the LIGHTS block"
                else
                    specularIllumination.push(g);
            } else
                return "unable to parse G component of the specular illumination for ID = " + lightId;

            // B
            var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
            if (b != null) {
                if (isNaN(b))
                    return "specular 'b' is a non numeric value on the LIGHTS block";
                else if (b < 0 || b > 1)
                    return "specular 'b' must be a value between 0 and 1 on the LIGHTS block"
                else
                    specularIllumination.push(b);
            } else
                return "unable to parse B component of the specular illumination for ID = " + lightId;

            // A
            var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
            if (a != null) {
                if (isNaN(a))
                    return "specular 'a' is a non numeric value on the LIGHTS block";
                else if (a < 0 || a > 1)
                    return "specular 'a' must be a value between 0 and 1 on the LIGHTS block"
                else
                    specularIllumination.push(a);
            } else
                return "unable to parse A component of the specular illumination for ID = " + lightId;
        }
        else{
          return "specular component undefined for ID = " + lightId;
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
