var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var __YoutubePlayer;
var onYouTubeIframeAPIReady = function () {
	__YoutubePlayer = new YT.Player('YoutubePlayer', {
		height: window.innerHeight/2-100,
		width: window.innerWidth,
		videoId: 'cOtT55-SH4k',
		events: {
			'onReady': function () {},
			'onStateChange': __onPlayerStateChange
		}
	});
};
var __GameStart = null;
var __GamePause = null;
var __onPlayerStateChange = function (event) {
	// -1 – 未開始 UNSTARTED
	// 0 – 終了 ENDED
	// 1 – 再生中 PLAYING
	// 2 – 一時停止 PAUSED
	// 3 – バッファリング中 BUFFERING
	// 5 – 頭出し済み CUED
	// console.log('========================',event.data);
	if (event.data==YT.PlayerState.PLAYING) return __GameStart();
	if (event.data==YT.PlayerState.PAUSED) return __GamePause();
};