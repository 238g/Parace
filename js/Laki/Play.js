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
		this.INTERVAL_TIME=this.curStageInfo.interval;
		this.respawnTimer=this.INTERVAL_TIME;

		this.curPlayerLane=1;
		this.preRespawnFloorLane=1;

		this.viewFloorsList=[];

		this.onFloorCount=0;

		// Obj
		this.LeadFloor=
		this.Floors=
		this.Player=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000000';
		// this.M.SE.playBGM('PlayBGM',{volume:1});

		this.genLane();

		this.genFloors();

		this.startRespawn();

		this.genPlayer();

		this.inputHandler();

		this.start();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.curSpeed=this.curStageInfo.speed*this.time.physicsElapsedMS;
			this.Player.y+=this.curSpeed;
			this.Floors.forEachAlive(function(s){
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
			this.M.S.genBmpSqrSp(laneStartX,0,this.LaneWidth,this.world.height,this.LaneInfo[i].color);
			this.LaneInfo[i].x=laneStartX+this.LaneHalfWidth;
		}
	},
	genFloors:function(){
		this.Floors=this.add.group();
		this.Floors.createMultiple(30,'Floors');
		this.Floors.forEach(function(s){
			s.anchor.setTo(.5);
			s.checkWorldBounds=!0;
			s.outOfBoundsKill=!0;
		},this);
	},
	// this.rnd.integerInRange(1,4);
	respawn:function(){
		var f=this.rnd.pick(this.Floors.children.filter(function(s){return!s.alive;}));
		if(f){
			var rndArr=[];
			for(var i=1;i<=4;i++){
				if(i==this.preRespawnFloorLane)continue;
				rndArr.push(i);
			}
			this.preRespawnFloorLane=this.rnd.pick(rndArr);
			var curLaneInfo=this.LaneInfo[this.preRespawnFloorLane];
			f.reset(curLaneInfo.x,0);

			this.viewFloorsList.push(f);
		}
	},
	startRespawn:function(){
		this.respawn();
		this.respawn();
		this.respawn();

		this.viewFloorsList[0].y=this.world.centerY; // TODO speed!!
		this.viewFloorsList[1].y=this.viewFloorsList[0].y*.5; // TODO speed!!!
	},
	genPlayer:function(){
		this.Player=this.M.S.genBmpSqrSp(this.viewFloorsList[0].x,this.viewFloorsList[0].y,80,80,'#0000ff');
		// this.Player=this.M.S.genBmpSqrSp(this.LaneHalfWidth,this.world.centerY,80,80,'#0000ff');
		this.Player.anchor.setTo(.5);
		this.viewFloorsList.shift();
		this.curPlayerLane=this.getLaneNum(this.Player.x);
	},
	inputHandler:function(){

		this.input.onDown.add(function(pointer){
			if(this.isPlaying&&this.inputEnabled){
				var curLane=this.getLaneNum(pointer.x);
				if(curLane==this.curPlayerLane)return;

				this.inputEnabled=!1;

				this.curPlayerLane=curLane

				var curLaneInfo=this.LaneInfo[curLane];

				this.LeadFloor=this.viewFloorsList[0];
				var jump=this.LeadFloor.y+(this.curStageInfo.speed*15*this.time.physicsElapsedMS);
				// var jump=this.LeadFloor.y+(this.curStageInfo.speed*30*this.time.physicsElapsedMS);
				this.viewFloorsList.shift();
				// var jump='-'+(1.8*this.time.physicsElapsedMS);

				var tw=this.M.T.moveB(this.Player,{xy:{x:curLaneInfo.x,y:jump},duration:500});
				tw.onComplete.add(function(){
					this.inputEnabled=!0;
					// TODO animation end

					var curFloorLane=this.getLaneNum(this.LeadFloor.x);
					if(curFloorLane!=this.curPlayerLane){
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
	getLaneNum:function(targetX){
		return Math.floor(targetX/this.LaneWidth)+1;
	},
};
