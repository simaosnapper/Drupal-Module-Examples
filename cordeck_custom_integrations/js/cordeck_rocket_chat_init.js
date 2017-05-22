(function(w, d, s, u) {
	
	w.RocketChat = function(c) { 
		w.RocketChat._.push(c) 
	}; 
	w.RocketChat._ = []; 
	w.RocketChat.url = u;
	var h = d.getElementsByTagName(s)[0], 
	    j = d.createElement(s);
	j.async = true; 
	j.src = 'http://45.55.196.34:3000/packages/rocketchat_livechat/assets/rocket-livechat.js';
	h.parentNode.insertBefore(j, h);

})(window, document, 'script', 'http://45.55.196.34:3000/livechat');