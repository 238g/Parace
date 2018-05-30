BasicGame.Stage1=function(){};
BasicGame.Stage1.prototype={
	init:function () { 
		this.isPlaying=this.canSpin=!1;
		this.spinQuantity=3;
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
		this.Wheel=this.Pin=this.PrizeTextSprite=
		this.SpinBtnSprite=this.EndBtnSprite=null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.setGlobal('stage2Score',0);
		this.playBGM();
		this.M.S.genText(this.world.centerX,80,'ルーレットを回して\nボーナスアイテムを選ぼう',this.M.S.BaseTextStyleS(22));
		this.Wheel=this.add.sprite(this.world.centerX,this.world.centerY,'Wheel');
		this.Wheel.anchor.setTo(.5);
		this.Wheel.scale.setTo(.6);
		this.Pin=this.add.sprite(this.world.centerX,this.world.centerY,'Pin');
		this.Pin.anchor.setTo(.5);
		this.Pin.scale.setTo(.6);
		this.PrizeTextSprite=this.M.S.genText(this.world.centerX,this.world.height-140,'【アイテム名】',this.M.S.BaseTextStyleS(25));
		this.SpinCountTextSprite=this.M.S.genText(this.world.centerX,150,'回せる回数: 3',this.M.S.BaseTextStyleS(25));
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
		this.time.events.add(300,function(){
			this.isPlaying=!0;
			this.canSpin=!0;
			this.SpinBtnSprite=this.M.S.BasicGrayLabelS(
				this.world.centerX,this.world.height-90,this.spinWheel,
				'回す',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}
			);
		},this);
	},

	goEnd: function () {
		if (this.isPlaying) {
			// TODO dialog Y/N Y->end
			this.end();
		}
	},

	end: function () {
		this.isPlaying=!1;
		this.PrizeTextSprite.move(this.world.centerX,this.world.centerY);
		this.PrizeTextSprite.setScale(0,0);
		this.PrizeTextSprite.changeText(this.PrizeTextSprite.text+'に決定！\n次へ進む');
		this.PrizeTextSprite.addTween('popUpB');
		this.M.T.onComplete(this.PrizeTextSprite.multipleTextTween.popUpB,function(){
			this.input.onDown.addOnce(function(){this.M.NextScene('Stage2');},this);
		});
		this.PrizeTextSprite.startTween('popUpB');
		switch(this.curPrizeNum){
			case 1: case 5: this.M.setGlobal('curMode',1); break;
			case 2: case 6: this.M.setGlobal('curMode',2); break;
			case 3: case 7: this.M.setGlobal('curMode',3); break;
			default: this.M.setGlobal('curMode',0);
		}
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
