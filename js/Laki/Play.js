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
			1:{color:'#ff0000'},
			2:{color:'#ffff00'},
			3:{color:'#00ff00'},
			4:{color:'#00ffff'},
		};

		// Var
		this.LaneCount=4;
		this.LaneWidth=this.world.width*.25;
		this.LaneHalfWidth=this.LaneWidth*.5;

		// Obj
		this.Player=null;
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000000';
		// this.M.SE.playBGM('PlayBGM',{volume:1});

		this.genLane();

		this.Player=this.M.S.genBmpSqrSp(this.LaneHalfWidth,300,100,100,'#0000ff');
		this.Player.anchor.setTo(.5);

		this.input.onDown.add(function(pointer){
			this.inputEnabled=!1;
			// TODO if inputEnabled... and isPlaying
			console.log(pointer.x,pointer.y);

			var curLane=Math.floor(pointer.x/this.LaneWidth)+1;
			console.log(curLane);
			// TODO animation end this.inputEnabled=!0;

			var curLaneInfo=this.LaneInfo[curLane];
			// this.Player.x=curLaneInfo.x;

			this.M.T.moveB(this.Player,{xy:{x:curLaneInfo.x,y:'-50'},duration:500}).start();
			// OnComplete

		},this);

		this.start();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.Player.y+=.06*this.time.physicsElapsedMS;
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
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
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
};
