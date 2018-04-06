BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.GC = null;
		this.SlidePanels = null;
		this.SlideImgs = null;
		this.SlideTitleTexts = null;
		// this.ListPanels = null; // TODO
	},

	create: function () {
		this.GC = this.GameController();
		this.PanelContainer();
		this.inputController();
		this.BtnContainer();
		this.start();
	},

	GameController: function () {
		var GamesInfo = this.M.getConf('GamesInfo');
		return {
			inputEnabled: false,
			inputOnDownPosX: 0,
			currentSlideCenter: 0,
			currentUrl: null,
		    GamesInfo: GamesInfo,
		    GamesInfoLength: Object.keys(GamesInfo).length,
			DISABLE_INPUT_WORLD_MARGIN: 100,
			SLIDE_TOUCH_SENSITIVITY: 100,
			SLIDE_SMALL_PANEL_SCALE: {x:.2,y:.8},
			SLIDE_LARGE_PANEL_SCALE: {x:6,y:10},
			SLIDE_TWEEN_DURATION: 600,
			SLIDE_TWEEN_MOVE_LEFT_DISTANCE: '-'+(this.world.centerX-50),
			SLIDE_TWEEN_MOVE_RIGHT_DISTANCE: '+'+(this.world.centerX-50),
			tweenForChecking: null,
		};
	},

	PanelContainer: function () {
		this.SlidePanels = this.add.group();
		this.SlideImgs = this.add.group();
		this.SlideTitleTexts = this.add.group();
		// this.ListPanels = this.add.group(); // TODO
		var GamesInfo = this.GC.GamesInfo;
		var orderGamesInfo = [];
		for (var id in GamesInfo) {
			var order = GamesInfo[id].order;
			orderGamesInfo[order] = GamesInfo[id];
		}
		for (var key in orderGamesInfo) {
			var gameInfo = orderGamesInfo[key];
			this.genSlidePanel(gameInfo);
			this.genSlideImg(gameInfo.slideImg);
			this.genSlideTitle(gameInfo.title);
		}
		this.initSlidePanel();
	},

	genSlidePanel: function (gameInfo) {
		var scaleX = this.GC.SLIDE_SMALL_PANEL_SCALE.x;
		var scaleY = this.GC.SLIDE_SMALL_PANEL_SCALE.y;
		var panelSprite = this.M.S.genSprite(this.world.width-50,this.world.centerY-100,'greySheet','grey_panel');
		panelSprite.anchor.setTo(.5);
		panelSprite.scale.setTo(scaleX,scaleY);
		panelSprite.id = gameInfo.id;
		// TODO tint gameInfo
		this.SlidePanels.add(panelSprite);
	},

	genSlideImg: function (img) {
		var imgSprite = this.M.S.genSprite(this.world.centerX,this.world.centerY-100,img);
		imgSprite.anchor.setTo(.5);
		imgSprite.hide();
		this.SlideImgs.add(imgSprite);
	},

	genSlideTitle: function (text) {
		var textStyle = {};
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY/2,text,textStyle);
		textSprite.hide();
		textSprite.addGroup(this.SlideTitleTexts);
		// TODO textStyle?textColor?
	},

	initSlidePanel: function () {
		var SLPS = this.GC.SLIDE_LARGE_PANEL_SCALE;
		var centerPanel = this.SlidePanels.children[0];
		centerPanel.scale.setTo(SLPS.x,SLPS.y);
		centerPanel.x = this.world.centerX;
		var imgSprite = this.SlideImgs.children[0];
		imgSprite.show();
		var textSprite = this.SlideTitleTexts.children[0];
		textSprite.show();
		this.GC.currentUrl = this.GC.GamesInfo[centerPanel.id].url;
	},

	inputController: function () {
		var GC = this.GC;
		var DIWM = GC.DISABLE_INPUT_WORLD_MARGIN;
		var STS = GC.SLIDE_TOUCH_SENSITIVITY;
		this.game.input.onDown.add(function (pointer/*,event*/) {
			GC.inputOnDownPosX = pointer.x;
		},this);
		this.game.input.onUp.add(function (pointer/*,event*/) {
			if (!this.SlidePanels.visible) return;
			if (pointer.y<DIWM || pointer.y>this.world.height-DIWM 
			|| pointer.x<DIWM || pointer.x>this.world.width-DIWM) return;
			if (GC.tweenForChecking&&GC.tweenForChecking.isRunning) return;
			if (pointer.x+STS<GC.inputOnDownPosX) this.leftSlide();
			if (pointer.x-STS>GC.inputOnDownPosX) this.rightSlide();
		}, this);
		if (!this.game.device.desktop) return;
		for (var i=0;i<2;i++) {
			var key=null;
			var func=null;
			switch (i) {
				case 0: key=Phaser.Keyboard.LEFT;func=this.rightSlide; break;
				case 1: key=Phaser.Keyboard.RIGHT;func=this.leftSlide; break;
			}
			var keyboard = this.input.keyboard.addKey(key);
			keyboard.onDown.add(func, this);
		}
	},

	leftSlide: function () {
		var GC = this.GC;
		if (GC.currentSlideCenter==GC.GamesInfoLength-1) return; 
		if (GC.tweenForChecking&&GC.tweenForChecking.isRunning) return;
		var centerSprite = this.SlidePanels.children[GC.currentSlideCenter];
		var rightSprite = this.SlidePanels.children[GC.currentSlideCenter+1];
		this.slideStart();
		this.leftSlideTween(centerSprite,rightSprite);
		GC.currentSlideCenter++;
	},

	leftSlideTween: function (centerSprite,rightSprite) {
		this.slideTween(
			centerSprite,rightSprite,
			this.GC.SLIDE_TWEEN_MOVE_LEFT_DISTANCE);
	},

	rightSlide: function () {
		var GC = this.GC;
		if (GC.currentSlideCenter==0) return;
		if (GC.tweenForChecking&&GC.tweenForChecking.isRunning) return;
		var centerSprite = this.SlidePanels.children[GC.currentSlideCenter];
		var leftSprite = this.SlidePanels.children[GC.currentSlideCenter-1];
		this.slideStart();
		this.rightSlideTween(centerSprite,leftSprite);
		GC.currentSlideCenter--;
	},

	rightSlideTween: function (centerSprite,leftSprite) {
		this.slideTween(
			centerSprite,leftSprite,
			this.GC.SLIDE_TWEEN_MOVE_RIGHT_DISTANCE);
	},

	slideTween: function (fromCenterSprite,toCenterSprite,moving) {
		var duration = this.GC.SLIDE_TWEEN_DURATION;
		var SSPC = this.GC.SLIDE_SMALL_PANEL_SCALE;
		var SLPS = this.GC.SLIDE_LARGE_PANEL_SCALE;
		this.GC.tweenForChecking = this.M.T.moveX(fromCenterSprite,{
			xy:{x:moving},
			easing:Phaser.Easing.Quartic.InOut,
			duration: duration,
		});
		this.GC.tweenForChecking.start();
		this.M.T.popUpX(fromCenterSprite,{
			scale:{x:SSPC.x,y:SSPC.y},
			easing:Phaser.Easing.Quartic.In,
			duration: duration,
		}).start();
		this.M.T.moveX(toCenterSprite,{
			xy:{x:moving},
			easing:Phaser.Easing.Quartic.InOut,
			duration: duration,
		}).start();
		this.M.T.popUpX(toCenterSprite,{
			scale:{x:SLPS.x,y:SLPS.y},
			easing:Phaser.Easing.Back.Out,
			duration: duration,
		}).start();
		this.M.T.onComplete(this.GC.tweenForChecking,this.slideTweenComp);
	},

	slideTweenComp: function (/*sprite,tween*/) {
		var currentSC = this.GC.currentSlideCenter;
		var imgSprite = this.SlideImgs.children[currentSC];
		imgSprite.show();
		var textSprite = this.SlideTitleTexts.children[currentSC];
		textSprite.show();
		var centerPanel = this.SlidePanels.children[this.GC.currentSlideCenter];
		this.GC.currentUrl = this.GC.GamesInfo[centerPanel.id].url;
		this.GC.inputEnabled = true;
	},

	slideStart: function () {
		this.GC.inputEnabled = false;
		this.hideCenterContents();
	},

	hideCenterContents: function () {
		var currentSC = this.GC.currentSlideCenter;
		var imgSprite = this.SlideImgs.children[currentSC];
		imgSprite.hide();
		var textSprite = this.SlideTitleTexts.children[currentSC];
		textSprite.hide();
	},

	BtnContainer: function () {
		var textStyle = {};
		var y = this.world.height-100;
		var leftBtn = this.M.S.BasicGrayLabel(130,y,this.rightSlide,'←',textStyle);
		leftBtn.setScale(1,2.2);
		var rightBtn = this.M.S.BasicGrayLabel(this.world.width-130,y,this.leftSlide,'→',textStyle);
		rightBtn.setScale(1,2.2);
		this.M.S.BasicGrayLabel(this.world.centerX,y,function () {
			if (this.GC.inputEnabled) console.log(this.GC.currentUrl);
		}, 'スタート', textStyle);
	},

	start: function () {
		this.GC.inputEnabled = true;
	},
};
