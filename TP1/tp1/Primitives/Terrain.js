function Terrain(scene, terrain) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.texture = terrain.texture;
    this.height_map = terrain.height_map;
    this.parts = terrain.parts;
    this.height_scale = terrain.height_scale;
    

    this.shader = new CGFshader(this.scene.gl, 'Shaders/Terrain.vert', 'Shaders/Terrain.frag');
    this.shader.setUniformsValues({normScale: this.height_scale, uSampler2: 1});


    this.plane = new Plane(this.scene, {npartsU: this.parts, npartsV: this.parts});
    
}

Terrain.prototype = Object.create(CGFobject.prototype);
Terrain.prototype.constructor = Terrain;

Terrain.prototype.display = function() {
    this.scene.setActiveShader(this.shader);

    this.scene.pushMatrix();
    this.texture.bind();
    this.height_map.bind(1);
    this.scene.scale(100.0, 5.0, 100.0);
    this.plane.display();
    this.scene.popMatrix();

    this.scene.setActiveShader(this.scene.defaultShader);
};