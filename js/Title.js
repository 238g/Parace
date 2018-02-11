BasicGame.Title = function (game) {};

BasicGame.Title.prototype = {

	init: function () {
		this.baseGroup = this.add.group();
		this.baseBtnGroup = this.add.group();
		this.baseBtnTextGroup = this.add.group();
		this.menuGroup = this.add.group();
	},

	create: function () {
		this.compatible();
		this.genBackGround();
		this.manageBGM();
		this.genTitleText();
		this.genStartBtn();
		this.genOptionBtn();
		this.genOptionMenuContainer();
	},

	compatible: function () {
		var d = this.game.device;
		// console.log(d);
		if ((d.chrome || d.iOS) && d.touch) {
			var scaleX = 1.2;
			var scaleY = 1.2;
			if (d.iPad) {
				scaleX = .8;
				scaleY = .8;
			}
			setTimeout(function (self) {
				self.game.input.scale.set(scaleX, scaleY);
			}, 1000, this);
			var textStyle = { font: '20px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 5};
			this.textSpriteTemplate(this.world.centerX, this.world.centerY/2+60, '※Chromeは非推奨です', textStyle);
		}
	},

	goToNextSceen: function () {
        this.game.global.goToNextSceen('CharacterSelect');
	},

	genBackGround: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	manageBGM: function () {
		var bgm = this.game.global.soundManager.getSound('currentBGM');
		if (!bgm) {
			this.game.global.soundManager.soundPlay('stageSelectBGM');
		}
	},

	genTitleText: function () {
		var textStyle = { font: '50px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 3, setShadow: true };
		var textSprite = this.textSpriteTemplate(this.world.centerX, this.world.centerY/2, '秒当てゲーム', textStyle);
		this.baseGroup.add(textSprite);
	},

	genStartBtn: function () {
		var x = this.world.centerX;
		var y = this.world.centerY+100;

		this.btnTemplate(x, y, function () {
			this.game.global.soundManager.soundPlay('selectSE');
			this.goToNextSceen();
		}, '  START  ');
	},

	genOptionBtn: function () {
		var x = this.world.centerX;
		var y = this.world.centerY+200;

		this.btnTemplate(x, y, function () {
			this.menuGroup.show();
		}, '  OPTION  ');
	},

	btnTemplate: function (x, y, inputFunc, text) {
		var btnSprite = this.add.button(
			x, y, 'yellowSheet', inputFunc, this, 
			'yellow_button04', 'yellow_button02', 'yellow_button05'
		);
		btnSprite.anchor.setTo(.5);

		var textStyle = { fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 3, setShadow: true };
		var textSprite = this.textSpriteTemplate(x, y, text, textStyle);

		this.baseBtnGroup.add(btnSprite);
		this.baseBtnTextGroup.add(textSprite);
	},

	genOptionMenuContainer: function () {
		this.genOptionMenuFrame();
		this.genOptionMenuContents();

		var g = this.game.global;

		this.menuGroup.scale.setTo(0);
		this.menuGroup.showTween = g.tweenManager.genTween(this, 'ShowMenu', this.menuGroup.scale);
		this.menuGroup.hideTween = g.tweenManager.genTween(this, 'HideMenu', this.menuGroup.scale);

		var baseBtnGroup = this.baseBtnGroup;
		this.menuGroup.show = function () {
			if ((!this.showTween.isRunning) && this.scale.x === 0) {
				this.visible = true;
				g.soundManager.soundPlay('openWindowSE');
				this.showTween.start();
				baseBtnGroup.setAll('inputEnabled', false);
				baseBtnGroup.setAll('input.useHandCursor', false);
			}
		};
		this.menuGroup.hide = function () {
			if ((!this.hideTween.isRunning) && this.scale.x === 1) {
				this.hideTween.onComplete.addOnce(function () {
					this.visible = false;
				}, this);
				g.soundManager.soundPlay('closeWindowSE');
				this.hideTween.start();
				baseBtnGroup.setAll('inputEnabled', true);
				baseBtnGroup.setAll('input.useHandCursor', true);
			}
		};
		this.menuGroup.hide();
	},

	genOptionMenuFrame: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		var menuBgSprite = this.add.sprite(x, y, 'greySheet', 'grey_panel');
		menuBgSprite.anchor.setTo(.5);
		menuBgSprite.scale.x = 3;
		menuBgSprite.scale.y = 4;

		var closeBtn = this.add.button(
			menuBgSprite.right, menuBgSprite.top, 'redSheet',
			function () {
				this.menuGroup.hide();
			}, this,
			'red_boxCross', 'red_boxCross'
		);
		closeBtn.anchor.setTo(.5);
		closeBtn.scale.setTo(1.2);

		this.menuGroup.add(menuBgSprite);
		this.menuGroup.add(closeBtn);
	},

	genOptionMenuContents: function () {
		var x = this.world.centerX;
		var y = this.world.centerY-140;
		
		var topMarginY = 70;
		var middleMarginY = 50;
		var marginY = [topMarginY];
		for (var i=1;i<=4;i++) {
			marginY.push(topMarginY+middleMarginY*i);
		}

		var textStyle = { font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 6 };
		
		var volumeTextSprite = this.textSpriteTemplate(x, y, 'VOLUME MAX=10', textStyle);
		var masterTextSprite = this.textSpriteTemplate(x, y+marginY[0], 'MASTER : 5', textStyle);
		var seTextSprite = this.textSpriteTemplate(x, y+marginY[1], 'SE : 5', textStyle);
		var bgmTextSprite = this.textSpriteTemplate(x, y+marginY[2], 'BGM : 5', textStyle);
		var voiceTextSprite = this.textSpriteTemplate(x, y+marginY[3], 'VOICE : 5', textStyle);
		var muteTextSprite = this.textSpriteTemplate(x, y+marginY[4], 'MUTE', textStyle);

		this.menuGroup.add(volumeTextSprite);
		this.menuGroup.add(masterTextSprite);
		this.menuGroup.add(seTextSprite);
		this.menuGroup.add(bgmTextSprite);
		this.menuGroup.add(voiceTextSprite);
		this.menuGroup.add(muteTextSprite);

		this.genVolumeControlBtn(x-120, y+marginY[0], 'master', '-', masterTextSprite);
		this.genVolumeControlBtn(x+120, y+marginY[0], 'master', '+', masterTextSprite);
		this.genVolumeControlBtn(x-120, y+marginY[1], 'se',     '-', seTextSprite);
		this.genVolumeControlBtn(x+120, y+marginY[1], 'se',     '+', seTextSprite);
		this.genVolumeControlBtn(x-120, y+marginY[2], 'bgm',    '-', bgmTextSprite);
		this.genVolumeControlBtn(x+120, y+marginY[2], 'bgm',    '+', bgmTextSprite);
		this.genVolumeControlBtn(x-120, y+marginY[3], 'voice',  '-', voiceTextSprite);
		this.genVolumeControlBtn(x+120, y+marginY[3], 'voice',  '+', voiceTextSprite);
		this.genVolumeControlBtn(x+120, y+marginY[4], 'mute',   'x', muteTextSprite);
	},

	textSpriteTemplate: function (x, y, text, textStyle) {
		var textSprite = this.add.text(x, y, text, textStyle);
		textSprite.anchor.setTo(.5);
		if (textStyle.setShadow) {
			textSprite.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 10);
		}
		textSprite.changeText = function (text) {
			textSprite.setText(text);
		};
		return textSprite;
	},

	genVolumeControlBtn: function (x, y, type, text, changeTextSprite) {
		function changeText () {
			var originVolume = this.game.global.soundVolumes[type];
			var viewVolume = originVolume * 10;

			var changeText = '';
			switch (type) {
				case 'master': changeText = 'MASTER : '+viewVolume; break;
				case 'se': changeText = 'SE : '+viewVolume; break;
				case 'bgm': changeText = 'BGM : '+viewVolume; break;
				case 'voice': changeText = 'VOICE : '+viewVolume; break;
			}
			if (changeText) {
				changeTextSprite.changeText(changeText);
			}
		}
		function btnClick (event) {
			if (text == '+') {
				this.game.global.soundManager.soundPlay('volumeControlBtnSE');
				this.game.global.soundManager.volumeUp(type);
			} else if (text == '-') {
				this.game.global.soundManager.soundPlay('volumeControlBtnSE');
				this.game.global.soundManager.volumeDown(type);
			} else {
				this.game.global.soundManager.volumeMute();
			}

			changeText.bind(this)();

			if (type == 'mute') {
				text = (text == 'x') ? 'o' : 'x';
				event.changeText(text);
			}
		}

		var btnSprite = this.add.button(
			x, y, 'blueSheet',
			btnClick, this,
			'blue_circle', 'blue_circle'
		);
		btnSprite.anchor.setTo(.5);

		var textStyle = { font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 6 };
		var textSprite = this.add.text(x, y, text, textStyle);
		textSprite.anchor.setTo(.5);

		btnSprite.changeText = function (text) {
			textSprite.setText(text);
		};

		this.menuGroup.add(btnSprite);
		this.menuGroup.add(textSprite);

		if (text == '-') {
			changeText.bind(this)();
		}
	}
};