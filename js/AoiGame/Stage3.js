BasicGame.Stage3=function(){};
BasicGame.Stage3.prototype={
	init:function () { 
		this.isPlaying=this.isMovingPointer=!1;
		this.gaugeQuantity=5;
		this.score=0;
		this.ModeInfo=this.M.getConf('ModeInfo')[0]; // TODO del
		// this.ModeInfo=this.M.getConf('ModeInfo')[this.M.getGlobal('curMode')];
		this.pointerSpeed=this.ModeInfo.st3Speed;
		this.GaugeBgSprite=this.StartClickTextSprite=this.StartTextSprite=null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.setGlobal('stage3Score',0);
		this.playBGM();
		this.M.S.genText(this.world.centerX,90,'キクノジョーを\nゲージの真ん中で止めて\n力をたくわえよう！',this.M.S.BaseTextStyleS(30));
		this.GaugeBgSprite=this.add.sprite(this.world.centerX,this.world.centerY,'GaugeBg');
		this.GaugeBgSprite.anchor.setTo(.5);
		this.M.S.genBmpSprite(this.world.centerX-2,this.world.centerY,4,this.GaugeBgSprite.height+10,'#ff0000').anchor.setTo(.5);
		this.GaugePointer = this.add.sprite(this.GaugeBgSprite.left+20,this.world.centerY,'Pointer');
		this.GaugePointer.anchor.setTo(.5);
		this.movePointerX=this.time.physicsElapsedMS*.0625*this.pointerSpeed;
		this.StartClickTextSprite=this.M.S.genText(this.world.centerX, this.world.centerY,this.M.getConst('TOUCH_OR_CLICK')+'してスタート',this.M.S.BaseTextStyleS(30));
		this.StartTextSprite=this.M.S.genText(this.world.centerX,this.world.centerY,'スタート',this.M.S.BaseTextStyleS(60));
		this.StartTextSprite.setScale(0,0);
		this.StartTextSprite.addTween('popUpB',{delay:300});
		this.input.onDown.addOnce(this.start,this);
		this.test();
	},

	stopPointer: function () {
		if(this.isMovingPointer) {
			var x = Math.abs(this.GaugePointer.x-this.world.centerX);
			this.isMovingPointer=!1;
			var addScore=this.GaugeBgSprite.width-x;
			this.score+=addScore*this.ModeInfo.scoreRate;
			this.gaugeQuantity--;
			if (this.gaugeQuantity==0) {
				return this.end();
			} else {
				// TODO text animation
				this.time.events.add(500,function () {
					this.isMovingPointer=!0;
				}, this);
			}
		}
	},

	update: function () {
		if (this.isPlaying) {
			if (this.isMovingPointer) {
				if (this.GaugePointer.x>=this.GaugeBgSprite.right-this.movePointerX) {
					this.movePointerX=-this.time.physicsElapsedMS*.0625*this.pointerSpeed;
				}
				if (this.GaugePointer.x<=this.GaugeBgSprite.left-this.movePointerX) {
					this.movePointerX=this.time.physicsElapsedMS*.0625*this.pointerSpeed;
				}
				this.GaugePointer.x+=this.movePointerX;
			}
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
		this.StartClickTextSprite.hide();
		this.StartTextSprite.startTween('popUpB');
		this.M.T.onComplete(this.StartTextSprite.multipleTextTween.popUpB,function(){
			this.time.events.add(500,function(){
				this.isPlaying=!0;
				this.isMovingPointer=!0;
				this.StartTextSprite.Udestroy();
				this.input.onDown.add(this.stopPointer,this);
			},this);
		});
	},

	end: function () {
		this.isPlaying=!1;
		this.M.setGlobal('stage3Score',this.score);
		var textSprite=this.M.S.genText(this.world.centerX,this.world.centerY*1.7,'力をたくわえた！\n次へ進む',this.M.S.BaseTextStyleS(40));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{delay:300});
		this.M.T.onComplete(textSprite.multipleTextTween.popUpB,function(){
			this.input.onDown.addOnce(function(){this.M.NextScene('Stage4');},this);
		});
		textSprite.startTween('popUpB');
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
