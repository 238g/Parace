BasicGame.Play.prototype.HUDContainer = function () {
	this.HUD = {
		self: this,
		showGameOver: null,
		changeLives: null,
		startGame: null,
	};
	this.genStartTextSprite();
	this.genLivesTextSprite();
	this.genGameOverTextSprite();
};

BasicGame.Play.prototype.genStartTextSprite = function () {
	var baseText = 'スタート';
	var textStyle = this.BaseTextStyle(200);
	var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
	textSprite.setAnchor(.5);
	textSprite.setScale(0,0);
	textSprite.addTween('popUpB',{duration: 1000, delay: 500});
	this.M.T.onComplete(textSprite.multipleTextTween.popUpB, function () {
		this.time.events.add(1000, function () {
			textSprite.hide();
			this.start();
		}, this);
	});
	this.HUD.startGame = function () {
		textSprite.startTween('popUpB');
	};
};

BasicGame.Play.prototype.genLivesTextSprite = function () {
	var baseText = '残り: ';
	var textStyle = this.BaseTextStyle(60);
	var textSprite = this.M.S.genText(10,10,baseText+this.Bricks.countLiving(),textStyle);
	textSprite.setAnchor(0,0);
	this.HUD.changeLives = function (val) {
		textSprite.changeText(baseText+val);
	};
};

BasicGame.Play.prototype.genGameOverTextSprite = function () {
	var baseText = '終了！！';
	var textStyle = this.BaseTextStyle(200);
	var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
	textSprite.setAnchor(.5);
	textSprite.setScale(0,0);
	this.HUD.showGameOver = function () {
		textSprite.addTween('popUpB',{});
		textSprite.startTween('popUpB');
	};
};
