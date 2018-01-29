BasicGame.CharacterSelect = function (game) {};

BasicGame.CharacterSelect.prototype = {

	init: function () {
		var g = this.game.global;
		this.charCount = g.charCount;
		this.currentCharNum = g.currentCharNum;

		this.charInfo = this.game.conf.charInfo;

		// for change char
		this.charFrameSprite;
		this.charSprite;
		this.charNameSprite;
	},

	create: function () {
		this.genBackGround();
		this.manageBGM();
		this.genSelectedCharContainer();
		this.genPanelContainer();
		this.genSelectedBtn();
		this.genBackBtn();
	},

	genBackGround: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	manageBGM: function () {
		var bgm = this.game.global.soundManager.getSound('currentBGM');
		if (!bgm.isPlaying) {
			this.game.global.soundManager.soundPlay('currentBGM');
		}
	},

	genSelectedCharContainer: function () {
		var x = this.world.centerX;
		// var y = this.world.centerY;
		var y = 210;

		// TODO frame change color?? conf color
		this.charFrameSprite = this.genCharFrame(x, y);
		this.charSprite = this.genCharSprite(x, y);
		this.charNameSprite = this.genCharNameText(x, y);
	},

	genCharFrame: function (x, y) {
		var charInfo = this.charInfo;
		var frameSprite = this.add.sprite(x, y, 'greySheet', 'grey_panel');
		frameSprite.anchor.setTo(.5);
		frameSprite.scale.setTo(3);
		frameSprite.changeColor = function (currentCharNum) {
			frameSprite.tint = charInfo[currentCharNum].color;
		};
		frameSprite.changeColor(this.currentCharNum);
		return frameSprite;
	},

	genCharSprite: function (x, y) {
		var charSprite = this.add.sprite(x, y, 'smile_1_'+this.currentCharNum);
		charSprite.anchor.setTo(.5);

		charSprite.changeImg = function (currentCharNum) {
			charSprite.loadTexture('smile_1_'+currentCharNum);
		};
		return charSprite;
	},

	genCharNameText: function () {
		var textStyle = { font: '40px Arial', fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 10 };
		var charInfo = this.charInfo;
		var name = charInfo[this.currentCharNum].name;
		var textSprite = this.add.text(this.world.centerX, this.world.centerY/2-100, name, textStyle);
		textSprite.anchor.setTo(.5);

		textSprite.changeText = function (currentCharNum) {
			name = charInfo[currentCharNum].name;
			textSprite.setText(name);
		};
		return textSprite;
	},

	genPanelContainer: function () {
		var margin = 10;
		var columnMax = 4;
		var rowMax = Math.ceil(this.charCount/4);
		for (var i=0;i<columnMax;i++) { // column
			var x = i * 100 + i * margin + margin; // | o o o o |

			for (var j=0;j<rowMax;j++) { // row
				var y = j * 100 + j * margin + this.world.centerY

				var panelNum = i + (j * 4) + 1; // equal const CHAR_[NAME]
				if (this.charCount < panelNum) { break; }
				this.genPanel(x, y, panelNum);
			}
		}
	},

	genPanel: function (x, y, panelNum) {
		var btnSprite = this.add.button(
			x, y, 'greySheet', 
			this.selectedChar, this, 
			'grey_panel', 'grey_panel'
		);

		var tween = this.add.tween(btnSprite);
		tween.to({ alpha: .2 }, 300, "Linear", false, 0, -1, true);
		
		btnSprite.onInputOver.add(function () {
			if (tween.isPaused) {
				tween.resume();
			} else {
				tween.start();
			}
			// TODO over sound
		}, this);
		btnSprite.onInputOut.add(function () {
			tween.pause();
			btnSprite.alpha = 1;
		}, this);

		btnSprite.panelNum = panelNum;
		btnSprite.borderLayer = this.add.group();
		btnSprite.iconLayer = this.add.group();

		this.genIcon(btnSprite);
	},

	genIcon: function (parentSprite) {
		var panelNum = parentSprite.panelNum;
		var x = parentSprite.x + 10;
		var y = parentSprite.y + 10;
		var iconSprite = this.add.sprite(x, y, 'icon_' + panelNum);
		iconSprite.scale.setTo(.8);
	},

	selectedChar: function (btnEvent) {
		var currentCharNum = btnEvent.panelNum;
		this.currentCharNum = currentCharNum;
		this.setCurrentChar(currentCharNum);
		this.changeCharContent(currentCharNum);
		this.game.global.soundManager.soundPlay('selectSE'); // TODO char voice
	},

	setCurrentChar: function (currentCharNum) {
		this.game.global.currentCharNum = currentCharNum;
	},

	changeCharContent: function (currentCharNum) {
		this.charFrameSprite.changeColor(currentCharNum);
		this.charSprite.changeImg(currentCharNum);
		this.charNameSprite.changeText(currentCharNum);
	},

	genSelectedBtn: function () {
		var x = this.world.width*3/4;
		var y = this.world.centerY-60;

		this.btnTemplate(x, y, function () {
			this.game.global.soundManager.soundPlay('selectSE');
			this.game.global.goToNextSceen('Play');
		}, '  SELECT  ');
	},

	genBackBtn: function () {
		var x = 100;
		var y = 30;

		this.btnTemplate(x, y, function () {
			this.game.global.soundManager.soundPlay('cancelSE');
			this.game.global.goToNextSceen('Title');
		}, '  BACK  ');
	},

	btnTemplate: function (x, y, inputFunc, text) {
		var btnSprite = this.add.button(
			x, y, 'greySheet', inputFunc, this, 
			'grey_button15', 'grey_button01', 'grey_button04'
		);
		btnSprite.anchor.setTo(.5);

		var textStyle = { fill: '#FFFFFF', align: 'center', stroke: '#000000', strokeThickness: 3 };
		var textSprite = this.add.text(x, y, text, textStyle);
		textSprite.anchor.setTo(.5);
		textSprite.setShadow(0, 0, 'rgba(0, 0, 0, 0.5)', 10);
	}
};