"use strict";
$(function () {
  let d_d_down = false;
  let a_d_d_d = $("#account-drop-down-div");
  let a_d_d_d_li = $("#account-drop-down-div a");
  let account_drop_down = document.getElementById("account-drop-down");
  $(account_drop_down).click(function() {
    if($(a_d_d_d).hasClass("show")) {
      d_d_down=false;
      $(a_d_d_d_li).removeClass("show-items");
      $(".dropdown-content a").css({visibility:"hidden"});
      setTimeout(function() {
        $(a_d_d_d).removeClass("show");
      },80);
    } else {
      d_d_down=true;
      $(a_d_d_d).addClass("show");
      $(".dropdown-content a").css({visibility:"visible"});
      setTimeout(function() {
        $(a_d_d_d_li).addClass("show-items");
      },170);
    }
  });

  $(window).scroll(function() {
    d_d_down=false;
    $(a_d_d_d_li).removeClass("show-items");
    $(".dropdown-content a").css({visibility:"hidden"});
    setTimeout(function() {
      $(a_d_d_d).removeClass("show");
    },80);
  });

  $(".global-sign-up").click(function(){
    window.location.assign("#");
  });
});


/* ==== PRODUCTION ==== */
