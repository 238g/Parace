Middleware=function(game,GmObj,BootCls){this.initialize(game,GmObj,BootCls)};
Middleware.prototype={
	initVar:function(){this.nextScene=null;this.glb={};},
	initialize:function(game,GmObj,BootCls){
		this.initVar();
		game.M=this;
		this.GmObj=GmObj;
		for (var c in GmObj)game.state.add(c,GmObj[c]);
		this.S=new this.SpriteManager(game,this);
		this.T=new this.TweenManager(game,this);
		this.SE=new this.SoundManager(game,this);
		this.H=new this.Helper(this);
		this.currentScene=BootCls;
		this.game=game;
		game.state.start(BootCls);
		this.setM();
	},
	BootInit: function (orientation) {
		var sc=this.gScn();
		sc.input.maxPointers=1;
		sc.stage.backgroundColor='#424242';
		sc.stage.disableVisibilityChange=!0;
		sc.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
		if(orientation){
			sc.scale.fullScreenScaleMode=Phaser.ScaleManager.EXACT_FIT;
			if (!sc.game.device.desktop) {
				sc.scale.forceOrientation(!0,!1);
				sc.scale.enterIncorrectOrientation.add(function(){document.getElementById('orientation').style.display='block';});
				sc.scale.leaveIncorrectOrientation.add(function(){document.getElementById('orientation').style.display='none';});
			}
		}else{
			sc.scale.fullScreenScaleMode=sc.game.device.desktop?Phaser.ScaleManager.SHOW_ALL:Phaser.ScaleManager.EXACT_FIT;
		}
		sc.scale.parentIsWindow=!0;
		sc.scale.refresh();
		sc.load.crossOrigin='Anonymous';
	},
	NextScene: function (nextScene) {
		this.gScn().state.start(nextScene);
		this.currentScene=nextScene;
		this.setM();
	},
	gScn:function(){return this.game.state.states[this.currentScene];},
	setM:function(){this.gScn().M=this;},
	dGlb:function(v){this.glb=v;},
	sGlb:function(k,v){this.glb[k]=v;},
	gGlb:function(k){return this.glb[k];},
};
Middleware.prototype.SpriteManager=function(game,M){this.initialize(game,M)};
Middleware.prototype.SpriteManager.prototype={
	initialize:function(game,M){this.game=game;this.M=M;},
	genBtnSp:function(x,y,k,f){
		var sc=this.M.gScn();
		var b=sc.add.button(x,y,k,f,sc);
		b.show=function(){this.visible=!0;};
		b.hide=function(){this.visible=!1;};
		return b;
	},
	genTxt:function(x,y,t,txtstyl){
		var sc=this.M.gScn();
		var ctxtstyl=txtstyl||this.txtstyl(25);
		var mtxtstyl={};
		for(var k in ctxtstyl)mtxtstyl[k]=ctxtstyl[k];
		mtxtstyl.fill=ctxtstyl.mStroke;
		mtxtstyl.stroke=ctxtstyl.mStroke;
		mtxtstyl.strokeThickness=ctxtstyl.strokeThickness+ctxtstyl.mStrokeThickness;
		var mts=sc.add.text(x,y,t,mtxtstyl);
		mts.lineSpacing=-ctxtstyl.mStrokeThickness;
		mts.anchor.setTo(.5);
		var ts=sc.add.text(0,0,t,ctxtstyl);
		ts.anchor.setTo(.5);
		mts.addChild(ts);
		mts.show=function(){this.visible=!0;};
		mts.hide=function(){this.visible=!1;};
		mts.changeText=function(t){
			this.setText(t);
			this.children[0].setText(t);
		};
		mts.changeStyle=function(txtstyl){
			this.children[0].setStyle(txtstyl);
			txtstyl.fill=txtstyl.mStroke;
			txtstyl.stroke=txtstyl.mStroke;
			txtstyl.strokeThickness=txtstyl.strokeThickness+txtstyl.mStrokeThickness;
			this.setStyle(txtstyl);
		};
		return mts;
	},
	genLbl:function(x,y,f,t,txtstyl,op={}){
		var b=this.genBtnSp(x,y,'greySheet',f);
		b.anchor.setTo(.5);
		b.setFrames('grey_button00','grey_button00','grey_button01','grey_button00');
		b.tint=op.tint||this.M.GmObj.MAIN_TINT||0xffffff;
		var ts=this.genTxt(0,0,t,txtstyl);
		b.addChild(ts);
		return b;
	},
	txtstyl:function(fs){
		var g=this.M.GmObj;
		var f=g.MAIN_TEXT_COLOR||'#FFFFFF';
		return {
			fontSize:fs||25,
			fill:f,
			align:'center',
			stroke:g.WHITE_COLOR||'#000000',
			strokeThickness:8,
			mStroke:g.MAIN_STROKE_COLOR||f,
			mStrokeThickness:5,
		};
	},
	txtstylS:function(fs){
		var g=this.M.GmObj;
		var f=g.MAIN_TEXT_COLOR||'#FFFFFF';
		return {
			fontSize:fs||25,
			fill:f,
			align:'center',
			stroke:g.WHITE_COLOR||'#000000',
			strokeThickness:5,
			mStroke:g.MAIN_STROKE_COLOR||f,
			mStrokeThickness:3,
		};
	},
	genBmpSqrSp: function (x,y,w,h,f) {
		var sc=this.M.gScn();
		var b=sc.add.bitmapData(w,h);
		b.ctx.fillStyle=f;
		b.ctx.beginPath();
		b.ctx.rect(0,0,w,h);
		b.ctx.fill();
		b.update();
		return sc.add.sprite(x,y,b);
	},
	genBmpCclSp: function (x,y,r,f) {
		var sc=this.M.gScn();
		var b=sc.add.bitmapData(r,r);
		var hr=r*.5;
		b.circle(hr,hr,hr,f);
		return sc.add.sprite(x,y,b);
	},
	genVolBtn:function(x,y){
		var sc=this.M.gScn();
		var s=this.genBtnSp(x,y,'VolumeIcon',this.onDownVolBtn);
		s.anchor.setTo(.5);
		s.scale.setTo(.5);
		var f=sc.sound.mute?'VolumeMute':(sc.sound.volume==1)?'VolumeMax':'VolumeHalf';
		s.setFrames(f,f,f,f);
	},
	onDownVolBtn:function(s){
		var sc=this.M.gScn();
		var f;
		if(sc.sound.mute){
			f='VolumeMax';
			sc.sound.mute=!1;
			sc.sound.volume=1;
		}else{
			if(sc.sound.volume==1){
				f='VolumeHalf';
				sc.sound.volume=.5;
			}else{
				f='VolumeMute';
				sc.sound.volume=0;
				sc.sound.mute=!0;
			}
		}
		s.setFrames(f,f,f,f);
	},
	gebFlScBtn:function(x,y){
		var sc=this.M.gScn();
		var i=sc.scale.isFullScreen?'smaller':'larger';
		var s=this.M.S.genBtnSp(x,y,'GameIconsWhite',this.onDonwFlScBtn,sc);
		s.tint=0x000000;
		s.setFrames(i,i,i,i);
		s.anchor.setTo(.5);
		s.scale.setTo(.5);
	},
	onDonwFlScBtn:function(s){
		var sc=this.M.gScn();
		if (sc.scale.isFullScreen) {
			var i='larger';
			sc.scale.stopFullScreen(!1);
		} else {
			var i='smaller';
			sc.scale.startFullScreen(!1);
		}
		s.setFrames(i,i,i,i);
	},
	loadLoadingAssets:function(){
		var sc=this.M.gScn();
		sc.load.atlasXML('greySheet','images/public/sheets/greySheet.png','images/public/sheets/greySheet.xml');
		sc.load.atlasXML('GameIconsWhite','images/public/sheets/GameIconsWhite.png','images/public/sheets/GameIconsWhite.xml');
		sc.load.atlasJSONHash('VolumeIcon','images/public/VolumeIcon/VolumeIcon.png','images/public/VolumeIcon/VolumeIcon.json');
	},
	genLoading:function(){
		this.genLoadAnim();
		this.genLoadTxt();
	},
	genLoadAnim:function(){
		var sc=this.M.gScn();
		var s=sc.add.sprite(sc.world.centerX,sc.world.centerY,'loading');
		s.anchor.setTo(.5);
		s.scale.setTo(1.5);
		s.animations.add('loading').play(18,!0);
	},
	genLoadTxt: function () {
		var sc=this.M.gScn();
		var ts=this.genTxt(sc.world.centerX,sc.world.height*.7,'0%',this.txtstyl(30));
		ts.anchor.setTo(.5);
		sc.load.onFileComplete.add(function(progress){this.changeText(progress+'%');},ts);
	},
	loadCmpl:function(){
		var sc=this.M.gScn();
		var j=(sc.game.device.touch)?'タッチ':'クリック';
		var e=(sc.game.device.touch)?'TOUCH':'CLICK';
		this.M.sGlb('TOUCH_OR_CLICK',j);
		this.M.sGlb('EN_TOUCH_OR_CLICK',e);
		sc.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.H.setSPBrowserColor(BasicGame.MAIN_COLOR);
		this.genTxt(sc.world.centerX,sc.world.height*.85,j+'してスタート\n'+e+' TO PLAY',this.txtstyl(25));
	},
};
Middleware.prototype.TweenManager=function(game,M){this.initialize(game,M)};
Middleware.prototype.TweenManager.prototype={
	initialize:function(game,M){this.game=game;this.M=M;},
	// [duration, delay]
	beatA:function(t,op={}){return this.M.gScn().add.tween(t.scale).to({x:'+.1',y:'+.1'},op.duration, Phaser.Easing.Sinusoidal.Out,!1,op.delay,-1,!0)},
	// xy[, duration, delay]
	pointingA:function(t,op={}){return this.M.gScn().add.tween(t).to(op.xy,op.duration,Phaser.Easing.Sinusoidal.Out,!1,op.delay,-1,!0)},
	// [duration, scale, delay]
	popUpA:function(t,op={}){
		op.scale=op.scale||{};
		return this.M.gScn().add.tween(t.scale).to({x:(op.scale.x||1),y:(op.scale.y||1)},op.duration,Phaser.Easing.Sinusoidal.Out,!1,op.delay);
	},
	// [duration, scale, delay]
	popUpB:function(t,op={}){
		op.scale=op.scale||{};
		return this.M.gScn().add.tween(t.scale).to({x:(op.scale.x||1),y:(op.scale.y||1)},op.duration,Phaser.Easing.Back.Out,!1,op.delay);
	},
	// easing[, duration, scale, delay]
	popUpX:function(t,op={}){
		op.scale=op.scale||{};
		return this.M.gScn().add.tween(t.scale).to({x:(op.scale.x||1),y:(op.scale.y||1)},op.duration,op.easing,!1,op.delay);
	},
	// xy[, duration, delay]
	moveA:function(t,op={}){return this.M.gScn().add.tween(t).to(op.xy,op.duration,Phaser.Easing.Back.Out,!1,op.delay)},
	// xy[, duration, delay]
	moveB:function(t,op={}){return this.M.gScn().add.tween(t).to(op.xy,op.duration,Phaser.Easing.Linear.None,!1,op.delay)},
	// xy[, duration, delay] // loop yoyo
	moveC:function(t,op={}){return this.M.gScn().add.tween(t).to(op.xy,op.duration,Phaser.Easing.Cubic.Out,!1,op.delay,-1,!0)},
	// xy[, duration, delay]
	moveD:function(t,op={}){return this.M.gScn().add.tween(t).to(op.xy,op.duration,Phaser.Easing.Bounce.Out,!1,op.delay)},
	// xy, easing[, duration, delay]
	moveX:function(t,op={}){return this.M.gScn().add.tween(t).to(op.xy,op.duration,op.easing,!1,op.delay)},
	// [duration, delay]
	fadeInA:function(t,op={}){return this.M.gScn().add.tween(t).to({alpha:op.alpha||1}, op.duration,Phaser.Easing.Linear.None,!1,op.delay)},
	// [duration, delay]
	fadeOutA:function(t,op={}){return this.M.gScn().add.tween(t).to({alpha:0},op.duration,Phaser.Easing.Linear.None,!1,op.delay)},
	// [alpha, duration, delay, yoyo, repeat]
	fadeOutB:function(t,op={}) {
		var t=this.M.gScn().add.tween(t).to({alpha:op.alpha||0},op.duration,Phaser.Easing.Exponential.Out,!1,op.delay);
		if(op.yoyo)t.yoyo(!0);
		if(op.repeat)t.repeat(op.repeat);
		return t;
	},
	// [durations, delay]
	stressA:function(t,op={}){
		var sc=this.M.gScn();
		durations=op.durations||[200,100];
		delay=op.delay||500;
		var startTween=sc.add.tween(t.scale).to({x:'+.1'},durations[0],Phaser.Easing.Linear.None,false,delay);
		t.endTween=sc.add.tween(t.scale).to({x:'-.1'},durations[0],Phaser.Easing.Linear.None);
		var yoyoTween=sc.add.tween(t).to({angle:5},durations[1],Phaser.Easing.Linear.None,false,0,2,true);
		startTween.chain(yoyoTween);
		startTween.onComplete.add(function(){this.angle=-5;},t);
		yoyoTween.onComplete.add(function(){this.angle=0;t.endTween.start()},t);
		t.endTween.onComplete.add(function(){this.start();},startTween);
		return startTween;
	},
	// [duration, delay]
	slideshow:function(g,op){
		var bs=g.getTop();
		bs.alpha=1;
		var ns=g.getBottom();
		g.bringToTop(ns);
		var t=this.fadeInA(ns,op);
		t.onComplete.add(function(){this.alpha=0},bs);
		t.onComplete.add(function(){this.slideshow(g,op)},this);
		t.start();
	},
};
Middleware.prototype.SoundManager=function(game,M){this.initialize(game,M)};
Middleware.prototype.SoundManager.prototype={
	initialize:function(game,M){this.sounds={currentBGM:null};this.game=game;this.M=M;},
	setSounds:function(s){for(var k in s)this.sounds[k]=this.game.add.audio(k);},
	play:function(k,op={}) {
		var s=this.sounds[k];
		if(op.loop)s.loop=!0;
		if(op.volume)s.volume=op.volume;
		if(op.isBGM)this.sounds.currentBGM=s;
		s.play();
		return s;
	},
	playBGM:function(k,op={}){
		if(this.isPlaying(k))return;
		this.stop('currentBGM');
		return this.play(k,{isBGM:!0,loop:!0,volume:op.volume});
	},
	stop:function(k){this.isPlaying(k)&&this.sounds[k].stop();},
	setVolume:function(k,v){this.sounds[k].volume=v;},
	fadeOut:function(k,d){this.isPlaying(k)&&this.sounds[k].fadeOut(d);},
	isPlaying:function(k){
		var s=this.getSound(k);
		return s?s.isPlaying:!1;
	},
	getSound:function(k){return this.sounds[k]||!1;},
};
Middleware.prototype.Helper=function(M){this.initialize(M)};
Middleware.prototype.Helper.prototype={
	initialize:function(M){this.M=M;},
	getQuery:function(key){
		var q=window.location.search.slice(1).split('&');
		for(var i in q){
			var a=q[i].split('=');
			if(key==a[0]) return a[1];
		}
		return !1;
	},
	getYmd:function(){
		var d=new Date();
		return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+(d.getDate())).slice(-2);
	},
	setSPBrowserColor:function(color){if(document.getElementsByName('theme-color'))document.getElementsByName('theme-color')[0].setAttribute('content',color)},
	formatComma:function(v){return String(v).replace(/(\d)(?=(\d{3})+$)/g,'$1,')},
	copyJson:function(o){
		var n={};
		for(var k in o)n[k]=o[k];
		return n;
	},
	mergeJson:function(from,to){
		for(var k in from)to[key]=from[k];
		return to;
	},
	getRndItemsFromArr:function(arr,count){
		var r=arr.slice();
		for (var i=ta.length;i>count;i--) Phaser.ArrayUtils.removeRandomItem(r);
		return Phaser.ArrayUtils.shuffle(r);
	},
	// hashtags:'A,B,C'
	tweet:function(text,hashtags,tweetUrl){
		tweetUrl=tweetUrl||location.href;
		window.open(
			'https://twitter.com/intent/tweet?text='+encodeURIComponent(text)+'&url='+tweetUrl+'&hashtags='+encodeURIComponent(hashtags),
			'share window', 
			'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600'
		);
		return !1;
	},
	splice1:function(arr,location){
		var l=arr.length;
		if (l){
			while(location<l)arr[location++]=arr[location];
			--arr.length;
		}
	},
	changeTtl:function(t){
		document.title=t;
		this.M.GmObj.GAME_TITLE=t;
		document.getElementsByName('apple-mobile-web-app-title')[0].setAttribute('content',t);
	},
};
