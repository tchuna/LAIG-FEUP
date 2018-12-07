function BoardCell(scene){
    CGFobject.call(this, scene);
    this.scene = scene;

    this.circle = new MyCircle(this.scene, {
        slices: 8
    });
    this.arrow = new MyTriangle(this.scene, {
        x1:-0.5 ,
        y1: 0.0,
        z1: -0.5,
        x2: 0.5,
        y2: 0.0,
        z2: -0.5,
        x3: 0.0,
        y3: 0.0,
        z3: 0.5
    });
    this.cell = new MyRectangle(this.scene, {
        x1: -0.5,
        y1: -0.5,
        x2: 0.5,
        y2: 0.5
    });
};

BoardCell.prototype = Object.create(CGFobject.prototype);
BoardCell.prototype.constructor = BoardCell;

BoardCell.prototype.display = function(){
    this.scene.pushMatrix();

    this.circle.display();
    this.cell.display();

    this.scene.popMatrix();
};