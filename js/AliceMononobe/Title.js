BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
		this.time.events.removeAll();
	},

	create: function () {
		this.BgContainer();
		this.BtnContainer();
		this.soundController();
		this.inputController();
	},

	inputController: function () {
		this.time.events.add(800, function () {
			this.inputEnabled = true; 
		}, this);
	},

	soundController: function () {
		var s = this.M.SE;
		s.stop('currentBGM');
		this.time.events.add(500, function () {
			s.stop('currentBGM');
			s.play('TitleBGM',{isBGM:true,loop:true,volume:1});
		}, this);
		this.time.events.add(1200, function () {
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
		this.add.sprite(this.world.centerX,this.world.centerY,'TopBg').anchor.setTo(.5);
		this.add.sprite(this.world.centerX,this.world.centerY,'Alice_1').anchor.setTo(.5);
	},

	genTitleTextSprite: function () {
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 80;
		var textSprite = this.M.S.genText(
			this.world.centerX,130,
			this.M.getConst('GAME_TITLE'),textStyle);
		textSprite.addTween('beatA',{duration:508});
		textSprite.startTween('beatA');
	},

	BtnContainer: function () {
		var textStyle = this.StaticBaseTextStyle();
		var x = this.world.width/4;
		var y = this.world.centerY+400;
		var margin = 150;
		var tint = this.M.getConst('MAIN_TINT');
		this.genStartBtnSprite(x,y,textStyle,tint);
		this.genMuteBtnSprite(x*3,y,textStyle,tint);
		this.genFullScreenBtnSprite(x*3,y+margin,textStyle,tint);
		this.genOtherGameBtnSprite(x,y+margin,textStyle,tint);
		this.genLogoBtnSprite();
	},

	genStartBtnSprite: function (x,y,textStyle,tint) {
		var text = 'スタート';
		this.M.S.BasicGrayLabel(x,y,function () {
			if (this.inputEnabled) this.M.NextScene('Play');
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

	genLogoBtnSprite: function () {
		var logoSprite = this.M.S.genButton(this.world.centerX,this.world.height-25,'Logo',function(){
			if (this.game.device.desktop) {
				window.open(this.M.getConst('YOUTUBE_URL'),'_blank');
			} else {
				location.href = this.M.getConst('YOUTUBE_URL');
			}
		});
		logoSprite.anchor.setTo(.5,1);
		this.M.T.beatA(logoSprite,{duration:508}).start();
		var logoBgSprite = this.M.S.genBmpSprite(
			this.world.centerX,this.world.height-5,
			logoSprite.width+80,logoSprite.height+50,this.M.getConst('MAIN_COLOR'));
		logoBgSprite.anchor.setTo(.5,1);
		this.world.bringToTop(logoSprite);
	},

	StaticBaseTextStyle: function () {
		return {
			fill: this.M.getConst('MAIN_TEXT_COLOR'),
			stroke: this.M.getConst('WHITE_COLOR'),
			strokeThickness: 15,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 10,
		};
	},
};
