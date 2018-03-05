SpriteManager = function (self) { this.constructor(self); };
SpriteManager.prototype = {
	self: null,
	constructor: function (self) {
		this.self = self;
	},
	genSprite: function (x, y, key, frame) {
		var sprite = this.self.add.sprite(x, y, key, (frame||null));
		sprite.show = function () { sprite.visible = true; };
		sprite.hide = function () { sprite.visible = false; };
		return sprite;
	},
	genButton: function (x, y, key, func, _self) {
		_self = _self || this.self;
		var btnSprite = _self.add.button(x, y, key, func, _self);
		btnSprite.show = function () { btnSprite.visible = true; };
		btnSprite.hide = function () { btnSprite.visible = false; };
		btnSprite.over = function (func, self) {
			self = self || _self;
			btnSprite.onInputOver.add(func, self);
		};
		btnSprite.out = function (func, self) {
			self = self || _self;
			btnSprite.onInputOut.add(func, self);
		};
		btnSprite.up = function (func, self) {
			self = self || _self;
			btnSprite.onInputUp.add(func, self);
		};
		return btnSprite;
	},
	genText: function (x, y, text, textStyle) {
		var _self = this.self;
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
			if (multipleTextSprite.text || multipleTextSprite.text === '') {
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
				if (multipleTextSprite[key]) {
					multipleTextSprite[key] = newTextStyle[key]
				}
			}
		};
		textSprite.addGroup = function (group) {
			group.add(multipleTextSprite);
			group.add(textSprite);
		};
		textSprite.onInputOver = function (func, self) {
			textSprite.inputEnabled = true;
			textSprite.events.onInputOver.add(func, (self || _self));
		};
		textSprite.onInputOut = function (func, self) {
			textSprite.inputEnabled = true;
			textSprite.events.onInputOut.add(func, (self || _self));
		};
		textSprite.onInputDown = function (func, self) {
			textSprite.inputEnabled = true;
			textSprite.events.onInputDown.add(func, (self || _self));
		};
		textSprite.onInputUp = function (func, self) {
			textSprite.inputEnabled = true;
			textSprite.events.onInputUp.add(func, (self || _self));
		};
		return textSprite;
	},
};