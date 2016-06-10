(function ($) {
	//increments the database to keep track of data if client is blocking ads
	var userIsLeech; 
	if( window.canRunAds === undefined ){
		userIsLeech = 1;
	}else{
		userIsLeech = 0;
	}
	//send info to the db 
	$.get('/ad_block_request?i='+userIsLeech, function(blockAd){
		//if the user is going to be blocked blockAd returns true (1)
		//and if the user is blockng ads we redirect them
		if(blockAd == 1 && userIsLeech == 1){
			//get the current path to append to get variable
			//encodeURI is used to create a usable $_GET variable to set as an anchor in the ad block page
			var destination = encodeURI(window.location.pathname); 
			window.location.href = '/ad-block/welcome?destination=' + destination;
		}else{
			return; 
		}
	});
})(jQuery);


