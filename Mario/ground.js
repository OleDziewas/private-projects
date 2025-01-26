class Ground{

  constructor(x,y, w, h, img){
    this.pos = createVector(x,y);
    this.start_pos = createVector(x,y);
    this.w = w;
    this.h = h;
  }

  show(){
    fill(139,90,43);
    rect(this.pos.x, this.pos.y, this.w, this.h);
    push();
    noStroke();
    fill(0,100,0);
    rect(this.pos.x, this.pos.y, this.w, this.h*0.2)
    pop();
  }

  reset(){
    this.pos.x = this.start_pos.x;
    this.pos.y = this.start_pos.y;
  }
}
