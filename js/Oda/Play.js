BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function () { 
		this.isPlaying=this.canThrow=!1;
		this.minAngle=10;
		this.bladeStartPosY=this.world.height*.2;
		this.bladeGoToPosY=this.world.height*.8;
		this.curChar=this.M.getGlobal('curChar');
		this.curLevel=this.M.getGlobal('curLevel');
		this.curChallengeLevel=this.curLevel;
		this.LevelInfo=this.M.getConf('LevelInfo')[this.curLevel];
		this.rotationSpeed=this.LevelInfo.RotSpeed;
		this.rotationDir=this.LevelInfo.RotDir;
		this.leftCount=this.LevelInfo.GoalCount;
		this.BladeGroup=this.Blade=this.Target=
		this.TutorialSprite=this.GoalCountTextSprite=null;
		this.curLang=this.M.getGlobal('curLang');
		if(this.curLang=='en'){
			this.AllClearText='ALL CLEAR';
			this.TweetText='Tweet';
			this.NextLevelText='Next Level';
			this.GoToTitleText='Back To Title';
			this.LevelText='LEVEL: ';
			this.OtherGameText='Other Game';
			this.GameOverText='AGAIN';
			this.TutorialText=
				'You must place \nseveral swords on the circle \n'
				+'without touching \nany other swords!\n\n'
				+'The numbers of swords \nthat need to be stuck \n'
				+'are increasing as \nyou progress \nthrough the levels.\n\n'
				+'Can you beat \nall the 50 levels?\n'
				+'->  Let\'s START';
		}else{
			this.AllClearText='全クリア！！';
			this.TweetText='結果をツイート';
			this.NextLevelText='次のレベルへ';
			this.GoToTitleText='タイトルに戻る';
			this.LevelText='レベル: ';
			this.OtherGameText='他のゲーム';
			this.GameOverText='もう一度';
			this.TutorialText=
				'他の刀に触れることなく\n織田顔に刀を\n刺してください\n\n'
				+'レベルが進むにつれて\n刀の数や刺す数が\n増えていきます\n\n'
				+'50レベルすべてを\n刺すことはできるかな？\n\n'
				+'→ はじめる';
		}
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor = BasicGame.WHITE_COLOR;
		this.M.SE.stop('FireBGM');
		this.M.SE.playBGM('PlayBGM',{volume:1});
		this.BgContainer();
		this.BladeContainer();
		this.TargetContainer();
		this.M.S.genTextM(70,30,this.LevelText+this.curLevel);
		this.tutorial();
		this.test();
	},

	tutorial:function(){
		if(this.M.getGlobal('endTutorial')){
			this.start();
		}else{
			this.TutorialSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
			this.TutorialSprite.anchor.setTo(.5);
			this.TutorialSprite.tint=0x000000;
			this.TutorialSprite.addChild(this.M.S.genTextM(0,0,this.TutorialText));
			this.input.onDown.addOnce(function(){
				this.M.SE.play('OnBtn',{volume:1});
				this.TutorialSprite.destroy();
				this.M.setGlobal('endTutorial',!0);
				this.start();
			},this);
		}
	},

	throwBlade:function(){
		if (this.canThrow) {
			this.canThrow=!1;
			var tween=this.M.T.moveB(this.Blade,{xy:{y:this.bladeGoToPosY},duration:100});
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
			if(this.LevelInfo.ChangeSpeed>0)this.rotationSpeed=this.rnd.between(1,this.LevelInfo.ChangeSpeed);
			if(this.Target.face==1){
				this.time.events.add(500,function(){
					if(this.isPlaying){
						this.Target.loadTexture(this.curChar+'Circle_1');
						this.Target.face=1;
					}
				},this);
				this.Target.loadTexture(this.curChar+'Circle_2');
				this.Target.face=2;
			}
			if (legalHit) {
				this.genStuckBlade(this.Blade.x,this.Blade.y,this.Target.angle);
				this.leftCount--;
				this.GoalCountTextSprite.changeText(this.leftCount);
				if(this.leftCount==0)return this.end('clear');
				this.canThrow=!0;
				this.Blade.y=this.bladeStartPosY;
			} else {
				return this.end('gameover');
			}
			if(this.curChar=='Odanobu'){
				this.M.SE.play('OdanobuVoice_'+this.rnd.integerInRange(1,3),{volume:1});
			}else{
				this.M.SE.play('NobuhimeVoice_'+this.rnd.integerInRange(2,4),{volume:1.5});
			}
		}
	},

	update:function(){
		if (this.isPlaying) {
			var rotation=this.time.physicsElapsedMS*.06*this.rotationSpeed*this.rotationDir;
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
		this.Target.loadTexture(this.curChar+'Circle_3');
		this.Target.face=3;
		if (type=='clear') {
			if(this.curLevel==50){
				if(this.curChar!='Odanobu')this.M.SE.play('NobuhimeLaugh',{volume:3});
				this.M.SE.play('DonPafu',{volume:1});
				return this.genResult('allClear');
			}
			var sound=this.M.SE.play('Slash',{volume:1});
			// var sound=this.M.SE.play('Pew',{volume:2});
			sound.onStop .add(function(){
				this.M.SE.play('RipPaper',{volume:5});
			},this);
			if(this.curLevel%5==0){
				this.genResult('normal');
			}else{
				this.toPlay(this.NextLevelText);
			}
			this.curLevel++;
			this.M.setGlobal('curLevel',this.curLevel);
		}else{//gameover
			if(this.curChar=='Odanobu'){
				this.M.SE.play('OdanobuVoice_4',{volume:1});
			}else{
				this.M.SE.play('NobuhimeVoice_1',{volume:1});
			}
			this.toPlay(this.GameOverText);
		}
	},

	toPlay:function(text){
		var textSprite=this.M.S.genTextM(this.world.width*2,this.world.centerY,text,this.M.S.BaseTextStyleS(40));
		var tweenA=this.M.T.moveA(textSprite,{xy:{x:this.world.centerX},duration:1000});
		var tweenB=this.M.T.moveA(textSprite,{xy:{x:-this.world.width},delay:300,duration:700});
		tweenB.onComplete.add(function(){
			this.M.NextScene('Play');
		},this);
		tweenA.chain(tweenB);
		tweenA.start();
	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.stage.backgroundColor=BasicGame.WHITE_COLOR;
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function(){this.curLevel=5;this.end('clear');},this);
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.curLevel=50;this.end('clear');},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
			// (this.M.H.getQuery('level'))&&(this.curLevel=this.M.H.getQuery('level'));
			(this.M.H.getQuery('level')&&this.curLevel==1)&&(this.curLevel=this.M.H.getQuery('level'));
		}
	},
};
