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
		// --UNIMPLEMENTED // if (MusicalScores.type=='String') this.genTambourine = this.genTambourineS;
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
			combo: 0,
			maxCombo: 0,
			FullCombo: this.calculateFullCombo(MusicalScores),
		};
	},

	checkHit: function (btnSprite,pointer) {
		if (this.GC.isPlaying) {
			btnSprite.tint = 0xff0000;
			var targetSprite = this.NoteGroups[btnSprite.id].getFirstAlive();
			var c = this.M.getConst();
			if (targetSprite) {
				var pos = {
					x:targetSprite.centerX,
					y:targetSprite.centerY
				};
				targetSprite.destroy();
				var timing = targetSprite.timing;
				var touchTime = this.time.now;
				var g = this.GC;
				if (timing>=touchTime-g.BadMargin&&timing<=touchTime+g.BadMargin) {
					if (timing>=touchTime-g.GoodMargin&&timing<=touchTime+g.GoodMargin) {
						if (timing>=touchTime-g.CoolMargin&&timing<=touchTime+g.CoolMargin) {
							if (timing>=touchTime-g.PerfectMargin&&timing<=touchTime+g.PerfectMargin) {
								return this.hit(c.PERFECT, pos);
							} else {
								return this.hit(c.COOL, pos);
							}
						} else {
							return this.hit(c.GOOD, pos);
						}
					} else {
						return this.hit(c.BAD, pos);
					}
				}
			}
			return this.hit(c.FALSE, {x:pointer.x,y:pointer.y});
		}
	},

	hit: function (judgment, pos) {
		var c = this.M.getConst();
		var text = '';
		var textStyle = {
			fill: this.M.getConst('MAIN_TEXT_COLOR'),
			stroke:'#FFFFFF',
			strokeThickness: 15,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 10,
		};
		var score = 0;
		var combo = 0;
		switch (judgment) {
			case c.PERFECT: 
				text = 'PERFECT!!';
				score = 5000;
				combo = 1;
				break;
			case c.COOL: 
				text = 'COOL!';
				score = 3000;
				combo = 1;
				break;
			case c.GOOD: 
				text = 'GOOD';
				score = 1000;
				combo = 1;
				break;
			case c.BAD: 
				text = 'BAD';
				score = 100;
				combo = 1;
				break;
			case c.FALSE: 
				text = 'FALSE';
				score = -1000;
				this.GC.combo = 0;
				break;
		}
		this.GC.combo += combo;
		if (this.GC.combo > this.GC.maxCombo) this.GC.maxCombo = this.GC.combo;
		this.hitEffect(text, pos, textStyle);
		this.comboEffect(this.GC.combo);
		this.addScore(score);
	},

	hitEffect: function (text, pos, textStyle) {
		var textSprite = this.M.S.genText(pos.x,pos.y,text,textStyle);
		textSprite.addTween('moveA',{xy:{y:'-50'}});
		this.M.T.onComplete(textSprite.textTween.moveA, function () {
			textSprite.Udestroy();
		});
		textSprite.startTween('moveA');
	},

	comboEffect: function (combo) {
		if (combo<5) return;
		var baseText = 'COMBO: ';
		var pos = {x:this.world.centerX,y:this.world.centerY};
		var textStyle = this.StaticBaseTextStyle();
		this.hitEffect(baseText+combo,pos,textStyle);
	},

	addScore: function (val) {
		this.GC.score += val;
		this.HUD.changeScore(this.GC.score);
	},

	getRandomArr: function () {
		var PandeyImgArr = this.M.getGlobal('PandeyImgArr');
		var copyArr = PandeyImgArr.slice();
		for (var i=copyArr.length;i>4;i--) Phaser.ArrayUtils.removeRandomItem(copyArr);
		return Phaser.ArrayUtils.shuffle(copyArr);
	},

	calculateFullCombo: function (MusicalScores) {
		var body = MusicalScores.body;
		var fullCombo = 0;
		if (MusicalScores.type == 'Number') {
			for (var key in body) {
				if (body[key]==0) continue;
				fullCombo++;
			}
		}
		// --UNIMPLEMENTED String
		return fullCombo;
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
				if (sprite.alive) this.hit(this.M.getConst('FALSE'),{x:sprite.x,y:sprite.y});
				sprite.destroy();
			}, this);
		});
	},

	HUDContainer: function () {
		var HUD = {
			score:null,changeScore:null,hideStart:null,
			textStyle: this.StaticBaseTextStyle(),
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
		var self = this;
		HUD.changeScore = function (val) {
			textSprite.changeText(baseText+self.M.H.formatComma(val));
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
			if (self.time.events.paused) return this.resumeGame();
			self.start(); 
		};
		__GamePause = function () { self.pauseGame(); };
		this.stopBGM();
	},

	start: function () {
		this.GC.isPlaying = true;
		this.time.reset();
		__YoutubePlayer.setVolume(50);
		this.HUD.hideStart();
		this.startGameLoop();
	},

	stopBGM: function () {
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
	},

	pauseGame: function () {
		this.time.events.pause();
	},

	resumeGame: function () {
		this.time.events.resume();
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
		this.GC.isPlaying = false;
		this.HUD.showGameOver();
		this.time.events.add(2500, function () {
			document.getElementById('YoutubePlayer').style.display = 'none';
			__YoutubePlayer.seekTo(0);
			__YoutubePlayer.stopVideo();
			this.ResultContainer();
		}, this);
	},

	ResultContainer: function () {
		this.M.SE.play('Result',{volume:.5});
		this.M.S.genDialog('Dialog_1',{
			tint: 0xffeb8f,
			onComplete:this.openedResult,
		}).tweenShow();
	},

	openedResult: function () {
		var x = this.world.centerX;
		var y = this.world.centerY;
		var textStyle = this.StaticBaseTextStyle();
		var tint = this.M.getConst('MAIN_TINT');
		// TODO text / score,combo,maxcombo,fullcombo,
		this.genRestartLabel(x,y+200,textStyle,{duration:800,delay:600},tint);
		this.genTweetLabel(x,y+400,textStyle,{duration:800,delay:800},tint);
		this.genBackLabel(x,y+600,textStyle,{duration:800,delay:1000},tint);
	},

	genRestartLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			// TODO se
			this.M.NextScene('Play');
		},'もう一度プレイ',textStyle,{tint:tint});
		label.setScale(0,0);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	genTweetLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			// TODO se
			this.tweet();
		},'ツイートして\nみんなにも広める',textStyle,{tint:tint});
		label.setScale(0,0);
		var option = this.M.H.copyJson(tweenOption);
		option.btnSpriteScale = {x:2.2,y:4.4};
		label.addTween('popUpB',option);
		label.startTween('popUpB');
	},

	genBackLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			// TODO se
			this.M.NextScene('Title');
		},'タイトルにもどる',textStyle,{tint:tint});
		label.setScale(0,0);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	tweet: function () {
		var text = '';
		var hashtags = 'ちゃんまりゲーム,パンディゲーム';
		this.M.H.tweet(text,hashtags,location.href);
	},

	StaticBaseTextStyle: function () {
		return {
			fill: this.M.getConst('MAIN_TEXT_COLOR'),
			stroke:'#FFFFFF',
			strokeThickness: 15,
			multipleStroke: this.M.getConst('MAIN_TEXT_COLOR'),
			multipleStrokeThickness: 10,
		};
	},

	test: function () {
		if (__ENV!='prod') {
			if(this.M.H.getQuery('gameover')) this.GC.currentRawOfMusicalScores = 1;
			if(this.M.H.getQuery('result')) document.getElementById('YoutubePlayer').style.display = 'none';this.ResultContainer();
		}
	},
};
