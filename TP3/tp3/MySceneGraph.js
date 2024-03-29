// Order of the groups in the XML document.
const SCENE_INDEX = 0;
const VIEWS_INDEX = 1;
const AMBIENT_INDEX = 2;
const LIGHTS_INDEX = 3;
const TEXTURES_INDEX = 4;
const MATERIALS_INDEX = 5;
const TRANSFORMATIONS_INDEX = 6;
const ANIMATION_INDEX = 7;
const PRIMITIVES_INDEX = 8;
const COMPONENTS_INDEX = 9;

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

        this.game = new Game(this.scene, 2);
    }

    //Validate COLOR
    static validateColor(components, id) {
        if (!(components.red != null && !isNaN(components.red) && components.red >= 0 && components.red <= 1)) {
            return "unable to parse red color  component for ID = " + id;
        }

        if (!(components.green != null && !isNaN(components.green) && components.green >= 0 && components.green <= 1)) {
            return "unable to parse green color  component for ID = " + id;
        }

        if (!(components.blue != null && !isNaN(components.blue) && components.blue >= 0 && components.blue <= 1)) {
            return "unable to parse blue color  component for ID = " + id;
        }

        if (!(components.alpha != null && !isNaN(components.alpha) && components.alpha >= 0 && components.alpha <= 1)) {
            return "unable to parse alpha color  component for ID = " + id;
        }

        return null;

    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    static onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    static log(message) {
        console.log("   " + message);
    }

    /*
    * Callback to be executed after successful reading
    */
    onXMLReady() {
        MySceneGraph.log("XML Loading finished.");
        const rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        const error = this.parseXMLFile(rootElement);

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
        if (rootElement.nodeName !== "yas")
            return "root tag <yas> missing";

        const nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        const nodeNames = [];

        for (let i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        let error;

        // Processes each node, verifying errors.
        // <scene>
        let index;
        if ((index = nodeNames.indexOf("scene")) === -1)
            return "tag <scene> missing";
        else {
            if (index !== SCENE_INDEX)
                MySceneGraph.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) === -1)
            return "tag <views> missing";
        else {
            if (index !== VIEWS_INDEX)
                MySceneGraph.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) === -1)
            return "tag <ambient> missing";
        else {
            if (index !== AMBIENT_INDEX)
                MySceneGraph.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) === -1)
            return "tag <lights> missing";
        else {
            if (index !== LIGHTS_INDEX)
                MySceneGraph.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) === -1)
            return "tag <textures> missing";
        else {
            if (index !== TEXTURES_INDEX)
                MySceneGraph.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) === -1)
            return "tag <materials> missing";
        else {
            if (index !== MATERIALS_INDEX)
                MySceneGraph.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) === -1)
            return "tag <transformations> missing";
        else {
            if (index !== TRANSFORMATIONS_INDEX)
                MySceneGraph.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) === -1) {
            //return "tag <animations> missing";
        } else {
            if (index !== ANIMATION_INDEX)
                MySceneGraph.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) === -1)
            return "tag <primitives> missing";
        else {
            if (index !== PRIMITIVES_INDEX)
                MySceneGraph.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) === -1)
            return "tag <components> missing";
        else {
            if (index !== COMPONENTS_INDEX)
                MySceneGraph.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

        this.idRoot = this.reader.getString(sceneNode, "root");
        this.axis_length = this.reader.getFloat(sceneNode, "axis_length");

        MySceneGraph.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        let to;
        let from;

        // get default view
        this.default_view = this.reader.getString(viewsNode, 'default');
        this.views = [];

        const children = viewsNode.children;
        let grandChildren = [];

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "perspective" && children[i].nodeName !== "ortho") {
                MySceneGraph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // get ID of current view
            const viewId = this.reader.getString(children[i], 'id');
            if (viewId == null) {
                return "no ID defined for <" + children[i] + ">"
            }

            if (this.views[viewId] != null) {
                return "ID must be unique for each view (conflict: ID = " + viewId + ")";
            }

            // Perspective view
            if (children[i].nodeName === "perspective") {
                grandChildren = children[i].children;

                for (let j = 0; j < grandChildren.length; j++) {
                    if (grandChildren[j].nodeName !== "from" && grandChildren[j].nodeName !== "to") {
                        MySceneGraph.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                        continue;
                    }

                    if (grandChildren[j].nodeName === "from") {
                        from = {
                            x: this.reader.getFloat(grandChildren[j], 'x'),
                            y: this.reader.getFloat(grandChildren[j], 'y'),
                            z: this.reader.getFloat(grandChildren[j], 'z')
                        };
                    } else {
                        to = {
                            x: this.reader.getFloat(grandChildren[j], 'x'),
                            y: this.reader.getFloat(grandChildren[j], 'y'),
                            z: this.reader.getFloat(grandChildren[j], 'z')
                        };
                    }
                }
                let aux = {
                    near: this.reader.getFloat(children[i], 'near'),
                    far: this.reader.getFloat(children[i], 'far'),
                    angle: this.reader.getFloat(children[i], 'angle'),
                    from: from,
                    to: to
                };

                this.views[viewId] = this.createPersCamera(aux);
                this.viewsId.push(viewId);
            }
            // Ortho view
            else if (children[i].nodeName === "ortho") {
                grandChildren = children[i].children;
                for (let j = 0; j < grandChildren.length; j++) {
                    if (grandChildren[j].nodeName !== "from" && grandChildren[j].nodeName !== "to") {
                        MySceneGraph.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                        continue;
                    }

                    if (grandChildren[j].nodeName === "from") {
                        from = {
                            x: this.reader.getFloat(grandChildren[j], 'x'),
                            y: this.reader.getFloat(grandChildren[j], 'y'),
                            z: this.reader.getFloat(grandChildren[j], 'z')
                        }
                    } else {
                        to = {
                            x: this.reader.getFloat(grandChildren[j], 'x'),
                            y: this.reader.getFloat(grandChildren[j], 'y'),
                            z: this.reader.getFloat(grandChildren[j], 'z')
                        };
                    }
                }
                const aux = {
                    near: this.reader.getFloat(children[i], 'near'),
                    far: this.reader.getFloat(children[i], 'far'),
                    left: this.reader.getFloat(children[i], 'left'),
                    right: this.reader.getFloat(children[i], 'right'),
                    top: this.reader.getFloat(children[i], 'top'),
                    bottom: this.reader.getFloat(children[i], 'bottom'),
                    from: from,
                    to: to
                };

                this.views[viewId] = this.createOrtCamera(aux);
                this.viewsId.push(viewId);
            }
        }

        MySceneGraph.log("Parsed views");
        //  this.log(this.views["v1"].near);

        return null;
    }

    /**
     * Parses the <ambient> node.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {
        let aux;
        const children = ambientNode.children;
        let ambient;
        let background;

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "ambient" && children[i].nodeName !== "background") {
                MySceneGraph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            if (children[i].nodeName === "ambient") {
                ambient = {
                    red: this.reader.getFloat(children[i], 'r'),
                    green: this.reader.getFloat(children[i], 'g'),
                    blue: this.reader.getFloat(children[i], 'b'),
                    alpha: this.reader.getFloat(children[i], 'a')
                };
                aux = MySceneGraph.validateColor(ambient, "ambient");
                if (aux != null) return aux;
            } else {
                background = {
                    red: this.reader.getFloat(children[i], 'r'),
                    green: this.reader.getFloat(children[i], 'g'),
                    blue: this.reader.getFloat(children[i], 'b'),
                    alpha: this.reader.getFloat(children[i], 'a')
                };
                aux = MySceneGraph.validateColor(background, "background");
                if (aux != null) return aux;
            }
        }

        this.ambient = {
            ambient: ambient,
            background: background
        };

        MySceneGraph.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        let aux;
        const children = lightsNode.children;
        let location;
        let ambient;
        let diffuse;
        let specular;
        let target;


        this.lights = [];
        let numLights = 0;

        let grandChildren = [];

        // Any number of lights.
        for (let i = 0; i < children.length; i++) {

            if (children[i].nodeName !== "omni" && children[i].nodeName !== "spot") {
                MySceneGraph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            const lightId = this.reader.getString(children[i], 'id');
            if (lightId == null || lightId.length === 0)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;

            const nodeNames = [];
            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            if (nodeNames.indexOf("location") < 0) {
                return "missing <location> tag on light " + lightId;
            }
            if (nodeNames.indexOf("ambient") < 0) {
                return "missing <ambient> tag on light " + lightId;
            }
            if (nodeNames.indexOf("diffuse") < 0) {
                return "missing <diffuse> tag on light " + lightId;
            }
            if (nodeNames.indexOf("specular") < 0) {
                return "missing <specular> tag on light " + lightId;
            }
            if (nodeNames.indexOf("target") < 0 && children[i].nodeName === "spot") {
                return "missing <target> tag on light " + lightId;
            }

            // Specifications for the current light.
            for (let j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName === "location") {
                    location = {
                        x: this.reader.getFloat(grandChildren[j], 'x'),
                        y: this.reader.getFloat(grandChildren[j], 'y'),
                        z: this.reader.getFloat(grandChildren[j], 'z'),
                        w: this.reader.getFloat(grandChildren[j], 'w')
                    };
                } else if (grandChildren[j].nodeName === "ambient") {
                    ambient = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };

                    aux = MySceneGraph.validateColor(ambient, lightId + " in Light (Ambient component)");
                    if (aux != null) return aux;
                } else if (grandChildren[j].nodeName === "diffuse") {
                    diffuse = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };
                    aux = MySceneGraph.validateColor(diffuse, lightId + " in Light (Diffuse component)");
                    if (aux != null) return aux;
                } else if (grandChildren[j].nodeName === "specular") {
                    specular = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };
                    aux = MySceneGraph.validateColor(specular, lightId + " in Light (Specular component)");
                    if (aux != null) return aux;
                } else if (grandChildren[j].nodeName === "target") {
                    target = {
                        x: this.reader.getFloat(grandChildren[j], 'x'),
                        y: this.reader.getFloat(grandChildren[j], 'y'),
                        z: this.reader.getFloat(grandChildren[j], 'z')
                    }
                } else {
                    MySceneGraph.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                    continue;
                }

                if (children[i].nodeName === "omni") {
                    this.lights[lightId] = {
                        enabled: this.reader.getBoolean(children[i], 'enabled'),
                        location: location,
                        ambient: ambient,
                        diffuse: diffuse,
                        specular: specular,
                        type: "omni"
                    }

                } else {
                    this.lights[lightId] = {
                        enabled: this.reader.getBoolean(children[i], 'enabled'),
                        angle: this.reader.getFloat(children[i], 'angle'),
                        exponent: this.reader.getFloat(children[i], 'exponent'),
                        location: location,
                        target: target,
                        ambient: ambient,
                        diffuse: diffuse,
                        specular: specular,
                        type: "spot"
                    }
                }
            }

            numLights++;
        }

        if (numLights === 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            MySceneGraph.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        MySceneGraph.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <textures> block.
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        const children = texturesNode.children;

        if (children.length === 0) {
            return "at least one texture must be defined";
        }

        this.textures = [];
        let textId;
        let file;

        for (let i = 0; i < children.length; i++) {
            textId = this.reader.getString(children[i], 'id');
            if (textId == null || textId.length === 0) {
                return "A texture ID must be defined"
            }
            if (this.textures[textId] != null) {
                return textId + " already defined";
            }

            file = this.reader.getString(children[i], 'file');
            if (file == null || file.length === 0) {
                return "A file must be defined for texture " + textId;
            }

            if (file.includes('scenes/images')) {
                this.textures[textId] = new CGFtexture(this.scene, file);
            } else if (file.includes('images/')) {
                this.textures[textId] = new CGFtexture(this.scene, './scenes/' + file);
            } else {
                this.textures[textId] = new CGFtexture(this.scene, "./scenes/images/" + file);
            }

        }

        MySceneGraph.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        let aux;
        const children = materialsNode.children;
        let materialId;

        if (children.length === 0) {
            return "at least one material must be defined";
        }

        this.materials = [];

        let grandChildren;

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "material") {
                MySceneGraph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            materialId = this.reader.getString(children[i], 'id');
            if (materialId == null || materialId.length === 0)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialId] != null)
                return "ID must be unique for each material (conflict: ID = " + materialId + ")";


            const nodeNames = [];
            grandChildren = children[i].children;

            for (let j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }
            if (nodeNames.indexOf("emission") < 0) {
                return "missing <emission> tag";
            } else if (nodeNames.indexOf("ambient") < 0) {
                return "missing <ambient> tag";
            } else if (nodeNames.indexOf("diffuse") < 0) {
                return "missing <diffuse> tag";
            } else if (nodeNames.indexOf("specular") < 0) {
                return "missing <specular> tag";
            }

            let emission;
            let ambient;
            let diffuse;
            let specular;

            for (let j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName === "emission") {
                    emission = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };

                    aux = MySceneGraph.validateColor(emission, materialId + " in Material (Emission component)");
                    if (aux != null) return aux;
                } else if (grandChildren[j].nodeName === "ambient") {
                    ambient = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };

                    aux = MySceneGraph.validateColor(ambient, materialId + " in Material (Ambient component)");
                    if (aux != null) return aux;
                } else if (grandChildren[j].nodeName === "diffuse") {
                    diffuse = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };
                    aux = MySceneGraph.validateColor(diffuse, materialId + " in Material (Diffuse component)");
                    if (aux != null) return aux;
                } else if (grandChildren[j].nodeName === "specular") {
                    specular = {
                        red: this.reader.getFloat(grandChildren[j], 'r'),
                        green: this.reader.getFloat(grandChildren[j], 'g'),
                        blue: this.reader.getFloat(grandChildren[j], 'b'),
                        alpha: this.reader.getFloat(grandChildren[j], 'a')
                    };

                    aux = MySceneGraph.validateColor(specular, materialId + " in Material (Specular component)");
                    if (aux != null) return aux;
                } else {
                    MySceneGraph.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + ">");

                }
            }

            this.materials[materialId] = new CGFappearance(this.scene);
            this.materials[materialId].setShininess(this.reader.getFloat(children[i], 'shininess'));
            this.materials[materialId].setEmission(emission.red, emission.green, emission.blue, emission.alpha);
            this.materials[materialId].setAmbient(ambient.red, ambient.green, ambient.blue, ambient.alpha);
            this.materials[materialId].setDiffuse(diffuse.red, diffuse.green, diffuse.blue, diffuse.alpha);
            this.materials[materialId].setSpecular(specular.red, specular.green, specular.blue, specular.alpha);
        }

        MySceneGraph.log("Parsed materials");
        return null;
    }

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        let z;
        let y;
        let x;
        const children = transformationsNode.children;

        if (children.length === 0) {
            return "at least one transformation must be defined";
        }

        this.transformations = [];
        let grandChildren;

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "transformation") {
                MySceneGraph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            grandChildren = children[i].children;
            if (grandChildren.length === 0) {
                return "at least one transformation must be defined";
            }

            // Get id of the current material.
            const transId = this.reader.getString(children[i], 'id');
            if (transId == null || transId.length === 0)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transId] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transId + ")";

            this.transformations[transId] = mat4.create();

            for (let j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName === "translate") {
                    x = this.reader.getFloat(grandChildren[j], 'x');
                    y = this.reader.getFloat(grandChildren[j], 'y');
                    z = this.reader.getFloat(grandChildren[j], 'z');
                    mat4.translate(this.transformations[transId], this.transformations[transId], [x, y, z]);
                } else if (grandChildren[j].nodeName === "rotate") {
                    const axis = this.reader.getString(grandChildren[j], 'axis');
                    const angle = this.reader.getFloat(grandChildren[j], 'angle') * DEGREE_TO_RAD;
                    mat4.rotate(this.transformations[transId], this.transformations[transId], angle, this.axisCoords[axis]);
                } else if (grandChildren[j].nodeName === "scale") {
                    x = this.reader.getFloat(grandChildren[j], 'x');
                    y = this.reader.getFloat(grandChildren[j], 'y');
                    z = this.reader.getFloat(grandChildren[j], 'z');
                    mat4.scale(this.transformations[transId], this.transformations[transId], [x, y, z]);
                } else {
                    MySceneGraph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                }
            }
        }

        MySceneGraph.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <animations> block
     * @param {animations block element} animationNode
     */
    parseAnimations(animationNode) {
        const children = animationNode.children;

        this.animations = [];

        if (children.length !== 0) {
            let grandChildren;
            let controlPoints;
            let animationId;
            let spanTime;

            for (let i = 0; i < children.length; i++) {
                if (children[i].nodeName !== "linear" && children[i].nodeName !== "circular") {
                    MySceneGraph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    continue;
                }

                animationId = this.reader.getString(children[i], 'id') || null;
                spanTime = this.reader.getFloat(children[i], 'span') || -1;

                if (animationId == null || animationId.length === 0) {
                    return "no ID defined in linear animation";
                }

                if (this.animations[animationId] != null) {
                    return "ID must be unique for each animation (conflict: ID = " + animationId + ")";
                }

                if (isNaN(spanTime) || spanTime <= 0) {
                    return "SPAN must be a positive number (animation: ID = " + animationId + ")";
                }

                if (children[i].nodeName === "linear") {
                    controlPoints = [];
                    grandChildren = children[i].children;

                    if (grandChildren.length < 2) {
                        return "At least 2 Control Points are needed (animation: ID = " + animationId + ")";
                    }

                    for (let j = 0; j < grandChildren.length; j++) {
                        if (grandChildren[j].nodeName !== "controlpoint") {
                            MySceneGraph.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + "> (animation: ID = " + animationId + ")");
                            continue;
                        }

                        const xx = this.reader.getFloat(grandChildren[j], "xx");
                        const yy = this.reader.getFloat(grandChildren[j], "yy");
                        const zz = this.reader.getFloat(grandChildren[j], "zz");

                        if (isNaN(xx)) {
                            return "component XX must be a number (animation: ID = " + animationId + ")";
                        }
                        if (isNaN(yy)) {
                            return "component YY must be a number (animation: ID = " + animationId + ")";
                        }
                        if (isNaN(zz)) {
                            return "component ZZ must be a number (animation: ID = " + animationId + ")";
                        }

                        controlPoints.push([xx, yy, zz]);
                    }

                    this.animations[animationId] = new LinearAnimation(this.scene, animationId, spanTime, controlPoints);
                } else if (children[i].nodeName === "circular") {
                    var center = this.reader.getString(children[i], 'center');
                    var radius = this.reader.getFloat(children[i], 'radius');
                    var startAng = this.reader.getFloat(children[i], 'startang');
                    var rotAng = this.reader.getFloat(children[i], 'rotang');

                    if (center == null) {
                        return "A center point must be defined (animation: ID = " + animationId + ")";
                    }

                    center = center.split(" ");
                    center = center.map(el => parseInt(el));
                    center = center.filter(function (el) {
                        return !isNaN(el)
                    });

                    if (center.length !== 3 || '' in center) {
                        return "CENTER must be defined with exact 3 values separated by white spaces (animation: ID = " + animationId + ")";
                    }
                    if (isNaN(radius) || radius < 0) {
                        return "RADIUS must be a positive number (animation: ID = " + animationId + ")";
                    }
                    if (isNaN(startAng)) {
                        return "STARTANG must be an angle expressed in degrees (animation: ID = " + animationId + ")";
                    }
                    if (isNaN(rotAng)) {
                        return "ROTANG must be an angle expressed in degrees (animation: ID = " + animationId + ")";
                    }

                    this.animations[animationId] = new CircularAnimation(this.scene, animationId, spanTime, center, radius, startAng, rotAng);
                }
            }
        }
        MySceneGraph.log("Parsed Animations");
    }

    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        const children = primitivesNode.children;
        if (children.length === 0) {
            return "at least one primitive must be defined";
        }

        this.primitives = [];
        let grandChildren;

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "primitive") {
                MySceneGraph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            const primId = this.reader.getString(children[i], 'id');
            if (primId == null || primId.length === 0) {
                return "no ID defined for primitive";
            }
            if (this.primitives[primId] != null) {
                return "ID must be unique for each primitive (conflict: ID = " + primId + ")";
            }

            grandChildren = children[i].children;
            if (grandChildren.length === 0) {
                return "at least one primitive must be defined";
            } else if (grandChildren.length > 1) {
                return "only one primitive must be defined at time"
            }
            let primitive;
            switch (grandChildren[0].nodeName) {


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

                case "rectangle":
                    primitive = {
                        x1: this.reader.getFloat(grandChildren[0], 'x1'),
                        y1: this.reader.getFloat(grandChildren[0], 'y1'),
                        x2: this.reader.getFloat(grandChildren[0], 'x2'),
                        y2: this.reader.getFloat(grandChildren[0], 'y2')
                    };
                    this.primitives[primId] = new MyRectangle(this.scene, primitive);
                    break;
                case "triangle":
                    primitive = {
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
                    return "unknown primitive <" + grandChildren[0].nodeName + ">";
            }

            this.nodes[primId] = new Node(primId, 'primitive');
            this.nodes[primId].primitive = this.primitives[primId];
        }

        MySceneGraph.log("Parsed primitives");
        return null;
    }

    /**
     * Build the components graph
     * @param nodeId
     * @param parentNode
     * @param nodesList
     */
    graphBuilder(nodeId, parentNode, nodesList) {
        let refId;
        let z;
        let y;
        let x;
        const node = new Node(nodeId, 'component');
        const children = nodesList[nodeId].children;
        let grandChildren;

        node.parent = parentNode;

        if (children.length === 0) {
            MySceneGraph.onXMLMinorError("graphBuilder: at least one component must be defined");
            return null;
        }

        for (let j = 0; j < children.length; j++) {
            let k;
            switch (children[j].nodeName) {
                case "transformation":
                    grandChildren = children[j].children;
                    for (k = 0; k < grandChildren.length; k++) {
                        if (grandChildren[k].nodeName === "transformationref") {
                            const transId = this.reader.getString(grandChildren[k], 'id');
                            if (transId.length === 0) {
                                MySceneGraph.onXMLMinorError("graphBuilder: an transformation id must be defined in order to reference it");
                                continue;
                            }
                            if (this.transformations[transId] == null) {
                                MySceneGraph.onXMLMinorError("graphBuilder: transformation '" + transId + "' does not exist");
                                continue;
                            }
                            mat4.multiply(node.transformMatrix, node.transformMatrix, this.transformations[transId]);
                        } else if (grandChildren[k].nodeName === "translate") {
                            x = this.reader.getFloat(grandChildren[k], 'x');
                            y = this.reader.getFloat(grandChildren[k], 'y');
                            z = this.reader.getFloat(grandChildren[k], 'z');
                            mat4.translate(node.transformMatrix, node.transformMatrix, [x, y, z]);
                        } else if (grandChildren[k].nodeName === "rotate") {
                            const axis = this.reader.getString(grandChildren[k], 'axis');
                            const angle = this.reader.getFloat(grandChildren[k], 'angle') * DEGREE_TO_RAD;
                            mat4.rotate(node.transformMatrix, node.transformMatrix, angle, this.axisCoords[axis]);
                        } else if (grandChildren[k].nodeName === "scale") {
                            x = this.reader.getFloat(grandChildren[k], 'x');
                            y = this.reader.getFloat(grandChildren[k], 'y');
                            z = this.reader.getFloat(grandChildren[k], 'z');
                            mat4.scale(node.transformMatrix, node.transformMatrix, [x, y, z]);
                        } else {
                            MySceneGraph.onXMLMinorError("unknown tag <" + grandChildren[k].nodeName + ">");

                        }
                    }
                    break;
                case "animations":
                    grandChildren = children[j].children;
                    for (k = 0; k < grandChildren.length; k++) {
                        if (grandChildren[k].nodeName === "animationref") {
                            const animationId = this.reader.getString(grandChildren[k], 'id');
                            if (animationId.length === 0) {
                                MySceneGraph.onXMLMinorError("graphBuilder: an animation id must be defined in order to reference it");
                                continue;
                            }
                            if (this.animations[animationId] == null) {
                                MySceneGraph.onXMLMinorError("graphBuilder: animation '" + animationId + "' does not exist");
                                continue;
                            }

                            node.animations.push(this.animations[animationId]);
                        } else {
                            MySceneGraph.onXMLMinorError("unknown tag <" + grandChildren[k].nodeName + ">");

                        }
                    }
                    break;
                case "materials":
                    grandChildren = children[j].children;
                    if (grandChildren.length === 0) {
                        MySceneGraph.onXMLMinorError("graphBuilder: at least one material must be assigned to component '" + node.id + "'");
                        return null;
                    }
                    for (k = 0; k < grandChildren.length; k++) {
                        const materialId = this.reader.getString(grandChildren[k], 'id');
                        if (materialId.length === 0) {
                            MySceneGraph.onXMLMinorError("graphBuilder: an existing material id must be defined in order to be referenced");
                            continue;
                        }
                        if (materialId !== "inherit" && this.materials[materialId] == null) {
                            MySceneGraph.onXMLMinorError("graphBuilder: material '" + materialId + "' does not exist");
                            continue;
                        }
                        if (materialId === "inherit") {
                            if (node.id === this.idRoot) {
                                const appearance = new CGFappearance(this.scene);
                                appearance.setShininess(10);
                                appearance.setEmission(0, 0, 0, 0);
                                appearance.setAmbient(0.5, 0.5, 0.5, 1.0);
                                appearance.setDiffuse(0.5, 0.5, 0.5, 1.0);
                                appearance.setSpecular(0.5, 0.5, 0.5, 1.0);

                                node.materials.push(appearance);
                            } else {
                                for (var i = 0; i < node.parent.materials.length; i++) {
                                    node.materials.push(node.parent.materials[i]);
                                }
                            }
                        } else {
                            node.materials.push(this.materials[materialId]);
                        }
                    }

                    this.currMaterial[node.id] = {
                        current: 0,
                        total: node.materials.length
                    };
                    break;
                case "texture":
                    const textId = this.reader.getString(children[j], 'id');
                    if (textId === 'none') {
                        node.texture = {
                            texture: textId
                            // length_s: this.reader.getFloat(children[j], 'length_s'),
                            // length_t: this.reader.getFloat(children[j], 'length_t')
                        }
                    } else if (textId === 'inherit') {
                        const length_s = this.reader.getFloat(children[j], 'length_s', false);
                        const length_t = this.reader.getFloat(children[j], 'length_t', false);

                        if (length_s != null && length_t != null) {
                            node.texture = {
                                texture: node.parent.texture.texture,
                                length_s: length_s,
                                length_t: length_t
                            }
                        } else {
                            node.texture = {
                                texture: node.parent.texture.texture,
                                length_s: node.parent.texture.length_s,
                                length_t: node.parent.texture.length_t
                            }
                        }
                    } else {
                        node.texture = {
                            texture: this.textures[textId],
                            length_s: this.reader.getFloat(children[j], 'length_s'),
                            length_t: this.reader.getFloat(children[j], 'length_t')
                        }
                    }
                    break;
                case "children":
                    grandChildren = children[j].children;
                    if (grandChildren.length === 0) {
                        MySceneGraph.onXMLMinorError("graphBuilder: at least one reference to a primitive or a component must be assigned to component '" + node.id + "'");
                        return null;
                    }

                    for (k = 0; k < grandChildren.length; k++) {
                        if (grandChildren[k].nodeName === "componentref") {
                            refId = this.reader.getString(grandChildren[k], 'id');
                            if (nodesList[refId] == null) {
                                MySceneGraph.onXMLMinorError("graphBuilder: component '" + refId + "' not defined");
                                continue;
                            }
                            const child = this.graphBuilder(refId, node, nodesList);
                            node.children.push(child);
                        } else if (grandChildren[k].nodeName === "primitiveref") {
                            refId = this.reader.getString(grandChildren[k], 'id');
                            if (this.primitives[refId] == null) {
                                MySceneGraph.onXMLMinorError("graphBuilder: primitive " + refId + " not defined.");

                            } else {
                                this.nodes[refId].parents.push(node);
                                node.children.push(this.nodes[refId]);
                            }
                        } else {
                            MySceneGraph.onXMLMinorError("graphBuilder: unknown tag <" + grandChildren[k].nodeName + "> in children of " + node.id);

                        }
                    }
                    break;
                default:
                    MySceneGraph.onXMLMinorError("graphBuilder: unknow tag <" + children[j].nodeName + "> for component " + node.id);

            }
        }
        this.nodes[node.id] = node;
        return node;
    }

    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) {
        const children = componentsNode.children;
        const components = [];
        let compId;

        // Validate components
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName !== "component") {
                MySceneGraph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            compId = this.reader.getString(children[i], 'id');
            if (compId == null || compId.length === 0) {
                return "no ID defined for primitive";
            }
            if (components[compId] != null) {
                return "ID must be unique for each component (conflict: ID = " + compId + ")";
            }
            components[compId] = children[i];
        }

        this.rootNode = this.graphBuilder(this.idRoot, null, components);

        if (this.rootNode != null) {
            MySceneGraph.log("Parsed components");
            return null;
        } else {
            return "Error parsing components";
        }
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
     * Create Perspective camera
     *
     */
    createPersCamera(elements) {
        if (isNaN(elements.near)) {
            this.onXMLError('Perspective Views expected a float number on near.');
        }
        if (isNaN(elements.far)) {
            this.onXMLError('Perspective Views expected a float number on far.');
        }
        if (isNaN(elements.angle)) {
            this.onXMLError('Perspective Views expected a float number on angle.');
        }
        if (isNaN(elements.from.x)) {
            this.onXMLError('Perspective Views expected a float number o from(x)');
        }
        if (isNaN(elements.from.y)) {
            this.onXMLError('Perspective Views expected a float number o from(y)');
        }
        if (isNaN(elements.from.z)) {
            this.onXMLError('Perspective Views expected a float number o from(z)');
        }
        if (isNaN(elements.to.x)) {
            this.onXMLError('Perspective Views expected a float number o to(x)');
        }
        if (isNaN(elements.to.y)) {
            this.onXMLError('Perspective Views expected a float number o to(y)');
        }
        if (isNaN(elements.to.z)) {
            this.onXMLError('Perspective Views expected a float number o to(z)');
        }
        return new CGFcamera(elements.angle * DEGREE_TO_RAD, elements.near, elements.far, vec3.fromValues(elements.from.x, elements.from.y, elements.from.z), vec3.fromValues(elements.to.x, elements.to.y, elements.to.y));

    }

    /**
     * Create Orto camera
     *
     */
    createOrtCamera(elements) {
        if (isNaN(elements.near)) {
            this.onXMLError('Perspective Views expected a float number on near.');
        }
        if (isNaN(elements.far)) {
            this.onXMLError('Perspective Views expected a float number on far.');
        }
        if (isNaN(elements.from.x)) {
            this.onXMLError('Perspective Views expected a float number o from(x)');
        }
        if (isNaN(elements.from.y)) {
            this.onXMLError('Perspective Views expected a float number o from(y)');
        }
        if (isNaN(elements.from.z)) {
            this.onXMLError('Perspective Views expected a float number o from(z)');
        }
        if (isNaN(elements.to.x)) {
            this.onXMLError('Perspective Views expected a float number o to(x)');
        }
        if (isNaN(elements.to.y)) {
            this.onXMLError('Perspective Views expected a float number o to(y)');
        }
        if (isNaN(elements.to.z)) {
            this.onXMLError('Perspective Views expected a float number o to(z)');
        }
        if (isNaN(elements.left)) {
            this.onXMLError('Perspective Views expected a float number on left.');
        }
        if (isNaN(elements.right)) {
            this.onXMLError('Perspective Views expected a float number on right.');
        }
        if (isNaN(elements.bottom)) {
            this.onXMLError('Perspective Views expected a float number on bottom.');
        }
        if (isNaN(elements.top)) {
            this.onXMLError('Perspective Views expected a float number on top.');
        }
        return new CGFcameraOrtho(elements.left, elements.right, elements.bottom, elements.top, elements.near, elements.far, vec3.fromValues(elements.from.x, elements.from.y, elements.from.z), vec3.fromValues(elements.to.x, elements.to.y, elements.to.y), vec3.fromValues(0, 1, 0));

    }

    /**
     * Run the graph and display the elements, applying textures, materials, and
     * animations
     *
     * @param scene
     * @param node
     */
    rendering(scene, node) {
        let i;
        scene.multMatrix(node.transformMatrix);

        if (node.animations.length > 0) {
            node.animations[node.currAnimationId].apply();
        }

        if (this.currMaterial[node.id].current >= this.currMaterial[node.id].total) {
            this.currMaterial[node.id].current = 0;
        }

        node.materials[this.currMaterial[node.id].current].apply();

        for (i = 0; i < node.children.length; i++) {
            if (node.children[i].type === 'primitive') {
                if (node.texture.texture !== 'none') {
                    node.children[i].primitive.updateTexCoords(node.texture.length_s, node.texture.length_t);
                    node.texture.texture.bind();
                }
                node.children[i].primitive.display();
            }
        }

        for (i = 0; i < node.children.length; i++) {
            if (node.children[i].type === 'component') {
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
        this.rendering(this.scene, this.rootNode);
        //this.game.display();
        this.scene.popMatrix();
    }
}
