class ItemBox extends Ground{

  constructor(x,y, img){
    super();
    this.pos = createVector(x,y);
    this.start_pos = createVector(x,y);
    this.w = 30;
    this.h = 30;
    this.img = img;
    this.item_stored = true;
  }

  show(){
    image(this.img, this.pos.x, this.pos.y, this.w, this.h);
  }

  reveal_item(){
    if (this.item_stored){
      itembox_sound.volume(0.15);
      itembox_sound.play();
      this.img = brokenBlock_img;
      items[items.length] = random([new Star(this), new Mushroom(this)]);
      this.item_stored = false;
    }
  }

  reset(){
    this.pos.x = this.start_pos.x;
    this.pos.y = this.start_pos.y;
    this.img = itembox_img;
    items = [];
    this.item_stored = true;
  }
}
