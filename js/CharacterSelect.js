BasicGame.CharacterSelect = function (game) {};

BasicGame.CharacterSelect.prototype = {

	init: function () {
		var g = this.game.global;
		// TODO first kizuna ai -> const // if global current, its because back
		// this.currentCharacter = g.currentCharacter;
		this.characterCount = g.characterCount;
	},

	create: function () {
		this.genBackGround();
		// TODO gen selected character big image area
		this.genPanelContainer();
		// TODO selected so play btn
	},

	goToNextSceen: function () {
        this.game.global.goToNextSceen('Play');
	},

	genBackGround: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	genPanelContainer: function () {
		var margin = 10;
		var columnMax = 4;
		var rowMax = Math.ceil(this.characterCount/4);
		for (var i=0;i<columnMax;i++) { // column
			var x = i * 100 + i * margin + margin; // | o o o o |

			for (var j=0;j<rowMax;j++) { // row
				var y = j * 100 + j * margin + this.world.centerY

				var panelNum = i + (j * 4) + 1;
				if (this.characterCount < panelNum) { break; }
				this.genPanel(x, y, panelNum);
			}
		}
	},

	genPanel: function (x, y, panelNum) {
		var btnSprite = this.add.button(
			x, y, 'greySheet', 
			// TODO selected character, goto->lower play btn
			this.goToNextSceen, this, 
			// function () {console.log('click'+panelNum);}, this, 
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
	}
};