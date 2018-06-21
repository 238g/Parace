BasicGame.Play.prototype.genContents=function(){
	console.log(this);
	this.centerX=this.camera.width*.5;
	this.centerY=this.camera.height*.5;


	var scene=['A','B','C','D']; // GrpName
	var SceneInfo={};

	for(var i=0;i<scene.length;i++){
		SceneInfo[i]={};
		var info=SceneInfo[i];
		var h=this.world.height*i;
		info.h=h;

		var grpName=scene[i];
		this[grpName]=this.add.group();
		this[grpName].y=h;
		info.grpName=grpName;

	}

	console.log(SceneInfo);

	this.world.setBounds(0,0,this.world.width,this.world.height*scene.length);


	//// for TEST
	var aaa=0;
	this.input.onDown.add(function(){
		this.camera.y=SceneInfo[aaa].h;
		aaa++;
		if(aaa==scene.length){aaa=0;}
	},this);
	//// for TEST



	for(var k in SceneInfo){
		var grpName=SceneInfo[k].grpName;
		var s=this.M.S.genBmpSprite(0,0,80,80,'#0000ff');
		s.anchor.setTo(.5);
		this[grpName].add(s);

		var t=this.M.S.genTextM(this.centerX,this.centerY,grpName,this.M.S.BaseTextStyleS(80));
		this[grpName].add(t);
	}





	// this.M.S.genBmpSprite(0,0,100,100,'#ff00ff').anchor.setTo(.5);
	// this.M.S.genBmpSprite(this.world.centerX,this.world.centerY,100,100,'#ff00ff').anchor.setTo(.5);
	// this.M.S.genBmpSprite(this.world.width,this.world.height,100,100,'#ff00ff').anchor.setTo(.5);


	// this.M.S.genBmpSprite(0,0,80,80,'#0000ff').anchor.setTo(.5);
	// this.M.S.genBmpSprite(this.camera.width*.5,this.camera.height*.5,80,80,'#0000ff').anchor.setTo(.5);
	this.M.S.genBmpSprite(this.camera.width,this.camera.height,80,80,'#0000ff').anchor.setTo(.5);


};