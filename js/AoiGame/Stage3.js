BasicGame.Stage3=function(){};
BasicGame.Stage3.prototype={
	init:function () { 
		this.isPlaying=this.isMovingPointer=!1;
		this.gaugeQuantity=5;
		this.pointerSpeed=3;
	},

	create:function () {
		this.time.events.removeAll();
		this.stage.backgroundColor=BasicGame.WHITE_COLOR;
		this.playBGM();
		
		this.gaugeRight=this.world.centerX*1.5;
		this.gaugeLeft=this.world.centerX*.5;
		this.gaugeLength=this.gaugeRight-this.gaugeLeft;
		this.gaugeHalfLength=this.gaugeLength*.5;
		console.log(this.gaugeHalfLength);

		/////
		this.M.S.genBmpSprite(this.gaugeLeft,this.world.centerY-50,this.gaugeLength,100,'#00ff00');
		this.M.S.genBmpSprite(this.gaugeLeft,this.world.centerY-50,this.gaugeLength*.5,100,'#ff0000');
		/////


		this.GaugePointer = this.add.sprite(this.gaugeLeft+20,this.world.centerY,'Particle');
		this.GaugePointer.anchor.setTo(.5);
		this.movePointerX = this.time.physicsElapsedMS*.0625*this.pointerSpeed;

		this.input.onDown.add(function(){
			if(this.isMovingPointer) {
				var x = Math.abs(this.GaugePointer.x-this.world.centerX);
				// OR (this.gaugeRight+this.gaugeLeft)*.5
				this.isMovingPointer=!1;
				var score = this.gaugeHalfLength-x;
				console.log('score '+score);
				console.log('percent '+(this.gaugeLength/score));

				this.gaugeQuantity--;
				if (this.gaugeQuantity==0) {
					return this.end();
				} else {
					// TODO text animation
					this.time.events.add(500,function () {
						this.isMovingPointer=!0;
					}, this);
				}
			}
		},this);



		this.start(); // TODO del
		this.test();
	},

	update: function () {
		if (this.isPlaying) {
			if (this.isMovingPointer) {
				this.GaugePointer.x+=this.movePointerX;
				if (this.GaugePointer.x>this.gaugeRight) {
					this.movePointerX=-this.time.physicsElapsedMS*.0625*this.pointerSpeed;
					// this.movePointerX=-1;
				}
				if (this.GaugePointer.x<this.gaugeLeft) {
					this.movePointerX=this.time.physicsElapsedMS*.0625*this.pointerSpeed;
					// this.movePointerX=1;
				}
			}
		}
	},

	playBGM: function () {
		return; // TODO
		if (this.M.SE.isPlaying('PlayBGM')) return;
		this.M.SE.stop('currentBGM');
		this.M.SE.stop('TitleBGM');
		this.M.SE.play('PlayBGM',{isBGM:!0,loop:!0,volume:1});
	},

	start: function () {
		this.isPlaying=!0;
		this.isMovingPointer=!0;
	},

	end: function () {

	},

	test: function () {
		if(__ENV!='prod'){
			this.game.debug.font='40px Courier';this.game.debug.lineHeight=100;
			this.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function(){this.end();},this);
			this.M.H.getQuery('mute')&&(this.sound.mute=!0);
		}
	},
};
