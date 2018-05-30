BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	init:function(){this.sounds=null;},
	create: function () {
		this.M.S.BasicLoadingAnim();
		this.M.S.BasicLoadingText();
		this.load.onLoadComplete.add(this.loadComplete, this);
		this.loadAssets();
		this.load.start();
	},

	loadAssets: function () {
		this.load.atlasXML('greySheet','./images/public/sheets/greySheet.png','./images/public/sheets/greySheet.xml');
		var imgs = {
			'transp': './images/238Games/transp.png',
		};
		for(var k in imgs)this.load.image(k,imgs[k]);
		var GI = this.M.getConf('GamesInfo');
		for(var k in GI) this.load.image(GI[k].slideImg,GI[k].slideImgUrl);
	},

	loadComplete: function () {
		if(this.game.device.desktop)document.body.style.cursor='pointer';
		this.M.SE.setSounds(this.sounds);
		this.M.NextScene((__ENV!='prod')?this.M.H.getQuery('s')||'Title':'Title');
	},
};