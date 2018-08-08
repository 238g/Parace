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
		this.time.events.add(500, function () {
			this.inputEnabled = true; 
		}, this);
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		this.time.events.add(500, function () {
			s.stop('currentBGM');
			s.play({key:'TitleBGM',isBGM:true,loop:true,volume:1});
		}, this);
		this.time.events.add(1200, function () {
			if (s.isPlaying('TitleBGM')) return;
			s.stop('currentBGM');
			s.play({key:'TitleBGM',isBGM:true,loop:true,volume:1});
		});
	},

	BgContainer: function () {
		this.stage.backgroundColor = '#ffffff';
		this.genBgSprite();
		this.genTitleTextSprite();
	},

	genBgSprite: function () {
		var bgGroup = this.add.group();
		var s = this.game.global.SpriteManager;
		for (var i=1;i<=this.game.global.albumCount;i++) {
			var sprite = s.genSprite(this.world.centerX,this.world.centerY,'album_'+i);
			sprite.anchor.setTo(.5);
			sprite.scale.setTo(1.78);
			sprite.alpha = 0;
			bgGroup.add(sprite);
		}
		bgGroup.shuffle();
		this.game.global.TweenManager.slideshow(bgGroup,2000,2000);
	},

	genTitleTextSprite: function () {
		var s = this.game.global.SpriteManager;
		var c = this.game.const;
		var textStyle = {
			fontSize: 100,
			fill: c.GAME_TEXT_COLOR,
			stroke: '#FFFFFF',
			strokeThickness: 20,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var textSprite = s.genText(this.world.centerX+100,this.world.centerY+250,c.GAME_TITLE,textStyle);
		this.game.global.TweenManager.beatA(textSprite,180).start();
		this.game.global.TweenManager.beatA(textSprite.multipleTextSprite,180).start();
	},

	BtnContainer: function () {
		var x = this.world.width/4;
		var y = this.world.centerY+400;
		var margin = 150;
		this.genStartBtnSprite(x,y);
		this.genHowtoBtnSprite(x*3,y);
		this.genMuteBtnSprite(x,y+margin);
		this.genFullScreenBtnSprite(x*3,y+margin);
		this.genSoundBtnSprite(x,y+margin*2);
		this.genInquiryBtnSprite(x*3,y+margin*2);
	},

	genStartBtnSprite: function (x,y) {
		var text = 'スタート';
		this.genLabel(x,y,function () {
			this.Dialog.selectShow();
		},text);
	},

	genHowtoBtnSprite: function (x,y) {
		var text = '遊び方';
		this.genLabel(x,y,function () {
			this.Dialog.howtoShow();
		},text);
	},

	genMuteBtnSprite: function (x,y) {
		var offText = '音を出す';
		var onText = '音を消す';
		var text = this.sound.mute ? offText : onText;
		this.genLabel(x,y,function (pointer) {
			if (this.sound.mute) {
				pointer.textSprite.changeText(onText);
				this.sound.mute = false;
			} else {
				pointer.textSprite.changeText(offText);
				this.sound.mute = true;
			}
		},text);
	},

	genFullScreenBtnSprite: function (x,y) {
		var offText = 'フルスクリーン　☓';
		var onText = 'フルスクリーン　◯';
		var text = this.scale.isFullScreen ? offText : onText;
		this.genLabel(x,y,function (pointer) {
			if (this.scale.isFullScreen) {
				pointer.textSprite.changeText(onText);
				this.scale.stopFullScreen(false);
			} else {
				pointer.textSprite.changeText(offText);
				this.scale.startFullScreen(false);
			}
		},text);
	},

	genLabel: function (x,y,func,text) {
		var c = this.game.const;
		var textStyle = {
			fontSize: '43px',
			fill: c.GAME_TEXT_COLOR,
			stroke: '#FFFFFF',
			strokeThickness: 20,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var s = this.game.global.SpriteManager;
		var labelSprite = s.genLabel(x,y,'greySheet',func,this,text,textStyle);
		labelSprite.btnSprite.setFrames('grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		labelSprite.btnSprite.scale.setTo(2.2);
		labelSprite.btnSprite.tint = c.GAME_MAIN_COLOR_B;
		labelSprite.btnSprite.UonInputDown(function () {
			this.game.global.SoundManager.play({key:'Ou',volume:1,});
		}, this);
		return labelSprite;
	},

	genSoundBtnSprite: function (x,y) {
		var s = this.game.global.SpriteManager;
		var c = this.game.const;
		var textStyle = {
			fontSize: '43px',
			fill: c.GAME_TEXT_COLOR,
			stroke: '#FFFFFF',
			strokeThickness: 20,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		for (var i=0;i<3;i++) {
			var editX = x+130*i-130;
			var btn = this.add.button(editX,y,'greySheet',function (pointer) {
				var volume = .9;
				if (pointer.i == 0) volume = 1.1; 
				this.game.global.SoundManager.play({key:'SoundBtn_'+(pointer.i+1),volume:volume});
			},this);
			btn.tint = c.GAME_MAIN_COLOR_B;
			btn.anchor.setTo(.5);
			btn.scale.setTo(3);
			btn.frameName = 'grey_circle';
			btn.i = i;
			s.genText(editX,y,(i+1),textStyle);
		}
	},

	DialogContainer: function () {
		var c = {};
		var panelSprite = this.genDialogSprite();
		var selectContainer = this.SelectContainer();
		var howtoTextSprite = this.genHowtoTextSprite();
		var t = this.game.global.TweenManager;
		t.onComplete(panelSprite.tweenMidDialog, function () {
			if (panelSprite.visible) {
				if (panelSprite.showWhat == 'select') {
					selectContainer.show();
				} else {
					howtoTextSprite.show();
				}
			} else {
				panelSprite.scale.setTo(0);
				panelSprite.hide();
			}
		}, this);
		c.selectShow = function () {
			panelSprite.show();
			panelSprite.showWhat = 'select';
			panelSprite.tweenShow();
		};
		c.howtoShow = function () {
			panelSprite.show();
			panelSprite.showWhat = 'howto';
			panelSprite.tweenShow();
		};
		this.game.input.onDown.add(function (p) {
			if (panelSprite.visible) {
				var t = p.targetObject;
				if (t && t.sprite && t.sprite.type=='play') return;
				panelSprite.hide();
				panelSprite.scale.setTo(0);
				selectContainer.hide();
				howtoTextSprite.hide();
				this.game.global.SoundManager.play({key:'Ou',volume:1});
			}
		}, this);
		return c;
	},

	genDialogSprite: function () {
		var c = this.game.const;
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		panelSprite.hide();
		return s.setMidDialog(panelSprite,{
			tween:'popUpA',
			duration: 500,
			scale:{x:8,y:13},
			tint:c.GAME_MAIN_COLOR_B,
		});
	},

	SelectContainer: function () {
		var c = {};
		var selectTitleTextSprite = this.genSelectTitleTextSprite();
		var selectGroup = this.add.group();
		var m = this.game.conf.ModeInfo;
		for (var key in m) this.genDifficultyBtnSprite(m[key],selectGroup);
		selectGroup.visible = false;
		c.show = function () {
			selectTitleTextSprite.show();
			selectGroup.visible = true;
		};
		c.hide = function () {
			selectTitleTextSprite.hide();
			selectGroup.visible = false;
		};
		return c;
	},

	genSelectTitleTextSprite: function () {
		var c = this.game.const;
		var textStyle = {
			fontSize: '60px',
			fill: c.GAME_TEXT_COLOR,
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var s = this.game.global.SpriteManager;
		var text = '難易度を 選んでね';
		var textSprite = s.genText(this.world.centerX, 280, text, textStyle);
		textSprite.hide();
		return textSprite;
	},

	genDifficultyBtnSprite: function (ModeInfo, group) {
		var x = this.world.centerX;
		var y = 300 * ModeInfo.array + 200;
		var c = this.game.const;
		var textStyle = {
			fontSize: '80px',
			fill: c.GAME_TEXT_COLOR,
			stroke: '#FFFFFF',
			strokeThickness: 20,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x,y,'greySheet',function () {
			this.game.global.currentMode = ModeInfo.key;
			this.play();
		},this);
		btnSprite.setFrames('grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.scale.setTo(3);
		btnSprite.anchor.setTo(.5);
		btnSprite.tint = c.GAME_MAIN_COLOR_B;
		btnSprite.type = 'play';
		var textSprite = s.genText(x,y,ModeInfo.text,textStyle);
		group.add(btnSprite);
		group.add(textSprite.multipleTextSprite);
		group.add(textSprite);
	},

	genHowtoTextSprite: function () {
		var c = this.game.const;
		var textStyle = {
			fontSize: 40,
			fill: c.GAME_TEXT_COLOR,
			stroke:'#FFFFFF',
			strokeThickness: 10,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 15,
			wordWrap: true,
			wordWrapWidth: 300,
		};
		var s = this.game.global.SpriteManager;
		var beforeText = 
			'あみを　投げて '
			+'アズリムと　一緒に '
			+'魚を　つかまえよう！ '
			+' '
			+'あみを　投げると '
			+'スタミナを　消費するよ！ '
			+'スタミナが　なくなると '
			+'全回復まで　あみを　投げれないよ '
			+' '
			+'魚によって　スコアが違うよ ';
		var fishText_1 = 'フグ/うなぎ　→　５倍 ';
		var fishText_2 = 'ピンク/青色/オレンジ　→　３倍 ';
		var fishText_3 = '赤色/緑色　→　１倍 ';
		var fishMinus = '骨　→　-マイナス点 ';
		var fishBonus = '牛丼　→　ボーナスモード ';
		var middleText = fishText_1+fishText_2+fishText_3+fishMinus+fishBonus;
		var afterText =
			' '
			+'まとめて　つかまえて '
			+'スコアアップ！！ '
			+'めざせ！　高得点！';
		var textSprite = s.genText(this.world.centerX, this.world.centerY, beforeText+middleText+afterText, textStyle);
		textSprite.addStrokeColor('#ffffff', 0);
		var textLength = beforeText.length;
		textSprite.addColor('#ff0000', textLength); // 1
		textLength += fishText_1.length;
		textSprite.addColor('#ff00ff', textLength); // 2
		textLength += fishText_2.length;
		textSprite.addColor('#3cb371', textLength); // 3
		textLength += fishText_3.length;
		textSprite.addColor('#4169e1', textLength); // minus
		textLength += fishMinus.length;
		textSprite.addColor('#ff8c00', textLength); // bonus
		textLength += fishBonus.length;
		textSprite.addColor(c.GAME_TEXT_COLOR, textLength);
		textSprite.hide();
		return textSprite;
	},

	genInquiryBtnSprite: function (x,y) {
		var text = '他のゲームを遊ぶ';
		this.genLabel(x,y,function () {
			var url = 'https://238g.github.io/Parace/238Games2.html';
			if (this.game.device.desktop) {
				window.open(url,'_blank');
			} else {
				location.href = url;
			}
		},text);
	},

	play: function () {
		if (this.inputEnabled) {
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}
	},
};
