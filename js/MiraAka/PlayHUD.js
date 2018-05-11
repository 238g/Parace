BasicGame.Play.prototype.HUDContainer = function () {
	var textStyle = this.M.S.BaseTextStyleS(25);
	this.genQuestionCountTextSprite(80,50,textStyle);
	this.genCorrectCountTextSprite(this.world.centerX,50,textStyle);
	this.genWrongCountTextSprite(this.world.width-80,50,textStyle);
	this.genHowtoTextSprite(this.world.centerX,this.world.centerY*1.55,textStyle);
};

BasicGame.Play.prototype.genQuestionCountTextSprite = function (x,y,textStyle) {
	this.QuestionCountTextSprite = this.M.S.genText(x,y,this.QUESTION_COUNT_BASE_TEXT+this.curQuestionCount,textStyle);
};

BasicGame.Play.prototype.setQuestionCount = function (val) {
	this.QuestionCountTextSprite.changeText(this.QUESTION_COUNT_BASE_TEXT+val);
};

BasicGame.Play.prototype.genCorrectCountTextSprite = function (x,y,textStyle) {
	this.CorrectCountTextSprite = this.M.S.genText(x,y,this.CORRECT_COUNT_BASE_TEXT+this.curCorrectCount,textStyle);
};

BasicGame.Play.prototype.setCorrectCountText = function (val) {
	this.CorrectCountTextSprite.changeText(this.CORRECT_COUNT_BASE_TEXT+val);
};

BasicGame.Play.prototype.genWrongCountTextSprite = function (x,y,textStyle) {
	this.WrongCountTextSprite = this.M.S.genText(x,y,this.WRONG_COUNT_BASE_TEXT+this.curWrongCount,textStyle);
};

BasicGame.Play.prototype.setWrongCountText = function (val) {
	this.WrongCountTextSprite.changeText(this.WRONG_COUNT_BASE_TEXT+val);
};

BasicGame.Play.prototype.genHowtoTextSprite = function (x,y,textStyle) {
	this.HowtoTextSprite = this.M.S.genText(x,y,'罰ゲームを4種類\n用意してからやると良いかも！',textStyle);
};
