BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.inputEnabled=this.isPlaying=!1;
		this.curMode=this.M.getGlobal('curMode');
		this.leftTime=180;
		this.msTimer=1E3;
		this.score=0;
		this.enemiesCount=30;
		//// Obj
		this.StartTxtSprite=this.BrokenGlasses=this.shakeTween=this.moveTween=
		this.TutSprite=this.TimeTxtSprite=this.ScoreTxtSprite=
		this.Obstacles=this.Enemies=this.TiredBtnSprite=null;
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
		this.add.sprite(0,0,'Bg_1');
		var charSprie=this.add.sprite(0,0,'Asahi_1');
		this.shakeTween=this.add.tween(charSprie);
		this.shakeTween.to({x:'+2'},50,null,!1,0,3,!0);
		this.BrokenGlasses=this.add.sprite(0,0,'BrokenGlasses',0);
		charSprie.addChild(this.BrokenGlasses);
		this.M.S.BasicGrayLabelM(this.world.width*.25,this.world.height*.95,this.back,'戻る',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		this.M.S.BasicGrayLabelM(this.world.width*.75,this.world.height*.95,this.freeModeTweet,'ツイート',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		this.ScoreTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.05,'粉砕数: '+this.score,this.M.S. BaseTextStyleS(30));
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
		var clickRange=this.add.button(this.world.centerX,this.world.height*.45,'',this.breakGlasses,this);
		clickRange.width=this.world.width*.55;
		clickRange.height=this.world.height*.8;
		clickRange.anchor.setTo(.5);
		this.moveTween={isRunning:!1};
		this.genHUD();
	},
	back:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			this.M.NextScene('Title');
		}
	},
	breakGlasses:function(){
		if(!this.shakeTween.isRunning&&!this.moveTween.isRunning){
			this.BrokenGlasses.frame++;
			if(this.BrokenGlasses.frame==0){
				this.score++;
				this.ScoreTxtSprite.changeText('粉砕数: '+this.M.H.formatComma(this.score));
				this.M.SE.play('RepairGlasses',{volume:1});
				var s=this.add.sprite(this.BrokenGlasses.centerX,this.BrokenGlasses.height,'Glasses');
				s.anchor.setTo(.5,1);
				this.moveTween=this.M.T.moveB(s,{xy:{x:-this.world.centerX,y:this.world.centerY},duration:500});
				this.moveTween.start();
			}else{
				this.M.SE.play('BreakGlasses_1',{volume:1});
				this.shakeTween.start();
			}
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
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
	scoreContents:function(){
		this.add.sprite(0,0,'Bg_2');
		this.genEnemies();
		this.genObstacles();
		this.TimeTxtSprite=this.M.S.genTextM(this.world.width*.75,this.world.height*.95,'制限時間: '+this.leftTime,this.M.S. BaseTextStyleS(30));
		this.ScoreTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.05,'スコア: '+this.score,this.M.S. BaseTextStyleS(30));
		this.TiredBtnSprite=this.M.S.BasicGrayLabelM(this.world.width*.25,this.world.height*.95,function(){
			if(this.isPlaying){
				this.leftTime-=10;
				if(this.leftTime<0){
					this.leftTime=0;
				}else{
					this.score+=500;
					this.ScoreTxtSprite.changeText('スコア: '+this.M.H.formatComma(this.score));
					this.TimeTxtSprite.changeText('制限時間: '+this.leftTime);
				}
			}
		},'面倒',this.M.S. BaseTextStyleS(30));
		this.M.getGlobal('endTut')?this.start():this.tut();
	},
	genObstacles:function(){
		this.Obstacles=this.add.group();
		this.Obstacles.inputEnableChildren=!0;
		this.Obstacles.enableBody=!0;
		this.Obstacles.physicsBodyType=Phaser.Physics.ARCADE;
		this.Obstacles.createMultiple(3,['Asahi_2']);
		this.Obstacles.forEach(function(c){
			c.checkWorldBounds=!0;
			c.outOfBoundsKill=!0;
			c.anchor.setTo(.5);
 		},this);
		this.Obstacles.onChildInputDown.add(this.missBreak,this);
	},
	missBreak:function(btn){
		btn.kill();
		// TODO SE
		this.score-=30000;
		if(this.score<=0)this.score=0;
		this.ScoreTxtSprite.changeText('スコア: '+this.M.H.formatComma(this.score));
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
			var rndNum=this.rnd.between(1,100);
			if(rndNum<15){
				var speed=this.rnd.between(1,5);
				enemy.speed=speed;
				enemy.bonusScore=speed*speed;
				enemy.pivot.x=this.world.randomX;
				enemy.pivot.y=this.world.randomY;
				enemy.update=this.rotationEnemy;////Func
			}else if(rndNum<30){
				enemy.angle=this.rnd.angle();
				enemy.bonusScore=1;
			}else if(rndNum<45){
				var move=this.rnd.angle()*2;
				enemy.bonusScore=Math.abs(move*.1);
				enemy.tween=this.M.T.moveC(enemy,{xy:{x:move,y:move}});
				enemy.tween.start();
			}else{
				enemy.bonusScore=1;
				// var obstacle=this.Obstacles.getFirstDead();
				var obstacle=this.rnd.pick(this.Obstacles.children.filter(function(e){return!e.alive;}));
				if(obstacle){
					obstacle.scale.setTo(this.rnd.between(10,100)*.01);
					obstacle.reset(this.world.randomX,this.world.height);
					obstacle.body.gravity.y=-this.rnd.between(1,15)*this.time.physicsElapsedMS;
				}
			}
		}
		if((this.enemiesCount-1)==this.Enemies.countDead()){
			this.respownEnemy();
			this.respownEnemy();
		}
	},
	rotationEnemy:function(){
		this.angle+=(.03*this.game.time.physicsElapsedMS*this.speed);
	},
	breakGlassesScore:function(btn){
		var parent=btn.parent;
		var glasses=parent.getChildAt(0);
		var bonusScore=parent.bonusScore;
		var scaleRate=(1/parent.scale.x);
		glasses.frame++;
		if(glasses.frame==0){
			parent.kill();
			parent.update=function(){};
			parent.angle=0;
			parent.tween&&parent.tween.stop();
			// TODO SE
			this.score+=parseInt(scaleRate*scaleRate*bonusScore*150);
		}else{
			this.M.SE.play('BreakGlasses_1',{volume:1});
			this.score+=parseInt(glasses.frame*scaleRate*scaleRate*bonusScore*30);
		}
		this.ScoreTxtSprite.changeText('スコア: '+this.M.H.formatComma(this.score));
	},
	tut:function(){
		this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
		this.TutSprite.anchor.setTo(.5);
		this.TutSprite.tint=0x000000;
		this.input.onDown.addOnce(function(){
			this.TutSprite.destroy();
			this.start();
		},this);
		var txt='3分間\nメガネを\n割り続けろ';
		var ts=this.M.S.BaseTextStyleS(50);
		ts.align='center';
		var t=this.M.S.genTextM(0,0,txt,ts);
		this.TutSprite.addChild(t);
	},
	start:function(){
		this.StartTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.centerY,'スタート！',this.M.S.BaseTextStyleS(60));
		this.StartTxtSprite.anchor.setTo(.5);
		this.StartTxtSprite.scale.setTo(0);
		var tween=this.M.T.popUpB(this.StartTxtSprite);
		tween.onComplete.add(function(){
			this.StartTxtSprite.destroy();
			this.respownEnemy();
			this.respownEnemy();
			this.respownEnemy();
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
			this.ScoreTxtSprite.visible=!1;
			this.TimeTxtSprite.visible=!1;
			this.TiredBtnSprite.visible=!1;
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
		var resTextStyle=this.M.S.BaseTextStyleS(55);
		resTextStyle.align='center';
		var textStyle=this.M.S.BaseTextStyleSS(30);
		var upperY=this.world.height*.55;
		var middleY=this.world.height*.65;
		var leftX=this.world.width*.25;
		var rightX=this.world.width*.75;
		this.genResTxtSprite(this.world.centerX,this.world.height*.1,'結果',resTextStyle,0);
		this.genResTxtSprite(this.world.centerX,this.world.height*.35,'スコア\n'+this.M.H.formatComma(this.score),resTextStyle,0);
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
