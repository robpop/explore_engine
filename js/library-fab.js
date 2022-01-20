"use strict";

let b=0;

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

function cdt() {
  let dt = new Date();
  return dt.getTime();
}

let ed__en=false;
function update_c(cntx) {
  let c=$(cntx).length-1;
  return c;
}

function dj293(t) {
  $(t).focus();
  $(t).text("");
}


function chkef(cntx) {
  if($("#i_ed__p").hasClass("_FHE_")) {
    $("#lib_edit_bar_0").css("display","none");
    $("#lib_edit_bar_1").css("display","inline");
    $("#lib_edit_bar_2").css("display","inline");
    $("#lib_edit_bar_3").css("display","inline");
    $("#lib_edit_bar_4").css({
      'display':'inline-flex',
      'justify-content':'center',
      'align-items':'center'
    });

    $(".lmsf-lof ul li").click(function(){
      $(".savetofolder").removeClass("savetofolder");
      $(this).addClass("savetofolder");
      $(".library-mov--optbtn_mvsites").removeClass("l--a-f-f_disable");
    });

    $(cntx).addClass("xihw");
    $(cntx).each(function(){
      if($(this).hasClass("exp_crd")) {
        let ele = $(this);
        $(this).removeClass("exp_crd");
        $(this).css({
          "width":"200px",
          "cursor":"pointer"
        });
        $(this.children[1]).hide();
      }
    });
    $(".library-edit-sel-indicator").css("display","flex");
  } else {
    if($("#lib_edit_bar_0").css("display")=="none") {
      $("#lib_edit_bar_1").css("display","none");
      $("#lib_edit_bar_2").css("display","none");
      $("#lib_edit_bar_3").css("display","none");
      $("#lib_edit_bar_4").css("display","none");
      $("#lib_edit_bar_0").css("display","inline");

      $("#lib_edit_bar_3").addClass("lesbtn_dih");
      $("#lib_edit_bar_2").addClass("lesbtn_dih");

      $(cntx).removeClass("xihw");
      $(".library-edit-sel-indicator").css("display","none");

      $(".__lib_edt").removeClass("__lib_edt");
      $(".library-edit-sel-indicator").addClass("lesi_in");
      window.requestTimeout(function(){
        $(".library-edit-sel-indicator svg").css("display","none");
        $(".library-edit-sel-indicator").removeClass("lesi_bg");
        $(".library-edit-sel-indicator").removeClass("lesi_in");
      },150);

      b=0;
      if($("#lib_edit_bar_4").hasClass("__fassc")) {
        $("#lib_edit_bar_4").removeClass("__fassc");
        $($("#lib_edit_bar_4").find("span")).addClass("lesi_in");
        window.requestTimeout(function(){
          $($("#lib_edit_bar_4").find("span")).removeClass("lesi_bg");
          $($("#lib_edit_bar_4").find("span")).removeClass("lesi_in");
        },150);
      }
    }
  }
}

let cflg=true;
$(function() {
  let explore_main_feed = document.getElementById("library-items--sites");
  let explore_listing_section = document.getElementsByClassName("explore-listing-section");
  let library_add__optbtn_crt = document.getElementsByClassName("library-add--optbtn_crt");
  let explore_user_feedback_series = document.getElementsByClassName("explore-user-feedback-series");
  let explore_user_feedback_options = document.getElementsByClassName("explore-user-feedback-options");
  let explore_user_library_folders_series = document.getElementsByClassName("explore-user-library-folders-series");
  let library_site_feedback_btn = document.getElementsByClassName("library-site-feedback-btn")
  const m4_url = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/";
  const apit = "apitoken";
  let st = Cookies.get(apit);
  
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
    
  // #mobile-explore-tags-bar
  
  $(library_site_feedback_btn).click((e) => {
    $(explore_user_feedback_series).find("#explore-inst-feedback-name").text($(e.target).parent().parent().parent().find(".explore-atlib").find(".library-folder-name").text());
    cflg=false;
    $(e.target).closest(".library-section").addClass("exp-addtolib-focus");
    $(explore_user_feedback_series).addClass("fadeIn fasterer");
    $(e.target).closest(".library-section").find(".explore-atlib").addClass("fadeOutDown fasterer");
    window.requestTimeout(function(){
      $(e.target).closest(".library-section").find(".explore-atlib").css("display","none");
      window.requestTimeout(function(){
        $(explore_user_feedback_series).appendTo($(e.target).closest(".library-section"));
        $(explore_user_feedback_series).css("display","block");
        $(e.target).closest(".library-section").find(".explore-atlib").removeClass("fadeOutDown fasterer");
        window.requestTimeout(function(){
          cflg=true;
        },150);
      },200);
    },250);
  });
  
  $(eufsr_cancel).click(function(){
    // cancel
    cflg=false;
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
  
  $(eufsr_submit).click(() => {
    if(eufsr__rating_flg && eufsr__subject_flg && eufsr__prose_flg) {
      cflg=false;
      let _this = $(explore_user_feedback_options).children().eq(1);
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
    }
  });
  
  $("#eufsr-wrap div").click((e) => {
    eufsr__rating_flg = true;
  });
  
  $(eufsr__prose).keyup(() => {
    if($(eufsr__prose).val().length >= 8 && $(eufsr__prose).val().length <= 250) {
      eufsr__prose_flg = true;
    } else {
      eufsr__prose_flg = false;
    }
  });
  
  $(eufsr__subject).keyup(() => {
    if($(eufsr__subject).val().length >= 4 && $(eufsr__subject).val().length <= 50) {
      eufsr__subject_flg = true;
    } else {
      eufsr__subject_flg = false;
    }
  });
  
  
  let c=$(explore_listing_section).length;
  let nele, fnele, mfnele;
  const head = "/library/folder/";
  let last_start, last_end, last_clicked;
  $(explore_listing_section).click(function(){
    let _this = this;
    if(cflg) {
      if(!$(this).hasClass("xihw")) {
        if(!$(this).hasClass("exp_crd_focus")) {
          if($(".exp_crd_focus").length>0) {
            let ele = $(".exp_crd_focus");
            $(".exp_crd_focus").removeClass("exp_crd_focus");
            
            if(last_start && last_end && last_clicked) {
              for(let i=last_start; i<last_end; i++) {
                if(i != last_clicked) {
                  $(explore_main_feed).find("[data-lsid='"+i+"']").css("width", "200px");
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
            $(this).find("#explore-primary-container").css("width","");
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
            }
          }
          $(this).addClass("exp_crd_focus");
        } else {
          $(this).removeClass("exp_crd_focus");
        }
        
        
        if(!$(this).hasClass("exp_crd")) {
          let _this = $(this).closest(".library-section");
          
          const this_growth = 200;
          const must_be_an_adult = 18;
          const magik_number = 16;
          const logo_div2 = $(".library-folder").width()/2;
          let row_qty = this_growth-((this_growth/sites_per_row)+must_be_an_adult);
          let clicked_site = $(this).attr("data-lsid");
          let clicked_row = Math.ceil(clicked_site / sites_per_row);// the Math.ceil(index of the clicked site / sites_per_row)
          // check if last card in row - then hide 1st
          //$(".library-section").css("width", row_qty);
          last_start = ((clicked_row-1)*sites_per_row+1);
          last_end = ((clicked_row-1)*sites_per_row+1)+sites_per_row;
          last_clicked = clicked_site;
          for(let i=((clicked_row-1)*sites_per_row+1); i<((clicked_row-1)*sites_per_row+1)+sites_per_row; i++) {
            if(i != clicked_site) {
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
          
          $(this).addClass("exp_crd");
          $(this).css({
            "width":"400px",
            "cursor":"default"
          });
          $(this).find(".explore-expanded-info").css("display","flex");
        } else {
          let ele = $(this);
          
          if(last_start && last_end && last_clicked) {
            for(let i=last_start; i<last_end; i++) {
              if(i != last_clicked) {
                $(explore_main_feed).find("[data-lsid='"+i+"']").css("width", "200px");
                $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").css("width", "");
                $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").removeClass("explore-primary-container-flex");
                $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder").removeClass("library-folder__shrink");
                $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder").removeClass("library-folder__margin");
                $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder-name").removeClass("library-folder__shrink");
              }
            }
          }
          
          
          $(this).removeClass("exp_crd");
          $(this).css({
            "width":"200px",
            "cursor":"pointer"
          });
          $(this).find("#explore-primary-container").css("width","");
          $(this.children[1]).hide();
          if($(this).hasClass("exp-addtolib-focus")) {
            ele.removeClass("exp-addtolib-focus");
            $(explore_user_library_folders_series).css("display","none");
            $(explore_user_feedback_series).css("display","none");
            ele.closest(".library-section").find(".explore-atlib").addClass("fadeInUp faster");
            window.requestTimeout(function(){
              ele.closest(".library-section").find(".explore-expanded-info").css("display","flex");
              ele.closest(".library-section").find("#explore-primary-container").css("display","block");
              ele.children().eq(1).hide();
            },150);
          }
        }
      } else {
        // select sites for editing
        c=update_c(explore_listing_section);
        if(!$(this).hasClass("__lib_edt")) {
          b++;
          if(b>0) {
            // enable move and delete
            $("#lib_edit_bar_3").removeClass("lesbtn_dih");
            if($("#__library_folder").length) {
              if(($("#library-items--sites").children().length - 1) > 0) {
                $("#lib_edit_bar_2").removeClass("lesbtn_dih");
              } else {
                $("#lib_edit_bar_2").addClass("lesbtn_dih");
              }
            } else {
              if(($(".library-items--custom-folder").length - 1) > 1) {
                $("#lib_edit_bar_2").removeClass("lesbtn_dih");
              } else {
                $("#lib_edit_bar_2").addClass("lesbtn_dih");
              }
            }
          }
          if(b==c) {
            $("#lib_edit_bar_4").addClass("__fassc");
            $($("#lib_edit_bar_4").find("span")).addClass("lesi_in");
            window.requestTimeout(function(){
              $($("#lib_edit_bar_4").find("span")).addClass("lesi_bg");
              $($("#lib_edit_bar_4").find("span")).removeClass("lesi_in");
            },150);
          }
          let lesisvg=$(this).find(".library-edit-sel-indicator svg");
          let lesi=$(this).find(".library-edit-sel-indicator");
          $(lesisvg).css("display","block");
          $(this).addClass("__lib_edt");
          $(lesi).addClass("lesi_in");
          window.requestTimeout(function(){
            $(lesi).addClass("lesi_bg");
            $(lesi).removeClass("lesi_in");
          },150);
        } else {
          b--;
          if(b<0)b=0;
          console.log(b);
          if(b==0) {
            $("#lib_edit_bar_3").addClass("lesbtn_dih");
            $("#lib_edit_bar_2").addClass("lesbtn_dih");
          }
          if($("#lib_edit_bar_4").hasClass("__fassc")) {
            $("#lib_edit_bar_4").removeClass("__fassc");
            $($("#lib_edit_bar_4").find("span")).addClass("lesi_in");
            window.requestTimeout(function(){
              $($("#lib_edit_bar_4").find("span")).removeClass("lesi_bg");
              $($("#lib_edit_bar_4").find("span")).removeClass("lesi_in");
            },150);
          }
          let lesisvg=$(this).find(".library-edit-sel-indicator svg");
          let lesi=$(this).find(".library-edit-sel-indicator");
          $(this).removeClass("__lib_edt");
          $(lesi).addClass("lesi_in");
          window.requestTimeout(function(){
            $(lesisvg).css("display","none");
            $(lesi).removeClass("lesi_bg");
            $(lesi).removeClass("lesi_in");
          },150);
        }
      }
    }
  });

  
  $("#library-item--add_new_folder").click(function(e){
    e.stopPropagation();
    $("#library--add-folder-form").css("display","block");
    $("#library-items--folders").addClass("lifpen");
    $("#library-site-editor-bar").addClass("lifpen");
    $(explore_main_feed).addClass("lifpen");
  });

  $(".library-add--optbtn_cnl").click(function(){
    $("#library--add-folder-form").css("display","none");
    $("#library-items--folders").removeClass("lifpen");
    $("#library-site-editor-bar").removeClass("lifpen");
    $(explore_main_feed).removeClass("lifpen");
    $("#library--add-folder-form input[type='text']").val('');
    $(library_add__optbtn_crt).addClass("l--a-f-f_disable");
  });

  $(".library-mov--optbtn_cnl").click(function(){
    $("#library--move-site-form").css("display","none");
    $("#library-items--folders").removeClass("lifpen");
    $("#library-site-editor-bar").removeClass("lifpen");
    $(explore_main_feed).removeClass("lifpen");
    $(".savetofolder").removeClass("savetofolder");
    $(".library-mov--optbtn_mvsites").addClass("l--a-f-f_disable");
  });

  $("#lib_edit_bar_3").click(function(){
    if($("#lib_edit_bar_0").css("display")=="none" && b>0 && !$(this).hasClass("lesbtn_dih")) {
      // prompt for site deletions
      $("#library--delete-site-form").css("display","block");
      $("#library-items--folders").addClass("lifpen");
      $("#library-site-editor-bar").addClass("lifpen");
      $(explore_main_feed).addClass("lifpen");
    }
  });

  $("#lib_edit_bar_2").click(function(){
    if($("#lib_edit_bar_0").css("display")=="none" && b>0 && !$(this).hasClass("lesbtn_dih")) {
      $("#library--move-site-form").css("display","block");
      $("#library-items--folders").addClass("lifpen");
      $("#library-site-editor-bar").addClass("lifpen");
      $(explore_main_feed).addClass("lifpen");
    }
  });

  $(".library-del--optbtn_cnl").click(function(){
    $("#library--delete-site-form").css("display","none");
    $("#library-items--folders").removeClass("lifpen");
    $("#library-site-editor-bar").removeClass("lifpen");
    $(explore_main_feed).removeClass("lifpen");
  });

  $("#lib_edit_bar_0").click(function(){
    $(this).css("display","none");
    $("#lib_edit_bar_1").css("display","inline");
    $("#lib_edit_bar_2").css("display","inline");
    $("#lib_edit_bar_3").css("display","inline");
    $("#lib_edit_bar_4").css({
      'display':'inline-flex',
      'justify-content':'center',
      'align-items':'center'
    });

    $(".lmsf-lof ul li").click(function(){
      $(".savetofolder").removeClass("savetofolder");
      $(this).addClass("savetofolder");
      $(".library-mov--optbtn_mvsites").removeClass("l--a-f-f_disable");
    });

    $(explore_listing_section).addClass("xihw");
    $(explore_listing_section).each(function(){
      if($(this).hasClass("exp_crd")) {
        let ele = $(".exp_crd_focus");
        $(".exp_crd_focus").removeClass("exp_crd_focus");
        
        if(last_start && last_end && last_clicked) {
          for(let i=last_start; i<last_end; i++) {
            if(i != last_clicked) {
              $(explore_main_feed).find("[data-lsid='"+i+"']").css("width", "200px");
              $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").css("width", "");
              $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").removeClass("explore-primary-container-flex");
              $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder").removeClass("library-folder__shrink");
              $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder").removeClass("library-folder__margin");
              $(explore_main_feed).find("[data-lsid='"+i+"']").find("#explore-primary-container").find(".library-folder-name").removeClass("library-folder__shrink");
            }
          }
        }
        
        // hide feedback if displayed
        if(ele.hasClass("exp-addtolib-focus")) {
          // THIS CODE WIPES FEEDBACK AND HIDES
          $(eufsr__subject).val("");
          $(eufsr__prose).val("");
          $(".fstar").removeClass("fstar");
          $("#eufsr-wrap div").html("&#9734;");
          $(eufsr_submit).addClass("l--a-f-f_disable");
          eufsr__rating_flg = false;
          eufsr__subject_flg = false;
          eufsr__prose_flg = false;
          ele.removeClass("exp-addtolib-focus");
          $(explore_user_library_folders_series).css("display","none");
          $(explore_user_feedback_series).css("display","none");
          ele.closest(".library-section").find(".explore-atlib").addClass("fadeInUp faster");
          window.requestTimeout(function(){
            $(ele).closest(".library-section").find(".explore-expanded-info").css("display","flex");
            $(ele).closest(".library-section").find("#explore-primary-container").css("display","block");
            ele.children().eq(1).hide();
          },150);
        }
        
        
        $(this).removeClass("exp_crd");
        $(this).css({
          "width":"200px",
          "cursor":"pointer"
        });
        ele.children().eq(1).hide();
      }
    });
    $(".library-edit-sel-indicator").css("display","flex");

    $("#i_ed__p").addClass("_FHE_");
  });

  $("#lib_edit_bar_1").click(function(){
    if($("#lib_edit_bar_0").css("display")=="none") {
      $("#lib_edit_bar_1").css("display","none");
      $("#lib_edit_bar_2").css("display","none");
      $("#lib_edit_bar_3").css("display","none");
      $("#lib_edit_bar_4").css("display","none");
      $("#lib_edit_bar_0").css("display","inline");

      $("#lib_edit_bar_3").addClass("lesbtn_dih");
      $("#lib_edit_bar_2").addClass("lesbtn_dih");

      $(explore_listing_section).removeClass("xihw");
      $(".library-edit-sel-indicator").css("display","none");

      $(".__lib_edt").removeClass("__lib_edt");
      $(".library-edit-sel-indicator").addClass("lesi_in");
      window.requestTimeout(function(){
        $(".library-edit-sel-indicator svg").css("display","none");
        $(".library-edit-sel-indicator").removeClass("lesi_bg");
        $(".library-edit-sel-indicator").removeClass("lesi_in");
      },150);

      b=0;
      if($("#lib_edit_bar_4").hasClass("__fassc")) {
        $("#lib_edit_bar_4").removeClass("__fassc");
        $($("#lib_edit_bar_4").find("span")).addClass("lesi_in");
        window.requestTimeout(function(){
          $($("#lib_edit_bar_4").find("span")).removeClass("lesi_bg");
          $($("#lib_edit_bar_4").find("span")).removeClass("lesi_in");
        },150);
      }
    }
    $("#i_ed__p").removeClass("_FHE_");
  });

  $("#library--add-folder-form input[type='text']").on('input', function(){
    if($(this).val().length>0 && $(this).val().length<=25) {
      $(library_add__optbtn_crt).removeClass("l--a-f-f_disable");
    } else {
      $(library_add__optbtn_crt).addClass("l--a-f-f_disable");
    }
  });
  
  $(library_add__optbtn_crt).click(() => {
    if(!$(this).hasClass("l--a-f-f_disable")) {
      $.ajax({
        method: "POST",
        url: m4_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          name:$("#library--add-folder-form input[type='text']").val()
        },
        success:function(json) {
          nele = $(".library-items--custom-folder_dummy").clone(true, true);
          
          $(nele).find("p").text(json.name);
          $(nele).find("a").attr("href", head+""+json.id);
          
          fnele = $(".exp-user-lib-folder__dummy").clone(true, true);
          $(fnele).text(json.name);
          $(fnele).attr("data-fid", json.id);
          mfnele = $(".m__exp-user-lib-folder__dummy").clone(true, true);
          $(mfnele).text(json.name);
          $(mfnele).attr("data-fid", json.id);
          $($(mfnele).removeClass("m__exp-user-lib-folder__dummy")).appendTo(".m__lmsf-lof ul");
          
          $(nele).toggleClassAfter("animated zoomIn faster", (setTimeout) => {
            $($(nele).removeClass("library-items--custom-folder_dummy")).appendTo("#library-items--folders");
            $($(fnele).removeClass("exp-user-lib-folder__dummy")).appendTo(".lmsf-lof ul");
            
            $("#library--add-folder-form").css("display","none");
            $("#library-items--folders").removeClass("lifpen");
            $("#library-site-editor-bar").removeClass("lifpen");
            $(explore_main_feed).removeClass("lifpen");
            
            setTimeout(()=>{},250);
          });
          
          show_info_notification("Your new folder named "+json.name+" was created", "Folder created");
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
          $("#library--add-folder-form input[type='text']").val('');
          $(library_add__optbtn_crt).addClass("l--a-f-f_disable");    
          if(($(".library-items--custom-folder").length-1) > 1) {
            $("#lib_edit_bar_2").removeClass("lesbtn_dih");
          }      
        }
      });
    }
  });


  $("#lib_edit_bar_4").click(function(){
    let x=$(this);
    let v=$(x).find("span");
    c=update_c(explore_listing_section);
    if($("#lib_edit_bar_0").css("display")=="none" && $(explore_listing_section).hasClass("xihw")) {
      if(!$(x).hasClass("__fassc")) {
        b=c;
        $("#lib_edit_bar_3").removeClass("lesbtn_dih");
        if((($(".library-items--custom-folder").length-1) > 1) || $("#library-folder_backbtn").length) {
          $("#lib_edit_bar_2").removeClass("lesbtn_dih");
        }
        $(x).addClass("__fassc");
        $(v).addClass("lesi_in");
        window.requestTimeout(function(){
          $(v).addClass("lesi_bg");
          $(v).removeClass("lesi_in");
        },150);

        $(".library-edit-sel-indicator svg").css("display","block");
        $(explore_listing_section).addClass("__lib_edt");
        $(".library-edit-sel-indicator").addClass("lesi_in");
        window.requestTimeout(function(){
          $(".library-edit-sel-indicator").addClass("lesi_bg");
          $(".library-edit-sel-indicator").removeClass("lesi_in");
        },150);
      } else {
        b=0;
        $("#lib_edit_bar_3").addClass("lesbtn_dih");
        $("#lib_edit_bar_2").addClass("lesbtn_dih");
        $(x).removeClass("__fassc");
        $(v).addClass("lesi_in");
        window.requestTimeout(function(){
          $(v).removeClass("lesi_bg");
          $(v).removeClass("lesi_in");
        },150);

        $(".__lib_edt").removeClass("__lib_edt");
        $(".library-edit-sel-indicator").addClass("lesi_in");
        window.requestTimeout(function(){
          $(".library-edit-sel-indicator svg").css("display","none");
          $(".library-edit-sel-indicator").removeClass("lesi_bg");
          $(".library-edit-sel-indicator").removeClass("lesi_in");
        },150);
      }
    }
    // fix for dummy site
    $(".library-section-dummy").removeClass("__lib_edt");
  });
  $(window).resize(function(){
    chkef(explore_listing_section);
    
    sites_per_row__n_t = $('.library-section').length;
    sites_per_row__w = $('.library-section').outerWidth(true);
    sites_per_row__w_c = $(explore_main_feed).width();
    sites_per_row = Math.min(parseInt(sites_per_row__w_c / sites_per_row__w),sites_per_row__n_t);
  });
  
  
  $(".library-del--optbtn_crt").click(() => {
    if($(".__lib_edt").length > 1) {
      if(st) {
        let real_length = $(".__lib_edt").length;
        for(let i=0;i<$(".__lib_edt").length;++i) {
          let prnt = $(".__lib_edt").eq(i);
          let prnt_mobile = $("#library-form-all-packets_mobile").find("[data-sid="+$(prnt).attr("data-sid")+"]");
          let fid = $(".__lib_edt").eq(i).attr("data-apiid");
          fid = fid.split('/');
          for(let i=fid.length;i>=0;i--) {
            if (fid[i] !== "" && !isNaN(fid[i])) {
              fid = fid[i];
              break;
            }
          }
          if(!isNaN(fid)) {
            const m7236_url = "http://"+window.location.hostname+":"+window.location.port+"/api/saved-sites/"+fid+"/";
            let real_text = $(parent).find(".library-folder-name").text();
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
                $(prnt_mobile).remove();
                null_dashboard();
                c=update_c(explore_listing_section);
                b--;
                $("#library--delete-site-form").css("display","none");
                $("#library-items--folders").removeClass("lifpen");
                $("#library-site-editor-bar").removeClass("lifpen");
                $(explore_main_feed).removeClass("lifpen");
                
                $("#lib_edit_bar_3").addClass("lesbtn_dih");
                $("#lib_edit_bar_2").addClass("lesbtn_dih");
                b=0;
                
                if($(".__lib_edt").length === 0) {
                  show_info_notification("Removed "+real_length+" sites from your library", "Sites removed");
                }
              },
              error:function(request, status, error) {
                console.log(error);
              }
            });
          }
        }
      }
    } else {
      if(st) {
        let parent = $(".__lib_edt");
        let fid = $(".__lib_edt").attr("data-apiid");
        let prnt_mobile = $("#library-form-all-packets_mobile").find("[data-sid="+$(parent).attr("data-sid")+"]");
        fid = fid.split('/');
        for(let i=fid.length;i>=0;i--) {
          if (fid[i] !== "" && !isNaN(fid[i])) {
            fid = fid[i];
            break;
          }
        }
        if(!isNaN(fid)) {
          const m7236_url = "http://"+window.location.hostname+":"+window.location.port+"/api/saved-sites/"+fid+"/";
          let real_text = $(parent).find(".library-folder-name").text();
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
              show_info_notification("Removed "+real_text+" from your library", "Site removed");
              $(parent).remove();
              $(prnt_mobile).remove();
              null_dashboard();
              c=update_c(explore_listing_section);
              b--;
              $("#library--delete-site-form").css("display","none");
              $("#library-items--folders").removeClass("lifpen");
              $("#library-site-editor-bar").removeClass("lifpen");
              $(explore_main_feed).removeClass("lifpen");
              
              $("#lib_edit_bar_3").addClass("lesbtn_dih");
              $("#lib_edit_bar_2").addClass("lesbtn_dih");
              b=0;
            },
            error:function(request, status, error) {
              console.log(error);
            }
          });
        }
      }
    }
  });
  
  
  $(".library-mov--optbtn_mvsites").click(() => {
    if($(".__lib_edt").length > 1) {
      // moving multiple sites
      /*
      
      1. get number of sites to move
      2. loop an ajax request
      3. say that X number of sites were moved
      
      */
        // check if folder is selected
      if(st) {
        if($(".savetofolder").length > 0) {
          let real_length = $(".__lib_edt").length;
          let real_text = $(".savetofolder").text();
          for(let i=0;i<$(".__lib_edt").length;++i) {
            let prnt = $(".__lib_edt").eq(i);
            let prnt_mobile = $("#library-form-all-packets_mobile").find("[data-sid="+$(prnt).attr("data-sid")+"]");
            let fid = $(".__lib_edt").eq(i).attr("data-apiid");
            fid = fid.split('/');
            for(let i=fid.length;i>=0;i--) {
              if (fid[i] !== "" && !isNaN(fid[i])) {
                fid = fid[i];
                break;
              }
            }
            let m39_url = "http://"+window.location.hostname+":"+window.location.port+"/api/saved-sites/"+fid+"/";
            if(!isNaN(fid)) {
              let data_payload = m4_url+""+$(".savetofolder").attr("data-fid")+"/";
              if($(".savetofolder").attr("data-fid")) {
                data_payload = m4_url+""+$(".savetofolder").attr("data-fid")+"/";
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
                  $(prnt_mobile).remove();
                  
                  $("#library--move-site-form").css("display","none");
                  $("#library-items--folders").removeClass("lifpen");
                  $("#library-site-editor-bar").removeClass("lifpen");
                  $(explore_main_feed).removeClass("lifpen");
                  $(".savetofolder").removeClass("savetofolder");
                  $(".library-mov--optbtn_mvsites").addClass("l--a-f-f_disable");
                  
                  null_dashboard();
                  
                  $("#lib_edit_bar_3").addClass("lesbtn_dih");
                  $("#lib_edit_bar_2").addClass("lesbtn_dih");
                  b=0;
                  
                  if($(".__lib_edt").length === 0) {
                    show_info_notification("Moved "+real_length+" sites into "+real_text, "Sites moved");
                  }
                },
                error:function(request, status, error) {
                  $.each(request.responseJSON, function(idx, data) {
                    show_error_looped_notification(data, "Oops!")
                  });  
                }
              });
            }
          }
        }
      }
    } else {
      let prnt_parent = $(".__lib_edt");
      let fid = $(".__lib_edt").attr("data-apiid");
      let prnt_mobile = $("#library-form-all-packets_mobile").find("[data-sid="+$(prnt_parent).attr("data-sid")+"]");
      fid = fid.split('/');
      for(let i=fid.length;i>=0;i--) {
        if (fid[i] !== "" && !isNaN(fid[i])) {
          fid = fid[i];
          break;
        }
      }
      if(!isNaN(fid)) {
        const m39_url = "http://"+window.location.hostname+":"+window.location.port+"/api/saved-sites/"+fid+"/";
        // check if folder is selected
        if(st) {
          let real_folder_name = $(".__lib_edt").find(".library-folder-name").text();
          let real_text = $(".savetofolder").text();
          if($(".savetofolder").length > 0) {
            let data_payload = m4_url+""+$(".savetofolder").attr("data-fid")+"/";
            if($(".savetofolder").attr("data-fid")) {
              data_payload = m4_url+""+$(".savetofolder").attr("data-fid")+"/";
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
                show_info_notification("Moved "+real_folder_name+" into "+real_text, "Site moved");
                $(prnt_parent).remove();
                $(prnt_mobile).remove();
                //$(".__lib_edt").removeClass("savetofolder");
                
                $("#library--move-site-form").css("display","none");
                $("#library-items--folders").removeClass("lifpen");
                $("#library-site-editor-bar").removeClass("lifpen");
                $(explore_main_feed).removeClass("lifpen");
                $(".savetofolder").removeClass("savetofolder");
                $(".library-mov--optbtn_mvsites").addClass("l--a-f-f_disable");
                
                null_dashboard();
                
                $("#lib_edit_bar_3").addClass("lesbtn_dih");
                $("#lib_edit_bar_2").addClass("lesbtn_dih");
                b=0;
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
      }
    }
  });
  
  // http://192.168.1.25:8000/api/saved-sites/
  // load folders for move form
  if(st) {
    if($(".library-folder-header-name").length) {
      let nullifier = setInterval(() => {
        if($(".library-folder-header-name").attr("data-fname")) {
          clearInterval(nullifier);
          $.ajax({
            method: "GET",
            url: m4_url,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              if(json.count>0) {
                $.each(json.results, function(idx, result) {
                  if($(".library-folder-header-name").attr("data-fname")!=result.name) {

                    fnele = $(".exp-user-lib-folder__dummy").clone(true, true);
                    $(fnele).text(result.name);
                    $(fnele).attr("data-fid", result.id);
                    
                    $($(fnele).removeClass("exp-user-lib-folder__dummy")).appendTo(".lmsf-lof ul");
                    
                    mfnele = $(".m__exp-user-lib-folder__dummy").clone(true, true);
                    $(mfnele).text(result.name);
                    $(mfnele).attr("data-fid", result.id);
                    $($(mfnele).removeClass("m__exp-user-lib-folder__dummy")).appendTo(".m__lmsf-lof ul");
                  }
                });
              }
            },
            error:function(request, status, error) {
              console.log(error);
            }
          });  
        }
      }, 300);
    } else {
      $.ajax({
        method: "GET",
        url: m4_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          if(json.count>0) {
            $.each(json.results, function(idx, result) {
              if($(".library-folder-header-name").attr("data-fname")!=result.name) {

                fnele = $(".exp-user-lib-folder__dummy").clone(true, true);
                $(fnele).text(result.name);
                $(fnele).attr("data-fid", result.id);
                
                $($(fnele).removeClass("exp-user-lib-folder__dummy")).appendTo(".lmsf-lof ul");
                
                mfnele = $(".m__exp-user-lib-folder__dummy").clone(true, true);
                $(mfnele).text(result.name);
                $(mfnele).attr("data-fid", result.id);
                $($(mfnele).removeClass("m__exp-user-lib-folder__dummy")).appendTo(".m__lmsf-lof ul");
              }
            });
          }
        },
        error:function(request, status, error) {
          console.log(error);
        }
      });  
    }
  }
  
  $(".exp_crd_clk").click((e) => {
    e.stopPropagation();
  });
  
  

});
