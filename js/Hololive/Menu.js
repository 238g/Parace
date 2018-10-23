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
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO
		
		//TODO
		// var title=this.add.sprite(this.world.centerX,this.world.height*.92,'Title');
		// title.anchor.setTo(.5);

		this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		this.M.S.genLbl(this.world.width*.75,this.world.height*.8,this.gotoCredit,'Credit',this.M.S.txtstyl(25));
		
		this.genHUD();
		this.time.events.add(500,function(){this.inputEnabled=!0},this);
	},
	start:function(){
		if (this.inputEnabled) {
			if (!this.Tween.isRunning) {
				this.inputEnabled=!1;
				// this.M.SE.play('OnStart',{volume:1});//TODO
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
		// this.M.SE.play('OnBtn',{volume:1});//TODO
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
		this.curGroup=0;
		this.TileS=null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO

		//TODO
		this.M.S.genTxt(this.world.centerX,this.world.height*.065,'Select');

		this.genCharPanel();

		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
	},
	genCharPanel:function(){
		this.TileS=this.add.tileSprite(0,0,this.world.width*2,this.world.height,'WP');
		this.TileS.tint=0x888888;
		// this.TileS.tint=0xeeeeee;

		//TODO
		var mY=this.world.height*.2,sY=this.world.height*.2;
		for(var i=0;i<3;i++){
			var lbl=this.M.S.genLbl(this.world.centerX,mY*i+sY,this.slide,i+'期生');//TODO
			lbl.group=i;
			this.TileS.addChild(lbl);
		}
		
		var page2X=this.world.width*1.6,mY=this.world.height*.1,sY=this.world.height*.2;
		for(var i=0;i<5;i++){
			var lbl=this.M.S.genLbl(page2X,sY+mY*i,this.select,i);//TODO
			lbl.listNum=i;//TODO
			this.TileS.addChild(lbl);
		}

		// TODO arrow btn
	},
	slide:function(b){
		var group=b.group;
		this.curGroup=group;
		//TODO changeImg
		if(group==0){
			this.TileS.children[7].visible=!1;

			for(var i=1;i<=4;i++){
				// this.CharInfo[i]
				this.TileS.children[i+2].changeText(i+'AAAAA');
			}
		}else{
			this.TileS.children[7].visible=!0;
			if(group==1){
				for(var i=5;i<=9;i++){
					// this.CharInfo[i]
					this.TileS.children[i-2].changeText(i+'BBBBB');
				}
			}else{
				for(var i=10;i<=14;i++){
					// this.CharInfo[i]
					this.TileS.children[i-7].changeText(i+'CCCCCC');
				}
			}
		}
		this.M.T.moveB(this.TileS,{xy:{x:-this.world.width},duration:500}).start();
	},
	select:function(b){
		if (!this.Tween.isRunning) {
			if(this.curGroup==0){
				var char=b.listNum+1;
			}else{
				var char=b.listNum+this.curGroup*5;
			}
			this.M.sGlb('curChar',char);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectLevel')},this);
			this.Tween.start();
			// this.M.SE.play('OnStart',{volume:1});//TODO
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
			// this.M.SE.play('OnBtn',{volume:1});//TODO
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
		this.curChar=this.M.gGlb('curChar');
		this.CharInfo=this.M.gGlb('CharInfo');
		this.curCharInfo=this.CharInfo[this.curChar];
		// this.curLevel=this.M.gGlb('curLevel');
		this.LevelInfo=this.M.gGlb('LevelInfo');
		// this.curLevelInfo=this.LevelInfo[this.curLevel];
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO

		//TODO
		this.M.S.genTxt(this.world.centerX,this.world.height*.065,'Select');

		//TODO curChar img and text

		var lbl,text,row=0,
			txtstyl=this.M.S.txtstylS(20),
			x=this.world.width*.75,
			mY=this.world.height*.1,
			sY=this.world.height*.4;

		for(var k in this.LevelInfo){
			var info=this.LevelInfo[k];
			text=info.timeAttack?this.curWords.TimeAttack+info.leftTime:'Level '+k;

			if(k%2==0){
				lbl=this.M.S.genLbl(x,mY*row+sY,this.select,text,txtstyl);
				row++;
			}else{
				lbl=this.M.S.genLbl(x,mY*row+sY,this.select,text,txtstyl);
			}
			lbl.level=k;
		}

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
			myGa('play','SelectLevel','Char_'+this.curChar+':Level_'+b.level,this.M.gGlb('playCount'));
			// this.M.SE.play('OnStart',{volume:1});//TODO
		}
	},
	back:function(){
		if(!this.Tween.isRunning){
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
			this.Tween.start();
			// this.M.SE.play('OnBtn',{volume:1});//TODO
		}
	},
	genHUD:function(){
		var y=this.world.height*.95;
		this.M.S.genVolBtn(this.world.width*.1,y).tint=0x000000;
		this.M.S.genFlScBtn(this.world.width*.9,y);
	},
};