BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init:function(){
		this.inputEnabled=!1;
		this.isPlaying=!0;
		this.TtlGrp=this.TtlBlink=this.TtlMask=this.StartBtn=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.M.SE.playBGM('TitleBGM',{volume:.7});
		this.genContents();
	},
	genContents:function(){
		this.add.sprite(0,0,'Bg_1');
		this.TtlGrp=this.add.group();
		this.genTtl(this.world.width*.7,this.world.height*.45);
		this.StartBtn=this.add.button(this.world.centerX,this.world.height*.87,'StartBtn',this.start,this);
		this.StartBtn.anchor.setTo(.5);
		this.StartBtn.visible=!1;
		this.genHUD();
	},
	genTtl:function(x,y){
		var ttl=this.add.sprite(x,y,'Ttl');
		ttl.anchor.setTo(.5);
		this.TtlGrp.add(ttl);
		this.TtlBlink=this.add.sprite(x,y,'TtlBlink');
		this.TtlBlink.anchor.setTo(.5);
		this.TtlGrp.add(this.TtlBlink);
		this.TtlMask=this.add.graphics(this.TtlBlink.left,0);
		this.TtlMask.beginFill(0xffffff);
		this.TtlMask.drawRect(0,0,15,this.world.height);
		this.TtlMask.endFill();
		this.TtlMask.angle=35;
		this.TtlGrp.add(this.TtlMask);
		this.TtlBlink.mask=this.TtlMask;
		this.TtlGrp.scale.setTo(0);
		var t=this.M.T.popUpB(this.TtlGrp,{delay:500});
		t.onComplete.add(function(){
			var t2=this.M.T.moveB(this.TtlMask,{xy:{x:this.TtlBlink.centerX*2},duration:1000,delay:2000});
			t2.loop();
			t2.start();
			this.StartBtn.visible=!0;
			this.inputEnabled=!0;
		},this);
		t.start();
	},
	start:function(){
		if (this.inputEnabled&&this.isPlaying) {
			this.isPlaying=!1;
			this.M.SE.play('OnBtn',{volume:2});
			var wp=this.add.sprite(0,0,'WP');
			wp.tint=0x000000;
			wp.alpha=0;
			var tween=this.M.T.fadeInA(wp,{duration:800,alpha:1});
			tween.onComplete.add(function(){
				this.M.NextScene('SelectChar');
			},this);
			tween.start();
		} else {
			this.M.SE.playBGM('TitleBGM',{volume:.7});
			this.inputEnabled=!0;
		}
	},
	genHUD:function(){
		var y=this.world.height*.94;
		this.M.S.BasicVolSprite(this.world.width*.05,y);
		this.M.S.BasicFullScreenBtn(this.world.width*.95,y);
	},
};
