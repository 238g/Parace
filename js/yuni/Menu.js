BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		// Obj
		this.StartTS=
		////// this.IntroTS=this.CreditTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		
		// this.sliderBg();
		
		var title=this.add.sprite(this.world.centerX,this.world.height*.92,'Title');
		title.anchor.setTo(.5);

		this.StartTS=this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		////// this.IntroTS=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.gotoIntro,this.curWords.IntroBtn,this.M.S.txtstyl(25));
		////// this.CreditTS=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.gotoCredit,'Credit',this.M.S.txtstyl(25));
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	sliderBg:function(){
		// TODO slide show
		// movie thumbnail and movie title
		var arr=['SlideBg_1','SlideBg_2','SlideBg_3'];
		for(var k in arr){
			var s=this.add.sprite(0,0,arr[k]);
			s.visible=!1;
			// TODO TS
		}
		//TODO...
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectLevel')},this);
				this.Tween.start();
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	//TODO del?
	gotoIntro:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url='';
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('external_link','Title','AAAAAAAA Page',this.M.gGlb('playCount'));
	},
	gotoCredit:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var url='https://238g.github.io/Parace/238Games2.html?page=credit';
		this.game.device.desktop?window.open(url,"_blank"):location.href=url;
		myGa('external_link','Title','Credit',this.M.gGlb('playCount'));
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
BasicGame.SelectLevel=function(){};
BasicGame.SelectLevel.prototype={
	init:function(){
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		// this.curLevel=this.M.gGlb('curLevel');
		this.LevelInfo=this.M.gGlb('LevelInfo');
		// this.curStageInfo=this.StageInfo[this.curLevel];
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});

		//TODO this.curWords.Select;

		// TODO level label list

		this.add.sprite(this.world.centerX,this.world.height*.065,'Select').anchor.setTo(.5);
		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
	},
	select:function(b){
		if (!this.Tween.isRunning) {
			this.M.sGlb('curLevel',b.level);
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('play','SelectLevel','Level_'+b.level,this.M.gGlb('playCount'));
			this.M.SE.play('OnStart',{volume:1});
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
			this.Tween.start();
			this.M.SE.play('OnBtn',{volume:1});
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};