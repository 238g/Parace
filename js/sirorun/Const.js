BasicGame.Boot.prototype.defineConst = function () {
	this.game.const = {
		// This is name of local storage
		STORAGE_NAME: '5e8bbc4da006a3853586ea41751ac05e',
		// GameInfo
		STAGE_1: 1,
		STAGE_2: 2,
		STAGE_3: 3,
		STAGE_4: 4,
		STAGE_5: 5,
		DAYTIME_COLOR: 0xffffff,
		EVENING_COLOR: 0xff7f50,
		NIGHT_COLOR: 0x483d8b,
		TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
		EN_TOUCH_OR_CLICK: (this.game.device.touch)?'TOUCH':'CLICK',
	};
};