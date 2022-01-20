"use strict";

function cdt() {
  let dt = new Date();
  return dt.getTime();
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

$(() => {
  /*
  
  
  /api/staff/audits/site-feedback/id-here/ - GET
  	GET:
  		Description: A staff endpoint that retrieves a list of recent feedback objects for a given site ID.
  		URL Parameters: site-id
  		Fields: None
  		Note: Sorts from worst ratings to greatest ratings.
  
  */
  const apit = "apitoken";
  let st = Cookies.get(apit);
  
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
  
  const dyn_logo_msg = "Logo is dynamically generated";
  if(st) {
    const s_040 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/audits/queue/";
    $.ajax({
      method: "GET",
      url: s_040,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        $.each(json.results, function(idx, data) {
          console.log(data);
          
          let audit_instance = $(".__ssa_audits_instance_dummy").clone(true, true);
          $(audit_instance).find("p").eq(0).find("span").text(data.name);
          
          $(audit_instance).find("p").eq(1).find("span").text(data.category);
          $(audit_instance).find("p").eq(2).find("span").text(data.description);
          
          $(audit_instance).find("p").eq(3).find("a").attr("href", data.url);
          $(audit_instance).find("p").eq(3).find("a").text(data.url);
          
          $(audit_instance).find(".__ssa__remove_site").attr("data-sid", data.url);
          $(audit_instance).find(".__ssa__pass_site").attr("data-sid", data.url);
                    
          
          if(data.logo) {
            $(audit_instance).find("img").attr("src", data.logo);
          } else {
            $(audit_instance).find("img").remove();
            $(audit_instance).find("p").eq(4).text(dyn_logo_msg);
          }
          
          let s_041 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/audits/site-feedback/"+data.id+"/";
          $.ajax({
            method: "GET",
            url: s_041,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              $.each(json.results, function(idx, data){
                console.log(data);
                let feedback_instance = $(audit_instance).find(".__ssa_audits_instance_feedback_dummy").clone(true, true);
                let this_feedback = $(audit_instance).find(".__ssa_audits_feedback_list");
                $(feedback_instance).find("p").eq(0).find("span").text(data.subject);
                $(feedback_instance).find("p").eq(1).find("span").text(data.rating);
                $(feedback_instance).find("p").eq(2).find("span").text(data.message);
                $(feedback_instance).find("p").eq(3).find("span").text(data.site_name);
                $($(feedback_instance).removeClass("__ssa_audits_instance_feedback_dummy").addClass("__ssa_audits_instance_feedback")).appendTo(this_feedback);
              });
            },
            error:function(request, status, error) {
              console.log(request.status);
            }
          });
          
          $($(audit_instance).removeClass("__ssa_audits_instance_dummy").addClass("__ssa_audits_instance").attr("data-sid", data.id)).appendTo("#__ssa_audits_list");
          
        });
        
      },
      error:function(request, status, error) {
        console.log(request.status);
      }
    });
    
    
    $(".__ssa_audits_makedecision").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      $(parent).find(".__ssa-siteinstance_main").hide();
      $(parent).find(".__ssv-siteinstance_expanded").show();
    });
    
    $(".__ssa__inst__chickenout").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      $(parent).find(".__ssa-siteinstance_main").show();
      $(parent).find(".__ssv-siteinstance_expanded").hide();
    });
    
    $(".__ssa__remove_site").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      
      if(confirm("Confirm this action: REMOVE")) {
        $('body').css({
          "pointer-events":"none",
          "opacity":0.5
        });
        /*
        
        /api/staff/audits/remove-site/ - DELETE
        	DELETE:
                Description: An endpoint for staff accounts that removes a site from the platform and automatically cancels the associated subscription.
                URL Parameters: None
                Fields: ‘url’ (The actual site URL like: ’https://www.example.com/’), ‘password’ (staff account password), ‘notes’ (sent to the publisher), ‘token’ (optional, staff 2FA token)
                Note:
                    Staff usage only. 
                    This endpoint may take a while to respond. 
                    Free sites may be removed using this endpoint.
        
        */
        const s_042 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/audits/remove-site/";
        let denial_notes = $(parent).find(".__ssv_denial_notes").val();
        let denial_pass = $(parent).find(".__ssa__denial_password").val();
        let denial_2fa = $(parent).find(".__ssa__denial_2fa").val();
        let denial_url = $(e.target).attr("data-sid");
        $.ajax({
          method: "DELETE",
          url: s_042,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            url: denial_url,
            password: denial_pass,
            token: denial_2fa,
            notes: denial_notes
          },
          success:function(json) {
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
    
    
    $(".__ssa__pass_site").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      
      if(confirm("Confirm this action: PASS")) {
        $('body').css({
          "pointer-events":"none",
          "opacity":0.5
        });
        /*
        
        /api/staff/audits/site-passed/id-here/ - GET
        	GET:
        		Description: Marks a site as having passed an audit, removing it from the audit queue for at least 2 weeks.
        		URL Parameters: site-id
        		Fields: None
        		Note: The provided site must be verified and active.
        
        */
        const s_043 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/audits/site-passed/"+$(parent).attr("data-sid")+"/";
        $.ajax({
          method: "GET",
          url: s_043,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            nocache: cdt()
          },
          success:function(json) {
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
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg0);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg0),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d1").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg1);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg1),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d2").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg2);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg2),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d3").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg3);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg3),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d4").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg4);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg4),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d5").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg5);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg5),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d6").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg6);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg6),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d7").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg7);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg7),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d8").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg8);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg8),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d9").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg9);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg9),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d10").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg10);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg10),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d11").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        msg_arr.push(dont__msg11);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg11),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    
    $(".__ssv__d12").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(e.target.checked) {
        $(parent).find(".__ssv_denial_notes").attr("readonly", false);
      } else {
        $(parent).find(".__ssv_denial_notes").attr("readonly", true);
      }
    });
    
    $(".__ssv__d13").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(!e.target.checked) {
        msg_arr.push(do__msg0);
      } else {
        msg_arr.splice(msg_arr.indexOf(do__msg0),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d14").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(!e.target.checked) {
        msg_arr.push(do__msg1);
      } else {
        msg_arr.splice(msg_arr.indexOf(do__msg1),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d15").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(!e.target.checked) {
        msg_arr.push(do__msg2);
      } else {
        msg_arr.splice(msg_arr.indexOf(do__msg2),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d16").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(!e.target.checked) {
        msg_arr.push(do__msg3);
      } else {
        msg_arr.splice(msg_arr.indexOf(do__msg3),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d17").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(!e.target.checked) {
        msg_arr.push(do__msg4);
      } else {
        msg_arr.splice(msg_arr.indexOf(do__msg4),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    $(".__ssv__d18").click((e) => {
      let parent = $(e.target).closest(".__ssa_audits_instance");
      if(!e.target.checked) {
        msg_arr.push(do__msg5);
      } else {
        msg_arr.splice(msg_arr.indexOf(do__msg5),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    
    
    
  }
});