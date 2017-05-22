(function ($) {
	Drupal.behaviors.cordeckCustomSearch = {
	  attach: function (context, settings) {
	    $('#cordeck_custom_search_textfield').keyup(function(){
	    	var string = $(this).val(); 

	    	if (string != '' && string.length < 55) {
		    	$.get('/search_dropdown_callback/'+string, function(data) {
			    	var results = JSON.parse(data);
		    		if(results.length){
			    		var output = '<span id="search-lead-in">Products that match your search terms are shown below. Click on any result for full product information, or click the search icon above to perform a complete site search to find case studies, in-floor product information, technical resources, news, and more.</span>';
			    			output += '<ul class="results-list">';
			    		for(var i = 0;i < results.length; i++) {
			    			var product = results[i];
				    			output += '<li><a href="/'+product.path+'">';
				    			output += '<h3 class="title">'+product.title+'</h3>';
				    			if(product.f2_uri != ''){
				    				output += '<img class="product-image" src="'+product.f2_uri+'">';
				    			}
				    			output += '<div class="specs">';
				    			if(product.guage != '') {
				    				output += '<div class="gauge"><strong>Gauge: </strong>'+product.guage+'</div>';
				    			}
				    			if(product.width != '') {
				    				output += '<div class="finish"><strong>Widths: </strong>'+product.width+'</div>';
				    			}
				    			output += '</div>';
				    			if(product.uri != ''){
				    				output += '<div class="schematic-image"><img src="'+product.uri+'"></div>';
				    			}
				    			output += '<div class="clear"></div></li>';
			    		}
			    		output += '</ul>'
			    		$('#cordeck_custom_search_results').html(output); 
			    	} else {
			    		$('#cordeck_custom_search_results').html('');
			    	}
		    	});
		    } else {
		    	$('#cordeck_custom_search_results').html('');
		    }
	    });
	  }
	};
}(jQuery));