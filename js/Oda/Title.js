BasicGame.Title=function(){};
BasicGame.Title.prototype = {
	init: function(){
		this.inputEnabled=!1;
		this.StartBtnSprite=this.DialogTween=this.LangBtnSprite=this.SelectCharTextSprite=null;
		this.curLang=this.M.getGlobal('curLang');
		this.StartText=(this.curLang=='en')?'START':'スタート';
		this.LangText=(this.curLang=='en')?'日本語':'English';
		this.SelectCharText=(this.curLang=='en')?'Select Character':'キャラクター選択';
	},
	create: function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		// this.M.SE.playBGM('TitleBGM',{volume:1});
		this.BtnContainer();
		this.DialogContainer();
		this.time.events.add(500,function(){this.inputEnabled=!0;},this);
	},

	BtnContainer: function () {
		this.StartBtnSprite=this.M.S.BasicGrayLabelM(this.world.centerX,this.world.height*.75,this.showCharSelecter,this.StartText,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		this.LangBtnSprite=this.M.S.BasicGrayLabelM(this.world.centerX,this.world.height*.85,this.changeLang,this.LangText,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		this.genVolumeBtnSprite(this.world.width*.1,30);
		this.genFullScreenBtnSprite(this.world.width*.9,30);
	},

	showCharSelecter:function(){
		if (this.inputEnabled) {
			// this.M.SE.play('OnBtn',{volume:1}); // TODO
			// this.M.SE.playBGM('TitleBGM',{volume:1});
			this.StartBtnSprite.hide();
			this.DialogTween.start();
		}
	},

	changeLang:function(){
		this.curLang=(this.curLang=='en')?'jp':'en';
		this.M.setGlobal('curLang',this.curLang)
		this.StartBtnSprite.children[0].changeText((this.curLang=='en')?'START':'スタート');
		this.LangBtnSprite.children[0].changeText((this.curLang=='en')?'日本語':'English');
		this.SelectCharTextSprite.changeText((this.curLang=='en')?'Select Character':'キャラクター選択');
		// THIS IS TEST FOR TWITTER
		if(this.M.getGlobal('curLang')=='en'){
			var title='Odadadadadadadadadada';
			document.title=title;
			BasicGame.GAME_TITLE=title;
			document.getElementsByName('apple-mobile-web-app-title')[0].setAttribute('content',title);
			document.getElementsByName('og:url')[0].setAttribute('content','https://238g.github.io/Parace/Odadadadadadadadadada.html?lang=en');
			document.getElementsByName('og:title')[0].setAttribute('content',title);
			document.getElementsByName('og:description')[0].setAttribute('content',
				'' // TODO description
			);
		}else{
			// TODO japanese
			var title='Odadadadadadadadadada';
			document.title=title;
			BasicGame.GAME_TITLE=title;
			document.getElementsByName('apple-mobile-web-app-title')[0].setAttribute('content',title);
			document.getElementsByName('og:url')[0].setAttribute('content','https://238g.github.io/Parace/Odadadadadadadadadada.html');
			document.getElementsByName('og:title')[0].setAttribute('content',title);
			document.getElementsByName('og:description')[0].setAttribute('content',
				'' // TODO description
			);
		}
	},

	genVolumeBtnSprite: function (x,y) {
		var volumeSprite=this.M.S.genSprite(x,y,'VolumeIcon',this.sound.mute?BasicGame.VOLUME_MUTE_IMG:(this.sound.volume==1)?BasicGame.VOLUME_MAX_IMG:BasicGame.VOLUME_HALF_IMG);
		volumeSprite.anchor.setTo(.5);
		volumeSprite.scale.setTo(.5);
		volumeSprite.UonInputDown(this.onDownVolumeBtn);
	},

	onDownVolumeBtn: function (sprite) {
		if (this.sound.mute) {
			sprite.frameName = BasicGame.VOLUME_MAX_IMG;
			this.sound.mute = false;
			this.sound.volume = 1;
		} else {
			if (this.sound.volume == 1) {
				sprite.frameName = BasicGame.VOLUME_HALF_IMG;
				this.sound.volume = .5;
			} else {
				sprite.frameName = BasicGame.VOLUME_MUTE_IMG;
				this.sound.volume = 0;
				this.sound.mute = true;
			}
		}
	},

	genFullScreenBtnSprite: function (x,y) {
		var curImg=this.scale.isFullScreen?BasicGame.FULL_SCREEN_OFF_IMG:BasicGame.FULL_SCREEN_ON_IMG;
		var fullScreenSprite = this.M.S.genButton(x,y,'GameIconsWhite',this.onDonwFullScreenBtn,this);
		fullScreenSprite.tint=0x000000;
		fullScreenSprite.setFrames(curImg,curImg,curImg,curImg);
		fullScreenSprite.anchor.setTo(.5);
		fullScreenSprite.scale.setTo(.5);
	},

	onDonwFullScreenBtn: function (sprite) {
		if (this.scale.isFullScreen) {
			var curImg = BasicGame.FULL_SCREEN_ON_IMG;
			this.scale.stopFullScreen(false);
		} else {
			var curImg = BasicGame.FULL_SCREEN_OFF_IMG;
			this.scale.startFullScreen(false);
		}
		sprite.setFrames(curImg,curImg,curImg,curImg);
	},

	DialogContainer:function(){
		var dialogSprite=this.add.sprite(this.world.width*1.5,this.world.centerY,'TWP');
		dialogSprite.anchor.setTo(.5);
		dialogSprite.tint = 0x000000;
		this.DialogTween=this.M.T.moveD(dialogSprite,{xy:{x:this.world.centerX},duration:1000});

		// TODO change img
		var char1=this.add.button(0,-50,'OdanobuCircle_1',this.start,this);
		char1.anchor.setTo(.5,1);
		char1.name='Odanobu';
		dialogSprite.addChild(char1);

		this.SelectCharTextSprite=this.M.S.genTextM(0,0,this.SelectCharText);
		dialogSprite.addChild(this.SelectCharTextSprite);

		var char2=this.add.button(0,50,'NobuhimeCircle_1',this.start,this);
		char2.anchor.setTo(.5,0);
		char2.name='Nobuhime';
		dialogSprite.addChild(char2);
	},

	start: function (btn) {
		// this.M.SE.play('OnBtn',{volume:1}); // TODO
		this.M.setGlobal('curChar',btn.name);
		this.M.NextScene('Play');
	},
};
