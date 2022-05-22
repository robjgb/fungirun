/* global PIXI */
// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container

let bgBack;
let bgBack1;
let bgBack2;
let bgMiddle;
let bgFront;
let floor;
let bgX = 0;
let gameSpeed = 1.5;

let player;
let keys = {};
let keysDiv;
let playerSheet = {};
let isJump = false;
let scoreText;

let enemySheet = {};
let enemy;
let enemyIn = false;

let score = 0;
let maxScore = 0;

let gameOver;

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new PIXI.Application({
  width: 650,
  height: 450,
  backgroundColor: 0xffffff,
}
);

const textStyle = new PIXI.TextStyle({
    fontFamily: 'Press Start 2P'
});

scoreText = new PIXI.Text("Score: ", {
    fontSize: 25,
    fill: "#FFF",
    align: "center",
    stroke: "#aaaaaa",
    strokeThickness: 0,
    textStyle
  });

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);
document.getElementById('box').appendChild(app.view); 


app.loader.baseUrl = "https://cdn.glitch.global/a9c9a59d-e7a4-4e95-a0cb-3d32f2d8c0e5/";

app.loader
  .add("bgBack", "plx-1.png")
  .add("bgBack1", "plx-2.png")
  .add("bgBack2", "plx-3.png")
  .add("bgMiddle", "plx-4.png")
  .add("bgFront", "plx-5.png")
  .add("mushroom", "cute%20mushroom%20walk.png")
  .add("floor", "Jungle%20Floor.png")
  .add("enemy", "cute%20shroom%20blue%20idle.png");


app.loader.onComplete.add(initLevel);
app.loader.load(doneLoading);

window.addEventListener("keydown", keysDown);
window.addEventListener("keyup", keysUp);


function gameLoop(delta){
  
  if(!gameOver){
    updateBg();

    console.log(player.y)
    
    if(keys[87] && player.y === 375){
      isJump = true;
    }

    jump();

    gravity();

    score += 0.1;
    enemy.x -= (gameSpeed * 2);
    
    if (CollidesWith(player, enemy)) {
      gameOver = true;
    }    
  }
  
  if (!gameOver) {
    scoreText.text =
      "Score: " +
      Math.ceil(score) +
      " - Max Score: " +
      Math.ceil(maxScore);
  } else {
    scoreText.text =
      "Game over! You scored " +
      Math.ceil(score) +
      ". Max Score: " +
      Math.ceil(maxScore) +
      ". \n Press spacebar to restart.";
  }
  
  
  if(gameOver){
    app.stage.removeChild(enemy);
    player.animationSpeed = 0;
    enemy.animationSpeed = 0;
    if (score > maxScore) {
      maxScore = score;
     }
  }
  
  if(keys[32] && gameOver){
    spacebar();
    score = 0;
    player.animationSpeed = gameSpeed / 3.5;
    enemy.animationSpeed = gameSpeed / 3.5;
  }
  
  if(enemy.x < -650){
    app.stage.removeChild(enemy);
    enemyIn = false;
    spawner();  
  }
  
}

function spawner()
{
   createEnemy();
   enemyIn = true;
}


function keysDown(e){
  console.log(e.keyCode);
  keys[e.keyCode] = true;
}

function keysUp(e){
  //console.log(e.keyCode);
  keys[e.keyCode] = false;
}

function initLevel(){
  score = 0;
  
  bgBack = createBg(app.loader.resources["bgBack"].texture);
  bgBack1 = createBg(app.loader.resources["bgBack1"].texture);
  bgBack2 = createBg(app.loader.resources["bgBack2"].texture);
  bgMiddle = createBg(app.loader.resources["bgMiddle"].texture);
  bgFront = createBg(app.loader.resources["bgFront"].texture);
  floor = createFloor(app.loader.resources["floor"].texture);
  
  app.stage.addChild(scoreText);
  
  app.ticker.add(() => {
    gameLoop();
  });
}

function createBg(texture){
  let tiling = new PIXI.TilingSprite(texture, 800, 600);
  tiling.scale.x = 2;
  tiling.scale.y = 2;
  tiling.position.set(0,0);
  app.stage.addChild(tiling);
  
  return tiling;
}

function createFloor(texture){
  let tiling = new PIXI.TilingSprite(texture, 800, 32);
  tiling.scale.x = 2;
  tiling.scale.y = 2.5;
  tiling.position.set(0,380);
  app.stage.addChild(tiling);
  
  return tiling;
}

function updateBg(){
  bgX = (bgX - gameSpeed);
  bgFront.tilePosition.x = bgX / 1.5;
  bgMiddle.tilePosition.x = bgX / 2;
  bgBack.tilePosition.x = bgX / 4;
  bgBack1.tilePosition.x = bgX / 3;
  bgBack2.tilePosition.x = bgX / 2.5;

  floor.tilePosition.x = bgX;
}

function doneLoading(e)
{
  createPlayerSheet();
  createPlayer();
  createEnemy();
}

function createPlayerSheet()
{
  let ssheet = new PIXI.BaseTexture.from(app.loader.resources["mushroom"].url);
  let essheet = new PIXI.BaseTexture.from(app.loader.resources["enemy"].url);

  let w = 48;
  let h = 48;
  let numFrames = 4;
  
  playerSheet["walking"] = [
    new PIXI.Texture(ssheet, new PIXI.Rectangle(w * 0, 0, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(w * 1, 0, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(w * 2, 0, w, h)),
    new PIXI.Texture(ssheet, new PIXI.Rectangle(w * 3, 0, w, h))
  ];
  
  enemySheet["idling"] = [
  new PIXI.Texture(essheet, new PIXI.Rectangle(w * 0, 0, w, h)),
  new PIXI.Texture(essheet, new PIXI.Rectangle(w * 1, 0, w, h)),
  new PIXI.Texture(essheet, new PIXI.Rectangle(w * 2, 0, w, h)),
  new PIXI.Texture(essheet, new PIXI.Rectangle(w * 3, 0, w, h))
];
}

function createPlayer(){
  player = new PIXI.AnimatedSprite(playerSheet.walking);
  player.anchor.set(0.6, 0.6);
  player.animationSpeed = gameSpeed / 3.5;
  player.loop = true;
  player.x = app.view.width / 8;
  player.y = app.view.height / 1.3;
  player.scale.x = 2;
  player.scale.y = 2;

  app.stage.addChild(player);
  player.play();
  player.y = 375;
}

function createEnemy(){
  enemy = new PIXI.AnimatedSprite(enemySheet.idling);
  enemy.anchor.set(0.4, 0.4);
  enemy.animationSpeed = gameSpeed / 3.5;
  enemy.loop = true;
  enemy.x = app.view.width;
  enemy.y = app.view.height / 1.2;
  enemy.scale.x = -2;
  enemy.scale.y = 2;

  app.stage.addChild(enemy);
  enemy.play();
  console.log("created enemy");
}

function jump(){
  if(isJump){
    player.y -= 3;
    if(player.y === 225){
      isJump = false;
    }
  }
}

function spacebar(){
  gameOver = false;
}

function gravity(){
  if(player.y < 375 && isJump === false){
    player.y += 3;
  }
}

function CollidesWith(player, enemy) {
  let spacing = 50;
  // player's rectangle
  let ab = player.getBounds();

  // sprite we are checking against
  let bb = enemy.getBounds();
  
  return  !(ab.x  > bb.x + bb.width - spacing ||
          ab.x + ab.width - spacing < bb.x ||
          ab.y + ab.height - spacing < bb.y   ||
          ab.y  > bb.y + bb.height - spacing);
  
}

app.loader.onError.add((...args) => console.error(args));

