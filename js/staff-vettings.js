"use strict";

function cdt() {
  let dt = new Date();
  return dt.getTime();
}

function assign_object(sid) {
  $('body').css({
    "pointer-events":"none",
    "opacity":0.5
  });
  const apit = "apitoken";
  let st = Cookies.get(apit);
  const s_022 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/"+sid+"/";
  const m173_url = "http://"+window.location.hostname+":"+window.location.port+"/api/account/";
  $.ajax({
    method: "GET",
    url: m173_url,
    headers: {
      "Authorization" : "Token "+""+st
    },
    data: {
      nocache: cdt()
    },
    success:function(json) {
      //console.log(json);
      let __username = json.username;
      let __uid = json.id;
      
      $.ajax({
        method: "PATCH",
        url: s_022,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          assigned: true,
          staff: __uid,
          staff_username: __username,      
        },
        success:function(json) {
          console.log(json);
          // update fields in vetting object on screen
          window.location.reload();
        },
        error:function(request, status, error) {
          alert(request.status);
          $('body').css({
            "pointer-events":"auto",
            "opacity":1
          });
        }
      });
      
    },
    error:function(request, status, error) {
      alert(request.status);
      $('body').css({
        "pointer-events":"auto",
        "opacity":1
      });
    }
  });
  

  /*
  
  /api/staff/vettings/id-here/ - GET/PUT/PATCH
    GET:
      Description: Returns a specific vetting instance.
      URL Parameters: vetting-id
      Fields: None
      Note: Staff usage only.
    PATCH:
      Description: Update a portion of an existing vetting instance
      URL Parameters: vetting-id
      Fields: ‘assigned’, ‘staff’, ‘decision’, ‘notes’ (see PUT for field formats)
          Note: 
              Staff usage only.
              Only to be used for partial updates to a vetting object,
              such as when assigning yourself, or requesting a second opinion from another staff member.
  
  */
  
  
}

function curate_message(ele, m_arr) {
  console.log(m_arr);
  $(ele).val('');
  let message = "";
  $.each(m_arr, function(idx, data){
    message += data;
  });
  $(ele).val(message);
}

function toggleView(v) {
  $("#__ssv-sitelist").hide();
  $("#__ssv-sitelist__free").hide();
  $("#__ssv-sitelist__opinion").hide();
  $("#__ssv-sitelist__assigned").hide();
  $("#__ssv-sitelist__opinion_free").hide();
  $(".__ssv-site__instance").remove();
  $(".__ssv-prev__instance").remove();
  
  $(v).show();
}

$(() => {
  const apit = "apitoken";
  let st = Cookies.get(apit);
  const s_020 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/queue/paid/";
  
  const dont__msg0 = "- Displays excessive advertising\n";
  const dont__msg1 = "- Is an informational and/or local business site\n";
  const dont__msg2 = "- Provided inaccurate site information\n";
  const dont__msg3 = "- Is malware and/or other malicious content\n";
  const dont__msg4 = "- Displays illegal or violent content\n";
  const dont__msg5 = "- Displays sexual assault and/or exploitation\n";
  const dont__msg6 = "- Displays sexual or suggestive content involving minors\n";
  const dont__msg7 = "- Displays hate speech, threats, harassment, or bullying\n";
  const dont__msg8 = "- Exposes personal and/or confidential information\n";
  const dont__msg9 = "- Displays excessively obscene content\n";
  const dont__msg10 = "- Is a multi-level marketing site, scam, and/or other deceitful content\n";
  const dont__msg11 = "- Intellectual property violations\n";
  const do__msg0 = "- Is not original and engaging content\n";
  const do__msg1 = "- Does not have an English translation\n";
  const do__msg2 = "- Is not mobile friendly\n";
  const do__msg3 = "- Has poor accessibility\n";
  const do__msg4 = "- Does not follow enough best practices\n";
  const do__msg5 = "- Lacks compatibility with Chrome and/or Firefox\n";
  const apivoid__failure = "- We cannot trust your site\n";
  
  const dyn_logo_msg = "Logo is dynamically generated";
  
  const nan = "NaN";
  const not_made = "Not made";
  
  $("#__ssv-actions__paid").click(() => {
    if(st) {
      $.ajax({
        method: "GET",
        url: s_020,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          toggleView(document.getElementById("__ssv-sitelist"));
          $.each(json.results, function(idx, data){
            console.log(data);
            let vetting_object = $(".__ssv_sitelist_dummy").clone(true, true);
            $(vetting_object).find(".__ssv__inst-siteurl").find("span").text(data.url);
            if(data.assigned) {
              $(vetting_object).find(".__ssv__inst-assigned").find("span").text(data.assigned);
              $(vetting_object).find(".__ssv__inst-assignedstaff").find("span").text(data.staff);
              $(vetting_object).find(".__ssv__inst-assignedusername").find("span").text(data.staff_username);
            } else {
              $(vetting_object).find(".__ssv__inst-assigned").find("span").html("<button type='button' onclick='assign_object("+data.id+")'>Assign yourself</button>");
              $(vetting_object).find(".__ssv__inst-assignedstaff").find("span").text(nan);
              $(vetting_object).find(".__ssv__inst-assignedusername").find("span").text(nan);
            }
            $(vetting_object).find(".__ssv__inst-decision").find("span").text(data.decision);
            if(data.decision) {
              $(vetting_object).find(".__ssv__inst-decisiondate").find("span").text(data.decided_on);
            } else {
              $(vetting_object).find(".__ssv__inst-decisiondate").find("span").text(nan);
              $(vetting_object).find(".__ssv__inst-decision").find("span").text(not_made);
            }
            
            // check for previous submissions
            let s_021 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/"+data.id+"/related/";
            $.ajax({
              method: "GET",
              url: s_021,
              headers: {
                "Authorization" : "Token "+""+st
              },
              data: {
                nocache: cdt()
              },
              success:function(json) {
                if(json.count > 0) {
                  $.each(json.results, function(idx, data) {
                    console.log(data);
                    let prev_obj = $(vetting_object).find(".__ssv_sitelist__previous_dummy");
                    let previous_vetting_object = $(prev_obj).clone(true, true);
                    $(previous_vetting_object).find(".__ssv__inst-siteurl__previous").find("span").text(data.url);
                    $(previous_vetting_object).find(".__ssv__inst-assignedstaff__previous").find("span").text(data.staff);
                    $(previous_vetting_object).find(".__ssv__inst-assignedusername__previous").find("span").text(data.staff_username);
                    
                    $(previous_vetting_object).find(".__ssv__inst-decision__previous").find("span").text(data.decision);
                    
                    $(previous_vetting_object).find(".__ssv__inst-decisiondate__previous").find("span").text(data.decided_on);
                    
                    $(previous_vetting_object).find(".__ssv__inst-notes-reason__previous").find("span").text(data.notes);

                    $($(previous_vetting_object).removeAttr("class").addClass("__ssv-prev__instance")).appendTo(".__ssv-siteinstance_main__right h2");
                  });
                }
              },
              error:function(request, status, error) {
                console.log(request.status);
              }
            });
            
            
            $($(vetting_object).removeAttr("class").addClass("__ssv-site__instance")).appendTo("#__ssv-sitelist ul");
            
          });         
        },
        error:function(request, status, error) {
          console.log(error);
          console.log(request.status);
        }
      });
    }
  });
  
  
  $("#__ssv-actions__free").click(() => {
    toggleView(document.getElementById("__ssv-sitelist__free"));
    
    /*
    
    /api/staff/vettings/queue/free/ - GET
    	GET:
    		Description: Returns the current queue of free sites that require vetting.
    		URL Parameters: None
    		Fields: None
    		Note: Staff usage only.
        
    */
    const s_026 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/queue/free/";
    $.ajax({
      method: "GET",
      url: s_026,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        $.each(json.results, function(idx, data){
          console.log(data);
          let vetting_object = $(".__ssv_sitelist__free_dummy").clone(true, true);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").text(data.url);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").attr("href", data.url);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").attr("title", data.url);
          $(vetting_object).find(".__ssv__apivoid_scan").attr("data-sid", data.url);
          $(vetting_object).find(".__ssv__approve_site").attr("data-sid", data.id);
          $(vetting_object).find(".__ssv__deny_site").attr("data-sid", data.id);
          $(vetting_object).find(".__ssv__requestopinion_site").attr("data-sid", data.id);
          if(data.assigned) {
            $(vetting_object).find(".__ssv__inst-assigned").find("span").text(data.assigned);
            $(vetting_object).find(".__ssv__inst-assignedstaff").find("span").text(data.staff);
            $(vetting_object).find(".__ssv__inst-assignedusername").find("span").text(data.staff_username);
          } else {
            $(vetting_object).find(".__ssv__inst-assigned").find("span").html("<button type='button' onclick='assign_object("+data.id+")'>Assign yourself</button>");
            $(vetting_object).find(".__ssv__inst-assignedstaff").find("span").text(nan);
            $(vetting_object).find(".__ssv__inst-assignedusername").find("span").text(nan);
          }
          $(vetting_object).find(".__ssv__inst-decision").find("span").text(data.decision);
          if(data.decision) {
            $(vetting_object).find(".__ssv__inst-decisiondate").find("span").text(data.decided_on);
            $(vetting_object).find(".__ssv__approve_site").remove();
            $(vetting_object).find(".__ssv__deny_site").remove();
            $(vetting_object).find(".__ssv__requestopinion_site").remove();
          } else {
            $(vetting_object).find(".__ssv__inst-decisiondate").find("span").text(nan);
            $(vetting_object).find(".__ssv__inst-decision").find("span").text(not_made);
          }
          
          
          // check for previous submissions
          let s_021 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/"+data.id+"/related/";
          $.ajax({
            method: "GET",
            url: s_021,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              if(json.count > 0) {
                $.each(json.results, function(idx, data) {
                  console.log(data);
                  let prev_obj = $(vetting_object).find(".__ssv_sitelist__previous_dummy");
                  let previous_vetting_object = $(prev_obj).clone(true, true);
                  $(previous_vetting_object).find(".__ssv__inst-siteurl__previous").find("span").text(data.url);
                  $(previous_vetting_object).find(".__ssv__inst-assignedstaff__previous").find("span").text(data.staff);
                  $(previous_vetting_object).find(".__ssv__inst-assignedusername__previous").find("span").text(data.staff_username);
                  
                  $(previous_vetting_object).find(".__ssv__inst-decision__previous").find("span").text(data.decision);
                  
                  $(previous_vetting_object).find(".__ssv__inst-decisiondate__previous").find("span").text(data.decided_on);
                  
                  $(previous_vetting_object).find(".__ssv__inst-notes-reason__previous").find("span").text(data.notes);

                  $($(previous_vetting_object).removeAttr("class").addClass("__ssv-prev__instance")).appendTo(".__ssv-siteinstance_main__right h2");
                });
              }
            },
            error:function(request, status, error) {
              console.log(request.status);
            }
          });
          
          $($(vetting_object).removeAttr("class").addClass("__ssv-site__instance")).appendTo("#__ssv-sitelist__free ul");
        });
      },
      error:function(request, status, error) {
        console.log(request.status);
      }
    });
  });
  
  $("#__ssv-actions__opinion_free").click(() => {
    toggleView(document.getElementById("__ssv-sitelist__opinion_free"));
    
    /*
        

    /api/staff/vettings/queue/free/help/ - GET
      GET:
        Description: Returns the current queue of free sites that require a second opinion.
        URL Parameters: None
        Fields: None
        Note: Staff usage only.
        
        
    */
    const s_027 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/queue/free/help/";
    $.ajax({
      method: "GET",
      url: s_027,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        $.each(json.results, function(idx, data){
          console.log(data);
          let vetting_object = $(".__ssv_sitelist__opinion_free_dummy").clone(true, true);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").text(data.url);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").attr("href", data.url);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").attr("title", data.url);
          $(vetting_object).find(".__ssv__apivoid_scan").attr("data-sid", data.url);
          $(vetting_object).find(".__ssv__approve_site").attr("data-sid", data.id);
          $(vetting_object).find(".__ssv__deny_site").attr("data-sid", data.id);
          $(vetting_object).find(".__ssv__requestopinion_site").attr("data-sid", data.id);
          if(data.assigned) {
            $(vetting_object).find(".__ssv__inst-assigned").find("span").text(data.assigned);
            $(vetting_object).find(".__ssv__inst-assignedstaff").find("span").text(data.staff);
            $(vetting_object).find(".__ssv__inst-assignedusername").find("span").text(data.staff_username);
          } else {
            $(vetting_object).find(".__ssv__inst-assigned").find("span").html("<button type='button' onclick='assign_object("+data.id+")'>Assign yourself</button>");
            $(vetting_object).find(".__ssv__inst-assignedstaff").find("span").text(nan);
            $(vetting_object).find(".__ssv__inst-assignedusername").find("span").text(nan);
          }
          $(vetting_object).find(".__ssv__inst-decision").find("span").text(data.decision);
          if(data.decision) {
            $(vetting_object).find(".__ssv__inst-decisiondate").find("span").text(data.decided_on);
            $(vetting_object).find(".__ssv__approve_site").remove();
            $(vetting_object).find(".__ssv__deny_site").remove();
            $(vetting_object).find(".__ssv__requestopinion_site").remove();
          } else {
            $(vetting_object).find(".__ssv__inst-decisiondate").find("span").text(nan);
            $(vetting_object).find(".__ssv__inst-decision").find("span").text(not_made);
          }
          
          
          // check for previous submissions
          let s_021 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/"+data.id+"/related/";
          $.ajax({
            method: "GET",
            url: s_021,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              if(json.count > 0) {
                $.each(json.results, function(idx, data) {
                  console.log(data);
                  let prev_obj = $(vetting_object).find(".__ssv_sitelist__previous_dummy");
                  let previous_vetting_object = $(prev_obj).clone(true, true);
                  $(previous_vetting_object).find(".__ssv__inst-siteurl__previous").find("span").text(data.url);
                  $(previous_vetting_object).find(".__ssv__inst-assignedstaff__previous").find("span").text(data.staff);
                  $(previous_vetting_object).find(".__ssv__inst-assignedusername__previous").find("span").text(data.staff_username);
                  
                  $(previous_vetting_object).find(".__ssv__inst-decision__previous").find("span").text(data.decision);
                  
                  $(previous_vetting_object).find(".__ssv__inst-decisiondate__previous").find("span").text(data.decided_on);
                  
                  $(previous_vetting_object).find(".__ssv__inst-notes-reason__previous").find("span").text(data.notes);

                  $($(previous_vetting_object).removeAttr("class").addClass("__ssv-prev__instance")).appendTo(".__ssv-siteinstance_main__right h2");
                });
              }
            },
            error:function(request, status, error) {
              console.log(request.status);
            }
          });
          
          $($(vetting_object).removeAttr("class").addClass("__ssv-site__instance")).appendTo("#__ssv-sitelist__opinion_free ul");
        });
      },
      error:function(request, status, error) {
        console.log(request.status);
      }
    });
  });
  
  $("#__ssv-actions__opinion").click(() => {
    toggleView(document.getElementById("__ssv-sitelist__opinion"));
    /*
    
    
      /api/staff/vettings/queue/paid/help/ - GET
      	GET:
      		Description: Returns the current queue of paid sites that require a second opinion.
      		URL Parameters: None
      		Fields: None
      		Note: Staff usage only.
          
          
    
    */
    const s_025 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/queue/paid/help/";
    $.ajax({
      method: "GET",
      url: s_025,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        $.each(json.results, function(idx, data){
          console.log(data);
          let vetting_object = $(".__ssv_sitelist__opinion_dummy").clone(true, true);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").text(data.url);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").attr("href", data.url);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").attr("title", data.url);
          $(vetting_object).find(".__ssv__apivoid_scan").attr("data-sid", data.url);
          $(vetting_object).find(".__ssv__approve_site").attr("data-sid", data.id);
          $(vetting_object).find(".__ssv__deny_site").attr("data-sid", data.id);
          $(vetting_object).find(".__ssv__requestopinion_site").attr("data-sid", data.id);
          if(data.assigned) {
            $(vetting_object).find(".__ssv__inst-assigned").find("span").text(data.assigned);
            $(vetting_object).find(".__ssv__inst-assignedstaff").find("span").text(data.staff);
            $(vetting_object).find(".__ssv__inst-assignedusername").find("span").text(data.staff_username);
          } else {
            $(vetting_object).find(".__ssv__inst-assigned").find("span").html("<button type='button' onclick='assign_object("+data.id+")'>Assign yourself</button>");
            $(vetting_object).find(".__ssv__inst-assignedstaff").find("span").text(nan);
            $(vetting_object).find(".__ssv__inst-assignedusername").find("span").text(nan);
          }
          $(vetting_object).find(".__ssv__inst-decision").find("span").text(data.decision);
          if(data.decision) {
            $(vetting_object).find(".__ssv__inst-decisiondate").find("span").text(data.decided_on);
            $(vetting_object).find(".__ssv__approve_site").remove();
            $(vetting_object).find(".__ssv__deny_site").remove();
            $(vetting_object).find(".__ssv__requestopinion_site").remove();
          } else {
            $(vetting_object).find(".__ssv__inst-decisiondate").find("span").text(nan);
            $(vetting_object).find(".__ssv__inst-decision").find("span").text(not_made);
          }
          
          
          // check for previous submissions
          let s_021 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/"+data.id+"/related/";
          $.ajax({
            method: "GET",
            url: s_021,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              if(json.count > 0) {
                $.each(json.results, function(idx, data) {
                  console.log(data);
                  let prev_obj = $(vetting_object).find(".__ssv_sitelist__previous_dummy");
                  let previous_vetting_object = $(prev_obj).clone(true, true);
                  $(previous_vetting_object).find(".__ssv__inst-siteurl__previous").find("span").text(data.url);
                  $(previous_vetting_object).find(".__ssv__inst-assignedstaff__previous").find("span").text(data.staff);
                  $(previous_vetting_object).find(".__ssv__inst-assignedusername__previous").find("span").text(data.staff_username);
                  
                  $(previous_vetting_object).find(".__ssv__inst-decision__previous").find("span").text(data.decision);
                  
                  $(previous_vetting_object).find(".__ssv__inst-decisiondate__previous").find("span").text(data.decided_on);
                  
                  $(previous_vetting_object).find(".__ssv__inst-notes-reason__previous").find("span").text(data.notes);

                  $($(previous_vetting_object).removeAttr("class").addClass("__ssv-prev__instance")).appendTo(".__ssv-siteinstance_main__right h2");
                });
              }
            },
            error:function(request, status, error) {
              console.log(request.status);
            }
          });
          
          $($(vetting_object).removeAttr("class").addClass("__ssv-site__instance")).appendTo("#__ssv-sitelist__opinion ul");
        });
      },
      error:function(request, status, error) {
        console.log(request.status);
      }
    });
  });
  
  $("#__ssv-actions__assigned").click(() => {
    toggleView(document.getElementById("__ssv-sitelist__assigned"));
    /*
    
    /api/staff/vettings/assigned/ - GET
      GET:
        Description: Returns a list vetting objects assigned to your account.
        URL Parameters: None
        Fields: None
        Note: Staff usage only.
    
    */
    const s_023 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/assigned/";
    $.ajax({
      method: "GET",
      url: s_023,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        $.each(json.results, function(idx, data){
          console.log(data);
          let vetting_object = $(".__ssv_sitelist__assigned_dummy").clone(true, true);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").text(data.url);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").attr("href", data.url);
          $(vetting_object).find(".__ssv__inst-siteurl").find("a").attr("title", data.url);
          $(vetting_object).find(".__ssv__apivoid_scan").attr("data-sid", data.url);
          $(vetting_object).find(".__ssv__approve_site").attr("data-sid", data.id);
          $(vetting_object).find(".__ssv__deny_site").attr("data-sid", data.id);
          $(vetting_object).find(".__ssv__requestopinion_site").attr("data-sid", data.id);
          if(data.assigned) {
            $(vetting_object).find(".__ssv__inst-assigned").find("span").text(data.assigned);
            $(vetting_object).find(".__ssv__inst-assignedstaff").find("span").text(data.staff);
            $(vetting_object).find(".__ssv__inst-assignedusername").find("span").text(data.staff_username);
          } else {
            $(vetting_object).find(".__ssv__inst-assigned").find("span").html("<button type='button' onclick='assign_object("+data.id+")'>Assign yourself</button>");
            $(vetting_object).find(".__ssv__inst-assignedstaff").find("span").text(nan);
            $(vetting_object).find(".__ssv__inst-assignedusername").find("span").text(nan);
          }
          $(vetting_object).find(".__ssv__inst-decision").find("span").text(data.decision);
          if(data.decision) {
            $(vetting_object).find(".__ssv__inst-decisiondate").find("span").text(data.decided_on);
            $(vetting_object).find(".__ssv__approve_site").remove();
            $(vetting_object).find(".__ssv__deny_site").remove();
            $(vetting_object).find(".__ssv__requestopinion_site").remove();
          } else {
            $(vetting_object).find(".__ssv__inst-decisiondate").find("span").text(nan);
            $(vetting_object).find(".__ssv__inst-decision").find("span").text(not_made);
          }
          
          $.ajax({
            method: "GET",
            url: data.site,
            data: {
              nocache: cdt()
            },
            success:function(json) {
              $(vetting_object).find(".__ssv__inst-sitename").find("span").text(json.name);
              $(vetting_object).find(".__ssv__inst-sitedesc").find("span").text(json.description);
              $(vetting_object).find(".__ssv__inst-sitetag").find("span").text(json.category);
              $(vetting_object).find(".__ssv__inst-isverified").find("span").text(json.verified);
              if(json.logo) {
                $(vetting_object).find(".__ssv__inst-sitelogo").find("img").attr("src", json.logo);
                $(vetting_object).find(".__ssv__inst-sitelogo").find("p").remove();
              } else {
                $(vetting_object).find(".__ssv__inst-sitelogo").find("img").remove();
                $(vetting_object).find(".__ssv__inst-sitelogo").find("p").text(dyn_logo_msg);
              }
            },
            error:function(request, status, error) {
              console.log(request.status);
            }
          });
          
          // check for related removals from prior failed audits
          /*
          
          /api/staff/vettings/id-here/related-removals/ - GET
              GET:
                  Description: Returns a list of related removals from prior failed audits
                  URL Parameters: vetting-id
                  Fields: None
                  Notes: None
          
          */
          let s_028 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/"+data.id+"/related-removals/";
          $.ajax({
            method: "GET",
            url: s_028,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              $.each(json.results, function(idx, data) {
                console.log(data);
                let prior_obj = $(vetting_object).find(".__ssv_sitelist__prioraudit_dummy");
                let prior_audit_object = $(prior_obj).clone(true, true);
                $(prior_audit_object).find(".__ssv__inst-siteurl__prioraudit").find("span").text(data.url);
                $(prior_audit_object).find(".__ssv__inst-assignedstaff__prioraudit").find("span").text(data.staff);
                $(prior_audit_object).find(".__ssv__inst-assignedusername__prioraudit").find("span").text(data.staff_username);
                $(prior_audit_object).find(".__ssv__inst-decisiondate__prioraudit").find("span").text(data.removed_on);
                $(prior_audit_object).find(".__ssv__inst-notes-reason__prioraudit").find("span").text(data.notes);
                
                $($(prior_audit_object).removeAttr("class").addClass("__ssv-prior__instance")).insertAfter(".__ssv-siteinstance_main__right__1 h2");
              });
            },
            error:function(request, status, error) {
              console.log(request.status+" "+error);
            }
          });
          
          // check for previous submissions
          let s_021 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/"+data.id+"/related/";
          $.ajax({
            method: "GET",
            url: s_021,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              if(json.count > 0) {
                $.each(json.results, function(idx, data) {
                  console.log(data);
                  let prev_obj = $(vetting_object).find(".__ssv_sitelist__previous_dummy");
                  let previous_vetting_object = $(prev_obj).clone(true, true);
                  $(previous_vetting_object).find(".__ssv__inst-siteurl__previous").find("span").text(data.url);
                  $(previous_vetting_object).find(".__ssv__inst-assignedstaff__previous").find("span").text(data.staff);
                  $(previous_vetting_object).find(".__ssv__inst-assignedusername__previous").find("span").text(data.staff_username);
                  
                  $(previous_vetting_object).find(".__ssv__inst-decision__previous").find("span").text(data.decision);
                  
                  $(previous_vetting_object).find(".__ssv__inst-decisiondate__previous").find("span").text(data.decided_on);
                  
                  $(previous_vetting_object).find(".__ssv__inst-notes-reason__previous").find("span").text(data.notes);

                  $($(previous_vetting_object).removeAttr("class").addClass("__ssv-prev__instance")).insertAfter(".__ssv-siteinstance_main__right__0 h2");
                });
              }
            },
            error:function(request, status, error) {
              console.log(request.status);
            }
          });
          
          $($(vetting_object).removeAttr("class").addClass("__ssv-site__instance")).appendTo("#__ssv-sitelist__assigned ul");
        });        
      },
      error:function(request, status, error) {
        console.log(request.status);
      }
    });
  });
  
  $(".__ssv__inst__takeaction").click((e) => {
    let self = $(e.target).closest(".__ssv-site__instance");
    $(self).find(".__ssv-siteinstance_main").hide();
    $(self).find(".__ssv-siteinstance_expanded").show();
  });

  $(".__ssv__inst__chickenout").click((e) => {
    let self = $(e.target).closest(".__ssv-site__instance");
    $(self).find(".__ssv-siteinstance_main").show();
    $(self).find(".__ssv-siteinstance_expanded").hide();
  });
  
  $(".__ssv__apivoid_scan").click((e) => {
    /*
    /api/apivoid/vetting-scan/ - POST
      POST:
          Description: Performs a final vetting scan against a site using APIVoid to determine site elgibility before final approval.
          URL Parameters: None
          Fields: 'url' (The actual site URL like: 'https://www.example.com/')
          Notes: This endpoint should only be used prior to final approval of a site.
    */
    $(e.target).css({
      "opacity":"0.5",
      "pointer-events":"none"
    });
    const s_024 = "http://"+window.location.hostname+":"+window.location.port+"/api/apivoid/vetting-scan/";
    let parent = $(e.target).parent();
    $.ajax({
      method: "POST",
      url: s_024,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        url: $(e.target).attr("data-sid")
      },
      success:function(json) {
        console.log(json);
        $(parent).find(".__ssv__apivoid_0").find("span").text(json.domain_reputation_scan.data.report.blacklists.engines_count);
        $(parent).find(".__ssv__apivoid_1").find("span").text(json.domain_reputation_scan.data.report.blacklists.detections);
        $(parent).find(".__ssv__apivoid_2").find("span").text(json.domain_reputation_scan.data.report.blacklists.detection_rate);
        $(parent).find(".__ssv__apivoid_3").val(JSON.stringify(json.domain_reputation_scan.data.report.blacklists.engines));
        $(parent).find(".__ssv__apivoid_4").find("span").text(json.site_trustworthiness_scan.data.report.trust_score.result);
      },
      error:function(request, status, error) {
        console.log(request.status);
        console.log(error);
        $(e.target).css({
          "opacity":"",
          "pointer-events":""
        });
      }
    });
  });
  
  $(".__ssv__approve_site").click((e) => {
    if(confirm("Confirm this action: APPROVE")) {
      $('body').css({
        "pointer-events":"none",
        "opacity":0.5
      });
      const s_022 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/"+$(e.target).attr("data-sid")+"/";
      $.ajax({
        method: "PATCH",
        url: s_022,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          decision: true
        },
        success:function(json) {
          console.log(json);
          // update fields in vetting object on screen
          window.location.reload();
        },
        error:function(request, status, error) {
          alert(request.status);
          $('body').css({
            "pointer-events":"auto",
            "opacity":1
          });
        }
      });
    }
  });
  $(".__ssv__deny_site").click((e) => {
    if(confirm("Confirm this action: DENY")) {
      $('body').css({
        "pointer-events":"none",
        "opacity":0.5
      });
      let denial_notes = $(e.target).closest(".__ssv-siteinstance_expanded").find(".__ssv_denial_notes");
      const s_022 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/"+$(e.target).attr("data-sid")+"/";
      $.ajax({
        method: "PATCH",
        url: s_022,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          decision: false,
          notes: $(denial_notes).val()
        },
        success:function(json) {
          console.log(json);
          // update fields in vetting object on screen
          window.location.reload();
        },
        error:function(request, status, error) {
          alert(request.status);
          $('body').css({
            "pointer-events":"auto",
            "opacity":1
          });
        }
      });
    }
  });
  $(".__ssv__requestopinion_site").click((e) => {
    if(confirm("Confirm this action: REQUEST OPINION")) {
      $('body').css({
        "pointer-events":"none",
        "opacity":0.5
      });
      const s_022 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/vettings/"+$(e.target).attr("data-sid")+"/";
      $.ajax({
        method: "PATCH",
        url: s_022,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          assigned: false
        },
        success:function(json) {
          console.log(json);
          // update fields in vetting object on screen
          window.location.reload();
        },
        error:function(request, status, error) {
          alert(request.status);
          $('body').css({
            "pointer-events":"auto",
            "opacity":1
          });
        }
      });
    }
  });
  
  let msg_arr = [];
  // vetting checkboxes
  $(".__ssv__d0").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg0);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg0),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d1").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg1);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg1),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d2").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg2);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg2),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d3").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg3);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg3),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d4").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg4);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg4),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d5").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg5);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg5),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d6").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg6);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg6),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d7").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg7);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg7),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d8").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg8);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg8),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d9").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg9);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg9),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d10").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg10);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg10),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d11").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      msg_arr.push(dont__msg11);
    } else {
      msg_arr.splice(msg_arr.indexOf(dont__msg11),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  
  $(".__ssv__d12").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(e.target.checked) {
      $(parent).find(".__ssv_denial_notes").attr("readonly", false);
    } else {
      $(parent).find(".__ssv_denial_notes").attr("readonly", true);
    }
  });
  
  $(".__ssv__d13").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(!e.target.checked) {
      msg_arr.push(do__msg0);
    } else {
      msg_arr.splice(msg_arr.indexOf(do__msg0),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d14").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(!e.target.checked) {
      msg_arr.push(do__msg1);
    } else {
      msg_arr.splice(msg_arr.indexOf(do__msg1),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d15").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(!e.target.checked) {
      msg_arr.push(do__msg2);
    } else {
      msg_arr.splice(msg_arr.indexOf(do__msg2),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d16").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(!e.target.checked) {
      msg_arr.push(do__msg3);
    } else {
      msg_arr.splice(msg_arr.indexOf(do__msg3),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d17").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(!e.target.checked) {
      msg_arr.push(do__msg4);
    } else {
      msg_arr.splice(msg_arr.indexOf(do__msg4),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d18").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(!e.target.checked) {
      msg_arr.push(do__msg5);
    } else {
      msg_arr.splice(msg_arr.indexOf(do__msg5),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
  $(".__ssv__d19").click((e) => {
    let parent = $(e.target).closest(".__ssv-site__instance");
    if(!e.target.checked) {
      msg_arr.push(apivoid__failure);
    } else {
      msg_arr.splice(msg_arr.indexOf(apivoid__failure),1);
    }
    curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
  });
  
});