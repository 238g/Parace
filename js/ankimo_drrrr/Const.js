BasicGame.Boot.prototype.defineConst = function () {
	this.game.const = {
		// local storage name
		STORAGE_NAME: '421d0f19b06fee899f2a839336e0bf37',
		// GameInfo
		ENEMY_MAX_COUNT: 7,
		TOUCH_OR_CLICK: (this.game.device.touch)?'タッチ':'クリック',
		EN_TOUCH_OR_CLICK: (this.game.device.touch)?'TOUCH':'CLICK',
	};
};