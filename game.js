kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0,0.2,0.95,0.4],
  debug: true,
  scale: 2,
});
loadRoot("./sprites/");
loadSprite('block','block.png');
loadSprite('block_blue','block_blue.png');
loadSprite('pipe','pipe_up.png');
loadSprite('cloud','cloud.png');
loadSprite('castle','castle.png');
loadSprite('yellowplayer','yellowplayer.png');
loadSprite('redplayer','redplayer.png');
loadSprite('redflag','redflag.png');
loadSprite('yellowflag','yellowflag.png');
loadSprite('yellowblock','yellowblock.png');
loadSprite('redblock','redblock.png');
loadSound('gameSound','gameSound.mp3');
loadSound('jumpSound','jumpSound.mp3');

scene("begin",()=>{

add([text('Press ENTER to start',30), origin('center'), pos(width() / 2, height() /2),
])
keyRelease('enter', () => {
  go("game");
})
})


scene('death', (score) =>{
add([text('YellowPlayer Wins!',30), origin('center'), pos(width() / 2, height() /2),
])

add([text('Press ENTER To restart',7), pos(width() - 170,height() - 25 ),
])

keyRelease('enter', () => {
  go("game");
})
})

scene('win', (score) =>{
  add([text('RedPlayer Wins!',30), origin('center'), pos(width() / 2, height() /2),
])
add([text('Press ENTER To restart',7), pos(width() - 170,height() - 25 ),
])
keyRelease('enter', () => {
  go("game");

})
})

scene("game", () =>{
  layers(['background','obj','ui'], 'obj' );
  const symbolMap = {
      width: 20,
      height: 20,
      "=": [sprite('block'), solid(), '='],
      "p": [sprite('pipe'), solid(), 'p'],
      "c": [sprite('cloud')],
      'z': [sprite('castle')],
      '+': [sprite('block_blue'), solid(), '+'],
      'r': [sprite('redflag'), 'r'],
      'y': [sprite('yellowflag'), 'y'],
      'g': [sprite('redblock'), solid()],
      'h': [sprite('yellowblock'), solid()],


  }
  const map = [
      '                                                ',
      '                   c                          c ',
      '        c                       c               ',
      '     c         c          c              c      ',
      '            hh                    gg            ',
      '            hh                    gg            ',
      '            hh                    gg            ',
      '        hhhhhhhhhh            gggggggggg        ',
      '        h        h     hg     g        g        ',
      '   h    h  hhhh  h            g  gggg  g    g   ',
      '           h  h                  g  g           ',
      ' y      hhhh  hhhh            gggg  gggg     r  ',
      '      h              h    g              g      ',
      ' p                   h    g                  p  ',
      '            hh       h    g       gg            ',
      'hhhhhhhhhhhhhhhhhhhhhh    gggggggggggggggggggggg',
      'hhhhhhhhhhhhhhhhhhhhhh    gggggggggggggggggggggg',
      'hhhhhhhhhhhhhhhhhhhhhh    gggggggggggggggggggggg',
      'hhhhhhhhhhhhhhhhhhhhhh    gggggggggggggggggggggg',
      'hhhhhhhhhhhhhhhhhhhhhh    gggggggggggggggggggggg',
      
  ];
      
  const gameLevel = addLevel(map,symbolMap);

  let i = 0;
  let isJumping = false;
  let redspeed = 120;
  let yellowspeed = 120;
  const jumpForce = 200;
  let onCollide = false;
  let onCollide1 = false;
  let j1 = 0;
  let j2 = 0;
  
  let yellowplayer = add([
      sprite('yellowplayer'),
      solid(),
      pos(40,0),
      body(),
      origin('bot'),
      big(jumpForce),
      "yellowplayer"
  ]);

  let redplayer = add([
      sprite('redplayer'),
      solid(),
      pos(920,0),
      body(),
      origin('bot'),
      big(jumpForce),
      "redplayer"
  ]);

  keyDown('d', () => {
  yellowplayer.move(yellowspeed,0)
  })
  

  keyDown('a', () => {
  yellowplayer.move(-yellowspeed,0)
  })

  keyPress('w', () => {
      if(yellowplayer.grounded()){
          isJumping = true;
          yellowplayer.jump(400)
      }
  })

  redplayer.collides("yellowplayer", async (yellowplayer) => {
    if(yellowplayer.pos.x > 480){
        if(yellowplayer.isBig()){
            yellowplayer.smallify()
        }

        yellowplayer.pos.x = 40
        yellowplayer.pos.y = -5000
        await wait(2);
        yellowplayer.pos.x = 40
        yellowplayer.pos.y = 0
    }
    else{
        if(redplayer.isBig()){
            redplayer.smallify()
        }
        redplayer.pos.x = 920
        redplayer.pos.y = -5000
        await wait(2);
        yellowplayer.pos.x = 920
        redplayer.pos.y = 0
    }
})
  

  keyDown('right', () => {
      redplayer.move(redspeed,0)
  })

  keyDown('left', () => {
      redplayer.move(-redspeed,0)
  })
      
  keyPress('up', () => {
      if(redplayer.grounded()){
          isJumping = true;
          redplayer.jump(400)
      }
  })

  yellowplayer.action(async() => {

  if(yellowplayer.pos.x > 900 && yellowplayer.pos.y > 220){
      yellowplayer.biggify(10)
  }

  if(yellowplayer.grounded()){
  isJumping = false;
  }
  else{
  isJumping = true;
  }
  if(yellowplayer.pos.y > 300){
      if(yellowplayer.isBig()){
      yellowplayer.smallify()
  }
      yellowplayer.pos.x = 40
      yellowplayer.pos.y = -5000
      await wait(2);
      yellowplayer.pos.x = 40
      yellowplayer.pos.y = 0
  }

  if(yellowplayer.pos.x < 440 && yellowplayer.isBig()){
      go('death')
  }
})

redplayer.action(async() => {

  if(redplayer.pos.x < 60 && redplayer.pos.y > 220){
      redplayer.biggify(10)
  }

  if(redplayer.grounded()){
  isJumping = false;
  }
  else{
  isJumping = true;
  }
  if(redplayer.pos.y > 300){
      if(redplayer.isBig()){
      redplayer.smallify()
      }
      redplayer.pos.x = 920
      redplayer.pos.y = -5000
      await wait(2);
      yellowplayer.pos.x = 920
      redplayer.pos.y = 0
  }
  if(redplayer.pos.x > 520 && redplayer.isBig()){
      go('win')
  }
  })
})
start('begin');