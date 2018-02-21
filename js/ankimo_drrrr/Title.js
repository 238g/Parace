BasicGame.Title = function () {};

BasicGame.Title.prototype = {
	init: function () {
		this.stage.setBackgroundColor(0xfbf6d5);
	},

	create: function () {
		this.genBG();
		this.genTextContainer();
		this.soundController();
		setTimeout(function () { this.inputController(); }.bind(this), 500);
	},

	genBG: function () {
		var rndNum = this.rnd.integerInRange(1,3);
		if (rndNum == 1) {
			var sprite = this.add.sprite(this.world.centerX, this.world.centerY, 'player');
			sprite.anchor.setTo(.5);
			sprite.scale.setTo(5);
			this.tween(sprite);
		} else if (rndNum == 2) {
			for (var i=0;i<2;i++) {
				for (var j=0;j<2;j++) {
					var x = this.world.width/4*(i*2+1);
					var y = this.world.height/4*(j*2+1);
					var sprite = this.add.sprite(x, y, 'player');
					sprite.anchor.setTo(.5);
					sprite.scale.setTo(1.2);
					this.tween(sprite);
				}
			}
		} else {
			for (var i=0;i<2;i++) {
				var sprite = this.add.sprite(this.world.centerX, this.world.centerY/2*(i*2+1), 'player');
				sprite.anchor.setTo(.5);
				sprite.scale.setTo(2);
				this.tween(sprite);
			}
		}
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		s.play({key:'TowerDefenseTheme',isBGM:true,loop:true});
	},

	inputController: function () {
		this.game.input.onDown.add(function (/*pointer, event*/) {
			this.game.global.SoundManager.play('MenuClick');
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}, this);
	},

	genTextContainer: function () {
		var textStyle = {
			fontSize:'100px',
			fill: '#000000',
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke:'#000000',
			multipleStrokeThickness: 30,
		};
		this.genTitleTextSprite(textStyle);
		this.genStartTextSprite(textStyle);
	},

	genTitleTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, this.world.centerY-100, 'レッツ・あん肝！', textStyle
		);
		this.tween(textSprite);
		this.tween(textSprite.multipleTextSprite);
	},

	genStartTextSprite: function (textStyle) {
		var textSprite = this.game.global.SpriteManager.genText(
			this.world.centerX, this.world.centerY+100, 'スタート', textStyle
		);
		this.tween(textSprite);
		this.tween(textSprite.multipleTextSprite);
	},

	tween: function (sprite) {
		var scaleX = sprite.scale.x+.1;
		var scaleY = sprite.scale.y+.1;
		this.add.tween(sprite.scale).to({x: scaleX, y: scaleY}, 220, "Linear", true, 0, -1, true);
	}

};
