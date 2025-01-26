let mario;
let ground_and_itemboxes = [];
let posX = 50;
let wall_img;
let itembox_img;
let star_img;
let mushroom_img;
let brokenBlock_img;

let itembox_sound;
let star_sound;
let mushroom_sound;
let jump_sound;
let gameover_sound;

let cloud = [];

//für schwarzewerdenden Deathscreen
let r = 0;

//für blinkende Schrift
let colour = 0;
let turn = 0;
let items = [];

function setup(){
  cnv = createCanvas(600,400);
  frameRate(120);
  itembox_img = loadImage("textures/ItemBox.png");
  itembox_sound = createAudio("sounds/ItemBlockSound.mp3");
  star_img = loadImage("textures/Star.png");
  star_sound = createAudio("sounds/StarSound.mp3");
  mushroom_img = loadImage("textures/mushroom.png");
  mushroom_sound = createAudio("sounds/MushroomSound.mp3");
  brokenBlock_img = loadImage("textures/BrokenItemBlock.png");
  jump_sound = createAudio("sounds/JumpSound.mp3");
  gameover_sound = createAudio("sounds/GameoverSound.mp3")

  mario = new Mario(200, height-150);
  ground_and_itemboxes[5] = new ItemBox(200,height-200, itembox_img);
  ground_and_itemboxes[4] = new Ground(50, height/2, 100, 50, wall_img);
  ground_and_itemboxes[1] = new Ground(50, height/2-160, 100, 50, wall_img);
  ground_and_itemboxes[2] = new Ground(260, height/2-80, 100, 50, wall_img);
  ground_and_itemboxes[3] = new Ground(width+100, 300, 400, 100, wall_img);
  ground_and_itemboxes[0] = new Ground(-200, height-50, 500, 200, wall_img); //startground_and_itemboxes
  cloud[0] = new Cloud(width/2, height/2);
  cloud[1] = new Cloud(60,60);
  cloud[2] = new Cloud(width-120,120);
}

function draw(){
  background(135,206,250);
  translate(0,0);
  if(mario.alive){
    for (let i = 0; i < cloud.length; i++){
      cloud[i].show();
    }
    for (let i = 0; i < items.length; i++){
      items[i].show();
      items[i].update();
    }
    for (let i = 0; i < ground_and_itemboxes.length; i++){
      ground_and_itemboxes[i].show();
    }

    mario.show();
    mario.update(ground_and_itemboxes);
    mario.collect_items(items);

    if (mario.window_right()){
      for (let i = 0; i < ground_and_itemboxes.length; i++){
        ground_and_itemboxes[i].pos.x -= mario.dir_r.x;
      }
      for (let i = 0; i < items.length; i++){
        items[i].pos.x -= mario.dir_r.x;
      }
      mario.pos.x -= mario.dir_r.x;
    }

    if (mario.window_left()){
      for (let i = 0; i < ground_and_itemboxes.length; i++){
        ground_and_itemboxes[i].pos.x -= mario.dir_l.x;
      }
      for (let i = 0; i < items.length; i++){
        items[i].pos.x -= mario.dir_l.x;
      }
      mario.pos.x -= mario.dir_l.x;
    }

    if (mario.window_up()){
      for (let i = 0; i < ground_and_itemboxes.length; i++){
        ground_and_itemboxes[i].pos.y -= mario.dir_u.y;
      }
      for (let i = 0; i < items.length; i++){
        items[i].pos.y -= mario.dir_u.y;
      }
      mario.pos.y -= mario.dir_u.y;
    }

    if (mario.window_down()){
      for (let i = 0; i < ground_and_itemboxes.length; i++){
        ground_and_itemboxes[i].pos.y -= mario.dir_u.y;
      }
      for (let i = 0; i < items.length; i++){
        items[i].pos.y -= mario.dir_u.y;
      }
      mario.pos.y -= mario.dir_u.y;
    }

    if (keyIsDown(68)){
      mario.right(ground_and_itemboxes);
    }
    if (!keyIsDown(68)){
      mario.stopMoveRight(ground_and_itemboxes);
    }
    if (keyIsDown(65)){
      mario.left(ground_and_itemboxes);
    }
    if (!keyIsDown(65)){
      mario.stopMoveLeft(ground_and_itemboxes);
    }
  }else{
    star_sound.stop();
    for (let i = 0; i < cloud.length; i++){
      cloud[i].show();
    }
    for (let i = 0; i < ground_and_itemboxes.length; i++){
      ground_and_itemboxes[i].show();
    }
    mario.show();
    fill(0);
    ellipse(width/2, height/2, r, r);
    if(r < 750){
      r+= 12;
    }else{
      fill(255);
      textSize(52);
      textAlign(CENTER, CENTER);
      text("GAMEOVER",width/2,height/3);
      textSize(22);
      textAlign(CENTER, CENTER);
      fill(colour);
      if(colour+5 <= 255 && turn == 0){
        colour += 3;
      }else{
        turn =1;
      }
      if (colour-5 >= 0 && turn == 1){
        colour -= 3;
      }else{
        turn = 0;
      }
      text("Press ENTER to restart the game!",width/2,height*0.6);
      if(keyIsDown(13)){
        restart(ground_and_itemboxes, mario);
        gameover_sound.stop();
        mario.alive = true;
      }
    }
  }
}

function keyPressed(){
  if (key == ' ' && mario.jump_counter <2){
    mario.jump();
    mario.jump_counter++;
  }
}

function restart(ground_and_itemboxes, mario){
  mario.reset();
  for (let i = 0; i < ground_and_itemboxes.length; i++){
    ground_and_itemboxes[i].reset();
  }
  colour = 0;
  r = 0;
  turn = 0;
}
