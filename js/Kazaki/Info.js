BasicGame.Boot.prototype.genStageInfo=function(){
	return {
		1:{
			notes:this.genNotes(1),
		},
		2:{
			notes:this.genNotes(2),
		},
		3:{
			notes:this.genNotes(3),
		},
		4:{
			notes:this.genNotes(4),
		},
		5:{
			notes:this.genNotes(5),
		},
		6:{
			notes:this.genNotes(6),
		},
	};
};
BasicGame.Boot.prototype.genWords=function(){
	return {
		jp:{
			Start:'START',
			OtherGames:'他のゲーム',
			Back:'もどる',
			Again:'もういちど',
			HowTo:'',
			Tweet:'結果をツイート',
			TweetTtl:'『'+BasicGame.GAME_TITLE+'』で遊んだよ！',
			Clear:'',
		},
		en:{},//TODO
	};
};
BasicGame.Boot.prototype.genNotes=function(num){
	var a;
	switch(num){
		case 1:
			a='0000'
			+''
			+'';
			break;
		case 2:
			a=''
			+''
			+'';
			break;
		case 3:
			a=''
			+''
			+'';
			break;
		case 4:
			a=''
			+''
			+'';
			break;
		case 5:
			a=''
			+''
			+'';
			break;
		case 6:
			a=''
			+''
			+'';
			break;
	}
	return a;
};