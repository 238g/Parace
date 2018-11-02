BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		//Val
		// this.tickTimer=0;
		//Obj
		// this.Eff=null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
		this.input.maxPointers=2;

		// this.add.sprite(0,0,'Bg_1');

		// this.genEff();
		
		// var title=this.add.sprite(this.world.centerX,this.world.height*.4,'Title');
		// title.anchor.setTo(.5);
		// this.M.T.stressA(title,{durations:[300,200],delay:2E3}).start();

		this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.gotoCredit,'Credit',this.M.S.txtstyl(25));
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	genEff:function(){
		this.Eff=this.add.group();
		var arr=[];
		for(i=1;i<=15;i++)arr.push('circle_'+i);
		this.Eff.createMultiple(3,arr);
		this.Eff.forEach(function(s){
			s.smoothed=!1;
			s.anchor.setTo(.5);
		},this);
	},
	updateT:function(){
		this.tickTimer-=this.time.elapsed;
		if(this.tickTimer<0){
			this.tickTimer=500;
			var s=this.rnd.pick(this.Eff.children.filter(function(e){return!e.alive}));
			if(s){
				s.reset(this.world.randomX*.9+this.world.width*.05,this.world.randomY*.6+this.world.height*.05);
				var tw=this.add.tween(s.scale).to({x:2,y:2},1500,
					this.rnd.pick([
						Phaser.Easing.Elastic.Out,
						Phaser.Easing.Bounce.Out,
						Phaser.Easing.Back.Out,
						Phaser.Easing.Circular.InOut,
					]),!0,0,0,!0);
				tw.onComplete.add(function(){
					this.kill();
				},s);
			}
		}
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				// this.M.SE.play('OnBtn',{volume:1});//TODO
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
				this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
				this.Tween.start();
			}
		} else {
			// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
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
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
		
		this.M.S.genTxt(this.world.centerX,this.world.height*.065,this.curWords.SelectChar,this.M.S.txtstyl(35));
		this.genCharPanel();
		this.M.S.genLbl(this.world.centerX,this.world.height*.93,this.back,this.curWords.Back);

		this.genHUD();
	},
	genCharPanel:function(){
		var arr=[];
		for(var i=1;i<=this.charInfoLen;i++)arr.push(i);
		Phaser.ArrayUtils.shuffle(arr);
		var sY=this.world.height*.15;
		var row=0;
		for(var k in arr){
			var evenNum=k%3;
			//TODO char btn
			var b=this.add.button(evenNum*125+25,row*115+sY,'todo_1',this.select,this);
			b.width=b.height=100;//TODO del
			// this.M.S.genBmpSqrSp(evenNum*125+25,row*115+sY,100,100,'#ff0000');
			if(evenNum==2)row++;
		}
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
			// this.M.SE.play('OnBtn',{volume:1});//TODO
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