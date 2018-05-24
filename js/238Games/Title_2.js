BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.GamesInfo=this.M.getConf('GamesInfo');
		this.GamesInfoLength=Object.keys(this.GamesInfo).length;
		this.canChangePage=!0;
		this.mapOfPageAndId=[];
		this.ScrollingMap = null;
		this.currentPage=0;
		this.currentUrl='#';
	},

	create: function () {
		this.ScrollContainer();
		this.HUDContainer();
	},

	ScrollContainer: function () {
		this.ScrollingMap = this.add.tileSprite(
			0, 0, this.GamesInfoLength * this.world.width, this.world.height, "transp");
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
		this.setContentsToMap();
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
		if (this.canChangePage) {
			this.canChangePage = false;
			this.currentPage += page;
			var tween = this.M.T.moveX(this.ScrollingMap,{xy:{x:this.currentPage*-this.world.width},duration:300,easing:Phaser.Easing.Cubic.Out});
			this.M.T.onComplete(tween, this.changePageOnComp);
			tween.start();
		}
	},

	changePageOnComp: function () {
		this.canChangePage = true;
		this.changeOrnament();
	},

	setContentsToMap: function () {
		var orderGamesInfo = [];
		var pageNum = 0;
		for (var id in this.GamesInfo)orderGamesInfo[this.GamesInfo[id].order] = this.GamesInfo[id];
		for (var key in orderGamesInfo) {
			var gameInfo = orderGamesInfo[key];
			var x = pageNum * this.world.width + this.world.centerX;
			this.genPanelSprite(x);
			this.genSlideImg(x,gameInfo);
			this.genSlideTitle(x,gameInfo);
			this.mapOfPageAndId[pageNum] = gameInfo.id;
			pageNum++;
		}
		this.changeOrnament();
	},

	genPanelSprite: function (x) {
		var panelSprite = this.M.S.genSprite(x,this.world.centerY,'greySheet','grey_panel');
		panelSprite.anchor.setTo(.5);
		panelSprite.scale.setTo(2.4,4);
		this.ScrollingMap.addChild(panelSprite);
	},

	genSlideImg: function (x,gameInfo) {
		var imgSprite = this.M.S.genSprite(x,this.world.centerY,gameInfo.slideImg);
		imgSprite.anchor.setTo(.5);
		imgSprite.scale.setTo(gameInfo.scale);
		this.ScrollingMap.addChild(imgSprite);
	},

	genSlideTitle: function (x,gameInfo) {
		var textStyle = {
			fontSize: 25,
			fill: gameInfo.textColor,
			stroke: '#FFFFFF',
			strokeThickness: 10,
			multipleStroke: gameInfo.textColor,
			multipleStrokeThickness: 10,
		};
		var textSprite = this.M.S.genText(x,this.world.centerY/2,gameInfo.title,textStyle);
		this.ScrollingMap.addChild(textSprite.multipleTextSprite);
		this.ScrollingMap.addChild(textSprite);
	},

	changeOrnament: function () {
		var id = this.mapOfPageAndId[this.currentPage];
		var gameInfo = this.GamesInfo[id];
		this.currentUrl = gameInfo.url;
		this.stage.backgroundColor = gameInfo.bgColor;
	},

	leftSlide: function () {
		if (this.currentPage==this.GamesInfoLength-1) return;
		this.changePage(1);
	},

	rightSlide: function () {
		if (this.currentPage==0) return;
		this.changePage(-1);
	},

	HUDContainer: function () {
		var textStyle = {
			fontSize: 25,
			fill: '#FFFFFF',
			stroke: '#000000',
			strokeThickness: 5,
		};
		var bottomY = this.world.height-40;
		var leftBtn = this.M.S.BasicGrayLabelS(50,bottomY,this.rightSlide,'←',textStyle);
		var rightBtn = this.M.S.BasicGrayLabelS(this.world.width-50,bottomY,this.leftSlide,'→',textStyle);
		this.genStartBtnSprite(bottomY,textStyle);
		this.M.S.BasicGrayLabelS(100,40,function () {
			window.open('https://twitter.com/'+__DEVELOPER_TWITTER_ID,'_blank');
		},'開発者',textStyle);
		this.M.S.genText(this.world.width-80,20,'238Games',textStyle);
	},

	genStartBtnSprite: function (bottomY,textStyle) {
		this.M.S.BasicGrayLabelS(this.world.centerX,bottomY,function () {
			if (this.game.device.desktop) {
				window.open(this.currentUrl,'_blank');
			} else {
				location.href = this.currentUrl;
			}
		},'スタート',textStyle);
	},
};
