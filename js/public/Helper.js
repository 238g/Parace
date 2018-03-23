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

function __setSPBrowserColor (colorString) {
	if (document.getElementsByName('theme-color')) {
		document.getElementsByName('theme-color')[0].setAttribute('content', colorString);
	}
}

function __formatComma (val) {
	return String(val).replace(/(\d)(?=(\d{3})+$)/g,'$1,');
}

function __copyJson (json) {
	var newJson = {};
	for (var key in json) newJson[key] = json[key];
	return newJson;
}