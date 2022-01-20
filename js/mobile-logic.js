"use strict";
$(function(){
  let mobile_explore_toolbar = document.getElementById("mobile-explore-toolbar");
  let mobile_nav_menu = document.getElementById("mobile-nav-menu");
  let mobile_nav_menu_fcsoverly = document.getElementById("mobile-nav-menu-fcsoverly");
  let hamburger = document.getElementsByClassName("hamburger");
  let v;
  $(hamburger).click(function(){
    $(this).toggleClass("is-active");
    if($(this).hasClass("is-active")) {
      if(document.getElementById("mobile-explore-toolbar")!=null) {
        if($(mobile_explore_toolbar).css("display")!="none") {
          if(!$(mobile_explore_toolbar).hasClass("no-hide")) {
            $(mobile_explore_toolbar).addClass("global-bottom-bar-hide");
          }
        }
      }
      // show menu
      window.clearTimeout(v);
      $("body").css({
        'height':'100vh',
        'overflow':'hidden'
      });
      $(mobile_nav_menu).removeClass("fadeOutRightBig");
      $(mobile_nav_menu).addClass("fadeInRightBig");
      $(mobile_nav_menu).css("display","block");
      $(mobile_nav_menu_fcsoverly).css("display","block");
      $(mobile_nav_menu_fcsoverly).removeClass("fadeOut");
      $(mobile_nav_menu_fcsoverly).addClass("fadeIn");
    } else {
      if(document.getElementById("mobile-explore-toolbar")!=null) {
        if($(mobile_explore_toolbar).css("display")!="none") {
          $(mobile_explore_toolbar).removeClass("global-bottom-bar-hide");
        }
      }
      // hide menu
      $("body").css({
        'height':'',
        'overflow':''
      });
      $(mobile_nav_menu).removeClass("fadeInRightBig");
      $(mobile_nav_menu).addClass("fadeOutRightBig");
      $(mobile_nav_menu_fcsoverly).removeClass("fadeIn");
      $(mobile_nav_menu_fcsoverly).addClass("fadeOut");
      v=window.setTimeout(function(){
        $(mobile_nav_menu).css("display","none");
        $(mobile_nav_menu_fcsoverly).css("display","none");
      },500);
    }
  });

  let s_p_s = $(window).width()/700;
  if(s_p_s<0.675) s_p_s=0.675;
  else if(s_p_s>1) s_p_s=1;
  $(window).resize(function(){
    if(window.innerWidth>=1000) {
      if($(hamburger).hasClass("is-active")) {
        $(hamburger).removeClass("is-active");
        $("body").css({
          'height':'',
          'overflow':''
        });
        $(mobile_nav_menu).css("display","none");
        $(mobile_nav_menu).removeClass("fadeInRightBig");
        $(mobile_nav_menu).addClass("fadeOutRightBig");
        $(mobile_nav_menu_fcsoverly).css("display","none");
        $(mobile_nav_menu_fcsoverly).removeClass("fadeIn");
        $(mobile_nav_menu_fcsoverly).addClass("fadeOut");
      }
    } else {
      s_p_s = $(window).width()/700;
      if(s_p_s<0.675) s_p_s=0.675;
      else if(s_p_s>1) s_p_s=1;
      $(".swiper-button-next, .swiper-button-prev").css({
        'transform':'scale('+s_p_s+')'
      });
    }
  });

  $(".swiper-button-next, .swiper-button-prev").css({
    'transform':'scale('+s_p_s+')',
    '-webkit-transform':'scale('+s_p_s+')',
    '-moz-transform':'scale('+s_p_s+')',
    '-o-transform':'scale('+s_p_s+')',
    '-ms-transform':'scale('+s_p_s+')'
  });
});
