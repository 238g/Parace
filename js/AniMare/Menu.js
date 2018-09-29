BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		// Obj
		this.StartTS=this.LangTS=this.IntroTS=this.CreditTS=null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		this.showBg();
		this.rain();
		
		var title=this.add.sprite(this.world.centerX,this.world.height*.92,'Title');
		title.anchor.setTo(.5);
		// this.M.T.beatA(title,{duration:182}).start();

		this.StartTS=this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		////// this.IntroTS=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.gotoIntro,this.curWords.IntroBtn,this.M.S.txtstyl(25));
		////// this.LangTS=this.M.S.genLbl(this.world.centerX,this.world.height*.9,this.chgLang,this.curWords.Lang,this.M.S.txtstyl(25));
		////// this.CreditTS=this.M.S.genLbl(this.world.centerX,this.world.height*.9,this.gotoCredit,'Credit',this.M.S.txtstyl(25));
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	showBg:function(){
		var g=this.add.group();
		for(var i=1;i<=10;i++){
			var s=this.add.sprite(0,0,'Bg_'+i);
			s.alpha=0;
			g.add(s);
		}
		g.shuffle();
		this.M.T.slideshow(g,{duration:2E3,delay:2E3});
	},
	rain:function(){
		var x=0,minX=200,maxX=500;
		if(this.rnd.between(0,100)<50)x=this.world.width,minX=-500,maxX=-200;
		var e=this.add.emitter(x,this.world.centerY,100);
		e.height=this.world.height;
		e.makeParticles(['Player_1','Player_2','Player_3','Player_4','Player_5','Nanashi_1']);
		e.minParticleScale=.5;
		e.maxParticleScale=1;
		e.setXSpeed(minX,maxX);
		e.start(!1,2E3,this.time.physicsElapsedMS*5,0);
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
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
				this.Tween.start();
			}
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	chgLang:function(){
		if(this.curLang=='en'){
			this.curLang='jp';
			this.M.sGlb('curLang',this.curLang);
			this.curWords=this.Words[this.curLang];
		}else{
			this.curLang='en';
			this.M.sGlb('curLang',this.curLang);
			this.curWords=this.Words[this.curLang];
		}
		//////// this.StartTS.changeText(this.curWords.Start);
		//////// this.CharTwTS.changeText(this.curWords.CharTw);
		//////// this.LangTS.changeText(this.curWords.Lang);
		//////// this.M.SE.play('OnBtn',{volume:1});
	},
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
BasicGame.SelectChar=function(){};
BasicGame.SelectChar.prototype={
	init:function(){
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		var x=this.rnd.between(1,100)>50?this.world.width*1.5:-this.world.centerX;
		var y=this.world.height*.2;
		for(var k in this.CharInfo){
			var info=this.CharInfo[k];
			var s=this.add.button(x,y,'Select_'+k,this.select,this);
			s.anchor.setTo(.5);
			s.char=k;
			s.onInputOver.add(function(b){b.alpha=.8});
			s.onInputOut.add(function(b){b.alpha=1});
			this.M.T.moveA(s,{xy:{x:this.world.centerX},delay:k*200}).start();
			y+=s.height;
		}

		this.add.sprite(this.world.centerX,this.world.height*.065,'Select').anchor.setTo(.5);
		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
	},
	select:function(b){
		if (!this.Tween.isRunning) {
			this.M.sGlb('curChar',b.char);
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('play','SelectChar','Char_'+b.char,this.M.gGlb('playCount'));
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