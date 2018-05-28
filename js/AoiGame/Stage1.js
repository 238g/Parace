BasicGame.Stage1=function(){};
BasicGame.Stage1.prototype={
	init:function () { 
		this.isPlaying=!1;
		this.isMovingPointer=!1;
		this.startTime=0;
		this.getTargetCount=0;
		this.goalCount=30;
		////////// Obj
		this.Targets=this.counterTextSprite=
		null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor='#000000';
		this.playBGM();
		this.genTargetContainer();
		this.counterTextSprite=this.M.S.genText(50,50,0);
		this.start(); // TODO del
		this.test();
	},

	updateT: function () {
		if (this.isPlaying) {
		}
	},

	TimeManager: function () {
		if (this.countdownTimer<0) {
			this.countdownTimer=1E3;
			this.countdown--;
		}
		this.countdownTimer-=this.time.elapsed;
	},

	genTargetContainer: function () {
		this.Targets=this.add.group();
		for (var i=0;i<5;i++) {
			var btnSprite=this.add.button(
				this.world.randomX*.5+this.world.centerX*.5,
				this.world.randomY*.5+this.world.centerY*.5,
				'Target',this.catch,this);
			btnSprite.anchor.setTo(.5);
			btnSprite.scale.setTo(0);
			this.M.T.popUpB(btnSprite).start();
		}
	},

	catch: function (btnSprite) {
		if (btnSprite.scale.x==1) {
			if (this.getTargetCount>=this.goalCount) {
				var time=this.time.time-this.startTime;
				console.log(time*.001); // sec
			}
			this.getTargetCount++;
			this.counterTextSprite.changeText(this.getTargetCount);
			btnSprite.scale.setTo(0);
			btnSprite.x=this.world.randomX*.5+this.world.centerX*.5;
			btnSprite.y=this.world.randomY*.5+this.world.centerY*.5;
			btnSprite.inputEnabled=!1;
			var tween=this.M.T.popUpB(btnSprite);
			// XXXXXX this.M.T.onComplete(tween,function(b){b.inputEnabled=!0;});
			// TODO tween delay?duration 100?
			tween.start();
		}
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
			this.startTime = this.time.time;
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
