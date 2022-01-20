"use strict";
function readURL(input) {
    if (input.files && input.files[0]) {
      if(input.files[0].size <= 1048576) {
        if(input.files[0].type==="image/jpeg" || input.files[0].type==="image/png") {
          let reader = new FileReader();
          reader.readAsDataURL(input.files[0]);
          $("#pamf-media-display-logo_generate").css("opacity", "0.5");
          $(".pamf-media-display-full--logo-text").css("display", "none");
          $(".pamf-media-display-full--logo-usedefault").css("display", "block");
          
          reader.onload = function (e) {
              $('.pamf-media-display-logo img').attr('src', e.target.result);
              $('.pamf-media-display-logo img').css({
                "width":"100%",
                "height":"auto"
              });
              $(".pamf-media-display-logo span").css("display","none");
              return e.target.result;
          }
        } else {
          show_error_notification("Your logo must be a JPG, JPEG, or PNG", "Logo file format");
          return 0;
        }
      } else {
        show_error_notification("Your logo cannot exceed 1MB in size", "Logo is too large");
        return 0;
      }
    }
}

let RGBtoHEX = function(color) {
  return "#"+$.map(color.match(/\b(\d+)\b/g),function(digit){
    return ('0' + parseInt(digit).toString(16)).slice(-2)
  }).join('');
};

$(() => {
  $(window).bind("pageshow", function(event) {
    if (event.originalEvent.persisted) {
      window.location.reload();
    }
  });
  
  let cat_sel_cnt=0;
  let pub_analytics_top_categories_feed__display___li = document.getElementById("pub-analytics-top-categories-feed__display").getElementsByTagName("li");
  let tagindx=-1;


  $(".pub-analytics-request-category-nsfw input").prop("checked",false);
  $(".pub-analytics-request-category-nsfw input").change(function(e){
    if($(this).is(":checked")) {
      // grey out categories and put informative text over it
      // set the NSFW tag
      // clear all prveious categories
      $(".pub-analytics-all-top-categories-feed").css({
        "opacity":"0.4",
        "pointerEvents":"none"
      });
      $(".pub-analytics-current-categories").empty();
      $(".pub-analytics-current-categories").append("<span class='pub-analytics-current-item'>NSFW</span>");

      // check NSFW option
      $('.pub-analytics-top-categories-feed option').attr('selected', false);
      $('.pub-analytics-top-categories-feed option').each((idx, data) => {
        if($(data).text()=="NSFW") {
          $(data).attr('selected', true);
        }
      });
    } else {
      $(".pub-analytics-all-top-categories-feed").css({
        "opacity":"1",
        "pointerEvents":"auto"
      });
      $('.pub-analytics-top-categories-feed option').each((idx, data) => {
        if($(data).text()=="NSFW") {
          $(data).attr('selected', false);
        }
      });
      $(".pub-analytics-current-categories").empty();
      $(".pub-analytics-current-categories").append("<p>No tag selected</p>");
    }
    $(".pub-analytics-all-top-categories-feed li").each(function(i){
      try {
        $(this).removeClass("cattogg");
        // remove key class
        $(this).removeClass($(this).attr("class"));
        $(this).css({
          "background":"",
          "color":""
        });
      } catch(e) {}
    });
    cat_sel_cnt=0;
  });

  $(".pamf-media-logo").change(function(){
      // if image, grey out custom logo area
      readURL(this);
  });

  $(".share-packet-0-verify-field").on('input', function() {
    $(this).val($(this).val().toLowerCase());
    if ($(this).val().length > 0) {
      $(".pamf-media-display-logo_generate--wrapper").css("display","block");
    } else {
      $(".pamf-media-display-logo_generate--wrapper").css("display","none");
    }
  });

  $(".pub-analytics-side-card-compare").mouseover(function(e){
    $(e.target.parentElement).css("background", "#fff");
  }).mouseout(function(e){
    $(e.target.parentElement).css("background", "");
  });
  
  $(".pamf-media-display-full--logo-usedefault").click(() => {
    $("#pamf-media-display-logo_generate").css("opacity", "1");
    $(".pamf-media-display-full--logo-text").css("display", "block");
    $(".pamf-media-display-full--logo-usedefault").css("display", "none");
    $('.pamf-media-display-logo img').css({
      "width":"",
      "height":""
    });
    $(".pamf-media-display-logo img").attr("src", "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
    $(".pamf-media-display-logo span").css("display","block");
    $("#id_logo").val('');
  });
  
  $.each($(".pub-analytics-top-categories-feed").children(), function(idx, child) {
    if($(child).val()) {
      $("#pub-analytics-top-categories-feed__display").append("<li>"+$(child).text()+"</li>");
    }
  });
  
  $(pub_analytics_top_categories_feed__display___li).click((e) => {
    $('.pub-analytics-top-categories-feed option').attr('selected', false);
    $(pub_analytics_top_categories_feed__display___li).removeClass("cattogg");
    $(pub_analytics_top_categories_feed__display___li).css({
      "background":"",
      "color":""
    });
    $(".pub-analytics-current-categories").empty();
    // -------
    tagindx = $(e.target).index()+1;
    $('.pub-analytics-top-categories-feed>option:eq('+tagindx+')').attr('selected', true);
    $(e.target).addClass("cattogg");
    $(e.target).css({
      "background":"rgba(60, 108, 196, 0.75)",
      "color":"#fff"
    });
    $(".pub-analytics-current-categories").append("<span class='pub-analytics-current-item'>"+$(e.target).text()+"</span>");
    
    $(".pub-analytics-current-categories p").css("display", "none");
  });

  $("#share-nextBtn").click((e) => {
    if($("#id_agreement").is(":checked")) {
      $('body').css({
        "pointer-events":"none",
        "opacity":"0.85"
      });
      $(e.target).addClass("l--a-f-f_disable");
      $(".create-site-loader").css("visibility", "visible");
      setTimeout(() => {
        $("body").css({
          "pointer-events":"auto",
          "opacity":"1"
        });
        $(e.target).removeClass("l--a-f-f_disable");
        $(".create-site-loader").css("visibility", "hidden");
      },30000);
    }
  });

});
