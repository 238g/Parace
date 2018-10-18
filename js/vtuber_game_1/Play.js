BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.curFirstChar=this.M.gGlb('curFirstChar');
		this.curCharList=this.M.gGlb('curCharList');//{1:*,2:*,3:*,4:*};
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curLevel=1;
		this.LevelInfo=this.M.gGlb('LevelInfo');
		this.curLevelInfo=this.LevelInfo[this.curLevel];
		// Val
		this.secTimer=1E3;
		this.secTimeInterval=100;//TODO del
		// this.secTimeInterval=1E3;//TODO
		this.hp=9999;//TODO
		this.charKeysArr=[];
		this.appearCharList={1:[],2:[],3:[],4:[]};

		// Obj
		this.ParachuteCollisionGroup=this.FloorCollisionGroup=
		this.HUD=this.HPTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!1;//TODO
		// this.stage.disableVisibilityChange=!0;
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
		// this.playBgm();
		this.genContents();
		// this.M.gGlb('endTut')?this.genStart():this.genTut();
		// this.genStart();//TODO
		this.start();//TODO
		this.test();
	},
	update:function(){
		if(this.isPlaying){
			this.secTimer-=this.time.elapsed;
			if(this.secTimer<0){
				this.secTimer=this.secTimeInterval;
				this.respawnParachute();
			}
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			// this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.gameOver,this);
			// this.input.keyboard.addKey(Phaser.Keyboard.S).onDown.add(function(){this.score=this.curLevelInfo.nextLevel-1;this.nextLevel=this.curLevelInfo.nextLevel;},this);
			// this.curLevel=this.M.H.getQuery('level')||1;this.curLevelInfo=this.LevelInfo[this.curLevel];
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		// TODO
		this.setPhysics();
		this.setCharInfo();
		this.genParachute();

		this.genBtns();
		this.genHUD();
	},
	setPhysics:function(){
		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.setImpactEvents(!0);
		this.physics.p2.restitution=.8;
		this.ParachuteCollisionGroup=this.physics.p2.createCollisionGroup();
		this.FloorCollisionGroup=this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();
	},
	setCharInfo:function(){
		this.curCharList={1:9,2:3,3:25,4:1};//TODO TEST
		for(var k in this.curCharList){
			// TODO
			// this.charKeysArr.push();//TODO
		}
		this.charKeysArr=['todo_2','todo_3','todo_4','todo_5'];//TODO del
	},
	genParachute:function(){
		this.Parachute=this.add.group();
		this.Parachute.physicsBodyType=Phaser.Physics.P2JS;
		this.Parachute.enableBody=!0;
		// this.Parachute.createMultiple(5,this.charKeysArr);//TODO
		this.Parachute.createMultiple(1,this.charKeysArr);//TODO
		this.Parachute.forEach(function(s){
			s.smoothed=!1;
			s.outOfBoundsKill=!0;
			s.checkWorldBounds=!0;
			s.body.setCollisionGroup(this.ParachuteCollisionGroup);
			s.body.collides(this.FloorCollisionGroup);
			s.body.collideWorldBounds=!0;
			for(var k in this.charKeysArr)if(s.key==this.charKeysArr[k])s.charListNum=Number(k)+1;
		},this);
	},
	respawnParachute:function(){
		var s=this.rnd.pick(this.Parachute.children.filter(function(e){return!e.alive}));
		if(s){
			s.reset(this.world.randomX,s.height);
			// TODO
			// s.body.velocity.y=500;
			// s.body.damping=.5;
			s.body.setZeroRotation();
			s.body.debug=!0;

			this.appearCharList[s.charListNum].push(s);
			console.log(this.appearCharList);
		}
	},
	genBtns:function(){
		//TODO
		var y=this.world.height*.9;
		for(var i=0;i<4;i++){
			var x=i*100+50;
			var b=this.add.button(x,y,'todo_1',this.shoot,this);//TODO
			b.anchor.setTo(.5);
			b.width=90;
			b.height=90;
			b.charNum=this.curCharList[i+1];
			b.charListNum=i+1;
		}
	},
	shoot:function(b){
		// TODO
		// console.log(this.CharInfo[b.charNum]);
		// console.log(this.appearCharList[b.charListNum]);
		// console.log(this.appearCharList[b.charListNum][0]);

		var list=this.appearCharList[b.charListNum];
		var s=list[0];
		if(s){
			s.kill();
			// TODO score++
			list.shift();
		}

	},
	genHUD:function(){
		this.HUD=this.add.group();

		//TODO
		// this.ScoreTS=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.curWords.Score+this.score,this.M.S.txtstyl(30));
		// this.HUD.add(this.ScoreTS);

		this.HPTS=this.M.S.genTxt(this.world.width*.2,this.world.height*.05,'HP: '+this.hp,this.M.S.txtstyl(30));
		this.HUD.add(this.HPTS);
		// this.HUD.visible=!1;//TODO
	},

	// TODO
	///////////////////////////////////////
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
		var s=this.M.S.genTxt(this.world.centerX,-this.world.centerY,this.curWords.Start,txtstyl);
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY},duration:800});
		var twB=this.add.tween(s).to({y:this.world.height*1.5},600,Phaser.Easing.Back.In,!1,300);
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(function(){this.inputEnabled=!0},this);
		twA.onComplete.add(function(){this.destroy},s);
		// this.M.SE.play('GenStart',{volume:1});//TODO
		this.HUD.visible=!0;
		this.start();
	},
};