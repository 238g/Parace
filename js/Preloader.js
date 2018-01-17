BasicGame.Preloader = function (game) {};

BasicGame.Preloader.prototype = {

	init: function () {
		this.sceens = {
			'Title': this.loadAssetsTitle,
		};
	},

	preload: function () {
		this.loadingAnim();
		this.loadAssets();
	},

	create: function () {

		var nextSceen = this.game.global.nextSceen;
		if (this.sceens[nextSceen]) {
			this.state.start(nextSceen);
		} else {
			// error
			console.log('error');
		}
	
	},

	loadingAnim: function () {
		var loading = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
		loading.anchor.setTo(.5, .5);
		loading.scale.x = 1.5;
		loading.scale.y = 1.5;

		var loadingAnim = loading.animations.add('loading');
		loadingAnim.play(18, true);
	},

	loadAssets: function () {
		// Load game assets here...
		// ** Caution: json cannot be loaded using anonymous
		var imgUrl = 'images/';

		// this.load.image('baseBtn', imgUrl + 'baseBtn.png');
		// this.load.image('star', imgUrl + 'star.png');

		var nextSceen = this.game.global.nextSceen;
		if (this.sceens[nextSceen]) {
			this.sceens[nextSceen]();
		}
	},

	loadAssetsTitle: function () {
		console.log(22222);
	}

};
