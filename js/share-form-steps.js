"use strict";
function cdt() {
  let dt = new Date();
  return dt.getTime();
}
function extractHostname(url) {
    let hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

$(function(){
  
  const m8922_url = "http://"+window.location.hostname+":"+window.location.port+"/api/subscription-info/";
  
  const apit = "apitoken";
  let st = Cookies.get(apit);
  
  
  $.ajax({
    method: "GET",
    url: m8922_url,
    headers: {
      "Authorization" : "Token "+""+st
    },
    data: {
      nocache: cdt()
    },
    success:function(json) {
      if(json) {
        $("#current_active_sites_qty").text(json.subscription_info.quantity*10);
        $("#current_active_sites_qty_tot").text((json.subscription_info.quantity*10)+10);
        $("#current_active_sites_wrapper").show();
      } else {
        $("#current_active_sites_qty_tot").text("10");
      }
    },
    error:function(request, status, error) {}
  });
  
  
  let verify_hstnme="";
  $(".mtag").position({
    my: "right-23",
    at: "left",
    of: $(".onboard-verify-switch"),
    collision: "none"
  });
  $(".dnrec").position({
    my: "left+10",
    at: "right",
    of: $(".onboard-verify-switch"),
    collision: "none"
  });

  verify_hstnme = extractHostname($(".share-packet-0-verify-field").val());
  if(verify_hstnme.indexOf("www.")>=0) verify_hstnme=verify_hstnme.replace("www.", "");
  //if(verify_hstnme!="")$("#ovmmp-mutable").text(verify_hstnme);
  else $("#ovmmp-mutable").css("fontFamily", "Oxygen-Reg");
  $(".share-packet-0-verify-field").keyup(function(e){
    verify_hstnme = extractHostname(e.target.value);
    if(verify_hstnme.indexOf("www.")>=0) verify_hstnme=verify_hstnme.replace("www.", "");
    if(verify_hstnme!=""){
      //$("#ovmmp-mutable").text(verify_hstnme);
      //$("#ovmmp-mutable").css("fontFamily", "Oxygen-Bold");
    }
    else {
      $("#ovmmp-mutable").text(" your site ");
      $("#ovmmp-mutable").css("fontFamily", "Oxygen-Reg");
    }
  });

  $(".onboard-verify-switch input").prop('checked', false);

  if($(".onboard-verify-switch input").is(":checked")) {
    $(".onboard-verify-method-metatag").hide();
    $(".onboard-verify-method-dnsrecord").show();
    //reposition_btns(0);
  } else {
    $(".onboard-verify-method-metatag").show();
    $(".onboard-verify-method-dnsrecord").hide();
    //reposition_btns(0);
  }

  $(".onboard-verify-switch input").change(function(){
    if($(".onboard-verify-switch input").is(":checked")) {
      $(".onboard-verify-method-metatag").hide();
      $(".onboard-verify-method-dnsrecord").show();
      //reposition_btns(0);
    } else {
      $(".onboard-verify-method-metatag").show();
      $(".onboard-verify-method-dnsrecord").hide();
      //reposition_btns(0);
    }
  });


  $(".onboard-verify-choose").click(function(){
    show_details_notification("Verification with a meta tag is simpler, especially if you aren't comfortable with DNS records or don't have access to them.", "Meta Tag or DNS Record");
  });


  $(window).resize(function(){
    $(".mtag").position({
      my: "right-23",
      at: "left",
      of: $(".onboard-verify-switch"),
      collision: "none"
    });
    $(".dnrec").position({
      my: "left+10",
      at: "right",
      of: $(".onboard-verify-switch"),
      collision: "none"
    });
  });


});
