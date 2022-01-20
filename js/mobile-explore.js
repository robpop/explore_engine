"use strict";

let expanding_logo_width;
function expmblcrd(t){
  let mobile_library_section_focus = document.getElementById("mobile-library-section-focus");
  let mobile_library_exp_cls = document.getElementsByClassName("mobile-library-exp-cls");
  
  toggle_nav_visibility(true);
  
  $(".mobile-library-exp-info").find(".mobile-library-sitename").text($($(t).closest('.mobile-library-section')).find(".mmeta__title").text());
  
  $(".mobile-library-exp-info").find(".mobile-library-sitedesc").text($($(t).closest('.mobile-library-section')).find(".mmeta__desc").text());
  
  $(".mobile-library-exp-info").css("display","flex");
  $(mobile_library_exp_cls).css("display","inline");
  $(mobile_library_section_focus).removeClass("mlsfepev");
  $(mobile_library_exp_cls).css({
    'width': ($(window).width()*0.12)+'px',
    'height': ($(window).width()*0.12)+'px'
  });
  
  // load link href and link title
  $(".explore-site--open__mobile").attr("title", $($(t).closest(".mobile-library-section")).find(".mmeta__link_title").text());
  $(".explore-site--open__mobile").attr("href", $($(t).closest(".mobile-library-section")).find(".mmeta__link").text());
  
  $(".mobile-securelink-display").html($($(t).closest(".mobile-library-section")).find(".mmeta__securelink").html());
  
  $(".mobile-library-exp-info .explore-add--library__mobile").css("width", $(".mobile-library-exp-info .explore-site--open__mobile").innerWidth());
  const apit = "apitoken";
  let st = Cookies.get(apit);
  if(!st) {
    $(".mobile-library-exp-info .explore-add--library__mobile").css({
      "padding-left":0,
      "padding-right":0
    });
  }
  
  if($("#__temp_dynlogo").length) {
    $("#__temp_dynlogo").remove();
  }
  
  // check if the logo is dynamically generated
  if($(t).attr("data-mobile")) {
    // make the dynamic logo large and position front and center
    $(".mobile-library-exp-info img").hide();
    let dyn_logo = $(t).find(".mobile-library-preview__svg");
    let n = $($(dyn_logo).html());
    $(n).attr("id", "__temp_dynlogo");
    $(".mobile-library-exp-info").prepend(n);
    if(expanding_logo_width > 1) expanding_logo_width = 1;
    else if(expanding_logo_width < 0.8) expanding_logo_width = 0.8;
    $("#__temp_dynlogo").css({
      'width':'128px',
      'height':'128px',
      '-webkit-transform' : 'scale(' + expanding_logo_width + ')',
      '-moz-transform'    : 'scale(' + expanding_logo_width + ')',
      '-ms-transform'     : 'scale(' + expanding_logo_width + ')',
      '-o-transform'      : 'scale(' + expanding_logo_width + ')',
      'transform'         : 'scale(' + expanding_logo_width + ')',
    });
  } else {
    $(".mobile-library-exp-info img").show();
    $(".mobile-library-exp-info img").attr("src", $($(t).closest(".mobile-library-section")).find(".mobile-library-preview img").attr("src"));
  }
  return true;
}
function shkmblcrd(t) {
  toggle_nav_visibility(false);
  let mobile_library_exp_cls = document.getElementsByClassName("mobile-library-exp-cls");
  $(".mobile-library-exp-info").css("display","none");
  $(mobile_library_exp_cls).css("display","none");
  return true;
}

function cdt() {
  let dt = new Date();
  return dt.getTime();
}

function m__good_feedback(b0,b1,b2) {
  if(b0 && b1 && b2) {
    $("#mobile-card-givefeedback_send").removeClass("l--a-f-f_disable");
    return true;
  } else {
    $("#mobile-card-givefeedback_send").addClass("l--a-f-f_disable");
    return false;
  }
}

$(function(){

  let global_title_bar = document.getElementById("global-title-bar");
  let mobile_explore_cb_series_group = document.getElementById("mobile-explore-cb-series-group");
  let mobile_library_exp_cls = document.getElementsByClassName("mobile-library-exp-cls");
  //let mobile_library_section = document.getElementsByClassName("mobile-library-section");
    
  expanding_logo_width = ($(window).innerWidth() * 0.4) / 155;
  
  let m__eufsr__subject_flg = false;
  let m__eufsr__prose_flg = false;
  let m__eufsr__rating_flg = false;
  let m__eufsr__cansend = false;
  
  let m__cansavetofolder = false;
  
  let mobile_sites_already_added = [];
  let mobile_feedback_already_added = [];
  
  const alltag_text = "All Sites";
  
  const apit = "apitoken";
  let st = Cookies.get(apit);
  
  let can_tap_site = true;
  
  let last_tagbar_top = null;
  setInterval(() => {
    if(window.innerWidth<=1000) {
      $("#mobile-explore-tags-bar").css("top", last_tagbar_top);
    }
  },2000);
  
  $("#mobile-explore-allsites-tag").text(alltag_text);
  
  if(window.innerWidth<=1000) {
    $(".mobile-library-section").css("width", "");
    setTimeout(() => {
      $("#header-bar-space").css({
        "height": "calc(70px + 8vh)"
      });
      $("#mobile-explore-tags-bar").css("display", "inline");
      $("#mobile-explore-tags-bar").position({
        my: "top",
        at: "bottom",
        of: $(global_title_bar),
        collision: "none"
      });
      last_tagbar_top = $("#mobile-explore-tags-bar").css("top");
    },0);
  } else {
    $("#header-bar-space").css("height", "");
    $("#mobile-explore-tags-bar").css("display", "");
  }

  // when mobile site card is tapped
  $(document).on("click", ".mobile-library-section", (e) => {
    e.target = $(e.target).closest(".mobile-library-section");
    console.log(e.target);
    let mobile_library_section_focus = document.getElementById("mobile-library-section-focus");
    if(can_tap_site) {
      can_tap_site = false;
      console.log("no tpa site");
      // move this element to clicked card
      // unhide
      // expand fullscreen
      let t=e.target;
      $("body").css({
        'height':'100vh',
        'overflow':'hidden'
      });
      $(mobile_library_section_focus).css({
        "display":"flex",
        "position":"fixed",
        "left":$(t).position().left,
        "overflow":"scroll"
      });
      $("[data-mSelCrd]").removeAttr("data-mSelCrd");
      $(t).attr("data-mSelCrd", true);
      $(mobile_library_section_focus).attr("data-asid", $(t).attr("data-asid"));
      $(mobile_library_section_focus).attr("data-sid", $(t).attr("data-sid"));
      $(mobile_library_section_focus).attr("data-sname", $(t).find(".mobile-library-info p").text());
      $(mobile_library_section_focus).removeClass("fadeOut");
      $(mobile_library_section_focus).addClass("fadeIn");
      $(mobile_library_section_focus).position({
        my: "top",
        at: "top",
        of: $(t),
        collision: "none"
      });
      window.setTimeout(function(){
        $(mobile_library_section_focus).addClass("mlsfeanim");
        $(mobile_library_section_focus).addClass("mlsfe");
        $(e.target).addClass("mlsfep");
        $(mobile_library_section_focus).css({
          "top":0,
          "height":"100%",
          "left":"",
          "borderRadius":0
        });
        console.log($(mobile_library_section_focus).css("height"));
        console.log($(global_title_bar).height());
        // expanded view ready to show description, feedback, report, open, add to library, all that good stuff
        window.setTimeout(function(){
          expmblcrd(e.target);
        },250);
      },250);

      $(mobile_library_exp_cls).click(function(){
        $(mobile_library_section_focus).addClass("mlsfepev");
        $("body").css({
          'height':'',
          'overflow':''
        });
        $(mobile_library_section_focus).attr("data-sname", "");
        shkmblcrd(e.target);
        window.setTimeout(function(){
          $(mobile_library_section_focus).removeClass("mlsfe");
          $('.mlsfep').removeClass("mlsfep");
          $(mobile_library_section_focus).removeClass("fadeIn");
          $(mobile_library_section_focus).addClass("fadeOut");
          window.setTimeout(function(){
            $(mobile_library_section_focus).css({
              "display":"none",
              "position":"",
              "top":"",
              "borderRadius":"",
              "overflow":"",
              "height":""
            });
            $(mobile_library_section_focus).removeClass("mlsfeanim");
            can_tap_site = true;
            console.log("can_tap_site");
          },350);
        },250);
      });

      $(window).resize(function(){
        
        $(".mobile-library-exp-info .explore-add--library__mobile").css("width", $(".mobile-library-exp-info .explore-site--open__mobile").innerWidth());
        if(!st) {
          $(".mobile-library-exp-info .explore-add--library__mobile").css({
            "padding-left":0,
            "padding-right":0
          });
        }
        
        /*$(mobile_library_section_focus).css({
          "top":0,
          "height":"100%"
        });*/
        
        if($(mobile_library_exp_cls).length) {
          $(mobile_library_exp_cls).css({
            'width': ($(window).width()*0.12)+'px',
            'height': ($(window).width()*0.12)+'px'
          });
        }
        if(window.innerWidth>1000) {
          if(!$(mobile_library_section_focus).hasClass("mlsfepev")) {
            $(mobile_library_section_focus).addClass("mlsfepev");
            $("body").css({
              'height':'',
              'overflow':''
            });
            can_tap_site = shkmblcrd(e.target);
            console.log("can_tap_site");
            $(mobile_library_section_focus).removeClass("mlsfe");
            $('.mlsfep').removeClass("mlsfep");
            $(mobile_library_section_focus).removeClass("fadeIn");
            $(mobile_library_section_focus).addClass("fadeOut");
            $(mobile_library_section_focus).css({
              "display":"none",
              "position":"",
              "top":"",
              "borderRadius":"",
              "height":""
            });
            $(mobile_library_section_focus).removeClass("mlsfeanim");
          }
        }
      });
    }
  });
  
  $(document).on("click", ".explore-add--library__mobile", (e) => {
    if(st) {
      let self = $(".mlsfe");
      let self_inner = $(self).find(".mobile-card-givefeedback");
      $(mobile_library_exp_cls).addClass("fadeOutDown");
      $(self).find(".mobile-library-exp-info").addClass("fadeOut");
      setTimeout(() => {
        $(self).find(".mobile-library-exp-info").css("display", "none");
        $(self).find(".mobile-card-addtolibrary").addClass("fadeIn");
        $(self).find(".mobile-card-addtolibrary").css("display", "block");
        $(mobile_library_exp_cls).css("display", "none");
        $(mobile_library_exp_cls).removeClass("fadeOutDown");
        $(self).find(".mobile-library-exp-info").removeClass("fadeOut");
      },250);
    }
  });
  
  $(document).on("click", "#mobile-card-feedback_btn", (e) =>{
    if(st) {
      let self = $(".mlsfe");
      let self_inner = $(self).find(".mobile-card-givefeedback");
      $(mobile_library_exp_cls).addClass("fadeOutDown");
      $(self).find(".mobile-library-exp-info").addClass("fadeOut");
      setTimeout(() => {
        $(self).find(".mobile-library-exp-info").css("display", "none");
        $(self).find(".mobile-card-givefeedback").addClass("fadeIn");
        $(self).find(".mobile-card-givefeedback").css("display", "block");
        $(mobile_library_exp_cls).css("display", "none");
        $(mobile_library_exp_cls).removeClass("fadeOutDown");
        $(self).find(".mobile-library-exp-info").removeClass("fadeOut");
      },250);
      $(self_inner).find("h2").text("Tell "+$(self).attr("data-sname")+" what you think");
    }
  });
  
  $(document).on("click", "#mobile-card-givefeedback_cancel", (e) =>{
    let self = $(".mlsfe");
    let self_inner = $(self).find(".mobile-card-givefeedback");
    $(self).find(".mobile-card-givefeedback").removeClass("fadeIn");
    $(self).find(".mobile-card-givefeedback").addClass("fadeOut");
    setTimeout(() => {
      $(self).find(".mobile-card-givefeedback").css("display", "none");
      $(self).find(".mobile-library-exp-info").addClass("fadeIn");
      $(self).find(".mobile-library-exp-info").css("display", "flex");
      $(mobile_library_exp_cls).addClass("fadeInUp");
      $(mobile_library_exp_cls).css("display", "inline");
      $(self).find(".mobile-card-givefeedback").removeClass("fadeOut");
      $(self_inner).find("h2").text("");
    },250);
    
    m__eufsr__rating_flg = false;
    m__eufsr__subject_flg = false;
    m__eufsr__prose_flg = false;
    $("#mobile-card-givefeedback_send").addClass("l--a-f-f_disable");
    $(".fstar").removeClass("fstar");
    $("#mobile-card-feedbacksubject").val("");
    $("#mobile-card-feedbackcontent").val("");
    $(".mobile-card-rating_wrapper div").html("&#9734;");
  });
  
  $(document).on("click", "#mobile-card-givefeedback_send", (e) =>{
    e.target = $(e.target).closest("#mobile-card-givefeedback_send");
    if(m__eufsr__rating_flg && m__eufsr__subject_flg && m__eufsr__prose_flg && m__eufsr__cansend) {
      const m182_url = "http://"+window.location.hostname+":"+window.location.port+"/api/feedback/";
      if(st) {
        $.ajax({
          method: "POST",
          url: m182_url,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            site: $(e.target).closest("#mobile-library-section-focus").attr("data-asid"),
            rating: $(".fstar").length,
            subject: $("#mobile-card-feedbacksubject").val(),
            message: $("#mobile-card-feedbackcontent").val()
          },
          success:function(json) {
            /* cancelation code */
            let self = $(".mlsfe");
            let self_inner = $(self).find(".mobile-card-givefeedback");
            $(self).find(".mobile-card-givefeedback").removeClass("fadeIn");
            $(self).find(".mobile-card-givefeedback").addClass("fadeOut");
            setTimeout(() => {
              $(self).find(".mobile-card-givefeedback").css("display", "none");
              $(self).find(".mobile-library-exp-info").addClass("fadeIn");
              $(self).find(".mobile-library-exp-info").css("display", "flex");
              $(mobile_library_exp_cls).addClass("fadeInUp");
              $(mobile_library_exp_cls).css("display", "inline");
              $(self).find(".mobile-card-givefeedback").removeClass("fadeOut");
            },250);
            $(self_inner).find("h2").text("");
            
            m__eufsr__rating_flg = false;
            m__eufsr__subject_flg = false;
            m__eufsr__prose_flg = false;
            $(e.target).addClass("l--a-f-f_disable");
            $(".fstar").removeClass("fstar");
            $("#mobile-card-feedbacksubject").val("");
            $("#mobile-card-feedbackcontent").val("");
            $(".mobile-card-rating_wrapper div").html("&#9734;");
            
            
            let data_sid = $(e.target).closest("#mobile-library-section-focus").attr("data-sid");
            mobile_feedback_already_added.push(parseInt(data_sid));
            $(".mobile-library-site-feedback button").css("display","none");
            
            // update feedback on desktop equivalent
            $("#explore-main-feed").find("[data-sid="+data_sid+"]").find(".library-site-feedback button").remove();
            $("#explore-main-feed").find("[data-sid="+data_sid+"]").find(".library-site-feedback").append("<p>Feedback is pending</p>");
            /* ------------------------ */
            show_info_notification("Your feedback was submitted to this site's owner", "Feedback sent");
            
          },
          error:function(request, status, error) {
            try {
              $.each(request.responseJSON, function(idx, data) {
                show_error_notification(data, "Oops!");
              }); 
            } catch(e) {
              show_error_notification(request.responseJSON, "Oops!");
            }
            let self = $(".mlsfe");
            let self_inner = $(self).find(".mobile-card-givefeedback");
            $(self).find(".mobile-card-givefeedback").removeClass("fadeIn");
            $(self).find(".mobile-card-givefeedback").addClass("fadeOut");
            setTimeout(() => {
              $(self).find(".mobile-card-givefeedback").css("display", "none");
              $(self).find(".mobile-library-exp-info").addClass("fadeIn");
              $(self).find(".mobile-library-exp-info").css("display", "flex");
              $(mobile_library_exp_cls).addClass("fadeInUp");
              $(mobile_library_exp_cls).css("display", "inline");
              $(self).find(".mobile-card-givefeedback").removeClass("fadeOut");
            },250);
            $(self_inner).find("h2").text("");
            
            m__eufsr__rating_flg = false;
            m__eufsr__subject_flg = false;
            m__eufsr__prose_flg = false;
            $(e.target).addClass("l--a-f-f_disable");
            $(".fstar").removeClass("fstar");
            $("#mobile-card-feedbacksubject").val("");
            $("#mobile-card-feedbackcontent").val("");
            $(".mobile-card-rating_wrapper div").html("&#9734;");
          }
        });
      }
    } else {
      if (!m__eufsr__rating_flg) {
        // no rating
        show_error_notification("Please rate this site 1-5 stars", "Rating required");
      } else if (!m__eufsr__subject_flg) {
        // no subject
        show_error_notification("Please provide a subject (4-50 characters)", "Subject required");
      } else if (!m__eufsr__prose_flg) {
        // no message
        show_error_notification("Please provide a message (8-250 characters)", "Message required");
      }
    }
  });
  
  $(document).on("click", "#mobile-card-addtolibrary_cancel", (e) => {
    let self = $(".mlsfe");
    let self_inner = $(self).find(".mobile-card-addtolibrary");
    $(self).find(".mobile-card-addtolibrary").removeClass("fadeIn");
    $(self).find(".mobile-card-addtolibrary").addClass("fadeOut");
    setTimeout(() => {
      $(self).find(".mobile-card-addtolibrary").css("display", "none");
      $(self).find(".mobile-library-exp-info").addClass("fadeIn");
      $(self).find(".mobile-library-exp-info").css("display", "flex");
      $(mobile_library_exp_cls).addClass("fadeInUp");
      $(mobile_library_exp_cls).css("display", "inline");
      $(self).find(".mobile-card-addtolibrary").removeClass("fadeOut");
    },250);
    $("#mobile-card-addtolibrary_save").addClass("l--a-f-f_disable");
    $(".mobile-card-library-folder__selected").removeClass("mobile-card-library-folder__selected");
  });
  
  $(document).on("click", "#mobile-card-library_folders li", (e) => {
    e.target = $(e.target).closest("#mobile-card-library_folders li");
    $("#mobile-card-library_folders").children().removeClass("mobile-card-library-folder__selected");
    $("#mobile-card-library_folders").children().removeAttr("data-mSelFold");
    let self = e.target;
    $(self).addClass("mobile-card-library-folder__selected");
    $(self).attr("data-mSelFold", true);
    $("#mobile-card-addtolibrary_save").removeClass("l--a-f-f_disable");
    m__cansavetofolder = true;
  });
  
  $(document).on("click", "#mobile-card-addtolibrary_save", (e) => {
    let self = $(".mlsfe");
    let self_inner = $(self).find(".mobile-card-addtolibrary");
    const apit = "apitoken";
    let st = Cookies.get(apit);
    let folder = $("#mobile-card-library_folders").find("[data-mSelFold]");
    if(m__cansavetofolder && folder && st) {
      const m5_url = "http://"+window.location.hostname+":"+window.location.port+"/api/saved-sites/";
      const save_site_param0 = "http://"+window.location.hostname+":"+window.location.port+"/api/sites/";
      const save_site_param1 = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/";
      let fd;
      if($("[data-mselfold]").hasClass("m__exp_usr_libdsh")) {
        fd = "";
      } else {
        fd = save_site_param1+""+$("[data-mselfold]").attr("data-fid")+"/";
      }
      $.ajax({
        method: "POST",
        url: m5_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          site: save_site_param0+""+$("[data-mSelCrd]").attr("data-sid")+"/",
          folder: fd
        },
        success: function(json) {
          let self = $(".mlsfe");
          let self_inner = $(self).find(".mobile-card-addtolibrary");
          $(self).find(".mobile-card-addtolibrary").removeClass("fadeIn");
          $(self).find(".mobile-card-addtolibrary").addClass("fadeOut");
          setTimeout(() => {
            $(self).find(".mobile-card-addtolibrary").css("display", "none");
            $(self).find(".mobile-library-exp-info").addClass("fadeIn");
            $(self).find(".mobile-library-exp-info").css("display", "flex");
            $(mobile_library_exp_cls).addClass("fadeInUp");
            $(mobile_library_exp_cls).css("display", "inline");
            $(self).find(".mobile-card-addtolibrary").removeClass("fadeOut");
          },250);
          $("#mobile-card-addtolibrary_save").addClass("l--a-f-f_disable");
          
          show_info_notification("Saved "+$("[data-mSelCrd]").find(".mobile-library-info").find("p").text()+" to "+$("[data-mselfold]").text(), "Site saved");
          
          $(".explore-add--library__mobile").css("display","none");
          $(".mobile-card-library-folder__selected").removeClass("mobile-card-library-folder__selected");
          
          let data_sid = $(e.target).closest("#mobile-library-section-focus").attr("data-sid");
          mobile_sites_already_added.push(parseInt(data_sid));
          $(".explore-add--library__mobile").css("display","none");
          // remove add to library button from desktop equivalent
          $("#explore-main-feed").find("[data-sid="+data_sid+"]").find(".explore-add--library").remove();
          
          $("[data-mSelCrd]").removeAttr("data-mSelCrd");
          $("[data-mselfold]").removeAttr("data-mselfold");
        },
        error: function(request, status, error) {
          // error gathering folders
        }
      });
    }
  });
  
  $(document).on("click", ".mobile-card-rating_wrapper div", (e) => {
    e.target = $(e.target).closest(".mobile-card-rating_wrapper div");
    let star = e.target;
    let flg = true;
    if($(star).hasClass("fstar")) {
      flg = false;
    } else {
      flg = true;
    }
    if(flg) {
      for(let i=$(star).index(); i>-1; --i) {
        $(".mobile-card-rating_wrapper div").eq(i).html("&#9733;").addClass("fstar");
      }
    } else {
      for(let i=$(star).index()+1; i<$("#eufsr-wrap div").length; ++i) {
        $(".mobile-card-rating_wrapper div").eq(i).html("&#9734;").removeClass("fstar");
      }
    }
    m__eufsr__rating_flg = true;
    m__eufsr__cansend = m__good_feedback(m__eufsr__rating_flg, m__eufsr__subject_flg, m__eufsr__prose_flg);
  });
  
  $(document).on("keyup", "#mobile-card-feedbacksubject", (e) => {
    if($("#mobile-card-feedbacksubject").val().length >= 4 && $("#mobile-card-feedbacksubject").val().length <= 50) {
      m__eufsr__subject_flg = true;
    } else {
      m__eufsr__subject_flg = false;
    }
    m__eufsr__cansend = m__good_feedback(m__eufsr__rating_flg, m__eufsr__subject_flg, m__eufsr__prose_flg);
  });
  
  $(document).on("keyup", "#mobile-card-feedbackcontent", (e) => {
    if($("#mobile-card-feedbackcontent").val().length >= 8 && $("#mobile-card-feedbackcontent").val().length <= 250) {
      m__eufsr__prose_flg = true;
    } else {
      m__eufsr__prose_flg = false;
    }
    m__eufsr__cansend = m__good_feedback(m__eufsr__rating_flg, m__eufsr__subject_flg, m__eufsr__prose_flg);
  });
  
  


  //////////////////////////////////////////////
  $(window).resize(() => {
    expanding_logo_width = ($(window).innerWidth() * 0.4) / 155;
    if(expanding_logo_width > 1) expanding_logo_width = 1;
    else if(expanding_logo_width < 0.8) expanding_logo_width = 0.8;
    if($("#__temp_dynlogo").length) {
      $("#__temp_dynlogo").css({
        'width':'128px',
        'height':'128px',
        '-webkit-transform' : 'scale(' + expanding_logo_width + ')',
        '-moz-transform'    : 'scale(' + expanding_logo_width + ')',
        '-ms-transform'     : 'scale(' + expanding_logo_width + ')',
        '-o-transform'      : 'scale(' + expanding_logo_width + ')',
        'transform'         : 'scale(' + expanding_logo_width + ')',
      });
    }
    if(window.innerWidth<=1000) {
      $(".mobile-library-section").css("width", "");
      setTimeout(() => {
        $("#header-bar-space").css({
          "height": "calc(70px + 8vh)"
        });
        console.log("Swap to mobile");
        $("#mobile-explore-tags-bar").css("display", "inline");
        if($("#mobile-explore-tags-bar").css("pointer-events")!=="none") {
          $("#mobile-explore-tags-bar").position({
            my: "top",
            at: "bottom",
            of: $(global_title_bar),
            collision: "none"
          });
          last_tagbar_top = $("#mobile-explore-tags-bar").css("top");
        }
      },0);
    } else {
      $("#header-bar-space").css("height", "");
      $("#mobile-explore-tags-bar").css("display", "");
    }
  });
  
  $(document).on("click", ".mobile-library-section", (e) => {
    e.target = $(e.target).closest(".mobile-library-section");
    setTimeout(() => {
      if(mobile_sites_already_added.includes(parseInt($(e.target).attr("data-sid")))) {
        $(".explore-add--library__mobile").css("display","none");
        console.log("HIDE ADDTOLIBRARY");
      }
      if(mobile_feedback_already_added.includes(parseInt($(e.target).attr("data-sid")))) {
        $(".mobile-library-site-feedback button").css("display","none");
      }
    },0);
    //return true;
  });
  
  $(window).scroll(() => {
    if(window.innerWidth<=1000 && $("#mobile-explore-tags-bar").css("pointer-events")!=="none") {
      $("#mobile-explore-tags-bar").position({
        my: "top",
        at: "bottom",
        of: $(global_title_bar),
        collision: "none"
      });  
      last_tagbar_top = $("#mobile-explore-tags-bar").css("top");
    }
  });

});
