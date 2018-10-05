BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.curChar=this.M.gGlb('curChar');
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curCharInfo=this.CharInfo[this.curChar];
		this.curLevel=1;
		this.LevelInfo=this.M.gGlb('LevelInfo');
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		// Val
		this.earthRad=250;
		this.playerRad=25;
		this.worldG=.5;
		this.playerSpeed=1;
		this.closeToSpike=5;
		this.farFromSpike=35;
		this.revolutions=this.earthRad/this.playerRad+1;
		this.spikeW=5;
		this.spikeH=30;
		this.jumpForce=[10,7,4];
		this.playerRespawnPos={x:0,y:0};

		// Obj
		this.Earth=this.Player=this.Spikes=
		// this.Graphics=
		this.FollowEff=this.DmgEff=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		// this.playBgm();
		this.genContents();
		// this.M.gGlb('endTut')?this.genStart():this.genTut();
		// this.time.events.add(500,this.start,this);//TODO del
		this.start();//TODO del
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			if(this.Player.jumps>0){
				this.Player.jumpOffset+=this.Player.jumpForce;
				this.Player.jumpForce-=this.worldG;
				if(this.Player.jumpOffset<0){
					this.Player.jumpOffset=0;
					this.Player.jumps=0;
					this.Player.jumpForce=0;
				}
			}
			this.Player.curAngle=Phaser.Math.wrapAngle(this.Player.curAngle+this.playerSpeed);

			// this.maskImage.angle = this.player.currentAngle + 90;

			var rad=Phaser.Math.degToRad(this.Player.curAngle);
			var distanceFromCenter=(this.earthRad+this.playerRad)/2+this.Player.jumpOffset;
			this.Player.x=this.Earth.x+distanceFromCenter*Math.cos(rad);
			this.Player.y=this.Earth.y+distanceFromCenter*Math.sin(rad);
			// var revolutions=this.earthRad/this.playerRad+1;
			this.Player.angle=this.Player.curAngle*this.revolutions;

			// this.Graphics.clear();

			this.Spikes.forEach(this.passingSpike,this);
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			// this.Player.body.debug=!0;
			// this.Thorns.forEach(function(c){c.body.debug=!0});
			// this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
			// this.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function(){this.score=this.curLevelInfo.nextLevel-1;this.nextLevel=this.curLevelInfo.nextLevel;},this);
			// this.curLevel=this.M.H.getQuery('level')||1;this.curLevelInfo=this.LevelInfo[this.curLevel];
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.Earth=this.M.S.genBmpCclSp(this.world.centerX,this.world.centerY,this.earthRad,'#fff');
		this.Earth.anchor.setTo(.5);

		this.genEff();

		this.genPlayer();

		// this.Graphics=this.add.graphics();
		this.Spikes=this.add.group();
		for(var i=0;i<9;i++){
			var spike=this.M.S.genBmpSqrSp(0,0,this.spikeH*1.5,this.spikeW*1.5,'#ffffff');
			// var spike=this.M.S.genBmpSqrSp(0,0,this.spikeH,this.spikeW,'#ffffff');
			spike.anchor.setTo(0,.5);
			this.Spikes.add(spike);
			this.placeSpike(spike,Math.floor(i/3));
		}

		// this.maskImage = this.add.sprite(game.config.width / 2, game.config.height / 2, "mask");
	},
	genEff:function(){
		// TODO
		// this.FollowEff=this.add.emitter();
		// this.FollowEff.frequency=100;

		
		this.DmgEff=this.add.emitter(0,0,100);
		this.DmgEff.makeParticles('WB');
		this.DmgEff.setScale(1,3);
		this.DmgEff.setAlpha(.2,1);
		this.DmgEff.setXSpeed(-50,50);
		this.DmgEff.setYSpeed(-50,50);
		this.DmgEff.gravity.x=0;
		this.DmgEff.gravity.y=0;
	},
	genPlayer:function(){
		this.Player=this.M.S.genBmpCclSp(0,0,this.playerRad,'#00ff00');
		this.Player.anchor.setTo(.5);

		var rad=Phaser.Math.degToRad(this.Player.curAngle);
		var distanceFromCenter=(this.earthRad+this.playerRad)/2+this.Player.jumpOffset;
		this.Player.x=this.Earth.x+distanceFromCenter*Math.cos(rad);
		this.Player.y=this.Earth.y+distanceFromCenter*Math.sin(rad);

		this.resetPlayer();
		
		this.playerRespawnPos.x=this.Player.x;
		this.playerRespawnPos.y=this.Player.y;

		this.input.onDown.add(this.jump,this);
		this.Player.addChild(this.M.S.genBmpCclSp(0,0,10,'#ff0000'));//TODO del
	},
	resetPlayer:function(){
		this.Player.curAngle=-80;
		this.Player.jumpOffset=0;
		this.Player.jumps=0;
		this.Player.jumpForce=0;
	},
	jump:function(){
		if(this.Player.jumps<this.jumpForce.length){
			this.Player.jumps++;
			this.Player.jumpForce=this.jumpForce[this.Player.jumps-1];
		}
	},
	placeSpike:function(spike,quadrant){
		var rndAngle=Phaser.Math.between(quadrant*90,(quadrant+1)*90);
		rndAngle=Phaser.Math.wrapAngle(rndAngle);
		var rndAngleRad=Phaser.Math.degToRad(rndAngle);
		var spikeX=this.Earth.x+(this.earthRad*.5-this.rnd.between(4,25))*Math.cos(rndAngleRad);
		spike.x=spikeX;
		var spikeY=this.Earth.y+(this.earthRad*.5-this.rnd.between(4,25))*Math.sin(rndAngleRad);
		spike.y=spikeY;
		spike.quadrant=quadrant;
		spike.angle=rndAngle;
		spike.approaching=!1;
		spike.topA=new Phaser.Point(spikeX+this.spikeH*Math.cos(rndAngleRad),spikeY+this.spikeH*Math.sin(rndAngleRad));
		spike.base1=new Phaser.Point(spikeX+this.spikeW/2*Math.cos(rndAngleRad+Math.PI/2),spikeY+this.spikeW/2*Math.sin(rndAngleRad+Math.PI/2));
		spike.base2=new Phaser.Point(spikeX+this.spikeW/2*Math.cos(rndAngleRad-Math.PI/2),spikeY+this.spikeW/2*Math.sin(rndAngleRad-Math.PI/2));

		/////// this.M.S.genBmpCclSp(spike.topA.x,spike.topA.y,10,'#00ff00').anchor.setTo(.5);
	},
	getAngleDifference:function(a1,a2){
		var angleDifference=a1-a2;
		angleDifference+=(angleDifference>180)?-360:(angleDifference<-180)?360:0;
		return Math.abs(angleDifference);
	},
    getDistance:function(p1,p2){
        return (p1.x-p2.x)*(p1.x-p2.x)+(p1.y-p2.y)*(p1.y-p2.y);
    },
	distToSegmentSquared:function(circleCenter,circleRad,segmentStart,segmentEnd){
		var l2=this.getDistance(segmentStart,segmentEnd);
		var t=((circleCenter.x-segmentStart.x)*(segmentEnd.x-segmentStart.x)+(circleCenter.y-segmentStart.y)*(segmentEnd.y-segmentStart.y))/l2;
		t=Math.max(0,Math.min(1,t));
		var tX=segmentStart.x+t*(segmentEnd.x-segmentStart.x);
		var tY=segmentStart.y+t*(segmentEnd.y-segmentStart.y);
		var tPoint={x:tX,y:tY};
		return this.getDistance(circleCenter,tPoint)<circleRad*circleRad;
	},
	hitSpike:function(){
		if(this.isPlaying){
			this.camera.shake(.01,800,!0,Phaser.Camera.SHAKE_BOTH);
			
			console.log('END');

			this.end();
			this.Player.visible=!1;
			this.time.events.add(1E3,this.nextPlay,this);

			this.DmgEff.x=this.Player.x;
			this.DmgEff.y=this.Player.y;
			this.DmgEff.explode(800,50);
		}
	},
	nextPlay:function(){
		// this.M.NextScene('Play');
		// this.Player.reset(this.Player.x,this.Player.y);
		this.Player.reset(this.playerRespawnPos.x,this.playerRespawnPos.y);
		this.resetPlayer();

		this.Spikes.forEach(this.restartSpike,this);
		this.start();
	},
	passingSpike:function(spike){
		var angleDiff=this.getAngleDifference(spike.angle,this.Player.curAngle);
		if(!spike.approaching&&angleDiff<this.closeToSpike){
			spike.approaching=!0;
		}

		if(spike.approaching){
			/*
			this.Graphics.beginFill(0xff0000);
			this.Graphics.lineStyle(4,0xff0000,1);
			this.Graphics.moveTo(spike.topA.x,spike.topA.y);
			this.Graphics.lineTo(spike.base1.x,spike.base1.y);
			this.Graphics.endFill();
			this.Graphics.beginFill(0xff0000);
			this.Graphics.moveTo(spike.topA.x,spike.topA.y);
			this.Graphics.lineTo(spike.base2.x,spike.base2.y);
			this.Graphics.endFill();
			*/
			if(this.distToSegmentSquared(
				new Phaser.Point(this.Player.x,this.Player.y),
				this.playerRad,spike.topA,spike.base1)
				||this.distToSegmentSquared(
					new Phaser.Point(this.Player.x,this.Player.y),
					this.playerRad,spike.topA,spike.base2)){
				this.hitSpike();
			}

			if(angleDiff>this.farFromSpike){
				this.placeSpike(spike,(spike.quadrant+3)%4);
			}
		}
	},
	restartSpike:function(spike){
		this.placeSpike(spike,spike.quadrant);
	},
	genHUD:function(){
		this.HUD=this.add.group();

		this.ScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.Score+this.score,this.M.S.txtstyl(30));
		this.HUD.add(this.ScoreTS);

		this.HPTS=this.M.S.genTxt(this.world.centerX,this.world.height*.95,'HP: '+this.hp,this.M.S.txtstyl(30));
		this.HUD.add(this.HPTS);

		this.PlayLbl=this.M.S.genLbl(this.world.centerX,this.world.height*.75,this.go,'GO!');
		this.HUD.add(this.PlayLbl);

		this.HUD.visible=!1;
	},
	gameOver:function(){
		this.end();
		this.genEnd();
	},
	playBgm:function(){
		this.M.SE.stop('currentBGM');
		var bgm=this.M.SE.play('PlayBGM_1',{volume:1,isBGM:!0});
		bgm.onStop.add(this.loopBgm,this);
	},
	loopBgm:function(){
		if(this.M.currentScene=='Play'){
			this.curBgmNum++;
			if(this.curBgmNum==4)this.curBgmNum=1;
			var bgm=this.M.SE.play('PlayBGM_'+this.curBgmNum,{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
	},
	////////////////////////////////////////////////////////////////////////////////////
	genEnd:function(){
		var txtstyl=this.M.S.txtstyl(45);
		txtstyl.fill=txtstyl.mStroke='#DF0101';
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,this.curWords.GameOver,txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
		this.M.SE.play('End',{volume:1});
	},
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.onComplete.add(function(){this.visible=!1},this.EndTS);
		tw.onStart.add(function(){this.M.SE.play('Res',{volume:2})},this);
		tw.start();
		this.HUD.visible=!1;

		var txtstyl=this.M.S.txtstyl(45);

		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.Result,txtstyl));

		txtstyl.fill=txtstyl.mStroke=this.curCharInfo.color;
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.4,this.curWords.ResScore+this.score,txtstyl));

		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.65,this.tw,'Twitter'));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.65,this.tweet,this.curWords.TwBtn));
		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.75,this.back,this.curWords.Back));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.75,this.othergames,this.curWords.OtherGames));

		var b=this.add.button(0,this.world.height-120,'Select_'+this.curChar,this.yt,this);
		txtstyl.fontSize=30;
		txtstyl.fill=txtstyl.mStroke='#ff0000';
		b.addChild(this.M.S.genTxt((this.curChar==4)?300:100,40,'YouTube',txtstyl));
		s.addChild(b);
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.yt;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('youtube','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.tw;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('twitter','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('othergames','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e=this.curCharInfo.emoji;
			var res=this.curWords.SelectTw+this.curCharInfo.charName+'\n'+this.curWords.Score+this.score+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
			this.Tween.start();
		}
	},
	genTut:function(){
		this.HowToS=this.add.sprite(0,0,'TWP');
		this.HowToS.tint=0x000000;
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curWords.HowTo,this.M.S.txtstyl(30));
		this.HowToS.addChild(ts);
		this.time.events.add(300,function(){
			this.input.onDown.addOnce(function(){
				this.M.sGlb('endTut',!0);
				this.HowToS.destroy();
				this.genStart();
			},this);
		},this);
	},
	genStart:function(){
		var txtstyl=this.M.S.txtstyl(50);
		txtstyl.fill=txtstyl.mStroke='#0080FF';
		var s=this.M.S.genTxt(this.world.width*1.5,this.world.centerY,this.curWords.Start,txtstyl);
		var twA=this.M.T.moveA(s,{xy:{x:this.world.centerX}});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:300});
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(function(){this.inputEnabled=!0},this);
		twA.onComplete.add(function(){this.destroy},s);
		this.M.SE.play('GenStart',{volume:1});
		this.HUD.visible=!0;
	},
};