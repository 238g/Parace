BasicGame.Stage1=function(){};
BasicGame.Stage1.prototype={
	init:function () { 
		this.isPlaying=this.canSpin=!1;
		this.spinQuantity=3;
		this.slicePrizes=[
			"A KEY!!!",
			"50 STARS",
			"500 STARS",
			"BAD LUCK!!!",
			"200 STARS",
			"100 STARS",
			"150 STARS",
			"BAD LUCK!!!",
		];
		// 1,2:None //3,4:stage2UP //5,6:stage3UP //7,8:stage4UP
		this.slices=this.slicePrizes.length;
		this.curPrizeNum=
		this.Wheel=this.Pin=this.PrizeTextSprite=
		this.SpinBtnSprite=this.EndBtnSprite=null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.setGlobal('stage2Score',0);
		this.playBGM();
		// TODO upper text ルーレットを回してボーナスアイテムを選ぼう
		this.Wheel=this.add.sprite(this.world.centerX,this.world.centerY,'Wheel');
		this.Wheel.anchor.setTo(.5);
		this.Wheel.scale.setTo(.6);
		this.Pin=this.add.sprite(this.world.centerX,this.world.centerY,'Pin');
		this.Pin.anchor.setTo(.5);
		this.Pin.scale.setTo(.6);
		this.PrizeTextSprite=this.M.S.genText(this.world.centerX,this.world.height-140,'【アイテム名】',this.M.S.BaseTextStyleS(25));
		this.SpinCountTextSprite=this.M.S.genText(20,20,'回せる回数: 3',this.M.S.BaseTextStyleS(25));
		this.SpinCountTextSprite.setAnchor(0,0);
		this.start();
		this.test();
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
		}
	},

	finishSpin: function(){
		this.PrizeTextSprite.changeText(this.slicePrizes[this.curPrizeNum]);
		if(this.spinQuantity==0)return this.end();
		this.canSpin=!0;
		if(!this.EndBtnSprite){
			this.EndBtnSprite=this.M.S.BasicGrayLabelS(
				this.world.centerX,this.world.height-30,this.goEnd,
				'これにする',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}
			);
		}
	},

	playBGM: function () {
		return; // TODO
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
	},

	start: function () {
		this.time.events.add(500,function(){
			this.isPlaying=!0;
			this.canSpin=!0;
			this.SpinBtnSprite=this.M.S.BasicGrayLabelS(
				this.world.centerX,this.world.height-80,this.spinWheel,
				'回す',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}
			);
		},this);
	},

	goEnd: function () {
		if (this.isPlaying) {
			// TODO dialog Y/N Y->end
		}
	},

	end: function () {
		this.isPlaying=!1;
		// TODO ..アイテムに決定！500->next stage
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
