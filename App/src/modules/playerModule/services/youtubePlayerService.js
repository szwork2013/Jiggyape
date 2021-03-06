'use strict';
angular.module('player').factory('youtubePlayerService',function($rootScope){

	var youtubePlayerService=
	{
		states:
		{
			UNSTARTED:-1,
			ENDED:0,
			PLAYING:1,
			PAUSED:2
		},
		currentState:-1,
		player:null,
		playlist:[],
		index:0,
		stateCallback:null,
		bufferTimer:null,
		init:function(){
			if(window.playerReady)
			{
				console.log('ready');
				this.player = new YT.Player('player', {
					videoId: '',
					playerVars: {
						controls: 0,
						autoplay: 1,
						disablekb: 1,
						enablejsapi: 1,
						iv_load_policy: 3,
						modestbranding: 1,
						showinfo: 0,
						rel:0
					},events: {
						'onReady': this.onPlayerReady.bind(this),
						'onStateChange': this.onPlayerStateChange.bind(this)
					}
				});
			}
		},
		onPlayerReady:function(event){
			console.log('onPlayerReady');
			$rootScope.$broadcast('YoutubePlayerLoaded');
			if (!$rootScope.$$phase) $rootScope.$apply();
		//	 event.target.playVideo();
	},
	onPlayerStateChange:function(event){
		console.log('player service',event.data);
		switch(event.data){
			case 0:
			this.nextVideo();
			break;
			case 3:
			if(this.bufferTimer)clearTimeout(this.bufferTimer);
			if(!this.bufferTimer)this.bufferTimer= setTimeout(this.bufferTimeout.bind(this),2000);
			break;
		}
		if(this.stateCallback)this.stateCallback(event.data);
	},
	bufferTimeout:function(){
		this.playVideo(this.index);
	},
	playVideo:function(index){
		this.index=index;
		if(this.index>this.playlist.length-1)this.index=0;
		this.player.loadVideoById(this.playlist[this.index]);
		console.log(this.playlist[this.index]);
		$rootScope.$broadcast('PlayingVideo',{index:index});

	},
	pauseVideo:function(){
		this.player.pauseVideo();
	},
	nextVideo:function(){
		this.index++;
		if(this.index>this.playlist.length-1)this.index=0;
		this.playVideo(this.index);
	},
	previousVideo:function(){
		this.index--;
		if(this.index<0)this.index=this.playlist.length-1;
		this.playVideo(this.index);
	},
	updatePlaylist:function(items){
		this.playlist=[];
		for(var a=0;a<items.length;a++){
			this.playlist.push(items[a].id.videoId);
		}

	},



};



return youtubePlayerService;

});
