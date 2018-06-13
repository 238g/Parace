BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
		this.Dialog = {};
		this.time.events.removeAll();
	},

	create: function () {
		this.BgContainer();
		this.BtnContainer();
		this.DialogContainer();
		this.soundController();
		this.inputController();
	},

	inputController: function () {
		this.time.events.add(500, function () {
			this.inputEnabled = true; 
		}, this);
	},

	soundController: function () {
		var s = this.M.SE;
		s.stop('currentBGM');
		s.play('TitleBGM',{isBGM:true,loop:true,volume:1});
		this.time.events.add(500, function () {
			if (s.isPlaying('TitleBGM')) return;
			s.stop('currentBGM');
			s.play('TitleBGM',{isBGM:true,loop:true,volume:1});
		});
	},

	BgContainer: function () {
		this.stage.backgroundColor = this.M.getConst('WHITE_COLOR');
		this.genBgCharSprite();
		this.genTitleTextSprite();
	},

	genBgCharSprite: function () {
		var bgGroup = this.add.group();
		var x = this.world.centerX+150;
		var y = this.world.centerY-140;
		for (var i=1;i<=this.M.getConst('ALBUM_COUNT');i++) {
			var sprite = this.add.sprite(x,y,'Album_'+i);
			sprite.anchor.setTo(.5);
			sprite.alpha = 0;
			bgGroup.add(sprite);
		}
		bgGroup.shuffle();
		this.M.T.slideshow(bgGroup,{duration:2000,delay:2000});
	},

	genTitleTextSprite: function () {
		var textSprite = this.M.S.genText(
			this.world.centerX*.42,this.world.centerY-100,
			this.M.getConst('GAME_TITLE'),this.BaseTextStyle(80));
		textSprite.addTween('beatA',{duration:508});
		textSprite.startTween('beatA');
	},

	BtnContainer: function () {
		var textStyle = this.BaseTextStyle(50);
		var x = this.world.centerX;
		var lineY_1 = this.world.centerY+200;
		var lineY_2 = lineY_1+150;
		var tint = this.M.getConst('MAIN_TINT');
		this.genStartBtnSprite(x*.4,lineY_1,textStyle,tint);
		this.genMuteBtnSprite(x,lineY_1,textStyle,tint);
		this.genFullScreenBtnSprite(x*1.6,lineY_1,textStyle,tint);
		this.genOtherGameBtnSprite(x*.4,lineY_2,textStyle,tint);
		this.genHowtoBtnSprite(x,lineY_2,textStyle,tint);
		this.genLogoBtnSprite(x*1.6,lineY_2);
	},

	genStartBtnSprite: function (x,y,textStyle,tint) {
		var text = 'スタート';
		this.M.S.BasicGrayLabel(x,y,function () {
			if (this.inputEnabled) {
				this.M.NextScene('Play');
				this.M.SE.play('Start',{volume:1});
			}
		},text,textStyle,{tint:tint});
	},

	genMuteBtnSprite: function (x,y,textStyle,tint) {
		var offText = 'ミュートOFF';
		var onText = 'ミュートON';
		var text = this.sound.mute ? offText : onText;
		var label = this.M.S.BasicGrayLabel(x,y,function (pointer) {
			if (this.sound.mute) {
				pointer.textSprite.changeText(onText);
				this.sound.mute = false;
			} else {
				pointer.textSprite.changeText(offText);
				this.sound.mute = true;
			}
		},text,textStyle,{tint:tint});
	},

	genFullScreenBtnSprite: function (x,y,textStyle,tint) {
		var offText = 'フルスクリーンOFF';
		var onText = 'フルスクリーンON';
		var text = this.scale.isFullScreen ? offText : onText;
		var label = this.M.S.BasicGrayLabel(x,y,function (pointer) {
			if (this.scale.isFullScreen) {
				pointer.textSprite.changeText(onText);
				this.scale.stopFullScreen(false);
			} else {
				pointer.textSprite.changeText(offText);
				this.scale.startFullScreen(false);
			}
		},text,textStyle,{tint:tint});
	},

	genOtherGameBtnSprite: function (x,y,textStyle,tint) {
		var text = '他のゲームを遊ぶ';
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			var url = 'https://238g.github.io/Parace/238Games.html';
			if (this.game.device.desktop) {
				window.open(url,'_blank');
			} else {
				location.href = url;
			}
		},text,textStyle,{tint:tint});
	},

	genHowtoBtnSprite: function (x,y,textStyle,tint) {
		var text = '遊び方';
		this.M.S.BasicGrayLabel(x,y,function () {
			this.M.SE.play('OpenSE',{volume:1});
			this.Dialog.bringToTop();
			this.Dialog.tweenShow();
		},text,textStyle,{tint:tint});
	},

	genLogoBtnSprite: function (x,y) {
		var logoSprite = this.M.S.genButton(x,y,'Logo',function(){
			if (this.game.device.desktop) {
				window.open(this.M.getConst('YOUTUBE_URL'),'_blank');
			} else {
				location.href = this.M.getConst('YOUTUBE_URL');
			}
		});
		logoSprite.anchor.setTo(.5);
		this.M.T.beatA(logoSprite,{duration:508}).start();
		var logoBgSprite = this.M.S.genBmpSprite(x,y,
			logoSprite.width+50,logoSprite.height+20,this.M.getConst('MAIN_COLOR'));
		logoBgSprite.anchor.setTo(.5);
		this.world.bringToTop(logoSprite);
	},

	DialogContainer: function () {
		this.genDialogSprite();
		this.genDialogCharSprite();
		this.genHowtoTextSprite();
	},

	genDialogSprite: function () {
		this.Dialog = this.M.S.genDialog('Dialog',{});
		this.Dialog.UonInputDown(function (sprite) {
			sprite.scale.setTo(0);
		});
	},

	genDialogCharSprite: function () {
		var charSprite = this.add.sprite(-600,0,'OhepanOrigin');
		charSprite.scale.setTo(2);
		this.Dialog.addChild(charSprite);
	},

	genHowtoTextSprite: function () {
		var text = ''
			+'シューティングゲームまろ～\n'
			+'まろとおへねこは頼りになる仲間まろ～\n'
			+'左下はパワー・右下はHPまろ！\n'
			+'どこまで行けるか挑戦してみるまろ～';
		var textSprite = this.M.S.genText(0,0,text,this.BaseTextStyle(40));
		this.Dialog.addChild(textSprite.multipleTextSprite);
		this.Dialog.addChild(textSprite);
	},

	BaseTextStyle: function (fontSize) {
		return {
			fontSize: fontSize||50,
			fill: this.M.getConst('MAIN_TEXT_COLOR'),
			stroke: this.M.getConst('WHITE_COLOR'),
			strokeThickness: 15,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 10,
		};
	},
};
