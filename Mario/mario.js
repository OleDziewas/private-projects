class Mario{

  constructor(x,y){
    this.start_pos = createVector(x,y);
    this.pos = createVector(x,y);
    this.vel = createVector(0,0);
    this.gravity = createVector(0,0.8);
    this.w = 30;
    this.start_w = 30;
    this.h = 50;
    this.start_h = 50;
    this.dir_r = createVector(0,0);
    this.dir_l = createVector(0,0);
    this.dir_u = createVector(0,0);
    this.move_speed = 5;
    this.on_gnd = false;
    this.jump_counter = 0;
    this.index = 0;
    this.alive = true;
    this.item_active = null;
    this.item_timer_on = false;
    this.item_time = 600;
  }

  reset(){
    this.pos.x = this.start_pos.x;
    this.pos.y = this.start_pos.y;
    this.dir_r.set(0,0);
    this.dir_u.set(0,0);
    this.dir_l.set(0,0);
    this.vel.set(0,0);
    this.on_gnd = false;
    this.jump_counter = 0;
    this.index = 0;
    this.item_active = null;
    this.item_timer_on = false;
  }

  show(){

    if (this.item_active == "mushroom"){
      if (this.w <= this.start_w*2.5 && this.h <= this.start_h*2.5){
        this.w += 1;
        this.h += 1;
      }
      fill(255, 165, 0);
      rect(this.pos.x, this.pos.y, this.w, this.h);
    }else if (this.item_active == "star") {
      this.move_speed = 9;
      let a = random(255); let b = random(255);let c = random(255);
      fill(a, b, c);
      rect(this.pos.x, this.pos.y, this.w, this.h);
    }else{
      this.w = this.start_w;
      this.h = this.start_h;
      this.move_speed = 5;
      fill(255,0,0);
      rect(this.pos.x, this.pos.y, this.w, this.h);
    }
    fill(255,228,225);
    rect(this.pos.x, this.pos.y+this.h*0.2, this.w, this.h*0.3);

    if (this.item_timer_on){
      this.item_time -= 1;
      if (this.item_time <= 0){
        if (this.item_active == "star"){
          star_sound.stop();
        }
        this.item_active = null;
        this.item_timer_on = false;
        this.item_time = 600;
      }
    }
  }

  update(ground){
    let low_gr = this.lowestGround(ground);
    this.dir_u.add(this.gravity);

    if(this.pos.y >low_gr.pos.y +low_gr.h-this.h){
      this.alive = false;
      gameover_sound.play();
    }

    if(this.on_ground(ground) == true){
      this.pos.set(this.pos.x, ground[this.index].pos.y-this.h);
      this.dir_u.set(0,0);
      this.jump_counter = 0;
      this.on_gnd = true;
    }else{
      this.on_gnd = false;
    }

    if(this.ground_touched_bottom(ground)){
      this.dir_u.set(0,0);
      this.pos.y = ground[this.index].pos.y + ground[this.index].h +1;
    }
    this.pos.add(this.dir_r);
    this.pos.add(this.dir_l);
    this.pos.add(this.dir_u);
  }

  collect_items(items){
    for (let i = 0; i < items.length; i++){
      if (this.pos.x + this.w/2 > items[i].pos.x && this.pos.x + this.w/2 < items[i].pos.x+ items[i].w){
        if (this.pos.y+this.h >= items[i].pos.y && this.pos.y+this.h <= items[i].pos.y+ items[i].h){
          if (items[i] instanceof Star){
            this.item_active = "star";
            star_sound.volume(0.2);
            star_sound.play();
            this.item_timer_on = true;
          }else if (items[i] instanceof Mushroom){
            mushroom_sound.volume(0.2);
            mushroom_sound.play();
            this.item_active = "mushroom";
            this.item_timer_on = true;
          }
          items.splice(i, 1);
        }
      }
    }
  }

  lowestGround(ground){
    let lowest = 0;
    let ind = 0;
    for (let i = 0; i < ground.length; i++){
      if (ground[i].pos.y > lowest){
        lowest = ground[i].pos.y;
        ind = i;
      }
    }
    return ground[ind];
  }

  on_ground(ground){
    for (let i = 0; i < ground.length; i++){
      if (this.pos.x+this.w > ground[i].pos.x && this.pos.x < ground[i].pos.x+ground[i].w){
        if(this.pos.y +this.h >= ground[i].pos.y && this.pos.y +this.h <= ground[i].pos.y+ground[i].h && this.dir_u.y >= 0){
          this.index = i;
          return true;
        }
      }
    }
    return false;
  }

  ground_touched_bottom(ground){
    for (let i = 0; i < ground.length; i++){
      if(this.pos.x+this.w > ground[i].pos.x && this.pos.x < ground[i].pos.x+ground[i].w){
        if (this.pos.y >= ground[i].pos.y && this.pos.y <= ground[i].pos.y + ground[i].h && this.dir_u.y <= 0){
          this.index = i;
          if (ground[i] instanceof ItemBox){
            ground[i].reveal_item()
          }
          return true;
        }
      }
    }
    return false;
  }

  ground_touched_right(ground){
    for (let i = 0; i < ground.length; i++){
      if (this.pos.x <= ground[i].pos.x+ ground[i].w && this.pos.x >= ground[i].pos.x+ ground[i].w -(ground[i].w/3)){
        if(this.pos.y+this.h > ground[i].pos.y+(ground[i].h/10) && this.pos.y < ground[i].pos.y+ ground[i].h){
          this.index = i;
          return true;
        }
      }
    }
    return false;
  }

  ground_touched_left(ground){
    for (let i = 0; i < ground.length; i++){
      if (this.pos.x +this.w<= ground[i].pos.x+(ground[i].w/3) && this.pos.x +this.w>= ground[i].pos.x){
        if(this.pos.y+this.h > ground[i].pos.y+(ground[i].h/10) && this.pos.y < ground[i].pos.y+ ground[i].h){
          this.index = i;
          return true;
        }
      }
    }
    return false;
  }

  right(ground){
    this.dir_l.set(0,0);
    if (this.ground_touched_left(ground)== false){
      this.dir_r.set(this.move_speed,0);
    }else{
      this.dir_r.set(0,0);
      this.pos.x = ground[this.index].pos.x-this.w;
    }

  }

  left(ground){
    this.dir_r.set(0,0);
    if (this.ground_touched_right(ground)== false){
      this.dir_l.set(-this.move_speed,0);
    }else{
      this.dir_l.set(0,0);
      this.pos.x = ground[this.index].pos.x+ground[this.index].w;
    }
  }

  stopMoveLeft(ground){
    if(this.dir_l.x < 0 && this.pos.y+this.h < height && this.on_ground(ground)== false){
      this.dir_l.set(this.dir_l.x+0.05, 0);
    }
    else{
      this.dir_l.set(0,0);
    }
  }
  stopMoveRight(ground){
    if(this.dir_r.x > 0 && this.pos.y+this.h < height && this.on_ground(ground)== false){
      this.dir_r.set(this.dir_r.x-0.05,0);
    }
    else{
      this.dir_r.set(0,0);
    }
  }

  jump(){
    this.pos.set(this.pos.x, this.pos.y-1);
    this.dir_u.set(0,-14);
  }

  window_right(){
    if (this.pos.x > 0.6*width){
      return true;
    }else{return false;}
  }

  window_left(){
    if (this.pos.x <0.4 * width){
      return true;
    }else{return false;}
  }

  window_down(){
    if (this.pos.y <0.2 * height){
      return true;
    }else{return false;}
  }

  window_up(){
    if (this.pos.y + this.h >0.8 * height){
      return true;
    }else{return false;}
  }


}
