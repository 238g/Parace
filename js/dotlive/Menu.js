BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.tickTimer=1E3;
		this.tickTime=0;
		this.BackSnow=this.MidSnow=this.FrontSnow=null
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.input.maxPointers=2;

		this.genBg();

		var title=this.add.sprite(this.world.centerX,this.world.height*.4,'Title');
		title.anchor.setTo(.5);
		this.M.T.beatA(title,{duration:909}).start();

		var lbl,txtstyl=this.M.S.txtstyl(25);
		txtstyl.fill=txtstyl.mStroke='#ffa500';
		lbl=this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,txtstyl);
		lbl.tint=0xffa500;
		
		lbl=this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.gotoCredit,'Credit',txtstyl);
		lbl.tint=0xffa500;
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genBg:function(){
		this.add.sprite(0,0,'SkyBg');
		
		this.BackSnow=this.add.emitter(this.world.centerX,-50,600);
		this.BackSnow.makeParticles('snowflakes',[0,1,2,3,4]);
		this.BackSnow.maxParticleScale=.3;
		this.BackSnow.minParticleScale=.1;
		this.BackSnow.setYSpeed(20,100);
		this.BackSnow.gravity=0;
		this.BackSnow.width=this.world.width*1.5;
		this.BackSnow.minRotation=0;
		this.BackSnow.maxRotation=40;

    	this.MidSnow=this.add.emitter(this.world.centerX,-50,250);
		this.MidSnow.makeParticles('snowflakes',[0,1,2,3,4]);
    	this.MidSnow.maxParticleScale=.3;
    	this.MidSnow.minParticleScale=.24;
    	this.MidSnow.setYSpeed(50,150);
    	this.MidSnow.gravity=0;
    	this.MidSnow.width=this.world.width*1.5;
    	this.MidSnow.minRotation=0;
    	this.MidSnow.maxRotation=40;

    	this.FrontSnow=this.add.emitter(this.world.centerX,-50,50);
		this.FrontSnow.makeParticles('snowflakes',[0,1,2,3,4]);
    	this.FrontSnow.maxParticleScale=.5;
    	this.FrontSnow.minParticleScale=.25;
    	this.FrontSnow.setYSpeed(100,200);
    	this.FrontSnow.gravity=0;
    	this.FrontSnow.width=this.world.width*1.5;
    	this.FrontSnow.minRotation=0;
    	this.FrontSnow.maxRotation=40;

    	this.changeWindDirection();

    	this.BackSnow.start(!1,14E3,this.time.physicsElapsedMS*2);
    	this.MidSnow.start(!1,12E3,this.time.physicsElapsedMS*4);
    	this.FrontSnow.start(!1,6E3,this.time.physicsElapsedMS*100);
	},
	changeWindDirection:function(){
		if(this.rnd.between(0,100)<50){
			var min=0,max=this.rnd.between(0,150);
		}else{
			var min=this.rnd.between(-150,0),max=0;
		}
		this.BackSnow.setXSpeed(min,max);
		this.MidSnow.setXSpeed(min,max);
		this.FrontSnow.setXSpeed(min,max);
	},
	update:function(){
		this.tickTimer-=this.time.elapsed;
		if(this.tickTimer<0){
			this.tickTimer=1E3;
			this.tickTime++;
			if(this.tickTime==20){
		    	this.changeWindDirection();
		    	this.tickTime=0;
			}
		}
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
		this.charInfoLen=Object.keys(this.CharInfo).length;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.TitleTS=null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:1});
		
		this.add.sprite(0,0,'SkyBg');
		this.TitleTS=this.M.S.genTxt(this.world.centerX,this.world.height*.065,this.curWords.SelectChar,this.M.S.txtstyl(35));
		this.genCharPanel();

		var lbl,txtstyl=this.M.S.txtstyl(25);
		txtstyl.fill=txtstyl.mStroke='#8a2be2';
		lbl=this.M.S.genLbl(this.world.centerX,this.world.height*.93,this.back,this.curWords.Back,txtstyl);
		lbl.tint=0x8a2be2;

		this.genHUD();
	},
	genCharPanel:function(){
		var arr=[];
		for(var i=1;i<=this.charInfoLen;i++)arr.push({name:this.CharInfo[i].cName,img:'Char_'+i,num:i});
		Phaser.ArrayUtils.shuffle(arr);
		var sY=this.world.height*.15;
		var row=0;
		for(var k in arr){
			var evenNum=k%3;
			var c=arr[k];
			var b=this.add.button(evenNum*125+25,row*115+sY,c.img,this.select,this);
			b.char=c.num
			b.charName=c.name;
			b.width=b.height=100;
			b.onInputOver.add(this.charOver,this);
			b.onInputOut.add(this.charOut,this);
			if(evenNum==2)row++;
		}
	},
	charOver:function(b){
		if(!this.Tween.isRunning){
			this.TitleTS.changeText(b.charName);
			b.alpha=.5;
		}
	},
	charOut:function(b){
		/////// this.TitleTS.changeText(this.curWords.SelectChar);
		b.alpha=1;
	},
	select:function(b){
		if(!this.Tween.isRunning){
			this.M.sGlb('curChar',b.char);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
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
			this.M.SE.play('Back',{volume:1});
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};