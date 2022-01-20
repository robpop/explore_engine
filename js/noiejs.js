"use strict";
$(function(){
  let ua = window.navigator.userAgent;
  let msie = ua.indexOf("MSIE ");

  if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return 1
  {
    $("body").remove();
    alert("Unsift does not support Internet Explorer.");
    window.location.href = "https://www.google.com/";
  }
  
  if (!Modernizr.flexbox) {
    // critical feature not supported
    $("body").remove();
    alert("Unsift does not support your browser version.");
    window.location.href = "https://www.google.com/";
  }

});
