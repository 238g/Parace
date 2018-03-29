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
		// this.InputController();
		this.NoteGroups = this.NoteContainer();
		this.HUD = this.HUDContainer();
		this.ready();
		this.test();
	},

	GameController: function () {
		var MusicalScores = this.M.getConf('MusicalScores')['MusicalScore_1'];
		if (MusicalScores.type=='String') this.genTambourine = this.genTambourineS;
		if (MusicalScores.type=='Number') this.genTambourine = this.genTambourineN;
		return {
			isPlaying: false,
			MusicalScores: MusicalScores,
			currentRawOfMusicalScores: MusicalScores.body.length-1,
			PandeyImgArr: this.getRandomArr(),
			PerfectMargin: 50,
			CoolMargin: 200,
			GoodMargin: 500,
			BadMargin: 1000,
			score: 0,
			combo: 0, // TODO
			maxCombo: 0, // TODO
		};
	},

	checkHit: function (btnSprite/*,pointer*/) {
		if (this.GC.isPlaying) {
			btnSprite.tint = 0xff0000;
			var targetSprite = this.NoteGroups[btnSprite.id].getFirstAlive();
			var c = this.M.getConst();
			if (targetSprite) {
				targetSprite.destroy();
				var timing = targetSprite.timing;
				var touchTime = this.time.now;
				var g = this.GC;
				if (timing>=touchTime-g.BadMargin&&timing<=touchTime+g.BadMargin) {
					if (timing>=touchTime-g.GoodMargin&&timing<=touchTime+g.GoodMargin) {
						if (timing>=touchTime-g.CoolMargin&&timing<=touchTime+g.CoolMargin) {
							if (timing>=touchTime-g.PerfectMargin&&timing<=touchTime+g.PerfectMargin) {
								return this.hit(c.PERFECT);
							} else {
								return this.hit(c.COOL);
							}
						} else {
							return this.hit(c.GOOD);
						}
					} else {
						return this.hit(c.BAD);
					}
				}
			}
			return this.hit(c.FALSE);
		}
	},

	hit: function (judgment) {
		var c = this.M.getConst();
		var text='';
		var score=0;
		switch (judgment) {
			case c.PERFECT: 
				text = 'パーフェクト！';
				score = 5000;
				break;
			case c.COOL: 
				text = 'クール！';
				score = 3000;
				break;
			case c.GOOD: 
				text = 'グッド！';
				score = 1000;
				break;
			case c.BAD: 
				text = 'バッド…';
				score = 500;
				break;
			case c.FALSE: 
				text = 'フォルス…';
				score = 100;
				break;
		}
		this.hitEffect(text);
		this.addScore(score);
	},

	hitEffect: function (text) {
		console.log(text);
	},

	addScore: function (val) {
		this.GC.score += val;
		this.HUD.changeText(this.GC.score);
	},

	getRandomArr: function () {
		var PandeyImgArr = this.M.getGlobal('PandeyImgArr');
		var copyArr = PandeyImgArr.slice();
		for (var i=copyArr.length;i>4;i--) Phaser.ArrayUtils.removeRandomItem(copyArr);
		return Phaser.ArrayUtils.shuffle(copyArr);
	},

	OperationContainer: function () {
		var c = {PanelBtns:[]};
		var x = this.world.centerX;
		var y = this.world.centerY+350;
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
				var charSprite = this.M.S.genSprite(btnSprite.centerX,btnSprite.centerY,this.GC.PandeyImgArr[id-1]);
				charSprite.anchor.setTo(.5);
				charSprite.scale.setTo(.9)
				this.M.S.genText(btnSprite.right-50,btnSprite.top+50,id,{
					fill: this.M.getConst('MAIN_TEXT_COLOR'),
					stroke:'#FFFFFF',
					strokeThickness: 15,
					multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
					multipleStrokeThickness: 10,
				});
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

	/*
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
	*/

	NoteContainer: function () {
		var c = {};
		for (var i=1;i<=4;i++) c[i] = this.add.group();
		return c;
	},

	genTambourine: function () {},
	genTambourineS: function () {
		var musicalScoreRaw = this.GC.MusicalScores.body[this.GC.currentRawOfMusicalScores];
		for (var i=0;i<musicalScoreRaw.length;i++) {
			if (musicalScoreRaw[i]=='o') {
				var num = i+1;
				this.genTambourineCore(num);
				break;
			}
		}
	},
	genTambourineN: function () {
		var num = this.GC.MusicalScores.body[this.GC.currentRawOfMusicalScores];
		console.log(num);
		if (num>=1&&num<=4) this.genTambourineCore(num);
	},

	genTambourineCore: function (num) {
		var panelBtnSprite = this.OC.PanelBtns[num];
		var startX;
		var startY;
		switch (this.rnd.integerInRange(1,4)) {
			case 1: startX=0;startY=0;break;
			case 2: startX=this.world.width;startY=0;break;
			case 3: startX=0;startY=this.world.height;break;
			case 4: startX=this.world.width;startY=this.world.height;break;
		}
		var sprite = this.add.sprite(startX,startY,this.GC.PandeyImgArr[(num-1)]);
		sprite.anchor.setTo(.5);
		sprite.timing = this.time.now + this.GC.MusicalScores.speed;
		this.NoteGroups[num].add(sprite);
		var tween = this.M.T.moveX(
			sprite,{
				xy:{x:panelBtnSprite.centerX,y:panelBtnSprite.centerY},
				easing: Phaser.Easing.Linear.None,
				duration: this.GC.MusicalScores.speed,
			}).start();
		this.M.T.onComplete(tween,function () {
			console.log(sprite.timing,this.time.now);
			this.time.events.add(this.GC.BadMargin, function () {
				// if (3) console.log('false');
				sprite.destroy();
			}, this);
		});
	},

	HUDContainer: function () {
		var HUD = {
			score:null,changeScore:null,hideStart:null,
			textStyle: {
				fill: this.M.getConst('MAIN_TEXT_COLOR'),
				stroke:'#FFFFFF',
				strokeThickness: 15,
				multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
				multipleStrokeThickness: 10,
			},
		};
		this.genScoreTextSprite(HUD);
		this.genStartTextSprite(HUD);
		this.genGameOverTextSprite(HUD);
		return HUD;
	},

	genScoreTextSprite: function (HUD) {
		var baseText = 'スコア: ';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.height-50,baseText+this.GC.score,HUD.textStyle);
		textSprite.setAnchor(.5);
		HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
		};
		HUD.score = textSprite;
	},

	genStartTextSprite: function (HUD) {
		var baseText = '動画を再生させるとスタートするよ！';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,HUD.textStyle);
		textSprite.setAnchor(.5);
		HUD.hideStart = textSprite.hide;
	},

	genGameOverTextSprite: function (HUD) {
		var baseText = '演奏終了！！';
		var textSprite = this.M.S.genText(this.world.centerX,this.world.centerY,baseText,HUD.textStyle);
		textSprite.setAnchor(.5);
		textSprite.setScale(0,0);
		var self = this;
		HUD.showGameOver = function () {
			textSprite.addTween('popUpB',{scale:{x:2,y:2}});
			textSprite.startTween('popUpB');
		};
	},

	ready: function () {
		document.getElementById('YoutubePlayer').style.display = 'block';
		var self = this;
		__GameStart = function () { 
			if (self.time.events.paused) return self.time.events.resume();
			self.start(); 
		};
		__GamePause = function () { self.pause(); };
	},

	start: function () {
		this.GC.isPlaying = true;
		this.time.reset();
		__YoutubePlayer.setVolume(50);
		this.HUD.hideStart();
		this.startGameLoop();
	},

	pause: function () {
		this.time.events.pause();
	},

	startGameLoop: function () {
		this.time.events.add(this.GC.MusicalScores.delay, function () {
			this.time.events.loop(this.GC.MusicalScores.frequency, function () {
				if (this.GC.currentRawOfMusicalScores<0) {
					this.time.events.removeAll();
					return this.time.events.add(this.GC.MusicalScores.frequency+this.GC.BadMargin, function () {
						this.gameOver();
					}, this);
				}
				this.genTambourine();
				this.GC.currentRawOfMusicalScores--;
			}, this);
		}, this);
	},

	gameOver: function () {
		// TODO SE
		this.GC.isPlaying = false;
		this.HUD.showGameOver();
		this.time.events.add(2000, function () {
			document.getElementById('YoutubePlayer').style.display = 'none';
			__YoutubePlayer.seekTo(0);
			__YoutubePlayer.stopVideo();
			this.ResultContainer();
		}, this);
	},

	ResultContainer: function () {
		this.M.S.BasicGrayDialog({onComplete:function () {
			console.log(33333);
			// TODO
			this.M.NextScene('Title');
		},}).tweenShow();
	},

	test: function () {
		if (__ENV!='prod') {
			if(this.M.H.getQuery('gameover')) this.GC.currentRawOfMusicalScores = 5;
		}
	},
};
