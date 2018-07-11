BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		this.isPlaying=!1;
		this.curChar=this.M.getGlobal('curChar');
		this.CharInfo=this.M.getConf('CharInfo');
		this.curCharInfo=this.CharInfo[this.curChar];

		this.playCount=0;

		this.targetTime='1.00';

		this.startTime=

		this.CharSprite=
		this.ResWordsTxtSprite=
		this.PlayLabel=
		this.TweetLabel=
		this.TimeTxtSprite=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		this.stage.setBackgroundColor(0xfbf6d5);
		// this.M.SE.playBGM('PlayBGM',{volume:1});
		this.genContents();
		this.tes();
	},
	genContents:function(){
		this.CharSprite=this.add.sprite(this.world.centerX,this.world.centerY,this.curCharInfo.normal);
		this.CharSprite.anchor.setTo(.5);
		this.ResWordsTxtSprite=this.M.S.genTextM(0,0,'');
		this.HowToTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.12,this.targetTime+' でピッタリ止めろ',this.M.S.BaseTextStyleS(40));
		this.PlayCountTxtSprite=this.M.S.genTextM(this.world.width*.8,this.world.height*.96,'0回',this.M.S.BaseTextStyleSS(35));
		this.M.S.BasicGrayLabelM(this.world.width*.24,this.world.height*.0365,this.back,'BACK',this.M.S.BaseTextStyleS(20),{tint:0xFF8000}).scale.setTo(1.1);
		this.PlayLabel=this.M.S.BasicGrayLabelM(this.world.centerX,this.world.height*.875,this.play,'START',this.M.S.BaseTextStyleS(20),{tint:0xFF8000});
		this.PlayLabel.scale.setTo(1.1);
		this.TweetLabel=this.M.S.BasicGrayLabelM(this.world.width*.24,this.world.height*.95,this.tweet,'TWEET',this.M.S.BaseTextStyleS(20),{tint:0xFF8000});
		this.TweetLabel.visible=!1;

		this.TimeTxtSprite=this.M.S.genTextM(this.world.centerX,this.world.height*.2,this.targetTime,this.M.S.BaseTextStyleS(60));
	},
	play:function(){
		this.isPlaying?this.timerStop():this.timerStart();
		this.M.SE.play('StopwatchSE',{volume:1});
	},
	timerStart:function(){
		this.isPlaying=!0;
		this.PlayLabel.children[0].changeText('STOP');
		this.TweetLabel.visible=!1;
		this.playCount++;
		this.startTime=Date.now();
		this.TimeTxtSprite.hide();
		this.CharSprite.loadTexture(this.curCharInfo.normal);
		this.CharSprite.x=this.world.centerX;
		this.CharSprite.y=this.world.centerY;
		this.ResWordsTxtSprite.x=this.world.centerX;
		this.ResWordsTxtSprite.y=this.world.height*.75;
		this.ResWordsTxtSprite.hide();
	},
	timerStop:function(){
		this.isPlaying=!1;
		this.PlayLabel.children[0].changeText('AGAIN');
		this.TweetLabel.visible=!0; // TODO ???? clear tweet
		this.PlayCountTxtSprite.changeText(this.playCount+'回');
		var elapsedTime=(Date.now()-this.startTime)*.001;
		var curTime=elapsedTime.toFixed(2);
		this.TimeTxtSprite.changeText(curTime);
		this.TimeTxtSprite.show();
		var res=this.checkTime(curTime);
		this.CharSprite.loadTexture(this.curCharInfo.playImg[res]);
		var rw=this.curCharInfo.resultWords[res];
		rw.charX&&(this.CharSprite.x=rw.charX);
		rw.charY&&(this.CharSprite.y=rw.charY);
		var txt=this.ResWordsTxtSprite.children[0];
		var ts=rw.ts;
		for(var k in ts){
			var a=ts[k];
			this.ResWordsTxtSprite[k]=a;
			txt[k]=a;
		}
		this.ResWordsTxtSprite.changeText(rw.words);
		this.ResWordsTxtSprite.show();
	},
	checkTime:function(curTime){
		if (this.targetTime==curTime) {
			return 1;
		} else if (this.betweenTime(this.targetTime*.05,curTime)) {
			return 2;
		} else if (this.betweenTime(this.targetTime*.3,curTime)) {
			return 3;
		} else if (this.betweenTime(this.targetTime*.5,curTime)) {
			return 4;
		} else {
			return 5;
		}
	},
	betweenTime:function(marginTime,curTime){
		return (this.targetTime-marginTime<=curTime&&curTime<=this.targetTime+marginTime);
	},
	back:function(){
		this.M.SE.play('CancelSE',{volume:1});
		this.M.NextScene('SelectChar');
	},
	tweet:function(){
		this.M.SE.play('SelectSE',{volume:1});
		var resultText=
			'選択キャラクター: '+this.curCharInfo.charName+'\n'
			+this.targetTime+'秒クリア！\n'
			+this.playCount+'回目の挑戦！\n'; // TODO
		var emoji='⏰⏰⏰⏰⏰⏰';
		var text='『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
					+emoji+'\n'
					+resultText
					+emoji+'\n';
		var hashtags = 'VT秒当てゲーム';
		this.M.H.tweet(text,hashtags,location.href);
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(function(){this.end();},this);
		}
	},
};