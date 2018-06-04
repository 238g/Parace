BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function () { 
		this.isPlaying=!1;
		this.rotationSpeed=2;

		this.CenterGroup=null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		this.playBGM();

		/*
		this.CenterGroup=this.add.group();
		this.CenterGroup.x=this.world.centerX;
		this.CenterGroup.y=this.world.height*.2;

		var circleSprite=this.M.S.genBmpCircleSprite(0,0,100,'#ff0000');
		circleSprite.anchor.setTo(.5);
		circleSprite.addChild(this.M.S.genBmpSprite(30,0,10,10,'#0000ff'));
		circleSprite.addChild(this.M.S.genBmpSprite(-30,0,10,10,'#00ff00'));
		this.CenterGroup.add(circleSprite);

		var bladeSprite=this.M.S.genBmpSprite(this.world.centerX,this.world.height*.8,10,100,'#00ff00');
		bladeSprite.anchor.setTo(.5);

		this.input.onDown.add(function(){
			bladeSprite.x=0;
			bladeSprite.y=50;
			this.CenterGroup.add(bladeSprite);
		},this);
		*/

		this.start();//TODO
		this.test();
	},

	update:function(){
		this.CenterGroup.angle+=this.time.physicsElapsedMS*.1*this.rotationSpeed;
	},

	playBGM: function () {
		return; // TODO
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
	},

	start: function () {
		this.isPlaying=!0;
	},

	end:function(){
		console.log('end');
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.stage.backgroundColor=BasicGame.WHITE_COLOR;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
