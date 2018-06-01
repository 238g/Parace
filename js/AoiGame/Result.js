BasicGame.Result = function () {};
BasicGame.Result.prototype = {
	init: function(){
		this.score=this.M.getGlobal('stage4Score');
		this.ScoreTextSprite=this.TargetSprite=
		this.FadeSprite=null;
	},
	create: function () {
		this.time.events.removeAll();
		this.playBGM();
		this.TargetSprite=this.add.sprite(this.world.centerX,100,'Target');
		this.TargetSprite.anchor.setTo(.5);
		this.TargetSprite.visible=!1;
		this.ScoreTextSprite=this.M.S.genText(this.world.centerX,this.world.height-50,0,this.M.S.BaseTextStyleS(30));
		this.ScoreTextSprite.baseScoreText='距離: ';
		this.ScoreTextSprite.hide();
		this.step1FirstAnimation();


		this.FadeSprite=this.add.sprite(this.world.centerX,this.world.centerY,'WhitePaper');
		this.FadeSprite.anchor.setTo(.5);
		this.FadeSprite.tint=0x000000;
		this.FadeSprite.alpha=0;
	},

	step1FirstAnimation:function(){
		// TODO
		var sprite=this.add.sprite(200,200,'Wheel'); // TODO del
		this.time.events.add(300,function(){
			this.fade(function(){
				sprite.destroy(); // TODO del
			},this.step2Underground);
		},this);
	},

	step2Underground:function(){
		this.ScoreTextSprite.show();
		this.TargetSprite.visible=!0;
		var duration=500;
		this.numericTween(this.ScoreTextSprite,0,3456,duration);
		var tween=this.M.T.moveB(this.TargetSprite,{xy:{y:this.world.height+50},duration:duration});
		this.M.T.onComplete(tween,function(){
			this.fade(function(){
				// TODO delete this page object
			},this.step3OnTheGround);
		});
		tween.start();
	},

	step3OnTheGround:function(){
		var duration=500;
		this.numericTween(this.ScoreTextSprite,3456,7889,duration);
		var tween=this.M.T.moveB(this.TargetSprite,{xy:{y:this.world.centerY},duration:duration});
		this.M.T.onComplete(tween,function(){
			this.fade(function(){
				// TODO delete this page object
				this.TargetSprite.x=0;
				this.TargetSprite.y=this.world.height;
				this.TargetSprite.scale.setTo(2);
			},this.step4Sky);
		});
		tween.start();
	},

	step4Sky:function(){
		this.ScoreTextSprite.baseScoreText='飛距離: ';
		var duration=500;
		this.numericTween(this.ScoreTextSprite,7889,222222,duration);
		this.M.T.moveB(this.TargetSprite,{xy:{x:this.world.width*.8,y:this.world.height*.2},duration:duration}).start();
		var tween = this.M.T.moveB(this.TargetSprite.scale,{xy:{x:.001,y:.001},duration:duration});
		this.M.T.onComplete(tween,this.result);
		tween.start();
	},

	result:function(){
		this.TargetSprite.scale.setTo(4);
		this.TargetSprite.alpha=0;
		this.M.T.fadeInA(this.TargetSprite,{alpha:.5}).start();


		// 'ボーナスアイテム';
	},

	fade:function(inCompFunc,outCompFunc){
		var tween=this.M.T.fadeInA(this.FadeSprite,{duration:800});
		this.M.T.onComplete(tween,inCompFunc);
		this.M.T.onComplete(tween,function(){
			var tween=this.M.T.fadeOutA(this.FadeSprite,{duration:800});
			this.M.T.onComplete(tween,outCompFunc);
			tween.start();
		});
		tween.start();
	},

	numericTween:function(obj,startVal,endVal,time){
		var scoreValue={};
		scoreValue.score=startVal;
		var scoreTween=this.add.tween(scoreValue).to({score:endVal},time);
		scoreTween.onUpdateCallback(function(tween){
			this.changeText(obj.baseScoreText+Math.floor(tween.target.score));
		},obj);
		scoreTween.onComplete.add(function(){
			this.changeText(obj.baseScoreText+endVal);
		},obj);
		scoreTween.start();
	},

	playBGM: function () {
		return; // TODO
		if(this.M.SE.isPlaying('TitleBGM'))return;
		this.M.SE.stop('currentBGM');
		this.M.SE.play('TitleBGM',{isBGM:!0,loop:!0,volume:1});
	},
};
