var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATION_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

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

        this.currMaterial = [];

        // File reading
        this.reader = new CGFXMLreader();

        /*
        * Read the contents of the xml file, and refer to this class for loading and error handlers.
        * After the file is read, the reader calls onXMLReady on this object.
        * If any error occurs, the reader calls onXMLError on this object, with an error message
        */

        this.reader.open('scenes/' + filename, this);

        this.board = new Board(this.scene);
        this.piece = new Piece(this.scene, new Color(this.scene, 'red'));
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

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1) {
            //return "tag <animations> missing";
        }
        else {
            if (index != ANIMATION_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
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
                        };
                    }
                    else{
                        var to = {
                            x: this.reader.getFloat(grandChildren[j], 'x'),
                            y: this.reader.getFloat(grandChildren[j], 'y'),
                            z: this.reader.getFloat(grandChildren[j], 'z')
                        };
                    }
                }
                var aux= {
                    near: this.reader.getFloat(children[i], 'near'),
                    far: this.reader.getFloat(children[i], 'far'),
                    angle: this.reader.getFloat(children[i], 'angle'),
                    from: from,
                    to: to
                };

                var auxCamera=this.createPersCamera(aux);
                this.views[viewId]=auxCamera;
                this.viewsId.push(viewId);
            }
            // Ortho view
            else if (children[i].nodeName == "ortho") {
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
                var aux= {
                    near: this.reader.getFloat(children[i], 'near'),
                    far: this.reader.getFloat(children[i], 'far'),
                    left: this.reader.getFloat(children[i], 'left'),
                    right: this.reader.getFloat(children[i], 'right'),
                    top: this.reader.getFloat(children[i], 'top'),
                    bottom: this.reader.getFloat(children[i], 'bottom'),
                    from:from,
                    to:to
                };

                var auxCamera=this.createOrtCamera(aux);
                this.views[viewId]=auxCamera;
                this.viewsId.push(viewId);
            }
        }

        this.log("Parsed views");
        //  this.log(this.views["v1"].near);

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
                };
                var aux=this.validateColor(ambient,"ambient");
                if(aux!=null) return aux;
            }
            else {
                var background = {
                    red: this.reader.getFloat(children[i], 'r'),
                    green: this.reader.getFloat(children[i], 'g'),
                    blue: this.reader.getFloat(children[i], 'b'),
                    alpha: this.reader.getFloat(children[i], 'a')
                };
                var aux=this.validateColor(background,"background");
                if(aux!=null) return aux;
            }
        }

        this.ambient = {
            ambient: ambient,
            background: background
        };

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights=[];
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
            if (this.lights[lightId] != null )
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
                    };

                    var aux=this.validateColor(ambient,lightId+" in Light (Ambient component)");
                    if(aux!=null) return aux;
                }
                else if (grandChildren[j].nodeName == "diffuse") {
                    var diffuse = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };
                    var aux=this.validateColor(diffuse,lightId+" in Light (Diffuse component)");
                    if(aux!=null) return aux;
                }
                else if (grandChildren[j].nodeName == "specular") {
                    var specular = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };
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
                        specular: specular,
                        type:"omni"
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
                        specular: specular,
                        type:"spot"
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
        var file;

        for (var i = 0; i < children.length; i++) {
            textId = this.reader.getString(children[i], 'id');
            if (textId == null || textId.length == 0) {
                return "A texture ID must be defined"
            }
            if (this.textures[textId] != null) {
                return textId + " already defined";
            }

            file = this.reader.getString(children[i], 'file');
            if (file == null || file.length == 0) {
                return "A file must be defined for texture "+textId;
            }

            if (file.includes('scenes/images')) {
                this.textures[textId] = new CGFtexture(this.scene, file);
            }
            else if (file.includes('images/')) {
                this.textures[textId] = new CGFtexture(this.scene, './scenes/' + file);
            }
            else {
                this.textures[textId] = new CGFtexture(this.scene, "./scenes/images/" + file);
            }

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
                    };

                    var aux=this.validateColor(emission,materialId+" in Material (Emission component)");
                    if(aux!=null) return aux;
                }
                else if (grandChildren[j].nodeName == "ambient"){
                    var ambient = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };

                    var aux=this.validateColor(ambient,materialId+" in Material (Ambient component)");
                    if(aux!=null) return aux;
                }
                else if (grandChildren[j].nodeName=="diffuse"){
                    var diffuse = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };
                    var aux=this.validateColor(diffuse,materialId+" in Material (Diffuse component)");
                    if(aux!=null) return aux;
                }
                else if (grandChildren[j].nodeName == "specular"){
                    var specular = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };

                    var aux=this.validateColor(specular,materialId+" in Material (Specular component)");
                    if(aux!=null) return aux;
                }
                else{
                    this.onXMLMinorError("unknown tag <"+grandChildren[i].nodeName+">");

                }
            }

            this.materials[materialId] = new CGFappearance(this.scene);
            this.materials[materialId].setShininess(this.reader.getFloat(children[i], 'shininess'));
            this.materials[materialId].setEmission(emission.red, emission.green, emission.blue, emission.alpha);
            this.materials[materialId].setAmbient(ambient.red, ambient.green, ambient.blue, ambient.alpha);
            this.materials[materialId].setDiffuse(diffuse.red, diffuse.green, diffuse.blue, diffuse.alpha);
            this.materials[materialId].setSpecular(specular.red, specular.green, specular.blue, specular.alpha);
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

            this.transformations[transfId] = mat4.create();

            for (var j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName == "translate") {
                    var x = this.reader.getFloat(grandChildren[j], 'x');
                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    var z = this.reader.getFloat(grandChildren[j], 'z');
                    mat4.translate(this.transformations[transfId],this.transformations[transfId],[x,y,z]);
                }
                else if (grandChildren[j].nodeName == "rotate") {
                    var axis = this.reader.getString(grandChildren[j], 'axis');
                    var angle = this.reader.getFloat(grandChildren[j], 'angle') * DEGREE_TO_RAD;
                    mat4.rotate(this.transformations[transfId], this.transformations[transfId], angle, this.axisCoords[axis]);
                }
                else if (grandChildren[j].nodeName == "scale") {
                    var x = this.reader.getFloat(grandChildren[j], 'x');
                    var y = this.reader.getFloat(grandChildren[j], 'y');
                    var z = this.reader.getFloat(grandChildren[j], 'z');
                    mat4.scale(this.transformations[transfId], this.transformations[transfId], [x,y,z]);
                }
                else {
                    this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");

                }
            }
        }

        this.log("Parsed transformations");
        return null;
    }


    /**
     * Parses the <animations> block
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationNode) {
        var children = animationNode.children;

        this.animations = [];

        if(children.length != 0) {
            var grandChildren;
            var controlPoints;
            var animationId;
            var spanTime;

            for (var i = 0; i < children.length; i++) {
                if (children[i].nodeName != "linear" && children[i].nodeName != "circular") {
                    this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");
                    continue;
                }

                animationId = this.reader.getString(children[i], 'id') || null;
                spanTime = this.reader.getFloat(children[i], 'span') || -1;

                if (animationId == null || animationId.length == 0) {
                    return "no ID defined in linear animation";
                }

                if (this.animations[animationId] != null) {
                    return "ID must be unique for each animation (conflict: ID = "+animationId+")";
                }

                if (isNaN(spanTime) || spanTime <= 0) {
                    return "SPAN must be a positive number (animation: ID = "+animationId+")";
                }

                if(children[i].nodeName == "linear") {
                    controlPoints = [];
                    grandChildren = children[i].children;

                    if(grandChildren.length < 2) {
                        return "At least 2 Control Points are needed (animation: ID = "+animationId+")";
                    }

                    for (var j = 0; j < grandChildren.length; j++) {
                        if (grandChildren[j].nodeName != "controlpoint") {
                            this.onXMLMinorError("unknown tag <"+grandChildren[i].nodeName+"> (animation: ID = "+animationId+")");
                            continue;
                        }

                        var xx = this.reader.getFloat(grandChildren[j],"xx");
                        var yy = this.reader.getFloat(grandChildren[j],"yy");
                        var zz = this.reader.getFloat(grandChildren[j],"zz");

                        if (isNaN(xx)) {
                            return "component XX must be a number (animation: ID = "+animationId+")";
                        }
                        if (isNaN(yy)) {
                            return "component YY must be a number (animation: ID = "+animationId+")";
                        }
                        if (isNaN(zz)) {
                            return "component ZZ must be a number (animation: ID = "+animationId+")";
                        }

                        controlPoints.push([xx, yy, zz]);
                    }

                    this.animations[animationId] = new LinearAnimation(this.scene, animationId, spanTime, controlPoints);
                }
                else if(children[i].nodeName == "circular") {
                    var center = this.reader.getString(children[i], 'center');
                    var radius = this.reader.getFloat(children[i], 'radius');
                    var startAng = this.reader.getFloat(children[i], 'startang');
                    var rotAng = this.reader.getFloat(children[i], 'rotang');

                    if (center == null) {
                        return "A center point must be defined (animation: ID = "+animationId+")";
                    }

                    center = center.split(" ");
                    center = center.map(el => parseInt(el));
                    center = center.filter(function(el) { return !isNaN(el) } );

                    if (center.length != 3 || '' in center) {
                        return "CENTER must be defined with exact 3 values separeted by white spaces (animation: ID = "+animationId+")";
                    }
                    if (isNaN(radius) || radius < 0) {
                        return "RADIUS must be a positive number (animation: ID = "+animationId+")";
                    }
                    if (isNaN(startAng)) {
                        return "STARTANG must be an angle expressed in degrees (animation: ID = "+animationId+")";
                    }
                    if (isNaN(rotAng)) {
                        return "ROTANG must be an angle expressed in degrees (animation: ID = "+animationId+")";
                    }

                    this.animations[animationId] = new CircularAnimation(this.scene, animationId, spanTime, center, radius, startAng, rotAng);
                }
            }
        }
        this.log("Parsed Animations");
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
            if (primId == null || primId.length == 0) {
                return "no ID defined for primitive";
            }
            if (this.primitives[primId] != null){
                return "ID must be unique for each primitive (conflict: ID = " + primId + ")";
            }

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
                default:
                    return "unknow primitive <"+grandChildren[0].nodeName+">";
            }

            this.nodes[primId] = new Node(primId, 'primitive');
            this.nodes[primId].primitive = this.primitives[primId];
        }

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Build the components graph
     * @param {String} node id
     * @param {Node element} parent node
     * @param {List} List with components
     */
    graphBuilder(nodeId, parentNode, nodesList){
        var node = new Node(nodeId, 'component');
        var children = nodesList[nodeId].children;
        var grandChildren;

        node.parent = parentNode;

        if(children.length == 0){
            this.onXMLMinorError("graphBuilder: at least one component must be defined");
            return null;
        }

        for (var j = 0; j < children.length; j++) {
            switch (children[j].nodeName) {
                case "transformation":
                    grandChildren = children[j].children;
                    for (var k = 0; k < grandChildren.length; k++) {
                        if (grandChildren[k].nodeName == "transformationref") {
                            var transfId = this.reader.getString(grandChildren[k], 'id');
                            if (transfId.length == 0) {
                                this.onXMLMinorError("graphBuilder: an transformation id must be defined in order to reference it");
                                continue;
                            }
                            if (this.transformations[transfId] == null) {
                                this.onXMLMinorError("graphBuilder: transformation '"+transfId+"' does not exist");
                                continue;
                            }
                            mat4.multiply(node.transformMatrix, node.transformMatrix, this.transformations[transfId]);
                        }
                        else if (grandChildren[k].nodeName == "translate") {
                            var x = this.reader.getFloat(grandChildren[k], 'x');
                            var y = this.reader.getFloat(grandChildren[k], 'y');
                            var z = this.reader.getFloat(grandChildren[k], 'z');
                            mat4.translate(node.transformMatrix, node.transformMatrix, [x,y,z]);
                        }
                        else if (grandChildren[k].nodeName == "rotate") {
                            var axis = this.reader.getString(grandChildren[k], 'axis');
                            var angle = this.reader.getFloat(grandChildren[k], 'angle') * DEGREE_TO_RAD;
                            mat4.rotate(node.transformMatrix, node.transformMatrix, angle, this.axisCoords[axis]);
                        }
                        else if (grandChildren[k].nodeName == "scale") {
                            var x = this.reader.getFloat(grandChildren[k], 'x');
                            var y = this.reader.getFloat(grandChildren[k], 'y');
                            var z = this.reader.getFloat(grandChildren[k], 'z');
                            mat4.scale(node.transformMatrix, node.transformMatrix, [x,y,z]);
                        }
                        else {
                            this.onXMLMinorError("unknown tag <"+grandChildren[k].nodeName+">");

                        }
                    }
                    break;
                case "animations":
                    grandChildren = children[j].children;
                    for (var k = 0; k < grandChildren.length; k++) {
                        if (grandChildren[k].nodeName == "animationref") {
                            var animationId = this.reader.getString(grandChildren[k], 'id');
                            if (animationId.length == 0) {
                                this.onXMLMinorError("graphBuilder: an animation id must be defined in order to reference it");
                                continue;
                            }
                            if (this.animations[animationId] == null) {
                                this.onXMLMinorError("graphBuilder: animation '"+animationId+"' does not exist");
                                continue;
                            }

                            node.animations.push(this.animations[animationId]);
                        }
                        else {
                            this.onXMLMinorError("unknown tag <"+grandChildren[k].nodeName+">");

                        }
                    }
                    break;
                case "materials":
                    grandChildren = children[j].children;
                    if (grandChildren.length == 0) {
                        this.onXMLMinorError("graphBuilder: at least one material must be assigned to component '"+node.id+"'");
                        return null;
                    }
                    for (var k = 0; k < grandChildren.length; k++) {
                        var materialId = this.reader.getString(grandChildren[k], 'id');
                        if (materialId.length == 0) {
                            this.onXMLMinorError("graphBuilder: an existing material id must be defined in order to be referenced");
                            continue;
                        }
                        if (materialId != "inherit" && this.materials[materialId] == null) {
                            this.onXMLMinorError("graphBuilder: material '"+materialId+"' does not exist");
                            continue;
                        }
                        if (materialId == "inherit") {
                            if (node.id == this.idRoot) {
                                var appearance = new CGFappearance(this.scene);
                                appearance.setShininess(10);
                                appearance.setEmission(0,0,0,0);
                                appearance.setAmbient(0.5,0.5,0.5,1.0);
                                appearance.setDiffuse(0.5,0.5,0.5,1.0);
                                appearance.setSpecular(0.5,0.5,0.5,1.0);

                                node.materials.push(appearance);
                            }
                            else {
                                for (var i = 0; i < node.parent.materials.length; i++) {
                                    node.materials.push(node.parent.materials[i]);
                                }
                            }
                        }
                        else {
                            node.materials.push(this.materials[materialId]);
                        }
                    }

                    this.currMaterial[node.id] = {
                        current: 0,
                        total:node.materials.length
                    };
                    break;
                case "texture":
                    var textId = this.reader.getString(children[j], 'id');
                    if (textId == 'none') {
                        node.texture = {
                            texture: textId
                            // length_s: this.reader.getFloat(children[j], 'length_s'),
                            // length_t: this.reader.getFloat(children[j], 'length_t')
                        }
                    }
                    else if (textId == 'inherit') {
                        var length_s = this.reader.getFloat(children[j], 'length_s', false);
                        var length_t = this.reader.getFloat(children[j], 'length_t', false);

                        if (length_s != null && length_t != null) {
                            node.texture = {
                                texture: node.parent.texture.texture,
                                length_s: length_s,
                                length_t: length_t
                            }
                        }
                        else {
                            node.texture = {
                                texture: node.parent.texture.texture,
                                length_s: node.parent.texture.length_s,
                                length_t: node.parent.texture.length_t
                            }
                        }
                    }
                    else {
                        node.texture = {
                            texture: this.textures[textId],
                            length_s: this.reader.getFloat(children[j], 'length_s'),
                            length_t: this.reader.getFloat(children[j], 'length_t')
                        }
                    }
                    break;
                case "children":
                    grandChildren = children[j].children;
                    if (grandChildren.length == 0) {
                        this.onXMLMinorError("graphBuilder: at least one reference to a primitive or a component must be assigned to component '"+node.id+"'");
                        return null;
                    }

                    for (var k = 0; k < grandChildren.length; k++) {
                        if (grandChildren[k].nodeName == "componentref") {
                            var refId = this.reader.getString(grandChildren[k], 'id');
                            if (nodesList[refId] == null) {
                                this.onXMLMinorError("graphBuilder: component '"+refId+"' not defined");
                                continue;
                            }
                            var child = this.graphBuilder(refId, node, nodesList);
                            node.children.push(child);
                        }
                        else if (grandChildren[k].nodeName == "primitiveref") {
                            var refId = this.reader.getString(grandChildren[k], 'id');
                            if (this.primitives[refId] == null) {
                                this.onXMLMinorError("graphBuilder: primitive "+refId+" not defined.");

                            }
                            else {
                                this.nodes[refId].parents.push(node);
                                node.children.push(this.nodes[refId]);
                            }
                        }
                        else {
                            this.onXMLMinorError("graphBuilder: unknown tag <"+grandChildren[k].nodeName+"> in children of "+node.id);

                        }
                    }
                    break;
                default:
                    this.onXMLMinorError("graphBuilder: unknow tag <"+children[j].nodeName+"> for component "+node.id);

            }
        }
        this.nodes[node.id] = node;
        return node;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentesNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;
        var components = [];
        var compId;

        // Validate components
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <"+children[i].nodeName+">");
                continue;
            }
            compId = this.reader.getString(children[i], 'id');
            if (compId == null || compId.length == 0){
                return "no ID defined for primitive";
            }
            if (components[compId] != null){
                return "ID must be unique for each component (conflict: ID = " + compId + ")";
            }
            components[compId] = children[i];
        }

        this.rootNode = this.graphBuilder(this.idRoot, null, components);

        if (this.rootNode != null) {
            this.log("Parsed components");
            return null;
        }
        else {
            return "Error parsing components";
        }
    }

    /**
     * Create Perspective camera
     *
     */
    createPersCamera(elements){
        if(isNaN(elements.near)){
            this.onXMLError('Perspective Views expected a float number on near.');
        }
        if(isNaN(elements.far)){
            this.onXMLError('Perspective Views expected a float number on far.');
        }
        if(isNaN(elements.angle)){
            this.onXMLError('Perspective Views expected a float number on angle.');
        }
        if(isNaN(elements.from.x)){
            this.onXMLError('Perspective Views expected a float number o from(x)');
        }
        if(isNaN(elements.from.y)){
            this.onXMLError('Perspective Views expected a float number o from(y)');
        }
        if(isNaN(elements.from.z)){
            this.onXMLError('Perspective Views expected a float number o from(z)');
        }
        if(isNaN(elements.to.x)){
            this.onXMLError('Perspective Views expected a float number o to(x)');
        }
        if(isNaN(elements.to.y)){
            this.onXMLError('Perspective Views expected a float number o to(y)');
        }
        if(isNaN(elements.to.z)){
            this.onXMLError('Perspective Views expected a float number o to(z)');
        }
        var aux=new CGFcamera(elements.angle * DEGREE_TO_RAD, elements.near, elements.far, vec3.fromValues(elements.from.x, elements.from.y,elements.from.z), vec3.fromValues(elements.to.x, elements.to.y, elements.to.y));

        return aux;

    }

    /**
     * Create Orto camera
     *
     */
    createOrtCamera(elements){
        if(isNaN(elements.near)){
            this.onXMLError('Perspective Views expected a float number on near.');
        }
        if(isNaN(elements.far)){
            this.onXMLError('Perspective Views expected a float number on far.');
        }
        if(isNaN(elements.from.x)){
            this.onXMLError('Perspective Views expected a float number o from(x)');
        }
        if(isNaN(elements.from.y)){
            this.onXMLError('Perspective Views expected a float number o from(y)');
        }
        if(isNaN(elements.from.z)){
            this.onXMLError('Perspective Views expected a float number o from(z)');
        }
        if(isNaN(elements.to.x)){
            this.onXMLError('Perspective Views expected a float number o to(x)');
        }
        if(isNaN(elements.to.y)){
            this.onXMLError('Perspective Views expected a float number o to(y)');
        }
        if(isNaN(elements.to.z)){
            this.onXMLError('Perspective Views expected a float number o to(z)');
        }
        if(isNaN(elements.left)){
            this.onXMLError('Perspective Views expected a float number on left.');
        }
        if(isNaN(elements.right)){
            this.onXMLError('Perspective Views expected a float number on right.');
        }
        if(isNaN(elements.bottom)){
            this.onXMLError('Perspective Views expected a float number on bottom.');
        }
        if(isNaN(elements.top)){
            this.onXMLError('Perspective Views expected a float number on top.');
        }
        var aux=new CGFcameraOrtho(elements.left, elements.right, elements.bottom,elements.top,elements.near,elements.far,vec3.fromValues(elements.from.x, elements.from.y,elements.from.z), vec3.fromValues(elements.to.x, elements.to.y, elements.to.y),vec3.fromValues(0,1,0));

        return aux;

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
     * Run the graph and display the elements, applying textures, materials, and
     * animations
     *
     * @param CGFScene scene
     * @param Node node
     */
    rendering(scene, node){
        scene.multMatrix(node.transformMatrix);

        if(node.animations.length > 0) {
            node.animations[node.currAnimationId].apply();
        }

        if (this.currMaterial[node.id].current >= this.currMaterial[node.id].total) {
            this.currMaterial[node.id].current = 0;
        }

        node.materials[this.currMaterial[node.id].current].apply();

        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].type == 'primitive') {
                if (node.texture.texture != 'none') {
                    node.children[i].primitive.updateTexCoords(node.texture.length_s, node.texture.length_t);
                    node.texture.texture.bind();
                }
                node.children[i].primitive.display();
            }
        }

        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].type == 'component') {
                scene.pushMatrix();
                this.rendering(scene, node.children[i]);
                scene.popMatrix();
            }
        }
    }


    /**
     * Displays the scene, processing each node, starting in the root node.
     *
     */
    displayScene() {

        // entry point for graph rendering
        this.scene.pushMatrix();
        // this.rendering(this.scene, this.rootNode);
        this.board.display();
        this.board.enableDot(50);
        this.board.setDotColor(50, 'blue');
        this.board.enableArrows(50, 'N');
        this.piece.display();
        this.scene.popMatrix();
    }
}
