BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;

		// Conf
		this.FishInfo=this.M.gGlb('FishInfo');

		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		// Var
		this.ROD_ANCHOR_Y=.8;

		this.curMode='menu';
		this.canMoveRod=!1;
		this.canFish=!1;

		this.fishingCounter=0;

		this.fishPlace='left';

		this.curFish=1;

		this.sumRate=0;

		this.FishTextList=[];

		// Obj
		this.Rod=
		this.Float=
		this.FishingCounterTextSprite=
		this.ResSprite=
		this.FishSprite=
		this.FishNameTextSprite=
		this.MissTextSprite=
		this.ArrowLeftSprite=
		this.ArrowRightSprite=
		this.HitTextSprite=
		this.CharSprite=
		null;
		this.FloatTween=
		this.SplashesSE=
		{};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(BasicGame.WHITE_COLOR);
		this.M.SE.playBGM('BGM',{volume:1});
		this.genContents();
		for(var k in this.FishInfo)this.sumRate+=this.FishInfo[k].rate;
		this.inputHandler();

		this.M.gGlb('endTut')?this.ready():this.tut();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			if(this.canMoveRod){
				this.Rod.rotation=this.physics.arcade.angleBetween(this.Rod,this.input.activePointer)+1.5;
			}else{
				if(this.curMode=='hitting'){
					this.Rod.rotation=this.physics.arcade.angleBetween(this.Rod,this.Float)+1.5;
				}
			}
		}
	},
	tut:function(){
		this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
		this.TutSprite.anchor.setTo(.5);
		this.TutSprite.tint=0x000000;
		this.input.onDown.addOnce(function(){
			this.M.SE.play('OnBtn',{volume:1});
			this.TutSprite.destroy();
			this.M.sGlb('endTut',!0);
			this.ready();
		},this);
		this.TutSprite.addChild(this.M.S.genTxt(0,0,this.curWords.HowTo,this.M.S.txtstyl(25)));
	},
	ready:function(){
		var txtstyl=this.M.S.txtstyl(80);
		txtstyl.fill=txtstyl.mStroke='#FF0040';
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,'START',txtstyl);
		ts.scale.setTo(0);
		var tw=this.M.T.popUpB(ts);
		tw.onComplete.add(function(){
			this.destroy();
		},ts);
		tw.onComplete.add(this.start,this);
		tw.start();
	},
	start:function(){
		this.time.events.removeAll();
		this.isPlaying=this.inputEnabled=this.canMoveRod=!0;
		this.ResSprite.visible=this.ResGroup.visible=this.MissTextSprite.visible=!1;
		this.ResSprite.alpha=0;
		this.curMode='searching';
		this.CastTextSprite.visible=!0;
		this.CharSprite.loadTexture('Ichigo_1');
	},
	end:function(){
		this.isPlaying=!1;
		this.inputEnabled=!1;
		this.FloatTween.isRunning&&this.FloatTween.stop();
		this.curMode='menu';
		this.ResSprite.visible=!0;

		this.Float.visible=
		this.HitTextSprite.visible=this.BlowTextSprite.visible=
		this.ArrowLeftSprite.visible=this.ArrowRightSprite.visible=!1;

		var tw=this.M.T.fadeInA(this.ResSprite,{duration:500,alpha:1,delay:800});
		tw.onComplete.add(function(){
			this.HitTextSprite.visible=!1;
			this.inputEnabled=!0;
			this.time.events.removeAll();
		},this);
		tw.start();

		this.M.SE.play('GetFish',{volume:1});
		this.SplashesSE.isPlaying&&this.SplashesSE.stop();
	},
	catch:function(){
		if(this.isPlaying){
			this.end();
			this.ResGroup.visible=!0;

			var info=this.FishInfo[this.curFish];
			info.catch+=1;

			this.FishSprite.loadTexture('Fish_'+this.curFish);
			this.FishNameTextSprite.changeText(info.name);

			this.CharSprite.loadTexture('Ichigo_3');
			
			for(var k in this.FishInfo){
				var info=this.FishInfo[k];
				if(info.catch>0){
					var s=this.FishTextList[k];
					s.changeText(info.name+': '+info.catch+this.curWords.TweetResBack);
					s.visible=!0;
				}
			}
		}
	},
	miss:function(){
		if(this.isPlaying){
			this.end();
			this.MissTextSprite.visible=!0;
			
			this.CharSprite.loadTexture('Ichigo_4');
			this.M.SE.play('Miss',{volume:2});
		}
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.catch,this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.miss,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.add.sprite(0,0,'PlayBg_1');

		this.Rod=this.add.sprite(this.world.centerX,this.world.height,'Rod');
		this.Rod.anchor.setTo(.5,this.ROD_ANCHOR_Y);

		this.Float=this.add.sprite(0,0,'Float_1');
		this.Float.anchor.setTo(.5);
		this.Float.visible=!1;

		var txtstyl=this.M.S.txtstyl(35);
		txtstyl.fill=txtstyl.mStroke='#01DF3A';
		this.FishingCounterTextSprite=this.M.S.genTxt(this.world.centerX,this.world.height*.08,'',txtstyl);

		this.ArrowLeftSprite=this.add.sprite(this.world.width*.3,this.world.centerY,'Arrow');
		this.ArrowLeftSprite.scale.setTo(-1,1);
		this.ArrowRightSprite=this.add.sprite(this.world.width*.7,this.world.centerY,'Arrow');
		this.ArrowLeftSprite.visible=this.ArrowRightSprite.visible=!1;
		
		txtstyl=this.M.S.txtstyl(60);
		txtstyl.fill=txtstyl.mStroke='#FF00FF';
		this.BlowTextSprite=this.M.S.genTxt(this.world.width*.2,this.world.height*.8,this.curWords.Blow,txtstyl);
		this.BlowTextSprite.visible=!1;
		this.M.T.beatA(this.BlowTextSprite,{duration:150}).start();

		txtstyl=this.M.S.txtstyl(70);
		txtstyl.fill=txtstyl.mStroke='#FFBF00';
		this.HitTextSprite=this.M.S.genTxt(this.world.centerX,this.world.height*.3,'HIT!!',txtstyl);
		this.HitTextSprite.visible=!1;

		txtstyl=this.M.S.txtstylS(15);
		txtstyl.align='left';
		txtstyl.fill=txtstyl.mStroke='#0B0B61';
		for(var k in this.FishInfo){
			var info=this.FishInfo[k];
			var s=this.M.S.genTxt(this.world.width*.01,this.world.height*.05*k-this.world.height*.04,info.name+': '+info.catch+this.curWords.TweetResBack,txtstyl);
			s.anchor.setTo(0);
			s.children[0].anchor.setTo(0);
			s.visible=(info.catch>0);
			this.FishTextList[k]=s;
		}

		txtstyl=this.M.S.txtstyl(25);
		txtstyl.fill=txtstyl.mStroke='#01DF01';
		this.CastTextSprite=this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.Cast,txtstyl);
		this.CastTextSprite.visible=!1;

		this.CharSprite=this.add.sprite(this.world.width,this.world.height,'Ichigo_1');
		this.CharSprite.anchor.setTo(1);

		this.genResContent();
	},
	inputHandler:function(){
		this.input.onDown.add(function(p){
			if(this.isPlaying&&this.inputEnabled){
				switch(this.curMode){
					case 'searching':this.searchingMode();break;
					case 'waiting':this.waitingMode();break;
					case 'hitting':this.hittingMode(p);break;
					default://menu
				}
			}
		},this);
	},
	searchingMode:function(){
		this.inputEnabled=!1;
		this.canMoveRod=!1;
		this.Rod.rotation=this.physics.arcade.angleBetween(this.Rod,this.input.activePointer)+1.5;
		
		this.CastTextSprite.visible=!1;
		
		this.M.sGlb('playCount',(this.M.gGlb('playCount')+1));

		var d=this.Rod.height*this.ROD_ANCHOR_Y;
		var a=this.Rod.angle-90;
		var c=d*Math.cos(a*(Math.PI/180));
		var s=d*Math.sin(a*(Math.PI/180));
		this.Float.x=this.Rod.x+c;
		this.Float.y=this.Rod.y+s;
		this.Float.visible=!0;

		this.M.SE.play('Cast',{volume:3});

		var twA=this.M.T.moveA(this.Float,{xy:{x:c>=0?'+'+c:c.toString(),y:s>=0?'+'+s:s.toString()}});
		twA.onComplete.add(function(){
			this.Float.loadTexture('Float_2');
			this.curMode='waiting';
			this.inputEnabled=!0;
			var time=this.rnd.between(1000,3000);
			this.time.events.add(time,function(){
				if(this.isPlaying){
					this.Float.loadTexture('Hit_1');
					this.canFish=!0;
					this.HitTextSprite.visible=!0;
					this.M.SE.play('Water_'+this.rnd.integerInRange(1,3),{volume:2});
					this.CharSprite.loadTexture('Ichigo_2');
				}
			},this);
			this.time.events.add(time+this.FishInfo[this.curFish].waitTime,function(){
				if(this.isPlaying&&this.canFish)this.miss();
			},this);

			this.M.SE.play('Water_'+this.rnd.integerInRange(1,3),{volume:2});
		},this);
		twA.start();
	},
	waitingMode:function(){
		if(this.canFish){
			this.canFish=!1;
			this.curMode='hitting';
			this.Float.loadTexture('Hit_2');

			this.HitTextSprite.visible=!1;

			this.curFish=this.rndFish();

			var info=this.FishInfo[this.curFish];
			this.fishingCounter=this.rnd.integerInRange(info.countMin,info.countMax);
			this.FishingCounterTextSprite.changeText(this.fishingCounter+'m');

			this.tweenYoyoFloat();

			if(this.Float.x<this.world.centerX){
				this.fishPlace='left';
				this.ArrowLeftSprite.visible=!0;
				this.ArrowRightSprite.visible=!1;
				this.BlowTextSprite.x=this.world.width*.2;
			}else{
				this.fishPlace='right';
				this.ArrowLeftSprite.visible=!1;
				this.ArrowRightSprite.visible=!0;
				this.BlowTextSprite.x=this.world.width*.8;
			}

			this.BlowTextSprite.visible=!0;

			this.changeLR();


			this.M.SE.play('Fishing',{volume:.8});
			this.SplashesSE=this.M.SE.play('Splashes',{volume:1,loop:!0});
		}else{
			this.canFish=!1;
			this.miss();
		}
	},
	rndFish:function(){
		var target=this.rnd.integerInRange(1,this.sumRate+this.M.gGlb('playCount'));
		for(var k in this.FishInfo){
			var rate=this.FishInfo[k].rate;
			if(target<=rate||k==6)return k;
			target-=rate;
		}
	},
	tweenYoyoFloat:function(){
		this.FloatTween=this.M.T.moveB(this.Float,{xy:{x:'-50'},duration:this.FishInfo[this.curFish].floatMvTw});
		this.FloatTween.loop(!0);
		this.FloatTween.yoyo(!0);
		this.FloatTween.onRepeat.add(function(){
			this.Float.scale.x*=-1;
		},this);
		this.FloatTween.onLoop.add(function(){
			this.Float.scale.x*=-1;
		},this);
		this.FloatTween.start();
	},
	changeLR:function(){
		this.time.events.add(this.FishInfo[this.curFish].LRTime,function(){
			if(this.curMode=='hitting'){
				if(this.fishPlace=='left'){
					this.fishPlace='right';
					this.ArrowLeftSprite.visible=!1;
					this.ArrowRightSprite.visible=!0;
					this.BlowTextSprite.x=this.world.width*.8;
				}else{
					this.fishPlace='left';
					this.ArrowLeftSprite.visible=!0;
					this.ArrowRightSprite.visible=!1;
					this.BlowTextSprite.x=this.world.width*.2;
				}
				this.FloatTween.stop();
				var tw=this.M.T.moveB(this.Float,{xy:{x:this.world.width-this.Float.x},duration:200});
				tw.onComplete.add(this.tweenYoyoFloat,this);
				tw.start();
				this.changeLR();
			}
		},this);
	},
	hittingMode:function(p){
		if((this.fishPlace=='left'&&p.x<this.world.centerX)||(this.fishPlace=='right'&&p.x>=this.world.centerX)){
			this.fishingCounter--;
			this.FishingCounterTextSprite.changeText(this.fishingCounter+'m');

			if(this.fishingCounter==0)this.catch();
		}
	},
	genResContent:function(){
		var tsl=this.M.S.txtstyl(25);

		this.ResSprite=this.add.sprite(0,0,'TWP');
		this.ResSprite.tint=0x000000;
		this.ResSprite.alpha=0;
		this.ResSprite.visible=!1;

		this.ResSprite.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.1,'',this.M.S.txtstyl(50)));
		this.ResSprite.addChild(this.M.S.genLbl(this.world.width*.83,this.world.centerY,this.restart,this.curWords.Again,tsl));
		this.ResSprite.addChild(this.M.S.genLbl(this.world.width*.17,this.world.height*.75,this.tweet,this.curWords.Tweet,tsl));
		this.ResSprite.addChild(this.M.S.genLbl(this.world.width*.83,this.world.height*.75,this.back,this.curWords.Back,tsl));
		this.ResSprite.addChild(this.M.S.genLbl(this.world.width*.17,this.world.height*.9,this.yt,'YouTube',tsl));
		this.ResSprite.addChild(this.M.S.genLbl(this.world.width*.83,this.world.height*.9,this.onOtherGames,this.curWords.OtherGames,tsl));
		var f=this.add.sprite(this.world.centerX,this.world.centerY,'Frame');
		f.anchor.setTo(.5);
		this.ResSprite.addChild(f);

		this.ResGroup=this.add.group();
		this.ResGroup.visible=!1;

		this.FishSprite=this.add.sprite(this.world.centerX,this.world.centerY,'');
		this.FishSprite.anchor.setTo(.5);
		this.ResGroup.add(this.FishSprite);

		this.FishNameTextSprite=this.M.S.genTxt(this.world.centerX,this.world.height*.2,'',this.M.S.txtstyl(30));
		this.FishNameTextSprite.anchor.setTo(.5);
		this.ResGroup.add(this.FishNameTextSprite);

		this.MissTextSprite=this.M.S.genTxt(this.world.centerX,this.world.centerY,'MISS!!',this.M.S.txtstyl(50));
		this.MissTextSprite.anchor.setTo(.5);
		this.MissTextSprite.visible=!1;
	},
	restart:function(){
		if(!this.inputEnabled)return;
		this.M.SE.play('OnBtn',{volume:1});
		this.Float.loadTexture('Float_1');
		this.FishingCounterTextSprite.changeText('');
		this.start();
		myGa('restart','Play','',this.M.gGlb('playCount'));
	},
	tweet:function(){
		if(!this.inputEnabled)return;
		this.M.SE.play('OnBtn',{volume:1});
		var emoji='🎣🎣🎣🎣🎣🎣';
		var res=this.curWords.TweetResDefault;
		var resTxt='';
		var resCount=0;
		for(var k in this.FishInfo){
			var info=this.FishInfo[k];
			if(info.catch>0){
				resTxt+=info.name+': '+info.catch+this.curWords.TweetResBack+'\n';
				resCount++;
			}
		}
		if(resCount>0)res=this.curWords.TweetResTop+'\n'+resTxt;
		var txt=this.curWords.TweetTtl+'\n'
				+emoji+'\n'
				+res
				+emoji+'\n';
		var ht=this.curWords.TweetHT;
		this.M.H.tweet(txt,ht,location.href);
		myGa('tweet','Play','',this.M.gGlb('playCount'));
	},
	back:function(){
		if(!this.inputEnabled)return;
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Title');
		myGa('back','Play','toTitle',this.M.gGlb('playCount'));
	},
	yt:function(){
		if(!this.inputEnabled)return;
		this.M.SE.play('OnBtn',{volume:1});
		window.open(BasicGame.YOUTUBE_URL,'_blank');
		myGa('youtube','Play','',this.M.gGlb('playCount'));
	},
	onOtherGames:function(){
		if(!this.inputEnabled)return;
		this.M.SE.play('OnBtn',{volume:1});
		window.open(BasicGame.MY_GAMES_URL,'_blank');
		myGa('othergames','Play','',this.M.gGlb('playCount'));
	},
};
