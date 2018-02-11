function getQuery (key) {
	var querys = window.location.search.slice(1).split('&');
	for (var i in querys) {
		var arr = querys[i].split('=');
		var queryKey = arr[0];
		var queryVal = arr[1];

		if (key == queryKey) {
			return queryVal;
		}
	}

	return false;
}

function getYmd () {
	var Y = new Date().getFullYear();
	var m = ('0'+(new Date().getMonth()+1)).slice(-2);
	var d = ('0'+(new Date().getDate())).slice(-2);
	return Y+'-'+m+'-'+d;
}

userDatasController = function (storageName) {
	this.init(storageName);
};
userDatasController.prototype = {
	init: function (storageName) {
		this.storageName = storageName;
		this.userDatas = JSON.parse(localStorage.getItem(this.storageName)) || {};
	},
	initUserDatas: function (path, val, checkPath) {
		this.userDatas[path] = val;
		if (checkPath) {
			this.copyUserDatas(checkPath, path);
		}
		localStorage.setItem(this.storageName, JSON.stringify(this.userDatas));
		return this.userDatas;
	},
	genUserDatas: function (path, key) {
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
	setUserDatas: function (path, val) {
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
	getUserDatas: function (path) {
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
