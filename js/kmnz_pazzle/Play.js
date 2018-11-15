BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		// Val

		// Obj
		this.PiecesGroup=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
		// this.playBgm();

		this.genContents();
		// this.M.gGlb('endTut')?this.genStart():this.genTut();
		this.test();
	},
	updateT:function(){
		if(this.isPlaying){
		}
	},
	start:function(){this.isPlaying=this.inputEnabled=!0},
	end:function(){this.isPlaying=this.inputEnabled=!1},
	test:function(){
		if(__ENV!='prod'){
			// this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameOver,this);
			// this.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(function(){this.waveTime=1},this);
			// this.input.keyboard.addKey(Phaser.Keyboard.I).onDown.add(this.appearItem,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){

		var size=BasicGame.PIECE_ONE;
		var piecesIndex=0;
		var col=3;
		var row=3;
		var pieceAmount=col*row;
		var shuffleArr=[];
		for(var i=0;i<pieceAmount;i++)shuffleArr.push(i);
		Phaser.ArrayUtils.shuffle(shuffleArr);
		this.PiecesGroup=this.add.group();
		for(var i=0;i<row;i++){
			for(var j=0;j<col;j++){
				if(shuffleArr[piecesIndex]){
				// if(shuffleArr[piecesIndex]>0){
					piece=this.PiecesGroup.create(j*size,i*size,'todo_1',shuffleArr[piecesIndex]);
					piece.inputEnabled=!0;
					piece.events.onInputDown.add(this.selectPiece,this);
				}else{
					// this.BlackPieceB
					piece=this.PiecesGroup.create(j*size,i*size);
					// piece=this.PiecesGroup.create(j*size,i*size,'todo_1',shuffleArr[piecesIndex]);
					// piece.tint=0x000000;
					piece.black=!0;
				}
				piece.name='piece'+i.toString()+'x'+j.toString();
				piece.curIndex=piecesIndex;
				piece.destIndex=shuffleArr[piecesIndex];
				piece.posX=j;
				piece.posY=i;
				piecesIndex++;
			}
		}




		// this.genHUD();
	},
	selectPiece:function(piece){
		// if(this.isPlaying){
			var blackPiece=this.canMove(piece);
			if(blackPiece){
				this.movePiece(piece,blackPiece);
			}
		// }
	},
	canMove:function(piece){
		var foundBlackElem=!1;
		for(var k in this.PiecesGroup.children){
			var element=this.PiecesGroup.children[k];
			if(
				element.posX===(piece.posX-1)&&element.posY===piece.posY&&element.black
				||element.posX===(piece.posX+1)&&element.posY===piece.posY&&element.black
				||element.posY===(piece.posY-1)&&element.posX===piece.posX&&element.black
				||element.posY===(piece.posY+1)&&element.posX===piece.posX&&element.black
			){
				foundBlackElem=element;
				break;
			}
		}
		return foundBlackElem;
	},
	movePiece:function(piece,blackPiece){
		var size=BasicGame.PIECE_ONE;
		var tmpPiece={
			posX:piece.posX,
			posY:piece.posY,
			curIndex:piece.curIndex,
		};

		// this.add.tween(piece).to({x:blackPiece.posX*size,y:blackPiece.posY*size},300,Phaser.Easing.Linear.None,!0);
		this.add.tween(piece).to({x:blackPiece.posX*size,y:blackPiece.posY*size},100,Phaser.Easing.Linear.None,!0);

		piece.posX=blackPiece.posX;
		piece.posY=blackPiece.posY;
		piece.curIndex=blackPiece.curIndex;
		piece.name='piece'+piece.posX.toString()+'x'+piece.posY.toString();

		blackPiece.posX=tmpPiece.posX;
		blackPiece.posY=tmpPiece.posY;
		blackPiece.curIndex=tmpPiece.curIndex;
		blackPiece.name='piece'+blackPiece.posX.toString()+'x'+blackPiece.posY.toString();

		this.checkIfFinished();
	},
	checkIfFinished:function(){
		var isFinished=!0;
		for(var k in this.PiecesGroup.children){
			var element=this.PiecesGroup.children[k];
			if(element.curIndex!==element.destIndex){
				isFinished=!1;
				break;
			}
		}
		if(isFinished){
			// this.genEnd();
			console.log('genEnd');
		}
	},


	genHUD:function(){
		this.HUD=this.add.group();

		var txtstyl=this.M.S.txtstyl(20);
		txtstyl.fill=txtstyl.mStroke='#008000';
		this.ScoreTS=this.M.S.genTxt(0,this.world.height*.01,this.curWords.Score+0,txtstyl);
		this.ScoreTS.anchor.setTo(0);
		this.ScoreTS.children[0].anchor.setTo(0);
		this.HUD.add(this.ScoreTS);

		txtstyl.fill=txtstyl.mStroke='#2E2EFE';
		this.WaveTimeTS=this.M.S.genTxt(0,this.world.height*.06,this.curWords.WaveTime+this.waveTime,txtstyl);
		this.WaveTimeTS.anchor.setTo(0);
		this.WaveTimeTS.children[0].anchor.setTo(0);
		this.HUD.add(this.WaveTimeTS);
		this.HUD.visible=!1;
	},
	playBgm:function(){
		if(!this.M.SE.isPlaying('currentBGM')||this.M.SE.isPlaying('TitleBGM')){
			this.M.SE.stop('currentBGM');
			var bgm=this.M.SE.play('PlayBGM_'+this.rnd.between(1,2),{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
	},
	loopBgm:function(){
		if(this.M.currentScene=='Play'){
			this.M.sGlb('curBgmNum',this.M.gGlb('curBgmNum')+1);
			if(this.M.gGlb('curBgmNum')==3)this.M.sGlb('curBgmNum',1);
			var bgm=this.M.SE.play('PlayBGM_'+this.M.gGlb('curBgmNum'),{volume:1,isBGM:!0});
			bgm.onStop.add(this.loopBgm,this);
		}
	},
	////////////////////////////////////////////////////////////////////////////////////
	gameOver:function(){
		if(this.isPlaying){
			this.end();
			this.camera.shake(.03,500,!0,Phaser.Camera.SHAKE_BOTH);
			this.M.SE.play('End',{volume:1});
			this.time.events.add(500,this.genEnd,this);
			/////// this.Chars.killAll();
		}
	},
	genTut:function(){
		this.HowToS=this.add.sprite(0,0,'TWP');
		this.HowToS.tint=0x000000;
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curWords.HowTo,this.M.S.txtstyl(30));
		this.HowToS.addChild(ts);
		this.time.events.add(300,function(){
			this.input.onDown.addOnce(function(){
				this.M.sGlb('endTut',!0);
				this.HowToS.destroy();
				this.genStart();
			},this);
		},this);
	},
	genStart:function(){
		var txtstyl=this.M.S.txtstyl(50);
		txtstyl.fill=txtstyl.mStroke='#0080FF';
		var s=this.M.S.genTxt(this.world.centerX,-this.world.centerY,this.curWords.Start,txtstyl);
		var twA=this.M.T.moveA(s,{xy:{y:this.world.centerY}});
		var twB=this.M.T.moveA(s,{xy:{x:-this.world.centerX},delay:200});
		twA.chain(twB);
		twA.start();
		twA.onComplete.add(function(){this.inputEnabled=!0},this);
		twA.onComplete.add(function(){this.destroy},s);
		this.M.SE.play('GenStart',{volume:1});
		this.HUD.visible=!0;
		this.start();
		this.respawn(this.curChar);
	},
	genEnd:function(){
		var txtstyl=this.M.S.txtstyl(45);
		txtstyl.fill=txtstyl.mStroke='#ff0000';
		this.EndTS=this.M.S.genTxt(this.world.centerX,this.world.height*2,this.curWords.End,txtstyl);
		var tw=this.M.T.moveA(this.EndTS,{xy:{y:this.world.centerY}});
		tw.onComplete.add(this.genRes,this);
		tw.start();
	},
	////////////////////////////////////////////////////////////////////////////////////
	genRes:function(){
		var s=this.add.sprite(0,-this.world.height,'TWP');
		s.tint=0x000000;
		var tw=this.M.T.moveD(s,{xy:{y:0},delay:600});
		tw.onComplete.add(function(){this.inputEnabled=!0},this);
		tw.onComplete.add(function(){this.visible=!1},this.EndTS);
		tw.onStart.add(function(){this.M.SE.play('Res',{volume:1})},this);
		tw.start();
		this.HUD.visible=!1;

		var lbl;
		var txtstyl=this.M.S.txtstyl(40);

		txtstyl.fill=txtstyl.mStroke='#3cb371';
		lbl=this.M.S.genTxt(this.world.centerX,this.world.height*.08,this.curWords.Result,txtstyl);
		s.addChild(lbl);

		txtstyl.fontSize=35;
		txtstyl.fill=txtstyl.mStroke='#dc143c';
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.22,this.curWords.ResScore+this.M.H.formatComma(this.score),txtstyl));

		var charS=this.add.sprite(this.world.centerX,this.world.height*.46,'Char_'+this.curChar);
		charS.anchor.setTo(.5);
		charS.width=charS.height=charS.width*.8;
		s.addChild(charS);
		s.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.65,this.curCharInfo.cName));

		var lX=this.world.width*.25,rX=this.world.width*.75;
		txtstyl.fontSize=25;

		txtstyl.fill=txtstyl.mStroke='#00fa9a';
		lbl=this.M.S.genLbl(lX,this.world.height*.72,this.again,this.curWords.Again,txtstyl);
		lbl.tint=0x00fa9a;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#00a2f8';
		lbl=this.M.S.genLbl(rX,this.world.height*.72,this.tweet,this.curWords.TwBtn,txtstyl);
		lbl.tint=0x00a2f8;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#8a2be2';
		lbl=this.M.S.genLbl(lX,this.world.height*.82,this.back,this.curWords.Back,txtstyl);
		lbl.tint=0x8a2be2;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#ffa500';
		lbl=this.M.S.genLbl(rX,this.world.height*.82,this.othergames,this.curWords.OtherGames,txtstyl);
		lbl.tint=0xffa500;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#00a2f8';
		lbl=this.M.S.genLbl(lX,this.world.height*.92,this.tw,'Twitter',txtstyl);
		lbl.tint=0x00a2f8;
		s.addChild(lbl);

		txtstyl.fill=txtstyl.mStroke='#ff0000';
		lbl=this.M.S.genLbl(rX,this.world.height*.92,this.yt,'YouTube',txtstyl);
		lbl.tint=0xff0000;
		s.addChild(lbl);
	},
	yt:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.yt;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('youtube','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tw:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=this.curCharInfo.tw;
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('twitter','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	again:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('OnStart',{volume:1});
			this.M.sGlb('playCount',this.M.gGlb('playCount')+1);
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('Play')},this);
			this.Tween.start();
			myGa('again','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	othergames:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var url=__VTUBER_GAMES;
			if(this.curLang=='en')url+='?lang=en';
			this.game.device.desktop?window.open(url,'_blank'):location.href=url;
			myGa('othergames','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	tweet:function(){
		if(this.inputEnabled){
			this.M.SE.play('OnBtn',{volume:1});
			var e=this.curCharInfo.emoji;
			var res=
				this.curWords.TwSelectChar+this.curCharInfo.cName+'\n'+
				this.curWords.Score+this.M.H.formatComma(this.score)+'\n';
			var txt=e+'\n'+this.curWords.TwTtl+'\n'+res+e+'\n';
			this.M.H.tweet(txt,this.curWords.TwHT,location.href);
			myGa('tweet','Play','Char_'+this.curChar,this.M.gGlb('playCount'));
		}
	},
	back:function(){
		if(this.inputEnabled&&!this.Tween.isRunning){
			this.M.SE.play('Back',{volume:1});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
			this.Tween.onComplete.add(function(){this.M.NextScene('SelectChar')},this);
			this.Tween.start();
		}
	},
};