kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor:[0, 0, 0, 1],
})
loadRoot('https://i.imgur.com/')
loadSprite('hero','Wb1qfhK.png')
loadSprite('block','M6rwarW.png')
loadSprite('coin','wbKxhcd.png')
loadSprite('box','gesQ1KP.png')
loadSprite('enemy','KPO3fR9.png')
loadSprite('emptyBox','bdrLpi6.png')
loadSprite('pipe-top-left','ReTPiWY.png')
loadSprite('pipe-top-right','hj2GK4n.png')
loadSprite('pipe-bottom-left','c1cYSbt.png')
loadSprite('pipe-bottom-right','nqQ79eI.png')
scene("game",({level,score}) => {
    layers(['bg','obj','ui'],'obj')//background, object layer, user interface leyer
    
    const JUMP = 370
    const MOVESPEED = 120
    let isJumping = true
    const FALL_DEATH = 400

    const maps =[
        [
            '                            ',
            '                            ',
            '                            ',
            '        ????                ',
            '                            ',
            '=    ?                      ',
            '=                      -+   ',
            '=          !           ()   ',
            '================     =======',
        ],
        [
            '                            ',
            '                            ',
            '                            ',
            '        ????                ',
            '                            ',
            '=    ?                      ',
            '=                      -+   ',
            '=          !           ()   ',
            '================     =======',
        ]
    ]

    const levelConfg = {
        width:20,
        height:20,
        '=':[sprite('block'),solid(), ],
        '?':[sprite('box'),solid(),'coin-surprise'],
        '$':[sprite('coin'),'coin'],
        '!':[sprite('enemy'), 'enemy',body(),'denger'],
        'x':[sprite('emptyBox'),solid()],
        '-':[sprite('pipe-top-left'),solid(),scale(0.5),'pipe'],
        '+':[sprite('pipe-top-right'),solid(),scale(0.5),'pipe'],
        '(':[sprite('pipe-bottom-left'),solid(),scale(0.5),'pipe'],
        ')':[sprite('pipe-bottom-right'),solid(),scale(0.5),'pipe'],
    }
    const scoreLabel = add([
        text('score'),
        pos(30,6),
        layer('ui'),
        {value:score}
    ])
    add([text('level  '+ parseInt(level + 1)), pos(85,6)])
    const gameLevel = addLevel(maps[level],levelConfg)
    const player =add([
        sprite('hero'),solid(),
        pos(30,0),
        body(),
        origin('bot') 
    ])
    player.action(()=>{
        if(player.grounded()){
            isJumping=false
        }
    })
    player.collides('denger',(d)=>{
        if(isJumping){
            destroy(d)
        }else{
            go('lose',{score:scoreLabel.value})
        }
        
    })
    player.action(()=>{
        camPos(player.pos)
        if(player.pos.y >= FALL_DEATH){
            go('lose',{score:scoreLabel.value})
        }
    })
    player.on("headbump",(obj)=>{
        if(obj.is('coin-surprise')){
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('x', obj.gridPos.sub(0,0))
        }
    })
    player.collides('coin',(c)=>{
        destroy(c)
        scoreLabel.value++
        scoreLabel.text = scoreLabel.value
    })
    player.collides('pipe',()=>{
        keyPress('down',()=>{
            go('game',{
                level:(level+1),
                score:scoreLabel.value})
        })
    })
    
    action('enemy',(e)=>{
        e.move(-15)
    })
    
     
    keyDown('left',()=> {
        player.move(-MOVESPEED,0)
    })
    keyDown('right',()=> {
        player.move(MOVESPEED,0)
    })
    keyPress('space',()=>{
        if(player.grounded()){
            isJumping = true
            player.jump(JUMP)
        }
    })
    keyDown('up',()=>{ 
        if(player.grounded()){
            isJumping = true
            player.jump(JUMP)
        }
    })
    
})
scene('lose',({score})=>{
    add([text(score,32),origin('center'),pos(width()/2, height()/2)])
})

start("game",{level:0,score:0})
