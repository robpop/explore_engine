"use strict";
function pad(n) {
  return (n < 10 ? '0' : '') + n;
}

function unixToDate(u){
  // Months array
  let months_arr = ['01','02','03','04','05','06','07','08','09','10','11','12'];

  // Convert timestamp to milliseconds
  let date = new Date(u*1000);

  // Year
  let year = date.getFullYear();

  // Month
  let month = months_arr[date.getMonth()];

  // Day
  let day = date.getDate();

  // Display date time in MM-dd-yyyy format
  let convdataTime = month+'/'+day+'/'+year;

  return convdataTime;
}

function cdt() {
  let dt = new Date();
  return dt.getTime();
}

$(() => {
  
  let library_section = document.getElementsByClassName("library-section");
  
  const m8927_url = "http://"+window.location.hostname+":"+window.location.port+"/api/pubdash-sites/";
  const m8922_url = "http://"+window.location.hostname+":"+window.location.port+"/api/subscription-info/";
  const p001_url = "http://"+window.location.hostname+":"+window.location.port+"/api/payment-methods/";
  const p002_url = "http://"+window.location.hostname+":"+window.location.port+"/api/payment-methods/default/";
  /*
  
  /api/subscription-info/ - GET
  	GET:
  		Description: Returns subscription information associated with your account.
  		URL Parameters: None
  		Fields: None
  		Notes: None
  
  */
  
  const ending_in = " ending in: ";
  let payment_methods = [];
  
  const apit = "apitoken";
  let st = Cookies.get(apit);
  let nele;
  if(st) {
    $.ajax({
      method: "GET",
      url: m8927_url,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        if(json.count>0) {
          $.each(json.results, function(idx, result) {
            nele = $(".library-section-dummy").clone(true, true);
            
            if (result.logo) {
              $(nele).find("img").attr("data-src", result.logo);
              $(nele).find("img").attr("alt", result.name+" logo");
            } else {
              // remove img from library-folder-preview
              // add the backup div for hash logo
              // generate logo
              $(nele).find("img").remove();
              let n = $("<div id="+ result.url +"></div>");
              $(nele).find(".library-folder-preview").append(n);
              $(nele).find("img").attr("alt", result.name+" generated logo");
              setTimeout(() => {
                generate(document.getElementById(n[0].id), result.url);
              },0);
            }
              
            
            $(nele).find(".library-folder-name").text(result.name);
            
            $(nele).find(".pubdash-slct__a").attr("href", "/publisher-dashboard/manage/"+result.id+"/");
            $(nele).find(".pubdash-slct__a").attr("title", "Manage "+result.name);
            
            $($(nele).removeClass("library-section-dummy").attr("data-sid", result.id)).appendTo( "#pubdash-items--sites" );
            
            $(".lazy").lazy({
              scrollDirection: 'vertical',
              effect: 'fadeIn',
              effectTime: 500,
              onError: function(element) {
                  // have a default image ready to go
              }
            });
          });
        }
      },
      error:function(request, status, error) {
        console.log(error);
      }
    });
    
    
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
          $(".subscription-progress-loader").remove();
          $("#pubdash-total-sitesubscriptions").css("display", "flex");
          $("#pubdash-total__subscription-sites").children().eq(0).text("$"+json.subscription_info.quantity*10+"/mo ");
          if(json.subscription_info.quantity !== 1) {
            $("#pubdash-total__subscription-sites").children().eq(1).text(json.subscription_info.quantity+" active sites");
          } else {
            $("#pubdash-total__subscription-sites").children().eq(1).text(json.subscription_info.quantity+" active site");
          }
          $(".pubdash-total__subscription-due_amt").text(json.subscription_info.quantity*10);
          $(".pubdash-total__subscription-due_date").text(unixToDate(json.subscription_info.current_period_end));
          
          $.ajax({
            method: "GET",
            url: p001_url,
            headers: {
              "Authorization" : "Token "+""+st
            },
            data: {
              nocache: cdt()
            },
            success:function(json) {
              payment_methods = json.data;
              // has payment methods, load default method
              if(json) {
                $.ajax({
                  method: "GET",
                  url: p002_url,
                  headers: {
                    "Authorization" : "Token "+""+st
                  },
                  data: {
                    nocache: cdt()
                  },
                  success:function(json) {
                    $.each(payment_methods, function(idx, data) {
                      let _card = data.card.brand.charAt(0).toUpperCase() + data.card.brand.slice(1);
                      if(data.id===json) {
                        $(".pubdash__primarypayment_msg").text(_card+ending_in);
                        $(".pubdash__primarypayment_crd").text(data.card.last4);
                        $(".pubdash__primarypayment_exp").text(" ("+pad(data.card.exp_month)+"/"+data.card.exp_year.toString().substr(-2)+")");
                      }
                    });
                  },
                  error:function(request, status, error) {
                    console.log(request.status);
                  }
                });
              }
            },
            error:function(request, status, error) {
              console.log(request.status);
            }
          });
        } else {
          $(".subscription-progress-loader").remove();
          $("#pubdash-total-sitesubscriptions").remove();
        }
      },
      error:function(request, status, error) {
        console.log(request.status);
      }
    });    
  }
  
});
