"use strict";
$(()=>{
  const mobile_size = 1000;
  if(window.innerWidth <= mobile_size) {
    $("#mobile--wall").text("This page requires a larger screen");
    $(".-non-mobile").remove();
    1e3>=window.innerWidth&&setTimeout(()=>{window.location.replace("/explore/");},3e3)
  }
});