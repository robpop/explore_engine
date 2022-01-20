"use strict";

let expanding_logo_width;

function toggle_editor(e, fab0, fab1, svg0, svg1, dltfolder) {
  if(e) {
    $(dltfolder).parent().show();
    $(fab1).addClass("animated fasterer fadeInUp");
    $(fab1).css("display", "inline-block");
    setTimeout(() => {
      $(fab0).addClass("animated fasterer fadeInUp");
      $(fab0).css("display", "inline-block");
    },50);
    setTimeout(() => {
      $(fab0).removeClass("animated fasterer fadeInUp");
      $(fab1).removeClass("animated fasterer fadeInUp");
    },350);
    $(svg0).hide();
    $(svg1).show();
  } else {
    $(dltfolder).parent().hide();
    $(fab0).css("display", "none");
    $(fab1).css("display", "none");
    $(svg1).hide();
    $(svg0).show();
  }
}

function null_dashboard() {
  // check for empty library dashboard after site deletion or move
  if($(".lditm").length > 1) {
    $("#library-site-editor-bar").css("display","block");
    $(".library--empty-folder").css("display", "none");
  } else {
    $("#library-site-editor-bar").css("display","none");
    $(".library--empty-folder").css("display", "flex");
  }
}

function m__good_feedback(b0,b1,b2) {
  let mobile_card_givefeedback_send = document.getElementById("mobile-card-givefeedback_send");
  if(b0 && b1 && b2) {
    $(mobile_card_givefeedback_send).removeClass("l--a-f-f_disable");
    return true;
  } else {
    $(mobile_card_givefeedback_send).addClass("l--a-f-f_disable");
    return false;
  }
}

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


$(function(){
  let global_title_bar = document.getElementById("global-title-bar");
  let explore_main_feed = document.getElementById("library-items--sites");
  let mobile_explore_tags_bar = document.getElementById("mobile-explore-tags-bar");
  let mobile_library_section = document.getElementsByClassName("mobile-library-section");
  let mobile_library_close_site = document.getElementById("mobile-library-close-site");
  let mobile_library_edit_fab = document.getElementById("mobile-library-edit-fab").getElementsByTagName("button")[2];
  let mobile_library_edit_fab__1 = document.getElementById("mobile-library-edit-fab").getElementsByTagName("button")[1];
  let mobile_library_edit_fab__0 = document.getElementById("mobile-library-edit-fab").getElementsByTagName("button")[0];
  let mobile_library_edit_fab__svg_0 = document.getElementById("mobile-library-edit-fab").getElementsByTagName("button")[2].getElementsByTagName("svg")[0];
  let mobile_library_edit_fab__svg_1 = document.getElementById("mobile-library-edit-fab").getElementsByTagName("button")[2].getElementsByTagName("svg")[1];
  let mobile_library_close_dialog = document.getElementById("mobile-library-edit-fab").getElementsByTagName("button")[3];
  let mobile_library_editing_dialog__p_0 = document.getElementById("mobile-library_editing_dialog").getElementsByTagName("p")[0];
  let mobile_library_editing_dialog__p_1 = document.getElementById("mobile-library_editing_dialog").getElementsByTagName("p")[1];
  let mobile_library_del__optbtn_cnl = document.getElementsByClassName("mobile_library-del--optbtn_cnl");
  let mobile_library_mov__optbtn_cnl = document.getElementsByClassName("mobile_library-mov--optbtn_cnl");
  let mobile_library_del__optbtn_crt = document.getElementsByClassName("mobile_library-del--optbtn_crt");
  let mobile_library_mov__optbtn_crt = document.getElementsByClassName("mobile_library-mov--optbtn_crt");
  let mobile_library_newf__optbtn_cnl = document.getElementsByClassName("mobile_library-newf--optbtn_cnl");
  let mobile_library_newf__optbtn_crt = document.getElementsByClassName("mobile_library-newf--optbtn_crt");
  let mobile_library_newf__optinp = document.getElementById("mobile_library-newf--optinp");
  let mobile_library_delf__optbtn_cnl = document.getElementsByClassName("mobile_library-delf--optbtn_cnl");
  let mobile_library_delf__optbtn_crt = document.getElementsByClassName("mobile_library-delf--optbtn_crt");
  let mled__delete = document.getElementsByClassName("mled__delete");
  let mled__move = document.getElementsByClassName("mled__move");
  let mobile_addnewfolder_button = document.getElementById("mobile-addnewfolder-button");
  let mobile_library_deletefolder;
  try {
    mobile_library_deletefolder = document.getElementById("mobile-library_deletefolder").getElementsByTagName("button")[0];
  } catch (e) {}
  
  expanding_logo_width = ($(window).innerWidth() * 0.4) / 155;
  
  let mobile_library_editing_dialog = document.getElementById("mobile-library_editing_dialog");
  let mobile_library_newfolder_dialog = document.getElementById("mobile-library_newfolder_dialog");
  let mobile_library_deletefolder_dialog = document.getElementById("mobile-library_deletefolder_dialog");
  
  let mobile_library_section_focus = document.getElementById("mobile-library-section-focus");
  let mobile_library_exp_cls = document.getElementsByClassName("mobile-library-exp-cls");
  
  let m__library_feedback_success = document.getElementById("m__library-feedback-success");
  
  let mobile_library_site_feedback__button = document.getElementById("mobile-card-feedback_btn");
  let mobile_card_givefeedback_cancel = document.getElementById("mobile-card-givefeedback_cancel");
  let mobile_card_feedbacksubject = document.getElementById("mobile-card-feedbacksubject");
  let mobile_card_feedbackcontent = document.getElementById("mobile-card-feedbackcontent");
  let mobile_card_givefeedback_send = document.getElementById("mobile-card-givefeedback_send");
  
  let m__eufsr__subject_flg = false;
  let m__eufsr__prose_flg = false;
  let m__eufsr__rating_flg = false;
  let m__eufsr__cansend = false;
  
  let sites_selected = 0;
  let is_editing = false;
  let is_addingfolder = false;
  let nele, fnele, mfnele;
  
  const lib = "/library/";
  
  let can_tap_site = true;
  
  let mobile_feedback_already_added = [];
  
  let mobile_folder = null;
  
  const apit = "apitoken";
  let st = Cookies.get(apit);
  
  const alltag_text = "Dashboard";
    
  const edit_remove__msg = "Remove the selected sites from your library?";
  const edit_move__msg = "Your Library";
  const edit_move__submsg = "Select a folder below";
    
  $("#mobile-explore-allsites-tag").attr("href", lib).attr("data-name", "LIBRARY");
  
  $("#mobile-explore-allsites-tag").text(alltag_text);
  
  $(mobile_addnewfolder_button).css("display", "inline-block");
  
  $(mobile_explore_tags_bar).css("line-height", $(mobile_explore_tags_bar).height()+"px");
  
  $("#mobile-library_editing_dialog__wrapper").css({
    "top":$(window).innerHeight()/2 - $("#mobile-library_editing_dialog__wrapper").innerHeight()/2
  });
  
  let last_tagbar_top = null;
  setInterval(() => {
    if(window.innerWidth<=1000) {
      $(mobile_explore_tags_bar).css("top", last_tagbar_top);
    }
  },2000);
  
  if($(mobile_library_edit_fab).length) {
    $(mobile_library_edit_fab).css({
      'width': ($(window).width()*0.12)+'px',
      'height': ($(window).width()*0.12)+'px'
    });
  }
  if($(mobile_library_edit_fab__0).length) {
    $(mobile_library_edit_fab__0).css({
      'width': ($(window).width()*0.085)+'px',
      'height': ($(window).width()*0.085)+'px'
    });
  }
  if($(mobile_library_edit_fab__1).length) {
    $(mobile_library_edit_fab__1).css({
      'width': ($(window).width()*0.085)+'px',
      'height': ($(window).width()*0.085)+'px'
    });
  }
  if($(mobile_library_close_dialog).length) {
    $(mobile_library_close_dialog).css({
      'width': ($(window).width()*0.12)+'px',
      'height': ($(window).width()*0.12)+'px'
    });
  }
  
  if(window.innerWidth<=1000) {
    $(mobile_explore_tags_bar).css("display", "inline");
    $("#header-bar-space").css({
      "height": "calc(70px + 8vh)"
    });
    $(mobile_explore_tags_bar).position({
      my: "top",
      at: "bottom",
      of: $(global_title_bar),
      collision: "none"
    });
    last_tagbar_top = $(mobile_explore_tags_bar).css("top");
  } else {
    $("#header-bar-space").css("height", "");
    $(mobile_explore_tags_bar).css("display", "");
  }
  
  $(window).resize(() => {
    
    $("#mobile-library_editing_dialog__wrapper").css({
      "top":$(window).innerHeight()/2 - $("#mobile-library_editing_dialog__wrapper").innerHeight()/2
    });
    
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
    
    $(mobile_library_section_focus).css({
      "top":0,
      "height":"100%"
    });
    
    $(mobile_explore_tags_bar).css("line-height", $(mobile_explore_tags_bar).height()+"px");
    if(window.innerWidth<=1000) {
      if(!is_editing) {
        setTimeout(() => {
          $("#header-bar-space").css({
            "height": "calc(70px + 8vh)"
          });
          $(mobile_explore_tags_bar).css("display", "inline");
          if($(mobile_explore_tags_bar).css("pointer-events")!=="none") {
            $(mobile_explore_tags_bar).position({
              my: "top",
              at: "bottom",
              of: $(global_title_bar),
              collision: "none"
            });
            last_tagbar_top = $(mobile_explore_tags_bar).css("top");
          }
        },0);
      }
    } else {
      if($("#header-bar-space").css("height") !== "70px") toggle_nav_visibility(false);
      $("#header-bar-space").css("height", "");
      $(mobile_explore_tags_bar).css("display", "");
    }
    
    if($(mobile_library_edit_fab).length) {
      $(mobile_library_edit_fab).css({
        'width': ($(window).width()*0.12)+'px',
        'height': ($(window).width()*0.12)+'px'
      });
    }
    if($(mobile_library_edit_fab__0).length) {
      $(mobile_library_edit_fab__0).css({
        'width': ($(window).width()*0.085)+'px',
        'height': ($(window).width()*0.085)+'px'
      });
    }
    if($(mobile_library_edit_fab__1).length) {
      $(mobile_library_edit_fab__1).css({
        'width': ($(window).width()*0.085)+'px',
        'height': ($(window).width()*0.085)+'px'
      });
    }
    if($(mobile_library_close_dialog).length) {
      $(mobile_library_close_dialog).css({
        'width': ($(window).width()*0.12)+'px',
        'height': ($(window).width()*0.12)+'px'
      });
    }
  });
  
  $(mobile_library_edit_fab).click(() => {
    // need move, delete, and cancel - omit all
    is_editing = !is_editing;
    toggle_editor(is_editing, mobile_library_edit_fab__0, mobile_library_edit_fab__1, mobile_library_edit_fab__svg_0, mobile_library_edit_fab__svg_1,mobile_library_deletefolder);
    if(!is_editing) {
      // clear site selections and disable helper fabs
      sites_selected = 0;
      $(mobile_library_edit_fab__0).addClass("l--a-f-f_disable");
      $(mobile_library_edit_fab__1).addClass("l--a-f-f_disable");
      $(".mobile_library_selected").removeClass("mobile_library_selected");
    } else {
      if($(mobile_library_deletefolder).length) $(mobile_library_deletefolder).show();
    }
  });
  
  $(window).scroll(() => {
    if(window.innerWidth<=1000 && $(mobile_explore_tags_bar).css("pointer-events")!=="none") {
      $(mobile_explore_tags_bar).position({
        my: "top",
        at: "bottom",
        of: $(global_title_bar),
        collision: "none"
      });  
      last_tagbar_top = $(mobile_explore_tags_bar).css("top");
    }
  });
  
  $(mobile_library_section).click((e) => {
    let self = e.target;
    if(is_editing) {
      // if editing, highlight blue and shrink somewhat
      $(self).toggleClassAfter("mobile_library_selected", () => {
        if($(self).hasClass("mobile_library_selected")) {
          sites_selected--;
          if(sites_selected <= 0) {
            $(mobile_library_edit_fab__0).addClass("l--a-f-f_disable");
            $(mobile_library_edit_fab__1).addClass("l--a-f-f_disable");
          }
        } else {
          sites_selected++;
          if(sites_selected > 0) {
            $(mobile_library_edit_fab__0).removeClass("l--a-f-f_disable");
            $(mobile_library_edit_fab__1).removeClass("l--a-f-f_disable");
          }
        }
      });
    } else {
      if(can_tap_site) {
        can_tap_site = false;
        $(mobile_library_edit_fab).hide();
        // if not editing, same behavior as explore page
        $("body").css({
          'height':'100vh',
          'overflow':'hidden'
        });
        $(mobile_library_section_focus).css({
          "display":"flex",
          "position":"fixed",
          "left":$(self).position().left,
          "overflow":"scroll"
        });
        $("[data-mSelCrd]").removeAttr("data-mSelCrd");
        $(self).attr("data-mSelCrd", true);
        $(mobile_library_section_focus).attr("data-asid", $(self).attr("data-asid"));
        $(mobile_library_section_focus).attr("data-sid", $(self).attr("data-sid"));
        $(mobile_library_section_focus).attr("data-sname", $(self).find(".mobile-library-info p").text());
        $(mobile_library_section_focus).removeClass("fadeOut");
        $(mobile_library_section_focus).addClass("fadeIn");
        $(mobile_library_section_focus).position({
          my: "top",
          at: "top",
          of: $(self),
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
          // expanded view ready to show description, feedback, report, open, add to library, all that good stuff
          window.setTimeout(function(){
            expmblcrd(e.target);
          },250);
        },250);  
      }
    }
    
    $(mobile_library_exp_cls).click(() => {
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
        },350);
        $(mobile_library_edit_fab).show();
      },250);
    });
    
    $(window).resize(() => {
      
      $(".mobile-library-exp-info .explore-add--library__mobile").css("width", $(".mobile-library-exp-info .explore-site--open__mobile").innerWidth());
      if(!st) {
        $(".mobile-library-exp-info .explore-add--library__mobile").css({
          "padding-left":0,
          "padding-right":0
        });
      }
      
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
    
  });

  
  $(".m__lmsf-lof ul li").click((e) => {
    if($(e.target).hasClass("m__lmsf-slct")) {
      $(e.target).toggleClassAfter("m__lmsf-slct", () => {
        mobile_folder = null;
        $(mobile_library_mov__optbtn_crt).addClass("l--a-f-f_disable");
      });
    } else {
      $(".m__lmsf-slct").removeClass("m__lmsf-slct");
      $(e.target).toggleClassAfter("m__lmsf-slct", () => {
        mobile_folder = e.target;
        $(mobile_library_mov__optbtn_crt).removeClass("l--a-f-f_disable");
      });
    }
  });
  
  $(mobile_library_deletefolder).click(() => {
    $(mobile_library_deletefolder_dialog).show();
    $(mobile_addnewfolder_button).addClass("add_libfolder_disable");
    $(mobile_library_edit_fab).hide();
    $(mobile_library_edit_fab__0).hide();
    $(mobile_library_edit_fab__1).hide();
    $(mobile_library_close_dialog).show();
    $(mobile_library_deletefolder).hide();
  });
  
  $(mobile_library_delf__optbtn_cnl).click(() => {
    $(mobile_library_close_dialog).hide();
    $(mobile_addnewfolder_button).removeClass("add_libfolder_disable");
    $(mobile_library_deletefolder_dialog).hide();
    $(mobile_library_edit_fab).show();
    if(is_editing) {
      $(mobile_library_deletefolder).show();
      $(mobile_library_edit_fab__0).show();
      $(mobile_library_edit_fab__1).show();
    }
  });
  
  $(mobile_library_delf__optbtn_crt).click(() => {
    if(st) {
      let fid = (window.location.href).split('/');
      for(let i=fid.length;i>=0;i--) {
        if (fid[i] !== "" && !isNaN(fid[i])) {
          fid = fid[i];
          break;
        }
      }
      const m67_url = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/"+""+fid+"/";
      $.ajax({
        method: "DELETE",
        url: m67_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          // redirect back to library page
          window.location.replace("http://"+window.location.hostname+":"+window.location.port+"/library/");
        },
        error:function(request, status, error) {
          try {
            $.each(request.responseJSON, function(idx, data) {
              show_error_notification(data, "Oops!");
            }); 
          } catch(e) {
            show_error_notification(request.responseJSON, "Oops!");
          }
        }
      });
    }
  });
  
  
  $(mobile_library_mov__optbtn_crt).click(() => {
    if(!$(mobile_library_mov__optbtn_crt).hasClass("l--a-f-f_disable") && mobile_folder) {
      const m4_url = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/";
      let dest_folder = $(mobile_folder).attr("data-fid");
      // determine if multiple sites were selected      
      if(st) {
        for(let i=0; i<sites_selected; ++i) {
          let prnt = $(".mobile_library_selected").eq(i);
          let prnt_desktop = $("#library-items--sites").find("[data-sid="+$(prnt).attr("data-sid")+"]");
          let fid = $(".mobile_library_selected").eq(i).attr("data-apiid");
          fid = fid.split('/');
          for(let i=fid.length;i>=0;i--) {
            if (fid[i] !== "" && !isNaN(fid[i])) {
              fid = fid[i];
              break;
            }
          }
          let m39_url = "http://"+window.location.hostname+":"+window.location.port+"/api/saved-sites/"+fid+"/";
          if(!isNaN(fid)) {
            let data_payload = m4_url+""+dest_folder+"/";
            if(dest_folder) {
              data_payload = m4_url+""+dest_folder+"/";
            } else {
              data_payload = "";
            }
            $.ajax({
              method: "PATCH",
              url: m39_url,
              headers: {
                "Authorization" : "Token "+""+st
              },
              data: {
                folder: data_payload,
                nocache: cdt()
              },
              success:function(json) {
                $(prnt).remove();
                $(prnt_desktop).remove();
                $(mobile_addnewfolder_button).removeClass("add_libfolder_disable");
                $(mobile_library_close_dialog).hide(); 
                $(mobile_library_editing_dialog).hide();
                $(mobile_library_edit_fab__0).hide();
                $(mobile_library_edit_fab__1).hide();
                $(mobile_library_edit_fab).show();
                //$(prnt).removeClass("mobile_library_selected");
                $(mobile_library_edit_fab__0).addClass("l--a-f-f_disable");
                $(mobile_library_edit_fab__1).addClass("l--a-f-f_disable");
                $(mobile_library_edit_fab__svg_1).hide();
                $(mobile_library_edit_fab__svg_0).show();
                $(mobile_library_mov__optbtn_crt).addClass("l--a-f-f_disable");
                $(mled__move).hide();
                $(mled__delete).hide();
                toggle_nav_visibility(false);
                null_dashboard();
              },
              error:function(request, status, error) {
                try {
                  $.each(request.responseJSON, function(idx, data) {
                    show_error_notification(data, "Oops!");
                  }); 
                } catch(e) {
                  show_error_notification(request.responseJSON, "Oops!");
                }
                toggle_nav_visibility(false);
              },
              complete:function(data) {
                is_editing = false;
                if($(".mobile_library_selected").length <= 0) {
                  show_info_notification(sites_selected > 1 ? "Moved "+sites_selected+" sites successfully" : "Moved site successfully");
                  sites_selected = 0;
                }          
              }
            });
          }
        }
      }
      
    }
  });
  
  $(".mobile-card-rating_wrapper div").click((e) => {
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
  
  $(mobile_card_feedbacksubject).keyup(() => {
    if($(mobile_card_feedbacksubject).val().length >= 4 && $(mobile_card_feedbacksubject).val().length <= 50) {
      m__eufsr__subject_flg = true;
    } else {
      m__eufsr__subject_flg = false;
    }
    m__eufsr__cansend = m__good_feedback(m__eufsr__rating_flg, m__eufsr__subject_flg, m__eufsr__prose_flg);
  });
  
  $(mobile_card_feedbackcontent).keyup(() => {
    if($(mobile_card_feedbackcontent).val().length >= 8 && $(mobile_card_feedbackcontent).val().length <= 250) {
      m__eufsr__prose_flg = true;
    } else {
      m__eufsr__prose_flg = false;
    }
    m__eufsr__cansend = m__good_feedback(m__eufsr__rating_flg, m__eufsr__subject_flg, m__eufsr__prose_flg);
  });
  
  $(mobile_library_site_feedback__button).click(() => {
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
  });
  
  $(mobile_card_givefeedback_cancel).click(() => {
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
    $(mobile_card_givefeedback_send).addClass("l--a-f-f_disable");
    $(".fstar").removeClass("fstar");
    $(mobile_card_feedbacksubject).val("");
    $(mobile_card_feedbackcontent).val("");
    $(".mobile-card-rating_wrapper div").html("&#9734;");
  });
  
  $(mobile_card_givefeedback_send).click(() => {
    if(m__eufsr__rating_flg && m__eufsr__subject_flg && m__eufsr__prose_flg && m__eufsr__cansend) {
      const m182_url = "http://"+window.location.hostname+":"+window.location.port+"/api/feedback/";
      const apit = "apitoken";
      let st = Cookies.get(apit);
      if(st) {
        $.ajax({
          method: "POST",
          url: m182_url,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            site: $(mobile_card_givefeedback_send).closest("#mobile-library-section-focus").attr("data-asid"),
            rating: $(".fstar").length,
            subject: $(mobile_card_feedbacksubject).val(),
            message: $(mobile_card_feedbackcontent).val()
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
            $(mobile_card_givefeedback_send).addClass("l--a-f-f_disable");
            $(".fstar").removeClass("fstar");
            $(mobile_card_feedbacksubject).val("");
            $(mobile_card_feedbackcontent).val("");
            $(".mobile-card-rating_wrapper div").html("&#9734;");
            
            null_dashboard();
            
            let data_sid = $(mobile_card_givefeedback_send).closest("#mobile-library-section-focus").attr("data-sid");
            mobile_feedback_already_added.push(parseInt(data_sid));
            $(".mobile-library-site-feedback button").css("display","none");
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
          }
        });
      }
    }
  });
  
  $(mobile_addnewfolder_button).click(() => {
    is_addingfolder = true;
    if(is_editing) {
      $(mobile_library_deletefolder).hide();
      $(mobile_library_edit_fab__0).hide();
      $(mobile_library_edit_fab__1).hide();
    }
    $(mobile_addnewfolder_button).addClass("add_libfolder_disable");
    $(mobile_library_newfolder_dialog).show();
    $(mobile_library_edit_fab).hide();
    $(mobile_library_close_dialog).show();
  });
  
  $(mobile_library_newf__optbtn_cnl).click(() => {
    is_addingfolder = false;
    $(mobile_addnewfolder_button).removeClass("add_libfolder_disable");
    $(mobile_library_close_dialog).hide();
    $(mobile_library_newfolder_dialog).hide();
    $(mobile_library_edit_fab).show();
    if(is_editing) {
      $(mobile_library_deletefolder).show();
      $(mobile_library_edit_fab__0).show();
      $(mobile_library_edit_fab__1).show();
    }
    $(mobile_library_newf__optbtn_crt).addClass("l--a-f-f_disable");
    $(mobile_library_newf__optinp).val('');
  });
  
  $(mobile_library_newf__optinp).keyup(() => {
    if($(mobile_library_newf__optinp).val().length > 0 && $(mobile_library_newf__optinp).val().length <= 25) {
      $(mobile_library_newf__optbtn_crt).removeClass("l--a-f-f_disable");
    } else {
      $(mobile_library_newf__optbtn_crt).addClass("l--a-f-f_disable");
    }
  });
  
  $(mobile_library_newf__optbtn_crt).click(() => {
    if($(mobile_library_newf__optinp).val().length > 0 && $(mobile_library_newf__optinp).val().length <= 25) {
      if(st) {
        const m4_url = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/";
        const head = "/library/folder/";
        const lib = "/library/folder/";
        $.ajax({
          method: "POST",
          url: m4_url,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            name:$(mobile_library_newf__optinp).val()
          },
          success:function(json) {
            // add folder to mobile and desktop view
            
            let nele = $(".library-items--custom-folder_dummy").clone(true, true);
            let mnele = $(".mobile-explore-category-dummy").clone(true, true);
            $(nele).find("p").text(json.name);
            $(nele).find("a").attr("href", head+""+json.id);
            
            null_dashboard();
            
            $(mnele).attr("href", "http://"+window.location.hostname+":"+window.location.port+lib+json.id).attr("data-name", json.name.toUpperCase().replace(/ /g,'').replace(/_/g,'').replace(/&/g, '')).attr("title", "Browse "+json.name.toLowerCase());
            $(mnele).text(json.name);
            $($(mnele).removeClass("mobile-explore-category-dummy")).insertBefore( "#mobile-explore-category-buffer" );
            
            $(nele).toggleClassAfter("animated zoomIn faster", (setTimeout) => {
              $($(nele).removeClass("library-items--custom-folder_dummy")).appendTo("#library-items--folders");
              setTimeout(()=>{},250);
            });
            
            // add folder to move folder list
            let fnele = $(".exp-user-lib-folder__dummy").clone(true, true);
            $(fnele).text(json.name);
            $(fnele).attr("data-fid", json.id);
            $($(fnele).removeClass(".exp-user-lib-folder__dummy")).appendTo(".lmsf-lof ul");
            
            let fmnele = $(".m__exp-user-lib-folder__dummy").clone(true, true);
            $(fmnele).text(json.name);
            $(fmnele).attr("data-fid", json.id);
            $($(fmnele).removeClass("m__exp-user-lib-folder__dummy")).appendTo(".m__lmsf-lof ul");
            
          },
          error:function(request, status, error) {
            try {
              $.each(request.responseJSON, function(idx, data) {
                show_error_notification(data, "Oops!");
              }); 
            } catch(e) {
              show_error_notification(request.responseJSON, "Oops!");
            }
          },
          complete:function(data) {
            is_addingfolder = false;
            $(mobile_addnewfolder_button).removeClass("add_libfolder_disable");
            $(mobile_library_close_dialog).hide();
            $(mobile_library_newfolder_dialog).hide();
            $(mobile_library_edit_fab).show();
            if(is_editing) {
              $(mobile_library_deletefolder).show();
              $(mobile_library_edit_fab__0).show();
              $(mobile_library_edit_fab__1).show();
            }
            $(mobile_library_newf__optbtn_crt).addClass("l--a-f-f_disable");
            show_info_notification("Your new folder named "+$(mobile_library_newf__optinp).val()+" was created", "Folder created");
            $(mobile_library_newf__optinp).val('');
          }
        });
      }
    }
  });
  
  $(mobile_library_edit_fab__0).click(() => {
    // delete
    if(sites_selected > 0) {
      toggle_nav_visibility(true);
      $(mobile_library_deletefolder).hide();
      $(mobile_addnewfolder_button).addClass("add_libfolder_disable");
      // show deletion dialog
      $(mobile_library_editing_dialog__p_0).text(edit_remove__msg);
      $(mobile_library_editing_dialog__p_1).text("");
      $(mobile_library_editing_dialog).show();
      // hide main fab and show back button fab from explore page
      // the back button fab closes the editing dialog
      $(mobile_library_edit_fab).hide();
      $(mobile_library_edit_fab__0).hide();
      $(mobile_library_edit_fab__1).hide();
      $(mobile_library_close_dialog).show();
      $(mled__delete).show();
      $("#mobile-library_editing_dialog__wrapper").css({
        "top":$(window).innerHeight()/2 - $("#mobile-library_editing_dialog__wrapper").innerHeight()/2
      });
    }
  });
  
  $(mobile_library_edit_fab__1).click(() => {
    // move
    if(sites_selected > 0) {
      toggle_nav_visibility(true);
      $(".m__lmsf-slct").removeClass("m__lmsf-slct");
      $(mobile_library_deletefolder).hide();
      $(mobile_addnewfolder_button).addClass("add_libfolder_disable");
      $(mobile_library_editing_dialog__p_0).text(edit_move__msg);
      $(mobile_library_editing_dialog__p_1).text(edit_move__submsg);
      $(mobile_library_editing_dialog).show();
      // hide main fab and show back button fab from explore page
      // the back button fab closes the editing dialog
      $(mobile_library_edit_fab).hide();
      $(mobile_library_edit_fab__0).hide();
      $(mobile_library_edit_fab__1).hide();
      $(mobile_library_close_dialog).show();
      $(mled__move).show();
      $("#mobile-library_editing_dialog__wrapper").css({
        "top":$(window).innerHeight()/2 - $("#mobile-library_editing_dialog__wrapper").innerHeight()/2
      });
    }
  });
  
  $(mobile_library_close_dialog).click(() => {
    // close dialog
    if($("#global-title-bar").css("display")==="none") {
      toggle_nav_visibility(false);
    }
    $(mobile_addnewfolder_button).removeClass("add_libfolder_disable");
    $(mobile_library_deletefolder_dialog).hide();
    if(is_addingfolder) {
      is_addingfolder = false;
      $(mobile_library_close_dialog).hide();
      $(mobile_library_newfolder_dialog).hide();
      $(mobile_library_edit_fab).show();
      $(mobile_library_newf__optbtn_crt).addClass("l--a-f-f_disable");
      $(mobile_library_newf__optinp).val('');
    } else {
      $(mobile_library_close_dialog).hide();
      $(mobile_library_editing_dialog).hide();
      $(mobile_library_edit_fab).show();
      $(mled__move).hide();
      $(mled__delete).hide();
    }
    if(is_editing) {
      $(mobile_library_deletefolder).show();
      $(mobile_library_edit_fab__0).show();
      $(mobile_library_edit_fab__1).show();
    }
  });
  
  $(mobile_library_del__optbtn_cnl).click(() => {
    toggle_nav_visibility(false);
    $(mobile_addnewfolder_button).removeClass("add_libfolder_disable");
    $(mobile_library_close_dialog).hide();
    $(mobile_library_editing_dialog).hide();
    if(is_editing) {
      $(mobile_library_deletefolder).show();
      $(mobile_library_edit_fab__0).show();
      $(mobile_library_edit_fab__1).show();
    }
    $(mobile_library_edit_fab).show();
    $(mled__move).hide();
    $(mled__delete).hide();
  });
  
  $(mobile_library_mov__optbtn_cnl).click(() => {
    toggle_nav_visibility(false);
    $(mobile_addnewfolder_button).removeClass("add_libfolder_disable");
    $(mobile_library_close_dialog).hide();
    $(mobile_library_editing_dialog).hide();
    if(is_editing) {
      $(mobile_library_deletefolder).show();
      $(mobile_library_edit_fab__0).show();
      $(mobile_library_edit_fab__1).show();
    }
    $(mobile_library_edit_fab).show();
    $(mled__move).hide();
    $(mled__delete).hide();
    mobile_folder = null;
    $(mobile_library_mov__optbtn_crt).addClass("l--a-f-f_disable");
    $(".m__lmsf-slct").removeClass("m__lmsf-slct");
  });
  
  $(mobile_library_del__optbtn_crt).click(() => {
    if($(".mobile_library_selected").length) {
      if(st) {
        let real_length = $(".mobile_library_selected").length;
        for(let i=0;i<$(".mobile_library_selected").length;++i) {
          let prnt = $(".mobile_library_selected").eq(i);
          let prnt_desktop = $("#library-items--sites").find("[data-sid="+$(prnt).attr("data-sid")+"]");
          let fid = $(".mobile_library_selected").eq(i).attr("data-apiid");
          fid = fid.split('/');
          for(let i=fid.length;i>=0;i--) {
            if (fid[i] !== "" && !isNaN(fid[i])) {
              fid = fid[i];
              break;
            }
          }
          if(!isNaN(fid)) {
            const m7236_url = "http://"+window.location.hostname+":"+window.location.port+"/api/saved-sites/"+fid+"/";
            $.ajax({
              method: "DELETE",
              url: m7236_url,
              headers: {
                "Authorization" : "Token "+""+st
              },
              data: {
                nocache: cdt()
              },
              success:function(json) {
                // remove the site
                // show notification
                $(prnt).remove();
                $(prnt_desktop).remove();
                $(mobile_addnewfolder_button).removeClass("add_libfolder_disable");
                $(mobile_library_close_dialog).hide(); 
                $(mobile_library_editing_dialog).hide();
                $(mobile_library_edit_fab__0).hide();
                $(mobile_library_edit_fab__1).hide();
                $(mobile_library_edit_fab).show();
                $(".mobile_library_selected").removeClass("mobile_library_selected");
                $(mobile_library_edit_fab__0).addClass("l--a-f-f_disable");
                $(mobile_library_edit_fab__1).addClass("l--a-f-f_disable");
                sites_selected = 0;
                $(mobile_library_edit_fab__svg_1).hide();
                $(mobile_library_edit_fab__svg_0).show();
                $(mled__move).hide();
                $(mled__delete).hide();
                null_dashboard();
                toggle_nav_visibility(false);
              },
              error:function(request, status, error) {
                try {
                  $.each(request.responseJSON, function(idx, data) {
                    show_error_notification(data, "Oops!");
                  }); 
                } catch(e) {
                  show_error_notification(request.responseJSON, "Oops!");
                }
                toggle_nav_visibility(false);
              },
              complete:function(data) {
                is_editing = false;
                show_removedsiteslibrary_notification(real_length > 1 ? "Removed "+real_length+" sites from your library" : "Removed site from your library", "Site removed");
              }
            });
          }
        }
      }
    }
  });
  
  $(".mobile-library-section").click((e) => {
    setTimeout(() => {
      if(mobile_feedback_already_added.includes(parseInt($(e.target).attr("data-sid")))) {
        $(".mobile-library-site-feedback button").css("display","none");
      }
    },0);
    //return true;
  });
  
  
});
