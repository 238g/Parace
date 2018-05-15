BasicGame.Play.prototype.BtnContainer = function () {
	var x = this.world.centerX;
	var y = this.world.centerY;
	var h = this.world.height;
	var textStyle = this.M.S.BaseTextStyleS(25);
	var tint = BasicGame.MAIN_TINT;
	this.genStartBtnSprite(x,y);
	this.genVolumeBtnSprite(50,h-40,tint);
	this.genFullScreenBtnSprite(this.world.width-50,h-40,tint);
	this.genBackBtnSprite(x,h-40,tint,textStyle);
	this.genTweetBtnSprite(x,h-100,tint,textStyle);
	this.genCorrectBtnSprite(x*.4,y*1.5);
	this.genWrongBtnSprite(x*1.6,y*1.5);
};

BasicGame.Play.prototype.genStartBtnSprite = function (x,y) {
	var textStyle = this.M.S.BaseTextStyleS(40);
	var btnSprite = this.add.button(x,y+100,'CircleBtns',this.onClickStart,this,'Hover','Normal','Push','Normal');
	btnSprite.anchor.setTo(.5);
	var textSprite = this.M.S.genText(0,0,'スタート',textStyle);
	textSprite.addToChild(btnSprite);
	this.StartBtnSprite = btnSprite;
	this.StartBtnTextSprite = textSprite;
};

BasicGame.Play.prototype.startBtnActive = function (TorF) {
	this.StartBtnSprite.inputEnabled = TorF;
};

BasicGame.Play.prototype.setStartBtnText = function (text, fontSize) {
	this.StartBtnTextSprite.setTextStyle({fontSize:fontSize});
	this.StartBtnTextSprite.changeText(text);
};

BasicGame.Play.prototype.onClickStart = function () {
	if (this.isPlaying) {
		this.showAnswer();
	} else {
		if (this.QuestionInfo.length == 0) {
			this.gameOver();
		} else {
			this.start();
		}
	}
};

BasicGame.Play.prototype.showAnswer = function () {
	this.isPlaying = false;
	this.secTimer = 1000;
	this.showCorrectBtn();
	this.showWrongBtn();
	this.startBtnActive(false);
	this.setAnswerText(this.curAnswer);
	this.setStartBtnText('正解？\n不正解？',35);
};

BasicGame.Play.prototype.genVolumeBtnSprite = function (x,y,tint) {
	var maxImg = BasicGame.VOLUME_MAX_IMG;
	var halfImg = BasicGame.VOLUME_HALF_IMG;
	var muteImg = BasicGame.VOLUME_MUTE_IMG;
	var curImg = this.sound.mute ? muteImg : (this.sound.volume==1) ? maxImg : halfImg;
	var volumeSprite = this.M.S.genSprite(x,y,'VolumeIcon',curImg);
	volumeSprite.anchor.setTo(.5);
	volumeSprite.scale.setTo(.5);
	volumeSprite.UonInputDown(this.onDownVolumeBtn);
};

BasicGame.Play.prototype.onDownVolumeBtn = function (sprite) {
	var maxImg = BasicGame.VOLUME_MAX_IMG;
	var halfImg = BasicGame.VOLUME_HALF_IMG;
	var muteImg = BasicGame.VOLUME_MUTE_IMG;
	if (this.sound.mute) {
		sprite.frameName = maxImg;
		this.sound.mute = false;
		this.sound.volume = 1;
	} else {
		if (this.sound.volume == 1) {
			sprite.frameName = halfImg;
			this.sound.volume = .5;
		} else {
			sprite.frameName = muteImg;
			this.sound.volume = 0;
			this.sound.mute = true;
		}
	}
};

BasicGame.Play.prototype.genFullScreenBtnSprite = function (x,y,tint) {
	var offImg = BasicGame.FULL_SCREEN_OFF_IMG;
	var onImg = BasicGame.FULL_SCREEN_ON_IMG;
	var curImg = this.scale.isFullScreen ? offImg : onImg;
	var fullScreenSprite = this.M.S.genButton(x,y,'GameIconsBlack',this.onDonwFullScreenBtn,this);
	fullScreenSprite.setFrames(curImg,curImg,curImg,curImg);
	fullScreenSprite.anchor.setTo(.5);
	fullScreenSprite.scale.setTo(.5);
};

BasicGame.Play.prototype.onDonwFullScreenBtn = function (sprite) {
	var curImg;
	var offImg = BasicGame.FULL_SCREEN_OFF_IMG;
	var onImg = BasicGame.FULL_SCREEN_ON_IMG;
	if (this.scale.isFullScreen) {
		curImg = onImg;
		this.scale.stopFullScreen(false);
	} else {
		curImg = offImg;
		this.scale.startFullScreen(false);
	}
	sprite.setFrames(curImg,curImg,curImg,curImg);
};

BasicGame.Play.prototype.genBackBtnSprite = function (x,y,tint,textStyle) {
	this.M.S.BasicWhiteLabelS(x,y,this.goToTitleSceen,'戻る',textStyle,{tint:tint});
};

BasicGame.Play.prototype.goToTitleSceen = function () {
	this.M.NextScene('Title');
};

BasicGame.Play.prototype.genTweetBtnSprite = function (x,y,tint,textStyle) {
	this.M.S.BasicWhiteLabelS(x,y,this.tweet,'結果をツイート',textStyle,{tint:tint});
};

BasicGame.Play.prototype.tweet = function () {
	var quotes = (this.curWrongCount<4) ? ['なし'] : [
		'罰ゲーム1',
		'罰ゲーム2',
		'罰ゲーム3',
		'罰ゲーム4',
	];
	var emoji = '💣💣💣💣💣💣';
	var text = 
				'『'+BasicGame.GAME_TITLE+'』で遊んだよ！\n'
				+emoji+'\n'
				+'出題数: '+this.curQuestionCount+'\n'
				+'正解: '+this.curCorrectCount+'\n'
				+'不正解: '+this.curWrongCount+'\n'
				+'罰ゲーム: '+this.rnd.pick(quotes)+'\n'
				+emoji+'\n';
	var hashtags = 'ミラアカゲーム';
	this.M.H.tweet(text,hashtags,location.href);
};

BasicGame.Play.prototype.genCorrectBtnSprite = function (x,y) {
	var btnSprite = this.M.S.genButton(x,y,'RedBtns',this.selectCorrectOrWrong);
	btnSprite.setFrames(0,0,1,0);
	btnSprite.anchor.setTo(.5);
	btnSprite.tag = this.CORRECT;
	var textSprite = this.M.S.genText(0,0,'◯',{});
	textSprite.addToChild(btnSprite);
	btnSprite.hide();
	this.CorrectBtnSprite = btnSprite;
};

BasicGame.Play.prototype.showCorrectBtn = function () {
	this.CorrectBtnSprite.show();
};

BasicGame.Play.prototype.hideCorrectBtn = function () {
	this.CorrectBtnSprite.hide();
};

BasicGame.Play.prototype.genWrongBtnSprite = function (x,y) {
	var btnSprite = this.M.S.genButton(x,y,'BlueBtns',this.selectCorrectOrWrong);
	btnSprite.setFrames(0,0,1,0);
	btnSprite.anchor.setTo(.5);
	btnSprite.tag = this.WRONG;
	var textSprite = this.M.S.genText(0,0,'☓',{});
	textSprite.addToChild(btnSprite);
	btnSprite.hide();
	this.WrongBtnSprite = btnSprite;
};

BasicGame.Play.prototype.showWrongBtn = function () {
	this.WrongBtnSprite.show();
};

BasicGame.Play.prototype.hideWrongBtn = function () {
	this.WrongBtnSprite.hide();
};

BasicGame.Play.prototype.selectCorrectOrWrong = function (sprite) {
	// TODO auto on off -> auto start
	this.startBtnActive(true);
	this.setStartBtnText('次の問題\nスタート', 38);
	if (sprite.tag == this.CORRECT) {
		if (this.curSelectedJudge == this.CORRECT) return;
		this.curCorrectCount++;
		if (this.curSelectedJudge == this.WRONG) this.curWrongCount--;
		this.curSelectedJudge = this.CORRECT;
	} else {
		if (this.curSelectedJudge == this.WRONG) return;
		this.curWrongCount++;
		if (this.curSelectedJudge == this.CORRECT) this.curCorrectCount--;
		this.curSelectedJudge = this.WRONG;
	}
	this.setCorrectCountText(this.curCorrectCount);
	this.setWrongCountText(this.curWrongCount);
};