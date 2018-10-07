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
		this.worldG=this.curCharInfo.worldG;
		this.playerSpeed=this.curCharInfo.speed;
		this.closeToSpike=5;
		this.farFromSpike=this.curCharInfo.farFromSpike;
		this.revolutions=this.earthRad/this.playerRad+1;
		this.spikeW=5;
		this.spikeH=25;
		this.jumpForce=this.curCharInfo.jumpForce;
		this.playerRespawnPos={x:0,y:0};
		this.hp=this.curCharInfo.HP;
		this.score=0;
		this.nextLevel=this.curLevelInfo.nextLevel+this.curCharInfo.levelUpAdd;

		// Obj
		this.Earth=this.Player=this.Spikes=this.BgS=
		this.FollowEff=this.DmgEff=this.MaskS=
		this.FrontG=this.ScoreTS=this.HPTS=
		this.Kanikama=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		this.stage.backgroundColor='#000';
		this.playBgm();
		this.genContents();
		this.M.gGlb('endTut')?this.genStart():this.genTut();
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

			if(this.MaskS.visible)this.MaskS.angle=this.Player.curAngle+90;

			var rad=Phaser.Math.degToRad(this.Player.curAngle);
			var distanceFromCenter=(this.earthRad+this.playerRad)/2+this.Player.jumpOffset;
			this.Player.x=this.Earth.x+distanceFromCenter*Math.cos(rad);
			this.Player.y=this.Earth.y+distanceFromCenter*Math.sin(rad);
			this.Player.angle=this.Player.curAngle*this.revolutions;

			this.FollowEff.x=this.Player.x;
			this.FollowEff.y=this.Player.y;

			this.Spikes.forEach(this.passingSpike,this);
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
			this.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function(){this.score=this.curLevelInfo.nextLevel-1;this.nextLevel=this.curLevelInfo.nextLevel;},this);
			this.curLevel=this.M.H.getQuery('level')||1;this.curLevelInfo=this.LevelInfo[this.curLevel];
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.BgS=this.add.sprite(0,0,'PlayBg_'+this.curChar);
		this.Earth=this.add.sprite(this.world.centerX,this.world.centerY,'Earth_'+this.curChar+'_1');
		this.Earth.anchor.setTo(.5);
		this.Spikes=this.add.group();
		this.genFollowEff();
		this.genPlayer();
		this.genSpikes();
		this.genMask();
		this.FrontG=this.add.group();
		this.FrontG.add(this.Earth);
		this.genDmgEff();
		this.genHUD();
		this.Kanikama=this.add.sprite(0,0,'Kanikama');
		this.Kanikama.anchor.setTo(.5);
		this.Kanikama.visible=!1;
	},
	genFollowEff:function(){
		this.FollowEff=this.add.emitter(100,100,10);
		this.FollowEff.makeParticles('WC');
		this.FollowEff.setScale(.5,0,.5,0,500);
		this.FollowEff.setAlpha(1,0,800);
		this.FollowEff.setXSpeed(0,0);
		this.FollowEff.setYSpeed(0,0);
		this.FollowEff.gravity.x=0;
		this.FollowEff.gravity.y=0;
		////// this.FollowEff.forEach(function(c){c.tint=this[0]},[this.curCharInfo.tint]);
	},
	genDmgEff:function(){
		this.DmgEff=this.add.emitter(0,0,50);
		this.DmgEff.makeParticles('WB');
		this.DmgEff.setScale(3,.3,3,.3,800);
		this.DmgEff.setAlpha(1,0,800);
		this.DmgEff.setXSpeed(-100,100);
		this.DmgEff.setYSpeed(-100,100);
		this.DmgEff.gravity.x=0;
		this.DmgEff.gravity.y=0;
		////// this.DmgEff.forEach(function(c){c.tint=this[0]},[this.curCharInfo.tint]);
	},
	genPlayer:function(){
		this.Player=this.add.sprite(0,0,'Player_'+this.curChar);
		this.Player.anchor.setTo(.5);

		var rad=Phaser.Math.degToRad(this.Player.curAngle);
		var distanceFromCenter=(this.earthRad+this.playerRad)/2+this.Player.jumpOffset;
		this.Player.x=this.Earth.x+distanceFromCenter*Math.cos(rad);
		this.Player.y=this.Earth.y+distanceFromCenter*Math.sin(rad);

		this.resetPlayer();
		
		this.playerRespawnPos.x=this.Player.x;
		this.playerRespawnPos.y=this.Player.y;

		this.input.onDown.add(this.jump,this);
	},
	resetPlayer:function(){
		this.Player.curAngle=-80;
		this.Player.jumpOffset=0;
		this.Player.jumps=0;
		this.Player.jumpForce=0;
	},
	jump:function(){
		if(this.isPlaying){
			if(this.Player.jumps<this.jumpForce.length){
				this.Player.jumps++;
				this.M.SE.play('Jump_'+this.Player.jumps,{volume:2});
				this.Player.jumpForce=this.jumpForce[this.Player.jumps-1];
			}
		}
	},
	genSpikes:function(){
		for(var i=0;i<9;i++){
			var spike=this.add.sprite(0,0,'Nanashi_1');
			spike.anchor.setTo(0,.5);
			spike.firstPlace=Math.floor(i/3);
			this.Spikes.add(spike);
			this.placeSpike(spike,spike.firstPlace);
		}
	},
	placeSpike:function(spike,quadrant){
		var rndAngle=Phaser.Math.between(quadrant*90,(quadrant+1)*90);
		rndAngle=Phaser.Math.wrapAngle(rndAngle);
		var rndAngleRad=Phaser.Math.degToRad(rndAngle);
		var spikeX=this.Earth.x+(this.earthRad*.5-this.rnd.between(2,20))*Math.cos(rndAngleRad);
		spike.x=spikeX;
		var spikeY=this.Earth.y+(this.earthRad*.5-this.rnd.between(2,20))*Math.sin(rndAngleRad);
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

			this.FollowEff.on=!1;
			
			this.end();
			this.Player.visible=!1;

			this.DmgEff.x=this.Player.x;
			this.DmgEff.y=this.Player.y;
			this.DmgEff.explode(800,Math.floor(800/this.time.physicsElapsedMS));

			this.Earth.loadTexture('Earth_'+this.curChar+'_2');

			this.M.SE.play('Dmg',{volume:1});

			this.hp--;
			this.HPTS.changeText('HP: '+this.hp);
			if(this.hp==0)return this.gameOver();

			this.time.events.add(1E3,this.nextPlay,this);
		}
	},
	nextPlay:function(){
		this.Player.reset(this.playerRespawnPos.x,this.playerRespawnPos.y);
		this.resetPlayer();
		
		this.FollowEff.on=!0;
		this.Earth.loadTexture('Earth_'+this.curChar+'_1');

		this.Spikes.forEach(this.restartSpike,this);
		this.start();
	},
	passingSpike:function(spike){
		var angleDiff=this.getAngleDifference(spike.angle,this.Player.curAngle);
		if(!spike.approaching&&angleDiff<this.closeToSpike){
			spike.approaching=!0;
		}

		if(spike.approaching){
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

				this.score++;
				this.ScoreTS.changeText(this.curWords.Score+this.score);

				this.checkLevelUp();
				this.appearKanikama();
			}
		}
	},
	checkLevelUp:function(){
		if(this.nextLevel==this.score){
			this.curLevel++;
			this.curLevelInfo=this.LevelInfo[this.curLevel];
			this.nextLevel=this.curLevelInfo.nextLevel+this.curCharInfo.levelUpAdd;

			if(this.curLevelInfo.mask){
				if(this.MaskS.visible==!1)this.MaskS.visible=!0;

				this.MaskS.angle=this.Player.curAngle+90;

				if(this.MaskS.num!=this.curLevelInfo.mask){
					this.MaskS.loadTexture('Mask_'+this.curLevelInfo.mask);
					this.MaskS.num=this.curLevelInfo.mask;
				}
			}else{
				if(this.MaskS.visible==!0)this.MaskS.visible=!1;
			}

			this.playerSpeed=this.playerSpeed+this.curLevelInfo.addSpeed;

			this.BgS.colorBlend={step:0};
			var tw=this.add.tween(this.BgS.colorBlend).to({step:100},1E3,Phaser.Easing.Linear.None,!0,0);
			this.BgS.startColor=this.BgS.tint;
			this.BgS.endColor=this.curLevelInfo.tint;
			tw.onUpdateCallback(function(){
				this.tint=Phaser.Color.interpolateColor(this.startColor,this.endColor,100,this.colorBlend.step);
			},this.BgS);
		}
	},
	appearKanikama:function(){
		if(this.rnd.between(1,100)<this.curLevelInfo.obRate*this.curCharInfo.obRate){
			if(!this.Kanikama.visible){
				this.Kanikama.visible=!0;
				var x=this.world.randomX;
				var y=this.world.randomY;
				this.Kanikama.x=x;
				this.Kanikama.y=y;
				var tw=this.M.T.moveA(this.Kanikama,{xy:{x:this.Player.x,y:this.Player.y},duration:this.rnd.between(500,1E3)});
				tw.start();
				tw.onComplete.add(function(){this.time.events.add(500,function(){this.Kanikama.visible=!1},this)},this);
				this.M.SE.play('Appear',{volume:1});
			}
		}
	},
	restartSpike:function(spike){
		this.placeSpike(spike,spike.firstPlace);
	},
	genMask:function(){
		this.MaskS=this.add.sprite(this.world.centerX,this.world.centerY,'Mask_1');
		this.MaskS.anchor.setTo(.5);
		this.MaskS.visible=!1;
		this.MaskS.num=1;
	},
	genHUD:function(){
		this.HUD=this.add.group();

		this.ScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.Score+this.score,this.M.S.txtstyl(30));
		this.HUD.add(this.ScoreTS);

		this.HPTS=this.M.S.genTxt(this.world.centerX,this.world.height*.95,'HP: '+this.hp,this.M.S.txtstyl(30));
		this.HUD.add(this.HPTS);
		this.HUD.visible=!1;
	},
	gameOver:function(){
		this.end();
		this.genEnd();
	},
	playBgm:function(){
		if(!this.M.SE.isPlaying('currentBGM')||this.M.SE.isPlaying('TitleBGM')){
			this.M.SE.stop('currentBGM');
			var bgm=this.M.SE.play('PlayBGM_1',{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
	},
	loopBgm:function(){
		if(this.M.currentScene=='Play'){
			this.M.sGlb('curBgmNum',this.M.gGlb('curBgmNum')+1);
			if(this.M.gGlb('curBgmNum')==4)this.M.sGlb('curBgmNum',1);;
			var bgm=this.M.SE.play('PlayBGM_'+this.M.gGlb('curBgmNum'),{volume:1,isBGM:!0});
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

		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.65,this.again,this.curWords.Again));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.65,this.tweet,this.curWords.TwBtn));
		s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.75,this.back,this.curWords.Back));
		s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.75,this.othergames,this.curWords.OtherGames));

		var b=this.add.button(0,this.world.height-120,'Select_'+this.curChar,this.yt,this);
		txtstyl.fontSize=30;
		txtstyl.fill=txtstyl.mStroke='#ff0000';
		b.addChild(this.M.S.genTxt((this.curChar==1||this.curChar==4)?300:100,40,'YouTube',txtstyl));
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
	/*
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.tw;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('twitter','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	*/
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('again','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
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
		this.start();
		this.FollowEff.start(!1,1E3,6*this.time.physicsElapsedMS);
	},
};