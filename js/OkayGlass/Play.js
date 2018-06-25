BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.inputEnabled=
		this.isPlaying=!1;
		this.curMode=this.M.getGlobal('curMode');
		this.leftTime=180;
		this.msTimer=1E3;
		this.score=0;

		this.BackBtnSprite=
		this.TutSprite=this.TimeTxtSprite=this.ScoreTxtSprite=this.TiredBtnSprite=null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		'FREE'==this.curMode?this.freeContents():this.scoreContents();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			this.msTimer-=this.time.elapsed;
			if(this.msTimer<0){
				this.msTimer=1E3;
				this.leftTime--;
				if(this.leftTime<=0){
					this.TimeTxtSprite.changeText('制限時間: '+0);
					this.end();
				}else{
					this.TimeTxtSprite.changeText('制限時間: '+this.leftTime);
				}
			}
		}
	},
	freeContents:function(){
		this.BackBtnSprite=this.M.S.BasicGrayLabelM(this.world.width*.25,this.world.height*.95,this.back,'戻る',this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		// TODO dont need start
		this.time.events.add(800,function(){this.inputEnabled=!0;},this);
	},
	back:function(){
		if(this.inputEnabled){
			// this.M.SE.play('OnBtn',{volume:1});
			this.M.NextScene('Title');
		}
	},
	scoreContents:function(){
		// TODO char btn click-> score change text 
		this.TimeTxtSprite=this.M.S.genTextM(this.world.width*.75,this.world.height*.05,'制限時間: '+this.leftTime,this.M.S. BaseTextStyleS(30));
		this.ScoreTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.95,'スコア: '+this.score,this.M.S. BaseTextStyleS(30));
		this.TiredBtnSprite=this.M.S.BasicGrayLabelM(this.world.width*.25,this.world.height*.05,function(){
			if(this.isPlaying){
				this.leftTime-=10;
				if(this.leftTime<0){
					this.leftTime=0;
				}else{
					this.score+=1000;
					this.ScoreTxtSprite.changeText('スコア: '+this.score);
					this.TimeTxtSprite.changeText('制限時間: '+this.leftTime);
				}
			}
		},'面倒',this.M.S. BaseTextStyleS(30));
		this.M.getGlobal('endTut')?this.start():this.tut();
	},
	tut:function(){
		this.TutSprite=this.add.sprite(this.world.centerX,this.world.centerY,'TWP');
		this.TutSprite.anchor.setTo(.5);
		this.TutSprite.tint=0x000000;
		this.input.onDown.addOnce(function(){
			this.TutSprite.destroy();
			this.start();
		},this);
		var txt='3分間メガネを割り続けろ！';
		var t=this.M.S.genTextM(0,0,txt,this.M.S.BaseTextStyleS(25));
		this.TutSprite.addChild(t);
	},
	start:function(){
		this.isPlaying=!0;
		// TODO start text popup
	},
	end:function(){
		this.isPlaying=!1;
		// TODO res
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
		}
	},
};
