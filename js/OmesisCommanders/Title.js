BasicGame.Title=function(){};
BasicGame.Title.prototype = {
	init: function(){
		this.inputEnabled=!1;
	},
	create: function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genContents();
		this.time.events.add(500,function(){this.inputEnabled=!0;},this);
	},

	genContents: function () {
		// TODO sprite
		var sprite=this.M.S.genTextM(this.world.centerX,this.world.height*.3,BasicGame.GAME_TITLE,this.M.S.BaseTextStyleS(40));
		sprite.scale.setTo(0);
		this.M.T.popUpB(sprite,{delay:500}).start();
		this.genStartBtnSprite(this.world.centerX,this.world.height*.7,this.M.S.BaseTextStyleS(25));
		var bottomY=this.world.height*.9;
		this.M.S.BasicVolSprite(this.world.width*.1,bottomY);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,bottomY);
	},

	genStartBtnSprite: function (x,y,textStyle) {
		// TODO sprite
		var sprite=this.M.S.BasicGrayLabelM(x,y,function () {
			if (this.inputEnabled) {
				// this.M.SE.play('OnBtn',{volume:1}); // TODO
				this.M.NextScene('SelectChar');
			} else {
				// this.M.SE.playBGM('TitleBGM',{volume:1});
				this.inputEnabled=!0;
			}
		},'スタート',textStyle,{tint:BasicGame.MAIN_TINT});
		sprite.scale.setTo(0);
		this.M.T.popUpB(sprite,{delay:800}).start();
	},
};
