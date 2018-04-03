BasicGame.Title = function () {};
BasicGame.Title.prototype = {
	init: function () {
		this.GC = null;
	},

	create: function () {
		this.GC = this.GameController();
		this.Panel = this.PanelContainer();
		this.inputController();
		this.test();
	},

	GameController: function () {
		return {
			inputPosX: 0,
		};
	},

	PanelContainer: function () {
		var Games = this.M.getConf('Games');
		console.log(Games);
	},

	inputController: function () {
		this.game.input.onDown.add(function (pointer/*,event*/) {
			this.GC.inputPosX = pointer.x;
		},this);
		this.game.input.onUp.add(function (pointer/*,event*/) {
			if (pointer.y<50 || pointer.y>this.world.height-50 
			|| pointer.x<50 || pointer.x>this.world.width-50) return;
			if (pointer.x+100<this.GC.inputPosX) console.log('left');
			if (pointer.x-100>this.GC.inputPosX) console.log('right');
			console.log(this.GC.inputPosX,pointer.x);
		}, this);
	},

	test: function () {
		var moveMargin = 300;
		var x = this.world.centerX+moveMargin;
		var y = 500;
		var scaleX = .2;
		var scaleY = .8;
		var sprite = this.M.S.genSprite(x,y,'greySheet','grey_panel');
		sprite.anchor.setTo(.5);
		sprite.scale.setTo(scaleX,scaleY);
		var textStyle = { 
			fontSize: '50px', 
			fill: '#000000', 
			align: 'center', 
			stroke: '#ffffff', 
			strokeThickness: 10, 
			multipleStroke: '#000000',
			multipleStrokeThickness: 10,
		};
		var labelReset = this.M.S.BasicGrayLabel(this.world.centerX,100,function () {
			sprite.anchor.setTo(.5);
			sprite.scale.setTo(scaleX,scaleY);
			sprite.x = x;
			sprite.y = y;
		},'Reset',textStyle);
		var duration = 600;
		var labelLeft = this.M.S.BasicGrayLabel(200,this.world.height-200,function () {
			// TODO? slideupin/slidedownout
			this.M.T.moveX(sprite,{
				xy:{x:this.world.centerX-moveMargin},
				easing:Phaser.Easing.Quartic.InOut,
				duration: duration,
			}).start();
			this.M.T.popUpX(sprite,{
				scale:{x:scaleX,y:scaleY},
				easing:Phaser.Easing.Quartic.In,
				duration: duration,
			}).start();
		},'left',textStyle);
		var labelRight = this.M.S.BasicGrayLabel(this.world.width-200,this.world.height-200,function () {
			this.M.T.moveX(sprite,{
				xy:{x:this.world.centerX},
				easing:Phaser.Easing.Quartic.InOut,
				duration: duration,
			}).start();
			this.M.T.popUpX(sprite,{
				scale:{x:3,y:5},
				easing:Phaser.Easing.Back.Out,
				duration: duration,
			}).start();
		},'right',textStyle);

	},
};
