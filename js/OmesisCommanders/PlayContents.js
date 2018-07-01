BasicGame.Play.prototype.genTut=function(){
	this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
	this.TutSprite.tint=0x000000;
	this.TutSprite.anchor.setTo(.5);
	var text=this.curStageInfo.isEndless
		?'表示されるコマンドを覚えよう！\n覚えた順に同じコマンドを押していこう！\nどこまで行けるか…\n記憶力との勝負だ！'
		:'表示されるコマンドを覚えよう！\n覚えた順に同じコマンドを押して\n相手に攻撃しよう！\n間違えるとダメージを受けるから注意！';
	var textStyle=this.M.S.BaseTextStyleS(30);
	textStyle.align='center';
	var textSprite=this.M.S.genTextM(0,0,text,textStyle);
	this.TutSprite.addChild(textSprite);
	this.input.onDown.addOnce(function(){
		this.M.setGlobal('endTut',!0);
		this.TutSprite.destroy();
		this.rdy();
	},this);
};
BasicGame.Play.prototype.summonSimon=function(){
	this.playerInput=!1;
	for(var i=0;i<this.challengeCount;i++){
		var frameNum=this.simonList[i];
		var duration=800;
		var delay=i*duration;
		var simonSprite=this.M.S.genSprite(this.world.centerX,this.world.height,'GameIconsWhite',this.gamePadFrames[frameNum]);
		simonSprite.tint=0x000000;
		simonSprite.anchor.setTo(.5,0);
		simonSprite.frameNum=frameNum;
		var simonSprite2=this.M.S.genSprite(-3,-3,'GameIconsWhite',this.gamePadFrames[frameNum]);
		simonSprite2.tint=this.gamePadColors[frameNum];
		simonSprite2.anchor.setTo(.5,0);
		simonSprite2.frameNum=frameNum;
		simonSprite2.scale.setTo(1.03);
		simonSprite.addChild(simonSprite2);
		var tweenA=this.M.T.moveA(simonSprite,{xy:{y:'-100'},delay:delay,duration:duration});
		var tweenB=this.M.T.moveA(simonSprite,{xy:{y:'-100'},duration:duration});
		var tweenC=this.M.T.moveA(simonSprite,{xy:{y:'-100'},duration:duration});
		var tweenD=this.M.T.popUpA(simonSprite,{scale:{x:.001,y:.5},delay:duration*2+delay,duration:duration});
		tweenA.chain(tweenB);
		tweenB.chain(tweenC);
		tweenA.start();
		tweenD.start();
		tweenD.onComplete.add(function(){
			this.destroy();
		},simonSprite);
		tweenD.onComplete.add(function(){
			this.endSummonSimonCount++;
			if(this.endSummonSimonCount==this.challengeCount){
				this.playerInput=!0;
				////// this.PlayerSprite.loadTexture(this.curCharInfo.idle);
			}
		},this);
		tweenA.onStart.add(function(s){
			this.M.SE.play('OnClickGamePad',{volume:1});
			////// this.PlayerSprite.loadTexture(this.curCharInfo.animBase+(s.frameNum+1));
		},this);
	}
	this.PlayerSprite.loadTexture(this.curCharInfo.idle);
};
BasicGame.Play.prototype.genContents=function(){
	this.add.sprite(0,0,this.curStageInfo.stgBg);
	this.genCharSprites();
	this.genGamePadBtns();
	this.genStartSprites();
};
BasicGame.Play.prototype.genStartSprites=function(){
	this.RdyTxtSprite=this.add.sprite(this.world.centerX,this.world.centerY,'ReadyText');
	this.RdyTxtSprite.anchor.setTo(.5);
	this.RdyTxtSprite.scale.setTo(0);
	this.FightTxtSprite=this.add.sprite(this.world.centerX,this.world.centerY,'FightText');
	this.FightTxtSprite.anchor.setTo(.5);
	this.FightTxtSprite.scale.setTo(0);
};
BasicGame.Play.prototype.genCharSprites=function(){
	if(this.curStageInfo.isEndless){
		this.PlayerSprite=this.add.sprite(this.world.centerX,this.world.centerY,this.curCharInfo.idle);
		this.PlayerSprite.anchor.setTo(.5);
	}else{
		this.PlayerSprite=this.add.sprite(this.world.width*.3,this.world.centerY,this.curCharInfo.idle);
		this.PlayerSprite.anchor.setTo(.5);
		this.PlayerSprite.scale.setTo(.7);
		this.EnemySprite=this.add.sprite(this.world.width*.7,this.world.centerY,this.curEnemyInfo.idle);
		this.EnemySprite.anchor.setTo(.5);
		this.EnemySprite.scale.setTo(-.7,.7);
		this.genGaugeContainer();
	}
};
BasicGame.Play.prototype.genGaugeContainer=function(){
	var x=this.world.width*.025;
	var y=this.world.height*.03;
	var w=x*18;
	var h=this.world.height*.07;
	var textStyle=this.M.S.BaseTextStyleS(25);
	this.PlayerLifeSprite=this.genGauge(x,y,w,h);
	this.playerLifeWidth=this.PlayerLifeSprite.width;
	this.M.S.genTextM(this.PlayerLifeSprite.centerX-60,this.PlayerLifeSprite.bottom+30,this.curCharInfo.charName,textStyle);
	x+=this.world.centerX;
	this.EnemyLifeSprite=this.genGauge(x,y,w,h);
	this.enemyLifeWidth=this.EnemyLifeSprite.width;
	this.M.S.genTextM(this.EnemyLifeSprite.centerX+60,this.EnemyLifeSprite.bottom+30,this.curEnemyInfo.charName,textStyle);
};
BasicGame.Play.prototype.genGauge=function(x,y,w,h){
	this.M.S.genBmpSprite(x,y,w,h,'#000000');
	this.M.S.genBmpSprite(x+1,y+1,w-2,h-2,'#ffffff');
	this.M.S.genBmpSprite(x+2,y+2,w-4,h-4,'#000000');
	this.M.S.genBmpSprite(x+3,y+3,w-6,h-6,'#ffffff');
	this.M.S.genBmpSprite(x+4,y+4,w-8,h-8,'#ff0000');
	return this.M.S.genBmpSprite(x+4,y+4,w-8,h-8,'#ffff00');
};
BasicGame.Play.prototype.genGamePadBtns=function(){
	var arrowCenterX=50;
	var arrowCenterY=this.world.height*.65;
	var margin=50;
	this.genGamePadBtnSprite(530,arrowCenterY,0);
	this.genGamePadBtnSprite(470,arrowCenterY+margin,1);
	this.genGamePadBtnSprite(arrowCenterX-margin,arrowCenterY,2);
	this.genGamePadBtnSprite(arrowCenterX,arrowCenterY+margin,3);
	this.genGamePadBtnSprite(arrowCenterX,arrowCenterY-margin,4);
	this.genGamePadBtnSprite(arrowCenterX+margin,arrowCenterY,5);
};
BasicGame.Play.prototype.genGamePadBtnSprite=function(x,y,frameNum){
	var frame=this.gamePadFrames[frameNum];
	var s=this.add.sprite(x,y,'GameIconsWhite',frame);
	s.tint=0x000000;
	s.scale.setTo(.83);
	var btnSprite = this.add.button(x,y,'GameIconsWhite',this.onInputUpGamePad,this,frame,frame,frame,frame);
	btnSprite.tint=this.gamePadColors[frameNum];
	btnSprite.frameNum=frameNum;
	btnSprite.scale.setTo(.8);
	btnSprite.onInputDown.add(this.onInputDownGamePad,this);
	btnSprite.onInputOut.add(this.onInputOutGamePad,this);
};

BasicGame.Play.prototype.onInputUpGamePad=function(b){
	if(b.alpha==.5){
		b.alpha=1;
		if (this.playerInput&&this.isPlaying) {
			var frameNum=b.frameNum;
			if (this.simonList[this.curSimonNum]==frameNum) {
				this.curSimonNum++;
				this.correctCount++;
				if(this.challengeCount==this.correctCount){
					this.correctCount=0;
					this.curSimonNum=0;
					this.endSummonSimonCount=0;
					if(!this.curStageInfo.isEndless){
						this.curEnemyLife-=this.attack;
						this.EnemyLifeSprite.width=(this.curEnemyLife<=0||this.challengeCount>this.goalCount)?0:this.enemyLifeWidth*(this.curEnemyLife/this.maxLife);
						this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_HORIZONTAL);
						this.EnemySprite.loadTexture(this.curEnemyInfo.idle);
					}
					this.PlayerSprite.loadTexture('Anim_'+this.curChar+'_1');
					this.M.SE.play('Attack_'+this.rnd.integerInRange(1,2),{volume:1});
					this.challengeCount++;
					if (this.challengeCount>this.goalCount) {
						this.endSt='WIN';
						this.end();
					} else {
						this.endInput();
					}
				}
				////// this.PlayerSprite.loadTexture(this.curCharInfo.animBase+(frameNum+1));
				////// if(this.EnemySprite&&this.EnemySprite.frameName!=this.curCharInfo.idle)this.EnemySprite.loadTexture("****ENEMY_IDLE****");
			} else {
				this.curLife-=this.dmge;
				if(!this.curStageInfo.isEndless){
					this.PlayerLifeSprite.width=(this.curLife<=0)?0:this.playerLifeWidth*(this.curLife/this.maxLife);
					this.EnemySprite.loadTexture('Anim_'+this.curEnemy+'_1');
				}
				this.M.SE.play('Damage_'+this.rnd.integerInRange(1,2),{volume:1});
				this.camera.shake(.03,200,!0,Phaser.Camera.SHAKE_HORIZONTAL);
				////// this.EnemySprite.loadTexture(this.curCharInfo.animBase+this.rnd.integerInRange(1,this.charAnimCount));
				if(this.curLife<=0){
					this.endSt='LOSE';
					this.end();
				}
			}
		}
	}
};
BasicGame.Play.prototype.onInputDownGamePad=function(b){
	if(this.playerInput){
		this.M.SE.play('OnClickGamePad',{volume:1});
		b.alpha=.5;
		this.EnemySprite.loadTexture(this.curEnemyInfo.idle);
	}
};
BasicGame.Play.prototype.onInputOutGamePad=function(b){b.alpha=1;};
BasicGame.Play.prototype.endInput=function(){
	this.playerInput=!1;
	////// this.PlayerSprite.loadTexture(this.curCharInfo.idle);
	this.time.events.add(1000,this.summonSimon,this);
};
BasicGame.Play.prototype.genResPopUp=function(txt){
	var ts=this.M.S.genTextM(this.world.centerX,this.world.centerY,txt,this.M.S.BaseTextStyleS(80));
	ts.anchor.setTo(.5);
	ts.scale.setTo(0);
	var tween=this.M.T.popUpB(ts);
	tween.onComplete.add(function(){
		var twp=this.add.sprite(0,0,'TWP');
		twp.tint=0x000000;
		twp.alpha=0;
		var tween=this.M.T.fadeInA(twp,{delay:500,duration:800,alpha:1});
		tween.onComplete.add(this.genRes,this);
		tween.start();
	},this);
	tween.start();
};
BasicGame.Play.prototype.genRes=function(){
	var textStyle=this.M.S.BaseTextStyleSS(30);
	var upperY=this.world.height*.35;
	var middleY=this.world.height*.52;
	var bottomY=this.world.height*.69;
	var bottomY2=this.world.height*.86;
	var leftX=this.world.width*.3;
	this.genResTxtSprite(this.world.centerX,this.world.height*.15,'結果',this.M.S.BaseTextStyleS(50),0);
	this.genResTxtSprite(leftX,upperY,this.curStageInfo.isEndless?'記録: '+(this.challengeCount-1):this.endSt,this.M.S.BaseTextStyleS(35),200);
	this.genYtSprite(leftX,bottomY,600);
	var rightX=this.world.width*.75;
	textStyle=this.M.S.BaseTextStyleSS(25);
	this.genResBtnSprite(rightX,upperY,function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Play');
	},'もう一度',textStyle,200);
	this.genResBtnSprite(rightX,middleY,this.tweet,'結果をツイート',textStyle,400);
	this.genResBtnSprite(rightX,bottomY,function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('SelectChar');
	},'キャラ選択',textStyle,600);
	this.genResBtnSprite(rightX,bottomY2,function(){
		this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.MY_GAMES_URL,'_blank');
		} else {
			location.href = BasicGame.MY_GAMES_URL;
		}
	},'他のゲーム',textStyle,800);
};
BasicGame.Play.prototype.genResTxtSprite=function(x,y,txt,textStyle,delay){
	var textSprite=this.M.S.genTextM(x,y,txt,textStyle);
	textSprite.scale.setTo(0);
	this.M.T.popUpB(textSprite,{duration:800,delay:delay}).start();
};
BasicGame.Play.prototype.genResBtnSprite=function(x,y,func,txt,textStyle,delay){
	var btnSprite=this.M.S.BasicGrayLabelS(x,y,func,txt,textStyle,{tint:BasicGame.MAIN_TINT});
	btnSprite.scale.setTo(0);
	this.M.T.popUpB(btnSprite,{duration:800,delay:delay}).start();
};
BasicGame.Play.prototype.genYtSprite=function(x,y,delay){
	var yt=this.add.button(x,y,this.curCharInfo.ch,this.openYt,this);
	yt.anchor.setTo(.5);
	yt.scale.setTo(0);
	this.M.T.popUpB(yt,{duration:800,delay:delay}).start();
};
BasicGame.Play.prototype.openYt=function(){
	if (this.game.device.desktop) {
		window.open(this.curCharInfo.ytUrl,'_blank');
	} else {
		location.href=this.curCharInfo.ytUrl;
	}
};
BasicGame.Play.prototype.tweet=function(){
	this.M.SE.play('OnBtn',{volume:1});
	var resultText=
		'選択キャラクター: '+this.curCharInfo.charName+'\n'
		+'選択ステージ: '+this.curStageInfo.selectorName+'\n'
		+'結果: '+(this.curStageInfo.isEndless?(this.challengeCount-1):this.endSt)+'\n';
	var emoji='';
	var text='『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
				+emoji+'\n'
				+resultText
				+emoji+'\n';
	var hashtags = 'おめシスゲーム,おめシスコマンダーズ';
	this.M.H.tweet(text,hashtags,location.href);
};