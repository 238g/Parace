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
		var YoutubeInfo = this.M.getConf('YoutubeInfo')[this.M.getGlobal('currentMusicalScoresId')];
		var MusicalScores = this.M.getConf('MusicalScores')[YoutubeInfo.MusicalScores];
		// --UNIMPLEMENTED // if (MusicalScores.type=='String') this.genTambourine = this.genTambourineS;
		if (MusicalScores.type=='Number') this.genTambourine = this.genTambourineN;
		return {
			isPlaying: false,
			YoutubeInfo: YoutubeInfo,
			MusicalScores: MusicalScores,
			currentRawOfMusicalScores: MusicalScores.body.length-1,
			PandeyImgArr: this.M.H.getRndItemsFromArr(this.M.getGlobal('PandeyImgArr'),4),
			JudgeMarginInfo: {
				Perfect: 50,
				Cool: 200,
				Good: 500,
				Bad: 1000,
			},
			JudgeCountInfo: {
				Perfect: 0,
				Cool: 0,
				Good: 0,
				Bad: 0,
				False: 0,
			},
			RankPercentInfo: {
				s: {text:'S',percent:95},
				aaa: {text:'AAA',percent:90},
				aa: {text:'AA',percent:85},
				a: {text:'A',percent:80},
				b: {text:'B',percent:70},
				c: {text:'C',percent:60},
				d: {text:'D',percent:50},
				e: {text:'E',percent:40},
				f: {text:'F',percent:0},
			},
			score: 0,
			combo: 0,
			maxCombo: 0,
			FullCombo: this.calculateFullCombo(MusicalScores),
		};
	},

	checkHit: function (btnSprite,pointer) {
		if (this.GC.isPlaying) {
			this.M.SE.play('HitTheTambourine_'+btnSprite.id);
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
				// var touchTime = this.time.now;
				var touchTime = this.time.time;
				// console.log(timing,touchTime);
				var i = this.GC.JudgeMarginInfo;
				if (timing>=touchTime-i.Bad&&timing<=touchTime+i.Bad) {
					if (timing>=touchTime-i.Good&&timing<=touchTime+i.Good) {
						if (timing>=touchTime-i.Cool&&timing<=touchTime+i.Cool) {
							if (timing>=touchTime-i.Perfect&&timing<=touchTime+i.Perfect) {
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
		var info = this.M.getConf('JudgeInfo')[judgment];
		var color = info.color;
		var textStyle = {
			fill: color,
			stroke:'#FFFFFF',
			strokeThickness: 15,
			multipleStroke: color,
			multipleStrokeThickness: 10,
		};
		var c = this.M.getConst();
		var jci = this.GC.JudgeCountInfo;
		switch (judgment) {
			case c.PERFECT: jci.Perfect++; break;
			case c.COOL: jci.Cool++; break;
			case c.GOOD: jci.Good++; break;
			case c.BAD: jci.Bad++; break;
			case c.FALSE: jci.False++; break;
		}
		var combo = info.combo;
		if (combo==0) this.GC.combo = 0;
		this.GC.combo += combo;
		if (this.GC.combo > this.GC.maxCombo) this.GC.maxCombo = this.GC.combo;
		this.hitEffect(info.text, pos, textStyle);
		this.comboEffect(this.GC.combo);
		this.addScore(info.score);
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
		sprite.timing = this.time.time + this.GC.MusicalScores.speed;
		// sprite.timing = this.time.now + this.GC.MusicalScores.speed;
		this.NoteGroups[num].add(sprite);
		var tween = this.M.T.moveX(
			sprite,{
				xy:{x:panelBtnSprite.centerX,y:panelBtnSprite.centerY},
				easing: Phaser.Easing.Linear.None,
				duration: this.GC.MusicalScores.speed,
			}).start();
		this.M.T.onComplete(tween,function () {
			// console.log(sprite.timing,this.time.now);
			if (sprite.alive) {
				this.time.events.add(this.GC.JudgeMarginInfo.Bad, function () {
					if (sprite.alive) this.hit(this.M.getConst('FALSE'),{x:sprite.x,y:sprite.y});
					sprite.destroy();
				}, this);
			}
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
		this.time.events.paused = false;
		document.getElementById('YoutubePlayer').style.display = 'block';
		var self = this;
		__GameStart = function () { 
			if (self.time.events.paused) return self.resumeGame();
			self.start(); 
		};
		__GamePause = function () { self.pauseGame(); };
		this.stopBGM();
	},

	start: function () {
		this.GC.isPlaying = true;
		this.time.reset();
		__YoutubePlayer.setVolume(100);
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
					return this.time.events.add(this.GC.MusicalScores.frequency+this.GC.JudgeMarginInfo.Bad, function () {
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
		this.genResultCharSprite();
		this.M.S.genText(x,200,'結果発表',this.M.H.mergeJson({fontSize:80},this.StaticBaseTextStyle()));
		this.genResultTextContainer();
		this.genRestartLabel(x,y+350,textStyle,{duration:800,delay:600},tint);
		this.genTweetLabel(x,y+475,textStyle,{duration:800,delay:800},tint);
		this.genBackLabel(x,y+600,textStyle,{duration:800,delay:1000},tint);
	},

	genResultCharSprite: function () {
		var num;
		var rank = this.getResultRank();
		switch (rank) {
			case 'S': num = 2; break;
			case 'AAA': num = 3; break;
			case 'AA': num = 4; break;
			case 'A': num = 5; break;
			default: num = this.rnd.integerInRange(6,8);
		}
		var charSprite = this.M.S.genSprite(this.world.centerX/2,this.world.centerY,'Kashikomari_'+num);
		charSprite.anchor.setTo(.5);
		if (num==6) charSprite.x += 100;
	},

	genResultTextContainer: function () {
		var c = this.M.getConst();
		var info = this.M.getConf('JudgeInfo');
		var xL = this.world.centerX+50;
		var xR = this.world.centerX+270;
		var y = 300;
		var yM = 70;
		var s = this.M.S;
		var color;
		/////////
		var jci = this.GC.JudgeCountInfo;
		s.genText(xL,y,'PERFECT',this.getResultTextStyle(info[c.PERFECT].color));
		s.genText(xL,y+yM,jci.Perfect,this.getResultTextStyle(info[c.PERFECT].color));
		s.genText(xR,y,'COOL',this.getResultTextStyle(info[c.COOL].color));
		s.genText(xR,y+yM,jci.Cool,this.getResultTextStyle(info[c.COOL].color));
		/////////
		s.genText(xL,y+yM*2,'GOOD',this.getResultTextStyle(info[c.GOOD].color));
		s.genText(xL,y+yM*3,jci.Good,this.getResultTextStyle(info[c.GOOD].color));
		s.genText(xR,y+yM*2,'BAD',this.getResultTextStyle(info[c.BAD].color));
		s.genText(xR,y+yM*3,jci.Bad,this.getResultTextStyle(info[c.BAD].color));
		/////////
		s.genText(xL,y+yM*4,'FALSE',this.getResultTextStyle(info[c.FALSE].color));
		s.genText(xL,y+yM*5,jci.False,this.getResultTextStyle(info[c.FALSE].color));
		/////////
		var comboTextStyle = this.M.H.mergeJson({fontSize:40,fill:'#0000ff',multipleStroke:'#0000ff'},this.StaticBaseTextStyle());
		s.genText(xL,y+yM*6,'MAX COMBO',comboTextStyle);
		s.genText(xL,y+yM*7,this.GC.maxCombo,comboTextStyle);
		s.genText(xR,y+yM*6,'COMBO',comboTextStyle);
		s.genText(xR,y+yM*7,this.getResultCombo(),comboTextStyle);
		/////////
		var scoreTextStyle = this.M.H.mergeJson({fontSize:40,fill:'#3cb371',multipleStroke:'#3cb371'},this.StaticBaseTextStyle());
		s.genText(xL,y+yM*8,'スコア',scoreTextStyle);
		s.genText(xL,y+yM*9,this.M.H.formatComma(this.GC.score),scoreTextStyle);
		/////////
		s.genText(xL,y+yM*10,'Rank',this.M.H.mergeJson({fontSize:40,fill:'#dc143c',multipleStroke:'#dc143c'},this.StaticBaseTextStyle()));
		s.genText(xR,y+yM*10+30,this.getResultRank(),this.M.H.mergeJson({fontSize:80,fill:'#dc143c',multipleStroke:'#dc143c'},this.StaticBaseTextStyle()));
	},

	getResultTextStyle: function (color) {
		return {
			fontSize: 40,
			fill: color,
			stroke:'#FFFFFF',
			strokeThickness: 15,
			multipleStroke: color,
			multipleStrokeThickness: 10,
		};
	},

	getResultCombo: function () {
		if (this.GC.combo==this.GC.FullCombo) return 'FULLCOMBO';
		return this.GC.combo;
	},

	getResultRank: function () {
		var highestScore = this.M.getConf('JudgeInfo')[this.M.getConst('PERFECT')].score;
		var maxScore = this.GC.FullCombo*highestScore;
		var rankInfo = this.GC.RankPercentInfo;
		var rankText = 'F';
		for (var key in rankInfo) {
			var percent = rankInfo[key].percent;
			var judgeNum = maxScore*percent/100;
			if (this.GC.score>=judgeNum) {
				rankText = rankInfo[key].text;
				break;
			}
		}
		return rankText;
	},

	genRestartLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.M.NextScene('Play');
		},'もう一度プレイ',textStyle,{tint:tint});
		label.setScale(0,0);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	genTweetLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.tweet();
		// },'ツイートして\nみんなにも広める',textStyle,{tint:tint});
		},'結果をツイート',textStyle,{tint:tint});
		label.setScale(0,0);
		// var option = this.M.H.copyJson(tweenOption);
		// option.btnSpriteScale = {x:2.2,y:4.4};
		// label.addTween('popUpB',option);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	genBackLabel: function (x,y,textStyle,tweenOption,tint) {
		var label = this.M.S.BasicGrayLabel(x,y,function () {
			this.M.NextScene('Title');
		},'タイトルにもどる',textStyle,{tint:tint});
		label.setScale(0,0);
		label.addTween('popUpB',tweenOption);
		label.startTween('popUpB');
	},

	tweet: function () {
		var emoji;
		var rndNum = this.rnd.integerInRange(1,10);
		if (rndNum>=6) {
			emoji = '🍺🍺🍺🍺🍺🍺';
		} else if (rndNum>=2) {
			emoji = '🍻🍻🍻🍻🍻🍻';
		} else {
			emoji = '😐😐😐😐😐😐';
		}
		var text = '『'+this.M.getConst('GAME_TITLE')+'』で遊んだよ！\n'
					+'あなたの成績は……\n'
					+emoji+'\n'
					+'選んだ曲： 「'+this.GC.YoutubeInfo.title+'」\n'
					+'スコア： '+this.M.H.formatComma(this.GC.score)+'\n'
					+'MAXコンボ： '+this.GC.maxCombo+'\n'
					+'ランク： '+this.getResultRank()+'\n'
					+emoji+'\n';
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
			if(this.M.H.getQuery('result')) {
				document.getElementById('YoutubePlayer').style.display = 'none';
				this.ResultContainer();
			}
		}
	},
};
