(function ($) {
	Drupal.behaviors.bookmark = {
	  attach: function (context, settings) {
		    //Calls Bookmark Delete after bookmark has been added or deleted
		    bookmark_delete();

		    //Attaches event handler to delete_bookmark class
		    //Needs called everytime AJAX completes due to html replacement
		    function bookmark_delete(){
		    	$('.delete_bookmark').click(function(evt){
			    	evt.preventDefault();
			    	var anchorPath = $(this).attr('href'); 
			    	$.get(anchorPath, function(data){
			    		$('#bookmark_box').html(data);
			    		$("#bookmark_error").html(''); 
		    			bookmark_count();
		    			bookmark_delete(); 
		    		}); 
		    	});
		    }
		    //attaches event handler to bookmark_add class only once
		    $('.bookmark_add').click(function(evt){
		    	evt.preventDefault(); 
		    	var anchorPath = $(this).attr('href');
		    	$.get(anchorPath, function(data){ 
		    		if(data == '0'){ 
		    			var message = '<p class="alert alert-danger">You cannot have more than 50 bookmarks.  Please delete some then try again.</p>';
		    			$("#bookmark_error").html(message); 
		    		}else if(data == '1'){
		    			var message = '<p class="alert alert-danger">This page is already bookmarked.</p>';
		    			$("#bookmark_error").html(message);
		    		}else{
		    			$('#bookmark_box').html(data);
		    			$("#bookmark_error").html(''); 
		    		}
					bookmark_count();
					bookmark_delete();
		    	});
		    	var htmlInsert = 'Article is bookmarked <i class="fa fa-bookmark fa-2x"></i>'
		    	$(this).parent().html(htmlInsert);
		    });

		    //Close Panel When X button is clicked
		    $('.bookmark_panel h2 .close',context).click(function(){
		    	$('.bookmark_panel').toggleClass('open');
		    });

		    //Shows the user options on the banner when the admin icon is clicked
	        $('#user-options',context).click(function(evt){
	            evt.preventDefault(); 
	            $('.bookmark_panel').toggleClass('open'); 
	        });

	        //Counts Bookmarks and adds a bubble in the header
	        function bookmark_count(){
		        var bookmarkCount = $(document).find('#bookmarks li').length;
		        $('#user-options').append('<div id="bookmark_count">' + bookmarkCount + '</div>'); 
		    }
		    bookmark_count();
	  }
	};
})(jQuery);