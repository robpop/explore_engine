"use strict";

function show_points() {
  setTimeout(() => {
    $("#home-scroll-to-faq-wrapper").hide();
    $("#home-faq-right").children().eq(0).addClass("fadeInRight");
    setTimeout(() => {
      $("#home-faq-right").children().eq(1).addClass("fadeInRight");
      setTimeout(() => {
        $("#home-faq-right").children().eq(2).addClass("fadeInRight");
      },100);
    },100);
  },500);
}

$(() => {
  
  if($(window).innerWidth() <= 1000) {
    $("#home-faq-right").children("div").removeClass("animated faster");
  }
  
  $(".sitecard-display__second").css({
    "top":$(".sitecard-display__first").position().top-($(".sitecard-display__second").innerHeight()*0.35),
    "left":$(".sitecard-display__first").position().left+($(".sitecard-display__second").innerWidth()*0.3)
  });
  $(".sitecard-display__third").css({
    "top":$(".sitecard-display__first").position().top+($(".sitecard-display__third").innerHeight()*0.42),
    "left":$(".sitecard-display__first").position().left-($(".sitecard-display__third").innerWidth()*0.38)
  });
  
  
  let child_selector_first = Math.abs(Math.floor(Math.random() * (6 + 1)));
  let last_card = child_selector_first;
  let child_selector_second = child_selector_first-2<=0 ? Math.abs(child_selector_first+2) : Math.abs(child_selector_first-2);
  let child_selector_third = child_selector_second-3<=0 ? Math.abs(child_selector_second+3) : Math.abs(child_selector_second-3);
  setInterval(() => {
    $(".sitecard-display__third").find(".sitecard-display__show").addClass("fadeOutUp");
    setTimeout(() => {
      $(".sitecard-display__second").find(".sitecard-display__show").addClass("fadeOutUp");
      setTimeout(() => {
        $(".sitecard-display__first").find(".sitecard-display__show").addClass("fadeOutUp");
      },250);
    },250);
    setTimeout(() => {
      $(".sitecard-display__show").removeClass("fadeOutUp");
      $(".sitecard-display__show").removeClass("sitecard-display__show");
      $($(".sitecard-display__first ul").children().eq(child_selector_first)).addClass("fadeInUp");
      $($(".sitecard-display__first ul").children().eq(child_selector_first)).addClass("sitecard-display__show");
      
      setTimeout(() => {
        $($(".sitecard-display__second ul").children().eq(child_selector_second)).addClass("fadeInUp");
        $($(".sitecard-display__second ul").children().eq(child_selector_second)).addClass("sitecard-display__show");
        setTimeout(() => {
          $($(".sitecard-display__third ul").children().eq(child_selector_third)).addClass("fadeInUp");
          $($(".sitecard-display__third ul").children().eq(child_selector_third)).addClass("sitecard-display__show");
          child_selector_first = Math.abs(Math.floor(Math.random() * (6 + 1)));
          while(child_selector_first === last_card) {
            child_selector_first = Math.abs(Math.floor(Math.random() * (6 + 1)));
          }
          last_card = child_selector_first;
          child_selector_second = child_selector_first-2<=0 ? Math.abs(child_selector_first+2) : Math.abs(child_selector_first-2);
          child_selector_third = child_selector_second-3<=0 ? Math.abs(child_selector_second+3) : Math.abs(child_selector_second-3);
        },250);
      },250);
    },800);
  },3000);
  
  
  if($(window).scrollTop() === 0) {
    $("#home-scroll-to-faq-wrapper").css("display", "flex");
  } else {
    $("#home-scroll-to-faq-wrapper").addClass("fadeOutDown");
    show_points();
  }
  $(window).scroll(() => {
    if($(window).innerWidth() > 1000) {
      $("#home-scroll-to-faq-wrapper").addClass("fadeOutDown");
      show_points();
    }
  });
  $("#home-scroll-to-faq-wrapper").click(() => {
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#home-faq-slide").offset().top
    },750);
    show_points();
  });
  
  $(window).resize(() => {
    $(".sitecard-display__second").css({
      "top":$(".sitecard-display__first").position().top-($(".sitecard-display__second").innerHeight()*0.35),
      "left":$(".sitecard-display__first").position().left+($(".sitecard-display__second").innerWidth()*0.3)
    });
    $(".sitecard-display__third").css({
      "top":$(".sitecard-display__first").position().top+($(".sitecard-display__third").innerHeight()*0.42),
      "left":$(".sitecard-display__first").position().left-($(".sitecard-display__third").innerWidth()*0.38)
    });
  });
});