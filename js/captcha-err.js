setTimeout(() => {
  if(!$(".h-captcha").length) {
    show_error_notification("We are experiencing an outage with our captcha provider and cannot process this form. Please try again in a few minutes");
  }
},5000);