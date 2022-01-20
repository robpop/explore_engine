"use strict";
$(function() {
  let explore_main_feed = document.getElementById("explore-main-feed");
  let explore_side_bar = document.getElementById("explore-side-bar");
  let explore_user_library_options = document.getElementsByClassName("explore-user-library-options");
  let explore_user_feedback_options = document.getElementsByClassName("explore-user-feedback-options");
  let explore_user_library_folders = document.getElementsByClassName("explore-user-library-folders");
  let explore_user_library_folders_series = document.getElementsByClassName("explore-user-library-folders-series");
  let explore_user_feedback_series = document.getElementsByClassName("explore-user-feedback-series");
  let explore_user_library_save_success = document.getElementsByClassName("explore-user-library-save-success");
  let library_site_feedback_btn = document.getElementById("library-site-feedback-btn");
  let explore_discover_more_refresh = document.getElementById("explore-discover-more_refresh");
  
  const intial_card_width = $(".library-section").width();
  
  let cflg=true;
  let scope=null;
  let fscope=null;
  let prev_svd=false;
  let pointer_fail_safe=null;
  
  let eufsr__rating_flg = false;
  let eufsr__subject_flg = false;
  let eufsr__prose_flg = false;
  let eufsr__subject = document.getElementById("eufsr-subject");
  let eufsr__prose = document.getElementById("eufsr-prose");
  let eufsr_submit = document.getElementById("eufsr-submit");
  let eufsr_cancel = document.getElementById("eufsr-cancel");
    
  let sites_per_row__n_t;
  let sites_per_row__w;
  let sites_per_row__w_c;
  let sites_per_row;
  let calc_sites = setInterval(() => {
    sites_per_row__n_t = $('.library-section').length;
    sites_per_row__w = $('.library-section').outerWidth(true);
    sites_per_row__w_c = $(explore_main_feed).width();
    sites_per_row = Math.min(parseInt(sites_per_row__w_c / sites_per_row__w),sites_per_row__n_t);
    if (sites_per_row !== 1) window.clearInterval(calc_sites);
  },300);
  
  let save_to_fid=-1;
  let save_with_name;
  
  let last_clicked_site = -1; // if the last clicked site is not the current site, then clear the feedback form (has data in it and not submitted for that site) 
  
  let initial_url_show = null;
  
  let mobile_sites_already_added = [];
  
  const apit = "apitoken";
  
  let st = Cookies.get(apit);
  
  const save_site_param0 = "http://"+window.location.hostname+":"+window.location.port+"/api/sites/";
  const save_site_param1 = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/";
  
  const m1_url = "http://"+window.location.hostname+":"+window.location.port+"/api/metric-request/view/";
  const m2_url = "http://"+window.location.hostname+":"+window.location.port+"/api/metric-request/click/";
  const m5_url = "http://"+window.location.hostname+":"+window.location.port+"/api/saved-sites/";
  const m8_url = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/";
  let vsid = []; // keep track of sites that have been viewed (prevent duplicate view metric requests)
  let csid = []; // keep track of sites that have been opened (prevent duplicate open metric requests)
    
  if($("#open-source-attribution-footer")) {$("#open-source-attribution-footer").css("display","none");}
  $(explore_side_bar).css("height",$(window).height()-70);

  $(document).on("click", "#library-site-feedback-btn", (e) => {
    e.target = $(e.target).closest("#library-site-feedback-btn");
    $(explore_user_feedback_series).find("#explore-inst-feedback-name").text($(e.target).parent().parent().parent().find(".explore-atlib").find(".library-folder-name").text());
    cflg=false;
    let _this = e.target;
    $(_this).closest(".library-section").addClass("exp-addtolib-focus");
    $(explore_user_feedback_series).addClass("fadeIn fasterer");
    $(_this).closest(".library-section").find(".explore-atlib").addClass("fadeOutDown fasterer");
    window.requestTimeout(function(){
      $(_this).closest(".library-section").find(".explore-atlib").css("display","none");
      window.requestTimeout(function(){
        $(explore_user_feedback_series).appendTo($(_this).closest(".library-section"));
        $(explore_user_feedback_series).css("display","block");
        $(_this).closest(".library-section").find(".explore-atlib").removeClass("fadeOutDown fasterer");
        window.requestTimeout(function(){
          cflg=true;
        },150);
      },200);
    },250);
  });

  $(eufsr_cancel).click(function(){
    // cancel
    cflg=false;
    // eufsr_cancel
    let _this = this;
    $(eufsr__subject).val("");
    $(eufsr__prose).val("");
    $(".fstar").removeClass("fstar");
    $("#eufsr-wrap div").html("&#9734;");
    $(eufsr_submit).addClass("l--a-f-f_disable");
    eufsr__rating_flg = false;
    eufsr__subject_flg = false;
    eufsr__prose_flg = false;
    $(_this).closest(".library-section").removeClass("exp-addtolib-focus");
    $(explore_user_feedback_series).addClass("fadeOut fasterer");
    $(_this).closest(".library-section").find(".explore-atlib").addClass("fadeInUp faster");
    window.requestTimeout(function(){
      $(explore_user_feedback_series).css("display","none");
      window.requestTimeout(function(){
        $(_this).closest(".library-section").find(".explore-expanded-info").css("display","flex");
        $(_this).closest(".library-section").find("#explore-primary-container").css("display","block");
        $(explore_user_feedback_series).removeClass("fadeOut fasterer");
        window.requestTimeout(function(){
          cflg=true;
        },150);
      },200);
    },250);
  });
  
  $(document).on("mouseenter", ".explore-site--open", (e) => {
    e.target = $(e.target).closest(".explore-site--open");
    // show link information
    clearTimeout(initial_url_show);
    let link = $(e.target).parents(".library-section").find(".explore-security-show-link");
    $(link).find("p").text($(e.target).attr("href"));
    $(link).find("svg").show();
    if($(e.target).attr("href").includes("https")) {
      $(link).css("color", "#718EC4");
    } else {
      $(link).css("color", "");
    }
  }).on("mouseleave", ".explore-site--open", (e) => {
    e.target = $(e.target).closest(".explore-site--open");
    clearTimeout(initial_url_show);
    let link = $(e.target).parents(".library-section").find(".explore-security-show-link");
    $(link).find("svg").hide();
    $(link).css("color", "");
    $(link).find("p").text($(link).attr("data-audited"));
  });
  
  $("#eufsr-wrap div").click((e) => {
    eufsr__rating_flg = true;
  });
  
  $(eufsr__subject).keyup(() => {
    if($(eufsr__subject).val().length >= 4 && $(eufsr__subject).val().length <= 50) {
      eufsr__subject_flg = true;
    } else {
      eufsr__subject_flg = false;
    }
  });
  
  $(eufsr__prose).keyup(() => {
    if($(eufsr__prose).val().length >= 8 && $(eufsr__prose).val().length <= 250) {
      eufsr__prose_flg = true;
    } else {
      eufsr__prose_flg = false;
    }
  });
  
  $("#eufsr-submit").click((e) => {
    e.target = $(e.target).closest("#eufsr-submit");
    if(eufsr__rating_flg && eufsr__subject_flg && eufsr__prose_flg) {
      cflg=false;
      $(e.target).closest(".library-section").removeClass("exp-addtolib-focus");
      $(explore_user_feedback_series).addClass("fadeOut fasterer");
      $(e.target).closest(".library-section").find(".explore-atlib").addClass("fadeInUp faster");
      window.requestTimeout(function(){
        $(explore_user_feedback_series).css("display","none");
        window.requestTimeout(function(){
          $(e.target).closest(".library-section").find(".explore-expanded-info").css("display","flex");
          $(e.target).closest(".library-section").find("#explore-primary-container").css("display","block");
          $(explore_user_feedback_series).removeClass("fadeOut fasterer");
          window.requestTimeout(function(){
            cflg=true;
          },150);
        },200);
      },250);
    }
  });
  
  $(document).on("mouseenter", ".explore-listing-section", (e) => {
    e.target = $(e.target).closest(".explore-listing-section");
    if($(e.target).hasClass("exp_crd")) {
      $(e.target).css({
        "cursor":"default"
      });
    } else {
      $(e.target).css({
        "cursor":"pointer"
      });
    }
  });
  $(document).on("mouseleave", ".explore-listing-section", (e) => {
    e.target = $(e.target).closest(".explore-listing-section");
    $(e.target).css({
      "cursor":"pointer"
    });
  });
  
  // for keeping track of clicks on mobile
  $(document).on("click", ".explore-site--open__mobile", (e) => {
    let parent = $(e.target).closest("#mobile-library-section-focus");
    if(csid && csid.indexOf($(parent).attr("data-sid"))===-1) {
      $.ajax({
        method: "POST",
        url: m2_url,
        data: {
          site_id:$(parent).attr("data-sid")
        },
        success:function(json) {
          csid.push($(parent).attr("data-sid"));
        },
        error:function(request, status, error) {}
      });
    }
  });
  
  $(document).on("click", ".explore-site--open", (e) => {
    let parent = $(e.target).closest(".library-section");
    if(csid && csid.indexOf($(parent).attr("data-sid"))===-1) {
      $.ajax({
        method: "POST",
        url: m2_url,
        data: {
          site_id:$(parent).attr("data-sid")
        },
        success:function(json) {
          csid.push($(parent).attr("data-sid"));
        },
        error:function(request, status, error) {}
      });
    }
    console.log("open site");
    e.stopPropagation();
  });

  $(".exp_crd_clk").click((e) => {
    // odd exceptions
    if($(e.target).hasClass("exp-user-lib-folder__inst")) return true;
    if($(e.target).hasClass("explore-save--sitetolib")) return true;
    e.stopPropagation();
  });
  
  // for keeping track of views on mobile
  $(document).on("click", ".mobile-library-section", (e) => {
    e.target = $(e.target).closest(".mobile-library-section");
    if(vsid && vsid.indexOf($(e.target).attr("data-sid"))===-1) {
      let siteid = $(e.target).attr("data-sid");
      $.ajax({
        method: "POST",
        url: m1_url,
        data: {
          site_id:siteid
        },
        success:function(json) {
          vsid.push($(e.target).attr("data-sid"));
        },
        error:function(request, status, error) {}
      });
    }
  });

  let last_start, last_end, last_clicked;
  $(document).on("click", ".explore-listing-section", (e) => {
    if($(e.target).hasClass("exp-user-lib-folder__inst")) return false; // odd exceptions
    if($(e.target).hasClass("explore-save--sitetolib")) return false; // odd exceptions
    console.log(e.target);
    e.target = $(e.target).closest(".explore-listing-section");
    scope=e.target;
    if(last_clicked_site !== $(e.target).attr("data-sid")) {
      console.log("clear feedback form");
      $(eufsr__subject).val("");
      $(eufsr__prose).val("");
      $(".fstar").removeClass("fstar");
      $("#eufsr-wrap div").html("&#9734;");
      $(eufsr_submit).addClass("l--a-f-f_disable");
      eufsr__rating_flg = false;
      eufsr__subject_flg = false;
      eufsr__prose_flg = false;      
    }
    last_clicked_site = $(e.target).attr("data-sid");
    if(cflg) {
      if(!$(e.target).hasClass("exp_crd_focus")) {
        if($(".exp_crd_focus").length>0) {
          let ele = $(".exp_crd_focus");
          $(".exp_crd_focus").removeClass("exp_crd_focus");
          
          if(last_start && last_end && last_clicked) {
            for(let i=last_start; i<last_end; i++) {
              if(i != last_clicked) {
                $(explore_main_feed).find("[data-lsid='"+i+"']").css("width", "200px");
                $(explore_main_feed).find("[data-lsid='"+i+"']").css({
                  "margin-left":"",
                  "margin-right":""
                });
                $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").css("width", "");
                $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").removeClass("explore-primary-container-flex");
                $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder").removeClass("library-folder__shrink");
                $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder").removeClass("library-folder__margin");
                $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder-name").removeClass("library-folder__shrink");
              }
            }
          }
          
          ele.removeClass("exp_crd");
          ele.css({
            "width":"200px",
            "cursor":"pointer"
          });
          $(e.target).find("#explore-primary-container").css("width","");
          ele.children().eq(1).hide();
          if(ele.hasClass("exp-addtolib-focus")) {
            ele.removeClass("exp-addtolib-focus");
            $(explore_user_library_folders_series).css("display","none");
            $(explore_user_feedback_series).css("display","none");
            ele.closest(".library-section").find(".explore-atlib").addClass("fadeInUp faster");
            window.requestTimeout(function(){
              $(ele).closest(".library-section").find(".explore-expanded-info").css("display","flex");
              $(ele).closest(".library-section").find("#explore-primary-container").css("display","block");
              ele.children().eq(1).hide();
            },150);
            $(".savetofolder").removeClass("savetofolder");
            $(explore_user_library_options).children().eq(0).addClass("explore-user-library-option_save_disabled");
            $(explore_user_library_options).children().eq(0).removeClass("ripple");
          }
        }
        $(e.target).addClass("exp_crd_focus");
      } else {
        $(e.target).removeClass("exp_crd_focus");
      }

      if(!$(e.target).hasClass("exp_crd")) {
        const magik_number = 16;
        // where 410 is the width of the expanded site card + site card padding
        let row_qty = ($("#explore-main-feed").innerWidth() - (410 + (10 * sites_per_row))) / sites_per_row;
        let clicked_site = $(e.target).attr("data-lsid");
        let clicked_row = Math.ceil(clicked_site / sites_per_row);// the Math.ceil(index of the clicked site / sites_per_row)
        // if this is greater than 70, apply margins to outer two site cards
        let pad_with_margin = (($("#explore-main-feed").innerWidth() / sites_per_row) % 210) >= 55;
        let pad_with_margin_value = (($("#explore-main-feed").innerWidth() / sites_per_row) % 210);
        // check if last card in row - then hide 1st
        last_start = ((clicked_row-1)*sites_per_row+1);
        last_end = ((clicked_row-1)*sites_per_row+1)+sites_per_row;
        last_clicked = clicked_site;
        for(let i=((clicked_row-1)*sites_per_row+1); i<((clicked_row-1)*sites_per_row+1)+sites_per_row; i++) {
          if(i != clicked_site) {
            if(i==(((clicked_row-1)*sites_per_row+1)+sites_per_row)-1 && pad_with_margin) {
              $(explore_main_feed).find("[data-lsid='"+i+"']").css("margin-right", pad_with_margin_value/2);
            } else if(i==((clicked_row-1)*sites_per_row+1) && pad_with_margin) {
              $(explore_main_feed).find("[data-lsid='"+i+"']").css("margin-left", pad_with_margin_value/2);
            }
            $(explore_main_feed).find("[data-lsid='"+i+"']").css("width", row_qty);
            $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").css("width", "calc(100% - "+magik_number+"px)");
            $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").addClass("explore-primary-container-flex");
            // library-folder__shrink
            $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder").addClass("library-folder__shrink");
            $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder").addClass("library-folder__margin");
            $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder-name").addClass("library-folder__shrink");
          } else {
            $(explore_main_feed).find("[data-lsid='"+i+"']").find(".explore-expanded-info").css({
              "display":"flex"
            });
          }
        }
        
        let link = $(e.target).find(".explore-security-show-link");
        $(link).find("p").text($(e.target).find(".explore-site--open").attr("href"));
        $(link).find("svg").show();
        if($(e.target).find(".explore-site--open").attr("href").includes("https")) {
          $(link).css("color", "#718EC4");
        } else {
          $(link).css("color", "");
        }
        initial_url_show = setTimeout(() => {
          $(link).find("svg").hide();
          $(link).css("color", "");
          $(link).find("p").text($(link).attr("data-audited"));
        }, 2000);
        
        $(e.target).addClass("exp_crd");
        $(e.target).css({
          "width":"400px",
          "cursor":"default"
        });
        $(e.target).find(".explore-expanded-info").css("display","flex");
        // view metric
        if(vsid && vsid.indexOf($(e.target).attr("data-sid"))===-1) {
          let siteid = $(e.target).attr("data-sid");
          $.ajax({
            method: "POST",
            url: m1_url,
            data: {
              site_id:siteid
            },
            success:function(json) {
              vsid.push($(e.target).attr("data-sid"));
            },
            error:function(request, status, error) {}
          });
        }
      } else {
        let ele = $(e.target);
        
        if(last_start && last_end && last_clicked) {
          for(let i=last_start; i<last_end; i++) {
            if(i != last_clicked) {
              $(explore_main_feed).find("[data-lsid='"+i+"']").css("width", "200px");
              $(explore_main_feed).find("[data-lsid='"+i+"']").css({
                "margin-left":"",
                "margin-right":""
              });
              $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").css("width", "");
              $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").removeClass("explore-primary-container-flex");
              $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder").removeClass("library-folder__shrink");
              $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder").removeClass("library-folder__margin");
              $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder-name").removeClass("library-folder__shrink");
            }
          }
        }
        
        
        $(e.target).removeClass("exp_crd");
        $(e.target).css({
          "width":"200px",
          "cursor":"pointer"
        });
        $(e.target).find("#explore-primary-container").css("width","");
        $(e.target).find(".explore-expanded-info").hide();
        if($(e.target).hasClass("exp-addtolib-focus")) {
          ele.removeClass("exp-addtolib-focus");
          $(explore_user_library_folders_series).css("display","none");
          $(explore_user_feedback_series).css("display","none");
          ele.closest(".library-section").find(".explore-atlib").addClass("fadeInUp faster");
          window.requestTimeout(function(){
            ele.closest(".library-section").find(".explore-expanded-info").css("display","flex");
            ele.closest(".library-section").find("#explore-primary-container").css("display","block");
            ele.children().eq(1).hide();
          },150);
          $(".savetofolder").removeClass("savetofolder");
          $(explore_user_library_options).children().eq(0).addClass("explore-user-library-option_save_disabled");
          $(explore_user_library_options).children().eq(0).removeClass("ripple");
        }
      }
    }
  });
  

  $(document).on("click", ".exp-user-lib-folder__inst", (e) => {
    e.target = $(e.target).closest(".exp-user-lib-folder__inst");
    $(".savetofolder").removeClass("savetofolder");
    $(e.target).addClass("savetofolder");
    fscope=e.target;
    $(explore_user_library_options).children().eq(0).removeClass("explore-user-library-option_save_disabled");
    $(explore_user_library_options).children().eq(0).addClass("ripple");
    save_to_fid=$(e.target).attr("data-fid");
    save_with_name=$(e.target).text();
  });

  $(document).on("click", ".explore-add--library", (e) => {
    e.target = $(e.target).closest(".explore-add--library");
    if(prev_svd) {
      $(explore_user_library_folders).css("display","block");
      $(explore_user_library_options).css("display","flex");
      $(".explore-user-library-folders-series h2").css("display","block");
      $(".addtolib-progress-loader").css("visibility","hidden");
      prev_svd=false;
    }
    cflg=false;
    let _this = e.target;
    $(_this).closest(".library-section").addClass("exp-addtolib-focus");
    $(explore_user_library_folders_series).addClass("fadeIn fasterer");
    $(_this).closest(".library-section").find(".explore-atlib").addClass("fadeOutDown fasterer");
    window.requestTimeout(function(){
      $(_this).closest(".library-section").find(".explore-atlib").css("display","none");
      window.requestTimeout(function(){
        $(explore_user_library_folders_series).appendTo($(_this).closest(".library-section"));
        $(explore_user_library_folders_series).css("display","block");
        $(_this).closest(".library-section").find(".explore-atlib").removeClass("fadeOutDown fasterer");
        window.requestTimeout(function(){
          cflg=true;
        },150);
      },200);
    },250);
  });
  $(document).on("click", ".explore-save--sitetolib", (e) => {
    e.target = $(e.target).closest(".explore-save--sitetolib");
    try {window.clearTimeout(pointer_fail_safe);}
    catch(err){}
    $(explore_main_feed).css("pointer-events","none");
    $(".library-section").css("pointer-events", "none");
    pointer_fail_safe = setTimeout(() => {
      if($(explore_main_feed).css("pointer-events")=="none") {
        $(explore_main_feed).css("pointer-events","");
      }
      if($(".library-section").css("pointer-events")=="none") {
        $(".library-section").css("pointer-events", "");
      }
      $(explore_user_library_folders).removeClass("fadeOut fasterer");
    },1000);
    // save
    let parent = $(e.target).parent().parent().parent();
    let _this = this;
    if($(".savetofolder")[0]) {
      if(scope!==null && fscope!==null) {


        $(explore_user_library_folders).addClass("fadeOut fasterer");
        $(explore_user_library_options).addClass("fadeOut fasterer");
        $(".explore-user-library-folders-series h2").addClass("fadeOut fasterer");
        //$(explore_user_library_folders).toggleClassAfter("fadeOut fasterer", (setTimeout) => {
        setTimeout(function(){
          $(explore_user_library_folders).css("display","none");
          $(explore_user_library_options).css("display","none");
          $(".explore-user-library-folders-series h2").css("display","none");
          $(".addtolib-progress-loader").css("visibility","visible");
          //$(explore_user_library_folders).removeClass("fadeOut fasterer");
          $(explore_user_library_options).removeClass("fadeOut fasterer");
          $(".explore-user-library-folders-series h2").removeClass("fadeOut fasterer");
          
          if(st) {
            if(save_to_fid) {
              $.ajax({
                  method: "POST",
                  url: m5_url,
                  headers: {
                    "Authorization" : "Token "+""+st
                  },
                  data: {
                    site: save_site_param0+""+$(parent).attr("data-sid")+"/",
                    folder: save_site_param1+""+save_to_fid+"/"
                  },
                  error:function(request, status, error) {
                    try {
                      $.each(request.responseJSON, function(idx, data) {
                        show_error_notification(data, "Oops!");
                      }); 
                    } catch(e) {
                      show_error_notification(request.responseJSON, "Oops!");
                    }
                    $(explore_main_feed).css("pointer-events","");
                    $(".library-section").css("pointer-events", "");
                    $(explore_user_library_folders).removeClass("fadeOut fasterer");
                  },
                  complete:function(data) {
                    $(".addtolib-progress-loader").css("visibility","hidden");
                    $(parent).find(".explore-add--library").remove();

                    // add a notice saying site is saved already
                    $(parent).removeClass("exp-addtolib-focus");
                    $(explore_user_library_folders_series).addClass("fadeOut fasterer");
                    $(parent).find(".explore-atlib").addClass("fadeInUp faster");
                    window.requestTimeout(function(){
                      $(explore_user_library_folders_series).css("display","none");
                      window.requestTimeout(function(){
                        $(parent).find(".explore-expanded-info").css("display","flex");
                        $(parent).find("#explore-primary-container").css("display","block");
                        $(explore_user_library_folders_series).removeClass("fadeOut fasterer");
                        window.requestTimeout(function(){
                          cflg=true;
                          setTimeout(() => {
                            $(explore_main_feed).css("pointer-events","");
                            $(".library-section").css("pointer-events", "");
                            $(explore_user_library_folders).removeClass("fadeOut fasterer");
                          },300);
                        },150);
                      },200);
                    },250);
                    $(".savetofolder").removeClass("savetofolder");
                    show_info_notification("Saved "+$(parent).find(".library-folder-name").text()+" to "+save_with_name, "Site saved");
                    mobile_sites_already_added.push(parseInt($(parent).attr("data-sid")));
                  }
              });
            } else {
              $.ajax({
                  method: "POST",
                  url: m5_url,
                  headers: {
                    "Authorization" : "Token "+""+st
                  },
                  data: {
                    site: save_site_param0+""+$(parent).attr("data-sid")+"/",
                    folder: ""                  
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
                    $(".addtolib-progress-loader").css("visibility","hidden");
                    $(explore_main_feed).css("pointer-events","");
                    $(parent).find(".explore-add--library").remove();

                    // add a notice saying site is saved already
                    $(parent).removeClass("exp-addtolib-focus");
                    $(explore_user_library_folders_series).addClass("fadeOut fasterer");
                    $(parent).find(".explore-atlib").addClass("fadeInUp faster");
                    window.requestTimeout(function(){
                      $(explore_user_library_folders_series).css("display","none");
                      window.requestTimeout(function(){
                        $(parent).find(".explore-expanded-info").css("display","flex");
                        $(parent).find("#explore-primary-container").css("display","block");
                        $(explore_user_library_folders_series).removeClass("fadeOut fasterer");
                        window.requestTimeout(function(){
                          cflg=true;
                        },150);
                      },200);
                    },250);
                    $(".savetofolder").removeClass("savetofolder");
                    show_info_notification("Saved "+$(parent).find(".library-folder-name").text()+" to your library dashboard", "Site saved");
                    mobile_sites_already_added.push(parseInt($(parent).attr("data-sid")));
                  }
              });
            }
            
          }
          
          prev_svd=true;
        },350);
        
      }
    }
  });
  $(explore_user_library_options).children().eq(1).click(function(){
    // cancel
    cflg=false;
    let _this = this;
    $(_this).closest(".library-section").removeClass("exp-addtolib-focus");
    $(explore_user_library_folders_series).addClass("fadeOut fasterer");
    $(_this).closest(".library-section").find(".explore-atlib").addClass("fadeInUp faster");
    window.requestTimeout(function(){
      $(explore_user_library_folders_series).css("display","none");
      window.requestTimeout(function(){
        $(_this).closest(".library-section").find(".explore-expanded-info").css("display","flex");
        $(_this).closest(".library-section").find("#explore-primary-container").css("display","block");
        $(explore_user_library_folders_series).removeClass("fadeOut fasterer");
        window.requestTimeout(function(){
          cflg=true;
        },150);
      },200);
    },250);
    $(".savetofolder").removeClass("savetofolder");
    $(explore_user_library_options).children().eq(0).addClass("explore-user-library-option_save_disabled");
    $(explore_user_library_options).children().eq(0).removeClass("ripple");
  });

  //let ctiv="TAG";
  $("#header-bar-explore-refresh").css("display","inline");
  $("#refresh-sites").css("display", "inline");
  $("#header-bar-explore-cb").css("display","inline-block");
  //$(".header-bar-explore-cb1").text(ctiv);
  $("#header-bar-explore-shortcut").css("display", "none");
  
  $(document).on("click", ".mobile-library-section", (e) => {
    e.target = $(e.target).closest(".mobile-library-section");
    setTimeout(() => {
      if(mobile_sites_already_added.includes(parseInt($(e.target).attr("data-sid")))) {
        $(".explore-add--library__mobile").css("display","none");
      }
    },0);
    //return true;
  });
  
  
  $(window).resize(function(){
    $(explore_side_bar).css("height",$(window).height()-70);
    
    sites_per_row__n_t = $('.library-section').length;
    sites_per_row__w = $('.library-section').outerWidth(true);
    sites_per_row__w_c = $(explore_main_feed).width();
    sites_per_row = Math.min(parseInt(sites_per_row__w_c / sites_per_row__w),sites_per_row__n_t);
    
    $(".explore-listing-section").css({
      "margin-left":"",
      "margin-right":""
    });
        
  });
});


/* ==== PRODUCTION ==== */
