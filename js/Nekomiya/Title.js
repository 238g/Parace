BasicGame.Title=function(){};
BasicGame.Title.prototype={
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
		this.genTitle();
		this.genStartBtnSprite(this.world.centerX,this.world.height*.7,this.M.S.BaseTextStyleS(25));
		var bottomY=this.world.height*.9;
		this.M.S.BasicVolSprite(this.world.width*.1,bottomY);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,bottomY);
	},

	genTitle:function(){
		this.stage.backgroundColor='#555555'; // TODO del
		var title = this.add.sprite(this.world.centerX,this.world.centerY,'Title');
		title.anchor.setTo(.5);
		var blink=this.add.sprite(this.world.centerX,this.world.centerY,'Blink');
		blink.anchor.setTo(.5);
		var mask=this.add.graphics(blink.left-20,0);
		mask.beginFill(0xffffff);
		mask.drawRect(0,0,20,this.world.height);
		mask.endFill();
		blink.mask=mask;
		var tween=this.M.T.moveB(mask,{xy:{x:blink.right},duration:1000,delay:1000});
		tween.loop();
		tween.start();
	},

	genStartBtnSprite: function (x,y,textStyle) {
		// TODO sprite
		var sprite=this.M.S.BasicGrayLabelM(x,y,function () {
			if (this.inputEnabled) {
				// this.M.SE.play('OnBtn',{volume:1}); // TODO
				this.M.NextScene('SelectLevel');
			} else {
				// this.M.SE.playBGM('TitleBGM',{volume:1});
				this.inputEnabled=!0;
			}
		},'スタート',textStyle,{tint:BasicGame.MAIN_TIN});
		sprite.scale.setTo(0);
		this.M.T.popUpB(sprite,{delay:800}).start();
	},
};
