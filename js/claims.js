"use strict";

function cdt() {
  let dt = new Date();
  return dt.getTime();
}

function c(element) {
  let $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

$(() => {
  const apit = "apitoken";
  let st = Cookies.get(apit);
  let can_create_claim = false;
  const dns__text = "DNS Record";
  const meta__text = "Meta Tag";
  const verify_dns_instructions = "To verify ownership of your site with a DNS TXT record, you will need administrative access to your domain's DNS control panel. If you are having trouble locating the DNS control panel for your domain, please ask your hosting provider for assistance. Once you have access to your domain's DNS records, create a new TXT record with the text above. After you have saved the record, you can verify ownership with the button below. If verification fails at first, please wait and try again. DNS records may take up to 48 hours to propogate.";
  const verify_meta_instructions = "To add the meta tag to your site's homepage, open the homepage HTML file using an editor. If you use a web-based service to manage your site, open your homepage in their online editor. Paste the above meta tag into your homepage HTML file between the <head> and </head> tags near the top of the page. If you need more help, ask your hosting provider's technical support team. After you have added the meta tag, you can verify ownership with the button below.";
  /*


  /api/claims/id-here/ - GET/DELETE
  	GET:
  		Description: Returns a specific claim.
  		URL Parameters: claim-id
  		Fields: None
  		Note: None
  	DELETE:
  		Description: Deletes a specific claim.
  		URL Parameters: claim-id
  		Fields: None
          Note: Unsuccessful claim objects are automatically deleted through tidy. DELETE requests on this endpoint are for publisher use only.
  
  */
  $("#claims_opt__wrapper").children().eq(0).click((e) => {
    $(".claims_instance").remove();
    $("#claims_current__list").hide();
    $("#claims_new__form").show();
    $(".claims__opt_selected").removeClass("claims__opt_selected");
    $(e.target).addClass("claims__opt_selected");
    $(".mtag").position({
      my: "right-23 top",
      at: "left top",
      of: $(".onboard-verify-switch"),
      collision: "none"
    });
    $(".dnrec").position({
      my: "left+10 top",
      at: "right top",
      of: $(".onboard-verify-switch"),
      collision: "none"
    });
  });
  $("#claims_opt__wrapper").children().eq(1).click((e) => {
    $(".claims_instance").remove();
    $("#claims_new__form").hide();
    $("#claims_current__list").show();
    $(".claims__opt_selected").removeClass("claims__opt_selected");
    $(e.target).addClass("claims__opt_selected");
    // show open claim requests
    /*
    
    /api/claims/ - GET
    	GET:
    		Description: Returns a list of free site claims associated with your account.
    		URL Parameters: None
    		Fields: None
    		Note: None
    
    */
    if(st) {
      const m301_url = "http://"+window.location.hostname+":"+window.location.port+"/api/claims/";
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
          $.each(json.results, function(idx, data){
            console.log(data);
            let claim_instance = $(".claims_instance__dummy").clone(true, true);
            $(claim_instance).find(".claims_instance__main_info").children().eq(0).find("span").text(data.site_name);
            $(claim_instance).find(".claims_instance__main_info").children().eq(1).find("span").text(data.verificationMethod ? dns__text : meta__text);
            if(data.verificationMethod) {
              $(claim_instance).find(".pubdash-verify-method__meta-input").remove();
              $(claim_instance).find(".pubdash-verify-method__dns-input").find("span").text(data.verificationCode);
              $(claim_instance).find(".pubdash-verifysite_instructions").text(verify_dns_instructions);
            } else {
              $(claim_instance).find(".pubdash-verify-method__dns-input").remove();
              $(claim_instance).find(".pubdash-verify-method__meta-input").find("span").text(data.verificationCode);
              $(claim_instance).find(".pubdash-verifysite_instructions").text(verify_meta_instructions);
            }
            $($(claim_instance).removeClass("claims_instance__dummy").addClass("claims_instance").attr("data-sid", data.id)).appendTo("#claims_current__list");
          });
        },
        error:function(request, status, error) {
          console.log(request.status);
        }
      });
    }
  });
  
  $(".pubdash-verify__copy").click((e) => {
    let main_obj = $(e.target).closest(".pubdash-verify__copy");
    let prev_text = $(main_obj).text();
    c(main_obj);
    $(main_obj).text("Copied!");
    setTimeout(() => {
      $(main_obj).text(prev_text);
    },2000);
  });
  
  $("#pubdash-create_claim").click(() => {
    /*
    
    /api/claims/new/ - POST
    	POST:
    		Description: Creates a free site claim for the current account.
    		URL Parameters: None
    		Fields: 
    			'url' (the actual URL of the site in any format), 
    			'verification_method' ('true'/'false' indicating DNS or meta tag verification respectively)
            Note:
    			This endpoint is smart about url format, so passing any user input is acceptable.
    			User named ‘unsift’ should hold all free sites until they are claimed by publisher accounts. 
    			Only create claims from non-superuser accounts.
    
    */
    if(can_create_claim && st) {
      const m302_url = "http://"+window.location.hostname+":"+window.location.port+"/api/claims/new/";
      $.ajax({
        method: "POST",
        url: m302_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          url: $("#claims_url_input").val(),
          verification_method: $(".onboard-verify-switch input").prop('checked'),
        },
        success:function(json) {
          console.log(json);
          if(json) {
            $("#claims_new__form").hide();
            $("#claims_current__list").show();
            $(".claims__opt_selected").removeClass("claims__opt_selected");
            $("#claims_opt__wrapper").children().eq(1).addClass("claims__opt_selected");
            // show open claim requests
            const m301_url = "http://"+window.location.hostname+":"+window.location.port+"/api/claims/";
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
                $.each(json.results, function(idx, data){
                  console.log(data);
                  let claim_instance = $(".claims_instance__dummy").clone(true, true);
                  $(claim_instance).find(".claims_instance__main_info").children().eq(0).find("span").text(data.site_name);
                  $(claim_instance).find(".claims_instance__main_info").children().eq(1).find("span").text(data.verificationMethod ? dns__text : meta__text);
                  if(data.verificationMethod) {
                    $(claim_instance).find(".pubdash-verify-method__meta-input").remove();
                    $(claim_instance).find(".pubdash-verify-method__dns-input").find("span").text(data.verificationCode);
                    $(claim_instance).find(".pubdash-verifysite_instructions").text(verify_dns_instructions);
                  } else {
                    $(claim_instance).find(".pubdash-verify-method__dns-input").remove();
                    $(claim_instance).find(".pubdash-verify-method__meta-input").find("span").text(data.verificationCode);
                    $(claim_instance).find(".pubdash-verifysite_instructions").text(verify_meta_instructions);
                  }
                  $($(claim_instance).removeClass("claims_instance__dummy").addClass("claims_instance").attr("data-sid", data.id)).appendTo("#claims_current__list");
                });
              },
              error:function(request, status, error) {
                console.log(request.status);
              }
            });
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
  });
  
  $("#claims_url_input").keyup((e) => {
    if($(e.target).val().length > 0) {
      $("#pubdash-create_claim").removeClass("l--a-f-f_disable");
      can_create_claim = true;
    } else {
      $("#pubdash-create_claim").addClass("l--a-f-f_disable");
      can_create_claim = false;
    }
  });
  
  $(".pubdash-verify_claim").click((e) => {
    /*
    
    /api/claims/id-here/verify/ - GET
      GET:
            Description: Attempts to verify ownership of a free site claim, and automatically provisions access if successful.
            URL Parameters: claim-id
            Fields: None
            Note: 
                Only used to verify free site claims. 
                See pubdash verify site endpoint for paid site verification. 
                Currently always successful due to manual override of verification code checking.
    
    */
    let this_button = e.target;
    if(st) {
      $(e.target).addClass("l--a-f-f_disable");
      $(".verifysite-progress-loader").css("visibility", "visible");
      const m303_url = "http://"+window.location.hostname+":"+window.location.port+"/api/claims/"+$(e.target).closest(".claims_instance").attr("data-sid")+"/verify/";
      $.ajax({
        method: "GET",
        url: m303_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          console.log(json);
          if(json) {
            $(".verifysite-progress-loader").css("visibility", "hidden");
            show_info_notification("Your site has been added to your publisher dashboard");
            $(".claims_instance").remove();
            if(st) {
              const m301_url = "http://"+window.location.hostname+":"+window.location.port+"/api/claims/";
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
                  $.each(json.results, function(idx, data){
                    console.log(data);
                    let claim_instance = $(".claims_instance__dummy").clone(true, true);
                    $(claim_instance).find(".claims_instance__main_info").children().eq(0).find("span").text(data.site_name);
                    $(claim_instance).find(".claims_instance__main_info").children().eq(1).find("span").text(data.verificationMethod ? dns__text : meta__text);
                    if(data.verificationMethod) {
                      $(claim_instance).find(".pubdash-verify-method__meta-input").remove();
                      $(claim_instance).find(".pubdash-verify-method__dns-input").find("span").text(data.verificationCode);
                      $(claim_instance).find(".pubdash-verifysite_instructions").text(verify_dns_instructions);
                    } else {
                      $(claim_instance).find(".pubdash-verify-method__dns-input").remove();
                      $(claim_instance).find(".pubdash-verify-method__meta-input").find("span").text(data.verificationCode);
                      $(claim_instance).find(".pubdash-verifysite_instructions").text(verify_meta_instructions);
                    }
                    $($(claim_instance).removeClass("claims_instance__dummy").addClass("claims_instance").attr("data-sid", data.id)).appendTo("#claims_current__list");
                  });
                },
                error:function(request, status, error) {
                  console.log(request.status);
                }
              });
            }
          }
        },
        error:function(request, status, error) {
          $(".verifysite-progress-loader").css("visibility", "hidden");
          $(this_button).removeClass("l--a-f-f_disable");
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
  
  $(".claims_instance__main_info").find("button").click((e) => {
    let parent = $(e.target).closest(".claims_instance");
    if(!$(e.target).attr("data-close")) {
      $(parent).find(".claims_instance__expanded_info").show();
      $(e.target).attr("data-close", true);
      $(e.target).text("Show less");
    } else {
      $(parent).find(".claims_instance__expanded_info").hide();
      $(e.target).removeAttr("data-close");
      $(e.target).text("Show more");
    }
  });
  
  $(".onboard-verify-choose").click(() => {
    show_details_notification("Verification with a meta tag is simpler, especially if you aren't comfortable with DNS records or don't have access to them.", "Meta Tag or DNS Record");
  });
  
  $(window).resize(function(){
    $(".mtag").position({
      my: "right-23 top",
      at: "left top",
      of: $(".onboard-verify-switch"),
      collision: "none"
    });
    $(".dnrec").position({
      my: "left+10 top",
      at: "right top",
      of: $(".onboard-verify-switch"),
      collision: "none"
    });
  });
  
});