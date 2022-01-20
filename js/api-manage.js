"use strict";
function pad(n) {
  return (n < 10 ? '0' : '') + n;
}

function update_payment_methods(st,p001_url,p002_url) {
  // Stripe Payment information
  $(".altpayment").remove();
  let payment_methods = [];
  const ending_in = " ending in: ";
  if(st) {
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
        // has payment methods, load default method
        if(json) {
          payment_methods = json.data;
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
                console.log(data);
                if(data.id===json) {
                  $(".manage__primarypayment_msg").text(_card+ending_in);
                  $(".manage__primarypayment_crd").text(data.card.last4);
                  $(".manage__primarypayment_exp").text(" ("+pad(data.card.exp_month)+"/"+data.card.exp_year.toString().substr(-2)+")");
                } else {
                  let other_card = $(".manage__altpayment-dummy").clone(true, true);
                  $(other_card).find("span").text(_card+ending_in+data.card.last4+" ("+pad(data.card.exp_month)+"/"+data.card.exp_year.toString().substr(-2)+")");
                  $($(other_card).removeClass("manage__altpayment-dummy").addClass("altpayment").attr("data-pmid", data.id)).appendTo("#manage__otherpayments_list");
                }
                
                if(payment_methods.length <= 1 && json) {
                  $(".manage__otherpayments").remove();
                } else {
                  $(".manage__otherpayments").show();
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
  }
}


function cdt() {
  let dt = new Date();
  return dt.getTime();
}

function ve(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function set_email(e) {
  let private_email = e.slice(0, e.lastIndexOf('@') + 1);
  private_email += String.fromCharCode(8226) + String.fromCharCode(8226) + String.fromCharCode(8226) + String.fromCharCode(8226);
  $("#mjf-fr__curremail").text(private_email);  
}


$(function(){
  
  const m173_url = "http://"+window.location.hostname+":"+window.location.port+"/api/account/";
  const m169_url = "http://"+window.location.hostname+":"+window.location.port+"/api/change-password/";
  const m192_url = "http://"+window.location.hostname+":"+window.location.port+"/api/change-email/";
  const m181_url = "http://"+window.location.hostname+":"+window.location.port+"/api/username-check/";
  const m111_url = "http://"+window.location.hostname+":"+window.location.port+"/account/logout/";
  const m019_url = "http://"+window.location.hostname+":"+window.location.port+"/api/is-2fa-enabled/";
  const p001_url = "http://"+window.location.hostname+":"+window.location.port+"/api/payment-methods/";
  const p002_url = "http://"+window.location.hostname+":"+window.location.port+"/api/payment-methods/default/";
  const m887_url = "http://"+window.location.hostname+":"+window.location.port+"/api/sign-out-everywhere/";
  
  const m139_url = "http://"+window.location.hostname+":"+window.location.port+"/api/email-verification/status/";
  const m138_url = "http://"+window.location.hostname+":"+window.location.port+"/api/email-verification/resend-link/";
  
  const m121_url = "http://"+window.location.hostname+":"+window.location.port+"/api/profile/toggle-nsfw/";
  const m120_url = "http://"+window.location.hostname+":"+window.location.port+"/api/profile/";
  
  /*
  
  /api/payment-methods/ - GET/DELETE
  	GET:	
  		Description: Returns a list of payment methods attached to your account.
  		URL Parameters: None
  		Fields: None
  		Note: None
  	DELETE:
  		Description: Deletes a specified non-default payment method.
  		URL Parameters: None
  		Fields: ‘payment_method’ (Stripe payment_method ID)
          Note: Use GET to retrieve a list of payment_method IDs attached to your account.

  /api/payment-methods/default/ - GET/POST
  	GET:
  		Description: Returns your account’s default payment method ID.
  		URL Parameters: None
  		Fields: None
  		Note: None
  	POST:
  		Description: Set a new default payment method for your account.
  		URL Parameters: None
  		Fields: ‘payment_method’ (Stripe payment_method ID)
  		Note: None
  
  */
  
  const upper_case = new RegExp('[A-Z]');
  const lower_case = new RegExp('[a-z]');
  
  const _2fa_enabled = "Enabled";
  const _2fa_disabled = "Disabled";
  
  const apit = "apitoken";
    
  let st = Cookies.get(apit);
  
  let mjf_form__u_input = document.getElementById("mjf-form--u_input");
  let mjf_form__u_submit = document.getElementById("mjf-form--u_submit");
  let mjf_form__u_chrcnt = document.getElementsByClassName("mjf-form--u_chrcnt");
  let __u__r0 = document.getElementsByClassName("__u__r0");
  let __u__r1 = document.getElementsByClassName("__u__r1");
  let __u__r2 = document.getElementsByClassName("__u__r2");
  
  let mjf_form__p_submit = document.getElementById("mjf-form--p_submit");
  let mjf_form__p_old = document.getElementById("mjf-form--p_old");
  let mjf_form__p_new = document.getElementById("mjf-form--p_new");
  let mjf_form__p_newre = document.getElementById("mjf-form--p_newre");
  let mjf_form__p_match = document.getElementsByClassName("mjf-form--p_match");
  let __p__r0 = document.getElementsByClassName("__p__r0");
  let __p__r1 = document.getElementsByClassName("__p__r1");
  let __p__r2 = document.getElementsByClassName("__p__r2");
  
  let mjf_form__e_new = document.getElementById("mjf-form--e_new");
  let mjf_form__e_submit = document.getElementById("mjf-form--e_submit");
  
  let mjf_form__d_cancel = document.getElementById("mjf-form--d_cancel");
  let mjf_form__d_pass = document.getElementById("mjf-form--d_pass");
  let mjf_form__d_submit = document.getElementById("mjf-form--d_submit");
  
  let mjf_fr__signoutall = document.getElementById("mjf-fr__signoutall");

  const unsift_url = "/account/login/";
  
  const err_280 = "Usernames must not be longer than 30 characters";
  const err_281 = "Usernames must be at least 4 characters long";
  const err_807 = "Usernames cannot contain special characters (except dots, dashes, and underscores)";
  //const err_409 = "Conflict";
  const err_409a = "Username is taken";
  const err_400_verbose = "Could not change username";
  const err_400 = "Bad Request";
  const err_409a_verbose = "This username is already in use";
  const err_409b = "This is your current username";
  const err_128 = "Passwords do not match";
  const err_129 = "Password must contain at least 1 special character";
  const err_130 = "Password must contain at least 1 lowercase character";
  const err_131 = "Password must contain at least 1 uppercase character";
  const err_132 = "Passwords must be at least 8 characters long";
  const err_133 = "Email address is not valid";
  const msg_172 = "Changed your username successfully";
  const msg_173 = "Changed your password successfully";
  const msg_174 = "We sent you a verification link. Please verify your new email address.";
  const err_907 = "Your username is not correct";
  
  const msg_191 = "Resend link";
  const msg_192 = "Email verified";
      
  let unique_username = false;
  let bad_request = false;
  
  let this_username;
  
  let check_username;
  
  if(st) {
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
        console.log(json);
        $("#mjf-fr__curruname").text(json.username);
        set_email(json.email);
        this_username = json.username;
      },
      error:function(request, status, error) {
        show_sys_error_notification();
      }
    });
    
    $.ajax({
      method: "GET",
      url: m120_url,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        console.log(json);
        let nsfw_switch = $(".manage-nsfw-switch input").closest(".manage-nsfw-switch").find("span");
        if(json.show_NSFW) {
          // toggle switch
          $(nsfw_switch).removeClass("slider-disabled");
          $(nsfw_switch).addClass("slider-verify");
          $(".manage-nsfw-switch input").prop("checked", true);
        } else {
          $(nsfw_switch).removeClass("slider-verify");
          $(nsfw_switch).addClass("slider-disabled");
          $(".manage-nsfw-switch input").prop("checked", false);
        }
      },
      error:function(request, status, error) {
        show_sys_error_notification();
      }
    });
    
    update_payment_methods(st,p001_url,p002_url);
    
    // check verification status
    $.ajax({
      method: "GET",
      url: m139_url,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        console.log(json);
        if(!json.email_verified) {
          // resend link
          $("#mjf__email_verification").show();
          $("#mjf-fr__resendverification").html(msg_191);
          $("#mjf-fr__resendverification").click((e) => {
            $(e.target).addClass("l--a-f-f_disable--transparent");
            $.ajax({
              method: "GET",
              url: m138_url,
              headers: {
                "Authorization" : "Token "+""+st
              },
              data: {
                nocache: cdt()
              },
              success:function(json) {
                console.log(json);
                $(e.target).removeClass("l--a-f-f_disable--transparent");
                show_info_notification("Your verification link was sent to your email address");
              },
              error:function(request, status, error) {
                console.log(request.status);
                $(e.target).removeClass("l--a-f-f_disable--transparent");
              }
            });
          });
        } else {
          $("#mjf__email_verification").remove();
        }
      },
      error:function(request, status, error) {
        console.log(request.status);
      }
    });
    
    $(".manage-nsfw-switch input").click((e) => {
      let nsfw_switch = $(e.target).closest(".manage-nsfw-switch").find("span");
      if($(e.target).is(':checked')) {
        $.confirm({
          title: 'View NSFW (Not Safe For Work) content',
          content: 'Are you at least 18 years old and willing to view adult content?',
          typeAnimated: false,
          type: "red",
          draggable: false,
          theme: 'modern',
          backgroundDismiss: function(){
            $(e.target).prop("checked", false);
          },
          buttons: {
            yes: function () {
              $(nsfw_switch).removeClass("slider-disabled");
              $(nsfw_switch).addClass("slider-verify");
              // toggle nsfw
              $.ajax({
                method: "GET",
                url: m121_url,
                headers: {
                  "Authorization" : "Token "+""+st
                },
                data: {
                  nocache: cdt()
                },
                success:function(json) {
                  console.log(json);
                },
                error:function(request, status, error) {
                  console.log(request.status+" "+error);
                }
              });
            },
            no: function () {
              $(e.target).prop("checked", false);
            },
          }
        });
      } else {
        $(nsfw_switch).removeClass("slider-verify");
        $(nsfw_switch).addClass("slider-disabled");
        // toggle nsfw
        $.ajax({
          method: "GET",
          url: m121_url,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            nocache: cdt()
          },
          success:function(json) {
            console.log(json);
          },
          error:function(request, status, error) {
            console.log(request.status+" "+error);
          }
        });
      }
    });
    
    
    $(".manage__changeprimary").click((e) => {
      let pmid = $(e.target).parent().attr("data-pmid");
      if(pmid) {
        $.ajax({
          method: "POST",
          url: p002_url,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            payment_method: pmid
          },
          success:function(json) {
            show_info_notification("Your primary payment method was updated");
            update_payment_methods(st,p001_url,p002_url);
          },
          error:function(request, status, error) {}
        });
      }
    });
    
    
    $(".manage__deletealt").click((e) => {
      let pmid = $(e.target).parent().attr("data-pmid");
      if(pmid) {
        $.ajax({
          method: "DELETE",
          url: p001_url,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            payment_method: pmid
          },
          success:function(json) {
            show_info_notification("Your alternative payment method was removed");
            update_payment_methods(st,p001_url,p002_url);
          },
          error:function(request, status, error) {}
        });
      }
    });
    
    
    $(mjf_fr__signoutall).click(() => {
      // 
      $.ajax({
        method: "GET",
        url: m887_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          window.location.replace(unsift_url);
        },
        error:function(request, status, error) {
          show_sys_error_notification();
        }
      });
    });
    
    
    $(mjf_form__u_input).keyup(() => {
      window.clearTimeout(check_username);
      check_username = window.setTimeout(() => {
        if($(mjf_form__u_input).val().length >= 4 && $(mjf_form__u_input).val().length <= 30) {
          $.ajax({
            method: "POST",
            url: m181_url,
            data: {
              username: $(mjf_form__u_input).val()
            },
            success:function(json) {
              $(mjf_form__u_submit).removeClass("l--a-f-f_disable");
              $(mjf_form__u_chrcnt).removeClass("err_409a");
              unique_username = true;
            },
            error:function(request, status, error) {
              if(request.status === 409) {
                unique_username = false;
                $(mjf_form__u_submit).addClass("l--a-f-f_disable");
                if($(mjf_form__u_input).val() != this_username) {
                  $(mjf_form__u_chrcnt).text((request.responseText).replace(/"/g, ''));
                  $(mjf_form__u_chrcnt).addClass("err_409a");
                } else {
                  $(mjf_form__u_chrcnt).text(err_409b);
                  $(mjf_form__u_chrcnt).removeClass("err_409a");
                }
              }
            }
          });
        }
      },500);
    });
    
    $(mjf_form__u_submit).click(() => {
      //console.log($(mjf_form__u_input).val().match(/(?![-._])[\W]/));
      let parent = $(mjf_form__u_submit).closest("li");
      if($(mjf_form__u_input).val().length >= 4) {
        if($(mjf_form__u_input).val().length <= 30) {
          if(!$(mjf_form__u_input).val().match(/(?![-._])[\W]/)) {
            if(unique_username) {
              $(".mpl__u").css("visibility", "visible");
              $(".mpl__u-h").css({
                "pointer-events":"none",
                "opacity":"0.5"
              });
              setTimeout(() => {
                $.ajax({
                  method: "PATCH",
                  url: m173_url,
                  headers: {
                    "Authorization" : "Token "+""+st
                  },
                  data: {
                    username: $(mjf_form__u_input).val(),
                    nocache: cdt()
                  },
                  success:function(json) {
                    $(".mpl__u").css("visibility", "hidden");
                    $(".mpl__u-h").css({
                      "pointer-events":"",
                      "opacity":""
                    });
                    $("#mjf-fr__curruname").text($(mjf_form__u_input).val());
                    this_username = $(mjf_form__u_input).val();
                    // show loader while working, collapse once done, show message, clear inputs
                    $(parent).find(".mjf-form").removeClass("mjf-form__show");
                    $(parent).removeClass("mjf__dropdown");
                    $(parent).find(".mjf--opt").removeClass("mjf-icn-fd");
                    $(mjf_form__u_input).val("");
                    $(mjf_form__u_submit).addClass("l--a-f-f_disable");
                    $(mjf_form__u_chrcnt).text("");
                    $(mjf_form__u_chrcnt).html('&zwnj;');
                    
                    show_info_notification(msg_172);
                    $(__u__r0).css("color", "#C43C3C");
                    $(__u__r1).css("color", "#C43C3C");
                    $(__u__r2).css("color", "#C43C3C");
                    
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
              },0);
            } else {
              show_error_notification(err_409a_verbose, "Oops!");
            }
          } else {
            show_error_notification(err_807, "Oops!");
          }
        } else {
          show_error_notification(err_280, "Oops!");
        }
      } else {
        show_error_notification(err_281, "Oops!");
      }
    });
    
    
    $(mjf_form__p_submit).click(() => {
      let parent = $(mjf_form__p_submit).closest("li");
      // if new password meets requirements and equals retype
      if($(mjf_form__p_new).val().length >= 8) {
        if($(mjf_form__p_new).val().match(upper_case)) {
          if($(mjf_form__p_new).val().match(lower_case)) {
            if($(mjf_form__p_new).val().match(/[\W_]/)) {
              if($(mjf_form__p_new).val()==$(mjf_form__p_newre).val()) {
                $("body").css("pointer-events", "none");
                $(".mpl__p").css("visibility", "visible");
                $(".mpl__p-h").css({
                  "pointer-events":"none",
                  "opacity":"0.5"
                });
                $.ajax({
                  method:"PATCH",
                  url:m169_url,
                  headers: {
                    "Authorization" : "Token "+""+st
                  },
                  data: {
                    old_password: $(mjf_form__p_old).val(),
                    new_password: $(mjf_form__p_new).val(),
                    nocache: cdt()
                  },
                  success:function(json) {
                    $("body").css("pointer-events", "auto");
                    $(".mpl__p").css("visibility", "hidden");
                    $(".mpl__p-h").css({
                      "pointer-events":"",
                      "opacity":""
                    });
                    $(parent).removeAttr("style");
                    $(parent).find(".mjf-form").removeClass("mjf-form__show");
                    $(parent).removeClass("mjf__dropdown");
                    $(parent).find(".mjf--opt").removeClass("mjf-icn-fd");
                    $(mjf_form__p_old).val("");
                    $(mjf_form__p_new).val("");
                    $(mjf_form__p_newre).val("");
                    $(mjf_form__p_submit).addClass("l--a-f-f_disable");
                    $(mjf_form__p_match).text("");
                    $(mjf_form__p_match).html('&zwnj;');
                    $(__p__r0).css("color", "#C43C3C");
                    $(__p__r1).css("color", "#C43C3C");
                    $(__p__r2).css("color", "#C43C3C");
                    
                    show_info_notification(msg_173);
                  },
                  error:function(request, status, error) {
                    $("body").css("pointer-events", "auto");
                    $(".mpl__p").css("visibility", "hidden");
                    $(".mpl__p-h").css({
                      "pointer-events":"",
                      "opacity":""
                    });
                    
                    // handle errors here
                    try {
                      $.each(request.responseJSON, function(idx, data) {
                        show_error_notification(data, "Oops!");
                      }); 
                    } catch(e) {
                      show_error_notification(request.responseJSON, "Oops!");
                    }
                  }
                });
              } else {
                show_error_notification(err_128, "Oops!");
              }
            } else {
              show_error_notification(err_129, "Oops!");
            }
          } else {
            show_error_notification(err_130, "Oops!");
          }
        } else {
          show_error_notification(err_131, "Oops!");
        }
      } else {
        show_error_notification(err_132, "Oops!");
      }
    });
    
    
    $(mjf_form__e_submit).click(() => {
      let parent = $(mjf_form__e_submit).closest("li");
      if(ve($(mjf_form__e_new).val())) {
        $(".mpl__e").css("visibility", "visible");
        $(".mpl__e-h").css({
          "pointer-events":"none",
          "opacity":"0.5"
        });
        $.ajax({
          method: "PATCH",
          url: m192_url,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            email: $(mjf_form__e_new).val(),
            nocache: cdt()
          },
          success:function(json) {
            $(".mpl__e").css("visibility", "hidden");
            $(".mpl__e-h").css({
              "pointer-events":"",
              "opacity":""
            });
            set_email($(mjf_form__e_new).val());            
            $(parent).removeAttr("style");
            $(parent).find(".mjf-form").removeClass("mjf-form__show");
            $(parent).removeClass("mjf__dropdown");
            $(parent).find(".mjf--opt").removeClass("mjf-icn-fd");
            $(mjf_form__e_new).val("");
            $(mjf_form__e_submit).addClass("l--a-f-f_disable");
            show_info_notification(msg_174);
          },
          error:function(request, status, error) {
            $(".mpl__e").css("visibility", "hidden");
            $(".mpl__e-h").css({
              "pointer-events":"",
              "opacity":""
            });
            
            // handle errors here
            try {
              $.each(request.responseJSON, function(idx, data) {
                show_error_notification(data, "Oops!");
              }); 
            } catch(e) {
              show_error_notification(request.responseJSON, "Oops!");
            }
          }
        });
      } else {
        show_error_notification(err_133, "Oops!");
      }
    });
    
    $(mjf_form__d_pass).keyup(() => {
      if($(mjf_form__d_pass).val().length > 7) {
        $(mjf_form__d_submit).removeClass("l--a-f-f_disable");
      } else {
        $(mjf_form__d_submit).addClass("l--a-f-f_disable");
      }
    });
    
    // check if 2fa is enabled on page load to determine if 2fa is needed with password
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
        // inform other scripts if 2fa is enabled
        $("#mjf-form--d__wrap").attr("data-2fa", json);
        if(json) {
          // has 2fa
          // show account deletion form with 2fa 6-digit code field
          // show password
          console.log("has 2fa");
          
          $("#mjf-fr__curr2fa").css("color", "#3CC46C");
          $("#mjf-fr__curr2fa").text(_2fa_enabled);
          $("#mjf-fr__curr2fa").attr("title", "Disable two-factor authentication");
          $("#mjf-fr__curr2fa").attr("href", "/account/two_factor/disable/");

          // show password field AND 6-digit code
          $("#mjf-form--2fa_prompt").css("display", "block");
          $("#mjf-form--2fa_pass").css("display", "flex");
          let s;
          // disable delete account button until code is input
          $("#mjf-form--2fa_pass input").keyup(() => {
            s = false;
            $("#mjf-form--2fa_pass input").each(function(idx, obj) {
              if(!$(obj).val()) {
                s = true
              } 
            });
            if(s) {
              $(mjf_form__d_submit).addClass("l--a-f-f_disable__guard");
            } else {
              $(mjf_form__d_submit).removeClass("l--a-f-f_disable__guard");
            }
          });
        } else {
          // doesn't have 2fa
          // show password
          console.log("does not have 2fa");
          $("#mjf-fr__curr2fa").css("color", "#C43C3C");
          $("#mjf-fr__curr2fa").text(_2fa_disabled);
          $("#mjf-fr__curr2fa").attr("title", "Enable two-factor authentication");
          $("#mjf-fr__curr2fa").attr("href", "/account/two_factor/");
          $("#mjf-form--2fa_prompt").remove();
          $("#mjf-form--2fa_pass").remove();
        }
      },
      // should never occur
      error:function(request, status, error) {
        console.log(error);
      }
    });
    
    
    $(mjf_form__d_submit).click(() => {
      //if($(mjf_form__d_pass).val()==this_username) {
      let authcode = "";
      
      if($("#mjf-form--d__wrap").attr("data-2fa")) {
        authcode = parseInt($("#mjf-form--2fa_pass").val());
      }
      
      console.log(authcode);
      
      setTimeout(() => {
        $.ajax({
          method: "DELETE",
          url: m173_url,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            password: $(mjf_form__d_pass).val(),
            token: authcode,
            nocache: cdt()
          },
          success:function(json) {
            // log out and redirect to homepage
            window.location.replace(m111_url);
          },
          error:function(request, status, error) {
            if(request.status === 409) {
              $.confirm({
                title: 'You have sites on Unsift',
                content: 'You must cancel all of your site subscriptions before deleting your Unsift account.',
                typeAnimated: false,
                type: "red",
                draggable: false,
                theme: 'modern',
                backgroundDismiss: function(){
                  return true;
                },
                buttons: {
                  publisher_dashboard: {
                    text: 'Publisher Dashboard',
                    action: function(publisher_dashboard){
                      window.location.href = "/publisher-dashboard/";
                    }
                  },
                  cancel: function () {
                    return true;
                  },
                }
              });
            } else {
              try {
                $.each(request.responseJSON, function(idx, data) {
                  show_error_notification(data, "Oops!");
                }); 
              } catch(e) {
                show_error_notification(request.responseJSON, "Oops!");
              }
            }
          }
        });
      },0);
    });
    
    // check if user has 2fa - require password regardless
    // send POST request to token endpoint - if returns 200 then delete account
    // token endpoint takes 'username' and 'password' parameters
    // if 2fa is disabled - returns 400
    
  }
  
});