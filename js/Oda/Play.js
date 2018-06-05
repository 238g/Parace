BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function () { 
		this.isPlaying=!1;
		this.rotationSpeed=2;
		this.canThrow=!1;
		this.minAngle=13;

		this.dir=1; // 1 or -1

		this.BladeGroup=
		this.Blade=
		this.Target=
		this.FrontGroup= // need???

		null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1});

		this.BladeGroup=this.add.group();

		// this.Blade=this.add.sprite(this.world.centerX,this.world.height*.2,'');
		this.Blade=this.M.S.genBmpSprite(this.world.centerX,this.world.height*.2,10,100,'#00ff00');
		this.Blade.anchor.setTo(.5);

		// this.Target=this.add.sprite();
		this.Target=this.M.S.genBmpCircleSprite(this.world.centerX,this.world.height*.8,100,'#ff0000');
		this.Target.anchor.setTo(.5);
		this.Target.addChild(this.M.S.genBmpSprite(30,0,10,10,'#0000ff')); // TODO del
		this.Target.addChild(this.M.S.genBmpSprite(-30,0,10,10,'#00ff00')); // TODO del

		this.start();//TODO
		this.test();
	},

	throwBlade:function(){
		if (this.canThrow) {
			this.canThrow=!1;
			var tween=this.M.T.moveB(this.Blade,{xy:{y:this.world.height*.7},duration:150});
			tween.onComplete.add(this.hitTarget,this);
			tween.start();
		}
	},

	hitTarget:function(){
		var legalHit=!0;
		var children = this.BladeGroup.children;
		for(var i=0;i<children.length;i++){
			if(Math.abs(Phaser.Math.getShortestAngle(this.Target.angle,children[i].impactAngle)) < this.minAngle){
				legalHit=!1;
				break;
			}
		}
		if (legalHit) {
			this.canThrow=!0;
			this.genStuckBlade(this.Blade.x,this.Blade.y,this.Target.angle);
			this.Blade.y=this.world.height*.2;
		} else {
			this.end();
		}
	},

	genStuckBlade:function(x,y,angle){
		// TODO when first gen... this or other function
		var blade=this.M.S.genBmpSprite(x,y,10,100,'#00ff00');
		// var blade=this.add.sprite(x,y,'');
		blade.anchor.setTo(.5);
		blade.impactAngle=angle;
		this.BladeGroup.add(blade);
	},

	update:function(){
		if (this.isPlaying) {
			var rotation=this.time.physicsElapsedMS*.1*this.rotationSpeed*this.dir;
			this.Target.angle+=rotation;
			var children = this.BladeGroup.children;
			for(var i=0;i<children.length;i++){
				children[i].angle+=rotation;
				var radians = Phaser.Math.degToRad(children[i].angle-90);
				children[i].x=this.Target.x+(this.Target.width*.5)*Math.cos(radians);
				children[i].y=this.Target.y+(this.Target.width*.5)*Math.sin(radians);
			}
		}
	},

	start: function () {
		this.isPlaying=!0;
		this.canThrow=!0;
		this.input.onDown.add(this.throwBlade,this);
	},

	end:function(){
		this.isPlaying=!1;
		this.canThrow=!0;
		console.log('end');
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.stage.backgroundColor=BasicGame.WHITE_COLOR;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
