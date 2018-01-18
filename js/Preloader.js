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
		var nextSceenName = this.game.global.nextSceen;
		// var className = 'loadAssets_'+nextSceenName;
		// this[className]();
		this.loadAssets_All();
	},

	loadAssets_All: function () {
		this.loadAssets_Title();
		this.loadAssets_CharacterSelect();
	},

	loadAssets_Title: function () {
		var imgPath = this.imgPath;
        this.load.atlasXML('yellowSheet', imgPath+'/btns/yellowSheet.png', imgPath+'/btns/yellowSheet.xml');
	},

	loadAssets_CharacterSelect: function () {
		var imgPath = this.imgPath;
        this.load.atlasXML('greySheet', imgPath+'/btns/greySheet.png', imgPath+'/btns/greySheet.xml');
	}
};
