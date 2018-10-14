BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		// Obj
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		
		this.rainBg();
		
		var title=this.add.sprite(this.world.centerX,this.world.height*.7,'Title');
		title.anchor.setTo(.5);
		this.M.T.stressA(title).start();

		this.M.S.genLbl(this.world.centerX,this.world.height*.9,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	rainBg:function(){
		var arr=[];
		for(var i=1;i<=41;i++)arr.push('Bg_'+i);
		var e=this.add.emitter(this.world.centerX,0,82);
		e.width=this.world.width;
		e.makeParticles(arr);
		e.setRotation(0,0);
		e.minParticleSpeed.set(0,300);
		e.maxParticleSpeed.set(0,500);
		e.gravity=-200;
		e.start(!1,4E3,this.time.physicsElapsedMS*30,0);
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
		this.LevelInfo=this.M.gGlb('LevelInfo');
		this.BGMTS=null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});

		this.M.S.genTxt(this.world.centerX,this.world.height*.08,this.curWords.Select,this.M.S.txtstyl(40));
		this.genLevelList();
		if(this.M.gGlb('endTut')){
			var b=this.add.button(this.world.width*.25,this.world.height*.75,'Otomemaru_2',this.select,this);
			b.anchor.setTo(.5);
			b.level=11;
			this.M.S.genTxt(this.world.width*.6,this.world.height*.75,'<< '+this.curWords.TwMode);
		}else{
			this.add.button(this.world.centerX,this.world.height*.8,'YuNi_2',this.yt,this).anchor.setTo(.5);
		}
		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
	},
	genLevelList:function(){
		var mY=this.world.height*.1;
		var lX=this.world.width*.25;
		var rX=this.world.width*.75;
		var count=0;
		for(var k in this.LevelInfo){
			if(k==11)continue;
			if(k%2==0){
				this.M.S.genLbl(rX,mY+mY+mY*count,this.select,'Level '+k).level=k;
				count++;
			}else{
				this.M.S.genLbl(lX,mY+mY+mY*count,this.select,'Level '+k).level=k;
			}
		}
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
	yt:function(){
		if(!this.Tween.isRunning){
			this.M.SE.play('OnBtn',{volume:1});
			var url=BasicGame.YOUTUBE_URL;
			this.game.device.desktop?window.open(url,"_blank"):location.href=url;
			myGa('youtube','SelectLevel','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};