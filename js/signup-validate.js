"use strict";

function anim_msg(ele, msg) {
  let t = 250;
  $(ele).addClass("fadeOutRight");
  setTimeout(() => {
    $(ele).text(msg);
    $(ele).removeClass("fadeOutRight");
    $(ele).addClass("fadeInLeft");
    setTimeout(() => {
      $(ele).removeClass("fadeInLeft");
    },t);
  },t);
}

function ve(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function err_clear() {
  // clear form on error
  
}

$(function(){

  const msg_email = "Email";
  const msg_email_2 = "Must be a valid email";
  const msg_email_3 = "Less than 50 characters";
  const msg_uname = "Username";
  const msg_uname_2 = "Between 4-30 characters";
  const msg_uname_3 = "Invalid special characters";
  const msg_pass = "Password";
  const msg_pass_2 = "Between 8-128 characters";
  const msg_pass_3 = "Uppercase and lowercase characters";
  const msg_pass_4 = "One or more numbers";
  const msg_pass_5 = "One or more special characters";
  const msg_pass_6 = "Passwords do not match";
  const msg_pass_re = "Retype password";
  const msg_good = "Good to go!";
  
  const m181_url = "http://"+window.location.hostname+":"+window.location.port+"/api/username-check/";
  
  const upper_case = new RegExp('[A-Z]');
  const lower_case = new RegExp('[a-z]');
  
  let v_0 = false;
  let v_1 = false;
  let v_2 = false;
  let v_3 = false;
  let v_4 = false;
  let v_5 = false;
      
  let check_username = null;
  
  let signup_validate_constraint = document.getElementById("signup-validate-constraint");
  let signup_validate_console = document.getElementById("signup-validate-console");
  let sign_opt_email = document.getElementById("sign-opt-email");
  let sign_opt_uname = document.getElementById("sign-opt-uname");
  let sign_opt_pass1 = document.getElementById("sign-opt-pass1");
  let sign_opt_pass2 = document.getElementById("sign-opt-pass2");
  let sign_submit_card = document.getElementById("sign-submit-card");
  let sign_opt_tos_pp = document.getElementById("sign-opt-tos-pp");
  let sign_opt_age_pp = document.getElementById("sign-opt-age-pp");
  
  Enforcer(sign_opt_email);
  Enforcer(sign_opt_uname);
  Enforcer(sign_opt_pass1);
  Enforcer(sign_opt_pass2);
  
  // check fields for completion after on error
  if(ve($(sign_opt_email).val())) {
    if($(sign_opt_email).val().length <= 50) {
      v_0 = true;
      if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
        $(sign_submit_card).removeClass("l--a-f-f_disable");
      }
    }
  }
  if($(sign_opt_uname).val().length >= 4 && $(sign_opt_uname).val().length <= 30) {
    if(!$(sign_opt_uname).val().match(/(?![-._])[\W]/)) {
      $.ajax({
        method: "POST",
        url: m181_url,
        data: {
          username: $(sign_opt_uname).val()
        },
        success:function(json) {
          v_1 = true;
          if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
            $(sign_submit_card).removeClass("l--a-f-f_disable");
          }
        },
        error:function(request, status, error) {}
      });
    }
  }
  if($(sign_opt_pass1).val().length >= 8 && $(sign_opt_uname).val().length <= 128) {
    if($(sign_opt_pass1).val().match(upper_case) && $(sign_opt_pass1).val().match(lower_case)) {
      if($(sign_opt_pass1).val().match(/[\W_]/)) {
        if($(sign_opt_pass1).val().match(/\d+/g)) {
          v_2 = true;
          if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
            $(sign_submit_card).removeClass("l--a-f-f_disable");
          }
        }
      }
    }
  }
  if($(sign_opt_pass1).val().length >= 8 && $(sign_opt_uname).val().length <= 128) {
    if($(sign_opt_pass1).val().match(upper_case) && $(sign_opt_pass1).val().match(lower_case)) {
      if($(sign_opt_pass1).val().match(/[\W_]/)) {
        if($(sign_opt_pass1).val().match(/\d+/g)) {
          if($(sign_opt_pass1).val() === $(sign_opt_pass2).val()) {
            v_3 = true;
            if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
              $(sign_submit_card).removeClass("l--a-f-f_disable");
            }
          }
        }
      }
    }
  }
  if(sign_opt_tos_pp.checked) {
    v_4 = true;
    if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
      $(sign_submit_card).removeClass("l--a-f-f_disable");
    }
  }
  if(sign_opt_age_pp.checked) {
    v_5 = true;
    if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
      $(sign_submit_card).removeClass("l--a-f-f_disable");
    }
  }
  
  ///////////////////////////////////////////////////////
  
  
  $("#open-source-attribution-footer").hide(350);
  
  $(sign_opt_email).focus(() => {
    $(signup_validate_console).css("background", "#3C6CC4");
    anim_msg(signup_validate_constraint, msg_email);
  }).focusout(() => {
    anim_msg(signup_validate_constraint, "");
    $(signup_validate_console).css("background", "#3C6CC4");
  });
  $(sign_opt_uname).focus(() => {
    $(signup_validate_console).css("background", "#3C6CC4");
    anim_msg(signup_validate_constraint, msg_uname);
  }).focusout(() => {
    anim_msg(signup_validate_constraint, "");
    $(signup_validate_console).css("background", "#3C6CC4");
  });
  $(sign_opt_pass1).focus(() => {
    $(signup_validate_console).css("background", "#3C6CC4");
    anim_msg(signup_validate_constraint, msg_pass);
  }).focusout(() => {
    anim_msg(signup_validate_constraint, "");
    $(signup_validate_console).css("background", "#3C6CC4");
  });
  $(sign_opt_pass2).focus(() => {
    $(signup_validate_console).css("background", "#3C6CC4");
    anim_msg(signup_validate_constraint, msg_pass_re);
  }).focusout(() => {
    anim_msg(signup_validate_constraint, "");
    $(signup_validate_console).css("background", "#3C6CC4");
  });
  
  // email validation process
  $(sign_opt_email).on('keyup change', () => {
    $(signup_validate_console).css("background", "#3C6CC4");
    v_0 = false;
    $(sign_submit_card).addClass("l--a-f-f_disable");
    if(ve($(sign_opt_email).val())) {
      if($(sign_opt_email).val().length <= 50) {
        $(signup_validate_constraint).text(msg_good);
        $(signup_validate_console).css("background", "#3CC46C");
        v_0 = true;
        if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
          $(sign_submit_card).removeClass("l--a-f-f_disable");
        }
      } else {
        $(signup_validate_constraint).text(msg_email_3);
      }
    } else {
      $(signup_validate_constraint).text(msg_email_2);
    }
  });
  
  $(sign_opt_uname).on('keyup change', () => {
    v_1 = false;
    $(sign_submit_card).addClass("l--a-f-f_disable");
    $(signup_validate_constraint).text("");
    $(signup_validate_console).css("background", "#3C6CC4");
    window.clearTimeout(check_username);
    if($(sign_opt_uname).val().length >= 4 && $(sign_opt_uname).val().length <= 30) {
      if(!$(sign_opt_uname).val().match(/(?![-._])[\W]/)) {
        check_username = window.setTimeout(() => {
          $.ajax({
            method: "POST",
            url: m181_url,
            data: {
              username: $(sign_opt_uname).val()
            },
            success:function(json) {
              if($(sign_opt_uname).is(":focus")) {
                $(signup_validate_constraint).text(msg_good);
                $(signup_validate_console).css("background", "#3CC46C");
              }
              v_1 = true;
              if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
                $(sign_submit_card).removeClass("l--a-f-f_disable");
              }
            },
            error:function(request, status, error) {
              $(signup_validate_constraint).text(request.responseText.replace(/\"/g,''));
            }
          });
        },500);
      } else {
        $(signup_validate_constraint).text(msg_uname_3);
      }
    } else {
      $(signup_validate_constraint).text(msg_uname_2);
    }
  });
  
  $(sign_opt_pass1).on('keyup change', () => {
    $(signup_validate_console).css("background", "#3C6CC4");
    v_2 = false;
    $(sign_submit_card).addClass("l--a-f-f_disable");
    if($(sign_opt_pass1).val().length >= 8 && $(sign_opt_uname).val().length <= 128) {
      if($(sign_opt_pass1).val().match(upper_case) && $(sign_opt_pass1).val().match(lower_case)) {
        if($(sign_opt_pass1).val().match(/[\W_]/)) {
          if($(sign_opt_pass1).val().match(/\d+/g)) {
            v_2 = true;
            if($(sign_opt_pass2).val().length > 0) {
              if($(sign_opt_pass1).val() === $(sign_opt_pass2).val()) {
                $(signup_validate_constraint).text(msg_good);
                $(signup_validate_console).css("background", "#3CC46C");
                v_3 = true;
                if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
                  $(sign_submit_card).removeClass("l--a-f-f_disable");
                }
              } else {
                v_3 = false;
                $(signup_validate_constraint).text(msg_pass_6);
              }
            } else {
              $(signup_validate_constraint).text(msg_good);
              $(signup_validate_console).css("background", "#3CC46C");
              if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
                $(sign_submit_card).removeClass("l--a-f-f_disable");
              }
            }
          } else {
            $(signup_validate_constraint).text(msg_pass_4);
          }
        } else {
          $(signup_validate_constraint).text(msg_pass_5);
        }
      } else {
        $(signup_validate_constraint).text(msg_pass_3);
      }
    } else {
      $(signup_validate_constraint).text(msg_pass_2);
    }
  });
  
  $(sign_opt_pass2).on('keyup change', () => {
    $(signup_validate_console).css("background", "#3C6CC4");
    v_3 = false;
    $(sign_submit_card).addClass("l--a-f-f_disable");
    if($(sign_opt_pass1).val().length >= 8 && $(sign_opt_uname).val().length <= 128) {
      if($(sign_opt_pass1).val().match(upper_case) && $(sign_opt_pass1).val().match(lower_case)) {
        if($(sign_opt_pass1).val().match(/[\W_]/)) {
          if($(sign_opt_pass1).val().match(/\d+/g)) {
            if($(sign_opt_pass1).val() === $(sign_opt_pass2).val()) {
              $(signup_validate_constraint).text(msg_good);
              $(signup_validate_console).css("background", "#3CC46C");
              v_3 = true;
              if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
                $(sign_submit_card).removeClass("l--a-f-f_disable");
              }
            } else {
              $(signup_validate_constraint).text(msg_pass_6);
            }
          } else {
            $(signup_validate_constraint).text(msg_pass_4);
          }
        } else {
          $(signup_validate_constraint).text(msg_pass_5);
        }
      } else {
        $(signup_validate_constraint).text(msg_pass_3);
      }
    } else {
      $(signup_validate_constraint).text(msg_pass_2);
    }
  });
  
  $(sign_opt_tos_pp).click(() => {
    $(signup_validate_console).css("background", "#3C6CC4");
    anim_msg(signup_validate_constraint, "");
    if(sign_opt_tos_pp.checked) {
      v_4 = true;
      if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
        $(sign_submit_card).removeClass("l--a-f-f_disable");
      }
    } else {
      $(sign_submit_card).addClass("l--a-f-f_disable");
      v_4 = false;
    }
  });
  
  $(sign_opt_age_pp).click(() => {
    $(signup_validate_console).css("background", "#3C6CC4");
    anim_msg(signup_validate_constraint, "");
    if(sign_opt_age_pp.checked) {
      v_5 = true;
      if(v_0 && v_1 && v_2 && v_3 && v_4 && v_5) {
        $(sign_submit_card).removeClass("l--a-f-f_disable");
      }
    } else {
      $(sign_submit_card).addClass("l--a-f-f_disable");
      v_5 = false;
    }
  });
  
  $(sign_submit_card).click((e) => {
    if(!$(e.target).hasClass("l--a-f-f_disable")) {
      $(e.target).addClass("l--a-f-f_disable");
    }
  });

});
