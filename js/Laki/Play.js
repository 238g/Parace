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

		this.LaneInfo={
			1:{x:0,color:'#ff0000'},
			2:{x:0,color:'#ffff00'},
			3:{x:0,color:'#00ff00'},
			4:{x:0,color:'#00ffff'},
		};

		// Var
		this.LaneCount=4;
		this.LaneWidth=this.world.width*.25;
		this.LaneHalfWidth=this.LaneWidth*.5;

		this.curSpeed=0;
		this.respawnTimer=1E3;

		this.curPlayerLane=1;
		this.respawnObstacleLane=1;

		this.viewObstaclesList=[];

		this.onFloorCount=0;

		// Obj
		this.LeadObstacle=
		this.Obstacles=
		this.Player=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000000';
		// this.M.SE.playBGM('PlayBGM',{volume:1});

		this.genLane();

		this.genObstacles();

		this.startRespawn();

		this.genPlayer();

		this.inputHandler();

		this.start();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.curSpeed=this.curStageInfo.speed*this.time.physicsElapsedMS;
			this.Player.y+=this.curSpeed
			this.Obstacles.forEachAlive(function(e){
				e.y+=this.curSpeed;
			},this);

			this.respawnTimer-=this.time.elapsed;
			if(this.respawnTimer<0){
				this.respawnTimer=1E3;

				this.respawn();
			}
		}
	},
	tut:function(){
	},
	start:function(){
		this.isPlaying=!0;
		this.inputEnabled=!0;
	},
	end:function(){
		this.isPlaying=!1;
		console.log('Clear');
	},
	gameover:function(){
		this.isPlaying=!1;
		console.log('GameOver');
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
			this.input.keyboard.addKey(Phaser.Keyboard.G).onDown.add(this.gameover,this);
		}
	},
	////////////////////////////////////// PlayContents
	genLane:function(){
		for(var i=1;i<=this.LaneCount;i++){
			var laneStartX=(i-1)*this.LaneWidth;
			var s=this.M.S.genBmpSqrSp(laneStartX,0,this.LaneWidth,this.world.height,this.LaneInfo[i].color);
			this.LaneInfo[i].x=laneStartX+this.LaneHalfWidth;
		}
	},
	genObstacles:function(){
		this.Obstacles=this.add.group();
		this.Obstacles.createMultiple(30,'Obstacles');
		this.Obstacles.forEach(function(s){
			s.anchor.setTo(.5);
			s.checkWorldBounds=!0;
			s.outOfBoundsKill=!0;
		},this);
	},
	// this.rnd.integerInRange(1,4);
	respawn:function(){
		var s=this.rnd.pick(this.Obstacles.children.filter(function(e){return!e.alive;}));
		if(s){
			var rndArr=[];
			for(var i=1;i<=4;i++){
				if(i==this.respawnObstacleLane)continue;
				rndArr.push(i);
			}
			this.respawnObstacleLane=this.rnd.pick(rndArr);
			var curLaneInfo=this.LaneInfo[this.respawnObstacleLane];
			s.reset(curLaneInfo.x,0);

			this.viewObstaclesList.push(s);
		}
	},
	startRespawn:function(){
		this.respawn();
		this.respawn();
		this.respawn();
		
		this.viewObstaclesList[0].y=this.world.centerY; // TODO speed!!
		this.viewObstaclesList[1].y=this.viewObstaclesList[0].y*.5; // TODO speed!!!
	},
	genPlayer:function(){
		this.Player=this.M.S.genBmpSqrSp(this.viewObstaclesList[0].x,this.viewObstaclesList[0].y,80,80,'#0000ff');
		// this.Player=this.M.S.genBmpSqrSp(this.LaneHalfWidth,this.world.centerY,80,80,'#0000ff');
		this.Player.anchor.setTo(.5);
		this.viewObstaclesList.shift();
	},
	inputHandler:function(){

		this.input.onDown.add(function(pointer){
			if(this.isPlaying&&this.inputEnabled){
				var curLane=Math.floor(pointer.x/this.LaneWidth)+1;
				if(curLane==this.curPlayerLane)return;

				this.inputEnabled=!1;
				// console.log(pointer.x,pointer.y);

				this.curPlayerLane=curLane
				// console.log(curLane);

				var curLaneInfo=this.LaneInfo[curLane];
				// this.Player.x=curLaneInfo.x;

				this.LeadObstacle=this.viewObstaclesList[0];
				// var jump=this.LeadObstacle.y;
				var jump=this.LeadObstacle.y+(this.curStageInfo.speed*15*this.time.physicsElapsedMS);
				// var jump=this.LeadObstacle.y+(this.curStageInfo.speed*30*this.time.physicsElapsedMS);
				this.viewObstaclesList.shift();
				// var jump='-'+(1.8*this.time.physicsElapsedMS);

				var tw=this.M.T.moveB(this.Player,{xy:{x:curLaneInfo.x,y:jump},duration:500});
				// var tw=this.M.T.moveB(this.Player,{xy:{x:curLaneInfo.x,y:'-50'},duration:500});
				tw.onComplete.add(function(){
					this.inputEnabled=!0;
					// TODO animation end

					var curObstacleLane=Math.floor(this.LeadObstacle.x/this.LaneWidth)+1;
					if(curObstacleLane!=this.curPlayerLane){
						this.gameover();
						return;
					}

					this.onFloorCount++;
					if(this.onFloorCount==this.curStageInfo.target){
						this.end();
					}
				},this);
				tw.start();
			}
		},this);
	},
};
