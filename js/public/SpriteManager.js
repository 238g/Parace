SpriteManager = function (self) { this.constructor(self); };
SpriteManager.prototype = {
	self: null,
	constructor: function (self) {
		this.self = self;
	},
	genSprite: function (x, y, key) {
		var sprite = this.self.add.sprite(x, y, key);
		sprite.show = function () { sprite.visible = true; };
		sprite.hide = function () { sprite.visible = false; };
		return sprite;
	},
	genText: function (x, y, text, textStyle) {
		var commonTextStyle = { 
			fontSize: '50px', 
			fill: '#FFFFFF', 
			align: 'center', 
			stroke: '#000000', 
			strokeThickness: 10, 
			multipleStroke: null,
			multipleStrokeThickness: 10,
		};
		for (var key in textStyle) {
			commonTextStyle[key] = textStyle[key];
		}
		var multipleTextSprite = {};
		if (commonTextStyle.multipleStroke) {
			var multipleTextStyle = {
				fontSize: commonTextStyle.fontSize,
				fill: commonTextStyle.multipleStroke,
				align: 'center',
				stroke: commonTextStyle.multipleStroke,
				strokeThickness: commonTextStyle.strokeThickness+commonTextStyle.multipleStrokeThickness,
			};
			multipleTextSprite = this.self.add.text(x, y, text, multipleTextStyle);
			multipleTextSprite.anchor.setTo(.5);
		}
		var textSprite = this.self.add.text(x, y, text, commonTextStyle);
		textSprite.anchor.setTo(.5);
		textSprite.multipleTextSprite = multipleTextSprite;
		textSprite.show = function () {
			textSprite.visible = true;
			multipleTextSprite.visible = true;
		};
		textSprite.hide = function () {
			textSprite.visible = false;
			multipleTextSprite.visible = false;
		};
		textSprite.changeText = function (text) {
			textSprite.setText(text);
			if (multipleTextSprite) {
				multipleTextSprite.setText(text);
			}
		};
		textSprite.move = function (x, y) {
			textSprite.x = x;
			textSprite.y = y;
			multipleTextSprite.x = x;
			multipleTextSprite.y = y;
		};
		textSprite.setTextStyle = function (newTextStyle) {
			for (var key in newTextStyle) {
				if (textSprite[key]) {
					textSprite[key] = newTextStyle[key];
				}
				if (multipleTextSprite && multipleTextSprite[key]) {
					multipleTextSprite[key] = newTextStyle[key]
				}
			}
		};
		return textSprite;
	},
};