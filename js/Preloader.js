BasicGame.Preloader = function (game) {};

BasicGame.Preloader.prototype = {

	imgPath:null,

	init: function () {
		this.imgPath = 'images/';

		var g = this.game.global;
		this.charCount = g.charCount;
		this.nextSceen = g.nextSceen;
	},

	preload: function () {
		this.genBackGround();
		this.loadingAnim();
		this.loadAssets();
	},

	create: function () {
		this.state.start(this.nextSceen);
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
		if (this.game.global.loadAll) {
			this.loadAssets_All();
		} else {
			var nextSceenName = this.nextSceen;
			var className = 'loadAssets_'+nextSceenName;
			this[className]();
		}
	},

	loadAssets_All: function () {
		this.loadAssets_Title();
		this.loadAssets_CharacterSelect();
		this.loadAssets_Play();
	},

	loadAssets_Title: function () {
		var imgPath = this.imgPath;
		this.load.atlasXML('yellowSheet', imgPath+'/btns/yellowSheet.png', imgPath+'/btns/yellowSheet.xml');
	},

	loadAssets_CharacterSelect: function () {
		var imgPath = this.imgPath;
		this.load.atlasXML('greySheet', imgPath+'/btns/greySheet.png', imgPath+'/btns/greySheet.xml');
		for (var i=1;i<=this.charCount;i++) {
			this.load.image('icon_'+i, imgPath+'/character_imgs/icons/icon_'+i+'.jpg');
			this.load.image('smile_1_'+i, imgPath+'/character_imgs/portraits/smile_1_'+i+'.png');
		}
	},

	loadAssets_Play: function () {
		var imgPath = this.imgPath;
		this.load.atlasXML('redSheet', imgPath+'/btns/redSheet.png', imgPath+'/btns/redSheet.xml');
	}
};
