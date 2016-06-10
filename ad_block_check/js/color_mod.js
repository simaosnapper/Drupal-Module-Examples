(function ($) {
  Drupal.behaviors.colour1 = {
    attach: function(context) {
    	//We link both the text box and the color picker to each other so one changes when the other is changed
    	//Set the text box hex color according to the selected farbtastic color
    	$('#color_picker', context).ajaxComplete(function(){
	        $("#color_picker").farbtastic(function(){
	        	$('#farbtastic-color-picker').val(this.color);  
	        }); 
	    });
    	$(document).ready(function(){
		    //set the farbtastic color when the input box changes
		    $('#farbtastic-color-picker').on('change',function(){
		    	$.farbtastic("#color_picker").setColor($('#farbtastic-color-picker').val());
		    });
		});
    }
  }
})(jQuery);
