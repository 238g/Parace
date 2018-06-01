BasicGame.Stage3=function(){};
BasicGame.Stage3.prototype={
	init:function () { 
		this.isPlaying=this.isMovingPointer=this.inputEnabled=!1;
		this.gaugeQuantity=5;
		this.stopCount=this.movePointerX=0;
		this.score=this.M.getGlobal('stage2Score');
		this.ModeInfo=this.M.getConf('ModeInfo')[0]; // TODO del
		// this.ModeInfo=this.M.getConf('ModeInfo')[this.M.getGlobal('curMode')];
		this.pointerSpeed=this.ModeInfo.st3Speed;
		this.GaugeBgSprite=this.GaugePointer=
		this.StartClickTextSprite=this.ScoreTextSprite=this.StartTextSprite=this.SpinCountTextSprite=
		this.TargetGroup1=this.TargetGroup2=null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.setGlobal('stage3Score',0);
		this.playBGM();
		this.M.S.genText(this.world.centerX,90,'ゲージの真ん中で\nキクノジョーを止めよう！',this.M.S.BaseTextStyleS(25));
		this.GaugeBgSprite=this.add.sprite(this.world.centerX,this.world.height*.85,'GaugeBg');
		this.GaugeBgSprite.anchor.setTo(.5);
		this.M.S.genBmpSprite(this.world.centerX-2,this.world.height*.85,4,this.GaugeBgSprite.height+10,'#ff0000').anchor.setTo(.5);
		this.GaugePointer=this.add.sprite(this.GaugeBgSprite.left+20,this.world.height*.85,'Target');
		this.GaugePointer.anchor.setTo(.5);
		// TODO poiner center bmp
		this.movePointerX=this.time.physicsElapsedMS*.0625*this.pointerSpeed;
		this.genTargetGroup();
		this.SpinCountTextSprite=this.M.S.genText(this.world.centerX,this.world.height*.73,'残り回数: 5',this.M.S.BaseTextStyleS(25));
		this.ScoreTextSprite=this.M.S.genText(this.world.centerX,this.world.height*.65,'スコア: '+this.score,this.M.S.BaseTextStyleS(25));
		this.ScoreTextSprite.hide();
		this.StartClickTextSprite=this.M.S.genText(this.world.centerX, this.world.centerY,this.M.getConst('TOUCH_OR_CLICK')+'してスタート',this.M.S.BaseTextStyleS(30));
		this.StartTextSprite=this.M.S.genText(this.world.centerX,this.world.centerY,'スタート',this.M.S.BaseTextStyleS(60));
		this.StartTextSprite.setScale(0,0);
		this.StartTextSprite.addTween('popUpB',{delay:300});
		this.input.onDown.addOnce(this.start,this);
		this.test();
	},

	genTargetGroup:function(){
		this.TargetGroup1=this.add.group();
		this.TargetGroup2=this.add.group();
		// TODO
		// var spriteWidth=64;
		// var spriteHalfWidth=32;
		// var spriteMargin=8;
		for (var i=0;i<4;i++) {
			for (var j=0;j<4;j++) {
				if(i*j==9)break;
				var sprite=this.add.sprite(j*40,i*40,'Target');
				sprite.scale.setTo(.5);
				this.TargetGroup1.add(sprite);
			}
		}
		for (var i=0;i<4;i++) {
			for (var j=0;j<4;j++) {
				if(i*j==9)break;
				var sprite=this.add.sprite(j*40,i*40,'Target');
				sprite.scale.setTo(.5);
				this.TargetGroup2.add(sprite);
			}
		}
		var leftMargin=(this.world.width-(this.TargetGroup1.width+this.TargetGroup2.width))*.5;
		this.TargetGroup1.x=leftMargin;
		this.TargetGroup2.x=this.TargetGroup1.width+8+leftMargin;
		this.TargetGroup1.y=this.TargetGroup2.y=200;
	},

	stopPointer: function () {
		if(this.isMovingPointer&&this.inputEnabled) {
			var x = Math.abs(this.GaugePointer.x-this.world.centerX);
			this.isMovingPointer=!1;
			this.inputEnabled=!1;
			var addScore=this.GaugeBgSprite.width-x;
			this.score+=Math.floor(addScore*this.ModeInfo.scoreRate);
			this.ScoreTextSprite.changeText('スコア: '+this.score);
			this.gaugeQuantity--;
			this.SpinCountTextSprite.changeText('残り回数: '+this.gaugeQuantity);
			if (this.gaugeQuantity==0) {
				this.step5();
			} else {
				this.stopCount++;
				this['step'+this.stopCount]();
			}
		}
	},

	update: function () {
		if (this.isPlaying) {
			if (this.isMovingPointer) {
				if (this.GaugePointer.x>=this.GaugeBgSprite.right-this.movePointerX) {
					this.movePointerX=-this.time.physicsElapsedMS*.0625*this.pointerSpeed;
				}
				if (this.GaugePointer.x<=this.GaugeBgSprite.left-this.movePointerX) {
					this.movePointerX=this.time.physicsElapsedMS*.0625*this.pointerSpeed;
				}
				this.GaugePointer.x+=this.movePointerX;
			}
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
		this.StartClickTextSprite.hide();
		this.StartTextSprite.startTween('popUpB');
		this.M.T.onComplete(this.StartTextSprite.multipleTextTween.popUpB,function(){
			this.time.events.add(500,function(){
				this.isPlaying=!0;
				this.isMovingPointer=!0;
				this.inputEnabled=!0;
				this.StartTextSprite.Udestroy();
				this.ScoreTextSprite.show();
				this.input.onDown.add(this.stopPointer,this);
			},this);
		});
	},

	end: function () {
		this.isPlaying=!1;
		this.M.setGlobal('stage3Score',this.score);
		var textSprite=this.M.S.genText(this.world.centerX,this.world.centerY-30,'キクノジョーを\n合成させた！\n次へ進む',this.M.S.BaseTextStyleS(40));
		textSprite.setScale(0,0);
		textSprite.addTween('popUpB',{delay:300});
		this.M.T.onComplete(textSprite.multipleTextTween.popUpB,function(){
			this.input.onDown.addOnce(function(){this.M.NextScene('Stage4');},this);
		});
		textSprite.startTween('popUpB');
	},

	restart:function(){
		this.isMovingPointer=!0;
		this.time.events.add(500,function(){this.inputEnabled=!0;},this);
	},

	step1:function(){
		this.M.T.moveB(this.TargetGroup1,{xy:{x:'+'+(this.TargetGroup1.width*.5)}}).start();
		var tween=this.M.T.moveB(this.TargetGroup2,{xy:{x:'-'+(this.TargetGroup2.width*.5+8)}});
		this.M.T.onComplete(tween,function(){
			this.TargetGroup2.removeAll(true);
			var halfLength=Math.floor(this.TargetGroup1.length*.5);
			for(var i=this.TargetGroup1.length-1;i>0;i--)if(i>halfLength)this.TargetGroup2.add(this.TargetGroup1.children[i]);
			this.restart();
		});
		tween.start();
	},

	step2:function(){
		this.M.T.moveB(this.TargetGroup1,{xy:{y:'+'+(this.TargetGroup1.height*.5)}}).start();
		var tween=this.M.T.moveB(this.TargetGroup2,{xy:{y:'-'+(this.TargetGroup2.height*.5+8)}});
		this.M.T.onComplete(tween,function(){
			this.TargetGroup2.removeAll(true);
			for(var i=this.TargetGroup1.length-1;i>0;i--)if(i%4==2||i%4==3)this.TargetGroup2.add(this.TargetGroup1.children[i]);
			this.TargetGroup2.y=this.TargetGroup1.y;
			this.restart();
		});
		tween.start();
	},

	step3:function(){
		this.M.T.moveB(this.TargetGroup1,{xy:{x:'+'+(this.TargetGroup1.height*.5)}}).start();
		var tween=this.M.T.moveB(this.TargetGroup2,{xy:{x:'-'+(this.TargetGroup2.height*.5+8)}});
		this.M.T.onComplete(tween,function(){
			this.TargetGroup2.removeAll(true);
			var halfLength=Math.floor(this.TargetGroup1.length*.5);
			for(var i=this.TargetGroup1.length-1;i>0;i--)if(i>=halfLength)this.TargetGroup2.add(this.TargetGroup1.children[i]);
			this.TargetGroup2.x=this.TargetGroup1.x;
			this.restart();
		});
		tween.start();
	},

	step4:function(){
		this.M.T.moveB(this.TargetGroup1,{xy:{y:'+'+(this.TargetGroup1.height*.5)}}).start();
		var tween=this.M.T.moveB(this.TargetGroup2,{xy:{y:'-'+(this.TargetGroup2.height*.5+8)}});
		this.M.T.onComplete(tween,function(){
			this.TargetGroup2.removeAll(true);
			this.TargetGroup2.add(this.TargetGroup1.children[1]);
			this.TargetGroup2.y=this.TargetGroup1.y;
			this.restart();
		});
		tween.start();
	},

	step5:function(){
		this.M.T.moveB(this.TargetGroup1,{xy:{x:'+'+(this.TargetGroup1.height*.5)}}).start();
		var tween=this.M.T.moveB(this.TargetGroup2,{xy:{x:'-'+(this.TargetGroup2.height*.5+8)}});
		this.M.T.onComplete(tween,this.end);
		tween.start();
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
