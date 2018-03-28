BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GC = null;
		this.OC = null;
		this.NoteGroups = null;
		this.HUD = null;
		this.stage.backgroundColor = '#ffffff';
	},

	create: function () {
		this.GC = this.GameController();
		this.OC = this.OperationContainer();
		this.InputController();
		this.NoteGroups = this.NoteContainer();
		this.HUD = this.HUDContainer();
		this.ready();
	},

	GameController: function () {
		var Score = this.M.getConf('scores')['score_1'];
		return {
			isPlaying: false,
			Score: Score,
			currentRawOfScore: Score.body.length-1,
		};
	},

	checkHit: function (sprite/*,pointer*/) {
		console.log(sprite.id);
		sprite.tint=0xff0000;
		var touchTime = this.time.now;
	},

	OperationContainer: function () {
		var c = {PanelBtns:[]};
		var x = this.world.centerX;
		var y = this.world.centerY+200;
		var w = 300;
		var h = 300;
		for (var i=0;i<2;i++) {
			for (var j=0;j<2;j++) {
				var PanelGroup = this.makePanelGroup({
					x: i*w+x-w, 
					y: j*h+y-h,
					width:w, 
					height:h,
				});
				var btnSprite = PanelGroup.children[8];
				btnSprite.UonInputDown(this.checkHit, this);
				btnSprite.UonInputUp(this.revertBtnColor, this);
				btnSprite.UonInputOut(this.revertBtnColor, this);
				var id = i+1+j*2;
				btnSprite.id = id; // 1,2,3,4
				this.M.S.genText(btnSprite.centerX,btnSprite.centerY,id);
				c.PanelBtns[id] = btnSprite;
			}
		}
		return c;
	},

	makePanelGroup: function (options) {
		options=options||{};
		ob=options.border||{};
		obi=options.borderInner||{};
		oib=options.innerBg||{};
		var bc = ob.color||'#ff8100'; // border color
		var bic = obi.color||'#fff4b5'; // border inner color
		var ibc = oib.color||'#fbff00'; // inner background color
		var ba = ob.alpha||.8; // border alpha
		var bia = obi.alpha||1; // border inner alpha
		var iba = oib.alpha||.5;
		var x = options.x||0;
		var y = options.y||0;
		var w = options.width||this.world.centerX; // width
		var h = options.height||this.world.centerY; // height
		var bw = ob.width||15; // border width
		var biw = obi.width||5; // border inner width
		var bm = (bw-biw)/2; // border margin
		////////////////////////////////////////////////////////////////////////
		var frameTop = this.M.S.genBmpSprite(x,y,w-bw,bw,bc);
		frameTop.alpha = ba;
		var frameRight = this.M.S.genBmpSprite(x+w-bw,y,bw,h-bw,bc);
		frameRight.alpha = ba;
		var frameLeft = this.M.S.genBmpSprite(x,y+bw,bw,h-bw,bc);
		frameLeft.alpha = ba;
		var frameBottom = this.M.S.genBmpSprite(x+bw,y+h-bw,w-bw,bw,bc);
		frameBottom.alpha = ba;
		////////////////////////////////////////////////////////////////////////
		var frameInnerTop = this.M.S.genBmpSprite(x+biw,y+biw,w-biw*2,bm,bic);
		frameInnerTop.alpha = bia;
		var frameInnerRight = this.M.S.genBmpSprite(x+w-biw*2,y+biw,bm,h-biw*2,bic);
		frameInnerRight.alpha = bia;
		var frameInnerLeft = this.M.S.genBmpSprite(x+biw,y+biw,bm,h-biw*2,bic);
		frameInnerLeft.alpha = bia;
		var frameInnerBottom = this.M.S.genBmpSprite(x+biw,y+h-bm*2,w-biw*2,bm,bic);
		frameInnerBottom.alpha = bia;
		////////////////////////////////////////////////////////////////////////
		var innerBg = this.M.S.genBmpSprite(x+bw,y+bw,w-bw*2,h-bw*2,ibc);
		innerBg.alpha = iba;
		////////////////////////////////////////////////////////////////////////
		var PanelGroup = this.add.group();
		PanelGroup.add(frameTop);
		PanelGroup.add(frameRight);
		PanelGroup.add(frameLeft);
		PanelGroup.add(frameBottom);
		PanelGroup.add(frameInnerTop);
		PanelGroup.add(frameInnerRight);
		PanelGroup.add(frameInnerLeft);
		PanelGroup.add(frameInnerBottom);
		PanelGroup.add(innerBg);
		return PanelGroup;
	},

	revertBtnColor: function (sprite) {
		sprite.tint = 0xfbff00;
	},

	InputController: function () {
		if (!this.game.device.desktop) return;
		for (var i=0;i<4;i++) {
			var key=null;
			switch (i) {
				case 0: key=Phaser.Keyboard.ONE; break;
				case 1: key=Phaser.Keyboard.TWO; break;
				case 2: key=Phaser.Keyboard.THREE; break;
				case 3: key=Phaser.Keyboard.FOUR; break;
			}
			var keyboard = this.input.keyboard.addKey(key);
			keyboard.onDown.add(this.onDownKeyBoard, this);
			keyboard.onUp.add(this.onUpKeyBoard, this);
		}
	},

	onDownKeyBoard: function (key) {
		this.checkHit(this.OC.PanelBtns[key.event.key]);
	},

	onUpKeyBoard: function (key) {
		this.revertBtnColor(this.OC.PanelBtns[key.event.key]);
	},

	NoteContainer: function () {
		var c = {};
		for (var i=1;i<=4;i++) c[i] = this.add.group();
		return c;
	},

	genTambourine: function () {
		// TODO
		var scoreRaw = this.GC.Score.body[this.GC.currentRawOfScore];
		console.log(scoreRaw);
	},

	HUDContainer: function () {
		var c = {};
		// TODO
		return c;
	},

	ready: function () {
		this.start();
	},

	start: function () {
		this.GC.isPlaying = true;
		this.startGameLoop();
	},

	startGameLoop: function () {
		this.time.events.loop(this.GC.Score.frequency, function () {
			if (this.GC.currentRawOfScore<0) return this.gameOver();
			this.genTambourine();
			this.GC.currentRawOfScore--;
		}, this);
	},

	gameOver: function () {
		this.time.events.removeAll();
		console.log('gameOver');
	},
};
