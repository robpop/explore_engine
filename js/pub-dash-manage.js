"use strict";
function setURL(input) {
    $('.pamf-media-display-logo img').attr('src', input);
    $('.pamf-media-display-logo img').css({
      "width":"100%",
      "height":"auto"
    });
    $(".pamf-media-display-logo span").css("display","none");
    $("#pamf-media-display-logo_generate").css("opacity", "0.5");
    $(".pamf-media-display-full--logo-text").css("display", "none");
    $(".pamf-media-display-full--logo-usedefault").css("display", "block");
    return input;
}
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
          return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
        }
      } else {
        show_error_notification("Your logo cannot exceed 1MB in size", "Logo is too large");
        return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
      }
    }
}

$(() => {
  let sel_bar_inc = 0;
  let compared_cnt = 1;
  let cat_sel_cnt=0;
  let cmp_incec;
  let cmp_actind=[];

  let pubdash_change_logo_toggle = document.getElementById("pubdash-change-logo_toggle");
  let pub_userfeedback_toggle_func_sign = document.getElementById("pub-userfeedback-toggle-func-sign");
  let pub_userfeedback_toggle_func_log = document.getElementById("pub-userfeedback-toggle-func-log");
  let pub_uf_nf = document.getElementsByClassName("pub-uf-nf");
  let pub_uf_sf = document.getElementsByClassName("pub-uf-sf");
  let pubdash_delete_site = document.getElementById("pubdash-delete-site");
  let pub_delete_site_input_password = document.getElementById("pub-delete-site-input-password");
    
  $('#id_change_logo').prop('checked', false);
  
  $.each($("input[type='text']"), function(idx, data) {
    Enforcer(data);
  });
  $.each($("input[type='password']"), function(idx, data) {
    Enforcer(data);
  });
  $.each($("textarea"), function(idx, data) {
    Enforcer(data);
  });

  let autocomp_source=[];
  for(let i=0;i<$(".pub-analytics-top-categories-feed").children().length;i++) {
    autocomp_source.push($(".pub-analytics-top-categories-feed").children()[i].textContent);
  }

  $(".pub-analytics-subarray-three-flex").sortable({
    revert: true,
    tolerance: "pointer"
  });

  $(".pub-analytics-side-card-compare").mouseover(function(e){
    $(e.target.parentElement).css("background", "#fff");
  }).mouseout(function(e){
    $(e.target.parentElement).css("background", "");
  });
  
  let current_logo = null;
  setTimeout(() => {
    current_logo = $('#pubdash-current-logo_display').attr('src');
  },3000);
  
  
  $(pubdash_change_logo_toggle).click(() => {
    if(current_logo) {
      $("#pub-update-site-details__btn").removeClass("l--a-f-f_disable");
      if($('#id_change_logo').is(':checked')) {
        $('#id_change_logo').prop('checked', false);
        $('#pubdash-change-logo_toggle').text("Update logo");
        $("#pamf-media-display-logo_generate--marker").css({
          'pointer-events':'none',
          'opacity':0.5
        });
        if(current_logo!=="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=") {
          setURL(current_logo);
        } else {
          $('.pamf-media-display-logo img').attr('src', "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
          $('.pamf-media-display-logo img').css({
            "width":"0px",
            "height":"0px"
          });
          $(".pamf-media-display-logo span").css("display","inline");
          $("#pamf-media-display-logo_generate").css("opacity", "1");
          $(".pamf-media-display-full--logo-text").css("display", "block");
          $(".pamf-media-display-full--logo-usedefault").css("display", "none");
        }
      } else {
        $('#id_change_logo').prop('checked', true);
        $('#pubdash-change-logo_toggle').text("Cancel");
        $("#pamf-media-display-logo_generate--marker").css({
          'pointer-events':'auto',
          'opacity':1
        });
        if(current_logo==="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=") {
          $(".pamf-media-logo").val("");
          $('.pamf-media-display-logo img').attr('src', "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
          $('.pamf-media-display-logo img').css({
            "width":"0px",
            "height":"0px"
          });
          $(".pamf-media-display-logo span").css("display","inline");
          $("#pamf-media-display-logo_generate").css("opacity", "1");
          $(".pamf-media-display-full--logo-text").css("display", "block");
          $(".pamf-media-display-full--logo-usedefault").css("display", "none");
        }
      }
    }
  });
  
  $(".pamf-media-display-full--logo-usedefault").click(() => {
    current_logo = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  });
  
  $(".pamf-media-logo").change(function(){
    current_logo = readURL(this);
    let new_logo = setInterval(() => {
      if(!current_logo) current_logo = $('#pubdash-current-logo_display').attr('src');
      else clearInterval(new_logo);
    },1000);
  });
  
  
  // enable save site Changes
  // pub-update-site-details__btn
  $(".pubdash-details-description-group textarea").keyup(() => {
    $("#pub-update-site-details__btn").removeClass("l--a-f-f_disable");
  });
  $(".pub-analytics-modify-form-mbtm").keyup(() => {
    $("#pub-update-site-details__btn").removeClass("l--a-f-f_disable");
  });


  $(".pub-autogenerate-switch input").change(function(){
    if($(".pub-autogenerate-switch input").is(":checked")) {
      $("#pub-analytics-masterarray").hide();
      $(".pub-autogenerate-graphic").addClass("pub-autogenerate-graphic-flex");
    } else {
      $("#pub-analytics-masterarray").show();
      $(".pub-autogenerate-graphic").removeClass("pub-autogenerate-graphic-flex");
    }
  });


  $(pub_userfeedback_toggle_func_sign).click(function(){
    $(this).css("background-color","");
    $(this).addClass("pub-userfeedback-toggle-func-fcs");
    $(this).removeClass("pub-userfeedback-toggle-func-nfcs");
    $(pub_userfeedback_toggle_func_log).removeClass("pub-userfeedback-toggle-func-fcs");
    $(pub_userfeedback_toggle_func_log).addClass("pub-userfeedback-toggle-func-nfcs");
    $(pub_uf_nf).css({
      "display":"flex",
      "flex-direction":"column"
    });
    $(pub_uf_sf).hide();
  });
  $(pub_userfeedback_toggle_func_log).click(function(){
    $(this).css("background-color","");
    $(this).addClass("pub-userfeedback-toggle-func-fcs");
    $(this).removeClass("pub-userfeedback-toggle-func-nfcs");
    $(pub_userfeedback_toggle_func_sign).removeClass("pub-userfeedback-toggle-func-fcs");
    $(pub_userfeedback_toggle_func_sign).addClass("pub-userfeedback-toggle-func-nfcs");
    $(pub_uf_nf).hide();
    $(pub_uf_sf).css({
      "display":"flex",
      "flex-direction":"column"
    });
  });

  $(".pub-userfeedback-toggle-func button").mouseenter(function(e){
    if($(this).hasClass("pub-userfeedback-toggle-func-nfcs")) {
      $(this).css("background-color", "#849CC8");
    }
  }).mouseleave(function(e){
    if($(this).hasClass("pub-userfeedback-toggle-func-nfcs")) {
      $(this).css("background-color", "#CBCBCB");
    }
  });
  
  $(pub_delete_site_input_password).keyup(() => {
    if($(pub_delete_site_input_password).val().length > 7) {
      $(pubdash_delete_site).removeClass("l--a-f-f_disable");
    } else {
      $(pubdash_delete_site).addClass("l--a-f-f_disable");
    }
  });

});
