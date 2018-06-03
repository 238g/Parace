BasicGame.Result = function () {};
BasicGame.Result.prototype = {
	init: function(){
		this.score=this.M.getGlobal('stage4Score');
		this.score=450779;
		this.mvDuration1=2E3;
		this.mvDuration2=1E3;
		this.baseScoreText='距離: ';
		this.undergroundScore=Math.floor(this.score*.2);
		this.onTheGroundScore=Math.floor(this.score*.5);
		this.curMode=this.M.getGlobal('curMode');
		this.ModeInfo=this.M.getConf('ModeInfo')[this.curMode];
		this.ScoreTextSprite=this.TargetSprite=this.StartClickTextSprite=this.StartClickTextSprite2=
		this.FadeSprite=this.PushAnimSprite=this.PushAnim=this.AoiSPrite=
		this.UndergroundSprite=this.OnTheGroundSprite=this.Sky=null;
	},
	create: function () {
		this.time.events.removeAll();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		this.UndergroundSprite=this.add.sprite(0,0,'Underground');
		this.UndergroundSprite.visible=!1;
		this.OnTheGroundSprite=this.add.sprite(0,0,'OnTheGround');
		this.OnTheGroundSprite.visible=!1;
		this.Sky=this.add.sprite(0,0,'Sky');
		this.Sky.visible=!1;
		this.TargetSprite=this.add.sprite(this.world.centerX,-100,'Target');
		this.TargetSprite.anchor.setTo(.5);
		this.TargetSprite.visible=!1;
		this.AoiSPrite=this.add.sprite(-50,this.world.height,'Aoi_2');
		this.AoiSPrite.anchor.setTo(0,1);
		this.AoiSPrite.scale.setTo(.8);
		this.AoiSPrite.alpha=0;
		this.ScoreTextSprite=this.M.S.genText(this.world.centerX,this.world.height-30,0,this.M.S.BaseTextStyleS(30));
		this.ScoreTextSprite.hide();
		this.input.onDown.addOnce(this.step1FirstAnimation,this);
		this.PushAnimSprite=this.add.sprite(this.world.centerX,this.world.centerY,'PushAnim');
		this.PushAnimSprite.anchor.setTo(.5);
		this.PushAnim=this.PushAnimSprite.animations.add('pushAnim');
		this.StartClickTextSprite=this.M.S.genText(this.world.centerX, 50,'グンッする',this.M.S.BaseTextStyleS(60));
		this.StartClickTextSprite2=this.M.S.genText(this.world.centerX, this.world.height*.8,'↑ '+this.M.getConst('TOUCH_OR_CLICK')+'する',this.M.S.BaseTextStyleS(30));
		this.FadeSprite=this.add.sprite(this.world.centerX,this.world.centerY,'WhitePaper');
		this.FadeSprite.anchor.setTo(.5);
		this.FadeSprite.tint=0x000000;
		this.FadeSprite.alpha=0;
		this.test();
	},

	step1FirstAnimation:function(){
		this.M.SE.play('PushAnim',{volume:3});
		this.PushAnim.onComplete.add(function(){
			this.fade(function(){
				this.PushAnimSprite.visible=!1;
				this.StartClickTextSprite.hide();
				this.StartClickTextSprite2.hide();
				this.UndergroundSprite.visible=!0;
			},this.step2Underground);
		},this);
		this.PushAnim.play(12,false);
	},

	step2Underground:function(){
		this.ScoreTextSprite.show();
		this.TargetSprite.visible=!0;
		this.M.SE.play('Fall',{volume:1});
		this.numericTween(0,this.undergroundScore,this.mvDuration1);
		var tween=this.M.T.moveB(this.TargetSprite,{xy:{y:this.world.height+100},duration:this.mvDuration1});
		this.M.T.onComplete(tween,function(){
			this.fade(function(){
				this.UndergroundSprite.visible=!1;
				this.OnTheGroundSprite.visible=!0;
			},this.step3OnTheGround);
		});
		tween.start();
	},

	step3OnTheGround:function(){
		this.M.SE.play('Fly',{volume:1});
		this.numericTween(this.undergroundScore,this.onTheGroundScore,this.mvDuration1);
		var tween=this.M.T.moveB(this.TargetSprite,{xy:{y:-100},duration:this.mvDuration1});
		this.M.T.onComplete(tween,function(){
			this.fade(function(){
				this.OnTheGroundSprite.visible=!1;
				this.Sky.visible=!0;
				this.TargetSprite.x=0;
				this.TargetSprite.y=this.world.height;
				this.TargetSprite.scale.setTo(2);
			},this.step4Sky);
		});
		tween.start();
	},

	step4Sky:function(){
		this.M.SE.play('Fly',{volume:1});
		this.baseScoreText='飛距離: ';
		this.numericTween(this.onTheGroundScore,this.score,this.mvDuration2);
		this.M.T.moveB(this.TargetSprite,{xy:{x:this.world.width*.8,y:this.world.height*.2},duration:this.mvDuration2}).start();
		var tween = this.M.T.moveB(this.TargetSprite.scale,{xy:{x:.001,y:.001},duration:this.mvDuration2});
		this.M.T.onComplete(tween,this.result);
		tween.start();
	},

	result:function(){
		this.M.SE.play('FlyAway',{volume:1});
		this.TargetSprite.scale.setTo(4);
		this.TargetSprite.alpha=0;
		this.M.T.fadeInA(this.TargetSprite,{alpha:.5}).start();
		this.M.T.fadeInA(this.AoiSPrite,{alpha:1}).start();
		this.time.events.add(1200,function(){
			this.M.SE.play('DonPafu',{volume:1});
			this.genResultContainer();
		},this);
	},

	genResultContainer:function(){
		var x = 80;
		var y = 50;
		this.genResultLabel(x,y,'もういちど',function () {
			this.M.SE.play('OnBtn',{volume:1});
			this.M.NextScene('Stage1');
		},300);
		this.genResultLabel(x,y+50,'結果をツイート',this.tweet,600);
		this.genResultLabel(x,y+100,'タイトルへ',function () {
			this.M.SE.play('OnBtn',{volume:1});
			this.M.NextScene('Title');
		},900);
		this.genResultLabel(x,y+150,'他のゲーム',this.otherGame,1200);
	},

	genResultLabel:function (x,y,text,func,delay) {
		var btnSprite = this.M.S.BasicGrayLabelS(x,y,func,text,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		btnSprite.scale.setTo(0);
		this.M.T.popUpB(btnSprite,{duration:800,delay:delay,scale:{x:.8,y:.8}}).start();
	},

	tweet:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var modeText='モード: '+this.ModeInfo.tweetName;
		var resultText='キクノジョーの飛距離: '+this.M.H.formatComma(this.score);
		var emoji='';
		switch(this.curMode){
			case 0:emoji = '🌄🌄🌄🌄🌄🌄';break;
			case 1:emoji = '🐥🐥🐥🐥🐥🐥';break;
			case 2:emoji = '🌋🌋🌋🌋🌋🌋';break;
			case 3:emoji = '🗻🗻🗻🗻🗻🗻';break;
		}
		var text =  '『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
					+emoji+'\n'
					+modeText+'\n'
					+resultText+'\n'
					+emoji+'\n';
		var hashtags = '葵のゲーム,ノジョゲー';
		this.M.H.tweet(text,hashtags,location.href);
	},

	otherGame:function(){
		this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.MY_GAMES_URL,'_blank');
		} else {
			location.href = BasicGame.MY_GAMES_URL;
		}
	},

	fade:function(inCompFunc,outCompFunc){
		var tweenA=this.M.T.fadeInA(this.FadeSprite,{duration:500});
		this.M.T.onComplete(tweenA,inCompFunc);
		var tweenB=this.M.T.fadeOutA(this.FadeSprite,{duration:500});
		this.M.T.onComplete(tweenB,outCompFunc);
		tweenA.chain(tweenB);
		tweenA.start();
	},

	numericTween:function(startVal,endVal,time){
		var scoreValue={};
		scoreValue.score=startVal;
		var scoreTween=this.add.tween(scoreValue).to({score:endVal},time);
		scoreTween.onUpdateCallback(function(tween){
			this.ScoreTextSprite.changeText(this.baseScoreText+this.M.H.formatComma(Math.floor(tween.target.score)));
		},this);
		scoreTween.onComplete.add(function(){
			this.ScoreTextSprite.changeText(this.baseScoreText+this.M.H.formatComma(endVal));
		},this);
		scoreTween.start();
	},

	test: function () {
		if(__ENV!='prod'){
			// this.mvDuration1=200;
			// this.mvDuration2=200;
			// this.genResultContainer();
			if (this.M.SE.isPlaying('PlayBGM')) return;
			this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
		}
	},
};
