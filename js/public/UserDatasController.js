UserDatasController = function (storageName) { this.constructor(storageName); };
UserDatasController.prototype = {
	storageName: null,
	userDatas: null,
	constructor: function (storageName) {
		this.storageName = storageName;
		this.userDatas = JSON.parse(localStorage.getItem(this.storageName)) || {};
	},
	init: function (newPath, val, oldPath) {
		this.userDatas[newPath] = val;
		if (oldPath) {
			this.copyUserDatas(oldPath, newPath);
		}
		localStorage.setItem(this.storageName, JSON.stringify(this.userDatas));
		return this.userDatas;
	},
	gen: function (path, key) {
		var paths = path.split('/');
		var digData = this.userDatas;
		for (var i=0;i<paths.length;i++) {
			if (!digData[paths[i]]) {
				digData[paths[i]] = {};
			}
			if (i == paths.length-1) {
				digData[paths[i]][key] = null;
				break;
			}
			digData = digData[paths[i]];
		}
		localStorage.setItem(this.storageName, JSON.stringify(this.userDatas));
	},
	set: function (path, val) {
		var paths = path.split('/');
		var digData = this.userDatas;
		for (var i=0;i<paths.length;i++) {
			if (i == paths.length-1) {
				digData[paths[i]] = val;
				break;
			}
			digData = digData[paths[i]];
		}
		localStorage.setItem(this.storageName, JSON.stringify(this.userDatas));
	},
	get: function (path) {
		if (path) {
			var paths = path.split('/');
			var digData = this.userDatas;
			for (var i=0;i<paths.length;i++) {
				if (!digData || !digData[paths[i]]) {
					return false;
				}
				if (i == paths.length-1) {
					return digData[paths[i]];
				}
				digData = digData[paths[i]];
			}
		}
		return this.userDatas || false;
	},
	copyUserDatas: function (oldPath, newPath) {
		// TODO
	}
};