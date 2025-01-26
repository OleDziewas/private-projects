class Star{

  constructor(itembox){
    this.itembox = itembox;
    this.pos = createVector(itembox.pos.x,itembox.pos.y);
    this.start_pos = createVector(itembox.pos.x,itembox.pos.y);
    this.w = 30;
    this.h = 30;
    this.img = star_img;
    this.counter = 0;
  }

  show(){
    fill(255);
    image(this.img, this.pos.x, this.pos.y, this.w, this.h);
  }

  update(){
    if (this.counter < 6){
      this.pos.y -= 5;
      this.counter++;
    }
  }
}
