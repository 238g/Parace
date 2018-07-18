BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=!1;

		// Conf
		this.StageInfo=this.M.gGlb('StageInfo');
		this.curStage=this.M.gGlb('curStage');
		this.curStageInfo=this.StageInfo[this.curStage];
		this.curLang=this.M.gGlb('curLang');
		this.Words=this.M.gGlb('Words');
		this.curWords=this.Words[this.curLang];

		
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor='#000000';
		// this.M.SE.playBGM('PlayBGM',{volume:1});

		this.tes();
	},
	tut:function(){
	},
	start:function(){
		this.isPlaying=!0;
	},
	end:function(){
		this.isPlaying=!1;
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
		}
	},
};
