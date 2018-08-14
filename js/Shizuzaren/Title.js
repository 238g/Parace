BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.Tween={};
		this.HowToSprite=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(BasicGame.WHITE_COLOR);
		// this.M.SE.playBGM('BGM',{volume:1});

		this.add.sprite(0,0,'Bg_1');
		this.add.sprite(this.world.width*.1,0,'Gilzaren_1').anchor.setTo(.5,.65);
		this.add.sprite(this.world.width*.9,0,'Gilzaren_1').anchor.setTo(.5,.65);

		this.M.S.genTxt(this.world.centerX,this.world.height*.2,BasicGame.GAME_TITLE,this.M.S.txtstyl(40));

		var lx=this.world.width*.25;
		var rx=this.world.width*.75;
		var tx=this.M.S.txtstyl(25);

		this.M.S.genLbl(lx,this.world.height*.72,this.start,this.curWords.Start,tx);
		this.M.S.genLbl(rx,this.world.height*.72,this.howto,this.curWords.HowTo,tx);

		this.M.S.genLbl(lx,this.world.height*.82,this.othg,this.curWords.OtherGames,tx);
		this.M.S.genLbl(rx,this.world.height*.82,this.oth,this.curWords.SikiMaru,tx);

		this.M.S.genLbl(lx,this.world.height*.92,this.yt1,this.curWords.ShizukaYt,tx);
		this.M.S.genLbl(rx,this.world.height*.92,this.yt2,this.curWords.GilzYt,tx);

		this.HowToSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
		this.HowToSprite.tint=0x000000;
		this.HowToSprite.visible=!1;
		this.HowToSprite.anchor.setTo(.5);
		var ts=this.M.S.genTxt(0,0,this.curWords.HowToText);
		this.HowToSprite.addChild(ts);
		this.input.onDown.add(function(){
			if(this.HowToSprite.visible){
				this.HowToSprite.visible=!1;
				this.inputEnabled=!0;
			}
		},this);

		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	start:function(){
		if(this.inputEnabled){
			if(!this.Tween.isRunning){
				this.inputEnabled=!1;
				// this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:1E3,alpha:1});
				this.Tween.onComplete.add(function(){
					this.M.NextScene('Play');
				},this);
				this.Tween.start();
				this.M.sGlb('playCount',(this.M.gGlb('playCount')+1));
				myGa('start','Title','toPlay',this.M.gGlb('playCount'));
			}
		}else{
			// this.M.SE.playBGM('BGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	howto:function(){
		this.inputEnabled=!1;
		this.HowToSprite.visible=!0;
	},
	othg:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			window.open(__VTUBER_GAMES,'_blank');
			myGa('othergames','Title','othergames',this.M.gGlb('playCount'));
		}
	},
	oth:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			window.open(BasicGame.TW_URL,'_blank');
			myGa('contributor','Title','四季丸.@sikimaru69',this.M.gGlb('playCount'));
		}
	},
	yt1:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			window.open(BasicGame.YOUTUBE_URL_1,'_blank');
			myGa('youtube','Title','youtube_1',this.M.gGlb('playCount'));
		}
	},
	yt2:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			window.open(BasicGame.YOUTUBE_URL_2,'_blank');
			myGa('youtube','Title','youtube_2',this.M.gGlb('playCount'));
		}
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
