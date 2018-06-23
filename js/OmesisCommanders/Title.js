BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.isPlaying=!0;
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
		this.add.sprite(0,0,'Bg_1');
		this.TtlGrp=this.add.group();
		this.genTtl(this.world.width*.7,this.world.height*.45);
		this.add.button(this.world.centerX,this.world.height*.87,'StartBtn',this.start,this).anchor.setTo(.5);
		this.genHUD();
	},
	genTtl:function(x,y){
		var ttl=this.add.sprite(x,y,'Ttl');
		ttl.anchor.setTo(.5);
		this.TtlGrp.add(ttl);
		var blink=this.add.sprite(x,y,'TtlBlink');
		blink.anchor.setTo(.5);
		this.TtlGrp.add(blink);
		var mask=this.add.graphics(blink.left,0);
		mask.beginFill(0xffffff);
		mask.drawRect(0,0,15,this.world.height);
		mask.endFill();
		mask.angle=35;
		this.TtlGrp.add(mask);
		blink.mask=mask;
		var tween=this.M.T.moveB(mask,{xy:{x:blink.centerX*2},duration:1000,delay:2000});
		tween.loop();
		tween.start(); // TODO popup complete
	},
	start:function(){
		if (this.inputEnabled&&this.isPlaying) {
			this.isPlaying=!1;
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			var tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			tween.onComplete.add(function(){
				this.M.NextScene('SelectChar');
			},this);
			tween.start();
		} else {
			// this.M.SE.playBGM('TitleBGM',{volume:1});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.94;
		this.M.S.BasicVolSprite(this.world.width*.05,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.95,y);
	},
};
