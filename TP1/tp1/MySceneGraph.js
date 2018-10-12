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

        this.nodes = [];
        this.viewsId = [];


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
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    //Validate COLOR
    validateColor(components,id){
      if (!(components.red!= null && !isNaN(components.red) && components.red >= 0 && components.red <= 1)){
        return "unable to parse red color  component for ID = " + id;
      }

      if (!(components.green!= null && !isNaN(components.green) && components.green >= 0 && components.green <= 1)){
        return "unable to parse green color  component for ID = " + id;
      }

      if (!(components.blue!= null && !isNaN(components.blue) && components.blue >= 0 && components.blue <= 1)){
        return "unable to parse blue color  component for ID = " + id;
      }

      if (!(components.alpha!= null && !isNaN(components.alpha) && components.alpha >= 0 && components.alpha <= 1)){
        return "unable to parse alpha color  component for ID = " + id;
      }

      return null;

    }

    /**
    * Parses the <scene> block.
    * @param {scene block element} sceneNode
    */
    parseScene(sceneNode) {

      this.idRoot = this.reader.getString(sceneNode, "root");
      this.axis_length = this.reader.getFloat(sceneNode, "axis_length");

      this.log("Parsed scene");

      return null;
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        // get default view
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

          // get ID of current view
          var viewId = this.reader.getString(children[i], 'id');
          if (viewId == null) {
            return "no ID defined for <"+children[i]+">"
          }

          if (this.views[viewId] != null) {
            return "ID must be unique for each view (conflict: ID = "+viewId+")";
          }

          // Perspective view
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

          }
          // Ortho view
          else if (children[i].nodeName == "ortho") {
            this.views[viewId] = {
              near: this.reader.getFloat(children[i], 'near'),
              far: this.reader.getFloat(children[i], 'far'),
              left: this.reader.getFloat(children[i], 'left'),
              right: this.reader.getFloat(children[i], 'right'),
              top: this.reader.getFloat(children[i], 'top'),
              bottom: this.reader.getFloat(children[i], 'bottom')
            };
          }
          this.viewsId.push(viewId);
        }

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {
      var children = ambientNode.children;

      for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName != "ambient" && children[i].nodeName != "background") {
          this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");
          continue;
        }

        if (children[i].nodeName == "ambient") {
          var ambient = {
            red: this.reader.getFloat(children[i], 'r'),
            green: this.reader.getFloat(children[i], 'g'),
            blue: this.reader.getFloat(children[i], 'b'),
            alpha: this.reader.getFloat(children[i], 'a')
          }
          var aux=this.validateColor(ambient,"ambient");
          if(aux!=null) return aux;
        }
        else {
          var background = {
            red: this.reader.getFloat(children[i], 'r'),
            green: this.reader.getFloat(children[i], 'g'),
            blue: this.reader.getFloat(children[i], 'b'),
            alpha: this.reader.getFloat(children[i], 'a')
          }
          var aux=this.validateColor(background,"background");
          if(aux!=null) return aux;
        }
      }

      this.ambient = {
        ambient: ambient,
        background: background
      }

      this.log("Parsed ambient");

      return null;
    }

    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null || lightId.length == 0)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;

            var nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
              nodeNames.push(grandChildren[j].nodeName);
            }
            if (nodeNames.indexOf("location") < 0) {
              return "missing <location> tag on light "+lightId;
            }
            if (nodeNames.indexOf("ambient") < 0) {
              return "missing <ambient> tag on light "+lightId;
            }
            if (nodeNames.indexOf("diffuse") < 0) {
              return "missing <diffuse> tag on light "+lightId;
            }
            if (nodeNames.indexOf("specular") < 0) {
              return "missing <specular> tag on light "+lightId;
            }
            if (nodeNames.indexOf("target") < 0 && children[i].nodeName == "spot") {
              return "missing <target> tag on light "+lightId;
            }

            // Specifications for the current light.
            for (var j = 0; j < grandChildren.length; j++) {
              if (grandChildren[j].nodeName == "location") {
                var location = {
                  x: this.reader.getFloat(grandChildren[j], 'x'),
                  y: this.reader.getFloat(grandChildren[j], 'y'),
                  z: this.reader.getFloat(grandChildren[j], 'z'),
                  w: this.reader.getFloat(grandChildren[j], 'w')
                }
              }
              else if (grandChildren[j].nodeName == "ambient") {
                var ambient = {
                  red: this.reader.getFloat(grandChildren[j], 'r'),
                  green: this.reader.getFloat(grandChildren[j], 'g'),
                  blue: this.reader.getFloat(grandChildren[j], 'b'),
                  alpha: this.reader.getFloat(grandChildren[j], 'a')
                }

                var aux=this.validateColor(ambient,lightId+" in Light (Ambient component)");
                if(aux!=null) return aux;
              }
              else if (grandChildren[j].nodeName == "diffuse") {
                var diffuse = {
                  red: this.reader.getFloat(grandChildren[j], 'r'),
                  green: this.reader.getFloat(grandChildren[j], 'g'),
                  blue: this.reader.getFloat(grandChildren[j], 'b'),
                  alpha: this.reader.getFloat(grandChildren[j], 'a')
                }
                var aux=this.validateColor(diffuse,lightId+" in Light (Diffuse component)");
                if(aux!=null) return aux;
              }
              else if (grandChildren[j].nodeName == "specular") {
                var specular = {
                  red: this.reader.getFloat(grandChildren[j], 'r'),
                  green: this.reader.getFloat(grandChildren[j], 'g'),
                  blue: this.reader.getFloat(grandChildren[j], 'b'),
                  alpha: this.reader.getFloat(grandChildren[j], 'a')
                }
                var aux=this.validateColor(specular,lightId+" in Light (Specular component)");
                if(aux!=null) return aux;
              }
              else if (grandChildren[j].nodeName == "target") {
                var target = {
                  x: this.reader.getFloat(grandChildren[j], 'x'),
                  y: this.reader.getFloat(grandChildren[j], 'y'),
                  z: this.reader.getFloat(grandChildren[j], 'z')
                }
              }
              else {
                this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                continue;
              }

              if (children[i].nodeName == "omni") {
                this.lights[lightId] = {
                  enabled: this.reader.getBoolean(children[i], 'enabled'),
                  location: location,
                  ambient: ambient,
                  diffuse: diffuse,
                  specular: specular
                }
              }
              else{
                this.lights[lightId] = {
                  enabled: this.reader.getBoolean(children[i], 'enabled'),
                  angle: this.reader.getFloat(children[i], 'angle'),
                  exponent: this.reader.getFloat(children[i], 'exponent'),
                  location: location,
                  target: target,
                  ambient: ambient,
                  diffuse: diffuse,
                  specular: specular
                }
              }
            }

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
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        if (children.length == 0) {
          return "at least one texture must be defined";
        }

        this.textures = [];
        var textId;

        for (var i = 0; i < children.length; i++) {
          textId = this.reader.getString(children[i], 'id');
          this.textures[textId] = this.reader.getString(children[i], 'file');
        }

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;
        var materialId;

        if (children.length == 0) {
          return "at least one material must be defined";
        }

        this.materials = [];

        var grandChildren;

        for (var i = 0; i < children.length; i++) {
          if (children[i].nodeName != "material") {
            this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");
            continue;
          }

          // Get id of the current material.
          var materialId = this.reader.getString(children[i], 'id');
          if (materialId == null || materialId.length == 0)
              return "no ID defined for material";

          // Checks for repeated IDs.
          if (this.materials[materialId] != null)
              return "ID must be unique for each material (conflict: ID = " + materialId + ")";


          var nodeNames = [];
          grandChildren = children[i].children;

          for (var j = 0; j < grandChildren.length; j++) {
            nodeNames.push(grandChildren[j].nodeName);
          }
          if (nodeNames.indexOf("emission") < 0) {
            return "missing <emission> tag";
          }
          else if(nodeNames.indexOf("ambient") < 0){
            return "missing <ambient> tag";
          }
          else if(nodeNames.indexOf("diffuse") < 0){
            return "missing <diffuse> tag";
          }
          else if(nodeNames.indexOf("specular") < 0){
            return "missing <specular> tag";
          }

          for (var j = 0; j < grandChildren.length; j++) {
            if (grandChildren[j].nodeName == "emission") {
              var emission = {
                red: this.reader.getFloat(grandChildren[j], 'r'),
                green: this.reader.getFloat(grandChildren[j], 'g'),
                blue: this.reader.getFloat(grandChildren[j], 'b'),
                alpha: this.reader.getFloat(grandChildren[j], 'a')
              }

              var aux=this.validateColor(emission,materialId+" in Material (Emission component)");
              if(aux!=null) return aux;
            }
            else if (grandChildren[j].nodeName == "ambient"){
              var ambient = {
                red: this.reader.getFloat(grandChildren[j], 'r'),
                green: this.reader.getFloat(grandChildren[j], 'g'),
                blue: this.reader.getFloat(grandChildren[j], 'b'),
                alpha: this.reader.getFloat(grandChildren[j], 'a')
              }

              var aux=this.validateColor(ambient,materialId+" in Material (Ambient component)");
              if(aux!=null) return aux;
            }
            else if (grandChildren[j].nodeName=="diffuse"){
              var diffuse = {
                red: this.reader.getFloat(grandChildren[j], 'r'),
                green: this.reader.getFloat(grandChildren[j], 'g'),
                blue: this.reader.getFloat(grandChildren[j], 'b'),
                alpha: this.reader.getFloat(grandChildren[j], 'a')
              }
              var aux=this.validateColor(diffuse,materialId+" in Material (Diffuse component)");
              if(aux!=null) return aux;
            }
            else if (grandChildren[j].nodeName == "specular"){
              var specular = {
                red: this.reader.getFloat(grandChildren[j], 'r'),
                green: this.reader.getFloat(grandChildren[j], 'g'),
                blue: this.reader.getFloat(grandChildren[j], 'b'),
                alpha: this.reader.getFloat(grandChildren[j], 'a')
              }

              var aux=this.validateColor(specular,materialId+" in Material (Specular component)");
              if(aux!=null) return aux;
            }
            else{
              this.onXMLMinorError("unknown tag <"+grandChildren[i].nodeName+">");
              continue;
            }
          }

          this.materials[materialId] = {
            shininess: this.reader.getFloat(children[i], 'shininess'),
            emission: emission,
            ambient: ambient,
            diffuse: diffuse,
            specular: specular
          }
        }

        this.log("Parsed materials");
        return null;

    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
      var children = transformationsNode.children;

      if(children.length == 0){
        return "at least one transformation must be defined";
      }

      this.transformations = [];
      var grandChildren;

      for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName != "transformation") {
          this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");
          continue;
        }

        grandChildren = children[i].children;
        if(grandChildren.length == 0){
          return "at least one transformation must be defined";
        }

        // Get id of the current material.
        var transfId = this.reader.getString(children[i], 'id');
        if (transfId == null || transfId.length == 0)
            return "no ID defined for transformation";

        // Checks for repeated IDs.
        if (this.transformations[transfId] != null)
            return "ID must be unique for each transformation (conflict: ID = " + transfId + ")";

        this.transformations[transfId] = [];

        for (var j = 0; j < grandChildren.length; j++) {
          if (grandChildren[j].nodeName == "translate") {
            var translate = {
              type: "translate",
              x: this.reader.getFloat(grandChildren[j], 'x'),
              y: this.reader.getFloat(grandChildren[j], 'y'),
              z: this.reader.getFloat(grandChildren[j], 'z')
            }
            this.transformations[transfId].push(translate);
          }
          else if (grandChildren[j].nodeName == "rotate") {
            var rotate = {
              type: "rotate",
              axis: this.reader.getString(grandChildren[j], 'axis'),
              angle: this.reader.getFloat(grandChildren[j], 'angle')
            }
            this.transformations[transfId].push(rotate);
          }
          else if (grandChildren[j].nodeName == "scale") {
            var scale = {
              type: "scale",
              x: this.reader.getFloat(grandChildren[j], 'x'),
              y: this.reader.getFloat(grandChildren[j], 'y'),
              z: this.reader.getFloat(grandChildren[j], 'z')
            }
            this.transformations[transfId].push(scale);
          }
          else {
            this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");
            continue;
          }
        }
      }

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;
        if (children.length == 0) {
          return "at least one primitive must be defined";
        }

        this.primitives = [];
        var grandChildren;

        for (var i = 0; i < children.length; i++) {
          if (children[i].nodeName != "primitive") {
            this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");
            continue;
          }

          // Get id of the current material.
          var primId = this.reader.getString(children[i], 'id');
          if (primId == null || primId.length == 0)
            return "no ID defined for primitive";
          if (this.primitives[primId] != null)
              return "ID must be unique for each primitive (conflict: ID = " + primId + ")";

          grandChildren = children[i].children;
          if(grandChildren.length == 0){
            return "at least one primitive must be defined";
          }
          else if(grandChildren.length > 1){
            return "only one primitive must be defined at time"
          }
          var primitive;
          switch (grandChildren[0].nodeName) {
            case "rectangle":
              primitive={
                x1: this.reader.getFloat(grandChildren[0], 'x1'),
                y1: this.reader.getFloat(grandChildren[0], 'y1'),
                x2: this.reader.getFloat(grandChildren[0], 'x2'),
                y2: this.reader.getFloat(grandChildren[0], 'y2')
              };
              this.primitives[primId] = new MyRectangle(this.scene, primitive);
              break;
            case "triangle":
              primitive={
                x1: this.reader.getFloat(grandChildren[0], 'x1'),
                y1: this.reader.getFloat(grandChildren[0], 'y1'),
                z1: this.reader.getFloat(grandChildren[0], 'z1'),
                x2: this.reader.getFloat(grandChildren[0], 'x2'),
                y2: this.reader.getFloat(grandChildren[0], 'y2'),
                z2: this.reader.getFloat(grandChildren[0], 'z2'),
                x3: this.reader.getFloat(grandChildren[0], 'x3'),
                y3: this.reader.getFloat(grandChildren[0], 'y3'),
                z3: this.reader.getFloat(grandChildren[0], 'z3')
              };
              this.primitives[primId] = new MyTriangle(this.scene, primitive);
              break;
            case "circle":
              primitive = {
                slices: this.reader.getInteger(grandChildren[0], 'slices')
              };
              this.primitives[primId] = new MyCircle(this.scene, primitive);
              break;
            case "cylinder":
              primitive={
                base: this.reader.getFloat(grandChildren[0], 'base'),
                top: this.reader.getFloat(grandChildren[0], 'top'),
                height: this.reader.getFloat(grandChildren[0], 'height'),
                slices: this.reader.getInteger(grandChildren[0], 'slices'),
                stacks: this.reader.getInteger(grandChildren[0], 'stacks')
              };
              this.primitives[primId] = new MyCylinder(this.scene, primitive);
              break;
            case "sphere":
              primitive= {
                radius: this.reader.getFloat(grandChildren[0], 'radius'),
                slices: this.reader.getInteger(grandChildren[0], 'slices'),
                stacks: this.reader.getInteger(grandChildren[0], 'stacks')
              };
              this.primitives[primId] = new MySphere(this.scene, primitive);
              break;
            case "torus":
              primitive = {
                inner: this.reader.getFloat(grandChildren[0], 'inner'),
                outer: this.reader.getFloat(grandChildren[0], 'outer'),
                slices: this.reader.getInteger(grandChildren[0], 'slices'),
                loops: this.reader.getInteger(grandChildren[0], 'loops')
              };
              this.primitives[primId] = new MyTorus(this.scene, primitive);
              break;
            default:
              return "unknow primitive <"+grandChildren[0].nodeName+">";
          }

        }

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentesNode
     */
    parseComponents(componentesNode) {
      var children = componentesNode.children;
      var grandChildren;
      var greatGrandChildren;
      var compId;
      this.components = [];

      for (var i = 0; i < children.length; i++) {
        if (children[i].nodeName != "component") {
          this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");
          continue;
        }

        compId = this.reader.getString(children[i], 'id');
        if (compId == null || compId.length == 0)
          return "no ID defined for primitive";
        if (this.components[compId] != null)
            return "ID must be unique for each component (conflict: ID = " + compId + ")";

        grandChildren = children[i].children;
        if(grandChildren.length == 0){
          return "at least one component must be defined";
        }

        this.components[compId] = {
          transformations: [],
          materials: [],
          texture: null,
          children: []
        }

        var nodes = [];

        for (var j = 0; j < grandChildren.length; j++) {
          for (var k = 0; k < grandChildren.length; k++) {
            nodes.push(grandChildren[k].nodeName);
          }

          if (nodes.indexOf("transformation") < 0) {
            return "missing <transformation> tag";
          }
          if (nodes.indexOf("materials") < 0) {
            return "missing <materials> tag";
          }
          if (nodes.indexOf("texture") < 0) {
            return "missing <texture> tag";
          }
          if (nodes.indexOf("children") < 0) {
            return "missing <children> tag";
          }

          switch (grandChildren[j].nodeName) {
            case "transformation":
              greatGrandChildren = grandChildren[j].children;
              for (var k = 0; k < greatGrandChildren.length; k++) {
                if (greatGrandChildren[k].nodeName == "transformationref") {
                  var transfId = this.reader.getString(greatGrandChildren[k], 'id');
                  if (transfId.length == 0) {
                    return "an existing transformation id must be defined in order to be referenced";
                  }
                  if (this.transformations[transfId] == null) {
                    return "transformation '"+transfId+"' does not exist";
                  }
                  for (var i = 0; i < this.transformations[transfId].length; i++) {
                    this.components[compId].transformations.push(this.transformations[transfId][i]);
                  }
                }
                else if (greatGrandChildren[k].nodeName == "translate") {
                  var translate = {
                    type: "translate",
                    x: this.reader.getFloat(greatGrandChildren[k], 'x'),
                    y: this.reader.getFloat(greatGrandChildren[k], 'y'),
                    z: this.reader.getFloat(greatGrandChildren[k], 'z')
                  }
                  this.components[compId].transformations.push(translate);
                }
                else if (greatGrandChildren[k].nodeName == "rotate") {
                  var rotate = {
                    type: "rotate",
                    axis: this.reader.getString(greatGrandChildren[k], 'axis'),
                    angle: this.reader.getFloat(greatGrandChildren[k], 'angle')
                  }
                  this.components[compId].transformations.push(rotate);
                }
                else if (greatGrandChildren[k].nodeName == "scale") {
                  var scale = {
                    type: "scale",
                    x: this.reader.getFloat(greatGrandChildren[k], 'x'),
                    y: this.reader.getFloat(greatGrandChildren[k], 'y'),
                    z: this.reader.getFloat(greatGrandChildren[k], 'z')
                  }
                  this.components[compId].transformations.push(scale);
                }
                else {
                  this.onXMLMinorError("unknown tag <"+greatGrandChildren[i].nodeName+">");
                  continue;
                }
              }
              break;
            case "materials":
              greatGrandChildren = grandChildren[j].children;
              if (greatGrandChildren.length == 0) {
                return "at least one material must be assigned to component '"+compId+"'";
              }
              for (var k = 0; k < greatGrandChildren.length; k++) {
                var materialId = this.reader.getString(greatGrandChildren[k], 'id');
                if (materialId.length == 0) {
                  return "an existing material id must be defined in order to be referenced";
                }
                if (materialId != "inherit" && this.materials[materialId] == null) {
                  return "material '"+materialId+"' does not exist";
                }
                if (materialId == "inherit") {
                  this.components[compId].materials.push(materialId);
                }
                else {
                  this.components[compId].materials.push(this.materials[materialId]);
                }
              }
              break;
            case "texture":
              this.components[compId].texture = {
                id: this.reader.getString(grandChildren[j], 'id'),
                length_s: this.reader.getFloat(grandChildren[j], 'length_s'),
                length_t: this.reader.getFloat(grandChildren[j], 'length_t')
              }
              break;
            case "children":
              greatGrandChildren = grandChildren[j].children;
              if (greatGrandChildren.length == 0) {
                return "at least one reference to a primitive or a component must be assigned to component '"+compId+"'";
              }

              for (var k = 0; k < greatGrandChildren.length; k++) {
                if (greatGrandChildren[k].nodeName == "componentref") {
                  var refId = this.reader.getString(greatGrandChildren[k], 'id');
                  if (this.components[refId] == null) {
                    return "component '"+refId+"' not defined";
                  }
                  this.components[compId].children.push({
                    type: "component",
                    component: this.components[refId]
                  });
                }
                else if (greatGrandChildren[k].nodeName == "primitiveref") {
                  var refId = this.reader.getString(greatGrandChildren[k], 'id');
                  if (this.primitives[refId] == null) {
                    return "primitive '"+refId+"' not defined";
                  }
                  this.components[compId].children.push({
                    type: "primitive",
                    primitive: this.primitives[refId]
                  });
                }
                else {
                  return "unknown tag <"+greatGrandChildren[k].nodeName+">";
                }
              }
              break;
            default:
              return "unknow primitive <"+grandChildren[j].nodeName+">";
          }
        }
      }

        this.log("Parsed components");
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

    rendering(scene, component){
      var children = component.children;
      var transformations = component.transformations;
      var materials = component.materials[0];
      var appearance = new CGFappearance(scene);

      for (var i = 0; i < children.length; i++) {
        scene.pushMatrix();
        if (transformations != null) {
          for (var j = 0; j < transformations.length; j++) {
            switch (transformations[j].type) {
              case "translate":
                scene.translate(transformations[j].x,
                                transformations[j].y,
                                transformations[j].z);
                break;
              case "rotate":
                var angle = transformations[j].angle * DEGREE_TO_RAD;
                if (transformations[j].axis == "x") {
                  scene.rotate(angle, 1, 0, 0);
                }
                else if (transformations[j].axis == "y") {
                  scene.rotate(angle, 0, 1, 0);
                }
                else {
                  scene.rotate(angle, 0, 0, 1);
                }
                break;
              case "scale":
                scene.scale(transformations[j].x,
                            transformations[j].y,
                            transformations[j].z);
                break;
              default:
                return "transformation '"+transformations[j].type+"' not recognized";
            }
          }
        }

        if (materials != "inherit" && materials != null) {
          appearance.setShininess(materials.shininess);
          appearance.setEmission(materials.emission.red,
                                 materials.emission.green,
                                 materials.emission.blue,
                                 materials.emission.alpha);
          appearance.setAmbient(materials.ambient.red,
                                materials.ambient.green,
                                materials.ambient.blue,
                                materials.ambient.alpha);
          appearance.setDiffuse(materials.diffuse.red,
                                materials.diffuse.green,
                                materials.diffuse.blue,
                                materials.diffuse.alpha);
          appearance.setSpecular(materials.specular.red,
                                 materials.specular.green,
                                 materials.specular.blue,
                                 materials.specular.alpha);

          appearance.apply();
        }

        if (children[i].type == "component") {
          this.rendering(scene, children[i].component);
        }
        else {
          children[i].primitive.display();
        }
        this.scene.popMatrix();
      }
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
      // entry point for graph rendering
      this.rendering(this.scene, this.components[this.idRoot]);

    }
}
