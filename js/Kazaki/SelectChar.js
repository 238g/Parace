BasicGame.SelectChar=function(){};
BasicGame.SelectChar.prototype={
	init:function(){
		this.curChar=this.M.gGlb('curChar');
		this.CharInfo=this.M.gGlb('CharInfo');

		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.M.SE.playBGM('TitleBGM',{volume:2});
		this.add.sprite(0,0,'Bg_1');

		this.M.S.genTxt(this.world.centerX,this.world.height*.15,this.curWords.SelectChar,this.M.S.txtstyl(35));

		var baseX=this.world.width*.75;
		var baseY=this.world.height*.4;
		var marginY=this.world.height*.3;
		var baseTSY=this.world.height*.5;
		var c=0;
		for(var k in this.CharInfo){
			var info=this.CharInfo[k];
			if(info.closed)continue;
			var even=k%2;
			x= baseX-(this.world.centerX*(even));
			var b=this.add.button(x,baseY+marginY*c,info.introImg,this.select,this);
			b.char=k;
			b.anchor.setTo(.5);
			this.M.S.genTxt(x,baseTSY+marginY*c,info.name);
			if(k==2)c++;
		}

		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
	},
	select:function(b){
		if (!this.Tween.isRunning) {
			this.curChar=b.char;
			this.M.sGlb('curChar',this.curChar);

			// this.M.SE.play('OnBtn',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectStage')},this);
			this.Tween.start();
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			// this.M.SE.play('Enter',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Title')},this);
			this.Tween.start();
		}
	},
	genHUD:function(){
		var y=this.world.height*.05;
		this.M.S.genVolBtn(this.world.width*.1,y);
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};