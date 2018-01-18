BasicGame.CharacterSelect = function (game) {};

BasicGame.CharacterSelect.prototype = {

	init: function () {},

	create: function () {
		console.log(this);
		this.genBackGround();
		this.genPanelContainer();
	},

	genBackGround: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	genPanelContainer: function () {
		var margin = 10;
		for (var i=0;i<4;i++) { // column
			var x = i * 100 + i * margin + margin; // | o o o o |

			for (var j=0;j<2;j++) { // row
				var y = j * 100 + j * margin + this.world.centerY

				this.genPanel(x, y);
			}
		}
	},

	genPanel: function (x, y) {
		// this.add.sprite(x, y, 'greySheet','grey_panel');

		var btnSprite = this.add.button(
			x, y, 'greySheet', 
			function () {console.log('click');}, this, 
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
	}
};