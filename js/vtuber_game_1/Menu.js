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
		
		var title=this.add.sprite(this.world.centerX,this.world.height*.92,'Title');
		title.anchor.setTo(.5);

		this.M.S.genLbl(this.world.width*.25,this.world.height*.8,this.start,this.curWords.Start,this.M.S.txtstyl(25));
		
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
		//Val
		this.charInfoLen=Object.keys(this.CharInfo).length;
		this.tilePage=Math.ceil(this.charInfoLen/12);
		this.curPage=1;
		//Obj
		this.StartL=this.TileS=this.LeftB=this.RightB=null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});//TODO

		this.TileS=this.add.tileSprite(0,0,this.world.width*this.tilePage,this.world.height,'WP');
		this.TileS.tint=0x00ff00;

		var txtstyl=this.M.S.txtstyl(40);//TODO color
		this.M.S.genTxt(this.world.centerX,this.world.height*.065,this.curWords.Select,txtstyl);

		this.genFrames();
		this.genArrowBtn();

		this.StartL=this.M.S.genLbl(this.world.centerX,this.world.height*.85,this.play,this.curWords.Start);
		this.StartL.visible=!1;
		this.M.S.genLbl(this.world.centerX,this.world.height*.95,this.back,this.curWords.Back);

		this.genHUD();
	},
	genFrames:function(){
		// TODO frame
		var y=this.world.height*.12;
		this.M.S.genBmpSqrSp(5,y,90,90,'#ff00ff');
		this.M.S.genBmpSqrSp(105,y,90,90,'#ffff00');
		this.M.S.genBmpSqrSp(205,y,90,90,'#ff0000');
		this.M.S.genBmpSqrSp(305,y,90,90,'#0000ff');

		var arr=[];
		for(var i=1;i<=this.charInfoLen;i++)arr.push(i);
		Phaser.ArrayUtils.shuffle(arr);

		var sX=10;
		var sY=this.world.height*.3;
		var mXY=this.world.width/4;
		var col=0;
		var rest;
		var count=0;
		for(var k in arr){
			rest=count%4;
			var b=this.add.button(mXY*rest+sX,mXY*col+sY,'todo_1',this.select,this);//TODO
			b.tint=Phaser.Color.getRandomColor();//TODO del
			b.num=arr[k];
			this.TileS.addChild(b);
			if(rest==3)col++;
			if(col==3){
				col=0;
				sX+=this.world.width;
			}
			count++;
		}
	},
	genArrowBtn:function(){
		this.LeftB=this.add.button(this.world.width*.1,this.world.height*.85,'GameIconsWhite',this.page,this,'arrowLeft','arrowLeft','arrowLeft','arrowLeft');
		this.LeftB.tint=0x000000;
		this.LeftB.anchor.setTo(.5);
		this.LeftB.fn='left';
		this.LeftB.visible=!1;
		this.RightB=this.add.button(this.world.width*.9,this.world.height*.85,'GameIconsWhite',this.page,this,'arrowRight','arrowRight','arrowRight','arrowRight');
		this.RightB.tint=0x000000;
		this.RightB.anchor.setTo(.5);
		this.RightB.fn='right';
	},
	page:function(b){
		if(!this.Tween.isRunning){
			if(b.fn=='right'){
				if(this.curPage!=this.tilePage){
					this.Tween=this.M.T.moveB(this.TileS,{xy:{x:'-'+this.world.width},duration:500});
					this.Tween.start();
					this.curPage++;
					if(!this.LeftB.visible)this.LeftB.visible=!0;
					if(this.curPage==this.tilePage)this.RightB.visible=!1;
				}
			}else{
				if(this.curPage!=1){
					this.Tween=this.M.T.moveB(this.TileS,{xy:{x:'+'+this.world.width},duration:500});
					this.Tween.start();
					this.curPage--;
					if(!this.RightB.visible)this.RightB.visible=!0;
					if(this.curPage==1)this.LeftB.visible=!1;
				}
			}
		}
	},
	select:function(b){
		console.log(this.CharInfo[b.num]);

		//TODO if set 4 -> this.StartL.visible=!0;

	},
	play:function(b){
		if (!this.Tween.isRunning) {
			// this.M.sGlb('curFirstChar',b.char);//TODO
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('play','SelectChar','FirstChar_'+b.char,this.M.gGlb('playCount'));
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