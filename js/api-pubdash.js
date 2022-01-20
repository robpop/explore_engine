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
}

function fdate(date) {
  //MM/DD/YYY
  let itemized_date = date.split("-");
  return itemized_date[1]+"/"+itemized_date[2]+"/"+itemized_date[0]
}

function cdt() {
  let dt = new Date();
  return dt.getTime();
}

function update_avg_rating(tot, cnt) {
  let avg = tot/cnt;
  for(let i=0; i<5; ++i) {
    $("#pub-userfeedback_average-rating-display").children().eq(i).html("&#9734;");
  }
  for(let i=0; i<Math.round(avg); ++i) {
    $("#pub-userfeedback_average-rating-display").children().eq(i).html("&#9733;");
  }
  $("#pub-userfeedback_average-rating p").text("("+avg.toFixed(1)+"/5 avg)");
}

function c(element) {
  let $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

// function to compare sites
function cmps(st, sn, m298_url) {
  let pubdash_compare_dummy = $(".pubdash-compare-dummy");
  if(sn) {
    // site name is not blank - is different site
    if (st && $("#pubdash-load-cmpsites").length) {
      const m297_url = "http://"+window.location.hostname+":"+window.location.port+"/api/daily-metrics/random/";
      let cele;
      
      $(".pcm-itm").remove();
      
      $.ajax({
        method: "GET",
        url: m297_url,
        data: {
          nocache: cdt()
        },
        success:function(json) {
          // if no data exists for yesterday i.e. sites = 0
          if(json.count > 0) {
            let rlength = json.results.length;
            for(let i=0; i<rlength; ++i) {
              let data = json.results[i];              
              if(data.site_name != sn) {
                cele = pubdash_compare_dummy.clone(true, true);
                
                $(cele).children().eq(0).text(data.site_name);
                $(cele).children().eq(1).text(data.showings);
                $(cele).children().eq(2).text(data.views);
                $(cele).children().eq(3).text(data.clicks);
                $(cele).children().eq(4).text(data.saves);
                
                $($(cele).removeClass("pubdash-compare-dummy").addClass("pcm-itm")).appendTo("#pa-compare-counters-table");
              }
            }
          } else {
            // hide the statistic for your site
            $("#pa-compare-counters-table").css("display", "none");
            $("#pub-compare-nodata").css("display", "flex");
          }
          
        },
        error:function(request, status, error) {
          $("#pa-compare-counters-table").css("display", "none");
          $("#pub-compare-nodata").css("display", "flex");
        }
      });
    }
  } else {
    // the site name is blank because it is yours
    $.ajax({
      method:"GET",
      url:m298_url,
      data: {
        nocache: cdt()
      },
      success:function(json) {
        cmps(st, json.site_name, m298_url);
      },
      error:function(request, status, error) {
        console.log(error);
      }
    });
  }
}

$(() => {
  
  let fid = (window.location.href).split('/');
  for(let i=fid.length;i>=0;i--) {
    if (fid[i] !== "" && !isNaN(fid[i])) {
      fid = fid[i];
      break;
    }
  }
  
  const m291_url = "http://"+window.location.hostname+":"+window.location.port+"/api/daily-metrics/site/"+fid+"/";
  const m298_url = "http://"+window.location.hostname+":"+window.location.port+"/api/metrics/site/"+fid+"/";
  const m133_url = "http://"+window.location.hostname+":"+window.location.port+"/api/pubdash-feedback/unsaved/site/"+fid+"/";
  const m134_url = "http://"+window.location.hostname+":"+window.location.port+"/api/pubdash-feedback/saved/site/"+fid+"/";
  const m135_url = "http://"+window.location.hostname+":"+window.location.port+"/api/sites/"+fid+"/";
  const m019_url = "http://"+window.location.hostname+":"+window.location.port+"/api/is-2fa-enabled/";
  const m666_url = "http://"+window.location.hostname+":"+window.location.port+"/api/pubdash/delete-site/"+fid+"/";
  const m301_url = "http://"+window.location.hostname+":"+window.location.port+"/api/pubdash/site-change-status/"+fid+"/";
  const m408_url = "http://"+window.location.hostname+":"+window.location.port+"/api/pubdash/toggle-verification-method/site/"+fid+"/";
  
  const apit = "apitoken";
  
  const verify_dns_instructions = "To verify ownership of your site with a DNS TXT record, you will need administrative access to your domain's DNS control panel. If you are having trouble locating the DNS control panel for your domain, please ask your hosting provider for assistance. Once you have access to your domain's DNS records, create a new TXT record with the text above. After you have saved the record, you can verify ownership with the button below. If verification fails at first, please wait and try again. DNS records may take up to 48 hours to propogate.";
  const verify_meta_instructions = "To add the meta tag to your site's homepage, open the homepage HTML file using an editor. If you use a web-based service to manage your site, open your homepage in their online editor. Paste the above meta tag into your homepage HTML file between the <head> and </head> tags near the top of the page. If you need more help, ask your hosting provider's technical support team. After you have added the meta tag, you can verify ownership with the button below.";
  
  let site_name = null;
  
  let showings__series = [];
  let views__series = [];
  let clicks__series = [];
  let saves__series = [];
  
  let fele;
  
  let pubdash_load_cmpsites = document.getElementById("pubdash-load-cmpsites");
  
  let pd__m0 = document.getElementsByClassName("pd__m0");
  let pd__m1 = document.getElementsByClassName("pd__m1");
  let pd__m2 = document.getElementsByClassName("pd__m2");
  let pd__m3 = document.getElementsByClassName("pd__m3");
  
  let cd__m0 = document.getElementsByClassName("cd__m0");
  let cd__m1 = document.getElementsByClassName("cd__m1");
  let cd__m2 = document.getElementsByClassName("cd__m2");
  let cd__m3 = document.getElementsByClassName("cd__m3");
  
  let pub_userfeedback_nofeedback_saved = document.getElementById("pub-userfeedback-nofeedback-saved");
  let pub_userfeedback_nofeedback = document.getElementById("pub-userfeedback-nofeedback");
  
  let pubdash_compare_yoursite = document.getElementById("pubdash-compare-yoursite");
  let pubdash_delete_site = document.getElementById("pubdash-delete-site");
  
  let pubdash_feedback_dummy = $(".pubdash-feedback-dummy");
  let pubdash_feedback_saved_dummy = $(".pubdash-feedback-saved-dummy");
  
  let fmt__0="0a";
  let fmt__1="0a";
  let fmt__2="0a";
  let fmt__3="0a";
  
  let o_fmt__0="0a";
  let o_fmt__1="0a";
  let o_fmt__2="0a";
  let o_fmt__3="0a";
  
  let delete_site__require2fa = true;
  let delete_site__has2fatoken = false;
  let delete_site__validpassword = false;
  
  const mill = 999999;
  
  const not_verified_text = "Unverified";
  const verified_text = "Verified";
  const not_active = "Site under review";
  const is_active = "Active";
  const pending_verification = "Not active";
  
  $.Lazy('sitecard_loader', function(element, response) {
      element.addClass("loaded");
      response(true);
  });
    
  let st = Cookies.get(apit);
  if(st) {
    
    $.ajax({
      method: "GET",
      url: m019_url,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        if(!json) {
          // doesn't have 2fa
          $("#pub-delete-site-input-2fa").remove();
          $("#pub-delete-site-input-2fa_label").remove();
          delete_site__require2fa = false;
        }
      },
      // should never occur
      error:function(request, status, error) {
        console.log(error);
      }
    });
    
    
    // pubdash-dashboard
    $.ajax({
      method:"GET",
      url: m135_url,
      data: {
        nocache: cdt()
      },
      success:function(json) {
        console.log(json);
        if(json) {
          
          // load dynamic logo
          // pamf-media-display-logo_generate
          $(".pamf-media-display-logo_generate--wrapper").show();
          setTimeout(() => {
            generate(document.getElementById("pamf-media-display-logo_generate"), json.url);
          },0);
          if(json.logo) {
            setURL(json.logo);
          }
          
          $(".pub-analytics-categories-array p").text(json.category);
          $(".pash-lastmod").find("span").text(json.updated.substring(0,json.updated.indexOf("T")));
          if(!json.updatable) {
            $("#pub-update-site-details__btn").addClass("l--a-f-f_disable");
            $("#pub-update-site-details__btn").remove();
            $("#pub-analytics-modify-form").css({
              "pointer-events": "none",
              "opacity": "0.5"
            });
          }
          if(json.active) $("#pubdash-active-status_cnt").text(is_active);
          else $("#pubdash-active-status_cnt").text(not_active);
          if(!json.verified) {
            $("#pubdash-verified-status_cnt").text(not_verified_text);
            $("#pubdash-active-status_cnt").text(pending_verification);
            // make a call to get verification code
            /*

            /api/pubdash/verify-site/id-here/ - GET
            	GET:
            		Description: Attempts to verify ownership of a given site using the associated verification information
            		URL Parameters: site-id
            		Fields: None
            		Note:
            			DNS verification does not work yet.
            			Otherwise, always succeeds for development purposes.
            			Not to be used for free site claims, use claim verify endpoint instead.
            			This endpoint uses API credits.
            			This endpoint relies upon an external API, so it may take a while to respond.
            
            */
            const verify_code = "http://"+window.location.hostname+":"+window.location.port+"/api/pubdash/site-verification-info/"+fid+"/";
            $.ajax({
              method: "GET",
              url: verify_code,
              headers: {
                "Authorization" : "Token "+""+st
              },
              data: {
                nocache: cdt()
              },
              success:function(json) {
                if(json.method) {
                  // DNS
                  const dns_record = "DNS TXT Record";
                  $("#pubdash-verifysite_method").text(dns_record);
                  $("#pubdash-verifysite_instructions").text(verify_dns_instructions);
                  $("#pubdash-verify-method__dns-input span").text(json.code);
                  $("#pubdash-verify-method__dns-input").show();
                  $("#pubdash-toggle-verification_method").text("Use meta tag");
                } else {
                  // meta tag
                  const meta_tag = "Meta Tag";
                  $("#pubdash-verifysite_method").text(meta_tag);
                  $("#pubdash-verifysite_instructions").text(verify_meta_instructions);
                  $("#pubdash-verify-method__meta-input span").text(json.code);
                  $("#pubdash-verify-method__meta-input").show();
                  $("#pubdash-toggle-verification_method").text("Use DNS record");
                }
                
                $(".pubdash-verify__copy").click((e) => {
                  let main_obj = $(e.target).closest(".pubdash-verify__copy");
                  let prev_text = $(main_obj).text();
                  c(main_obj);
                  $(main_obj).text("Copied!");
                  setTimeout(() => {
                    $(main_obj).text(prev_text);
                  },2000);
                });
                $("#pubdash-verifysite_verify").click(() => {
                  $("#pubdash-toggle-verification_method").hide();
                  $("#pub-delete-site-wrapper").hide();
                  $(".verifysite-progress-loader").css("visibility", "visible");
                  $("#pubdash-verifysite_verify").addClass("l--a-f-f_disable");
                  const attempt_verification = "http://"+window.location.hostname+":"+window.location.port+"/api/pubdash/verify-site/"+fid+"/";
                  $.ajax({
                    method: "GET",
                    url: attempt_verification,
                    headers: {
                      "Authorization" : "Token "+""+st
                    },
                    success: function(json) {
                      if(json) {
                        // reload page
                        window.location.reload();
                      }
                    },
                    error: function(request, status, error) {
                      try {
                        $.each(request.responseJSON, function(idx, data) {
                          show_error_notification(data, "Oops!");
                        }); 
                      } catch(e) {
                        show_error_notification(request.responseJSON, "Oops!");
                      }
                      $("#pubdash-toggle-verification_method").show();
                      $("#pub-delete-site-wrapper").show();
                      $(".verifysite-progress-loader").css("visibility", "hidden");
                      $("#pubdash-verifysite_verify").removeClass("l--a-f-f_disable");
                    }
                  });
                });
                $("#pubdash-dashboard").remove();
                $("#pubdash-verifysite").show();
                $("#pub-delete-site-wrapper").css("display", "flex");
              },
              error:function(request, status, error) {
                show_sys_error_notification();
              }
            });
          } else {
            $("#pubdash-verified-status_cnt").text(verified_text);      
            $.ajax({
              method:"GET",
              url:m291_url,
              data: {
                nocache: cdt()
              },
              success:function(json) {
                console.log(json);
                if(json.length > 0) {
                  for(let i=0;i<json.length;++i) {
                    if(i==json.length-1) {
                      fmt__0 = (json[i].showings > mill ? "0.0a" : "0a");
                      fmt__1 = (json[i].views > mill ? "0.0a" : "0a");
                      fmt__2 = (json[i].clicks > mill ? "0.0a" : "0a");
                      fmt__3 = (json[i].saves > mill ? "0.0a" : "0a");
                      $(pd__m0).text(numeral(json[i].showings).format(fmt__0));
                      $(pd__m1).text(numeral(json[i].views).format(fmt__1));
                      $(pd__m2).text(numeral(json[i].clicks).format(fmt__2));
                      $(pd__m3).text(numeral(json[i].saves).format(fmt__3));
                    }
                    if(i==json.length-2) {
                      // yesterday's metrics
                      //console.log(json[i]);
                      $(pubdash_compare_yoursite).children().eq(0).text(json[i].site_name);
                      $(pubdash_compare_yoursite).children().eq(1).text(json[i].showings);
                      $(pubdash_compare_yoursite).children().eq(2).text(json[i].views);
                      $(pubdash_compare_yoursite).children().eq(3).text(json[i].clicks);
                      $(pubdash_compare_yoursite).children().eq(4).text(json[i].saves);
                    }
                    showings__series.push({x:fdate(json[i].date),y:json[i].showings});
                    views__series.push({x:fdate(json[i].date),y:json[i].views});
                    clicks__series.push({x:fdate(json[i].date),y:json[i].clicks});
                    saves__series.push({x:fdate(json[i].date),y:json[i].saves});
                  }
                } else {
                  $(pd__m0).text(0);
                  $(pd__m1).text(0);
                  $(pd__m2).text(0);
                  $(pd__m3).text(0);
                  $("#pa-compare-counters-table").css("display", "none");
                  $("#pub-compare-nodata").css("display", "flex");
                  $(pubdash_load_cmpsites).remove();
                }
              },
              error:function(request, status, error) {
                console.log(error);
              },
              complete:function(data) {
                setTimeout(() => {
                  let options = {
                    chart: {
                      type: 'area',
                      stacked: false,
                      height: 400,
                      zoom: {
                        type: 'x',
                        enabled: true,
                        autoScaleYaxis: true
                      },
                      toolbar: {
                        autoSelected: 'zoom'
                      }
                    },
                    animations: {
                      easing: 'easeout',
                      speed: 500,
                      animateGradually: {
                        delay: 50,
                      }
                    },
                    dataLabels: {
                      enabled: false
                    },
                    series: [{
                      name: 'Showings',
                      data: showings__series
                    },{
                      name: 'Views',
                      data: views__series
                    },{
                      name: 'Clicks',
                      data: clicks__series
                    },{
                      name: 'Saves',
                      data: saves__series
                    }],
                    colors: ['#3C6CC4', '#636972', '#3CC46C', '#C43C3C'],
                    markers: {
                      size: 0,
                      colors: ['#3C6CC4', '#636972', '#3CC46C', '#C43C3C'],
                    },
                    stroke: {
                      colors: ['#3C6CC4', '#636972', '#3CC46C', '#C43C3C'],
                    },
                    fill: {
                      colors: ['#3C6CC4', '#636972', '#3CC46C', '#C43C3C'],
                      type: 'gradient',
                      gradient: {
                        shadeIntensity: 0.3,
                        inverseColors: false,
                        opacityFrom: 0.35,
                        opacityTo: 0
                      },
                    },
                    legend: {
                      markers: {
                        fillColors: ['#3C6CC4', '#636972', '#3CC46C', '#C43C3C'],
                      },
                      position: 'top',
                      fontSize: '13px',
                      fontFamily: 'Oxygen-Light',
                    },
                    yaxis: {
                      labels: {
                        formatter: function (val) {
                          return val.toFixed(0);
                        },
                      },
                    },
                    xaxis: {
                      type: 'datetime',
                      labels: {
                        rotate: -25,
                        rotateAlways: true,
                      },
                    },
                    tooltip: {
                      shared: true,
                      style: {
                        fontFamily: 'Oxygen-Light'
                      },
                      y: {
                        formatter: function (val) {
                          return val
                        }
                      }
                    }
                  }

                  let chart = new ApexCharts(
                    document.querySelector("#pubdash-metric-chart"),
                    options
                  );
                  
                  // unwanted bits
                  $(".apexcharts-menu-icon").remove();

                  chart.render();
                },0);
              }
            });
                
            $.ajax({
              method:"GET",
              url:m298_url,
              data: {
                nocache: cdt()
              },
              success:function(json) {
                //console.log(json);
                o_fmt__0 = (json.showings > mill ? "0.0a" : "0a");
                o_fmt__1 = (json.views > mill ? "0.0a" : "0a");
                o_fmt__2 = (json.clicks > mill ? "0.0a" : "0a");
                o_fmt__3 = (json.saves > mill ? "0.0a" : "0a");
                site_name = json.site_name;
                $(cd__m0).text(numeral(json.showings).format(o_fmt__0));
                $(cd__m1).text(numeral(json.views).format(o_fmt__1));
                $(cd__m2).text(numeral(json.clicks).format(o_fmt__2));
                $(cd__m3).text(numeral(json.saves).format(o_fmt__3));
                cmps(st, site_name, m298_url);
              },
              error:function(request, status, error) {
                // show message for now site metrics
                // also populate today metrics and all time with 0
                $(cd__m0).text(0);
                $(cd__m1).text(0);
                $(cd__m2).text(0);
                $(cd__m3).text(0);
              }
            });
            
            // compare yesterday's metrics
            $(pubdash_load_cmpsites).click(() => {
              cmps(st, site_name, m298_url);
            });
            
            let average_site_rating = 0;
            let rating_count = 0;
            
            // grab user feedback
            $.ajax({
              method: "GET",
              url: m133_url,
              headers: {
                "Authorization" : "Token "+""+st
              },
              data: {
                nocache: cdt()
              },
              success:function(json) {
                console.log(json);
                if(json.count == 0) {
                  $(pub_userfeedback_nofeedback).css("display", "flex");
                } else {
                  let rlength = json.results.length;
                  for(let i=0; i<rlength; ++i) {
                    let data = json.results[i];
                    console.log(data);
                    fele = pubdash_feedback_dummy.clone(true, true);
                    
                    $(fele).find(".pubdash-feedback-header").children().eq(0).text(data.subject);
                    for(let i=0; i<data.rating; ++i) {
                      $($(fele).find(".pubdash-feedback-header").children().eq(1)).children().eq(i).html("&#9733;");
                    }
                    $(fele).find(".pubdash-feedback-timestamp").text(data.created.substring(0, data.created.indexOf("T")))
                    $(fele).find(".pubdash-feedback-message").text(data.message);
                    
                    $($(fele).removeClass("pubdash-feedback-dummy").addClass("pubdash-feedback-instance").attr("data-apiurl", data.api_url)).appendTo(".pub-uf-nf");
                    average_site_rating += data.rating;
                    rating_count++;
                  }
                }
              },
              error:function(request, status, error) {
                $(".notification-msg").css("display", "none");
                $(".notification-err p").text((request.responseText).replace(/"/g, ''));
                $(".notification-err").css("display", "block");
              },
              complete:function(data) {
                $.ajax({
                  method: "GET",
                  url: m134_url,
                  headers: {
                    "Authorization" : "Token "+""+st
                  },
                  data: {
                    nocache: cdt()
                  },
                  success:function(json) {
                    //console.log(json);
                    if(json.count !== 0) {
                      let rlength = json.results.length;
                      for(let i=0; i<rlength; ++i) {
                        let data = json.results[i];
                        console.log(data);
                        fele = pubdash_feedback_saved_dummy.clone(true, true);
                        
                        $(fele).find(".pubdash-feedback-header").children().eq(0).text(data.subject);
                        for(let i=0; i<data.rating; ++i) {
                          $($(fele).find(".pubdash-feedback-header").children().eq(1)).children().eq(i).html("&#9733;");
                        }
                        $(fele).find(".pubdash-feedback-timestamp").text(data.created.substring(0, data.created.indexOf("T")))
                        $(fele).find(".pubdash-feedback-message").text(data.message);
                        
                        $($(fele).removeClass("pubdash-feedback-saved-dummy").addClass("pubdash-feedback-instance").attr("data-apiurl", data.api_url)).appendTo(".pub-uf-sf");
                        average_site_rating += data.rating;
                        rating_count++;
                      }
                    }
                  },
                  error:function(request, status, error) {
                    $(".notification-msg").css("display", "none");
                    $(".notification-err p").text((request.responseText).replace(/"/g, ''));
                    $(".notification-err").css("display", "block");
                  },
                  complete:function(data) {
                    update_avg_rating(average_site_rating, rating_count);
                    $('.lazy').Lazy({
                      afterLoad: function(element) {
                        console.log(element);
                      },
                    });
                  }
                });
              }
            });
            $("#pubdash-verifysite").remove();
            $("#pubdash-dashboard").show();
            $("#pub-delete-site-wrapper").css("display", "flex");
          }
        }
      },
      error:function(request, status, error) {
        show_sys_error_notification();
      },
      complete:function(data) {
        window.scrollTo(0,0);
      }
    });
    
    
    $("#pub-delete-site-input-password").keyup((e) => {
      if($(e.target).val().length >= 8) delete_site__validpassword = true;
      else delete_site__validpassword = false;
      if(delete_site__validpassword) {
        if(delete_site__require2fa) {
          if(delete_site__has2fatoken) {
            $(pubdash_delete_site).removeClass("l--a-f-f_disable");
          } else {
            $(pubdash_delete_site).addClass("l--a-f-f_disable");
          }
        } else {
          $(pubdash_delete_site).removeClass("l--a-f-f_disable");
        }
      } else {
        $(pubdash_delete_site).addClass("l--a-f-f_disable");
      }
      
    });
    
    $("#pub-delete-site-input-2fa").keyup((e) => {
      if($(e.target).val().length === 6 && $.isNumeric($(e.target).val())) {
        delete_site__has2fatoken = true;
      } else {
        delete_site__has2fatoken = false;
      }
      if(delete_site__validpassword) {
        if(delete_site__require2fa) {
          if(delete_site__has2fatoken) {
            $(pubdash_delete_site).removeClass("l--a-f-f_disable");
          } else {
            $(pubdash_delete_site).addClass("l--a-f-f_disable");
          }
        } else {
          $(pubdash_delete_site).removeClass("l--a-f-f_disable");
        }
      } else {
        $(pubdash_delete_site).addClass("l--a-f-f_disable");
      }
    });
    
    // delete Stripe subscription
    $(pubdash_delete_site).click(() => {
      if(delete_site__validpassword && $("#pub-delete-site-input-reason_optional").val().length <= 256) {
        if(delete_site__require2fa) {
          if(delete_site__has2fatoken) {
            $(".verifysite-progress-loader").css("visibility", "visible");
            $(pubdash_delete_site).addClass("l--a-f-f_disable");
            // delete site with 2fa
            $("#pubdash-verifysite").hide();
            $("body").css({
              "pointer-events":"none",
              "opacity":"0.85"
            });
            $(".delete-site-loader").css("visibility", "visible");
            $.ajax({
              method: "DELETE",
              url: m666_url,
              headers: {
                "Authorization" : "Token "+""+st
              },
              data: {
                password: $("#pub-delete-site-input-password").val(),
                token: $("#pub-delete-site-input-2fa").val(),
                notes: $("#pub-delete-site-input-reason_optional").val(),
                reason: $("#pub-delete-site-input-reason").find(":selected").val()
              },
              success:function(json) {
                window.location.href = "/publish/";
              },
              error:function(request, status, error) {
                $(".verifysite-progress-loader").css("visibility", "hidden");
                $(pubdash_delete_site).removeClass("l--a-f-f_disable");
                try {
                  $.each(request.responseJSON, function(idx, data) {
                    show_error_notification(data, "Oops!");
                  }); 
                } catch(e) {
                  show_error_notification(request.responseJSON, "Oops!");
                }
                $("#pubdash-verifysite").show();
                $("body").css({
                  "pointer-events":"auto",
                  "opacity":"1"
                });
                $(".delete-site-loader").css("visibility", "hidden");
              }
            });
          } else {
            $(pubdash_delete_site).addClass("l--a-f-f_disable");
          }
        } else {
          $(".verifysite-progress-loader").css("visibility", "visible");
          $(pubdash_delete_site).addClass("l--a-f-f_disable");
          // delete site without 2fa
          $("#pubdash-verifysite").hide();
          $("body").css({
            "pointer-events":"none",
            "opacity":"0.85"
          });
          $(".delete-site-loader").css("visibility", "visible");
          $.ajax({
            method: "DELETE",
            url: m666_url,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              password: $("#pub-delete-site-input-password").val(),
              notes: $("#pub-delete-site-input-reason_optional").val(),
              reason: $("#pub-delete-site-input-reason").find(":selected").val()
            },
            success:function(json) {
              window.location.href = "/publish/";
            },
            error:function(request, status, error) {
              $(".verifysite-progress-loader").css("visibility", "hidden");
              $(pubdash_delete_site).removeClass("l--a-f-f_disable");
              try {
                $.each(request.responseJSON, function(idx, data) {
                  show_error_notification(data, "Oops!");
                }); 
              } catch(e) {
                show_error_notification(request.responseJSON, "Oops!");
              }
              $("#pubdash-verifysite").show();
              $("body").css({
                "pointer-events":"auto",
                "opacity":"1"
              });
              $(".delete-site-loader").css("visibility", "hidden");
            }
          });
        }
      } else {
        $(pubdash_delete_site).addClass("l--a-f-f_disable");
      }
    });
    
    $(".pub-userfeedback-toggle-func-fcs").click(() => {
      $.ajax({
        method: "GET",
        url: m133_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          console.log("USER FEEDBACK");
          console.log(json);
          $("#pub-userfeedback-nofeedback-saved").hide();
          $(".pubdash-feedback-instance").remove();
          if(json.count == 0) {
            $("#pub-userfeedback-nofeedback").css("display", "flex");
          } else {
            let rlength = json.results.length;
            for(let i=0; i<rlength; ++i) {
              let data = json.results[i];              
              console.log(data);
              fele = pubdash_feedback_dummy.clone(true, true);
              
              $(fele).find(".pubdash-feedback-header").children().eq(0).text(data.subject);
              for(let i=0; i<data.rating; ++i) {
                $($(fele).find(".pubdash-feedback-header").children().eq(1)).children().eq(i).html("&#9733;");
              }
              $(fele).find(".pubdash-feedback-timestamp").text(data.created.substring(0, data.created.indexOf("T")))
              $(fele).find(".pubdash-feedback-message").text(data.message);
              
              $($(fele).removeClass("pubdash-feedback-dummy").addClass("pubdash-feedback-instance").attr("data-apiurl", data.api_url)).appendTo(".pub-uf-nf");
            }
          }
        },
        error:function(request, status, error) {}
      });
    });
    
    $(".pub-userfeedback-toggle-func-nfcs").click(() => {
      $.ajax({
        method: "GET",
        url: m134_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          console.log(json);
          $("#pub-userfeedback-nofeedback").hide();
          $(".pubdash-feedback-instance").remove();
          if(json.count == 0) {
            $("#pub-userfeedback-nofeedback-saved").css("display", "flex");
          } else {
            let rlength = json.results.length;
            for(let i=0; i<rlength; ++i) {
              let data = json.results[i];              
              console.log(data);
              fele = pubdash_feedback_saved_dummy.clone(true, true);
              
              $(fele).find(".pubdash-feedback-header").children().eq(0).text(data.subject);
              for(let i=0; i<data.rating; ++i) {
                $($(fele).find(".pubdash-feedback-header").children().eq(1)).children().eq(i).html("&#9733;");
              }
              $(fele).find(".pubdash-feedback-timestamp").text(data.created.substring(0, data.created.indexOf("T")))
              $(fele).find(".pubdash-feedback-message").text(data.message);
              
              $($(fele).removeClass("pubdash-feedback-saved-dummy").addClass("pubdash-feedback-instance").attr("data-apiurl", data.api_url)).appendTo(".pub-uf-sf");
            }
          }
        },
        error:function(request, status, error) {
          $(".notification-msg").css("display", "none");
          $(".notification-err p").text((request.responseText).replace(/"/g, ''));
          $(".notification-err").css("display", "block");
        }
      });
    });
    
    
    $(".pamf-media-display-full--logo-usedefault").click(() => {
      $("#pamf-media-display-logo_generate").css("opacity", "1");
      $(".pamf-media-display-full--logo-text").css("display", "block");
      $(".pamf-media-display-full--logo-usedefault").css("display", "none");
      $('.pamf-media-display-logo img').css({
        "width":"0px",
        "height":"0px"
      });
      $(".pamf-media-display-logo img").attr("src", "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=");
      $(".pamf-media-display-logo span").css("display","inline");
      $("#id_logo").val("");
    });
    
    
    // save and delete feedback
    $(".pubdash-feedback__save").click((e) => {
      let api_url = $(e.target).closest(".pubdash-feedback-instance").attr("data-apiurl");
      $.ajax({
        method: "PATCH",
        url: api_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        success:function(json) {
          console.log(json);
          $(".pubdash-feedback-instance").remove();
          $.ajax({
            method: "GET",
            url: m133_url,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              if(json.count == 0) {
                $(pub_userfeedback_nofeedback).css("display", "flex");
              } else {
                let rlength = json.results.length;
                for(let i=0; i<rlength; ++i) {
                  let data = json.results[i];
                  console.log(data);
                  fele = pubdash_feedback_dummy.clone(true, true);
                  
                  $(fele).find(".pubdash-feedback-header").children().eq(0).text(data.subject);
                  for(let i=0; i<data.rating; ++i) {
                    $($(fele).find(".pubdash-feedback-header").children().eq(1)).children().eq(i).html("&#9733;");
                  }
                  $(fele).find(".pubdash-feedback-timestamp").text(data.created.substring(0, data.created.indexOf("T")))
                  $(fele).find(".pubdash-feedback-message").text(data.message);
                  
                  $($(fele).removeClass("pubdash-feedback-dummy").addClass("pubdash-feedback-instance").attr("data-apiurl", data.api_url)).appendTo(".pub-uf-nf");
                }
              }
            },
            error:function(request, status, error) {
              $(".notification-msg").css("display", "none");
              $(".notification-err p").text((request.responseText).replace(/"/g, ''));
              $(".notification-err").css("display", "block");
            }
          });
        },
        error:function(request, status, error) {
          console.log(request.status+" "+error);
        }
      });
    });
    
    $(".pubdash-feedback__delete").click((e) => {
      let api_url = $(e.target).closest(".pubdash-feedback-instance").attr("data-apiurl");
      $.ajax({
        method: "PATCH",
        url: api_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        success:function(json) {
          console.log(json);
          $(".pubdash-feedback-instance").remove();
          $.ajax({
            method: "GET",
            url: m134_url,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              if(json.count == 0) {
                $(pub_userfeedback_nofeedback_saved).css("display", "flex");
              } else {
                let rlength = json.results.length;
                for(let i=0; i<rlength; ++i) {
                  let data = json.results[i];                  
                  console.log(data);
                  fele = pubdash_feedback_saved_dummy.clone(true, true);
                  
                  $(fele).find(".pubdash-feedback-header").children().eq(0).text(data.subject);
                  for(let i=0; i<data.rating; ++i) {
                    $($(fele).find(".pubdash-feedback-header").children().eq(1)).children().eq(i).html("&#9733;");
                  }
                  $(fele).find(".pubdash-feedback-timestamp").text(data.created.substring(0, data.created.indexOf("T")))
                  $(fele).find(".pubdash-feedback-message").text(data.message);
                  
                  $($(fele).removeClass("pubdash-feedback-saved-dummy").addClass("pubdash-feedback-instance").attr("data-apiurl", data.api_url)).appendTo(".pub-uf-sf");
                }
              }
            },
            error:function(request, status, error) {
              $(".notification-msg").css("display", "none");
              $(".notification-err p").text((request.responseText).replace(/"/g, ''));
              $(".notification-err").css("display", "block");
            }
          });
        },
        error:function(request, status, error) {
          console.log(request.status+" "+error);
        }
      });
    });
    
    
    
    /*
    
    m301_url
    /api/pubdash/site-change-status/id-here/ - GET
        GET:
            Description: Returns a pending site change object for a given site if it exists.
            URL Parameters: site-id
            Fields: None
            Notes: Returns a friendly message if no site changes are pending.
    
    */
    // look for pending change requests and fill site change form with pending data
    $.ajax({
      method: "GET",
      url: m301_url,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        console.log(json);
        if(json.id) {
          $("#pubdash-site-change_status").show();
          $("#pubdash-changes-status_cnt").text("Under review");
          $(".pub-analytics-modify-form-mbtm").val(json.new_name);
          $(".pubdash-details-description-group textarea").val(json.new_description);
          if(json.new_logo) {
            setURL(json.new_logo);
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
          $("#pubdash-site-change_status").remove();
        }
      },
      error:function(request, status, error) {
        console.log(request.status);
      }
    });
    
    
    $("#pubdash-toggle-verification_method").click(() => {
      
      $.ajax({
        method: "GET",
        url: m408_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          if(json) {
            window.location.reload();
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
    });
    
  }
});