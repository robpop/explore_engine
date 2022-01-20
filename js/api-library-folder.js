"use strict";
function makeid() {
   const size = 16;
   let result           = "";
   let characters       = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   let charactersLength = characters.length;
   for ( let i = 0; i < size; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function good_feedback(b0,b1,b2) {
  let eufsr_submit = document.getElementById("eufsr-submit");
  if(b0 && b1 && b2) {
    $(eufsr_submit).removeClass("l--a-f-f_disable");
    return true;
  } else {
    $(eufsr_submit).addClass("l--a-f-f_disable");
    return false;
  }
}


function cdt() {
  let dt = new Date();
  return dt.getTime();
}

$(() => {
  /*
  1. get folder name
  2. load sites in this folder
  */
  const m4_url = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/";
  const m182_url = "http://"+window.location.hostname+":"+window.location.port+"/api/feedback/";
  const m197_url = "http://"+window.location.hostname+":"+window.location.port+"/api/feedback/given/";
  const apit = "apitoken";
  let st = Cookies.get(apit);
  let fid = (window.location.href).split('/');
  let snele, mnele, cmnele;
  let lsid=1;
  for(let i=fid.length;i>=0;i--) {
    if (fid[i] !== "" && !isNaN(fid[i])) {
      fid = fid[i];
      break;
    }
  }
  
  let mobile_explore_category_dummy = $(".mobile-explore-category-dummy");
  let library_section_dummy = $(".library-section-dummy");
  let mobile_library_section_dummy = $(".mobile-library-section-dummy");
  
  const err_203 = "Please select a 1-5 star rating";
  const err_204 = "Your subject line must be between 4 and 50 characters";
  const err_205 = "Your feedback must be between 8 and 250 characters";
  const err_206 = "Your previous feedback is still being reviewed";
  
  const m4_url_this = m4_url+""+fid+"/";
  
  let eufsr__rating_flg = false;
  let eufsr__subject_flg = false;
  let eufsr__prose_flg = false;
  let eufsr__subject = document.getElementById("eufsr-subject");
  let eufsr__prose = document.getElementById("eufsr-prose");
  let eufsr_submit = document.getElementById("eufsr-submit");
  let eufsr_cansend = false;
  
  const msg_206 = "Your feedback was sent!";
  
  const dynamic_generated_logo_size = 128;
  let proper_logo_width = ($(".mobile-library-section").width() * 0.8) / dynamic_generated_logo_size;
  
  let feedback_submitted_already = [];
  let mobile_feedback_already_added=[];
  
  $.Lazy("sitecard_loader", function(element, response) {
      element.addClass("loaded");
      response(true);
  });
  
  
  if(st) {
    if(!isNaN(fid)) {
      const m77_url = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/"+fid+"/saved-sites/";
      
      const lib = "/library/folder/";
      
      const def_tag = "library";
      const def_tag_msg = "All Sites";
      
      let url_to_name = {};
      
      const allsites_tag = "LIBRARY";
          
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
          if(json.count!==0) {
            let rlength = json.results.length;
            for(let i=0; i<rlength; ++i) {
              let result = json.results[i];
              cmnele = mobile_explore_category_dummy.clone(true, true);
              
              $(cmnele).attr("href", "http://"+window.location.hostname+":"+window.location.port+lib+result.id).attr("data-name", result.name.toUpperCase().replace(/ /g,'').replace(/_/g,'').replace(/&/g, '')).attr("title", "Browse "+result.name.toLowerCase()).attr("data-id", result.id);
              $(cmnele).text(result.name);
              $($(cmnele).removeClass("mobile-explore-category-dummy")).insertBefore( "#mobile-explore-category-buffer" );              
            }
          } else {
            $("#lib_edit_bar_2").addClass("lesbtn_dih");
            $("#lib_edit_bar_2").find("p").addClass("lesbtn_dis");
          }
        },
        error:function(request, status, error) {
          console.log(error);
        },
        complete:function(data) {
          let category = window.location.href;
          category = category.split("/");
          let this_category = undefined;
          for(let i=category.length;i>=0;i--) {
            if (category[i] && !isNaN(category[i])) {
              this_category = category[i];
              break;
            }
          }
          
          if(this_category == def_tag) {
            $(".header-bar-explore-cb1").text(def_tag_msg);
            $("#side-bar-shuffle-categories").css("color", "#3C6CC4");
          } else {
            $(".header-bar-explore-cb1").text(url_to_name[this_category]);
            $("#side-bar-shuffle-categories").css("color", "#1B2F56");
          }
          
          let t = $("#mobile-explore-tags-bar").find("[data-id='"+this_category+"']");
          
          $(t).css({
            "color":"#3C6CC4",
            "font-family":"Oxygen-Bold",
            "background":"#ebf0f9",
            "padding":"6px 12px",
            "border-radius":"50px"
          });
          
          if(this_category!=allsites_tag) $(t).insertAfter("#mobile-explore-allsites-tag");
          
        }
      });
      $.ajax({
        method: "GET",
        url: m4_url_this,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          $(".library-folder-header-name").text(json.name);
          $(".library-folder-header-name__modify").attr("placeholder", json.name);
          $(".library-folder-header-name").attr("data-fname", json.name);
        },
        error:function(request, status, error) {
          console.log(error);
        }
      });
      
      $.ajax({
        method: "GET",
        url: m197_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          if(json && json.count > 0) {
            let rlength = json.results.length;
            for(let i=0; i<rlength; ++i) {
              let data = json.results[i];
              feedback_submitted_already.push(data.id);
            }
          }
        },
        error:function(request, status, error) {
          show_sys_error_notification();
        },
        complete:function(data) {
          $.ajax({
            method: "GET",
            url: m77_url,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              if(json.count!==0) {
                $("#library-site-editor-bar").css("display","block");
                let rlength = json.results.length;
                for(let i=0; i<rlength; ++i) {
                  let result = json.results[i];
                  $.ajax({
                    method:"GET",
                    url: result.site,
                    success:function(data) {
                      snele = library_section_dummy.clone(true, true);
                      mnele = mobile_library_section_dummy.clone(true, true);
                      
                      if (data.logo) {
                        $(snele).find("img").attr("data-src", data.logo);
                        $(snele).find("img").attr("alt", data.name+" logo");
                        
                        $(mnele).find(".mobile-library-preview img").attr("data-src", data.logo);
                        $(mnele).find(".mobile-library-preview img").attr("alt", data.name+" logo");
                      } else {
                        // remove img from library-folder-preview
                        // add the backup div for hash logo
                        // generate logo
                        let mobile_id = makeid();
                        $(snele).find("img").remove();
                        $(mnele).find(".mobile-library-preview img").remove();
                        let n = $("<div id="+ data.url +" data-mobile="+mobile_id+"></div>");
                        $(snele).find(".library-folder-preview").append(n);
                        $(snele).find("img").attr("alt", data.name+" generated logo");
                        $(mnele).attr("data-mobile", mobile_id);
                        
                        setTimeout(() => {
                          generate(document.getElementById(n[0].id), data.url, proper_logo_width);
                        },0);
                      }
                      
                      $(snele).find(".library-folder-name").text(data.name);
                      $(mnele).find(".mobile-library-info p").text(data.name);

                      $(snele).find(".explore-site--open").attr("href", data.url);
                      $(snele).find(".explore-site--open").attr("title", "Go to "+data.name);
                      $(mnele).find(".mmeta__link").text(data.url);
                      $(mnele).find(".mmeta__link_title").text("Go to "+data.name);
                      $(mnele).find(".mmeta__securelink p").text(data.url);
                      if(data.url.includes("https")) {
                        $(mnele).find(".mmeta__securelink p").css("color", "#718EC4");
                        $(mnele).find(".mmeta__securelink svg").css("color", "#718EC4");
                      } else {
                        $(mnele).find(".mmeta__securelink p").css("color", "");
                        $(mnele).find(".mmeta__securelink svg").css("color", "");
                      }
                      
                      $(mnele).find(".mmeta__title").text(data.name);

                      $(snele).find(".explore-expanded-info-desc").text(data.description);
                      $(mnele).find(".mmeta__desc").text(data.description);
                      
                      if(jQuery.inArray(data.id, feedback_submitted_already) !== -1) {
                        $(snele).find(".library-site-feedback button").remove();
                        $(snele).find(".library-site-feedback").append("<p>Feedback is pending</p>");
                        // something for mobile site card here...
                        mobile_feedback_already_added.push(data.id);
                      }
                      
                      $($(snele).removeClass("library-section-dummy").attr("data-sid", data.id).attr("data-lsid", lsid).attr("data-apiid", result.api_url).attr("data-asid", data.api_url)).appendTo( "#library-items--sites" );
                      
                      $($(mnele).removeClass("mobile-library-section-dummy").attr("data-sid", data.id).attr("data-lsid", lsid).attr("data-apiid", result.api_url).attr("data-asid", data.api_url)).appendTo( "#library-form-all-packets_mobile" );
                      
                      lsid++;
                    },
                    error:function(request, status, error) {
                      console.log(error);
                    },
                    complete:function(jqXHR, textStatus) {
                      $('.lazy').Lazy({
                        afterLoad: function(element) {
                          console.log(element);
                        },
                      });
                    }
                  });
                }
              } else {
                $(".library--empty-folder").css("display","flex");
              }
            },
            error:function(request, status, error) {
              console.log(error);
            }
          });
        }
      });
    }
  }
  
  $(eufsr_submit).click(() => {
    // check the rating, subject, and message
    if(eufsr__rating_flg && eufsr__subject_flg && eufsr__prose_flg && eufsr_cansend && st) {
      // get star rating from selected stars
      let r = $(".fstar").length;
      $.ajax({
        method: "POST",
        url: m182_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          site: $(eufsr_submit).closest(".explore-listing-section").attr("data-asid"),
          rating: r,
          subject: $(eufsr__subject).val(),
          message: $(eufsr__prose).val()
        },
        success:function(json) {
          show_info_notification("Your feedback was submitted to this site's owner", "Feedback sent");
          
          $(eufsr__subject).val("");
          $(eufsr__prose).val("");
          $(".fstar").removeClass("fstar");
          $("#eufsr-wrap div").html("&#9734;");
          eufsr__rating_flg = false;
          eufsr__subject_flg = false;
          eufsr__prose_flg = false;
          $(eufsr_submit).addClass("l--a-f-f_disable");
        },
        error:function(request, status, error) {
          try {
            $.each(request.responseJSON, function(idx, data) {
              show_error_notification(data, "Oops!");
            }); 
          } catch(e) {
            show_error_notification(request.responseJSON, "Oops!");
          }
          
          $(eufsr__subject).val("");
          $(eufsr__prose).val("");
          $(".fstar").removeClass("fstar");
          $("#eufsr-wrap div").html("&#9734;");
          eufsr__rating_flg = false;
          eufsr__subject_flg = false;
          eufsr__prose_flg = false;
          $(eufsr_submit).addClass("l--a-f-f_disable");
        }
      });
    } else {
      if (!eufsr__rating_flg) {
        // no rating
        show_error_notification("Please rate this site 1-5 stars", "Rating required");
      } else if (!eufsr__subject_flg) {
        // no subject
        show_error_notification("Please provide a subject (4-50 characters)", "Subject required");
      } else if (!eufsr__prose_flg) {
        // no message
        show_error_notification("Please provide a message (8-250 characters)", "Message required");
      }
    }
  });
  
  
  $("#eufsr-wrap div").click((e) => {
    let star = e.target;
    let flg = true;
    if($(star).hasClass("fstar")) {
      flg = false;
    } else {
      flg = true;
    }
    if(flg) {
      for(let i=$(star).index(); i>-1; --i) {
        $("#eufsr-wrap div").eq(i).html("&#9733;").addClass("fstar");
      }
    } else {
      for(let i=$(star).index()+1; i<$("#eufsr-wrap div").length; ++i) {
        $("#eufsr-wrap div").eq(i).html("&#9734;").removeClass("fstar");
      }
    }
    eufsr__rating_flg = true;
    eufsr_cansend = good_feedback(eufsr__rating_flg, eufsr__subject_flg, eufsr__prose_flg);
  });
  
  $(eufsr__subject).keyup(() => {
    if($(eufsr__subject).val().length >= 4 && $(eufsr__subject).val().length <= 50) {
      eufsr__subject_flg = true;
    } else {
      eufsr__subject_flg = false;
    }
    eufsr_cansend = good_feedback(eufsr__rating_flg, eufsr__subject_flg, eufsr__prose_flg);
  });
  
  $(eufsr__prose).keyup(() => {
    if($(eufsr__prose).val().length >= 8 && $(eufsr__prose).val().length <= 250) {
      eufsr__prose_flg = true;
    } else {
      eufsr__prose_flg = false;
    }
    eufsr_cansend = good_feedback(eufsr__rating_flg, eufsr__subject_flg, eufsr__prose_flg);
  });
  
  $(".mobile-library-section").click((e) => {
    $(".mobile-library-site-feedback button").css("display","block");
    setTimeout(() => {
      if(mobile_feedback_already_added.includes(parseInt($(e.target).attr("data-sid")))) {
        $(".mobile-library-site-feedback button").css("display","none");
      }
    },0);
    //return true;
  });
  
  
  $(window).resize(() => {
    let right = ((128 - $(".mobile-library-section").width())/2)-0.23;
    proper_logo_width = ($(".mobile-library-section").width() * 0.8) / dynamic_generated_logo_size;
    $("[data-mgen]").css({
      '-webkit-transform' : 'scale(' + proper_logo_width + ')',
      '-moz-transform'    : 'scale(' + proper_logo_width + ')',
      '-ms-transform'     : 'scale(' + proper_logo_width + ')',
      '-o-transform'      : 'scale(' + proper_logo_width + ')',
      'transform'         : 'scale(' + proper_logo_width + ')',
      'right'             : right
    });
  });
  
  $.each($("input[type='text']"), function(idx, data) {
    Enforcer(data);
  });
  $.each($("textarea"), function(idx, data) {
    Enforcer(data);
  });

});