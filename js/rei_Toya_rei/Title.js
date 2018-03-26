BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.inputEnabled = false;
		this.burstEmitter = null;
		this.bgEmitterLeft = null;
		this.bgEmitterRight = null;
		this.btnGroup = null;
	},

	create: function () {
		this.physicsController();
		this.BgContainer();
		this.BtnContainer();
		this.soundController();
		this.inputController();
		this.EffectContainer();
	},

	inputController: function () {
		this.time.events.add(800, function () {
			this.inputEnabled = true; 
		}, this);
	},

	soundController: function () {
		var s = this.game.global.SoundManager;
		s.stop('currentBGM');
		this.time.events.add(500, function () {
			s.stop('currentBGM');
			s.play({key:'TitleBGM',isBGM:true,loop:true,volume:.9});
		}, this);
		this.time.events.add(1200, function () {
			if (s.isPlaying('TitleBGM')) return;
			s.stop('currentBGM');
			s.play({key:'TitleBGM',isBGM:true,loop:true,volume:.9});
		});
	},

	physicsController: function () {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.enableBody = true;
	},

	update: function () {
		this.physics.arcade.collide(this.bgEmitterLeft,this.bgEmitterRight);
		this.physics.arcade.collide(this.bgEmitterLeft,this.btnGroup);
		this.physics.arcade.collide(this.bgEmitterRight,this.btnGroup);
		this.physics.arcade.collide(this.bgEmitterLeft,this.burstEmitter);
		this.physics.arcade.collide(this.bgEmitterRight,this.burstEmitter);
	},

	BgContainer: function () {
		this.stage.backgroundColor = '#ffffff';
		this.genBgSprite();
		this.genBgEmitter();
		this.genTitleTextSprite();
	},

	genBgSprite: function () {
		var sprite = this.add.sprite(this.world.centerX,this.world.centerY,'Toya_1');
		sprite.anchor.setTo(.5);
		sprite.scale.setTo(3);
	},

	genBgEmitter: function () {
		var y = 600;
		this.bgEmitterLeft = this.add.emitter(50,y);
		this.bgEmitterLeft.bounce.setTo(.5,.5);
		this.bgEmitterLeft.setXSpeed(100,200);
		this.bgEmitterLeft.setYSpeed(-50,50);
		this.bgEmitterLeft.setScale(.1,.1,.1,.1);
		this.bgEmitterLeft.makeParticles('ToyaFace_1',0,250,true,true);
		this.bgEmitterLeft.start(false,8000,20);
		this.bgEmitterRight = this.add.emitter(this.world.width-50,y);
		this.bgEmitterRight.bounce.setTo(.8,.8);
		this.bgEmitterRight.setXSpeed(-100,-200);
		this.bgEmitterRight.setYSpeed(-50,50);
		this.bgEmitterRight.setScale(.1,.1,.1,.1);
		this.bgEmitterRight.makeParticles('ToyaFace_1',0,250,true,true);
		this.bgEmitterRight.start(false,8000,20);
	},

	EffectContainer: function () {
		this.burstEmitter = this.add.emitter(0,0,500);
		this.burstEmitter.makeParticles('ToyaFace_1',0,500,true,true);
		this.burstEmitter.gravity = 200;
		this.burstEmitter.setScale(.1,.3,.1,.3);
		this.input.onDown.add(function (pointer) {
			this.burstEmitter.x = pointer.x;
			this.burstEmitter.y = pointer.y;
			this.burstEmitter.explode(4000, 10);
			this.game.global.SoundManager.play({key:'Hit',volume:1});
		}, this);
	},

	genTitleTextSprite: function () {
		var s = this.game.global.SpriteManager;
		var c = this.game.const;
		var textStyle = {
			fontSize: 60,
			fill: c.GAME_TEXT_COLOR,
			stroke: '#FFFFFF',
			strokeThickness: 20,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var textSprite = s.genText(this.world.centerX+100,this.world.centerY+250,c.GAME_TITLE,textStyle);
		this.game.global.TweenManager.beatA(textSprite,180).start();
		this.game.global.TweenManager.beatA(textSprite.multipleTextSprite,180).start();
	},

	BtnContainer: function () {
		this.btnGroup = this.add.group();
		var x = this.world.width/4;
		var y = this.world.centerY+400;
		var margin = 150;
		this.genStartBtnSprite(x*this.rnd.integerInRange(1,3),y);
		this.genMuteBtnSprite(x,60);
		this.genFullScreenBtnSprite(x*3,80);
		this.genInquiryBtnSprite(x*this.rnd.integerInRange(1,3),y+margin*2+30);
	},

	genStartBtnSprite: function (x,y) {
		var text = 'スタート';
		this.genLabel(x,y,this.play,text);
	},

	genMuteBtnSprite: function (x,y) {
		var offText = 'ミュートOFF';
		var onText = 'ミュートON';
		var text = this.sound.mute ? offText : onText;
		this.genLabel(x,y,function (pointer) {
			if (this.sound.mute) {
				pointer.textSprite.changeText(onText);
				this.sound.mute = false;
			} else {
				pointer.textSprite.changeText(offText);
				this.sound.mute = true;
			}
		},text);
	},

	genFullScreenBtnSprite: function (x,y) {
		var offText = 'フルスクリーンOFF';
		var onText = 'フルスクリーンON';
		var text = this.scale.isFullScreen ? offText : onText;
		this.genLabel(x,y,function (pointer) {
			if (this.scale.isFullScreen) {
				pointer.textSprite.changeText(onText);
				this.scale.stopFullScreen(false);
			} else {
				pointer.textSprite.changeText(offText);
				this.scale.startFullScreen(false);
			}
		},text,true);
	},

	genLabel: function (x,y,func,text,specialFlag) {
		var c = this.game.const;
		var textStyle = {
			fontSize: '43px',
			fill: c.GAME_TEXT_COLOR,
			stroke: '#FFFFFF',
			strokeThickness: 20,
			multipleStroke: c.GAME_TEXT_COLOR,
			multipleStrokeThickness: 20,
		};
		var s = this.game.global.SpriteManager;
		var labelSprite = s.genSprite(x,y,'greySheet','grey_button00');
		this.btnGroup.add(labelSprite);
		var scale = specialFlag?2.2:this.rnd.integerInRange(18,22)*.1;
		labelSprite.scale.setTo(scale);
		labelSprite.anchor.setTo(.5);
		labelSprite.tint = c.GAME_MAIN_COLOR_B;
		labelSprite.UonInputDown(func,this);
		labelSprite.body.immovable = true;
		var textSprite = s.genText(x,y,text,textStyle);
		labelSprite.textSprite = textSprite;
		return labelSprite;
	},

	genInquiryBtnSprite: function (x,y) {
		var text = 'お問い合わせ';
		this.genLabel(x,y,function () {
			window.open('https://twitter.com/'+__DEVELOPER_TWITTER_ID,'_blank');
		},text);
	},

	play: function () {
		if (this.inputEnabled) {
			this.game.global.nextSceen = 'Play';
			this.state.start(this.game.global.nextSceen);
		}
	},
};
