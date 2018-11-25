function Terrain(scene, terrain) {
    CGFobject.call(this, scene);

    this.scene = scene;

    this.shader = new CGFshader(this.scene.gl, 'Shaders/Terrain.vert', 'Shaders/Terrain.frag');
    this.shader.setUniformValues({normScale: 1.0});

    this.texture = new CGFtexture(this.scene, terrain.texture);
    this.height_map = new CGFtexture(this.scene, terrain.height_tex);

    // this.plane = new MyPlane(this.scene);
    
}

Terrain.prototype = Object.create(CGFobject.prototype);
Terrain.prototype.constructor = Terrain;

Terrain.prototype.display = function() {
    this.scene.setActiveShader(this.shader);

    this.texture.bind();
    this.height_map.bind(1);
    // this.plane.display();

    this.scene.setActiveShader(this.scene.defaultShader);
};