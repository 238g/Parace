BasicGame.Play.prototype.summonSimon=function(){
	this.playerInput=!1;
	for(var i=0;i<this.challengeCount;i++){
		var frameNum=this.simonList[i];
		var delay=i*1000;
		var simonSprite=this.M.S.genSprite(this.world.centerX,this.world.height,'GameIconsWhite',this.gamePadFrames[frameNum]);
		simonSprite.tint=this.gamePadColor;
		simonSprite.anchor.setTo(.5,0);
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
				this.PlayerSprite.loadTexture(this.curCharInfo.idleImg);
			}
		},this);
		tweenA.onStart.add(function(){
			this.PlayerSprite.loadTexture(this.curCharInfo.animBaseImg+(1)); // TODO del
			// this.PlayerSprite.loadTexture(this.curCharInfo.animBaseImg+(frameNum+1));
		},this);
	}
};

BasicGame.Play.prototype.genContents=function(){
	this.genStartSprites();
	this.genCharSprites();
	this.genGamePadBtns();
};
BasicGame.Play.prototype.genStartSprites=function(){
	this.RdyTxtSprite=this.add.sprite(this.world.centerX,this.world.centerY,'ReadyText');
	this.RdyTxtSprite.anchor.setTo(.5);
	this.RdyTxtSprite.scale.setTo(0);
	this.GoTxtSprite=this.add.sprite(this.world.centerX,this.world.centerY,'GoText');
	this.GoTxtSprite.anchor.setTo(.5);
	this.GoTxtSprite.scale.setTo(0);
};
BasicGame.Play.prototype.genCharSprites=function(){
	// TODO if(this.curStageInfo.isEndless) -> player center? enemy delete
	this.PlayerSprite=this.add.sprite(this.world.width*.3,this.world.height*.3,this.curCharInfo.idleImg);
	this.PlayerSprite.anchor.setTo(.5);
	this.EnemySprite=this.add.sprite(this.world.width*.7,this.world.height*.3,this.curEnemyInfo.idleImg);
	this.EnemySprite.anchor.setTo(.5);
	this.EnemySprite.scale.setTo(-1,1);
	// TODO health gauge
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
	var btnSprite = this.add.button(x,y,'GameIconsWhite',this.onInputUpGamePad,this,frame,frame,frame,frame);
	btnSprite.tint=this.gamePadColor;
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
						this.end('clear');
					} else {
						this.endInput();
					}
				}
				this.PlayerSprite.loadTexture(this.curCharInfo.animBaseImg+(1)); // TODO del
				// this.PlayerSprite.loadTexture(this.curCharInfo.animBaseImg+(frameNum+1));
			} else {
				// TODO incorrect
				this.curLife-=this.dmge;
				// TODO dmge animation
				// TODO reduce player health -> (gauge width = this.curLife/this.maxLife)
				console.log(this.curLife);
				if(this.curLife<0){
					this.end('gameover');
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
	this.PlayerSprite.loadTexture(this.curCharInfo.idleImg);
	// TODO reduce enemy health -> (gauge width / goalCount)
	// TODO oncomplete
	this.summonSimon();
};

