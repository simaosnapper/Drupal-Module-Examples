(function ($) {

Drupal.behaviors.hmpgatePopup = {
  attach: function (context) {
    //Show page gate if exists on page
    $('.hmpgate-overlay',context).fadeIn();
    $('.hmpgate-popup',context).slideDown();
    
    $('.page-gate-popup',context).click(function(evt){
        evt.preventDefault(); 
        $('.hmpgate-overlay').fadeIn();
        $('.hmpgate-popup').slideDown(); 
    });
    $('.close-gate',context).click(function(){
        $('.hmpgate-overlay').fadeOut();
        $('.hmpgate-popup').slideUp();  
    });
  }
};

})(jQuery);
