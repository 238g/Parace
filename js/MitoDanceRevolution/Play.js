BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){
		// Game
		this.isPlaying=!1;

		// Conf
		this.curStage=this.M.gGlb('curStage');
		this.StageInfo=this.M.gGlb('StageInfo');
		this.curStageInfo=this.StageInfo[this.curStage];
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		// Var
		this.curRespawn=0;
		this.curReach=0;

		this.leftCount=this.curStageInfo.respawnList.length;

		this.baseTimer=300;
		this.baseCounter=0;

		// Obj
		this.MitoSprite
		this.TutSprite=
		this.MouseSprite=
		this.LeftCountTxtSprite=
		null;
	},
	create:function(){
		this.time.events.removeAll();

		this.M.SE.playBGM(this.curStage==3?'PlayBGM_2':'PlayBGM_1',{volume:this.curStage==3?.8:1});

		this.add.sprite(0,0,'Bg_1');

		this.MitoSprite=this.add.sprite(this.world.centerX,this.world.centerY,'MitoDance_'+this.curStage);
		this.MitoSprite.anchor.setTo(.5);
		this.MitoSprite.scale.setTo(2);
		if(this.rnd.between(1,100)<50)this.MitoSprite.scale.x*=-1;
		this.MitoSprite.animations.add('dancing');

		this.LeftCountTxtSprite=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.leftCount,this.M.S.txtstyl(50));

		this.add.sprite(0,0,'SpotLight_1');
		this.M.gGlb('endTut')?this.start():this.tut();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.baseTimer-=this.time.elapsed;
			if(this.baseTimer<0){
				this.baseTimer=300;
				this.baseCounter++;
				this.respawn();
			}
		}
	},
	start:function(){
		this.MitoSprite.animations.play('dancing',this.curStageInfo.animSpeed,!0);

		var s=this.add.sprite(this.world.centerX,this.world.centerY,'Start');
		s.anchor.setTo(.5);
		s.scale.setTo(2);
		var tw=this.M.T.fadeOutA(s,{duration:200});
		tw.yoyo(!0);
		tw.repeat(4);
		tw.onComplete.add(function(){
			this.destroy();
		},s);
		tw.onComplete.add(function(){
			this.isPlaying=!0;
			this.M.sGlb('playCount',(this.M.gGlb('playCount')+1));
		},this);
		tw.start();
	},
	tut:function(){
		this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
		this.TutSprite.anchor.setTo(.5);
		this.TutSprite.tint=0x000000;
		this.input.onDown.addOnce(function(){
			this.M.SE.play('OnBtn',{volume:1});
			this.TutSprite.destroy();
			this.M.sGlb('endTut',!0);
			this.start();
		},this);
		this.TutSprite.addChild(this.add.sprite(0,this.world.height*.3,'Start'));
		this.TutSprite.addChild(this.M.S.genTxt(0,0,this.curWords.HowTo,this.M.S.txtstylS(20)));
	},
	end:function(){
		this.isPlaying=!1;
		this.MitoSprite.animations.stop('dancing');
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,'CLEAR!',this.M.S.txtstylS(60));
		ts.angle=-10;
		this.M.SE.play('Clear',{volume:2});
		this.time.events.add(1500,this.genRes,this);
	},
	gameover:function(){
		this.isPlaying=!1;
		this.MitoSprite.animations.stop('dancing');
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,'GAME OVER',this.M.S.txtstylS(60));
		ts.angle=-10;
		this.M.SE.play('Again',{volume:2});

		this.time.events.add(1E3,function(){
			var a=this.add.sprite(0,this.world.height*.98,'Mito_Face_1');
			a.anchor.setTo(0,1);
			var b=this.add.sprite(this.world.width,0,'Mito_Face_1');
			b.anchor.setTo(1);
			b.scale.y*=-1;
			// this.add.button(this.world.width*.25,this.world.height*.8,'Start',this.again,this).anchor.setTo(.5);
			this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.again,this.curWords.Again);
			this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.back,this.curWords.Back);
		},this);
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function(){this.end();},this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(function(){this.gameover();},this);
		}
	},
	////////////////////////////////////// PlayContents
	again:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('Play');
		myGa('restart','Play','Stage_'+this.curStage,this.M.gGlb('playCount'));
	},
	respawn:function(){
		if(this.baseCounter==this.curReach)return this.gameover();

		if(this.baseCounter==this.curStageInfo.respawnList[this.curRespawn]){
			this.curRespawn++;
			this.curReach=this.baseCounter+this.curStageInfo.reach;

			this.M.SE.play('A_'+this.rnd.integerInRange(1,6),{volume:2});

			this.MouseSprite=this.add.button(
				this.world.randomX*this.curStageInfo.rndRangeRate+this.curStageInfo.rndMarginX,
				this.world.randomY*this.curStageInfo.rndRangeRate+this.curStageInfo.rndMarginY,
				'Mouse',this.clickMouse,this);
			this.MouseSprite.anchor.setTo(.5);
			this.MouseSprite.scale.setTo(this.curStageInfo.mouseScale);
		}
	},
	clickMouse:function(){
		if(this.isPlaying){
			this.curReach=0;
			this.M.SE.play('Click',{volume:2});
			this.MouseSprite.destroy();
			this.leftCount--;
			this.LeftCountTxtSprite.changeText(this.leftCount);
			if(this.leftCount==0)this.end();
		}
	},
	genRes:function(){
		var s=this.add.sprite(0,0,'TWP');
		s.tint=0x000000;
		s.alpha=0;
		this.M.T.fadeInA(s,{delay:500,duration:800,alpha:1}).start();

		s.addChild(
			this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curStageInfo.name+this.curWords.Clear,this.M.S.txtstyl(25))
		);
		s.addChild(
			this.M.S.genLbl(this.world.width*.7,this.world.height*.6,this.tweet,this.curWords.Tweet,this.M.S.txtstyl(25))
		);
		s.addChild(
			this.M.S.genLbl(this.world.width*.7,this.world.height*.7,this.back,this.curWords.Back,this.M.S.txtstyl(25))
		);
		s.addChild(
			this.M.S.genLbl(this.world.width*.7,this.world.height*.8,this.yt,'YouTube',this.M.S.txtstyl(25))
		);
		
		var a=this.add.sprite(0,this.world.height,'Mito_Face_2');
		a.anchor.setTo(0,1);
		var b=this.add.sprite(this.world.width,0,'Mito_Face_2');
		b.anchor.setTo(1);
		b.scale.y*=-1;
	},
	back:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('SelectStage');
		myGa('back','Play','toSelectStage',this.M.gGlb('playCount'));
	},
	yt:function(){
		this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.YOUTUBE_URL,'_blank');
		} else {
			location.href=BasicGame.YOUTUBE_URL;
		}
		myGa('youtube','Play','',this.M.gGlb('playCount'));
	},
	tweet:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var emoji1='💃🖱💃🖱💃🖱💃';
		var emoji2='🐰🌕🐰🌕🐰🌕🐰';
		var res=this.curStageInfo.name+this.curWords.Clear;
		var txt=this.curWords.TweetTtl+'\n'
				+emoji1+'\n'
				+res+'\n'
				+emoji2+'\n';
		var hashtags='みとゲーム';
		this.M.H.tweet(txt,hashtags,location.href);
		myGa('tweet','Play','',this.M.gGlb('playCount'));
	},
};
