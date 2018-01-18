BasicGame.Preloader = function (game) {};

BasicGame.Preloader.prototype = {

	imgPath:null,

	init: function () {
		this.imgPath = 'images/';
	},

	preload: function () {
		this.genBackGround();
		this.loadingAnim();
		this.loadAssets();
	},

	create: function () {
		this.state.start(this.game.global.nextSceen);
	},

	genBackGround: function () {
        this.stage.backgroundColor = '#424242';
	},

	loadingAnim: function () {
		var loadingSprite = this.add.sprite(this.world.centerX, this.world.centerY, 'loading');
		loadingSprite.anchor.setTo(.5);
		loadingSprite.scale.x = 1.5;
		loadingSprite.scale.y = 1.5;

		var loadingAnim = loadingSprite.animations.add('loading');
		loadingAnim.play(18, true);
	},

	loadAssets: function () {
		var nextSceen = this.game.global.nextSceen;
		// TODO edit??? function || assets json list -> load for()
		if (nextSceen == 'Title') {
			this.loadAssetsTitle();
		}
	},

	loadAssetsTitle: function () {
		var imgPath = this.imgPath;
        this.load.atlasXML('yellowSheet', imgPath+'/btns/yellowSheet.png', imgPath+'/btns/yellowSheet.xml');
	}
};
