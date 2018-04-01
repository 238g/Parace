BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
		this.Dialog = null;
	},

	create: function () {
		this.BgContainer();
		this.BtnContainer();
		this.Dialog = this.DialogContainer();
		this.soundController();
		this.inputController();
	},

	inputController: function () {
		this.time.events.add(800, function () {
			this.inputEnabled = true; 
		}, this);
	},

	soundController: function () {
		var s = this.M.SE;
		s.stop('currentBGM');
		this.time.events.add(500, function () {
			s.stop('currentBGM');
			s.play('TitleBGM',{isBGM:true,loop:true,volume:.9});
		}, this);
		this.time.events.add(1200, function () {
			if (s.isPlaying('TitleBGM')) return;
			s.stop('currentBGM');
			s.play('TitleBGM',{isBGM:true,loop:true,volume:.9});
		});
	},

	BgContainer: function () {
		this.stage.backgroundColor = '#ffffff';
		this.genBgSprite();
		this.genTitleTextSprite();
	},

	genBgSprite: function () {
		var charSpriteP = this.add.sprite(this.world.width-120,180,'Pandey_1');
		charSpriteP.anchor.setTo(.5,0);
		charSpriteP.scale.setTo(1.3);
		var charSpriteK = this.add.sprite(this.world.centerX-50,this.world.centerY+80,'Kashikomari_1');
		charSpriteK.anchor.setTo(.5);
		charSpriteK.scale.setTo(1.8);
		var logoBgSprite = this.M.S.genBmpSprite(this.world.width,this.world.height,450,190,'#fff');
		logoBgSprite.anchor.setTo(1);
		var logoSprite = this.M.S.genSprite(this.world.width,this.world.height,'Logo')
		logoSprite.anchor.setTo(1);
		logoSprite.scale.setTo(.4);
		logoSprite.UonInputDown(function () {
			window.open('https://www.youtube.com/channel/UCfiK42sBHraMBK6eNWtsy7A','_blank');	
		});
	},

	genTitleTextSprite: function () {
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 80;
		var textSprite = this.M.S.genText(
			this.world.centerX-30,130,
			this.M.getConst('GAME_TITLE'),textStyle);
		textSprite.addTween('beatA',{duration:764});
		textSprite.startTween('beatA');
	},

	BtnContainer: function () {
		var textStyle = this.StaticBaseTextStyle();
		var x = this.world.width/4;
		var y = this.world.centerY+400;
		var margin = 150;
		var tint = this.M.getConst('MAIN_TINT');
		this.genStartBtnSprite(x,y,textStyle,tint);
		this.genHowtoBtnSprite(x*3,y,textStyle,tint);
		this.genMuteBtnSprite(x,y+margin,textStyle,tint);
		// this.genFullScreenBtnSprite(x*3,y+margin,textStyle,tint);
		this.genInquiryBtnSprite(x,y+margin*2,textStyle,tint);
	},

	genStartBtnSprite: function (x,y,textStyle,tint) {
		var text = 'スタート';
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.Dialog.showDialog('select');
		},text,textStyle,{tint:tint});
	},

	genHowtoBtnSprite: function (x,y,textStyle,tint) {
		var text = '遊び方';
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.Dialog.showDialog('howto');
		},text,textStyle,{tint:tint});
	},

	genMuteBtnSprite: function (x,y,textStyle,tint) {
		var offText = '効果音をつける';
		var onText = '効果音を消す';
		var text = this.sound.mute ? offText : onText;
		var label = this.M.S.BasicGrayLabel(x,y,function (pointer) {
			if (this.sound.mute) {
				pointer.textSprite.changeText(onText);
				this.sound.mute = false;
			} else {
				pointer.textSprite.changeText(offText);
				this.sound.mute = true;
			}
		},text,textStyle,{tint:tint});
	},

	genFullScreenBtnSprite: function (x,y,textStyle,tint) {
		var offText = 'フルスクリーンOFF';
		var onText = 'フルスクリーンON';
		var text = this.scale.isFullScreen ? offText : onText;
		var label = this.M.S.BasicGrayLabel(x,y,function (pointer) {
			if (this.scale.isFullScreen) {
				pointer.textSprite.changeText(onText);
				this.scale.stopFullScreen(false);
			} else {
				pointer.textSprite.changeText(offText);
				this.scale.startFullScreen(false);
			}
		},text,textStyle,{tint:tint});
	},

	genInquiryBtnSprite: function (x,y,textStyle,tint) {
		var text = 'お問い合わせ';
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			window.open('https://twitter.com/'+__DEVELOPER_TWITTER_ID,'_blank');
		},text,textStyle,{tint:tint});
	},

	DialogContainer: function () {
		var Dialog = {
			selectContainer:null,
			howtoTextSprite:null,
			dialogSprite:null,
			showDialog:null,
		};
		this.genDialogSprite(Dialog);
		this.SelectContainer(Dialog);
		this.genHowtoTextSprite(Dialog);
		this.dialogInputController(Dialog);
		return Dialog;
	},

	genDialogSprite: function (Dialog) {
		Dialog.dialogSprite = this.M.S.genDialog('Dialog_1',{
			tint: 0xffeb8f,
			onComplete:function () {
				if (Dialog.dialogSprite.visible) {
					if (Dialog.dialogSprite.showTarget == 'select') {
						Dialog.selectContainer.show();
					} else {
						Dialog.howtoTextSprite.show();
					}
				} else {
					Dialog.dialogSprite.scale.setTo(0);
					Dialog.dialogSprite.hide();
				}
			},
		});
		Dialog.dialogSprite.hide();
		Dialog.showDialog = function (showTarget) {
			Dialog.dialogSprite.showTarget = showTarget;
			Dialog.dialogSprite.show();
			Dialog.dialogSprite.tweenShow();
		};
	},

	dialogInputController: function (Dialog) {
		this.game.input.onDown.add(function (p) {
			if (Dialog.dialogSprite.visible) {
				var t = p.targetObject;
				if (t && t.sprite && t.sprite.type=='play') return;
				Dialog.dialogSprite.hide();
				Dialog.dialogSprite.scale.setTo(0);
				Dialog.selectContainer.hide();
				Dialog.howtoTextSprite.hide();
			}
			this.M.SE.play('HitTheTambourine_1');
		}, this);
	},

	SelectContainer: function (Dialog) {
		var selectGroup = this.add.group();
		this.genSelectTitleTextSprite(selectGroup);
		this.genSelectBtnLabels(selectGroup);
		selectGroup.visible = false;
		Dialog.selectContainer = {
			show: function () {
				selectGroup.visible = true;
			},
			hide: function () {
				selectGroup.visible = false;
			},
		};
	},

	genSelectTitleTextSprite: function (selectGroup) {
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 80;
		var textSprite = this.M.S.genText(this.world.centerX,200,'曲を選ぶ',textStyle);
		textSprite.addGroup(selectGroup);
	},

	genSelectBtnLabels: function (selectGroup) {
		var infos = this.M.getConf('YoutubeInfo');
		var textStyle = this.StaticBaseTextStyle();
		var tint = this.M.getConst('MAIN_TINT');
		var x = this.world.centerX;
		for (var i=0;i<infos.length;i++) {
			var info = infos[i];
			var text = info.btnText;
			var y = i * 200 + 350;
			var label = this.M.S.BasicGrayLabel(x,y,function () {
				this.M.NextScene('Play');
			},text,textStyle,{tint:tint});
			label.btnSprite.scale.setTo(4,2.2);
			selectGroup.add(label.btnSprite);
			label.textSprite.addGroup(selectGroup);
		}
	},

	genHowtoTextSprite: function (Dialog) {
		var text = 
			'ちゃんまりと一緒に音楽を奏でよう！ '
			+' '
			+'飛んでくるパンディが '
			+'パネルのパンディと重なる '
			+'タイミングでパネルを押そう！ '
			+' '
			+'タイミングが良いとスコアが高くなるよ！ '
			+' '
			+'演奏が終わるとランクやコンボ数が出るよ '
			+'ランクはS,AAA,AA,A,B,C,D,E,Fがあるよ '
			+' '
			+'コンボを重ねて　目指せ！高ランク！ '
			+' ';
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 40;
		textStyle.wordWrap = true;
		Dialog.howtoTextSprite = this.M.S.genText(this.world.centerX, this.world.centerY, text, textStyle);
		Dialog.howtoTextSprite.hide();
	},

	StaticBaseTextStyle: function () {
		return {
			fill: this.M.getConst('MAIN_TEXT_COLOR'),
			stroke:'#FFFFFF',
			strokeThickness: 15,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 10,
		};
	},
};
