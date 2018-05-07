BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.GC = null;
		this.ScrollingMap = null;
	},

	create: function () {
		this.GC = this.GameController();
		this.ScrollContainer();
		this.BtnContainer();
		this.genTitleTextSprite();
		this.start();
	},

	GameController: function () {
		var GamesInfo = this.M.getConf('GamesInfo');
		return {
			inputEnabled: false,
			canChangePage: true,
			currentPage: 0,
			mapOfPageAndId: [],
			GamesInfo: GamesInfo,
			GamesInfoLength: Object.keys(GamesInfo).length,
			currentUrl: '#',
		};
	},

	ScrollContainer: function () {
		this.genScrollingMap();
		this.setContentsToMap();
	},

	genScrollingMap: function () {
		this.ScrollingMap = this.add.tileSprite(
			0, 0, this.GC.GamesInfoLength * this.world.width, this.world.height, "transp");
		this.ScrollingMap.inputEnabled = true;
		this.ScrollingMap.input.enableDrag(false);
		this.ScrollingMap.input.allowVerticalDrag = false;
		this.ScrollingMap.input.boundsRect = new Phaser.Rectangle(
			this.world.width - this.ScrollingMap.width, 
			this.world.height - this.ScrollingMap.height, 
			this.ScrollingMap.width * 2 - this.world.width, 
			this.ScrollingMap.height * 2 - this.world.height);
		this.ScrollingMap.events.onDragStart.add(this.scrollOnDragStart, this);
		this.ScrollingMap.events.onDragStop.add(this.scrollOnDragStop, this);
	},

	scrollOnDragStart: function (sprite, pointer) {
		this.ScrollingMap.startPointerPosition = new Phaser.Point(pointer.x,pointer.y);
		this.ScrollingMap.startPosition = this.ScrollingMap.x;
	},

	scrollOnDragStop: function (sprite, pointer) {
		if(this.ScrollingMap.startPosition == this.ScrollingMap.x && this.ScrollingMap.startPointerPosition.x == pointer.x && this.ScrollingMap.startPointerPosition.y == pointer.y){
			// click event
		} else {
			if (this.ScrollingMap.startPosition - this.ScrollingMap.x > this.world.width / 8) {
				this.changePage(1);
			} else {
				if (this.ScrollingMap.startPosition - this.ScrollingMap.x < - this.world.width / 8) {
					this.changePage(-1);
				} else {
					this.changePage(0);
				}
			}
		}
	},

	changePage: function (page) {
		if (this.GC.canChangePage) {
			this.GC.canChangePage = false;
			this.GC.currentPage += page;
			var tween = this.M.T.moveX(this.ScrollingMap,{xy:{x:this.GC.currentPage*-this.world.width},duration:300,easing:Phaser.Easing.Cubic.Out});
			this.M.T.onComplete(tween, this.changePageOnComp);
			tween.start();
		}
	},

	changePageOnComp: function () {
		this.GC.canChangePage = true;
		this.changeOrnament();
	},

	setContentsToMap: function () {
		var GamesInfo = this.GC.GamesInfo;
		var orderGamesInfo = [];
		for (var id in GamesInfo) {
			var order = GamesInfo[id].order;
			orderGamesInfo[order] = GamesInfo[id];
		}
		var pageNum = 0;
		for (var key in orderGamesInfo) {
			var gameInfo = orderGamesInfo[key];
			var x = pageNum * this.world.width + this.world.centerX;
			this.genPanelSprite(x);
			this.genSlideImg(x,gameInfo);
			this.genSlideTitle(x,gameInfo);
			this.GC.mapOfPageAndId[pageNum] = gameInfo.id;
			pageNum++;
		}
		this.changeOrnament();
	},

	genPanelSprite: function (x) {
		var panelSprite = this.M.S.genSprite(x,this.world.centerY-100,'greySheet','grey_panel');
		panelSprite.anchor.setTo(.5);
		panelSprite.scale.setTo(6,10);
		this.ScrollingMap.addChild(panelSprite);
	},

	genSlideImg: function (x,gameInfo) {
		var imgSprite = this.M.S.genSprite(x,this.world.centerY-100,gameInfo.slideImg);
		imgSprite.anchor.setTo(.5);
		this.ScrollingMap.addChild(imgSprite);
	},

	genSlideTitle: function (x,gameInfo) {
		var textStyle = {
			fill: gameInfo.textColor,
			stroke: '#FFFFFF',
			strokeThickness: 15,
			multipleStroke: gameInfo.textColor,
			multipleStrokeThickness: 10,
		};
		var textSprite = this.M.S.genText(x,this.world.centerY/2,gameInfo.title,textStyle);
		this.ScrollingMap.addChild(textSprite.multipleTextSprite);
		this.ScrollingMap.addChild(textSprite);
	},

	changeOrnament: function () {
		var id = this.GC.mapOfPageAndId[this.GC.currentPage];
		var gameInfo = this.GC.GamesInfo[id];
		this.GC.currentUrl = gameInfo.url;
		this.stage.backgroundColor = gameInfo.bgColor;
	},

	leftSlide: function () {
		if (this.GC.currentPage==this.GC.GamesInfoLength-1) return;
		this.changePage(1);
	},

	rightSlide: function () {
		if (this.GC.currentPage==0) return;
		this.changePage(-1);
	},

	BtnContainer: function () {
		var textStyle = {};
		var y = this.world.height-100;
		var leftBtn = this.M.S.BasicGrayLabel(130,y,this.rightSlide,'←',textStyle);
		leftBtn.setScale(1,2.2);
		var rightBtn = this.M.S.BasicGrayLabel(this.world.width-130,y,this.leftSlide,'→',textStyle);
		rightBtn.setScale(1,2.2);
		this.genStartBtnSprite(y);
		this.genInquiryBtnSprite(textStyle);
	},

	genStartBtnSprite: function (y, textStyle) {
		this.M.S.BasicGrayLabel(this.world.centerX,y,function () {
			if (this.GC.inputEnabled) {
				if (this.game.device.desktop) {
					window.open(this.GC.currentUrl,'_blank');
				} else {
					location.href = this.GC.currentUrl;
				}
			}
		}, 'スタート', textStyle);
	},

	genInquiryBtnSprite: function (textStyle) {
		this.M.S.BasicGrayLabel(250,100,function () {
			window.open('https://twitter.com/'+__DEVELOPER_TWITTER_ID,'_blank');
		}, '開発者', textStyle);
	},

	genTitleTextSprite: function () {
		var textStyle = {
			fontSize: 70
		};
		this.M.S.genText(this.world.width-200,50,'238Games',textStyle);
	},

	start: function () {
		this.GC.inputEnabled = true;
	},
};
