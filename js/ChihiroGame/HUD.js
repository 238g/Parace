BasicGame.Play.prototype.HUDContainer = function () {
	this.HUD = {
		self: this,
		showGameOver: null,
		showClear: null,
		showToResult: null,
		showToBack: null,
		changeLives: null,
		startGame: null,
	};
	this.genStartTextSprite();
	this.genLivesTextSprite();
	this.genGameOverTextSprite();
	this.genClearTextSprite();
	this.genToResultTextSprite();
	this.genToBackTextSprite();
	this.genOfferTextSprite();
};

BasicGame.Play.prototype.genStartTextSprite = function () {
	var baseText = 'スタート';
	var textStyle = this.M.S.BaseTextStyle(200);
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
	var baseText = '残りのボール: ';
	var textStyle = this.M.S.BaseTextStyle(60);
	var textSprite = this.M.S.genText(10,10,baseText+this.GM.life,textStyle);
	textSprite.setAnchor(0,0);
	this.HUD.changeLives = function (val) {
		textSprite.changeText(baseText+val);
	};
};

BasicGame.Play.prototype.genGameOverTextSprite = function () {
	var baseText = 'ゲームオーバー！';
	var textStyle = this.M.S.BaseTextStyle(100);
	var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
	textSprite.setAnchor(.5);
	textSprite.setScale(0,0);
	this.HUD.showGameOver = function () {
		textSprite.addTween('popUpB',{});
		textSprite.startTween('popUpB');
	};
};

BasicGame.Play.prototype.genClearTextSprite = function () {
	var baseText = 'クリア！！';
	var textStyle = this.M.S.BaseTextStyle(120);
	var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
	textSprite.setAnchor(.5);
	textSprite.setScale(0,0);
	this.HUD.showClear = function () {
		textSprite.addTween('popUpB',{});
		textSprite.startTween('popUpB');
	};
};

BasicGame.Play.prototype.genToResultTextSprite = function () {
	var baseText = this.game.device.touch ? 'タッチで次へ' : 'クリックで次へ';
	var textStyle = this.M.S.BaseTextStyle(50);
	var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY+180,baseText,textStyle);
	textSprite.setAnchor(.5);
	textSprite.hide();
	this.HUD.showToResult = function () {
		textSprite.show();
	};
};

BasicGame.Play.prototype.genToBackTextSprite = function () {
	var baseText = this.game.device.touch ? 'タッチでもどる' : 'クリックでもどる';
	var textStyle = this.M.S.BaseTextStyle(50);
	var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY+180,baseText,textStyle);
	textSprite.setAnchor(.5);
	textSprite.hide();
	this.HUD.showToBack = function () {
		textSprite.show();
	};
};

BasicGame.Play.prototype.genOfferTextSprite = function () {
	if (this.GM.CharInfo.offer) {
		var baseText = '提供者様: ';
		var textStyle = this.M.S.BaseTextStyle(45);
		var textSprite = this.M.S.genText(10,this.world.height-10,baseText+this.GM.CharInfo.offer,textStyle);
		textSprite.setAnchor(0,1);
	}
};
