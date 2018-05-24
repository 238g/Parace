BasicGame.Play.prototype.BtnContainer = function () {
	this.Btns = this.add.group();
	var arrowCenterX=50;
	var arrowCenterY=200;
	var margin=50;
	this.genGamePadBtnSprite(arrowCenterX-margin,arrowCenterY,'arrowLeft');
	this.genGamePadBtnSprite(arrowCenterX,arrowCenterY+margin,'arrowDown');
	this.genGamePadBtnSprite(arrowCenterX,arrowCenterY-margin,'arrowUp');
	this.genGamePadBtnSprite(arrowCenterX+margin,arrowCenterY,'arrowRight');
	this.genGamePadBtnSprite(530,200,'buttonA');
	this.genGamePadBtnSprite(470,250,'buttonB');
	// var a = ['arrowLeft','arrowDown','arrowUp','arrowRight','buttonA','buttonB'];
};

BasicGame.Play.prototype.genGamePadBtnSprite = function (x,y,frame) {
	// var btnSprite = this.add.button(x,y,'GameIconsWhite');
	var btnSprite = this.add.button(x,y,'GameIconsWhite',this.onInputUpGamePad,this,frame,frame,frame,frame);
	// btnSprite.setFrames(frame,frame,frame,frame);
	btnSprite.tint=0x0000f0;
	btnSprite.scale.setTo(.8);
	btnSprite.onInputDown.add(this.onInputDownGamePad,this);
	btnSprite.onInputOut.add(this.onInputOutGamePad,this);
	this.Btns.add(btnSprite);
};

BasicGame.Play.prototype.onInputUpGamePad = function (b) {
	if (b.alpha==.5) {
		b.alpha = 1;
		console.log(b.frameName); // TODO del
		if (this.curSimonFrame==b.frameName) {
			// TODO correct
		} else {
			// TODO incorrect
		}
	}
};

BasicGame.Play.prototype.onInputDownGamePad = function (b) {
	b.alpha = .5;
};

BasicGame.Play.prototype.onInputOutGamePad = function (b) {
	b.alpha = 1;
};
