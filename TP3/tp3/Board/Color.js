function Color(scene, color) {
    this.scene = scene;

    switch (color) {
        case 'red':
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(1.0, 0.0, 0.0, 1.0);
            this.material.setDiffuse(1.0, 0.0, 0.0, 1.0);
            this.material.setSpecular(1.0, 0.0, 0.0, 1.0);
            this.material.setShininess(10.0);
            break;
        case 'dark_red':
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(0.7, 0.0, 0.0, 1.0);
            this.material.setDiffuse(0.7, 0.0, 0.0, 1.0);
            this.material.setSpecular(0.7, 0.0, 0.0, 1.0);
            this.material.setShininess(10.0);
            break;
        case 'green':
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(0.0, 1.0, 0.0, 1.0);
            this.material.setDiffuse(0.0, 1.0, 0.0, 1.0);
            this.material.setSpecular(0.0, 1.0, 0.0, 1.0);
            this.material.setShininess(10.0);
            break;
        case 'dark_green':
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(0.0, 0.7, 0.0, 1.0);
            this.material.setDiffuse(0.0, 0.7, 0.0, 1.0);
            this.material.setSpecular(0.0, 0.7, 0.0, 1.0);
            this.material.setShininess(10.0);
            break;
        case 'blue':
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(0.0, 0.0, 1.0, 1.0);
            this.material.setDiffuse(0.0, 0.0, 1.0, 1.0);
            this.material.setSpecular(0.0, 0.0, 1.0, 1.0);
            this.material.setShininess(10.0);
            break;
        case 'dark_blue':
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(0.0, 0.0, 0.7, 1.0);
            this.material.setDiffuse(0.0, 0.0, 0.7, 1.0);
            this.material.setSpecular(0.0, 0.0, 0.7, 1.0);
            this.material.setShininess(10.0);
            break;
        case 'white':
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
            this.material.setDiffuse(1.0, 1.0, 1.0, 1.0);
            this.material.setSpecular(1.0, 1.0, 1.0, 1.0);
            this.material.setShininess(10.0);
            break;
        case 'light_gray':
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(0.7, 0.7, 0.7, 1.0);
            this.material.setDiffuse(0.7, 0.7, 0.7, 1.0);
            this.material.setSpecular(0.7, 0.7, 0.7, 1.0);
            this.material.setShininess(10.0);
            break;
        case 'black':
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(0.0, 0.0, 0.0, 1.0);
            this.material.setDiffuse(0.0, 0.0, 0.0, 1.0);
            this.material.setSpecular(0.0, 0.0, 0.0, 1.0);
            this.material.setShininess(10.0);
            break;
        case 'dark_gray':
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(0.3, 0.3, 0.3, 1.0);
            this.material.setDiffuse(0.3, 0.3, 0.3, 1.0);
            this.material.setSpecular(0.3, 0.3, 0.3, 1.0);
            this.material.setShininess(10.0);
            break;
        default:
            console.warn('Warning: passing argument color from Color is invalid! ' +
                                 'Setting to default material (white)');
            this.material = new CGFappearance(this.scene);
            this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
            this.material.setDiffuse(1.0, 1.0, 1.0, 1.0);
            this.material.setSpecular(1.0, 1.0, 1.0, 1.0);
            this.material.setShininess(10.0);
    }

    return this.material;
}