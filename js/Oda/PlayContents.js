BasicGame.Play.prototype.BgContainer=function(){
	this.GoalCountTextSprite=this.M.S.genTextM(this.world.centerX,this.world.centerY-30,this.leftCount,this.M.S.BaseTextStyle(80));
};

BasicGame.Play.prototype.BladeContainer=function(){
	this.BladeGroup=this.add.group();
	this.Blade=this.add.sprite(this.world.centerX,this.bladeStartPosY,'Blade');
	this.Blade.anchor.setTo(.5);
};

BasicGame.Play.prototype.TargetContainer=function(){
	this.Target=this.add.sprite(this.world.centerX,this.world.height*.8,this.curChar+'Circle_1');
	this.Target.anchor.setTo(.5);
	this.Target.face=1;
	var stuckBlades=this.LevelInfo.StuckBlades;
	for(var k in stuckBlades)this.firstStuckBlade(this.world.centerX,this.bladeGoToPosY,stuckBlades[k]);
};

BasicGame.Play.prototype.firstStuckBlade=function(x,y,angle){
	var blade=this.genStuckBlade(x,y,angle);
	blade.angle-=angle;
	var radians = Phaser.Math.degToRad(blade.angle-90);
	blade.x=this.Target.x+(this.Target.width*.5)*Math.cos(radians);
	blade.y=this.Target.y+(this.Target.width*.5)*Math.sin(radians);
};

BasicGame.Play.prototype.genStuckBlade=function(x,y,angle){
	var blade=this.add.sprite(x,y,'Blade');
	blade.anchor.setTo(.5);
	blade.impactAngle=angle;
	this.BladeGroup.add(blade);
	return blade;
};

BasicGame.Play.prototype.genResult=function(type){
	var dialogSprite=this.add.sprite(this.world.width*1.5,this.world.centerY,'TWP');
	dialogSprite.anchor.setTo(.5);
	dialogSprite.tint = 0x000000;
	this.M.T.moveD(dialogSprite,{xy:{x:this.world.centerX},duration:1000}).start();
	if(type=='allClear'){
		dialogSprite.addChild(this.M.S.genTextM(0,-200,this.AllClearText,this.M.S.BaseTextStyleS(40)));
		dialogSprite.addChild(this.M.S.BasicGrayLabelM(0,-40,function(){
			this.curLevel=1;
			this.M.NextScene('Title');
		},this.GoToTitleText,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}));
	}else{
		dialogSprite.addChild(this.M.S.BasicGrayLabelM(0,-200,function(){this.M.NextScene('Play');},this.NextLevelText,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}));
		dialogSprite.addChild(this.M.S.BasicGrayLabelM(0,-40,function(){this.M.NextScene('Title');},this.GoToTitleText,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}));
	}
	dialogSprite.addChild(this.M.S.BasicGrayLabelM(0,-120,this.tweet,this.TweetText,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}));
	dialogSprite.addChild(this.M.S.BasicGrayLabelM(0,40,this.otherGame,this.OtherGameText,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT}));
	var logoSprite=this.add.button(0,200,this.curChar+'Logo',this.channel,this);
	logoSprite.anchor.setTo(.5);
	dialogSprite.addChild(logoSprite);
};

BasicGame.Play.prototype.otherGame=function(){
	// this.M.SE.play('MajiManjiVoice_1',{volume:1});
	var url=(this.curLang=='en')?BasicGame.MY_GAMES_URL+'?lang=en':BasicGame.MY_GAMES_URL;
	if(this.game.device.desktop){
		window.open(url,'_blank');
	} else {
		location.href=url;
	}
};

BasicGame.Play.prototype.channel=function(){
	// this.M.SE.play('MajiManjiVoice_1',{volume:1}); //TODO
	var url=(this.curChar=='Odanobu')?BasicGame.YOUTUBE_URL_1:BasicGame.YOUTUBE_URL_2;
	if (this.game.device.desktop) {
		window.open(url,'_blank');
	} else {
		location.href=url;
	}
};

BasicGame.Play.prototype.tweet=function(){
	// this.M.SE.play('MajiManjiVoice_1',{volume:1});
	var emoji=(this.curChar=='Odanobu')?'🏯🔪🏯🔪🏯🔪🏯':'🏯🔥🏯🔥🏯🔥🏯';
	if(this.curLang=='en'){
		var text =  emoji+'\n'
					+'I PLAY "'+BasicGame.GAME_TITLE+'"!!!\n'
					+('Your Level: '+this.curLevel)+'\n'
					+emoji+'\n';
		var hashtags = '織田ゲーム,OdaGame';
		var url=location.href+'?lang=en';
	}else{
		var text =  emoji+'\n'
					+'『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
					+('達成レベル: '+this.curLevel)+'\n'
					+emoji+'\n';
		var hashtags = '織田ゲーム';
		var url=location.href;
	}
	this.M.H.tweet(text,hashtags,url);
};
