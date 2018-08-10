BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;

		this.AbdominalMuscles=
		null;
	},
	create:function(){
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000000';
		// this.M.SE.playBGM('PlayBGM',{volume:1});

		this.genContents();

		var sp=this.rnd.pick(this.AbdominalMuscles.children.filter(function(s){return!s.alive;}));
		sp.reset(this.world.centerX,this.world.centerY);


		this.start();
		this.tes();
	},
	update:function(){
		if(this.isPlaying){
			if(this.input.activePointer.isDown){
				// console.log(this.input.x,this.input.y);

				this.AbdominalMuscles.forEachAlive(function(s){
					var a=s.input.checkPointerOver(this.input.activePointer);
					if(a){
						s.alive=!1;
						this.grabMuscle(s);
					}
				},this);
			}
		}
	},
	start:function(){
		this.isPlaying=!0;
	},
	end:function(){
		this.isPlaying=!1;
	},
	tes:function(){
		if(__ENV!='prod'){
			this.input.keyboard.addKey(Phaser.Keyboard.E).onDown.add(this.end,this);
		}
	},
	////////////////////////////////////// PlayContents
	genContents:function(){
		this.AbdominalMuscles=this.add.group();
		this.AbdominalMuscles.createMultiple(3,'AbdominalMuscle');
		this.AbdominalMuscles.forEach(function(s){
			s.anchor.setTo(.5);
			s.inputEnabled=!0;
		},this);
	},
	grabMuscle:function(s){
		var twA=this.add.tween(s.scale).to({x:.7},500,Phaser.Easing.Exponential.Out,!0);
		var twB=this.add.tween(s.scale).to({x:1},300,Phaser.Easing.Quartic.In);
		twA.onComplete.add(function(){this.start()},twB);
		//TODO adjust -100 y / distance...
		var twC=this.add.tween(s).to({y:'-100'},800,Phaser.Easing.Back.Out,!0);
		var twD=this.add.tween(s).to({x:this.world.width*.9,y:this.world.height*.1},800,Phaser.Easing.Quartic.Out);
		var twE=this.add.tween(s.scale).to({x:0,y:0},800,Phaser.Easing.Linear.None);
		twC.onComplete.add(function(){this.start()},twD);
		twC.onComplete.add(function(){this.start()},twE);
		twE.onComplete.add(function(){this.kill();this.scale.setTo(1)},s);
		twE.onComplete.add(this.getMuscle,this);
	},
	getMuscle:function(){
		console.log('GET!! muscle count++');


		// TODO del
		var sp=this.rnd.pick(this.AbdominalMuscles.children.filter(function(s){return!s.alive;}));
		sp.reset(this.world.centerX,this.world.centerY);
	},
};
