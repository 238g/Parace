BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;

		// Conf
		this.StageInfo=this.M.gGlb('StageInfo');
		this.curStage=this.M.gGlb('curStage');
		this.curStageInfo=this.StageInfo[this.curStage];
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		// Var
		this.ROD_ANCHOR_Y=.8;

		this.curMode='menu';
		this.canMoveRod=!1;

		// Obj
		this.Rod=
		this.Float=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(BasicGame.WHITE_COLOR);
		// this.M.SE.playBGM('PlayBGM',{volume:1});


		this.genContents();

		this.inputHandler();


		this.start();// TODO del
		// this.M.gGlb('endTut')?this.ready():this.tut();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			if(this.canMoveRod){
				this.Rod.rotation=this.physics.arcade.angleBetween(this.Rod,this.input.activePointer)+1.5;
			}
		}
	},
	tut:function(){
		this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
		this.TutSprite.anchor.setTo(.5);
		this.TutSprite.tint=0x000000;
		this.input.onDown.addOnce(function(){
			this.M.SE.play('OnStart',{volume:1});
			this.TutSprite.destroy();
			this.M.sGlb('endTut',!0);
			this.ready();
		},this);
		this.TutSprite.addChild(this.M.S.genTxt(0,0,this.curWords.HowTo,this.M.S.txtstyl(25)));
	},
	ready:function(){
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,'START',this.M.S.txtstyl(80));
		ts.scale.setTo(0);
		var tw=this.M.T.popUpB(ts);
		tw.onComplete.add(function(){
			this.destroy();
		},ts);
		tw.onComplete.add(this.start,this);
		tw.start();
	},
	start:function(){
		this.isPlaying=this.inputEnabled=this.canMoveRod=!0;
		this.curMode='searching';
	},
	end:function(){
		if(this.isPlaying){
			this.isPlaying=!1;

			this.genRes();
		}
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		// this.add.sprite(0,0,'PlayBg_1');

		this.Rod=this.add.sprite(this.world.centerX,this.world.height,'Rod');
		this.Rod.anchor.setTo(.5,this.ROD_ANCHOR_Y);//TODO adjust

		this.Float=this.add.sprite(0,0,'Float');
		this.Float.anchor.setTo(.5);
		this.Float.visible=!1;
	},
	inputHandler:function(){
		this.input.onDown.add(function(){
			if(this.isPlaying&&this.inputEnabled){
				switch(this.curMode){
					case 'searching':this.searchingMode();break;
					case 'casting':this.castingMode();break;
					case 'waiting':this.waitingMode();break;
					case 'hitting':this.hittingMode();break;
					default:
						//menu
				}
			}
		},this);
	},
	searchingMode:function(){
		this.canMoveRod=!1;
		this.Rod.rotation=this.physics.arcade.angleBetween(this.Rod,this.input.activePointer)+1.5;

		var d=this.Rod.height*this.ROD_ANCHOR_Y;//TODO adjust same anchor
		var a=this.Rod.angle-90;
		this.Float.x=this.Rod.x+d*Math.cos(a*(Math.PI/180));
		this.Float.y=this.Rod.y+d*Math.sin(a*(Math.PI/180));
						
		// this.Float.visible=!0;//TODO del

		// TODO show gauge
		this.curMode='casting';

	},
	castingMode:function(){
		// TODO cast float -> tween on complete -> mode=casting
		this.Float.visible=!0;
	},
	waitingMode:function(){
		// TODO
	},
	hittingMode:function(){
		// TODO
	},

	/*
	genRes:function(){
		// TODO
		return;
		this.time.events.add(800,function(){
			var s=this.add.sprite(0,0,'TWP');
			s.tint=0x000000;
			s.alpha=0;
			this.M.T.fadeInA(s,{duration:800,alpha:1}).start();

			var tsl=this.M.S.txtstyl(25);
			var x=this.world.centerX;

			s.addChild(this.M.S.genTxt(x,this.world.height*.2,this.clear?'CLEAR!':'GAME\nOVER',this.M.S.txtstyl(50)));
			s.addChild(this.M.S.genTxt(x,this.world.height*.4,this.curStageInfo.name,this.M.S.txtstyl(50)));
			if(this.clear){
				s.addChild(this.M.S.genLbl(x,this.world.centerY,this.tweet,this.curWords.Tweet,tsl));
			}else{
				s.addChild(this.M.S.genLbl(x,this.world.centerY,this.again,this.curWords.Again,tsl));
			}
			s.addChild(this.M.S.genLbl(x,this.world.height*.6,this.back,this.curWords.Back,tsl));
			
			s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.7,this.yt,'YouTube',tsl));
			s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.7,this.onOtherGames,this.curWords.OtherGames,tsl));

			var cA=this.add.sprite(this.world.width*.25,this.world.height,'Laki_ResPointer');
			cA.anchor.setTo(.5,1);
			s.addChild(cA);
			var cB=this.add.sprite(this.world.width*.75,this.world.height,'Laki_ResPointer');
			cB.anchor.setTo(.5,1);
			cB.scale.setTo(-1,1);
			s.addChild(cB);
		},this);
	},
	tweet:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var emoji='';
		var res=this.curStageInfo.name+' CLEAR!';
		var txt=this.curWords.TweetTtl+'\n'
				+emoji+'\n'
				+res+'\n'
				+emoji+'\n';
		var ht='BBBBBBBBBBBBBBBBBBBBBBBBBBBBB';
		this.M.H.tweet(txt,ht,location.href);
	},
	again:function(){
		this.M.SE.play('OnStart',{volume:1});
		this.M.NextScene('Play');
	},
	back:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('SelectStage');
	},
	yt:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.game.device.desktop?window.open(BasicGame.YOUTUBE_URL,'_blank'):location.href=BasicGame.YOUTUBE_URL;
	},
	onOtherGames:function(){
		this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.MY_GAMES_URL,'_blank');
		} else {
			location.href=BasicGame.MY_GAMES_URL;
		}
	},
	*/
};
