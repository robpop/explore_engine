"use strict";
$(function(){
  let is_m=false;
  if (window.innerWidth>1000) is_m=false;
  else is_m=true;
  let open_source_attribution_footer = document.getElementById("open-source-attribution-footer");

  let lastScrollTop = $(this).scrollTop();
  $(window).scroll(function() {
    if(!is_m) {
      let st = $(this).scrollTop();
       if (st > lastScrollTop){
           // downscroll code - hide footer
           $(open_source_attribution_footer).removeClass("slideInUp");
           $(open_source_attribution_footer).addClass("slideOutDown");
       } else {
          if(st!=lastScrollTop) {
            // upscroll code - show footer
            if($(open_source_attribution_footer).hasClass("slideOutDown")) {
              $(open_source_attribution_footer).removeClass("slideOutDown");
              $(open_source_attribution_footer).addClass("slideInUp");
            }
          }
       }
       lastScrollTop = st;

       clearTimeout($.data(this, 'scrollTimer'));
       $.data(this, 'scrollTimer', setTimeout(function() {
           // do something
           if($(open_source_attribution_footer).hasClass("slideOutDown")) {
             $(open_source_attribution_footer).removeClass("slideOutDown");
             $(open_source_attribution_footer).addClass("slideInUp");
           }
       }, 2000));
     }
  });


  window.onresize = function(event) {
    if (window.innerWidth>1000) is_m=false;
    else is_m=true;
  };
});
