BasicGame.Title = function (game) {};

BasicGame.Title.prototype = {

	init: function () {
		this.baseGroup = this.add.group();
		this.baseBtnGroup = this.add.group();
		this.baseBtnTextGroup = this.add.group();
		this.menuGroup = this.add.group();
	},

	create: function () {
		this.genBackGround();
		this.manageBGM();
		this.genTitleText();
		this.genStartBtn();
		this.genOptionBtn();
		this.genOptionMenuContainer();
	},

	goToNextSceen: function () {
        this.game.global.goToNextSceen('CharacterSelect');
	},

	genBackGround: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	manageBGM: function () {
		this.game.global.soundManager.soundPlay('stageSelectBGM');
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

		this.menuGroup.scale.setTo(0);
		this.menuGroup.showTween = this.add.tween(this.menuGroup.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out);
		this.menuGroup.hideTween = this.add.tween(this.menuGroup.scale).to( { x: 0, y: 0 }, 500, Phaser.Easing.Elastic.In);

		var baseBtnGroup = this.baseBtnGroup;
		this.menuGroup.show = function () {
			// TODO open SE
			this.visible = true;
			if ((!this.showTween.isRunning) && this.scale.x === 0) {
				this.showTween.start();
			}
			baseBtnGroup.setAll('inputEnabled', false);
			baseBtnGroup.setAll('input.useHandCursor', false);
		};
		this.menuGroup.hide = function () {
			// TODO close SE
			if ((!this.hideTween.isRunning) && this.scale.x === 1) {
				this.hideTween.start();
			}
			this.hideTween.onComplete.add(function () {
				this.visible = false;
			}, this); // TODO bad???
			baseBtnGroup.setAll('inputEnabled', true);
			baseBtnGroup.setAll('input.useHandCursor', true);
		};
		this.menuGroup.hide();
	},

	genOptionMenuFrame: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		// TODO nine-patch // https://phaser.io/news/2015/08/nine-patch-phaser-plugin
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
		// TODO volume menu
		var x = this.world.centerX;
		var y = this.world.centerY;

		var textStyle = { font: '30px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 6 };
		var volumeTextSprite = this.textSpriteTemplate(x, y-140, 'VOLUME MAX=10', textStyle);
		var seTextSprite = this.textSpriteTemplate(x, y-60, 'SE : 5', textStyle);
		var bgmTextSprite = this.textSpriteTemplate(x, y-10, 'BGM : 5', textStyle);
		var voiceTextSprite = this.textSpriteTemplate(x, y+40, 'VOICE : 5', textStyle);

		this.menuGroup.add(volumeTextSprite);
		this.menuGroup.add(seTextSprite);
		this.menuGroup.add(bgmTextSprite);
		this.menuGroup.add(voiceTextSprite);
	},

	textSpriteTemplate: function (x, y, text, textStyle) {
		var textSprite = this.add.text(x, y, text, textStyle);
		textSprite.anchor.setTo(.5);
		if (textStyle.setShadow) {
			textSprite.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 10);
		}
		return textSprite;
	}
};