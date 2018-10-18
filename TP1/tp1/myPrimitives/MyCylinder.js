

 function MyCylinder(scene, reference) {
        CGFobject.call(this, scene);
        this.scene = scene;
        this.slices = reference.slices;
        this.stacks = reference.stacks;
        this.height = reference.height;

        this.nBCylinder = new MyCylinderWithOutBase(scene, reference.base, reference.top, reference.height, reference.slices, reference.stacks);
        var aux={
          slices:this.slices
        };

        this.top = new MyCircle(scene,aux);
        this.bottom = new MyCircle(scene,aux);
    };

    MyCylinder.prototype = Object.create(CGFobject.prototype);
    MyCylinder.prototype.constructor = MyCylinder;

    MyCylinder.prototype.display = function() {
        this.nBCylinder.display();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        //this.top.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(-1, -1, 1);
        this.bottom.display();
        this.scene.popMatrix();
    };

    MyCylinder.prototype.updateTexCoords = function(l_s, l_t) {
      this.nBCylinder.updateTexCoords(l_s, l_t);
      this.top.updateTexCoords(l_s, l_t);
      this.bottom.updateTexCoords(l_s, l_t);
    };
