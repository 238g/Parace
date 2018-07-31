BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;

		// Conf
		this.StageInfo=this.M.gGlb('StageInfo');
		this.curStage=this.M.gGlb('curStage');
		this.curStageInfo=this.StageInfo[this.curStage];
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		this.LaneInfo={1:{x:0},2:{x:0},3:{x:0},4:{x:0}};

		// Var
		this.LaneCount=4;
		this.LaneWidth=this.world.width*.25;
		this.LaneHalfWidth=this.LaneWidth*.5;

		this.curSpeed=0;
		this.INTERVAL_TIME=this.curStageInfo.interval;
		this.respawnTimer=this.INTERVAL_TIME;

		this.curPlayerLane=1;
		this.prePlayerLane=1;
		this.preRespawnFloorLane=1;
		this.rightDirPlayer=!1;

		this.viewFloorsList=[];

		this.leftFloorCount=this.curStageInfo.target;

		this.clear=!1;
		this.isEnd=!0;

		// Obj
		this.LeadFloor=
		this.Floors=
		this.Obstacles=
		this.Player=
		this.TutSprite=
		this.LeftFloorCountTxtSprite=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(BasicGame.WHITE_COLOR);
		this.M.SE.playBGM('PlayBGM',{volume:1.5});

		this.add.sprite(0,0,'PlayBg_1');

		this.ifChallenger();

		this.genLane();
		this.genFloors();
		this.startRespawn();
		this.genPlayer();

		this.LeftFloorCountTxtSprite=this.M.S.genTxt(this.world.centerX,this.world.height*.05,this.leftFloorCount,this.M.S.txtstyl(40));

		this.inputHandler();

		this.M.gGlb('endTut')?this.start():this.tut();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.curSpeed=this.curStageInfo.speed*this.time.physicsElapsedMS;
			this.Player.y+=this.curSpeed;

			this.Floors.forEachAlive(function(s){
				s.y+=this.curSpeed;
			},this);
			this.Obstacles.forEachAlive(function(s){
				s.y+=this.curSpeed;
			},this);

			this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=this.INTERVAL_TIME;

				if(this.Player.y>this.world.height)return this.gameover();

				this.respawn();
			}
		}
	},
	tut:function(){
		this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
		this.TutSprite.anchor.setTo(.5);
		this.TutSprite.tint=0x000000;
		this.input.onDown.addOnce(function(){
			this.M.SE.play('OnStart',{volume:1});
			this.TutSprite.destroy();
			this.M.sGlb('endTut',!0);
			this.start();
		},this);
		this.TutSprite.addChild(this.M.S.genTxt(0,0,this.isEnd?this.curWords.HowTo:this.curWords.HowToE,this.M.S.txtstyl(25)));
	},
	start:function(){
		var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,'START',this.M.S.txtstyl(80));
		ts.scale.setTo(0);
		var tw=this.M.T.popUpB(ts);
		tw.onComplete.add(function(){
			this.destroy();
		},ts);
		tw.onComplete.add(function(){
			this.isPlaying=!0;
			this.inputEnabled=!0;
		},this);
		tw.start();
	},
	end:function(){
		if(this.isPlaying){
			this.isPlaying=!1;
			this.clear=!0;

			this.M.SE.play('ClearA',{volume:1});

			var s=this.add.sprite(this.world.width,this.world.height,'Laki_Clear');
			s.anchor.setTo(0,1);
			var tsA=this.M.S.genTxt(s.width*.51,-s.height*.8,'きらっきー☆ヾ(o\'▽\'o)ゝ',this.M.S.txtstyl(35));
			tsA.angle=-20;
			s.addChild(tsA);

			var twA=this.M.T.moveB(s,{xy:{x:0},duration:300});
			twA.start();
			var twB=this.M.T.moveB(s,{xy:{x:-this.world.width},duration:800,delay:600});
			twA.chain(twB);
			twB.onComplete.add(function(){
				this.M.SE.play('ClearB',{volume:2});

				var tsB=this.M.S.genTxt(this.world.centerX,this.world.centerY,'CLEAR!',this.M.S.txtstyl(80));
				tsB.scale.setTo(0);
				var twD=this.M.T.popUpB(tsB);
				twD.onComplete.add(this.genRes,this);
				twD.start();
			},this);

		}
	},
	gameover:function(){
		if(this.isPlaying){
			this.isPlaying=!1;
			this.clear=!1;

			var s=this.add.sprite(this.world.width,this.world.height,'Laki_GameOver');
			s.anchor.setTo(0,1);
			var twA=this.M.T.moveB(s,{xy:{x:0},duration:300});
			twA.start();
			var twB=this.M.T.moveB(s,{xy:{x:-this.world.width},duration:600,delay:500});
			twA.chain(twB);
			twA.onComplete.add(function(){
				this.M.SE.play('Blink',{volume:1});
			},this);
			twB.onComplete.add(function(){
				this.M.SE.play('Fall',{volume:1});

				this.add.tween(this.Player).to({angle:359},1E3,null,!0,0,Infinity);
				var twC=this.add.tween(this.Player);
				twC.to({y:this.world.height*1.5},1E3,Phaser.Easing.Back.In,!0);
				twC.onComplete.add(function(){
					this.Player.destroy();
				},this);

				var ts=this.M.S.genTxt(this.world.centerX,this.world.centerY,'GAME\nOVER',this.M.S.txtstyl(70));
				ts.scale.setTo(0);
				var twD=this.M.T.popUpB(ts);
				twD.onComplete.add(this.genRes,this);
				twD.start();
			},this);
		}
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameover,this);
		}
	},
	////////////////////////////////////// PlayContents
	ifChallenger:function(){
		if(this.curStage==7){
			this.isEnd=!1;
			this.leftFloorCount=0;
			this.onFloorT=this.onFloorE;
			this.tweetT=this.tweetE;
			this.M.sGlb('endTut',!1);
		}else{
			this.onFloorT=this.onFloor;
			this.tweetT=this.tweet;
		}
	},
	genLane:function(){
		for(var i=1;i<=this.LaneCount;i++){
			var laneStartX=(i-1)*this.LaneWidth;
			////// this.M.S.genBmpSqrSp(laneStartX,0,this.LaneWidth,this.world.height,this.LaneInfo[i].color);
			this.LaneInfo[i].x=laneStartX+this.LaneHalfWidth;
		}
	},
	genFloors:function(){
		this.Floors=this.add.group();
		this.Floors.createMultiple(8,['Floor_1','Floor_2','Floor_3','Floor_4']);
		this.Floors.forEach(function(s){
			s.anchor.setTo(.5);
			s.checkWorldBounds=!0;
			s.outOfBoundsKill=!0;
		},this);

		this.Obstacles=this.add.group();
		this.Obstacles.createMultiple(5,'Obstacle_1');
		this.Obstacles.forEach(function(s){
			s.anchor.setTo(.5);
			s.checkWorldBounds=!0;
			s.outOfBoundsKill=!0;
		},this);
	},
	respawn:function(){
		var f=this.rnd.pick(this.Floors.children.filter(function(s){return!s.alive;}));
		if(f){
			////// floor
			var rndArr=[];
			for(var i=1;i<=4;i++){
				if(i==this.preRespawnFloorLane)continue;
				rndArr.push(i);
			}
			this.preRespawnFloorLane=this.rnd.pick(rndArr);
			var curLaneInfo=this.LaneInfo[this.preRespawnFloorLane];
			f.reset(curLaneInfo.x,0);

			this.viewFloorsList.push(f);

			////// obstacle
			if(this.isPlaying&&this.rnd.between(1,100)<this.curStageInfo.obstacleRate){
				var o=this.rnd.pick(this.Obstacles.children.filter(function(s){return!s.alive;}));
				
				if(o){
					rndArr=[];

					for(var i=1;i<=4;i++){
						if(i==this.preRespawnFloorLane)continue;
						rndArr.push(i);
					}

					o.reset(this.LaneInfo[this.rnd.pick(rndArr)].x,0);
				}
			}
		}
	},
	startRespawn:function(){
		this.respawn();
		this.respawn();
		this.respawn();

		this.viewFloorsList[0].y=this.world.centerY;
		this.viewFloorsList[1].y=this.viewFloorsList[0].y*.5;
	},
	genPlayer:function(){
		var y=this.viewFloorsList[0].y-(this.viewFloorsList[0].height*.1);
		this.Player=this.add.sprite(this.viewFloorsList[0].x,y,'Laki_Crouch');
		this.Player.anchor.setTo(.5);
		this.viewFloorsList.shift();
		this.curPlayerLane=this.getLaneNum(this.Player.x);
		this.prePlayerLane=this.curPlayerLane;
	},
	inputHandler:function(){

		this.input.onDown.add(function(pointer){
			if(this.isPlaying&&this.inputEnabled){
				var curLane=this.getLaneNum(pointer.x);
				if(curLane==this.curPlayerLane)return;

				this.inputEnabled=!1;

				this.M.SE.play('Jump_'+this.rnd.integerInRange(1,4),{volume:3});

				this.curPlayerLane=curLane

				this.Player.loadTexture('Laki_Jump');
				if(curLane>this.prePlayerLane){
					if(!this.rightDirPlayer){
						this.rightDirPlayer=!0;
						this.Player.scale.setTo(-1,1);
					}
				}else{
					if(this.rightDirPlayer){
						this.rightDirPlayer=!1;
						this.Player.scale.setTo(1,1);
					}
				}

				var curLaneInfo=this.LaneInfo[curLane];

				this.LeadFloor=this.viewFloorsList[0];
				var jump=this.LeadFloor.y+(this.curStageInfo.speed*this.time.physicsElapsedMS*30);
				this.viewFloorsList.shift();

				var tw=this.M.T.moveB(this.Player,{xy:{x:curLaneInfo.x,y:jump},duration:500});
				tw.onComplete.add(this.onFloorT,this);
				tw.start();
			}
		},this);
	},
	onFloorT:function(){},
	onFloor:function(){
		this.Player.loadTexture('Laki_Crouch');
		this.prePlayerLane=this.curPlayerLane;

		var curFloorLane=this.getLaneNum(this.LeadFloor.x);
		if(curFloorLane==this.curPlayerLane){
			this.inputEnabled=!0;

			this.leftFloorCount--;
			this.LeftFloorCountTxtSprite.changeText(this.leftFloorCount);
			0==this.leftFloorCount&&this.end();
		}else{
			this.gameover();
		}
	},
	onFloorE:function(){
		this.Player.loadTexture('Laki_Crouch');
		this.prePlayerLane=this.curPlayerLane;

		var curFloorLane=this.getLaneNum(this.LeadFloor.x);
		if(curFloorLane==this.curPlayerLane){
			this.inputEnabled=!0;

			this.leftFloorCount++;
			this.LeftFloorCountTxtSprite.changeText(this.leftFloorCount);
		}else{
			this.gameover();
		}
	},
	getLaneNum:function(targetX){
		return Math.floor(targetX/this.LaneWidth)+1;
	},
	genRes:function(){
		this.time.events.add(800,function(){
			var s=this.add.sprite(0,0,'TWP');
			s.tint=0x000000;
			s.alpha=0;
			this.M.T.fadeInA(s,{duration:800,alpha:1}).start();

			var tsl=this.M.S.txtstyl(25);
			var x=this.world.centerX;

			s.addChild(this.M.S.genTxt(x,this.world.height*.2,this.clear?'CLEAR!':'GAME\nOVER',this.M.S.txtstyl(50)));
			s.addChild(this.M.S.genTxt(x,this.world.height*.4,this.curStageInfo.name,this.M.S.txtstyl(50)));
			if(this.clear||!this.isEnd){
				s.addChild(this.M.S.genLbl(x,this.world.centerY,this.tweetT,this.curWords.Tweet,tsl));
			}else{
				s.addChild(this.M.S.genLbl(x,this.world.centerY,this.again,this.curWords.Again,tsl));
			}
			s.addChild(this.M.S.genLbl(x,this.world.height*.6,this.back,this.curWords.Back,tsl));
			
			s.addChild(this.M.S.genLbl(this.world.width*.25,this.world.height*.7,this.yt,'YouTube',tsl));
			s.addChild(this.M.S.genLbl(this.world.width*.75,this.world.height*.7,this.onOtherGames,this.curWords.OtherGames,tsl));

			var cA=this.add.sprite(this.world.width*.25,this.world.height,'Laki_ResPointer');
			cA.anchor.setTo(.5,1);
			s.addChild(cA);
			var cB=this.add.sprite(this.world.width*.75,this.world.height,'Laki_ResPointer');
			cB.anchor.setTo(.5,1);
			cB.scale.setTo(-1,1);
			s.addChild(cB);
		},this);
	},
	tweetT:function(){},
	tweet:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var emoji='🐸🐸🐸🐸🐸🐸';
		var res=this.curStageInfo.name+' CLEAR!';
		var txt=this.curWords.TweetTtl+'\n'
				+emoji+'\n'
				+res+'\n'
				+emoji+'\n';
		var ht='ラキゲーム';
		this.M.H.tweet(txt,ht,location.href);
	},
	tweetE:function(){
		this.M.SE.play('OnBtn',{volume:1});
		var emoji='🐸🐸🐸🐸🐸🐸';
		var res=this.curStageInfo.name+'の記録: '+this.leftFloorCount;
		var txt=this.curWords.TweetTtl+'\n'
				+emoji+'\n'
				+res+'\n'
				+emoji+'\n';
		var ht='ラキゲーム';
		this.M.H.tweet(txt,ht,location.href);
	},
	again:function(){
		this.M.SE.play('OnStart',{volume:1});
		this.M.NextScene('Play');
	},
	back:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.M.NextScene('SelectStage');
	},
	yt:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.game.device.desktop?window.open(BasicGame.YOUTUBE_URL,'_blank'):location.href=BasicGame.YOUTUBE_URL;
	},
	onOtherGames:function(){
		this.M.SE.play('OnBtn',{volume:1});
		if (this.game.device.desktop) {
			window.open(BasicGame.MY_GAMES_URL,'_blank');
		} else {
			location.href=BasicGame.MY_GAMES_URL;
		}
	},
};
