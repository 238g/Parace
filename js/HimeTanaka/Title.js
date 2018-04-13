BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
		this.Dialog = null;
		this.world.setBounds(0, 0, this.game.width, this.game.height);
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
			s.play('TitleBGM',{isBGM:true,loop:true,volume:1});
		}, this);
		this.time.events.add(1200, function () {
			if (s.isPlaying('TitleBGM')) return;
			s.stop('currentBGM');
			s.play('TitleBGM',{isBGM:true,loop:true,volume:1});
		});
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genBgCharSprite();
		this.genTitleTextSprite();
	},

	genBgCharSprite: function () {
		var bgGroup = this.add.group();
		for (var i=1;i<=this.M.getConst('ALBUM_COUNT');i++) {
			var sprite = this.add.sprite(this.world.centerX,this.world.centerY-100,'Album_'+i);
			sprite.anchor.setTo(.5);
			sprite.alpha = 0;
			bgGroup.add(sprite);
		}
		bgGroup.shuffle();
		this.M.T.slideshow(bgGroup,{duration:2000,delay:2000});
	},

	genTitleTextSprite: function () {
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 80;
		var textSprite = this.M.S.genText(
			this.world.centerX-30,130,
			this.M.getConst('GAME_TITLE'),textStyle);
		textSprite.addTween('beatA',{duration:508});
		textSprite.startTween('beatA');
	},

	BtnContainer: function () {
		var textStyle = this.StaticBaseTextStyle();
		var x = this.world.width/4;
		var y = this.world.centerY+400;
		var margin = 150;
		var tint = this.M.getConst('MAIN_TINT');
		this.genStartBtnSprite(x,y,textStyle,tint);
		// this.genHowtoBtnSprite(x*3,y,textStyle,tint);
		this.genMuteBtnSprite(x*3,y,textStyle,tint);
		this.genFullScreenBtnSprite(x*3,y+margin,textStyle,tint);
		this.genInquiryBtnSprite(x,y+margin,textStyle,tint);
		this.genLogoBtnSprite();
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
		var offText = 'ミュートOFF';
		var onText = 'ミュートON';
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
		var text = '他のゲームを遊ぶ';
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			var url = 'https://238g.github.io/Parace/238Games.html';
			if (this.game.device.desktop) {
				window.open(url,'_blank');
			} else {
				location.href = url;
			}
		},text,textStyle,{tint:tint});
	},

	genLogoBtnSprite: function () {
		var logoSprite = this.M.S.genSprite(this.world.centerX,this.world.height-25,'Logo');
		logoSprite.anchor.setTo(.5,1);
		logoSprite.UonInputDown(function () {
			window.open(this.M.getConst('YOUTUBE_URL'),'_blank');	
		});
		this.M.T.beatA(logoSprite,{duration:508}).start();
		var logoBgSprite = this.M.S.genBmpSprite(
			this.world.centerX,this.world.height-5,
			logoSprite.width+80,logoSprite.height+50,this.M.getConst('MAIN_COLOR'));
		logoBgSprite.anchor.setTo(.5,1);
		this.world.bringToTop(logoSprite);
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
		// this.genHowtoTextSprite(Dialog);
		this.dialogInputController(Dialog);
		return Dialog;
	},

	genDialogSprite: function (Dialog) {
		Dialog.dialogSprite = this.M.S.genDialog('Dialog',{
			tint: this.M.getConst('SUB_TINT'),
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
		var self = this;
		Dialog.showDialog = function (showTarget) {
			self.M.SE.play('Gong');
			Dialog.dialogSprite.showTarget = showTarget;
			Dialog.dialogSprite.show();
			Dialog.dialogSprite.tweenShow();
		};
	},

	dialogInputController: function (Dialog) {
		this.game.input.onDown.add(function (p) {
			if (Dialog.dialogSprite.visible) {
				var t = p.targetObject;
				if (t && t.sprite && t.sprite.Utype=='play') return;
				Dialog.dialogSprite.hide();
				Dialog.dialogSprite.scale.setTo(0);
				Dialog.selectContainer.hide();
				Dialog.howtoTextSprite.hide();
			}
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
		var textSprite = this.M.S.genText(this.world.centerX,230,'ステージを選択',textStyle);
		textSprite.addGroup(selectGroup);
	},

	genSelectBtnLabels: function (selectGroup) {
		var textStyle = this.StaticBaseTextStyle();
		var tint = this.M.getConst('MAIN_TINT');
		var x = this.world.centerX;
		var LevelInfo = this.M.getConf('LevelInfo');
		var i = 0;
		for (var idNum in LevelInfo) {
			var text = 'レベル '+idNum;
			var y = i * 150 + 350;
			var label = this.M.S.BasicGrayLabel(x,y,function (btnSprite) {
				this.M.SE.play('Gong');
				this.M.setGlobal('currentLevel', btnSprite.level);
				this.M.NextScene('Play');
			},text,textStyle,{tint:tint});
			label.btnSprite.scale.setTo(2.5,2.2);
			label.btnSprite.Utype = 'play';
			label.btnSprite.level = idNum;
			selectGroup.add(label.btnSprite);
			label.textSprite.addGroup(selectGroup);
			i++;
		}
	},

	genHowtoTextSprite: function (Dialog) {
		var word = 'クリック';
		if (this.game.device.touch) word = 'タッチ';
		var text = 
			'説明欄！ '
			+' '
			+'説明欄！ '
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
			stroke: this.M.getConst('WHITE_COLOR'),
			strokeThickness: 15,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 10,
		};
	},
};
