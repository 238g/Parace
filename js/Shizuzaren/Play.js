BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		// Glb
		this.growMuscleCount=this.M.gGlb('growMuscleCount');

		this.Gilzarens=
		this.HavingMCTS=
		null;
		this.Tween=this.FirstTween=this.LastTween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#ffffff';
		// this.M.SE.playBGM('PlayBGM',{volume:1});

		this.genContents();

		this.start();
		this.test();
	},
	update:function(){
		if(this.isPlaying){
			if(this.input.activePointer.isDown){
				this.Gilzarens.forEach(function(s){
					for(var k in s.children){
						var m=s.children[k];
						if(m.alive){
							var a=m.input.checkPointerOver(this.input.activePointer);
							if(a){
								m.alive=!1;
								this.grabMuscle(m);
							}		
						}
					}
				},this);
			}
		}
	},
	start:function(){
		this.isPlaying=this.inputEnabled=!0;
	},
	test:function(){
		if(__ENV!='prod'){
			this.growMuscleCount=8;
			// this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.add.sprite(0,0,'Bg_4');
		
		this.genBackConveyor();
		this.genFrontConveyor();

		// HUD
		var y=this.world.height*.92;
		var tx=this.M.S.txtstyl(25);
		this.M.S.genLbl(this.world.width*.25,y,this.back,this.curWords.Back,tx).tint=0xBFFF00;
		this.M.S.genLbl(this.world.width*.75,y,this.toPlay2,this.curWords.ToPlay2,tx).tint=0x00FFBF;

		this.add.sprite(this.world.width*.71,this.world.height*.05,'AbdominalMuscleIcon').anchor.setTo(.5);
		this.HavingMCTS=this.M.S.genTxt(this.world.width*.88,this.world.height*.05,'x'+this.M.gGlb('havingMuscleCount'),tx);
	},
	genBackConveyor:function(){
		var s;

		s=this.add.sprite(this.world.centerX,this.world.height*.7,'Conveyor');
		s.scale.setTo(3);
		s.anchor.setTo(.5);
		s.smoothed=!1;
		s.animations.add('moving');
		s.animations.play('moving',48,!0);
		
		s=this.add.sprite(this.world.width*.35,this.world.height*.3,'Conveyor');
		s.scale.setTo(-1,1);
		s.anchor.setTo(.5);
		s.smoothed=!1;
		s.animations.add('moving');
		s.animations.play('moving',48,!0);
		var lx=s.right;
		var cy=s.y;

		s=this.add.sprite(this.world.width*.65,this.world.height*.3,'Conveyor');
		s.scale.setTo(-1,1);
		s.anchor.setTo(.5);
		s.smoothed=!1;
		s.animations.add('moving');
		s.animations.play('moving',48,!0);
		var rx=s.left;

		var ct=s.top;
		for(var i=0;i<4;i++){
			s=this.add.sprite(0,ct,'Gilzaren_2');
			s.scale.setTo(.3);
			s.anchor.setTo(.5);
			s.smoothed=!1;
			var tw=this.M.T.moveB(s,{xy:{x:this.world.width},duration:12E3});
			tw.loop(!0);
			this.time.events.add(i*3E3,function(){
				this.start();
			},tw);
		}

		this.add.sprite(lx,cy,'Machine_1').anchor.setTo(.5,.7);
		this.add.sprite(rx,cy,'Machine_1').anchor.setTo(.5,.7);
	},
	genFrontConveyor:function(){
		var s;

		this.Gilzarens=this.add.group();
		for(var i=0;i<3;i++){
			s=this.add.sprite(this.world.width*1.5,this.world.centerY,'Gilzaren_1');
			s.anchor.setTo(.5);
			s.smoothed=!1;
			var tw=this.M.T.moveB(s,{xy:{x:-this.world.centerX},duration:9E3});
			tw.loop(!0);
			this.time.events.add(i*3E3,function(){
				this.start();
			},tw);
			tw.onLoop.add(function(s){
				for(var i=0;i<this.growMuscleCount;i++){
					var m=s.children[i];
					if(!m.alive)m.revive();
				}
			},this);
			for(var j=0;j<8;j++){
				var x=(j%2==0)?-s.width*.1:s.width*.1;
				var y=s.height*(.1+Math.floor(j*.5)*.1);
				var m=this.add.sprite(x,y,'AbdominalMuscle');
				m.anchor.setTo(.5);
				m.inputEnabled=!0;
				m.smoothed=!1;
				s.addChild(m);
				if(j>=this.growMuscleCount)m.kill();
			}
			this.Gilzarens.add(s);
		}
	},
	grabMuscle:function(m){
		this.inputEnabled=!1;
		m.kill();
		var s=this.add.sprite(m.worldPosition.x,m.worldPosition.y,'AbdominalMuscle');
		s.anchor.setTo(.5);
		s.smoothed=!1;
		var twA=this.add.tween(s.scale).to({x:.7},500,Phaser.Easing.Exponential.Out,!0);
		var twB=this.add.tween(s.scale).to({x:1},300,Phaser.Easing.Quartic.In);
		twA.onComplete.add(function(){this.start()},twB);
		var twC=this.add.tween(s).to({y:'-'+this.world.height*.2},800,Phaser.Easing.Back.Out,!0);
		var twD=this.add.tween(s).to({x:this.world.width*.9,y:this.world.height*.05},800,Phaser.Easing.Quartic.Out);
		var twE=this.add.tween(s.scale).to({x:0,y:0},800,Phaser.Easing.Linear.None);
		twC.onComplete.add(function(){this.start()},twD);
		twC.onComplete.add(function(){this.start()},twE);
		twE.onComplete.add(function(){this.destroy()},s);
		twE.onComplete.add(this.getMuscle,this);
		this.FirstTween=twA;
		this.LastTween=twE;
	},
	getMuscle:function(){
		var havingMuscleCount=this.M.gGlb('havingMuscleCount')+1;
		this.M.sGlb('havingMuscleCount',havingMuscleCount);
		this.HavingMCTS.changeText('x'+havingMuscleCount);

		if(!this.FirstTween.isRunning&&!this.LastTween.isRunning){
			this.inputEnabled=!0;
		}
	},
	toPlay2:function(){
		if(this.isPlaying&&this.inputEnabled){
			this.M.NextScene('Play2');
		}
	},
	back:function(){
		if(this.isPlaying&&this.inputEnabled){
			if(!this.Tween.isRunning){
				this.isPlaying=!1;
				// this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
				this.Tween.onComplete.add(function(){
					this.M.NextScene('Title');
				},this);
				this.Tween.start();
			}
		}
	},
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
BasicGame.Play2=function(){};
BasicGame.Play2.prototype={
	init:function(){ 
		// Game
		this.isPlaying=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.GiftInfo=this.M.gGlb('GiftInfo');
		// Glb
		this.cordLocation='right';

		// Obj
		this.Bell=
		this.StaticCord=
		this.LastCord=
		this.Gifts=
		this.HavingMCTS=
		null;
		this.Tween={};
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#ffffff';
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.add.sprite(0,0,'Bg_3');

		var bg=this.add.sprite(this.world.centerX,this.world.height,'Bg_2');
		bg.anchor.setTo(.5,1);

		this.physics.startSystem(Phaser.Physics.P2JS);
		// this.physics.p2.setImpactEvents(!0);
		// this.physics.p2.restitution=1;
		this.physics.p2.gravity.y=1E3;


		this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curWords.Swing,this.M.S.txtstyl(40));

		this.genGifts();

		this.genBellCord();

		this.add.button(10,10,'BackArrow',this.back,this).tint=0x01DF01;

		this.add.sprite(this.world.width*.71,this.world.height*.05,'AbdominalMuscleIcon').anchor.setTo(.5);
		this.HavingMCTS=this.M.S.genTxt(this.world.width*.88,this.world.height*.05,'x'+this.M.gGlb('havingMuscleCount'),this.M.S.txtstyl(25));

		this.start();
		this.test();
	},
	update:function(){
		if(this.isPlaying){
			if(this.input.activePointer.isDown){
				this.LastCord.body.x=this.input.activePointer.x;
				this.LastCord.body.y=this.input.activePointer.y;

				if(this.input.activePointer.x<this.world.width*.35&&this.cordLocation=='right'){
					this.cordLocation='left';
					this.play();
				}else if(this.input.activePointer.x>this.world.width*.65&&this.cordLocation=='left'){
					this.cordLocation='right';
					this.play();
				}
			}
		}
	},
	start:function(){
		this.isPlaying=!0;
	},
	test:function(){
		if(__ENV!='prod'){
			this.M.sGlb('havingMuscleCount',100);
		}
	},
	////////////////////////////////////// PlayContents
	genGifts:function(){
		this.GiftsCollisionGroup=this.physics.p2.createCollisionGroup();
		this.physics.p2.updateBoundsCollisionGroup();
		this.Gifts=this.add.group();
		this.Gifts.physicsBodyType=Phaser.Physics.P2JS;
		this.Gifts.enableBody=!0;
		this.Gifts.createMultiple(500,'Gift');
		this.Gifts.forEach(function(s){
			s.smoothed=!1;
			s.body.setCollisionGroup(this.GiftsCollisionGroup);
			s.body.collides(this.GiftsCollisionGroup);
			s.body.collideWorldBounds=!0;
		},this);
	},
	genBellCord:function(){
		var len=16;
		var xAnchor=this.world.centerX;
		var yAnchor=64;
		var lastRect;
		var h=20;
		var w=16;
		var maxForce=2E4;
		for(var i=0;i<=len;i++){
			var x=xAnchor;
			var y=yAnchor+(i*h);
			if(i%2==0){
				if(i==len){
					newRect=this.add.sprite(x,y,'LastCord');
				}else{
					newRect=this.add.sprite(x,y,'Cords',1);
				}
			}else{
				newRect=this.add.sprite(x,y,'Cords',0);
				lastRect.bringToTop();
			}
			this.physics.p2.enable(newRect,!1);
			newRect.body.setRectangle(w,h);
			newRect.smoothed=!1;
			if(i==0){
				newRect.body.static=!0;
				this.StaticCord=newRect;
			}else{
				newRect.body.mass=len/i;
			}
			if(lastRect)this.physics.p2.createRevoluteConstraint(newRect,[0,-10],lastRect,[0,10],maxForce);
			lastRect=newRect;
		}
		this.LastCord=lastRect;
		this.LastCord.body.kinematic=!0;
		this.LastCord.anchor.setTo(.5,.3);
		this.Bell=this.add.sprite(this.StaticCord.x,this.StaticCord.y,'Bell');
		this.Bell.anchor.setTo(.5);
	},
	back:function(){
		if(this.isPlaying){
			if(!this.Tween.isRunning){
				this.isPlaying=!1;
				// this.M.SE.play('OnStart',{volume:1});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
				this.Tween.onComplete.add(function(){
					this.M.NextScene('Play');
				},this);
				this.Tween.start();
			}
		}
	},
	play:function(){
		for(var i=0;i<this.M.gGlb('efficiency');i++){
			if(this.M.gGlb('havingMuscleCount')>0){
				var havingMuscleCount=this.M.gGlb('havingMuscleCount')-1;
				this.M.sGlb('havingMuscleCount',havingMuscleCount);
				this.HavingMCTS.changeText('x'+havingMuscleCount);

				var gift=this.rootbox();
				// return this.jackpot(this.GiftInfo[1]);//TODO del
				switch(gift.key){
					case 1:return this.jackpot(gift);
					case 2:
						if(this.GiftInfo[1].rate<=5E3)
							this.GiftInfo[1].rate++;
						break;
					case 3:
						if(this.M.gGlb('growMuscleCount')<this.GiftInfo[3].effectMax)
							this.M.sGlb('growMuscleCount',this.M.gGlb('growMuscleCount')+1);
						break;
					case 4:
						if(this.M.gGlb('efficiency')<this.GiftInfo[4].effectMax)
							this.M.sGlb('efficiency',this.M.gGlb('efficiency')+1);
						break;
					case 5:
						if(this.GiftInfo[5].rate<=5E3)
							for(var j=2;j<=5;j++)this.GiftInfo[j].rate+=10;
						break;
				}

				var s=this.Gifts.getFirstDead()||this.Gifts.getRandom();
				s.reset(this.world.randomX,0);
				s.tint=gift.tint;
			}else{
				break;
			}
		}
	},
	rootbox:function(){
		var sumRate=0;
		for(var k in this.GiftInfo)sumRate+=this.GiftInfo[k].rate;
		var target=this.rnd.integerInRange(1,sumRate);
		for(var k in this.GiftInfo){
			var info=this.GiftInfo[k];
			if(target<=info.rate)return info;
			target-=info.rate;
		}
		return info;
	},
	jackpot:function(gift){
		this.isPlaying=!1;
		var s=this.add.sprite(this.world.randomX,0,'GiftL');
		s.anchor.setTo(.5);
		s.scale.setTo(0);
		s.tint=gift.tint;
		var twA=this.add.tween(s).to({x:this.world.centerX,y:this.world.centerY},3E3,Phaser.Easing.Cubic.Out,!0);
		twA.onComplete.add(function(){
			// TODO
			console.log('おめでとう');
			// s.destroy();//TODO del
		},this);
		twA.start();
		this.add.tween(s.scale).to({x:1,y:1},3E3,Phaser.Easing.Cubic.Out,!0);
	},
};