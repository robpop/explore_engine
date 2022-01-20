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
  const apit = "apitoken";
  let st = Cookies.get(apit);
  const s_091 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/site-changes/queue/";
  
  if(st) {
    $.ajax({
      method: "GET",
      url: s_091,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        console.log(json);
        $.each(json.results, function(idx, data){
          let new_change = $(".__ssg_sitelist_dummy").clone(true, true);
          $(new_change).find(".__ssv__inst-newdesc").find("span").text(data.new_description);
          $(new_change).find(".__ssv__inst-newname").find("span").text(data.new_name);
          // display logo here
          if(data.new_logo) {
            $(new_change).find(".__ssv__inst-newlogo").find("img").attr("src", data.new_logo);
          } else {
            $(new_change).find(".__ssv__inst-newlogo").find("img").remove();
            $(new_change).find(".__ssv__inst-newlogo").find("span").eq(1).text("DYNAMIC LOGO");
            $(new_change).find(".__ssv__inst-newlogo").find("span").eq(1).css({
              "color": "orangered",
              "font-family":"Oxygen-Bold"
            });
          }
          $.ajax({
            method: "GET",
            url: data.site,
            data: {
              nocache: cdt()
            },
            success:function(site) {
              $(new_change).find(".__ssv__inst-siteurl").find("span").text(site.url);
              $(new_change).find(".__ssv__inst-lastsubmitted").find("span").text(site.updated.substring(0,site.updated.indexOf("T")));
              $(new_change).find(".__ssv__inst-previous_newdesc").find("span").text(site.description);
              $(new_change).find(".__ssv__inst-previous_newname").find("span").text(site.name);
              // display old logo here
              if(site.logo) {
                $(new_change).find(".__ssv__inst-previous_newlogo").find("img").attr("src", site.logo);
              } else {
                $(new_change).find(".__ssv__inst-previous_newlogo").find("img").remove();
                $(new_change).find(".__ssv__inst-previous_newlogo").find("span").text("DYNAMIC LOGO");
                $(new_change).find(".__ssv__inst-previous_newlogo").find("span").css({
                  "color": "orangered",
                  "font-family":"Oxygen-Bold"
                });
              }
              
              // highlight differences
              // __ssg_new_data
              if(data.new_description !== site.description) {
                $(new_change).find(".__ssv__inst-newdesc").find("span").addClass("__ssg_new_data");
              }
              if(data.new_name !== site.name) {
                $(new_change).find(".__ssv__inst-newname").find("span").addClass("__ssg_new_data");
              }
              if(data.new_logo !== site.logo && data.logo_change) {
                $(new_change).find(".__ssv__inst-newlogo").find("span").eq(0).text("Logo updated");
                $(new_change).find(".__ssv__inst-newlogo").find("span").eq(0).addClass("__ssg_new_data");
              }
            },
            error:function(request, status, error) {
              console.log(request.status);
            }
          });
          $($(new_change).removeAttr("class").addClass("__ssg_sitelist_inst").attr("data-cid", data.id)).appendTo("#__ssg_sitelist");
        });
      },
      error:function(request, status, error) {
        console.log(request.status);
      }
    });
    
    
    
    $(".__ssv__inst__takeaction").click((e) => {
      let self = $(e.target).closest(".__ssg_sitelist_inst");
      $(self).find(".__ssv-siteinstance_main").hide();
      $(self).find(".__ssv-siteinstance_expanded").show();
    });
    
    $(".__ssv__inst__chickenout").click((e) => {
      let self = $(e.target).closest(".__ssg_sitelist_inst");
      $(self).find(".__ssv-siteinstance_main").show();
      $(self).find(".__ssv-siteinstance_expanded").hide();
    });
    
    $(".__ssv__approve_site").click((e) => {
      if(confirm("Confirm this action: APPROVE")) {
        $('body').css({
          "pointer-events":"none",
          "opacity":0.5
        });
        let cid = $(e.target).closest(".__ssg_sitelist_inst").attr("data-cid");
        let s_092 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/site-changes/"+cid+"/approve/";
        /*
        
        /api/staff/site-changes/id-here/approve/ - GET
            GET:
                Description: Approves a specified site change object and updates the related site
                URL Parameters: site-change-id
                Fields: None
                Notes: 
                    Removes the site change object from the changes queue
                    Returns 404 if the site change has already been approved/denied by another staff member
        
        */
        $.ajax({
          method: "GET",
          url: s_092,
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
            alert(error);
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
        let cid = $(e.target).closest(".__ssg_sitelist_inst").attr("data-cid");
        let s_093 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/site-changes/"+cid+"/deny/";
        /*

        /api/staff/site-changes/id-here/deny/ - POST
            GET:
                Description: Denies a specified site change object and deletes the object
                URL Parameters: site-change-id
                Fields: None
                Notes: 
                    Removes the site change object from the changes queue
                    Returns 404 if the site change has already been approved/denied by another staff member
        
        */
        $.ajax({
          method: "POST",
          url: s_093,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            notes: $(e.target).closest(".__ssg_sitelist_inst").find(".__ssv_denial_notes").val(),
            nocache: cdt()
          },
          success:function(json) {
            window.location.reload();
          },
          error:function(request, status, error) {
            alert(error);
            $('body').css({
              "pointer-events":"auto",
              "opacity":1
            });
          }
        });
      }
    });
    
    let msg_arr = [];
    const dont__msg2 = "- Provided inaccurate site information\n";
    $(".__ssv__d2").click((e) => {
      let parent = $(e.target).closest(".__ssg_sitelist_inst");
      if(e.target.checked) {
        msg_arr.push(dont__msg2);
      } else {
        msg_arr.splice(msg_arr.indexOf(dont__msg2),1);
      }
      curate_message($(parent).find(".__ssv_denial_notes"), msg_arr);
    });
    $(".__ssv__d12").click((e) => {
      let parent = $(e.target).closest(".__ssg_sitelist_inst");
      if(e.target.checked) {
        $(parent).find(".__ssv_denial_notes").attr("readonly", false);
      } else {
        $(parent).find(".__ssv_denial_notes").attr("readonly", true);
      }
    });
    
  }
  
});