BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];
		this.GiftInfo=this.M.gGlb('GiftInfo');
		// Glb
		this.growMuscleCount=this.M.gGlb('growMuscleCount');
		// Obj
		this.Gilzarens=
		this.HavingMCTS=
		null;
		this.Tween=this.FirstTween=this.LastTween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!1;
		this.time.events.removeAll();
		this.stage.backgroundColor='#ffffff';
		this.M.SE.playBGM('PlayBGM',{volume:.8});

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
			// this.growMuscleCount=8;
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.add.sprite(0,0,'Bg_4');
		
		this.genBackConveyor();

		var s=this.add.button(this.world.width*.02,this.world.height*.38,'TwitterLogoBlue',this.tweet,this);
		var bmp=this.M.S.genBmpCclSp(s.centerX,s.centerY,s.width*1.2,'#ffffff');
		bmp.anchor.setTo(.5);
		bmp.alpha=.5;
		s.bringToTop();

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
		this.M.SE.play('GrabMuscle',{volume:1});
	},
	getMuscle:function(){
		var havingMuscleCount=this.M.gGlb('havingMuscleCount')+1;
		this.M.sGlb('havingMuscleCount',havingMuscleCount);
		this.HavingMCTS.changeText('x'+havingMuscleCount);

		if(!this.FirstTween.isRunning&&!this.LastTween.isRunning){
			this.inputEnabled=!0;
			this.M.SE.play('GetMuscle',{volume:3});
		}
	},
	toPlay2:function(){
		if(this.isPlaying&&this.inputEnabled){
			if(!this.Tween.isRunning){
				this.isPlaying=!1;
				this.M.SE.play('OnStart',{volume:3});
				var wp=this.add.sprite(0,0,'WP');
				wp.tint=0x000000;
				wp.alpha=0;
				this.Tween=this.M.T.fadeInA(wp,{duration:600,alpha:1});
				this.Tween.onComplete.add(function(){
					this.M.NextScene('Play2');
				},this);
				this.Tween.start();
			}
		}
	},
	back:function(){
		if(this.isPlaying&&this.inputEnabled){
			if(!this.Tween.isRunning){
				this.isPlaying=!1;
				this.M.SE.play('OnStart',{volume:3});
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
	tweet:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var emoji='💪🦇💪🦇💪🦇💪';
		var res=this.makeSumText()+'\n';
		for(var k in this.GiftInfo)res+=(this.GiftInfo[k].effect+': '+this.GiftInfo[k].count+this.curWords.Count+'\n');
		var txt=this.curWords.TweetTtl+'\n'+emoji+'\n'+res+emoji+'\n';
		this.M.H.tweet(txt,this.curWords.TweetHT,location.href);
		myGa('tweet','Play','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
	},
	makeSumText:function(){
		return this.curWords.SumCount+this.M.gGlb('sumCount')+this.curWords.Count;
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
		this.StaticCord=this.LastCord=
		this.Gifts=this.GiftTSs=this.SumGift=
		this.HavingMCTS=
		this.ResSp=this.ResGift=
		null;
		this.Tween={};
	},
	create:function(){
		this.stage.disableVisibilityChange=!1;
		this.time.events.removeAll();
		this.stage.backgroundColor='#ffffff';
		this.M.SE.playBGM('Play2BGM',{volume:.8});

		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.gravity.y=1E3;

		this.genContents();

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
			// this.M.sGlb('havingMuscleCount',1000);
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.jackpot,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.add.sprite(0,0,'Bg_3');
		this.add.sprite(this.world.centerX,this.world.height,'Bg_2').anchor.setTo(.5,1);

		this.M.S.genTxt(this.world.centerX,this.world.centerY,this.curWords.Swing,this.M.S.txtstyl(35));

		this.genGiftTSs();
		this.genGifts();
		this.genBellCord();

		var b=this.add.button(10,10,'BackArrow',this.back,this);
		b.tint=0x01DF01;
		var bmp=this.M.S.genBmpCclSp(b.centerX,b.centerY+5,b.width*1.3,'#ffffff');
		bmp.anchor.setTo(.5);
		bmp.alpha=.5;
		b.bringToTop();

		this.add.sprite(this.world.width*.71,this.world.height*.05,'AbdominalMuscleIcon').anchor.setTo(.5);
		this.HavingMCTS=this.M.S.genTxt(this.world.width*.88,this.world.height*.05,'x'+this.M.gGlb('havingMuscleCount'),this.M.S.txtstyl(25));

		this.ResSp=this.add.sprite(this.world.width,0,'Bg_5');
		var txtstyl=this.M.S.txtstyl(50);
		txtstyl.fill=txtstyl.mStroke='#FF0040';
		this.ResSp.addChild(this.M.S.genTxt(this.world.centerX,this.world.height*.2,this.curWords.Congratulations,txtstyl));
		this.ResSp.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.9,this.continue,this.curWords.Continue));
		this.ResSp.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.9,this.tweet,this.curWords.Tweet));
		this.ResSp.visible=!1;
	},
	genGiftTSs:function(){
		this.GiftTSs=[];
		var xA=this.world.width*.02;
		var xB=this.world.width*.1;
		var yA=this.world.height*.15;
		var yB;
		var txtstyl=this.M.S.txtstylS(18);
		txtstyl.align='left';
		txtstyl.fill=txtstyl.mStroke='#0B0B61';
		for(var k in this.GiftInfo){
			var info=this.GiftInfo[k];
			yB=yA+this.world.height*(.04*k);
			var s=this.add.sprite(xA,yB+5,'Gift');
			s.tint=info.tint;
			var bmp=this.M.S.genBmpCclSp(s.centerX,s.centerY,s.width*1.3,'#ffffff');
			bmp.anchor.setTo(.5);
			s.bringToTop();
			var ts=this.M.S.genTxt(xB,yB,this.makeGiftText(info),txtstyl);
			ts.anchor.setTo(0);
			ts.children[0].anchor.setTo(0);
			this.GiftTSs[k]=ts;
		}

		this.SumGift=this.M.S.genTxt(xA,yA-10,this.makeSumText(),txtstyl);
		this.SumGift.anchor.setTo(0);
		this.SumGift.children[0].anchor.setTo(0);
	},
	makeGiftText:function(info){
		return info.effect+'('+(info.rate/100)+'%): '+info.count+this.curWords.Count;
	},
	makeSumText:function(){
		return this.curWords.SumCount+this.M.gGlb('sumCount')+this.curWords.Count;
	},
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
				this.M.SE.play('OnStart',{volume:3});
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
		if(this.M.gGlb('havingMuscleCount')>0){
			for(var i=0;i<this.M.gGlb('efficiency');i++){
				if(this.M.gGlb('havingMuscleCount')>0){
					var havingMuscleCount=this.M.gGlb('havingMuscleCount')-1;
					this.M.sGlb('havingMuscleCount',havingMuscleCount);
					this.HavingMCTS.changeText('x'+havingMuscleCount);

					this.M.sGlb('sumCount',this.M.gGlb('sumCount')+1);
					this.SumGift.changeText(this.makeSumText());

					var gift=this.rootbox();
					gift.count++;
					this.GiftTSs[gift.key].changeText(this.makeGiftText(gift));

					switch(gift.key){
						case 1:return this.jackpot();
						case 2:
							var info=this.GiftInfo[1];
							if(info.rate<=5E3){
								info.rate++;
								this.GiftTSs[1].changeText(this.makeGiftText(info));
								this.M.SE.play('Gift_2',{volume:1});
							}
							break;
						case 3:
							if(this.M.gGlb('growMuscleCount')<8){
								this.M.sGlb('growMuscleCount',this.M.gGlb('growMuscleCount')+1);
								this.M.SE.play('Gift_3',{volume:1});
							}
							break;
						case 4:
							if(this.M.gGlb('efficiency')<8){
								this.M.sGlb('efficiency',this.M.gGlb('efficiency')+1);
								this.M.SE.play('Gift_4',{volume:1});
							}
							break;
						case 5:
							if(this.GiftInfo[5].rate<=5E3){
								for(var j=2;j<=5;j++){
									var info=this.GiftInfo[j];
									info.rate+=10;
									this.GiftTSs[j].changeText(this.makeGiftText(info));
								}
								this.M.SE.play('Gift_5',{volume:1});
							}
							break;
					}

					var s=this.Gifts.getFirstDead()||this.Gifts.getRandom();
					s.reset(this.world.randomX,0);
					s.tint=gift.tint;
				}else{
					break;
				}
			}
		}
		this.M.SE.play('Swing',{volume:3});
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
	jackpot:function(){
		this.isPlaying=!1;
		var info=this.GiftInfo[1];
		this.ResGift=this.add.sprite(this.world.randomX,0,'GiftL');
		this.ResGift.anchor.setTo(.5);
		this.ResGift.scale.setTo(0);
		this.ResGift.tint=info.tint;
		var twA=this.add.tween(this.ResGift).to({x:this.world.centerX,y:this.world.centerY},3E3,Phaser.Easing.Cubic.Out,!0);
		
		this.ResSp.visible=!0;
		twA.onComplete.add(function(){
			this.M.T.moveB(this.ResSp,{xy:{x:0},duration:500}).start();
			this.M.SE.play('Jackpot',{volume:1});
		},this);
		twA.start();
		this.add.tween(this.ResGift.scale).to({x:1,y:1},3E3,Phaser.Easing.Cubic.Out,!0);

		this.M.SE.play('Gift_1',{volume:1});
	},
	continue:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.ResSp.visible=!1;
		this.ResSp.x=this.world.width;
		this.ResGift.destroy();
		this.start();
		myGa('continue','Play','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
	},
	tweet:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var emoji='💪🦇💪🦇💪🦇💪';
		var res=this.makeSumText()+'\n';
		for(var k in this.GiftInfo)res+=(this.GiftInfo[k].effect+': '+this.GiftInfo[k].count+this.curWords.Count+'\n');
		var txt=this.curWords.TweetTtl+'\n'+emoji+'\n'+res+emoji+'\n';
		this.M.H.tweet(txt,this.curWords.TweetHT,location.href);
		myGa('tweet','Play','playCount_'+this.M.gGlb('playCount'),this.M.gGlb('playCount'));
	},
};