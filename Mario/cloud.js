class Cloud{

  constructor(x,y){
    this.pos = createVector(x,y);
  }

  show(){
    fill(255)
    push();
    noStroke();
    ellipse(this.pos.x, this.pos.y, 56);
    ellipse(this.pos.x-40, this.pos.y, 56);
    ellipse(this.pos.x-20, this.pos.y-40, 56);
    ellipse(this.pos.x+20, this.pos.y-40, 56);
    ellipse(this.pos.x+20, this.pos.y, 56);
    pop();
  }
}
