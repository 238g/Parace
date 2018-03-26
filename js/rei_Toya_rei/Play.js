BasicGame.Play = function () {};
BasicGame.Play.prototype = {
	init: function () {
		this.GC = null;
		this.HUD = null;
		this.Player = null;
		this.Enemys = null;
		this.Floor = null;
		this.Nuisance = null;
	},

	create: function () {
		this.GC = this.GameController();
		this.physicsController();
		this.BgContainer();
		this.FloorContainer();
		this.PlayerContainer();
		this.OperationContainer();
		this.genNuisanceSprite();
		this.EnemyContainer();
		this.HUD = this.HUDContainer();
		this.ready();
		this.test();
	},

	GameController: function () {
		return {
			inputEnable: false,
			isPlaying: false,
			score: 0,
			currentPosition: this.rnd.integerInRange(1,4),
			position: {
				1: {x:20,y:this.world.height-500},
				2: {x:240,y:this.world.height-500},
				3: {x:460,y:this.world.height-500},
				4: {x:680,y:this.world.height-500},
			},
			nuisanceRate: 1,
		};
	},

	update: function () {
		if (this.GC.isPlaying) {
			this.collisionManager();
		}
	},

	collisionManager: function () {
		this.physics.arcade.overlap(this.Player,this.Enemys,this.hitEnemy, null, this);
		this.physics.arcade.overlap(this.Floor,this.Enemys,this.killEnemy, null, this);
	},

	hitEnemy: function (player, enemy) {
		enemy.body.velocity.y = 80;
		this.gameOver();
	},

	killEnemy: function (floor, enemy) {
		if (enemy.alive) this.addScore();
		enemy.kill();
	},

	addScore: function () {
		this.GC.score += 1;
		this.HUD.changeScore(this.GC.score);
	},

	physicsController: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	BgContainer: function () {
		var sprite = this.add.sprite(this.world.centerX,this.world.centerY,'Toya_2');
		sprite.anchor.setTo(.5);
		sprite.scale.setTo(3);
		var h = this.world.height;
		var framePx = 5;
		for (var i=0;i<5;i++) {
			this.add.sprite(i*220,0,this.genBmpTpl(framePx,h,'#0b29bfc9'));
			this.add.sprite(i*220+framePx,0,this.genBmpTpl(20-framePx*2,h,'#c2d0d2'));
			this.add.sprite(i*220+20-framePx,0,this.genBmpTpl(framePx,h,'#0b29bfc9'));
			this.add.sprite(i*220+20,0,this.genBmpTpl(200,h,'#0bdfff85'));
		}
	},

	genBmpTpl: function (w,h,fillStyle) {
		var bmp = this.add.bitmapData(w,h);
		bmp.ctx.fillStyle = fillStyle;
		bmp.ctx.beginPath();
		bmp.ctx.rect(0,0,w,h);
		bmp.ctx.fill();
		bmp.update();
		return bmp;
	},

	FloorContainer: function () {
		this.Floor = this.add.sprite(this.world.centerX, this.world.height+240, this.genBmpTpl(this.world.width, 200, '#ffffff'));
		this.Floor.anchor.setTo(.5);
		this.physics.arcade.enable(this.Floor);
		this.Floor.body.enable = true;
	},

	PlayerContainer: function () {
		var x = this.GC.position[this.GC.currentPosition].x;
		var y = this.GC.position[this.GC.currentPosition].y;
		this.Player = this.add.sprite(x,y,'Chihiro_1');
		this.Player.scale.setTo(.46);
		this.physics.arcade.enable(this.Player);
		this.Player.body.enable = true;
		this.Player.body.setCircle(120, 100, 30);
	},

	OperationContainer: function () {
		this.keyBoardSetting();
		this.genArrowLeftBtnSprite();
		this.genArrowRightBtnSprite();
	},

	keyBoardSetting: function () {
		if (!this.game.device.desktop) return;
		var leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		leftKey.onDown.add(this.MoveLeft, this);
		var rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		rightKey.onDown.add(this.MoveRight, this);
	},

	genArrowLeftBtnSprite: function () {
		var i = 'arrowLeft';
		var btnSprite = this.add.button(0,this.world.height,'GameIcons',this.MoveLeft,this,i,i,i,i);
		btnSprite.scale.setTo(3);
		btnSprite.anchor.setTo(0,1);
	},

	genArrowRightBtnSprite: function () {
		var i = 'arrowRight';
		var btnSprite = this.add.button(this.world.width,this.world.height,'GameIcons',this.MoveRight,this,i,i,i,i);
		btnSprite.scale.setTo(3);
		btnSprite.anchor.setTo(1);
	},

	MoveLeft: function () {
		if (this.GC.isPlaying) {
			var pos = this.GC.position[this.GC.currentPosition-1];
			if (pos) {
				this.GC.currentPosition--;
				this.Player.x = pos.x;
			}
		}
	},

	MoveRight: function () {
		if (this.GC.isPlaying) {
			var pos = this.GC.position[this.GC.currentPosition+1];
			if (pos) {
				this.GC.currentPosition++;
				this.Player.x = pos.x;
			}
		}
	},

	genNuisanceSprite: function () {
		var s = this.game.global.SpriteManager;
		this.Nuisance = s.genSprite(this.world.centerX,0,'Toya_3');
		this.Nuisance.anchor.setTo(-.1,1);
		this.Nuisance.scale.setTo(.5);
		var toY = this.world.centerY+80;
		this.Nuisance.tween = this.add.tween(this.Nuisance).to({y:'+'+toY}, 1800, Phaser.Easing.Elastic.Out);
		this.Nuisance.tweenBack = this.add.tween(this.Nuisance).to({y:0}, 3000, Phaser.Easing.Linear.None);
		this.Nuisance.tween.onComplete.add(function () {
			this.Nuisance.tweenBack.start();
		}, this);
		var self = this;
		this.Nuisance.tweenStart = function () {
			if (!self.Nuisance.tween.isRunning && !self.Nuisance.tweenBack.isRunning) {
				self.Nuisance.x = self.Player.x;
				self.Nuisance.tween.start();
			}
		};
	},

	EnemyContainer: function () {
		var keyArr = ['ToyaFace_1','ToyaFace_R'];
		this.Enemys = this.add.emitter(this.GC.position[this.rnd.integerInRange(1,4)].x+100,-300,30);
		this.Enemys.makeParticles(keyArr,null,30,true,false);
		this.Enemys.setYSpeed(300,500);
		this.Enemys.setXSpeed(0,0);
		this.Enemys.gravity = 0;
		this.Enemys.setRotation(0, 0);
		var scale = .3;
		this.Enemys.setScale(scale,scale,scale,scale);
		this.Enemys.start(false, 8000, 2000);
		var counter = 0;
		this.time.events.loop(500, function () {
			// console.log(counter);
			this.checkEnemyLogic(counter);
			this.checkNuisance();
			this.Enemys.x = this.GC.position[this.rnd.integerInRange(1,4)].x+100;
			counter++;
		}, this);
	},

	checkEnemyLogic: function (counter) {
		switch (counter) { // 2->1sec / 20->10sec
			case 20: this.Enemys.setYSpeed(500,800); break;
			case 30: this.Enemys.frequency = 1500; break;
			case 40: this.Enemys.setYSpeed(800,1200); break;
			case 50: this.Enemys.frequency = 1200; break;
			case 55: this.GC.nuisanceRate = 3; break;
			case 60: this.Enemys.setYSpeed(1000,1400); break;
			case 70: this.Enemys.frequency = 1000; break;
			case 80: this.Enemys.setYSpeed(300,1000); break;
			case 90: this.Enemys.frequency = 800; break;
			case 100: this.Enemys.setYSpeed(300,1000); break;
			case 105: this.GC.nuisanceRate = 5; break;
			case 110: this.Enemys.frequency = 1000; break;
			case 120: this.Enemys.setYSpeed(1200,1500); break;
			case 130: this.Enemys.frequency = 800; break;
			case 140: this.Enemys.setYSpeed(500,1500); break;
			case 150: this.Enemys.frequency = 600; break;
			case 155: this.GC.nuisanceRate = 8; break;
			case 180: this.Enemys.setYSpeed(1200,2000); break;
			case 200: this.Enemys.setYSpeed(1200,2200); break;
			case 250: this.Enemys.setYSpeed(1200,2800); break;
			case 255: this.GC.nuisanceRate = 10; break;
			case 300: this.Enemys.setYSpeed(1200,3500); break;
			case 350: this.GC.nuisanceRate = 30; break;
			case 400: this.Enemys.setYSpeed(1000,4000); break;
		}
	},

	checkNuisance: function () {
		if (this.GC.nuisanceRate>this.rnd.integerInRange(1,100)) this.Nuisance.tweenStart();
	},

	HUDContainer: function () {
		var HUD = {
			score:null,
			textStyle:{
				fill: this.game.const.GAME_TEXT_COLOR,
				stroke:'#FFFFFF',
				strokeThickness: 15,
				multipleStroke:this.game.const.GAME_TEXT_COLOR,
				multipleStrokeThickness: 10,
			},
		};
		this.genScoreTextSprite(HUD);
		this.genStartTextSprite(HUD);
		this.genGameOverTextSprite(HUD);
		return HUD;
	},

	genScoreTextSprite: function (HUD) {
		var s = this.game.global.SpriteManager;
		var baseText = '虚空行き: ';
		var textSprite = s.genText(this.world.centerX,this.world.height-50,baseText+this.GC.score,HUD.textStyle);
		textSprite.setAnchor(.5);
		// var self = this;
		HUD.changeScore = function (val) {
			textSprite.changeText(baseText+val);
			// self.addScoreEffect(self.GC.score, textSprite.x-100, textSprite.y+60, '+50');
		};
		HUD.score = textSprite;
	},

	genGameOverTextSprite: function (HUD) {
		var t = this.game.global.TweenManager;
		var s = this.game.global.SpriteManager;
		var baseText = '((＾ω＾≡＾ω＜ｷﾞｬｱｱｱｱｱｱｱ';
		var textStyle = __copyJson(HUD.textStyle);
		textStyle.fontSize = '90px';
		textStyle.fill = '#ff0000';
		textStyle.stroke = '#FFFFFF';
		textStyle.multipleStroke = '#FFFFFF';
		var textSprite = s.genText(this.world.width+600,this.world.centerY,baseText,textStyle);
		textSprite.hide();
		var tween = t.moveB(textSprite,{x:-600},800);
		var tween2 = t.moveB(textSprite.multipleTextSprite,{x:-600},800);
		var self = this;
		HUD.showGameOver = function (onCompFunc) {
			// self.game.global.SoundManager.play({key:'Show',volume:1,}); // TODO
			textSprite.show();
			t.onComplete(tween, function () {
				self.time.events.add(800, onCompFunc, self);
			}, self);
			tween.start();
			tween2.start();
		};
	},

	genStartTextSprite: function (HUD) {
		var t = this.game.global.TweenManager;
		var s = this.game.global.SpriteManager;
		var baseText = 'スタート！';
		var textStyle = __copyJson(HUD.textStyle);
		textStyle.fontSize = '90px';
		textStyle.fill = '#ffa500';
		textStyle.stroke = '#FFFFFF';
		textStyle.multipleStroke = '#ffa500';
		var textSprite = s.genText(this.world.centerX,this.world.centerY,baseText,textStyle);
		textSprite.setScale(0,0);
		var tween = t.popUpB(textSprite,800);
		var tween2 = t.popUpB(textSprite.multipleTextSprite,800);
		var self = this;
		HUD.showStart = function (onCompFunc) {
			t.onComplete(tween, onCompFunc, self);
			tween.start();
			tween2.start();
		};
		HUD.hideStart = function () {
			textSprite.hide();
		};
	},

	ready: function () {
		this.stopBGM();
		this.HUD.showStart(function () {
			// this.game.global.SoundManager.play({key:'Show',volume:1,}); // TODO
			this.time.events.add(1000, function () {
				this.stopBGM();
				this.HUD.hideStart();
				this.playBGM();
				this.start();
			}, this);
		});
	},

	playBGM: function () {
		return; // TODO
		var s = this.game.global.SoundManager;
		if (s.isPlaying('PlayBGM')) return;
		s.play({key:'PlayBGM',isBGM:true,loop:true,volume:.85});
	},

	stopBGM: function () {
		var s = this.game.global.SoundManager;
		if (s.isPlaying('PlayBGM')) return;
		s.stop('currentBGM');
		s.stop('TitleBGM');
	},

	start: function () {
		this.GC.isPlaying = true;
		this.GC.inputEnable = true;
		this.time.slowMotion = 1;
	},

	gameOver: function () {
		this.GC.isPlaying = false;
		this.Enemys.on = false;
		this.time.slowMotion = 3;
		this.time.events.add(2000, function () {
			this.time.slowMotion = 1;
		},this);
		this.HUD.showGameOver(this.genResultPanelContainer);
	},

	genResultPanelContainer: function () {
		var textStyle = {
			fontSize: '90px',
			fill: this.game.const.GAME_TEXT_COLOR,
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke: this.game.const.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var panelSprite = this.genPanelSprite();
		var panelTextSprite = this.genPanelTextSprite(textStyle);
		var x = this.world.centerX;
		var restartLabel = this.genRestartLabel(x);
		var tweetLabel = this.genTweetLabel(x);
		var backLabel = this.genBackLabel(x);
		this.game.global.TweenManager.onComplete(panelSprite.tweenMidDialog, function () {
			// this.game.global.SoundManager.play({key:'Result',volume:1}); // TODO
			panelTextSprite.tweenShow('popUpB',800);
			this.genPanelScoreTextSprite(0,400,textStyle);
			this.genPanelScoreTextSprite(1,400,textStyle);
			restartLabel.allShow(600);
			tweetLabel.allShow(800);
			backLabel.allShow(1000);
			this.time.slowMotion = 1;
			this.time.events.removeAll();
		}, this);
		panelSprite.tweenShow();
		return panelSprite;
	},

	genPanelSprite: function () {
		var s = this.game.global.SpriteManager;
		var panelSprite = s.genSprite(this.world.centerX, this.world.centerY, 'greySheet', 'grey_panel');
		return s.setMidDialog(panelSprite,{
			tween:'popUpB',
			duration: 800,
			scale:{x:9,y:14},
			tint:this.game.const.GAME_MAIN_COLOR_B,
		});
	},

	genPanelTextSprite: function (textStyle) {
		var s = this.game.global.SpriteManager;
		var textSprite = s.genText(this.world.centerX, 300, '結果発表', textStyle);
		textSprite.setScale(0,0);
		return textSprite;
	},

	genPanelScoreTextSprite: function (num,delay,textStyle) {
		var s = this.game.global.SpriteManager;
		var text = this.HUD.score.text;
		text = num==0?'虚空行きにしたアゴ':this.GC.score+'体';
		var textSprite = s.genText(this.world.centerX, 460+(num*120), text, textStyle);
		textSprite.setScale(0,0);
		this.game.global.TweenManager.popUpB(textSprite, 800, null, delay).start();
		this.game.global.TweenManager.popUpB(textSprite.multipleTextSprite, 800, null, delay).start();
	},

	genRestartLabel: function (x) {
		return this.genLabelTpl(x,this.world.centerY,function () {
			// this.game.global.SoundManager.play({key:'Show',volume:1,}); // TODO
			this.state.start(this.game.global.nextSceen);
		}, 'もう一度プレイ');
	},

	genTweetLabel: function (x) {
		return this.genLabelTpl(x,this.world.centerY+200,function () {
			// this.game.global.SoundManager.play({key:'Show',volume:1,}); // TODO
			this.tweet();
		}, '結果をツイート');
	},

	genBackLabel: function (x) {
		return this.genLabelTpl(x,this.world.centerY+400,function () {
			// this.game.global.SoundManager.play({key:'Show',volume:1,}); // TODO
			this.game.global.nextSceen = 'Title';
			this.state.start(this.game.global.nextSceen);
		}, 'タイトルにもどる');
	},

	genLabelTpl: function (x,y,func,text) {
		var c = this.game.const;
		var textStyle = {
			fontSize:'45px',
			fill: c.GAME_TEXT_COLOR,
			stroke:'#FFFFFF',
			strokeThickness: 20,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var s = this.game.global.SpriteManager;
		var btnSprite = s.genButton(x,y,'greySheet',func,this);
		btnSprite.setFrames('grey_button00', 'grey_button00', 'grey_button01', 'grey_button00');
		btnSprite.anchor.setTo(.5);
		btnSprite.scale.setTo(0);
		btnSprite.tint = c.GAME_MAIN_COLOR_B;
		var textSprite = s.genText(x,y,text,textStyle);
		textSprite.setScale(0,0);
		var t = this.game.global.TweenManager;
		btnSprite.allShow = function (delay) {
			delay = delay || 0;
			t.popUpB(btnSprite, 800, {x:2.3,y:2.3}, delay).start();
			t.popUpB(textSprite, 800, null, delay).start();
			t.popUpB(textSprite.multipleTextSprite, 800, null, delay).start();
		};
		btnSprite.allHide = function () {
			t.fadeOutA(btnSprite, 800).start();
			t.fadeOutA(textSprite, 800).start();
			t.fadeOutA(textSprite.multipleTextSprite, 800).start();
		};
		return btnSprite;
	},

	tweet: function () {
		var quotes = [
			'初見です　アキ君好き',
			'この度、東京21区から出馬しました剣持刀也です。たけのこ派根絶をマニフェストに頑張っていきます。よろしくお願いします',
			'ヤァァアキモリィィイイイイ！！！！🔥🔥🔥🔥🔥',
			'虚空は嫌だ……虚空は嫌だ……',
			'いっっぱぁいヴォエッ！',
			'大体の人間は産声を上げて眼を開いた瞬間からロリコンなんですよ',
			'虚空のエアプやめてもらっていいですか？',
			'虚空はこんなもんじゃない',
			'落ちる予兆が分かってきました。剣持刀也でs',
			'Vtuberって誕生してから道を模索すると思うんですけど、僕は気づいたら道が一本しかなかった。その先には雑草食べながら匍匐前進してる変な人しかいなかった',
			'SKI',
			'焼森に政治や思想を持ち込むのはナンセンスです。焼森はスポーツです',
		];
		var text = '虚空行きにしたアゴは '+this.GC.score+' 体です\n'
					+'🤔🤔🤔🤔🤔🤔\n'
					+'今日の名言「'+this.rnd.pick(quotes)+'」\n'
					+'🤔🤔🤔🤔🤔🤔\n'
					+'『'+this.game.const.GAME_TITLE+'』';
		var tweetText = encodeURIComponent(text);
		var tweetUrl = location.href;
		var tweetHashtags = '力也ゲーム,刀也ゲーム'; // 'A,B,C'
		window.open(
			'https://twitter.com/intent/tweet?text='+tweetText+'&url='+tweetUrl+'&hashtags='+tweetHashtags, 
			'share window', 
			'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
		);
		return false;
	},

	renderT: function () {
		if (this.Player) this.game.debug.body(this.Player);
		if (this.Floor) this.game.debug.body(this.Floor);
		// for (var key in this.Enemys.children) if(this.Enemys.children[key].alive) this.game.debug.body(this.Enemys.children[key]);
	},

	test: function () {
		if (__ENV!='prod') {
			if(getQuery('gameover')) this.genResultPanelContainer();
		}
	},
};