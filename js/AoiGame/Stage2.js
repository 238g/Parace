BasicGame.Stage2=function(){};
BasicGame.Stage2.prototype={
	init:function () { 
		this.isPlaying=!1;
		this.startTime=this.getTargetCount=0;
		this.goalCount=30;
		this.CounterTextSprite=this.StartTextSprite=null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.setGlobal('stage1Score',0);
		this.playBGM();
		this.CounterTextSprite=this.M.S.genText(this.world.centerX,this.world.centerY,0,this.M.S.BaseTextStyle(250));
		this.CounterTextSprite.hide();
		this.genTargetContainer();
		// TODO グンパワー?
		this.StartTextSprite=this.M.S.genText(this.world.centerX,this.world.centerY,'キクノパワー集め\nスタート',this.M.S.BaseTextStyleS(60));
		this.StartTextSprite.setScale(0,0);
		this.StartTextSprite.addTween('popUpB',{delay:300});
		this.M.T.onComplete(this.StartTextSprite.multipleTextTween.popUpB,this.start);
		this.StartTextSprite.startTween('popUpB');
		this.test();
	},

	genTargetContainer: function () {
		for (var i=0;i<5;i++) {
			var btnSprite=this.add.button(
				this.world.randomX*.8+this.world.centerX*.1,
				this.world.randomY*.8+this.world.centerY*.1,
				'Target',this.catch,this);
			btnSprite.anchor.setTo(.5);
			btnSprite.scale.setTo(0);
			this.M.T.popUpB(btnSprite,{duration:500,delay:i*360}).start();
		}
	},

	catch: function (btnSprite) {
		if (this.isPlaying&&btnSprite.scale.x==1) {
			this.getTargetCount++;
			this.CounterTextSprite.changeText(this.getTargetCount);
			btnSprite.scale.setTo(0);
			btnSprite.x=this.world.randomX*.8+this.world.centerX*.1;
			btnSprite.y=this.world.randomY*.8+this.world.centerY*.1;
			btnSprite.inputEnabled=!1;
			if (this.getTargetCount>=this.goalCount) return this.end();
			var tween=this.M.T.popUpB(btnSprite,{duration:500});
			tween.onComplete.add(function(){this.inputEnabled=!0;},btnSprite);
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
		this.time.events.add(500,function(){
			this.isPlaying=!0;
			this.StartTextSprite.Udestroy();
			this.CounterTextSprite.show();
			this.startTime=this.time.time;
		},this);
	},

	end: function () {
		this.isPlaying=!1;
		var score=90000-(this.time.time-this.startTime);//Limit90s
		score<=0&&(score=0);
		this.M.setGlobal('stage1Score',score);
		//TODO dialog?
		var textSprite=this.M.S.genText(this.world.centerX,this.world.centerY,'キクノパワーが\n集まった！\n次へ進む',this.M.S.BaseTextStyleS(50));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{delay:300});
		this.M.T.onComplete(textSprite.multipleTextTween.popUpB,function(){
			this.input.onDown.add(function(){this.M.NextScene('Stage3');},this);
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
