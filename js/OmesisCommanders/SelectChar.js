BasicGame.SelectChar=function(){};
BasicGame.SelectChar.prototype={
	init: function(){
	},
	create: function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genContents();
	},

	genContents: function () {
		

	},

};
