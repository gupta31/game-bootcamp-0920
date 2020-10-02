class EndGameScene extends Phaser.Scene {
    constructor() {
        super('EndGame')
    }

    init(data) {
        this.score = data.totalScore;
    }

    preload() {
        this.load.image('end-game', 'assets/images/game-end.jpeg')
        this.load.image('playagain','assets/playagain.png')
    }

    create() {
        this.add.image(400, 300, 'end-game').setScale(0.7)
        this.startagainbtn = this.add.image(390,560,'playagain').setScale(0.4)
        this.startagainbtn.setInteractive();
        this.add.text(180, 50, 'Your Score : ' + this.score, { fontSize: 48 })
        
        this.startagainbtn.on('pointerdown',this.againstartGame,this)
    }
    againstartGame(){
        this.scene.start('PlayA');
    }
}