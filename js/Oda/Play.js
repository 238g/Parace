BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function () { 
		this.isPlaying=this.canThrow=!1;
		this.minAngle=10;
		this.bladeStartPosY=this.world.height*.2;
		this.bladeGoToPosY=this.world.height*.8;

		this.curLevel=this.M.getGlobal('curLevel');
		this.LevelInfo=this.M.getConf('LevelInfo')[this.curLevel];

		this.rotationSpeed=this.LevelInfo.RotSpeed;
		this.rotationDir=this.LevelInfo.RotDir;

		this.leftCount=this.LevelInfo.GoalCount;

		this.BladeGroup=this.Blade=
		this.Target=
		this.GoalCountTextSprite=
		this.FrontGroup= // need???

		null;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.BgContainer();
		this.BladeContainer();
		this.TargetContainer();
		this.HUDContainer();
		this.tutorial();
		this.test();
	},

	tutorial:function(){
		if(this.M.getGlobal('endTutorial')){
			this.start();
		} else {
			// TODO tutorial sprite
			this.input.onDown.addOnce(function(){
				this.M.setGlobal('endTutorial',!0);
				this.start();
			},this);
		}
	},

	throwBlade:function(){
		if (this.canThrow) {
			this.canThrow=!1;
			var tween=this.M.T.moveB(this.Blade,{xy:{y:this.bladeGoToPosY},duration:150});
			tween.onComplete.add(this.hitTarget,this);
			tween.start();
		}
	},

	hitTarget:function(){
		if(this.isPlaying){
			var legalHit=!0;
			var children = this.BladeGroup.children;
			for(var i=0;i<children.length;i++){
				if(Math.abs(Phaser.Math.getShortestAngle(this.Target.angle,children[i].impactAngle)) < this.minAngle){
					legalHit=!1;
					break;
				}
			}
			if(this.Target.face==2){
				this.time.events.add(500,function(){
					if(this.isPlaying){
						this.Target.loadTexture('NobuhimeCircle_1');
						this.Target.face=1;
					}
				},this);
			}else{
				this.Target.loadTexture('NobuhimeCircle_2');
				this.Target.face=2;
			}
			if (legalHit) {
				this.canThrow=!0;
				this.genStuckBlade(this.Blade.x,this.Blade.y,this.Target.angle);
				this.leftCount--;
				this.GoalCountTextSprite.changeText(this.leftCount);
				if(this.leftCount==0)return this.end('clear');
				this.Blade.y=this.bladeStartPosY;
			} else {
				this.end('gameover');
			}

		}
	},

	update:function(){
		if (this.isPlaying) {
			var rotation=this.time.physicsElapsedMS*.1*this.rotationSpeed*this.rotationDir;
			this.Target.angle+=rotation;
			var children = this.BladeGroup.children;
			for(var i=0;i<children.length;i++){
				var child=children[i];
				child.angle+=rotation;
				var radians = Phaser.Math.degToRad(child.angle-90);
				child.x=this.Target.x+(this.Target.width*.5)*Math.cos(radians);
				child.y=this.Target.y+(this.Target.width*.5)*Math.sin(radians);
			}
		}
	},

	start: function () {
		this.isPlaying=!0;
		this.canThrow=!0;
		this.input.onDown.add(this.throwBlade,this);
	},

	end:function(type){
		this.isPlaying=!1;
		this.canThrow=!0;
		this.Blade.visible=!1;
		this.genStuckBlade(this.Blade.x,this.Blade.y,this.Target.angle);
		var rotation=this.time.physicsElapsedMS*.1*this.rotationSpeed*this.rotationDir;
		this.Target.angle+=rotation;
		var children = this.BladeGroup.children;
		for(var i=0;i<children.length;i++){
			var child=children[i];
			child.angle+=rotation;
			var radians = Phaser.Math.degToRad(child.angle-90);
			child.x=this.Target.x+(this.Target.width*.5)*Math.cos(radians);
			child.y=this.Target.y+(this.Target.width*.5)*Math.sin(radians);
		}
		if (type=='clear') {
			// TODO clear curLevel++
		} else {
			// TODO reduce life
		}
		// TODO end face
		// this.Target.loadTexture('NobuhimeCircle_3');
		// this.Target.face=3;
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.stage.backgroundColor=BasicGame.WHITE_COLOR;
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
