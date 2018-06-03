BasicGame.Stage2=function(){};
BasicGame.Stage2.prototype={
	init:function () { 
		this.isPlaying=!1;
		this.beforeTime=this.getTargetCount=this.score=0;
		this.ModeInfo=this.M.getConf('ModeInfo')[this.M.getGlobal('curMode')];
		this.goalCount=30;
		this.CounterTextSprite=this.HowToTextSprite=this.Hiyoko=
		this.StartClickTextSprite=this.StartTextSprite=this.ScoreTextSprite=null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.setGlobal('stage2Score',0);
		this.add.sprite(0,0,'Bg_'+this.rnd.integerInRange(1,this.M.getConst('BG_COUNT')));
		this.playBGM();
		this.CounterTextSprite=this.M.S.genText(this.world.centerX,this.world.centerY+100,0,this.M.S.BaseTextStyle(250));
		this.CounterTextSprite.hide();
		this.genTargetContainer();
		this.HowToTextSprite=this.M.S.genText(this.world.centerX,60,'キクノジョーを\n30体集めろ！',this.M.S.BaseTextStyleS(30));
		this.StartClickTextSprite=this.M.S.genText(this.world.centerX, this.world.centerY,this.M.getConst('TOUCH_OR_CLICK')+'してスタート',this.M.S.BaseTextStyleS(30));
		this.StartTextSprite=this.M.S.genText(this.world.centerX,this.world.centerY,'スタート',this.M.S.BaseTextStyleS(60));
		this.StartTextSprite.setScale(0,0);
		this.StartTextSprite.addTween('popUpB',{delay:300});
		this.ScoreTextSprite=this.M.S.genText(this.world.centerX,this.world.height-50,'スコア: 0',this.M.S.BaseTextStyleS(25));
		this.ScoreTextSprite.hide();
		this.Hiyoko=this.add.sprite(this.world.width+120,this.world.centerY,'Hiyoko');
		this.Hiyoko.anchor.setTo(.5);
		this.input.onDown.addOnce(this.start,this);
		this.test();
	},

	genTargetContainer: function () {
		for (var i=0;i<5;i++) {
			var btnSprite=this.add.button(
				this.world.randomX*.8+this.world.centerX*.1,
				this.world.randomY*.8+this.world.centerY*.1,
				'Target',this.catch,this);
			btnSprite.anchor.setTo(.5);
			btnSprite.scale.setTo(this.ModeInfo.st2Scale);
		}
	},

	catch: function (btnSprite) {
		if (this.isPlaying&&btnSprite.scale.x==this.ModeInfo.st2Scale) {
			this.M.SE.play('Catch',{volume:1});
			this.getTargetCount++;
			this.CounterTextSprite.changeText(this.getTargetCount);
			btnSprite.scale.setTo(0);
			if (this.getTargetCount>=this.goalCount) return this.end();
			btnSprite.x=this.world.randomX*.8+this.world.centerX*.1;
			btnSprite.y=this.world.randomY*.8+this.world.centerY*.1;
			btnSprite.inputEnabled=!1;
			var tween=this.M.T.popUpB(btnSprite,{duration:500,scale:{x:this.ModeInfo.st2Scale,y:this.ModeInfo.st2Scale}});
			tween.onComplete.add(function(){this.inputEnabled=!0;},btnSprite);
			tween.start();
			var addScore=3000-(this.time.time-this.beforeTime);
			addScore<=300&&(addScore=300);
			this.score+=Math.floor(addScore*this.ModeInfo.scoreRate);
			this.ScoreTextSprite.changeText('スコア: '+this.M.H.formatComma(this.score));
			this.appearHiyoko();
			this.beforeTime=this.time.time;
		}
	},

	appearHiyoko:function(){
		if(this.rnd.between(0,100)<5){
			if(this.Hiyoko.x>this.world.width){
				var tween=this.M.T.moveB(this.Hiyoko,{xy:{x:-this.Hiyoko.width},duration:3000});
				this.M.T.onComplete(tween,function(){
					this.Hiyoko.x=this.world.width+this.Hiyoko.width;
				},this);
				tween.start();
			}
		}
	},

	playBGM: function () {
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
	},

	start: function () {
		this.M.SE.play('WhistleStart',{volume:1});
		this.StartClickTextSprite.hide();
		this.StartTextSprite.startTween('popUpB');
		this.M.T.onComplete(this.StartTextSprite.multipleTextTween.popUpB,function(){
			this.time.events.add(500,function(){
				this.isPlaying=!0;
				this.StartTextSprite.Udestroy();
				this.HowToTextSprite.addTween('fadeOutA',{duration:2000});
				this.HowToTextSprite.startTween('fadeOutA');
				this.CounterTextSprite.show();
				this.beforeTime=this.time.time;
				this.ScoreTextSprite.show();
			},this);
		});
	},

	end: function () {
		this.isPlaying=!1;
		this.M.SE.play('WhistleEnd',{volume:1});
		this.M.setGlobal('stage2Score',this.score);
		var textSprite=this.M.S.genText(this.world.centerX,this.world.centerY,'キクノジョーが\n集まった！\n次へ進む',this.M.S.BaseTextStyleS(40));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{delay:300});
		this.M.T.onComplete(textSprite.multipleTextTween.popUpB,function(){
			this.input.onDown.addOnce(function(){
				this.M.SE.play('GetItem',{volume:1});
				this.M.NextScene('Stage3');
			},this);
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
