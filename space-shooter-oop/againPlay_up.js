class PlayAgainGameScene extends Phaser.Scene{
    constructor(){
        super('PlayA')
        this.score=0;
    }


 preload() {//preload sirf memory me load krta page pe show nhi karega

    this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
    this.load.image('jet', 'assets/jet.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('ammo', 'assets/ammo.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.audio('gun-shot','assets/audio/gunshot.wav')
    this.load.audio('coinhit','assets/audio/coinhit.wav')
    this.load.audio('endgame','assets/audio/end.mp3')
    this.load.spritesheet('explosion','assets/spritesheets/explosion.png',{
        frameWidth: 16,
        frameHeight:16
    })
    
}
 create(){
    this.sky=this.add.tileSprite(400,300,config.width,config.height,'sky');//for moving background
    this.jet=this.physics.add.image(400,500,'jet').setScale(0.15).setOrigin(0.5,0);
    this.jet.setCollideWorldBounds(true);// velocity se jayega but never stopsif we did not include this function OR hamhe boundary pe collision check karana hota hai agar collide hua toh rok do use.
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on('pointerdown',this.shoot,this)// jab jet pe click kre toh bullet ko velocity mile(inbuilt functions hai yeh phasor ke)
    
    //****Method-1***** for creating group
    this.bombs=this.physics.add.group({// multiple bomb ese create hote group banake
        key:'bomb',//konse group ka hai(properties hai yeh group ki)
        repeat:3,//3 bomb
        setXY:{
            x:20,y:50,stepX:Phaser.Math.Between(10,config.width-15),stepY:Phaser.Math.Between(15,300)

        }
        

    })
    //***Method-2***for creating group 
    this.coins=this.physics.add.group();
    for(let i=0;i<10;i++){
        let x=Phaser.Math.Between(0,config.width-15);
        let y=Phaser.Math.Between(0,200);
        let newCoin=this.coins.create(x,y,'coin');
        let xVel=Phaser.Math.Between(-100,100);
        let yVel=Phaser.Math.Between(150,200);
        this.coins.setVelocity(xVel,yVel);

    }


    this.setObjVelocity(this.bombs);

    //making of animation of sprite sheet
    this.anims.create({
        key:'explod',
        frames: this.anims.generateFrameNumbers('explosion'),
        frameRate:20,// 1sec me 20 aur hamre pass 5 hai toh 40 aayenge
        hideOnComplete:true//yeh explode hone ke marks hide karega
    })
    this.physics.add.collider(this.jet,this.coins,this.collectCoins,null,this);
    this.physics.add.collider(this.jet,this.bombs,this.endGame,null,this);

    //adding the audio
    this.gunShot=this.sound.add('gun-shot');
    this.coinHit=this.sound.add('coinhit');
    this.scoreText=this.add.text(15,15,'Score : 0',{fontSize:35,fill:'#ff0000'});
    this.endgame=this.sound.add('endgame');
}
 collectCoins(jet,coin){
    coin.disableBody(true,true);
    let x=Phaser.Math.Between(0,config.width-15);
    
    coin.enableBody(true,x,0,true,true);
    let xVel=Phaser.Math.Between(-100,100);
    let yVel=Phaser.Math.Between(150,200);
    coin.setVelocity(xVel,yVel);
    this.score+=10;
    this.scoreText.setText('Score :'+ this.score);



}
setObjVelocity(bombs){
    bombs.children.iterate(function(bomb){
        let xVel=Phaser.Math.Between(-100,100);
        let yVel=Phaser.Math.Between(150,200);
        bomb.setVelocity(xVel,yVel);

    })
}
 shoot(){
    this.ammo=this.physics.add.image(this.jet.x,this.jet.y,'ammo').setScale(0.1);
    this.ammo.setRotation(-Phaser.Math.PI2/4);// - means anticlockwise direction(by default PI2 ata hai)
    this.ammo.setVelocityY(-600);
    this.physics.add.collider(this.ammo,this.bombs,this.destroyBomb,null,this);//check kar rhe collision ammo aur bomb ka (collider add kiya)
    // null- abhi yeh kuch nhi kar raha means check nhi kar raha ki collision hua ki nhi
            //hum isme function use krke check kar skte aur wo function hamhe true ya false return krega 
}
destroyBomb(ammo,bomb){
    this.explosion=this.add.sprite(this.bomb.x,this.bomb.y,'explosion').setScale(4);
    this.explosion.play('explod');
    this.gunShot.play();
    this.ammo.disableBody(true,true);// do true kyuki hide bhi ho jaye aur disable bhi ho jaye
    this.bomb.disableBody(true,true);
    let x=Phaser.Math.Between(0,config.width-15);
    
    this.bomb.enableBody(true,x,0,true,true);//1st true is for reset,2nd for enable,3rd for show,aur x position pe set kr do
    let xVel=Phaser.Math.Between(-100,100);
    let yVel=Phaser.Math.Between(150,200);
    this.bomb.setVelocity(xVel,yVel);
    this.score+=8;
    this.scoreText.setText('Score :'+ this.score);
}

 update(){
    if(this.gameOver && !this.endgame.isPlaying){
        this.scene.start('EndGame',{totalScore:this.score})
    }
    this.sky.tilePositionY -=1;
    
    if(this.cursors.left.isDown){
        this.jet.setVelocityX(-150);
    }
    else if(this.cursors.right.isDown){
        this.jet.setVelocityX(150);
    }
    else{
        this.jet.setVelocityX(0);
    }

    if(this.cursors.up.isDown){
        this.jet.setVelocityY(-150);
    }
    else if(this.cursors.down.isDown){
        this.jet.setVelocityY(150);
    }
    else{
        this.jet.setVelocityY(0);
    }
    this.checkForRepos(this.bombs);
    this.checkForRepos(this.coins);
}
 checkForRepos(bombs){
     let game=this;
    bombs.children.iterate(function(bomb){
        if(bomb.y>config.height){
            game.resetPos(bomb);
        }
    })
}
resetPos(bomb){
    bomb.y=0;
    let randomX=Phaser.Math.Between(15,config.width-15);
    bomb.x=randomX;

}
 endGame(jet,bomb){
    this.physics.pause();
    this.jet.setTint(0xff0000)
    this.gameOver=true;
    this.endgame.play()
}
}
