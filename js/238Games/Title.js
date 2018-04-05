BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.GC = null;
		this.Games = null;
		this.SlidePanels = null;
		this.SlideImgs = null;
		this.SlideTexts = null;
		// this.ListPanels = null; // TODO
	},

	create: function () {
		this.GC = this.GameController();
		this.Games = this.M.getConf('Games');
		this.PanelContainer();
		this.inputController();
		this.BtnContainer();
		// this.test();
	},

	GameController: function () {
		return {
			inputPosX: 0,
			currentSlideCenter: 0,
			DISABLE_INPUT_WORLD_MARGIN: 50,
			SLIDE_TOUCH_SENSITIVITY: 100,
			slideSmallPanelScale: {x:.2,y:.8},
			slideLargePanelScale: {x:6,y:10},
			slideTweenDuration: 600,
			slideTweenMoveLeftDistance: '-'+(this.world.centerX-50),
			slideTweenMoveRightDistance: '+'+(this.world.centerX-50),
			tweenFirst: null,
		};
	},

	PanelContainer: function () {
		this.SlidePanels = this.add.group();
		this.SlideImgs = this.add.group();
		this.SlideTexts = this.add.group();
		// this.ListPanels = this.add.group(); // TODO
		for (var id in this.Games) {
			var gameInfo = this.Games[id];
			this.genSlidePanels();
			this.genSlideImgs(gameInfo.mainImg);
			this.genSlideTexts(gameInfo.title);
		}
		this.initSlidePanel();
	},

	genSlidePanels: function () {
		var scaleX = this.GC.slideSmallPanelScale.x;
		var scaleY = this.GC.slideSmallPanelScale.y;
		var sprite = this.M.S.genSprite(this.world.width-50,this.world.centerY-100,'greySheet','grey_panel');
		sprite.anchor.setTo(.5);
		sprite.scale.setTo(scaleX,scaleY);
		this.SlidePanels.add(sprite);
	},

	genSlideImgs: function (img) {
		var imgSprite = this.M.S.genSprite(this.world.centerX,this.world.centerY-100,img);
		imgSprite.anchor.setTo(.5);
		imgSprite.hide();
		this.SlideImgs.add(imgSprite);
	},

	genSlideTexts: function (text) {
		var textStyle = {};
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY/2,text,textStyle);
		textSprite.hide();
		textSprite.addGroup(this.SlideTexts);
	},

	initSlidePanel: function () {
		var slps = this.GC.slideLargePanelScale;
		var centerPanel = this.SlidePanels.children[0];
		centerPanel.scale.setTo(slps.x,slps.y);
		centerPanel.x = this.world.centerX;
		var imgSprite = this.SlideImgs.children[0];
		imgSprite.show();
		var textSprite = this.SlideTexts.children[0];
		textSprite.show();
	},

	inputController: function () {
		var g = this.GC;
		var DIWM = g.DISABLE_INPUT_WORLD_MARGIN;
		var STS = g.SLIDE_TOUCH_SENSITIVITY;
		this.game.input.onDown.add(function (pointer/*,event*/) {
			g.inputPosX = pointer.x;
		},this);
		this.game.input.onUp.add(function (pointer/*,event*/) {
			if (!this.SlidePanels.visible) return;
			if (pointer.y<DIWM || pointer.y>this.world.height-DIWM 
			|| pointer.x<DIWM || pointer.x>this.world.width-DIWM) return;
			if (g.tweenFirst&&g.tweenFirst.isRunning) return;
			if (pointer.x+STS<g.inputPosX) this.leftSlide();
			if (pointer.x-STS>g.inputPosX) this.rightSlide();
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
		var g = this.GC;
		if (g.currentSlideCenter==Object.keys(this.Games).length-1) return; 
		if (g.tweenFirst&&g.tweenFirst.isRunning) return;
		var centerSprite = this.SlidePanels.children[g.currentSlideCenter];
		var rightSprite = this.SlidePanels.children[g.currentSlideCenter+1];
		this.hideCenterContents();
		this.leftSlideTween(centerSprite,rightSprite);
		g.currentSlideCenter++;
	},

	leftSlideTween: function (centerSprite,rightSprite) {
		this.slideTween(
			centerSprite,rightSprite,
			this.GC.slideTweenMoveLeftDistance);
	},

	rightSlide: function () {
		var g = this.GC;
		if (g.currentSlideCenter==0) return;
		if (g.tweenFirst&&g.tweenFirst.isRunning) return;
		var centerSprite = this.SlidePanels.children[g.currentSlideCenter];
		var leftSprite = this.SlidePanels.children[g.currentSlideCenter-1];
		this.hideCenterContents();
		this.rightSlideTween(centerSprite,leftSprite);
		g.currentSlideCenter--;
	},

	rightSlideTween: function (centerSprite,leftSprite) {
		this.slideTween(
			centerSprite,leftSprite,
			this.GC.slideTweenMoveRightDistance);
	},

	slideTween: function (fromCenterSprite,toCenterSprite,moving) {
		var duration = this.GC.slideTweenDuration;
		var ssps = this.GC.slideSmallPanelScale;
		var slps = this.GC.slideLargePanelScale;
		this.GC.tweenFirst = this.M.T.moveX(fromCenterSprite,{
			xy:{x:moving},
			easing:Phaser.Easing.Quartic.InOut,
			duration: duration,
		});
		this.GC.tweenFirst.start();
		this.M.T.popUpX(fromCenterSprite,{
			scale:{x:ssps.x,y:ssps.y},
			easing:Phaser.Easing.Quartic.In,
			duration: duration,
		}).start();
		this.M.T.moveX(toCenterSprite,{
			xy:{x:moving},
			easing:Phaser.Easing.Quartic.InOut,
			duration: duration,
		}).start();
		this.M.T.popUpX(toCenterSprite,{
			scale:{x:slps.x,y:slps.y},
			easing:Phaser.Easing.Back.Out,
			duration: duration,
		}).start();
		this.M.T.onComplete(this.GC.tweenFirst,this.slideTweenComp);
	},

	slideTweenComp: function (/*sprite,tween*/) {
		var csc = this.GC.currentSlideCenter;
		var imgSprite = this.SlideImgs.children[csc];
		imgSprite.show();
		var textSprite = this.SlideTexts.children[csc];
		textSprite.show();
	},

	hideCenterContents: function () {
		var csc = this.GC.currentSlideCenter;
		var imgSprite = this.SlideImgs.children[csc];
		imgSprite.hide();
		var textSprite = this.SlideTexts.children[csc];
		textSprite.hide();
	},

	BtnContainer: function () {
		var textStyle = {};
		var leftBtn = this.M.S.BasicGrayLabel(150,this.world.height-100,this.rightSlide,'←',textStyle);
		leftBtn.setScale(1,2.2);
		var rightBtn = this.M.S.BasicGrayLabel(this.world.width-150,this.world.height-100,this.leftSlide,'→',textStyle);
		rightBtn.setScale(1,2.2);
	},
};
