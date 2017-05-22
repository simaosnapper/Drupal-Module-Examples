//Hacks the original jQuery clone() function so we can clone our select boxes
(function (original) {
  jQuery.fn.clone = function () {
    var result           = original.apply(this, arguments),
        my_textareas     = this.find('textarea').add(this.filter('textarea')),
        result_textareas = result.find('textarea').add(result.filter('textarea')),
        my_selects       = this.find('select').add(this.filter('select')),
        result_selects   = result.find('select').add(result.filter('select'));

    for (var i = 0, l = my_textareas.length; i < l; ++i) $(result_textareas[i]).val($(my_textareas[i]).val());
    for (var i = 0, l = my_selects.length;   i < l; ++i) result_selects[i].selectedIndex = my_selects[i].selectedIndex;

    return result;
  };
}) (jQuery.fn.clone);

(function ($) {
  	Drupal.behaviors.cordeckCustomQuote = {
	    attach: function (context, settings) {
	    	//keep a fresh copy of the oringinal first product and quote for duplication later on
	    	quoteCopy = $('div[data-quote-id="1"]').clone(),
	    	productCopy = $('div[data-product-id="1"]').clone();

	    	//Gets the products array from the .module file for use in the JavaScript
	    	$.get('/request-a-quote/get-products/',function(data){
	    		products = JSON.parse(data);
	    	});

	    	//Handle form clicks
	      	$('#cordeck-custom-quote-form').on('click','.delete-product,.add-product,.add-product-i,.add-quote,.duplicate-quote,.delete-quote,.faq-box-activator,a.close',this.quoteFormClickHandler);
	      	//Handle form select changes
	      	$('#cordeck-custom-quote-form').on('change','.select-product,.select-product-category',this.quoteFormSelectHandler);

			//Forces only one input to be allowed in Squares or Length section
			$('#cordeck-custom-quote-form').on('keyup','.product .dimensions-box input',this.quoteFormDimensionsBoxHandler);

			//Handle form submit
			$("#cordeck-custom-quote-form").submit(this.quoteFormSubmitHandler);

			$('#edit-email').mailgun_validator({
		        api_key: 'pubkey-b19fcad77bb2138160bf409ed5639792',
		        in_progress: function() {
		    		var loadingHTML = '<img id="submit-loading" src="/sites/all/modules/custom/cordeck_custom_quote/js/mailgun-email-validator/loading.gif">';
		        	$('#email-message').append(loadingHTML);
		        },
		        success: function(success) {

		        	if(success.is_valid) {
			        	var html = '<span class="success-message" style="color:green;">Email is Valid</span>'
			        	$('#submit-loading').remove();
			        	$('#email-message').html(html);
			        	$('#edit-email')[0].setCustomValidity("");
		        	} else {
		        		if(success.did_you_mean != null) {
		        			var html = '<span class="success-message" style="color:red;">Did you mean '+success.did_you_mean+'?</span>';
		        			$('#edit-email')[0].setCustomValidity("Did you mean " + success.did_you_mean + "?");
		        		} else {
		        			var html = '<span class="success-message" style="color:red;">Please enter a valid email address</span>';
		        			$('#edit-email')[0].setCustomValidity("Email is not valid");

		        		}
		        		$('#email-message').html(html);
		        	}
		        },
		        error: function(error) {
		        	$('#success-message').remove();
		        	var html = '<span id="email-error" style="color:red;">'+error+'</span>';
		        	$('#email-message').html(html);
		        	$('#edit-email')[0].setCustomValidity(error);
		        },
	        });
	    },

	    quoteFormClickHandler: function(e) {
	    	e.preventDefault();
			if($(this).is('i')) {
				targetClass = $(e.target).parent().attr('class');
			} else {
				targetClass = $(e.target).attr('class');
			}

			switch (targetClass) {
				case 'add-product':
		  		    var length = $(this).parents('.quote-box').find('.product').last().length;
		  		    	productID = (length) 
		  		    		? parseInt($(this).parents('.quote-box').find('.product').last().attr('data-product-id')) + 1 
		  		    		: 1,
		  		    	element = productCopy.clone()
		  		    	quoteID = parseInt($(this).parents('.quote-box').attr('data-quote-id'));

		  		    element.find('.select-product-category').attr('name','producttype_quote_'+ quoteID + '_product_' + productID);
		  			element.attr('data-product-id',productID); 
		  			if($(this).hasClass('fa')) {
		  				$(this).parent().before(element);
		  			} else {
		  				$(this).before(element);
		  			}
		  			break;

		  		case 'delete-product':
		  			if(confirm("Are you sure you want to delete this product?")) {
		  				$(this).parents('.product').remove();
		  			}
		  			break;

		  		case 'add-quote':
		  			var quote = quoteCopy.clone(),
		  				quoteID = ($('#cordeck_custom_quote_form_wrapper .quote-box').last().length) ? parseInt($('#cordeck_custom_quote_form_wrapper .quote-box').last().attr('data-quote-id')) + 1 : 1,
		  				productID = quote.find('.product').attr('data-product-id');
		  				
		  			quote.find('.select-product-category').attr('name','producttype_quote_'+ quoteID + '_product_' + productID);
		  			quote.find('.quote-heading .quote-head-increment').text(quoteID);
		  			quote.attr('data-quote-id',quoteID);
		  			$('.add-quote-container').before(quote);
		  			break;

		  		case 'duplicate-quote':
		  			var quote = $(this).parents('.quote-box').clone(),
		  				quoteID = ($('#cordeck_custom_quote_form_wrapper .quote-box').last().length) ? parseInt($('#cordeck_custom_quote_form_wrapper .quote-box').last().attr('data-quote-id')) + 1 : 1;
		  			
		  			quote.find('select,input').each(function(i,v){
		  				var productID = parseInt($(this).parents('.product').attr('data-product-id')),
		  					name = $(this).attr('name'),
		  					oldQuoteID = parseInt(name.substring(name.length - 11, name.length - 10)),
		  					newQuoteID = oldQuoteID + 1;
		  					newQuoteText = name.replace('quote_' + oldQuoteID, 'quote_' + newQuoteID);
		  			
		  				$(this).attr('name',newQuoteText); 
		  			});

		  			quote.find('.quote-heading .quote-head-increment').text(quoteID);
		  			quote.attr('data-quote-id',quoteID);
		  			$('.quote-box').last().after(quote);
		  			break;

		  		case 'delete-quote':
		  			if(confirm('Are you sure you want to delete this quote?')) {
		  				$(this).parents('.quote-box').remove();
		  			}
		  			break;

		  		case 'faq-box-activator':
		  			$('.faq-box').removeClass('open');
					$(this).next('.faq-box').toggleClass('open');
					break;

				case 'close':
				case 'fa fa-times':
					$(this).parents('.faq-box').toggleClass('open');
					break;
			}
	    },

	    quoteFormSelectHandler: function(e) {
	    	var target = $(e.target),
      			value = target.val(),
      			quoteNumber = $(this).parents('.quote-box').attr('data-quote-id'),
					productNumber = $(this).parents('.product').attr('data-product-id'),
					nameSuffix = 'quote_' + quoteNumber + '_product_' + productNumber;

				if(target.hasClass('select-product-category')) {
					
		      		target.parents('.product').find('.product-image').remove();
					target.parents('.product').find('.product-body .left-side,.product-body .right-side').html('');
					target.parents('.product').find('.select-product-box').remove();
					target.parents('.product').find('.dimensions-box').remove();
						
						output = '';
						output += '<div class="select-product-box"><select class="select-product" name="product_select_quote_' + quoteNumber + '_product_' + productNumber + '">',
						output += '<option value>Select Product</option>';
						$.each(products[value], function(i,v){
		      			if(Object.keys(v).length) {
			      			output += '<option value="'+v.nid+'">'+v.field_product_name+'</option>';
			      		}
		      		});
		      		output += '</select></div>';

		      		target.parents('.product').find('.product-header').append(output);

				} else {
					
					var productType = $(this).parents('.product').find('.select-product-category').val();
	      		
					target.parents('.product').find('.product-body .left-side,.product-body .right-side').html('');
					target.parents('.product').find('.product-image').remove();
					target.parents('.product').find('.dimensions-box').remove();

	      		$.each(products[productType][value], function(i,v){

	      			if(Object.keys(v).length) {
		      			switch (i) {
		      				case 'field_finishes':
		      				case 'field_gauge' :
		      				case 'field_width' :
		      					name = (i == 'field_finishes') ? 'Finish' : (i == 'field_gauge') ? 'Gauge' : 'Cover Width';
		      					output = '';
		      					output += '<div class="'+i+' product-options"><select name="'+i.split('_')[1]+'_'+nameSuffix+'" required="required">',
		      					output += '<option disabled selected value="">'+name+'</option>'
		      					$.each(v,function(i,v){
		      						output += '<option value="'+v+'">'+v+'</option>';
		      					});
		      					output += '</select></div>';
								target.parents('.product').find('.product-body .left-side').append(output);
		      					break;

		      				case 'field_acoustic':
		      					if(v != '0') {
		      						var faqText = "Bro ipsum dolor sit amet hardtail ski bum cork, ride bowl dope bro core shot steed. Hardtail giblets rail schwag taco. Carve bowl grunt air, greasy daffy poaching. Grab clean granny gear ollie pinner, hellflip saddle giblets. Hammer frozen chicken heads rigid, grom daffy gapers phat slash McTwist liftie couloir air flow Whistler gnar.";
		      						output = '<div id="acoustical"><select name="acoustic_'+nameSuffix+'" required="required">';
		      						output += '<option value="Non-Acoustical">Non-Acoustical</option>';
		      						output += '<option value="Acoustical">Acoustical</option>';
		      						output += '</select><div class="faq-container"><a href="#" class="faq-box-activator">?</a><span class="faq-box"><a href="#" class="close"><i class="fa fa-times" aria-hidden="true"></i></a>'+faqText+'</span></div></div>';
		      						target.parents('.product').find('.product-body .left-side').prepend(output);
		      					}
		      					break;

		      				case 'field_number_of_pieces':
		      					//We only want to show number of pieces if the product is an accessory (5) because
		      					//the length field also provides a # of pieces field.
		      					if(v != '0' && products[productType][value].field_product_category.und[0].tid == '5') {
		      						output = '<div class="number-of-pieces"><label># of Pieces:</label> <input type="text" name="pieces_'+nameSuffix+'" size="3" required="required"></div>';
		      						target.parents('.product').find('.product-body .left-side').append(output);
		      					}
		      					break;

		      				case 'field_profile_image':
		      					output = '<a href="'+v+'" rel="lightbox" class="profile-image"><img class="profile-image product-image" src="'+v+'"></a>';
		      					target.parents('.product').find('.product-header').prepend(output);
		      					Drupal.behaviors.initLightbox.attach();
		      					break;

		      				case 'field_schematic_drawing':
		      					output = '<a href="'+v+'" rel="lightbox" class="profile-image"><img class="schematic-drawing product-image" src="'+v+'"></a>';
		      					target.parents('.product').find('.product-body .right-side').prepend(output);
		      					Drupal.behaviors.initLightbox.attach();
		      					break;

		      				case 'field_squares_dimensions':
		      					output = '<div class="dimensions-box">';
		      					if(v[0] != '0' && $[1] != '0') {
		      						var or = 'or';
		      					}
		      					if(v[0] != '0') {
		      						var faqText = "Something about number of squares here.";
		      						output += '<label class="squares"># of Squares <input type="text" size="4" name="squares_'+nameSuffix+'" required="required"><div class="faq-container"><a href="#" class="faq-box-activator">?</a><span class="faq-box"><a href="#" class="close"><i class="fa fa-times" aria-hidden="true"></i></a>'+faqText+'</span></div></label>';
		      					}
		      					if(v[1] != '0') {
		      						if(typeof or != 'undefined') {
		      							output += '<span class="or"><strong>'+or+'</strong></span>';
		      						}
		      						output += '<span class="feet"><label>Length</label> <input type="text" size="4" name="feet_'+nameSuffix+'"> ft. </span>';
		      						output += '<span class="inches"><input type="text" size="4" name="inches_'+nameSuffix+'"> in. </span>';
		      						output += '<span class="pieces"><label># of Pieces:</label> <input type="text" name="pieces_'+nameSuffix+'" size="3"><span>';
		      					}
		      					output += '</div>';
		      					target.parents('.product').append(output);
		      					break;

		      				case 'field_length':
		      				case 'field_degrees':
		      					//inches = (i == 'field_length') ? 'in.' : '';
		      					if(v != '0') {
			      					output = '<div class="'+i+'"><label>'+i.split('_')[1]+': <input type="text" size="4" name="'+i+'_'+nameSuffix+'" required="required"></div>'/*+inches*/;
			      					target.parents('.product').find('.product-body .left-side').append(output);
			      				}
		      					break;

		      				case 'field_accessory_dimensions':
		      					output = '<div class="accessory-dimensions">';
		      					$.each(v, function(i,v){
		      						if(v != 1) {
		      							output += '<label>'+v+':</label> <input type="text" name="dimension_'+v+'_'+nameSuffix+'" size="3" required="required"><br/>';
		      						}
		      					});
		      					output += '</div>';
		      					target.parents('.product').find('.product-body .right-side').append(output);
		      					break;
		      			}
		      		}
	      		});
	      	}
	    },

	    quoteFormDimensionsBoxHandler: function(e) {
	    	var name = $(this).attr('name').substring(0, ($(this).attr('name').length - 18));
			if(name == 'squares') {
				$(this).parent().find('input[name^="feet"],input[name^="inches"],input[name^="pieces"]').val('').removeAttr('required').css("opacity",".6");
				$(this).parent().find('input[name^="squares"]').attr('required','required').css("opacity","1");
			} else {
				$(this).parent().find('input[name^="squares"]').val('').removeAttr('required').css("opacity",".6");
				$(this).parent().find('input[name^="feet"],input[name^="inches"],input[name^="pieces"]').attr('required','required').css("opacity","1");
			}
	    },

	    quoteFormSubmitHandler: function(e) {
	    	e.preventDefault();
			var errors = false,
				quotes = [],
				contact = [],
				data = new FormData(),
				submittedQuote = $('#cordeck-custom-quote-form .quote-box'),
				contactForm = $('#cordeck_custom_quote_contact_form').find('input,select,textarea').serializeArray(),
				formFile = $('#edit-attached-file');

			if(formFile.length && formFile[0].files.length) {
				var file = formFile[0].files[0];
				if((file.size/1024)/1024 > 5) {
					alert('File upload size cannot be more than 5mb. Please try again.');
					return;
				} else {
					data.append("file",file,file.name);
				}
			}

			$("#cordeck-custom-quote-form input,#cordeck-custom-quote-form select").each(function(i,v) {
				if($(this).attr('required') == 'required' && $(this).val() == '') {
					errors = true;
					$(this).css("border-color","red");
				}
			});

			if(errors == true) {
				alert("There are errors on your form. Please correct and submit again.");
				return;
			}

			for (var l = submittedQuote.length, i = 0; i < l; i++) {
				var quoteProducts = $(submittedQuote[i]).find('.product'),
					groupedProducts = [];
				for(var ll = quoteProducts.length, ii = 0; ii < ll; ii++) {
					groupedProducts.push($(quoteProducts[ii]).find('select,input').serializeArray());
				}
				quotes.push(groupedProducts);
			}

			data.append("data",JSON.stringify(quotes));
			data.append("contact",JSON.stringify(contactForm));

			$.ajax({
				type: "POST",
				url: "/request-a-quote/submit-quote",
				data: data,
				processData: false,
				contentType: false,
				success: function(data) {
					var message = JSON.parse(data);
					
					if(message.type == 'error') {
						
						alert(message.message);

					} else {
						$('#cordeck-custom-quote-form').html('<div id="cordeck-quote-submit-message">'+message.message+'</div>');
						$('html,body').animate({
							scrollTop : 0,
						},1000);
					}

				},
				error: function(data) {
					alert("Something went wrong with the form submission. Please try again later.");
				},
				beforeSend: function() {
					var html = '<div id="loading-image"><img src="/sites/default/files/loading.gif"></div>'
					$('#edit-submit').after(html)
				},
				complete: function() {
					$('#loading-image').remove();
				}
			});
	    }
  	};
}(jQuery));