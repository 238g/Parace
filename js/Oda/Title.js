BasicGame.Title=function(){};
BasicGame.Title.prototype = {
	init: function(){
		this.inputEnabled=!1;
		this.GiantNobuhime=this.TitleSprite=this.StartBtnSprite=
		this.DialogTween=this.LangBtnSprite=this.SelectCharTextSprite=
		this.OdanobuTextSprite=this.NobuhimeTextSprite=null;
		this.curLang=this.M.getGlobal('curLang');
		if(this.curLang=='en'){
			this.StartText='START';
			this.LangText='日本語';
			this.SelectCharText='Select Character';
			this.OdanobuText='ODANOBU';
			this.NobuhimeText='NOBUHIME';
		}else{
			this.StartText='スタート';
			this.LangText='English';
			this.SelectCharText='キャラクター選択';
			this.OdanobuText='おだのぶ';
			this.NobuhimeText='織田信姫';
		}
	},
	create: function () {
		this.time.events.removeAll();
		this.stage.backgroundColor='#555555';
		this.M.SE.play('FireBGM',{volume:1,loop:!0});
		this.M.SE.playBGM('TitleBGM',{volume:1});
		this.add.sprite(0,0,'Temple');
		this.GiantNobuhime=this.add.tileSprite(0,0,this.world.width,this.world.height,'GiantNobuhime');
		this.GiantNobuhime.alpha=.5;
		var bgSprite=this.add.sprite(0,0);
		bgSprite.width=this.world.width;
		bgSprite.height=this.world.height;
		this.Fire=this.add.filter('Fire',bgSprite.width,bgSprite.height);
		this.Fire.alpha=0;
		bgSprite.filters=[this.Fire];
		this.Fire=this.Fire;
		this.BtnContainer();
		this.TitleSprite=this.add.sprite(this.world.centerX,this.world.centerY,'Title_'+this.curLang);
		this.TitleSprite.anchor.setTo(.5);
		this.M.T.beatA(this.TitleSprite,{delay:1000,duration:5000}).start();
		this.DialogContainer();
		this.time.events.add(500,function(){this.inputEnabled=!0;},this);
	},

	update:function(){
		this.Fire.update();
		this.GiantNobuhime.tilePosition.x-=this.time.physicsElapsedMS*.06;
	},

	BtnContainer: function () {
		this.StartBtnSprite=this.M.S.BasicGrayLabelM(this.world.centerX,this.world.height*.83,this.showCharSelecter,this.StartText,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		this.LangBtnSprite=this.M.S.BasicGrayLabelM(this.world.centerX,this.world.height*.93,this.changeLang,this.LangText,this.M.S.BaseTextStyleS(25),{tint:BasicGame.MAIN_TINT});
		this.genVolumeBtnSprite(this.world.width*.1,30);
		this.genFullScreenBtnSprite(this.world.width*.9,30);
	},

	showCharSelecter:function(){
		if (this.inputEnabled) {
			this.M.SE.play('OnBtn',{volume:1});
			// this.M.SE.playBGM('TitleBGM',{volume:1});
			this.StartBtnSprite.hide();
			this.DialogTween.start();
		}
	},

	changeLang:function(){
		this.M.SE.play('OnBtn',{volume:1});
		this.curLang=(this.curLang=='en')?'jp':'en';
		this.M.setGlobal('curLang',this.curLang)
		this.StartBtnSprite.children[0].changeText((this.curLang=='en')?'START':'スタート');
		this.LangBtnSprite.children[0].changeText((this.curLang=='en')?'日本語':'English');
		this.SelectCharTextSprite.changeText((this.curLang=='en')?'Select Character':'キャラクター選択');
		this.OdanobuTextSprite.changeText((this.curLang=='en')?'ODANOBU':'おだのぶ');
		this.NobuhimeTextSprite.changeText((this.curLang=='en')?'NOBUHIME':'織田信姫');
		this.TitleSprite.loadTexture('Title_'+this.curLang);
		// THIS IS TEST FOR TWITTER
		if(this.M.getGlobal('curLang')=='en'){
			var title='Odadadadadadadadadada';
			document.title=title;
			BasicGame.GAME_TITLE=title;
			document.getElementsByName('apple-mobile-web-app-title')[0].setAttribute('content',title);
			document.getElementsByName('og:url')[0].setAttribute('content','https://238g.github.io/Parace/Odadadadadadadadadada.html?lang=en');
			document.getElementsByName('og:title')[0].setAttribute('content',title);
			document.getElementsByName('og:description')[0].setAttribute('content',
				'Oda\'s doujin game! Overcome the prepared 50 levels of trials! Well, just stick the Oda Army!');
		}else{
			var title='織田だだだだだだだだ';
			document.title=title;
			BasicGame.GAME_TITLE=title;
			document.getElementsByName('apple-mobile-web-app-title')[0].setAttribute('content',title);
			document.getElementsByName('og:url')[0].setAttribute('content','https://238g.github.io/Parace/Odadadadadadadadadada.html');
			document.getElementsByName('og:title')[0].setAttribute('content',title);
			document.getElementsByName('og:description')[0].setAttribute('content',
				'織田信姫とおだのぶの二次創作ゲームです！用意された50レベルもの試練を乗り越えろ！さぁ、ひたすら織田軍を刺すのです！');
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
		var char,textSprite;
		char=this.add.button(0,-50,'OdanobuCircle_1',this.start,this);
		char.anchor.setTo(.5,1);
		char.name='Odanobu';
		textSprite=this.M.S.genTextM(0,-char.height-20,this.OdanobuText);
		this.OdanobuTextSprite=textSprite;
		char.addChild(textSprite);
		dialogSprite.addChild(char);
		this.SelectCharTextSprite=this.M.S.genTextM(0,0,this.SelectCharText);
		dialogSprite.addChild(this.SelectCharTextSprite);
		char=this.add.button(0,50,'NobuhimeCircle_1',this.start,this);
		char.anchor.setTo(.5,0);
		char.name='Nobuhime';
		textSprite=this.M.S.genTextM(0,char.height+25,this.NobuhimeText);
		this.NobuhimeTextSprite=textSprite;
		char.addChild(textSprite);
		dialogSprite.addChild(char);
	},

	start: function (btn) {
		this.M.SE.play('OnBtn2',{volume:1});
		this.M.setGlobal('curChar',btn.name);
		this.M.NextScene('Play');
	},
};
