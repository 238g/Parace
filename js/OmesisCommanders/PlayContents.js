BasicGame.Play.prototype.genTut=function(){
	this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
	this.TutSprite.tint=0x000000;
	this.TutSprite.anchor.setTo(.5);
	// TODO tutorial text
	var text='aaaaaaaaaaaaaaaaaaaaa\nbbbbbbbbbbbbbbb';
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
		var delay=i*1000;
		var simonSprite=this.M.S.genSprite(this.world.centerX,this.world.height,'GameIconsWhite',this.gamePadFrames[frameNum]);
		simonSprite.tint=this.gamePadColor;
		simonSprite.anchor.setTo(.5,0);
		simonSprite.frameNum=frameNum;
		// TODO think tween
		var tweenA=this.M.T.moveA(simonSprite,{xy:{y:'-100'},delay:delay});
		var tweenB=this.M.T.moveA(simonSprite,{xy:{y:'-100'}});
		var tweenC=this.M.T.moveA(simonSprite,{xy:{y:'-100'}});
		var tweenD=this.M.T.popUpA(simonSprite,{scale:{x:.001,y:.5},delay:2000+delay});
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
				this.PlayerSprite.loadTexture(this.curCharInfo.idle);
			}
		},this);
		tweenA.onStart.add(function(s){
			// TODO SE
			this.PlayerSprite.loadTexture(this.curCharInfo.animBase+(s.frameNum+1));
		},this);
	}
};
BasicGame.Play.prototype.genContents=function(){
	this.add.sprite(0,0,this.curStageInfo.stgBg);
	this.genStartSprites();
	this.genCharSprites();
	this.genGamePadBtns();
};
BasicGame.Play.prototype.genStartSprites=function(){
	this.RdyTxtSprite=this.add.sprite(this.world.centerX,this.world.centerY,'ReadyText');
	this.RdyTxtSprite.anchor.setTo(.5);
	this.RdyTxtSprite.scale.setTo(0);
	this.FightTxtSprite=this.add.sprite(this.world.centerX,this.world.centerY,'GoText');
	this.FightTxtSprite.anchor.setTo(.5);
	this.FightTxtSprite.scale.setTo(0);
};
BasicGame.Play.prototype.genCharSprites=function(){
	// TODO if(this.curStageInfo.isEndless) -> player center? enemy delete
	this.PlayerSprite=this.add.sprite(this.world.width*.3,this.world.height*.3,this.curCharInfo.idle);
	this.PlayerSprite.anchor.setTo(.5);
	this.EnemySprite=this.add.sprite(this.world.width*.7,this.world.height*.3,this.curEnemyInfo.idle);
	this.EnemySprite.anchor.setTo(.5);
	this.EnemySprite.scale.setTo(-1,1);
	this.genGaugeContainer();
	// TODO gauge lower name
	// this.curCharInfo.charName
};
BasicGame.Play.prototype.genGaugeContainer=function(){
	var x=this.world.width*.05;
	var y=this.world.height*.05;
	var w=this.world.width*.4;
	var h=this.world.height*.1;
	var textStyle=this.M.S.BaseTextStyleS(25);
	this.PlayerLifeSprite=this.genGauge(x,y,w,h);
	this.M.S.genTextM(this.PlayerLifeSprite.centerX-40,this.PlayerLifeSprite.bottom+20,this.curCharInfo.charName,textStyle);
	x+=this.world.centerX;
	// TODO change color? textStyle.*****
	this.EnemyLifeSprite=this.genGauge(x,y,w,h);
	this.M.S.genTextM(this.EnemyLifeSprite.centerX+40,this.EnemyLifeSprite.bottom+20,this.curEnemyInfo.charName,textStyle);
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
	// TODO need stroke ???
	var s=this.add.sprite(x,y,'GameIconsWhite',frame);
	s.tint=0x000000;
	s.scale.setTo(.83);
	// s.scale.setTo(.9);
	// s.anchor.setTo(.5);
	var btnSprite = this.add.button(x,y,'GameIconsWhite',this.onInputUpGamePad,this,frame,frame,frame,frame);
	btnSprite.tint=this.gamePadColor;
	btnSprite.frameNum=frameNum;
	// btnSprite.anchor.setTo(.5);
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
				// TODO correct
				console.log('correct');
				this.curSimonNum++;
				this.correctCount++;
				if(this.challengeCount==this.correctCount){
					this.challengeCount++;
					this.correctCount=0;
					this.curSimonNum=0;
					this.endSummonSimonCount=0;
					if (this.challengeCount>this.goalCount) {
						this.endSt='WIN';
						this.end();
					} else {
						this.endInput();
					}
				}
				this.PlayerSprite.loadTexture(this.curCharInfo.animBase+(frameNum+1));
				if(this.EnemySprite.frameName!=this.curCharInfo.idle)this.EnemySprite.loadTexture(this.curCharInfo.idle);
			} else {
				// TODO incorrect
				this.curLife-=this.dmge;
				// TODO dmge animation
				this.EnemySprite.loadTexture(this.curCharInfo.animBase+this.rnd.integerInRange(1,this.charAnimCount));
				// TODO reduce player health -> (gauge width = this.curLife/this.maxLife)
				console.log(this.curLife);
				if(this.curLife<=0){
					this.endSt='LOSE';
					this.end();
				}
			}
		}
	}
};
BasicGame.Play.prototype.onInputDownGamePad=function(b){b.alpha=.5;};
BasicGame.Play.prototype.onInputOutGamePad=function(b){b.alpha=1;};
BasicGame.Play.prototype.endInput=function(){
	this.playerInput=!1;
	// TODO attack animation
	this.PlayerSprite.loadTexture(this.curCharInfo.idle);
	// TODO reduce enemy health -> (gauge width / goalCount)
	// TODO oncomplete
	this.summonSimon();
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
	this.genResTxtSprite(leftX,upperY,this.curStageInfo.isEndless?(this.challengeCount-1):this.endSt,this.M.S.BaseTextStyleS(35),200);
	this.genYtSprite(leftX,bottomY,600);
	var rightX=this.world.width*.75;
	textStyle=this.M.S.BaseTextStyleSS(25);
	this.genResBtnSprite(rightX,upperY,function(){
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		this.M.NextScene('Play');
	},'もう一度',textStyle,200);
	this.genResBtnSprite(rightX,middleY,this.tweet,'結果をツイート',textStyle,400);
	this.genResBtnSprite(rightX,bottomY,function(){
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		this.M.NextScene('SelectChar');
	},'キャラ選択',textStyle,600);
	this.genResBtnSprite(rightX,bottomY2,function(){
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
	// this.M.SE.play('OnBtn',{volume:1}); // TODO del
	var resultText=
		'選択キャラクター: '+this.curCharInfo.charName+'\n'
		+'選択ステージ: '+this.curStageInfo.selectorName+'\n'
		+'結果: '+(this.curStageInfo.isEndless?(this.challengeCount-1):this.endSt)+'\n';
	var emoji='';
	var text='『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
				+emoji+'\n'
				+resultText
				+emoji+'\n';
	var hashtags = 'おめシスゲーム,おめシスコマンダーズ'; // TODO title correct??
	this.M.H.tweet(text,hashtags,location.href);
};