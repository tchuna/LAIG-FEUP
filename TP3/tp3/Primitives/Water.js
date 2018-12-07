function Water(scene, water) {
    CGFobject.call(this, scene);

    this.scene = scene;
    this.texture = water.texture;
    this.wave_map = water.wave_map;
    this.parts = water.parts;
    this.height_scale = water.height_scale;
    this.texture_scale = water.texture_scale;


    this.shader = new CGFshader(this.scene.gl, 'Shaders/Plane.vert', 'Shaders/Plane.frag');
    this.shader.setUniformsValues({ normScale: this.height_scale, uSampler2: 1 });


    this.plane = new Plane(this.scene, { npartsU: this.parts, npartsV: this.parts });
}

Water.prototype = Object.create(CGFobject.prototype);
Water.prototype.constructor = Water;

Water.prototype.display = function () {
    this.scene.setActiveShader(this.shader);

    this.scene.pushMatrix();
    this.texture.bind();
    this.wave_map.bind(1);
    this.scene.translate(0.0, 1.0, 0.0);
    this.scene.scale(100.0, 5.0, 100.0);
    this.plane.display();
    this.scene.popMatrix();

    this.scene.setActiveShader(this.scene.defaultShader);
};

Water.prototype.update = function(deltaTime) {
    var factor = (Math.sin((deltaTime * 3.0) % 3141 * 0.002) + 1.0) * 0.5;
    this.shader.setUniformsValues({timeFactor: deltaTime});
}