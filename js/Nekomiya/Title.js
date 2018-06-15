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
		this.genTitle(this.world.width*.7,this.world.height*.3);
		this.genStartBtnSprite(this.world.width*.8,this.world.centerY);
		var bottomY=this.world.height*.9;
		this.M.S.BasicVolSprite(this.world.width*.1,bottomY);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,bottomY);
	},

	genTitle:function(x,y){
		this.stage.backgroundColor='#555555'; // TODO del
		var title = this.add.sprite(x,y,'Title');
		title.anchor.setTo(.5);
		var blink=this.add.sprite(x,y,'Blink');
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
		this.M.S.BasicGrayLabelM(x,y,function () {
			if (this.inputEnabled) {
				// this.M.SE.play('OnBtn',{volume:1}); // TODO
				this.M.NextScene('SelectLevel');
			} else {
				this.M.SE.playBGM('TitleBGM',{volume:1});
				this.inputEnabled=!0;
			}
		},'スタート',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
	},
};
