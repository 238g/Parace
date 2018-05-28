BasicGame.Stage2=function(){};
BasicGame.Stage2.prototype={
	init:function () { 
		////////// Val
		this.isPlaying=!1;
		this.isMovingPointer=!1;
		////////// Obj
	},

	create:function () {
		this.time.events.removeAll();
		this.playBGM();
		
		this.gaugeRight = this.world.centerX*1.5;
		this.gaugeLeft = this.world.centerX*.5;
		this.gaugeLength = this.gaugeRight-this.gaugeLeft;
		this.gaugeHalfLength = this.gaugeLength*.5;

		/////
		this.M.S.genBmpSprite(this.gaugeLeft,this.world.centerY-50,this.gaugeLength,100,'#00ff00');
		this.M.S.genBmpSprite(this.gaugeLeft,this.world.centerY-50,this.gaugeLength*.5,100,'#ff0000');
		/////
		this.isMovingPointer=!0;


		this.GaugePointer = this.add.sprite(this.world.centerX,this.world.centerY,'Particle');
		this.GaugePointer.anchor.setTo(.5);
		this.movePointerX = 1;

		this.input.onDown.add(function(){
			if(this.isMovingPointer) {
				var x = Math.abs(this.GaugePointer.x-this.world.centerX);
				// OR (this.gaugeRight+this.gaugeLeft)*.5
				this.isMovingPointer=!1;
				console.log(this.gaugeHalfLength-x);
			}
		},this);


		this.start(); // TODO del
		this.test();
	},

	update: function () {
		if (this.isPlaying) {
			if (this.isMovingPointer) {
				this.GaugePointer.x+=this.movePointerX;
				if (this.GaugePointer.x>this.gaugeRight) {
					this.movePointerX=-1;
				}
				if (this.GaugePointer.x<this.gaugeLeft) {
					this.movePointerX=1;
				}
			}
		}
	},

	TimeManager: function () {
		if (this.countdownTimer<0) {
			this.countdownTimer=1E3;
			this.countdown--;
		}
		this.countdownTimer-=this.time.elapsed;
	},

	playBGM: function () {
		return; // TODO
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
	},

	start: function () {
		if (this.isPlaying==0) {
			this.isPlaying=!0;
		}
	},

	renderT: function () {
		// this.game.debug.geom(this.BladeLine);
		// for (var key in this.Targets.children) this.game.debug.body(this.Targets.children[key]);
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.stage.backgroundColor=BasicGame.WHITE_COLOR;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end('clear');},this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(function(){this.end('gameOver');},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
