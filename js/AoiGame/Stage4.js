BasicGame.Stage4=function(){};
BasicGame.Stage4.prototype={
	init:function () { 
		this.isPlaying=!1;
		this.beforeTime=this.mashCount=0;
		this.score=this.M.getGlobal('stage3Score');
		this.ModeInfo=this.M.getConf('ModeInfo')[this.M.getGlobal('curMode')];
		this.targetMoveTimer=this.ModeInfo.st4TimerInterval*.5;
		this.HowToTextSprite=this.TargetBtnSprite=this.CounterTextSprite=this.Hiyoko=
		this.StartClickTextSprite=this.StartTextSprite=this.ScoreTextSprite=null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.setGlobal('stage4Score',0);
		this.add.sprite(0,0,'Bg_'+this.rnd.integerInRange(1,this.M.getConst('BG_COUNT')));
		this.CounterTextSprite=this.M.S.genText(this.world.centerX,this.world.centerY+100,0,this.M.S.BaseTextStyle(250));
		this.CounterTextSprite.hide();
		this.TargetBtnSprite=this.add.button(this.world.centerX,this.world.centerY,'Target',this.mash,this);
		this.TargetBtnSprite.anchor.setTo(.5);
		this.HowToTextSprite=this.M.S.genText(this.world.centerX,90,'キクノジョーを100回\n'+this.M.getConst('TOUCH_OR_CLICK')+'してね！',this.M.S.BaseTextStyleS(30));
		this.StartClickTextSprite=this.M.S.genText(this.world.centerX, this.world.centerY,this.M.getConst('TOUCH_OR_CLICK')+'してスタート',this.M.S.BaseTextStyleS(30));
		this.StartTextSprite=this.M.S.genText(this.world.centerX,this.world.centerY,'スタート',this.M.S.BaseTextStyleS(60));
		this.StartTextSprite.setScale(0,0);
		this.StartTextSprite.addTween('popUpB',{delay:300});
		this.ScoreTextSprite=this.M.S.genText(this.world.centerX,this.world.height-50,'スコア: '+this.score,this.M.S.BaseTextStyleS(25));
		this.ScoreTextSprite.hide();
		this.Hiyoko=this.add.sprite(this.world.width+120,this.world.centerY,'Hiyoko');
		this.Hiyoko.anchor.setTo(.5);
		this.time.events.add(800,function(){
			this.input.onDown.addOnce(this.start,this);
		},this);
		this.test();
	},

	update: function () {
		if (this.isPlaying) {
			if (this.targetMoveTimer<0) {
				this.targetMoveTimer=this.ModeInfo.st4TimerInterval;
				this.TargetBtnSprite.x=this.world.randomX*.8+this.world.centerX*.1;
				this.TargetBtnSprite.y=this.world.randomY*.8+this.world.centerY*.1;
			}
			this.targetMoveTimer-=this.time.elapsed;
		}
	},

	mash: function (btnSprite,pointer) {
		if (this.isPlaying) {
			this.M.SE.play('Mash',{volume:1});
			this.mashCount++;
			this.CounterTextSprite.changeText(this.mashCount);
			if(this.mashCount>=100) return this.end();
			var addScore=800-(this.time.time-this.beforeTime);
			addScore<=300&&(addScore=300);
			addScore*=.01;
			this.score+=Math.floor(addScore*addScore*addScore*2.5*this.ModeInfo.scoreRate);
			this.ScoreTextSprite.changeText('スコア: '+this.M.H.formatComma(this.score));
			this.appearHiyoko();
			this.beforeTime=this.time.time;
		}
	},

	appearHiyoko:function(){
		if(this.rnd.between(0,100)<1){
			if(this.Hiyoko.x>this.world.width){
				var tween=this.M.T.moveB(this.Hiyoko,{xy:{x:-this.Hiyoko.width},duration:3000});
				this.M.T.onComplete(tween,function(){
					this.Hiyoko.x=this.world.width+this.Hiyoko.width;
				},this);
				tween.start();
			}
		}
	},

	start: function () {
		this.M.SE.play('WhistleStart',{volume:1});
		this.StartClickTextSprite.hide();
		this.StartTextSprite.startTween('popUpB');
		this.M.T.onComplete(this.StartTextSprite.multipleTextTween.popUpB,function(){
			this.time.events.add(500,function(){
				this.isPlaying=!0;
				this.beforeTime=this.time.time;
				this.StartTextSprite.Udestroy();
				this.CounterTextSprite.show();
				this.ScoreTextSprite.show();
				this.HowToTextSprite.addTween('fadeOutA',{duration:2000});
				this.HowToTextSprite.startTween('fadeOutA');
			},this);
		});
	},

	end: function () {
		this.isPlaying=!1;
		this.M.SE.play('WhistleEnd',{volume:1});
		this.M.setGlobal('stage4Score',this.score);
		var textSprite=this.M.S.genText(this.world.centerX,this.world.centerY+30,'終了！！',this.M.S.BaseTextStyleS(70));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{delay:300});
		this.M.T.onComplete(textSprite.multipleTextTween.popUpB,function(){
			this.time.events.add(500,function(){
				this.M.NextScene('Result');
			},this);
		});
		textSprite.startTween('popUpB');
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
			if (this.M.SE.isPlaying('PlayBGM')) return;
			this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
		}
	},
};
