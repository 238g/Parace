BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.TtlGrp=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.genContents();
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	genContents:function(){
		this.TtlGrp=this.add.group();
		// TODO bg sprite
		// TODO adjust pos
		this.genTtl(this.world.width*.6,this.world.height*.4);
		// TODO adjust pos
		this.genStartBtnSprite(this.world.centerX,this.world.height*.7);
		var y=this.world.height*.1;
		this.M.S.BasicVolSprite(this.world.width*.1,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.9,y);
	},
	genTtl:function(x,y,){
		var ttl = this.add.sprite(x,y,'Ttl');
		ttl.anchor.setTo(.5);
		this.TtlGrp.add(ttl);
		var blink=this.add.sprite(x,y,'TtlBlink');
		blink.anchor.setTo(.5);
		this.TtlGrp.add(blink);
		var mask=this.add.graphics(blink.left-20,0);
		mask.beginFill(0xffffff);
		mask.drawRect(0,0,20,this.world.height);
		mask.endFill();
		this.TtlGrp.add(mask);
		blink.mask=mask;
		// TODO adjust duration and delay
		var tween=this.M.T.moveB(mask,{xy:{x:blink.right},duration:1000,delay:1000});
		tween.loop();
		tween.start(); // TODO popup complete
	},
	genStartBtnSprite:function(x,y){
		this.add.button(x,y,'StartBtn',this.start,this).anchor.setTo(.5);
	},
	start:function(){
		if (this.inputEnabled) {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			this.M.NextScene('SelectChar');
		} else {
			// this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
};
