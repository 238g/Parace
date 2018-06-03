BasicGame.Stage1=function(){};
BasicGame.Stage1.prototype={
	init:function () { 
		this.isPlaying=this.canSpin=!1;
		this.spinQuantity=3;
		this.btnsLineX=this.world.centerX+50;
		this.slicePrizes=[
			'ハズレ',
			'Easyモード',
			'Hardモード\nスコア2倍',
			'スコア1.5倍',
			'ハズレ',
			'Easyモード',
			'Hardモード\nスコア2倍',
			'スコア1.5倍',
		];
		this.slices=this.slicePrizes.length;
		this.curPrizeNum=
		this.Wheel=this.Pin=this.PrizeTextSprite=this.SpinCountTextSprite=
		this.SpinBtnSprite=this.EndBtnSprite=this.FadeSprite=null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.setGlobal('curMode',0);
		this.playBGM();
		this.add.sprite(-800,-120,'Bg_0');
		this.M.S.genText(this.world.centerX,50,'ルーレットを回して\nボーナスアイテムを選ぼう',this.M.S.BaseTextStyleSS(20));
		this.Wheel=this.add.sprite(this.world.centerX,this.world.centerY-50,'Wheel');
		this.Wheel.anchor.setTo(.5);
		this.Wheel.scale.setTo(.6);
		this.Pin=this.add.sprite(this.world.centerX,this.world.centerY-50,'Pin');
		this.Pin.anchor.setTo(.5);
		this.Pin.scale.setTo(.6);
		this.add.sprite(0,this.world.height,'Aoi_1').anchor.setTo(0,1);
		this.PrizeTextSprite=this.M.S.genText(this.btnsLineX,this.world.height-170,'',this.M.S.BaseTextStyleS(25));
		this.SpinCountTextSprite=this.M.S.genText(this.world.centerX,110,'回せる回数: 3',this.M.S.BaseTextStyleS(25));
		this.tutorialScene();
		this.test();
	},

	tutorialScene:function(){
		if(this.M.getGlobal('doneTutorial')){
			this.time.events.add(500,function(){
				this.start();
			},this);
		} else {
			this.FadeSprite=this.add.sprite(this.world.centerX,this.world.centerY,'WhitePaper');
			this.FadeSprite.anchor.setTo(.5);
			this.FadeSprite.tint=0x000000;
			this.time.events.add(500,function(){
				this.input.onDown.addOnce(function(){
					this.M.SE.play('OnBtn',{volume:1});
					var tween=this.M.T.fadeOutA(this.FadeSprite,{duration:500});
					this.M.T.onComplete(tween,this.start);
					tween.start();
					this.M.setGlobal('doneTutorial',true);
				},this);
			},this);
			var tutorialBgSprite=this.add.sprite(0,0,'Tutorial_Bg');
			tutorialBgSprite.anchor.setTo(.5);
			tutorialBgSprite.scale.setTo(.9);
			this.FadeSprite.addChild(tutorialBgSprite);
		}
	},

	spinWheel: function () {
		if(this.canSpin){
			this.PrizeTextSprite.changeText('');
			var rounds=Phaser.Math.between(2,4);
			var degrees=Phaser.Math.between(1,359);
			this.curPrizeNum=this.slices-1-Math.floor(degrees/(360/this.slices));
			this.canSpin=!1;
			var tween=this.add.tween(this.Wheel);
			tween.to({angle:360*rounds+degrees},3000,Phaser.Easing.Cubic.Out,true);
			tween.onComplete.add(this.finishSpin,this);
			this.spinQuantity--;
			this.SpinCountTextSprite.changeText('回せる回数: '+this.spinQuantity);
			this.M.SE.play('OnBtn',{volume:1});
			this.M.SE.play('RouletteSE',{loop:!0,volume:1});
			this.M.SE.fadeOut('RouletteSE',2500);
		}
	},

	finishSpin: function(){
		this.M.SE.play('GetItem',{volume:1});
		this.M.SE.stop('RouletteSE');
		this.PrizeTextSprite.changeText(this.slicePrizes[this.curPrizeNum]);
		if(this.spinQuantity==0)return this.end();
		this.canSpin=!0;
		if(!this.EndBtnSprite){
			this.EndBtnSprite=this.M.S.BasicGrayLabelS(
				this.btnsLineX,this.world.height-30,this.goEnd,
				'これにする',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}
			);
		}
	},

	playBGM: function () {
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
	},

	start: function () {
		this.isPlaying=!0;
		this.canSpin=!0;
		this.SpinBtnSprite=this.M.S.BasicGrayLabelS(
			this.btnsLineX,this.world.height-90,this.spinWheel,
			'回す',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}
		);
	},

	goEnd:function(){
		if (this.isPlaying) {
			this.M.SE.play('OnBtn2',{volume:1});
			this.end();
		}
	},

	end: function () {
		if (this.isPlaying) {
			this.isPlaying=!1;
			var textSprite=this.M.S.genText(this.world.centerX,this.world.centerY,this.PrizeTextSprite.text+'に決定！\n次へ進む',this.M.S.BaseTextStyleS(30));
			textSprite.setScale(0,0);
			textSprite.addTween('popUpB');
			this.M.T.onComplete(textSprite.multipleTextTween.popUpB,function(){
				this.input.onDown.addOnce(function(){
					this.M.SE.play('GetItem',{volume:1});
					this.M.NextScene('Stage2');
				},this);
			});
			textSprite.startTween('popUpB');
			switch(this.curPrizeNum){
				case 1: case 5: this.M.setGlobal('curMode',1); break;
				case 2: case 6: this.M.setGlobal('curMode',2); break;
				case 3: case 7: this.M.setGlobal('curMode',3); break;
				default: this.M.setGlobal('curMode',0);
			}
		}
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
