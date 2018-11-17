BasicGame.Title=function(){};
BasicGame.Title.prototype={
	init: function(){
		this.inputEnabled=!1;
		this.time.events.removeAll();
	},
	create: function(){
		this.stage.backgroundColor=this.M.getConst('WHITE_COLOR');
		this.genBgCharSprite();
		this.genTitleTextSprite();
		this.BtnContainer();
		this.soundController();
		this.time.events.add(500,function(){
			this.inputEnabled=!0; 
		},this);
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

	genBgCharSprite: function () {
		this.add.sprite(this.world.centerX,this.world.centerY,'TopBg').anchor.setTo(.5);
		this.add.sprite(this.world.centerX,this.world.centerY,'Alice_1').anchor.setTo(.5);
	},

	genTitleTextSprite: function () {
		var textStyle = this.StaticBaseTextStyle();
		textStyle.fontSize = 40;
		var textSprite = this.M.S.genText(
			this.world.centerX,this.world.height*.1,
			this.M.getConst('GAME_TITLE'),textStyle);
		textSprite.addTween('beatA',{duration:508});
		textSprite.startTween('beatA');
	},
	BtnContainer:function(){
		var textStyle=this.StaticBaseTextStyle();
		var x=this.world.width/4;
		var y=this.world.height*.7;
		var mY=this.world.height*.1;
		var tint=this.M.getConst('MAIN_TINT');
		this.M.S.BasicGrayLabelM(x,y,function(){if(this.inputEnabled)this.M.NextScene('Play')},'スタート',textStyle,{tint:tint});
		this.genMuteBtnSprite(x*3,y,textStyle,tint);
		this.genFullScreenBtnSprite(x*3,y+mY,textStyle,tint);
		this.genOtherGameBtnSprite(x,y+mY,textStyle,tint);
		this.genLogoBtnSprite();
	},
	genMuteBtnSprite: function (x,y,textStyle,tint) {
		var offText='ミュートOFF';
		var onText='ミュートON';
		var text=this.sound.mute?offText:onText;
		this.M.S.BasicGrayLabelM(x,y,function(btn){
			if(this.sound.mute){
				btn.children[0].changeText(onText);
				this.sound.mute=!1;
			} else {
				btn.children[0].changeText(offText);
				this.sound.mute=!0;
			}
		},text,textStyle,{tint:tint});
	},
	genFullScreenBtnSprite:function(x,y,textStyle,tint){
		var offText='フルスクリーンOFF';
		var onText='フルスクリーンON';
		var text=this.scale.isFullScreen?offText:onText;
		this.M.S.BasicGrayLabelM(x,y,function(btn) {
			if (this.scale.isFullScreen) {
				btn.children[0].changeText(onText);
				this.scale.stopFullScreen(!1);
			} else {
				btn.children[0].changeText(offText);
				this.scale.startFullScreen(!1);
			}
		},text,textStyle,{tint:tint});
	},
	genOtherGameBtnSprite:function(x,y,textStyle,tint){
		this.M.S.BasicGrayLabelM(x,y,function(){
			var u='https://238g.github.io/Parace/238Games2.html';
			if(this.game.device.desktop){
				window.open(u,'_blank');
			}else{
				location.href=u;
			}
		},'他のゲームを遊ぶ',textStyle,{tint:tint});
	},
	genLogoBtnSprite: function () {
		var h=this.world.height*.92;
		var s = this.M.S.genButton(this.world.centerX,h,'Logo',function(){
			if (this.game.device.desktop) {
				window.open(this.M.getConst('YOUTUBE_URL'),'_blank');
			} else {
				location.href = this.M.getConst('YOUTUBE_URL');
			}
		});
		s.anchor.setTo(.5);
		this.M.T.beatA(s,{duration:508}).start();
		var logoBgSprite = this.M.S.genBmpSprite(this.world.centerX,h,s.width*1.2,s.height*1.3,this.M.getConst('MAIN_COLOR'));
		logoBgSprite.anchor.setTo(.5);
		this.world.bringToTop(s);
	},
	StaticBaseTextStyle:function(){
		return {
			fill: this.M.getConst('MAIN_TEXT_COLOR'),
			stroke: this.M.getConst('WHITE_COLOR'),
			strokeThickness: 8,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 5,
			fontSize: 20,
		};
	},
};
