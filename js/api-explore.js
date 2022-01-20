"use strict";
function cdt() {
  let dt = new Date();
  return dt.getTime();
}

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
  if(b0 && b1 && b2) {
    $("#eufsr-submit").removeClass("l--a-f-f_disable");
    return true;
  } else {
    $("#eufsr-submit").addClass("l--a-f-f_disable");
    return false;
  }
}

$(function(){
  // requests sites
  let nele, mnele, ncat, fnele, mfnele;
    
  let eufsr__rating_flg = false;
  let eufsr__subject_flg = false;
  let eufsr__prose_flg = false;
  //let eufsr__prose = document.getElementById("eufsr-prose");
  //let eufsr_submit = document.getElementById("eufsr-submit");
  let eufsr_cansend = false;
  
  let library_section_dummy = $(".library-section-dummy");
  let mobile_library_section_dummy = $(".mobile-library-section-dummy");
  let exp_user_lib_folder__dummy = $(".exp-user-lib-folder__dummy");
  let m__exp_user_lib_folder__dummy = $(".m__exp-user-lib-folder__dummy");
  let sites_list_view = ""; // this is to reduce the calls to append() and appendTo()
  
  let unseen_chunks_d = [];
  let unseen_chunks_m = [];
  
  const msg_206 = "Your feedback was sent!";
  
  const dynamic_generated_logo_size = 128;
    
  //console.log($(".mobile-library-section").width());
  let proper_logo_width = ($(".mobile-library-section").width() * 0.8) / dynamic_generated_logo_size;
    
  const get_url = "http://"+window.location.hostname+":"+window.location.port+"/api/sites/";
  const m0_url = "http://"+window.location.hostname+":"+window.location.port+"/api/metric-request/showings/";
  const m92_url = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/";
  const m162_url = "http://"+window.location.hostname+":"+window.location.port+"/api/saved-sites/all/";
  const m182_url = "http://"+window.location.hostname+":"+window.location.port+"/api/feedback/";
  const m197_url = "http://"+window.location.hostname+":"+window.location.port+"/api/feedback/given/";
  // get sites for category
  let m77_url = "http://"+window.location.hostname+":"+window.location.port+"/api/sites/";
  
  const def_tag = "explore";
  
  let category = window.location.href;
  category = category.split("/");
  let this_category = undefined;
  for(let i=category.length;i>=0;i--) {
    if (category[i] && isNaN(category[i])) {
      this_category = category[i];
      break;
    }
  }
  
  const apit = "apitoken";
  let st = Cookies.get(apit);
  
  let svd_sites=[];
  
  let showings_request = true;
  
  let feedback_submitted_already = [];
  
  let mobile_sites_already_added=[];
  let mobile_feedback_already_added=[];
  
  if (!st) $(".explore-expanded-info p").css("margin-top", "-15px");
  
  $.Lazy("sitecard_loader", function(element, response) {
      element.addClass("loaded");
      response(true);
  });
  
  //explore-add--library
  let lsid=1;
  if(st) {
    // LOGGED IN
    
    // GET SITES WITH FEEDBACK ALREADY GIVEN
    /*
    
    /api/feedback/given - GET
        GET:
            Description: Returns a list of site objects which are still reviewing feedback submitted from your account.
            URL Parameters: None
            Fields: None
            Notes: None
    
    */
    
    
    // GET SAVED SITES
    $.ajax({
      method: "GET",
      url: m162_url,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        let rlength = json.results.length;
        for(let i=0; i<rlength; ++i) {
          let result = json.results[i];
          // extract site id from result.site
          let fid = result.site;
          fid = fid.split("/");
          for(let i=fid.length;i>=0;i--) {
            if (fid[i] !== "" && !isNaN(fid[i])) {
              svd_sites.push(parseInt(fid[i]));
              break;
            }
          }
        }
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
      complete:function(rxc) {
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
            if(this_category !== def_tag) {
              // GET SITES FOR SPECIFIC TAG
              $.ajax({
                method: "GET",
                url: m77_url+this_category+"/",
                data: {
                  nocache: cdt()
                },
                success:function(json) {
                  let temp_chunk_d = [];
                  let temp_chunk_m = [];
                  
                  // convert this each loop to a standard js for loop
                  let rlength = json.results.length;
                  for(let i=0; i<rlength; ++i) {
                    let result = json.results[i];
                    nele = library_section_dummy.clone(true, true);
                    mnele = mobile_library_section_dummy.clone(true, true);
                    
                    if (result.logo) {
                      $(nele).find("img").attr("data-src", result.logo);
                      $(nele).find("img").attr("alt", result.name+" logo");
                      
                      $(mnele).find(".mobile-library-preview img").attr("data-src", result.logo);
                      $(mnele).find(".mobile-library-preview img").attr("alt", result.name+" logo");
                    } else {
                      // remove img from library-folder-preview
                      // add the backup div for hash logo
                      // generate logo
                      let mobile_id = makeid();
                      $(nele).find("img").remove();
                      $(mnele).find(".mobile-library-preview img").remove();
                      let n = $("<div id="+ result.url +" data-mobile="+mobile_id+"></div>");
                      $(nele).find(".library-folder-preview").append(n);
                      $(nele).find("img").attr("alt", result.name+" generated logo");
                      $(mnele).attr("data-mobile", mobile_id);
                      
                      setTimeout(() => {
                        generate(document.getElementById(n[0].id), result.url, proper_logo_width);
                      },0);
                    }
                    
                    
                    $(nele).find(".library-folder-name").text(result.name);
                    $(mnele).find(".mobile-library-info p").text(result.name);


                    $(nele).find(".explore-site--open").attr("href", result.url);
                    $(nele).find(".explore-site--open").attr("title", "Go to "+result.name);
                    $(mnele).find(".mmeta__link").text(result.url);
                    $(mnele).find(".mmeta__link_title").text("Go to "+result.name);
                    $(mnele).find(".mmeta__securelink p").text(result.url);
                    if(result.url.includes("https")) {
                      $(mnele).find(".mmeta__securelink p").css("color", "#718EC4");
                      $(mnele).find(".mmeta__securelink svg").css("color", "#718EC4");
                    } else {
                      $(mnele).find(".mmeta__securelink p").css("color", "");
                      $(mnele).find(".mmeta__securelink svg").css("color", "");
                    }
                    $(nele).find(".explore-security-show-link").attr("data-audited", "Audited on "+result.audited.substring(0,result.audited.indexOf("T")));
                    
                    $(mnele).find(".mmeta__title").text(result.name);

                    $(nele).find(".explore-expanded-info-desc").text(result.description);
                    $(mnele).find(".mmeta__desc").text(result.description);

                    // check if site is already saved to user library
                    if(jQuery.inArray(result.id, svd_sites) !== -1) {
                      $(nele).find(".explore-add--library").remove();
                      mobile_sites_already_added.push(result.id);
                    }
                    console.log(svd_sites);
                    
                    // check if user already submitted feedback for this site
                    if(jQuery.inArray(result.id, feedback_submitted_already) !== -1) {
                      $(nele).find(".library-site-feedback button").remove();
                      $(nele).find(".library-site-feedback").append("<p>Feedback is pending</p>");
                      // something for mobile site card here...
                      mobile_feedback_already_added.push(result.id);
                    }
                    
                    $(nele).removeClass("library-section-dummy").attr("data-sid", result.id).attr("data-lsid", lsid).attr("data-asid", result.api_url);
                    $(mnele).removeClass("mobile-library-section-dummy").attr("data-sid", result.id).attr("data-lsid", lsid).attr("data-asid", result.api_url);
                    
                    // sites_list_view - add nele and mnele to this instead of appendTo()
                    sites_list_view += $(nele)[0].outerHTML;
                    sites_list_view += $(mnele)[0].outerHTML;
                                        
                    lsid++;
                  }
                  
                  $("#explore-main-feed").html($("#explore-main-feed").html()+sites_list_view);
                  sites_list_view = "";
                  
                  let temp_d = [];
                  let temp_m = [];
                  let elength = $("#explore-main-feed").children().length;
                  let explore_main_feed = $("#explore-main-feed");
                  for(let i=0; i<elength; ++i) {
                    let child = explore_main_feed.children().eq(i);
                    if($(child).hasClass("library-section") && !$(child).hasClass("library-section-dummy")) {
                      temp_d.push($(child)[0]);
                      if(temp_d.length===8) {
                        unseen_chunks_d.push(temp_d);
                        temp_d=[];
                      }
                    } else if($(child).hasClass("mobile-library-section") && !$(child).hasClass("mobile-library-section-dummy")) {
                      temp_m.push($(child)[0]);
                      if(temp_m.length===8) {
                        unseen_chunks_m.push(temp_m);
                        temp_m=[];
                      }
                    }
                  }
                },
                error:function(request, status, error) {
                  show_sys_error_notification();
                },
                complete:function(jqXHR, textStatus) {
                  
                  console.log(unseen_chunks_d);
                  console.log(unseen_chunks_m);
                  
                  $(".lazy").Lazy({
                    afterLoad: function(element) {
                      //console.log(element);
                    },
                  });
                  
                  if(!$("#explore-discover-more_refresh").length) {
                    $("<button id='explore-discover-more_refresh'>Discover more sites</button>").appendTo("#explore-main-feed"); 
                    $("#explore-discover-more_refresh").click(() => {
                      window.location.reload();
                    });
                  }    
                }
              });
            } else {
              // GET ALL SITES
              $.ajax({
                method: "GET",
                url: get_url,
                data: {
                  nocache: cdt()
                },
                success:function(json) {
                  let temp_chunk_d = [];
                  let temp_chunk_m = [];
                  let rlength = json.results.length;
                  for(let i=0; i<rlength; ++i) {
                    let result = json.results[i];
                    nele = library_section_dummy.clone(true, true);
                    mnele = mobile_library_section_dummy.clone(true, true);
                    
                    if (result.logo) {
                      $(nele).find("img").attr("data-src", result.logo);
                      $(nele).find("img").attr("alt", result.name+" logo");
                      
                      $(mnele).find(".mobile-library-preview img").attr("data-src", result.logo);
                      $(mnele).find(".mobile-library-preview img").attr("alt", result.name+" logo");
                    } else {
                      // remove img from library-folder-preview
                      // add the backup div for hash logo
                      // generate logo
                      let mobile_id = makeid();
                      $(nele).find("img").remove();
                      $(mnele).find(".mobile-library-preview img").remove();
                      let n = $("<div id="+ result.url +" data-mobile="+mobile_id+"></div>");
                      $(nele).find(".library-folder-preview").append(n);
                      $(nele).find("img").attr("alt", result.name+" generated logo");
                      $(mnele).attr("data-mobile", mobile_id);
                      
                      setTimeout(() => {
                        generate(document.getElementById(n[0].id), result.url, proper_logo_width);
                      },0);
                    }
                      
                    
                    $(nele).find(".library-folder-name").text(result.name);
                    $(mnele).find(".mobile-library-info p").text(result.name);
                    

                    $(nele).find(".explore-site--open").attr("href", result.url);
                    $(nele).find(".explore-site--open").attr("title", "Go to "+result.name);
                    $(mnele).find(".mmeta__link").text(result.url);
                    $(mnele).find(".mmeta__link_title").text("Go to "+result.name);
                    $(mnele).find(".mmeta__securelink p").text(result.url);
                    if(result.url.includes("https")) {
                      $(mnele).find(".mmeta__securelink p").css("color", "#718EC4");
                      $(mnele).find(".mmeta__securelink svg").css("color", "#718EC4");
                    } else {
                      $(mnele).find(".mmeta__securelink p").css("color", "");
                      $(mnele).find(".mmeta__securelink svg").css("color", "");
                    }
                    $(nele).find(".explore-security-show-link").attr("data-audited", "Audited on "+result.audited.substring(0,result.audited.indexOf("T")));
                    
                    $(mnele).find(".mmeta__title").text(result.name);

                    $(nele).find(".explore-expanded-info-desc").text(result.description);
                    $(mnele).find(".mmeta__desc").text(result.description);

                    // check if site is already saved to user library
                    if(jQuery.inArray(result.id, svd_sites) !== -1) {
                      $(nele).find(".explore-add--library").remove();
                      mobile_sites_already_added.push(result.id);
                    }
                    console.log(svd_sites);
                    
                    // check if user already submitted feedback for this site
                    if(jQuery.inArray(result.id, feedback_submitted_already) !== -1) {
                      $(nele).find(".library-site-feedback button").remove();
                      $(nele).find(".library-site-feedback").append("<p>Feedback is pending</p>");
                      // something for mobile site card here...
                      mobile_feedback_already_added.push(result.id);
                    }
                    
                    $(nele).removeClass("library-section-dummy").attr("data-sid", result.id).attr("data-lsid", lsid).attr("data-asid", result.api_url);
                    $(mnele).removeClass("mobile-library-section-dummy").attr("data-sid", result.id).attr("data-lsid", lsid).attr("data-asid", result.api_url);
                    
                    sites_list_view += $(nele)[0].outerHTML;
                    sites_list_view += $(mnele)[0].outerHTML;
                    
                    lsid++; 
                  }
                  
                  $("#explore-main-feed").html($("#explore-main-feed").html()+sites_list_view);
                  sites_list_view = "";
                  
                  let temp_d = [];
                  let temp_m = [];
                  let elength = $("#explore-main-feed").children().length;
                  let explore_main_feed = $("#explore-main-feed");
                  for(let i=0; i<elength; ++i) {
                    let child = explore_main_feed.children().eq(i);
                    if($(child).hasClass("library-section") && !$(child).hasClass("library-section-dummy")) {
                      temp_d.push($(child)[0]);
                      if(temp_d.length===8) {
                        unseen_chunks_d.push(temp_d);
                        temp_d=[];
                      }
                    } else if($(child).hasClass("mobile-library-section") && !$(child).hasClass("mobile-library-section-dummy")) {
                      temp_m.push($(child)[0]);
                      if(temp_m.length===8) {
                        unseen_chunks_m.push(temp_m);
                        temp_m=[];
                      }
                    }
                  }
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
                complete:function(jqXHR, textStatus) {
                  
                  console.log(unseen_chunks_d);
                  console.log(unseen_chunks_m);
                  
                  $(".lazy").Lazy({
                    afterLoad: function(element) {
                      //console.log(element);
                    },
                  });
                  
                  if(!$("#explore-discover-more_refresh").length) {
                    $("<button id='explore-discover-more_refresh'>Discover more sites</button>").appendTo("#explore-main-feed"); 
                    $("#explore-discover-more_refresh").click(() => {
                      window.location.reload();
                    });
                  }  

                }
              });
            }
          }
        });
      }
    });
  } else {
    // NOT LOGGED IN
    if(this_category !== def_tag) {
      // GET SITES FOR SPECIFIC TAG - NOT LOGGED IN
      $.ajax({
        method: "GET",
        url: m77_url+this_category+"/",
        data: {
          nocache: cdt()
        },
        success:function(json) {
          let temp_chunk_d = [];
          let temp_chunk_m = [];
          let rlength = json.results.length;
          for(let i=0; i<rlength; ++i) {
            let result = json.results[i];
            nele = library_section_dummy.clone(true, true);
            mnele = mobile_library_section_dummy.clone(true, true);

            if (result.logo) {
              $(nele).find("img").attr("data-src", result.logo);
              $(nele).find("img").attr("alt", result.name+" logo");
              
              $(mnele).find(".mobile-library-preview img").attr("data-src", result.logo);
              $(mnele).find(".mobile-library-preview img").attr("alt", result.name+" logo");
            } else {
              // remove img from library-folder-preview
              // add the backup div for hash logo
              // generate logo
              let mobile_id = makeid();
              $(nele).find("img").remove();
              $(mnele).find(".mobile-library-preview img").remove();
              let n = $("<div id="+ result.url +" data-mobile="+mobile_id+"></div>");
              $(nele).find(".library-folder-preview").append(n);
              $(nele).find("img").attr("alt", result.name+" generated logo");
              $(mnele).attr("data-mobile", mobile_id);
              
              setTimeout(() => {
                generate(document.getElementById(n[0].id), result.url, proper_logo_width);
              },0);
            }
              
            
            $(nele).find(".library-folder-name").text(result.name);
            $(mnele).find(".mobile-library-info p").text(result.name);


            $(nele).find(".explore-site--open").attr("href", result.url);
            $(nele).find(".explore-site--open").attr("title", "Go to "+result.name);
            $(mnele).find(".mmeta__link").text(result.url);
            $(mnele).find(".mmeta__link_title").text("Go to "+result.name);
            $(mnele).find(".mmeta__securelink p").text(result.url);
            if(result.url.includes("https")) {
              $(mnele).find(".mmeta__securelink p").css("color", "#718EC4");
              $(mnele).find(".mmeta__securelink svg").css("color", "#718EC4");
            } else {
              $(mnele).find(".mmeta__securelink p").css("color", "");
              $(mnele).find(".mmeta__securelink svg").css("color", "");
            }
            $(nele).find(".explore-security-show-link").attr("data-audited", "Audited on "+result.audited.substring(0,result.audited.indexOf("T")));
            
            $(mnele).find(".mmeta__title").text(result.name);

            $(nele).find(".explore-expanded-info-desc").text(result.description);
            $(mnele).find(".mmeta__desc").text(result.description);

            //if (!st) $(nele).find(".explore-add--library").remove();
            /*if(jQuery.inArray(result.id, svd_sites) !== -1) {
              $(nele).find(".explore-add--library").remove();
              mobile_sites_already_added.push(result.id);
            }*/
            
            $(nele).removeClass("library-section-dummy").attr("data-sid", result.id).attr("data-lsid", lsid).attr("data-asid", result.api_url);
            $(mnele).removeClass("mobile-library-section-dummy").attr("data-sid", result.id).attr("data-lsid", lsid).attr("data-asid", result.api_url);
            
            sites_list_view += $(nele)[0].outerHTML;
            sites_list_view += $(mnele)[0].outerHTML;
            
            lsid++;
          }
          
          $("#explore-main-feed").html($("#explore-main-feed").html()+sites_list_view);
          sites_list_view = "";
          
          let temp_d = [];
          let temp_m = [];
          let elength = $("#explore-main-feed").children().length;
          let explore_main_feed = $("#explore-main-feed");
          for(let i=0; i<elength; ++i) {
            let child = explore_main_feed.children().eq(i);
            if($(child).hasClass("library-section") && !$(child).hasClass("library-section-dummy")) {
              temp_d.push($(child)[0]);
              if(temp_d.length===8) {
                unseen_chunks_d.push(temp_d);
                temp_d=[];
              }
            } else if($(child).hasClass("mobile-library-section") && !$(child).hasClass("mobile-library-section-dummy")) {
              temp_m.push($(child)[0]);
              if(temp_m.length===8) {
                unseen_chunks_m.push(temp_m);
                temp_m=[];
              }
            }
          }
        },
        error:function(request, status, error) {
          show_sys_error_notification();
        },
        complete:function(jqXHR, textStatus) {
          
          console.log(unseen_chunks_d);
          console.log(unseen_chunks_m);
          
          $(".lazy").Lazy({
            afterLoad: function(element) {
              //console.log(element);
            },
          });
          
          if(!$("#explore-discover-more_refresh").length) {
            $("<button id='explore-discover-more_refresh'>Discover more sites</button>").appendTo("#explore-main-feed"); 
            $("#explore-discover-more_refresh").click(() => {
              window.location.reload();
            });
          }  

        }
      });
    } else {
      // GET ALL SITES - NOT LOGGED IN
      $.ajax({
        method: "GET",
        url: get_url,
        data: {
          nocache: cdt()
        },
        success:function(json) {
          let temp_chunk_d = [];
          let temp_chunk_m = [];
          let rlength = json.results.length;
          for(let i=0; i<rlength; ++i) {
            let result = json.results[i];
            nele = library_section_dummy.clone(true, true);
            mnele = mobile_library_section_dummy.clone(true, true);
            
            if (result.logo) {
              $(nele).find("img").attr("data-src", result.logo);
              $(nele).find("img").attr("alt", result.name+" logo");
              
              $(mnele).find(".mobile-library-preview img").attr("data-src", result.logo);
              $(mnele).find(".mobile-library-preview img").attr("alt", result.name+" logo");
            } else {
              // remove img from library-folder-preview
              // add the backup div for hash logo
              // generate logo
              let mobile_id = makeid();
              $(nele).find("img").remove();
              $(mnele).find(".mobile-library-preview img").remove();
              let n = $("<div id="+ result.url +" data-mobile="+mobile_id+"></div>");
              $(nele).find(".library-folder-preview").append(n);
              $(nele).find("img").attr("alt", result.name+" generated logo");
              $(mnele).attr("data-mobile", mobile_id);
              
              setTimeout(() => {
                generate(document.getElementById(n[0].id), result.url, proper_logo_width);
              },0);
            }
              
            
            $(nele).find(".library-folder-name").text(result.name);
            $(mnele).find(".mobile-library-info p").text(result.name);


            $(nele).find(".explore-site--open").attr("href", result.url);
            $(nele).find(".explore-site--open").attr("title", "Go to "+result.name);
            $(mnele).find(".mmeta__link").text(result.url);
            $(mnele).find(".mmeta__link_title").text("Go to "+result.name);
            $(mnele).find(".mmeta__securelink p").text(result.url);
            if(result.url.includes("https")) {
              $(mnele).find(".mmeta__securelink p").css("color", "#718EC4");
              $(mnele).find(".mmeta__securelink svg").css("color", "#718EC4");
            } else {
              $(mnele).find(".mmeta__securelink p").css("color", "");
              $(mnele).find(".mmeta__securelink svg").css("color", "");
            }
            $(nele).find(".explore-security-show-link").attr("data-audited", "Audited on "+result.audited.substring(0,result.audited.indexOf("T")));
            
            $(mnele).find(".mmeta__title").text(result.name);

            $(nele).find(".explore-expanded-info-desc").text(result.description);
            $(mnele).find(".mmeta__desc").text(result.description);

            //if (!st) $(nele).find(".explore-add--library").remove();
            /*if(jQuery.inArray(result.id, svd_sites) !== -1) {
              $(nele).find(".explore-add--library").remove();
              mobile_sites_already_added.push(result.id);
            }*/
            
            $(nele).removeClass("library-section-dummy").attr("data-sid", result.id).attr("data-lsid", lsid).attr("data-asid", result.api_url);
            $(mnele).removeClass("mobile-library-section-dummy").attr("data-sid", result.id).attr("data-lsid", lsid).attr("data-asid", result.api_url);
            
            sites_list_view += $(nele)[0].outerHTML;
            sites_list_view += $(mnele)[0].outerHTML;
            
            lsid++;             
          }
          
          $("#explore-main-feed").html($("#explore-main-feed").html()+sites_list_view);
          sites_list_view = "";
          
          let temp_d = [];
          let temp_m = [];
          let elength = $("#explore-main-feed").children().length;
          let explore_main_feed = $("#explore-main-feed");
          for(let i=0; i<elength; ++i) {
            let child = explore_main_feed.children().eq(i);
            if($(child).hasClass("library-section") && !$(child).hasClass("library-section-dummy")) {
              temp_d.push($(child)[0]);
              if(temp_d.length===8) {
                unseen_chunks_d.push(temp_d);
                temp_d=[];
              }
            } else if($(child).hasClass("mobile-library-section") && !$(child).hasClass("mobile-library-section-dummy")) {
              temp_m.push($(child)[0]);
              if(temp_m.length===8) {
                unseen_chunks_m.push(temp_m);
                temp_m=[];
              }
            }
          }
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
        complete:function(jqXHR, textStatus) {
          
          console.log(unseen_chunks_d);
          console.log(unseen_chunks_m);
          
          $(".lazy").Lazy({
            afterLoad: function(element) {
              //console.log(element);
            },
          });
          
          if(!$("#explore-discover-more_refresh").length) {
            $("<button id='explore-discover-more_refresh'>Discover more sites</button>").appendTo("#explore-main-feed"); 
            $("#explore-discover-more_refresh").click(() => {
              window.location.reload();
            });
          }   

        }
      });
    }
  }
  
  
  
  // load user folders
  // .explore-user-library-folders ul
  if(st) {
    $.ajax({
      method: "GET",
      url: m92_url,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        if(json.count>0) {
          let rlength = json.results.length;
          for(let i=0; i<rlength; ++i) {
            let result = json.results[i];
            fnele = exp_user_lib_folder__dummy.clone(true, true);
            mfnele = m__exp_user_lib_folder__dummy.clone(true, true);
            
            $(fnele).text(result.name);
            $(fnele).attr("data-fid", result.id);
            $(mfnele).text(result.name);
            $(mfnele).attr("data-fid", result.id);
            
            $($(fnele).removeClass("exp-user-lib-folder__dummy").addClass("exp-user-lib-folder__inst")).appendTo(".explore-user-library-folders ul");
            $($(mfnele).removeClass("m__exp-user-lib-folder__dummy").addClass("m__exp-user-lib-folder__inst")).appendTo("#mobile-card-library_folders");
          }
        }
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
  
  $(document).on("keyup", "#eufsr-subject", (e) => {
    if($("#eufsr-subject").val().length >= 4 && $("#eufsr-subject").val().length <= 50) {
      eufsr__subject_flg = true;
    } else {
      eufsr__subject_flg = false;
    }
    eufsr_cansend = good_feedback(eufsr__rating_flg, eufsr__subject_flg, eufsr__prose_flg);
  });
  
  $(document).on("keyup", "#eufsr-prose", (e) => {
    if($("#eufsr-prose").val().length >= 8 && $("#eufsr-prose").val().length <= 250) {
      eufsr__prose_flg = true;
    } else {
      eufsr__prose_flg = false;
    }
    eufsr_cansend = good_feedback(eufsr__rating_flg, eufsr__subject_flg, eufsr__prose_flg);
  });
  
  $(document).on("click", ".mobile-library-section", (e) => {
    e.target = $(e.target).closest(".mobile-library-section");
    $(".explore-add--library__mobile").css("display","inline-block");
    $(".mobile-library-site-feedback button").css("display","block");
    setTimeout(() => {
      if(mobile_sites_already_added.includes(parseInt($(e.target).attr("data-sid")))) {
        $(".explore-add--library__mobile").css("display","none");
      }
      if(mobile_feedback_already_added.includes(parseInt($(e.target).attr("data-sid")))) {
        $(".mobile-library-site-feedback button").css("display","none");
      }
    },100);
    //return true;
  });
  
  $(".mobile-library-exp-cls").click(() => {
    $(".explore-add--library__mobile").css("display","");
  });
  
  // fuck
  $("#eufsr-submit").click((e) => {
    e.target = $(e.target).closest("#eufsr-submit");
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
          site: $(e.target).closest(".explore-listing-section").attr("data-asid"),
          rating: r,
          subject: $("#eufsr-subject").val(),
          message: $("#eufsr-prose").val()
        },
        success:function(json) {
          show_info_notification("Your feedback was submitted to this site's owner", "Feedback sent");
          
          $("#eufsr-subject").val("");
          $("#eufsr-prose").val("");
          $(".fstar").removeClass("fstar");
          $("#eufsr-wrap div").html("&#9734;");
          eufsr__rating_flg = false;
          eufsr__subject_flg = false;
          eufsr__prose_flg = false;
          $(e.target).addClass("l--a-f-f_disable");
          
          $(e.target).closest(".explore-listing-section").find(".library-site-feedback button").remove();
          $(e.target).closest(".explore-listing-section").find(".library-site-feedback").append("<p>Feedback is pending</p>");
          
          mobile_feedback_already_added.push(parseInt($(e.target).closest(".explore-listing-section").attr("data-sid")));
        },
        error:function(request, status, error) {          
          try {
            $.each(request.responseJSON, function(idx, data) {
              show_error_notification(data, "Oops!");
            }); 
          } catch(e) {
            show_error_notification(request.responseJSON, "Oops!");
          }
          $("#eufsr-subject").val("");
          $("#eufsr-prose").val("");
          $(".fstar").removeClass("fstar");
          $("#eufsr-wrap div").html("&#9734;");
          eufsr__rating_flg = false;
          eufsr__subject_flg = false;
          eufsr__prose_flg = false;
          $(e.target).addClass("l--a-f-f_disable");
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
  
  
  $("#refresh-sites").click(() => {
    window.location.replace(window.location.href);
  });
  
  $(window).scroll(() => {
    // check for seen chunks
    if(window.innerWidth<=1000) {
      // parse mobile array - keep track of desktop
      $.each(unseen_chunks_m, function(idx, data) {
        if($(data[7]).visible() && showings_request) {
          // send metric request and remove array from both desktop and mobile
          //data-sid
          showings_request = false;
          $.ajax({
            method: "POST",
            url: m0_url,
            data: {
              site_id_1:$(data[0]).attr("data-sid"),
              site_id_2:$(data[1]).attr("data-sid"),
              site_id_3:$(data[2]).attr("data-sid"),
              site_id_4:$(data[3]).attr("data-sid"),
              site_id_5:$(data[4]).attr("data-sid"),
              site_id_6:$(data[5]).attr("data-sid"),
              site_id_7:$(data[6]).attr("data-sid"),
              site_id_8:$(data[7]).attr("data-sid")
            },
            success:function(json) {
              unseen_chunks_m.splice(idx,1);
              unseen_chunks_d.splice(idx,1);
              console.log(unseen_chunks_d);
              console.log(unseen_chunks_m);
              showings_request = true;
            },
            error:function(request, status, error) {
              console.log(request.status);
              showings_request = true;
            }
          });
        }
      });
    } else {
      // parse desktop array - keep track of mobile
      $.each(unseen_chunks_d, function(idx, data) {
        if($(data[7]).visible() && showings_request) {
          // send metric request and remove array from both desktop and mobile
          //data-sid
          showings_request = false;
          $.ajax({
            method: "POST",
            url: m0_url,
            data: {
              site_id_1:$(data[0]).attr("data-sid"),
              site_id_2:$(data[1]).attr("data-sid"),
              site_id_3:$(data[2]).attr("data-sid"),
              site_id_4:$(data[3]).attr("data-sid"),
              site_id_5:$(data[4]).attr("data-sid"),
              site_id_6:$(data[5]).attr("data-sid"),
              site_id_7:$(data[6]).attr("data-sid"),
              site_id_8:$(data[7]).attr("data-sid")
            },
            success:function(json) {
              unseen_chunks_m.splice(idx,1);
              unseen_chunks_d.splice(idx,1);
              console.log(unseen_chunks_d);
              console.log(unseen_chunks_m);
              showings_request = true;
            },
            error:function(request, status, error) {
              console.log(request.status);
              showings_request = true;
            }
          });
        }
      });
    }
  });
  
  
  $(window).resize(() => {
    let right = ((128 - $(".mobile-library-section").width())/2)-0.23;
    proper_logo_width = ($(".mobile-library-section").width() * 0.8) / dynamic_generated_logo_size;
    $("[data-mgen]").css({
      "-webkit-transform" : "scale(" + proper_logo_width + ")",
      "-moz-transform"    : "scale(" + proper_logo_width + ")",
      "-ms-transform"     : "scale(" + proper_logo_width + ")",
      "-o-transform"      : "scale(" + proper_logo_width + ")",
      "transform"         : "scale(" + proper_logo_width + ")",
      "right"             : right
    });
  });
  
  
  $.each($("input[type='text']"), function(idx, data) {
    Enforcer(data);
  });
  $.each($("textarea"), function(idx, data) {
    Enforcer(data);
  });

});
