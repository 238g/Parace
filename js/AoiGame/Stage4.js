BasicGame.Stage4=function(){};
BasicGame.Stage4.prototype={
	init:function () { 
		this.isPlaying=!1;
		this.targetMoveTimer=this.score=this.beforeTime=this.mashCount=0;
		this.ModeInfo=this.M.getConf('ModeInfo')[0]; // TODO del
		// this.ModeInfo=this.M.getConf('ModeInfo')[this.M.getGlobal('curMode')];
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.playBGM();
		this.TargetBtnSprite=this.add.button(0,0,'Target',this.mash,this);
		this.TargetBtnSprite.anchor.setTo(.5);
		// this.TargetBtnSprite.kill();
		this.start(); // TODO del
		this.test();
	},

	update: function () {
		if (this.isPlaying) {
			if (this.targetMoveTimer<0) {
				this.targetMoveTimer=this.ModeInfo.st4TimerInterval;
				this.TargetBtnSprite.x=this.world.randomX*.8+this.world.centerX*.1;
				this.TargetBtnSprite.y=this.world.randomY*.8+this.world.centerY*.1;
				console.log(this.score);
			}
			this.targetMoveTimer-=this.time.elapsed;
		}
	},

	playBGM: function () {
		return; // TODO
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
	},

	mash: function (btnSprite,pointer) {
		if (this.isPlaying) {
			this.mashCount++;
			if(this.mashCount>=100) return this.end();
			var addScore=800-(this.time.time-this.beforeTime);
			addScore<=100&&(addScore=100);
			this.score+=(addScore*this.ModeInfo.scoreRate);
			this.beforeTime=this.time.time;
		}
	},

	start: function () {
		this.isPlaying=!0;
		this.beforeTime=this.time.time;
	},

	end: function () {
		this.isPlaying=!1;
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
