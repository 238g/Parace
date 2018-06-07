BasicGame.Boot.prototype.LevelInfo = function () {
	return {
		1:{RotSpeed:1,ChangeSpeed:0,Res:!1,GoalCount:3,RotDir:1,StuckBlades:[180]},
		2:{RotSpeed:1,ChangeSpeed:0,Res:!1,GoalCount:3,RotDir:1,StuckBlades:[0,180]},
		3:{RotSpeed:1,ChangeSpeed:0,Res:!1,GoalCount:3,RotDir:-1,StuckBlades:[180]},
		4:{RotSpeed:1,ChangeSpeed:0,Res:!1,GoalCount:3,RotDir:-1,StuckBlades:[0,180]},
		5:{RotSpeed:1,ChangeSpeed:0,Res:!0,GoalCount:4,RotDir:1,StuckBlades:[0,180]},

		// level 50 _ per 5 _ result
	};
};

// RotSpeed: default 1
// ChangeSpeed: pattern0...
// Res: showResult T/F
// RotDir: 1=clockwise, -1=Counterclockwise
// StuckBlades: North 0, West 90, South 180, East 270
