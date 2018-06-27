BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.inputEnabled=this.isPlaying=!1;
		this.curMode=this.M.getGlobal('curMode');
		this.leftTime=180;
		this.msTimer=1E3;
		this.score=0;
		this.enemiesCount=100;
		//// Obj
		this.StartTxtSprite=
		this.BrokenGlasses=this.curTween=
		this.TutSprite=this.TimeTxtSprite=this.ScoreTxtSprite=
		this.Enemies=this.TiredBtnSprite=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		'FREE'==this.curMode?this.freeContents():this.scoreContents();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.msTimer-=this.time.elapsed;
			if(this.msTimer<0){
				this.msTimer=1E3;
				this.leftTime--;
				if(this.leftTime<=0){
					this.TimeTxtSprite.changeText('制限時間: '+0);
					this.end();
				}else{
					this.TimeTxtSprite.changeText('制限時間: '+this.leftTime);
				}
				this.respownEnemy();
			}
		}
	},
	freeContents:function(){
		var charSprie=this.add.sprite(0,0,'Asahi_1');
		this.curTween=this.add.tween(charSprie);
		this.curTween.to({x:'+2'},50,null,!1,0,3,!0);
		this.BrokenGlasses=this.add.sprite(0,0,'BrokenGlasses',0);
		charSprie.addChild(this.BrokenGlasses);
		this.M.S.BasicGrayLabelM(this.world.width*.25,this.world.height*.95,this.back,'戻る',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		this.M.S.BasicGrayLabelM(this.world.width*.75,this.world.height*.95,this.freeModeTweet,'ツイート',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		this.ScoreTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.05,'粉砕数: '+this.score,this.M.S. BaseTextStyleS(30));
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
		var clickRange=this.add.button(this.world.centerX,this.world.height*.3,'',this.breakGlasses,this);
		clickRange.width=this.world.width*.5;
		clickRange.height=this.world.height*.4;
		clickRange.anchor.setTo(.5);
	},
	back:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			this.M.NextScene('Title');
		}
	},
	breakGlasses:function(){
		if(!this.curTween.isRunning){
			this.BrokenGlasses.frame+=1;
			if(this.BrokenGlasses.frame==0){
				this.score++;
				this.ScoreTxtSprite.changeText('粉砕数: '+this.M.H.formatComma(this.score));
				this.M.SE.play('RepairGlasses',{volume:1});
				// TODO fly broken glasses
			}else{
				this.M.SE.play('BreakGlasses_1',{volume:1});
			}
			this.curTween.start();
		}
	},
	freeModeTweet:function(){
		var text =  '『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
					+'👓👓👓👓👓👓\n'
					+'フリースタイルラップメガネ\n'
					+'粉砕数: '+this.M.H.formatComma(this.score)+'\n'
					+'🎤🎤🎤🎤🎤🎤\n';
		var hashtags='クソメガネゲー';
		var url=location.href;
		this.M.H.tweet(text,hashtags,url);
	},
	scoreContents:function(){
		this.genEnemies();
		this.TimeTxtSprite=this.M.S.genTextM(this.world.width*.75,this.world.height*.95,'制限時間: '+this.leftTime,this.M.S. BaseTextStyleS(30));
		this.ScoreTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.05,'スコア: '+this.score,this.M.S. BaseTextStyleS(30));
		this.TiredBtnSprite=this.M.S.BasicGrayLabelM(this.world.width*.25,this.world.height*.95,function(){
			if(this.isPlaying){
				this.leftTime-=10;
				if(this.leftTime<0){
					this.leftTime=0;
				}else{
					this.score+=1000;
					this.ScoreTxtSprite.changeText('スコア: '+this.M.H.formatComma(this.score));
					this.TimeTxtSprite.changeText('制限時間: '+this.leftTime);
				}
			}
		},'面倒',this.M.S. BaseTextStyleS(30));
		this.M.getGlobal('endTut')?this.start():this.tut();
	},
	genEnemies:function(){
		this.Enemies=this.add.group();
		this.Enemies.createMultiple(this.enemiesCount,'Asahi_1');
		this.Enemies.forEach(function(c){
			var s=this.add.sprite(0,0,'BrokenGlasses',0);
			c.addChild(s);
			var clickRange=this.add.button(c.centerX,c.centerY,'',this.breakGlassesScore,this);
			clickRange.width=c.width*.5;
			clickRange.height=c.height*.8;
			clickRange.anchor.setTo(.5);
			c.addChild(clickRange);
 		},this);
	},
	respownEnemy:function(){
		var enemy=this.Enemies.getFirstDead();
		if(enemy){
			enemy.scale.setTo(this.rnd.between(15,50)*.01);
			enemy.reset(this.world.randomX-enemy.width*.5,this.world.randomY-enemy.height*.5);
		}
		if((this.enemiesCount-1)==this.Enemies.countDead()){
			this.respownEnemy();
			this.respownEnemy();
		}
	},
	breakGlassesScore:function(btn){
		// TODO score
		var parent=btn.parent;
		var glasses=parent.getChildAt(0);
		glasses.frame+=1;
		if(glasses.frame==0){
			parent.kill();
			// TODO SE
			if((this.enemiesCount-1)==this.Enemies.countDead()){
				this.respownEnemy();
				this.respownEnemy();
			}
		}else{
			this.M.SE.play('BreakGlasses_1',{volume:1});
		}
	},
	tut:function(){
		this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
		this.TutSprite.anchor.setTo(.5);
		this.TutSprite.tint=0x000000;
		this.input.onDown.addOnce(function(){
			this.TutSprite.destroy();
			this.start();
		},this);
		var txt='3分間メガネを割り続けろ！';
		var t=this.M.S.genTextM(0,0,txt,this.M.S.BaseTextStyleS(25));
		this.TutSprite.addChild(t);
	},
	start:function(){
		this.StartTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.centerY,'スタート！',this.M.S.BaseTextStyleS(60));
		this.StartTxtSprite.anchor.setTo(.5);
		this.StartTxtSprite.scale.setTo(0);
		var tween=this.M.T.popUpB(this.StartTxtSprite);
		tween.onComplete.add(function(){
			this.StartTxtSprite.destroy();
			this.isPlaying=!0;
		},this);
		tween.start();
	},
	end:function(){
		this.isPlaying=!1;
		this.genResPopUp();
	},
	genResPopUp:function(){
		var ts=this.M.S.genTextM(this.world.centerX,this.world.centerY,'バルス！',this.M.S.BaseTextStyleS(80));
		ts.anchor.setTo(.5);
		ts.scale.setTo(0);
		var tween=this.M.T.popUpB(ts);
		tween.onComplete.add(function(){
			this.Enemies.killAll();
			var twp=this.add.sprite(0,0,'TWP');
			twp.tint=0x000000;
			twp.alpha=0;
			var tween=this.M.T.fadeInA(twp,{delay:500,duration:800,alpha:1});
			tween.onComplete.add(this.genRes,this);
			tween.start();
		},this);
		tween.start();
	},
	genRes:function(){
		var resTextStyle=this.M.S.BaseTextStyleS(50);
		resTextStyle.align='center';
		var textStyle=this.M.S.BaseTextStyleSS(30);
		var upperY=this.world.height*.6;
		var middleY=this.world.height*.7;
		var leftX=this.world.width*.25;
		var rightX=this.world.width*.75;
		this.genResTxtSprite(this.world.centerX,this.world.height*.15,'結果',resTextStyle,0);
		this.genResTxtSprite(this.world.centerX,this.world.height*.4,'スコア: \n'+this.M.H.formatComma(this.score),resTextStyle,0);
		textStyle=this.M.S.BaseTextStyleSS(25);
		this.genResBtnSprite(leftX,upperY,function(){
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			this.M.NextScene('Play');
		},'ワンモア',textStyle,150);
		this.genResBtnSprite(rightX,upperY,this.scoreModeTweet,'結果をツイート',textStyle,300);
		this.genResBtnSprite(leftX,middleY,function(){
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			this.M.NextScene('Title');
		},'タイトルへ',textStyle,450);
		this.genResBtnSprite(rightX,middleY,function(){
			if (this.game.device.desktop) {
				window.open(BasicGame.MY_GAMES_URL,'_blank');
			} else {
				location.href=BasicGame.MY_GAMES_URL;
			}
		},'他のゲーム',textStyle,600);
		this.genYtSprite(this.world.centerX,this.world.height*.85,750);
	},
	genResTxtSprite:function(x,y,txt,ts,d){
		var t=this.M.S.genTextM(x,y,txt,ts);
		t.scale.setTo(0);
		this.M.T.popUpB(t,{duration:800,delay:d}).start();
	},
	genResBtnSprite:function(x,y,func,txt,ts,d){
		var b=this.M.S.BasicGrayLabelS(x,y,func,txt,ts,{tint:BasicGame.MAIN_TINT});
		b.scale.setTo(0);
		this.M.T.popUpB(b,{duration:800,delay:d}).start();
	},
	genYtSprite:function(x,y,d){
		var yt=this.add.button(x,y,'Channel',function(){
			if (this.game.device.desktop) {
				window.open(BasicGame.YOUTUBE_URL,'_blank');
			} else {
				location.href=BasicGame.YOUTUBE_URL;
			}
		},this);
		yt.anchor.setTo(.5);
		yt.scale.setTo(0);
		this.M.T.popUpB(yt,{duration:800,delay:d}).start();
	},
	scoreModeTweet:function(){
		var text =  '『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
					+'👓👓👓👓👓👓\n'
					+'MCバトルラップメガネ\n'
					+'スコア: '+this.M.H.formatComma(this.score)+'\n'
					+'🎤🎤🎤🎤🎤🎤\n';
		var hashtags='クソメガネゲー';
		var url=location.href;
		this.M.H.tweet(text,hashtags,url);
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
			this.M.H.getQuery('time')&&(this.leftTime=this.M.H.getQuery('time'));
		}
	},
};
