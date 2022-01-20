
/*

/api/account/ for changing your name or username, 
/api/change-password/ and /api/change-email/


*/
"use strict";

function chkpmtch(err, msg, mjf_form__p_new, mjf_form__p_newre, mjf_form__p_match) {
  if($(mjf_form__p_new).val().length==0 || $(mjf_form__p_newre).val().length==0) {
    $(mjf_form__p_match).text("");
    $(mjf_form__p_match).html('&zwnj;');
    return false;
  } else {
    if($(mjf_form__p_new).val()==$(mjf_form__p_newre).val()) {
      // passwords match
      $(mjf_form__p_match).css("color", "#3CC46C");
      $(mjf_form__p_match).text(msg);
      return true;
    } else {
      $(mjf_form__p_match).css("color", "#C43C3C");
      $(mjf_form__p_match).text(err);
      return false;
    }
  }
}

function ve(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

$(function(){
  
  $(".mjf--opt").click(function(){
    let p = $(this).parent();
    $(p).addClass("mjf__dropdown");
    $(p).find(".mjf-form").addClass("mjf-form__show");
    $(this).addClass("mjf-icn-fd");
  });

  
  const err_102 = "Passwords do not match";
  const msg_103 = "Passwords match!";
  
  const upper_case = new RegExp('[A-Z]');
  const lower_case = new RegExp('[a-z]');
  //const numbers = new RegExp('[0-9]');
  
  let mjf_form__u_input = document.getElementById("mjf-form--u_input");
  let mjf_form__u_cancel = document.getElementById("mjf-form--u_cancel");
  let mjf_form__u_submit = document.getElementById("mjf-form--u_submit");
  let mjf_form__u_chrcnt = document.getElementsByClassName("mjf-form--u_chrcnt");
  
  let mjf_form__p_cancel = document.getElementById("mjf-form--p_cancel");
  let mjf_form__p_submit = document.getElementById("mjf-form--p_submit");
  let mjf_form__p_old = document.getElementById("mjf-form--p_old");
  let mjf_form__p_new = document.getElementById("mjf-form--p_new");
  let mjf_form__p_newre = document.getElementById("mjf-form--p_newre");
  let mjf_form__p_match = document.getElementsByClassName("mjf-form--p_match");
  
  let __u__r0 = document.getElementsByClassName("__u__r0");
  let __u__r1 = document.getElementsByClassName("__u__r1");
  let __u__r2 = document.getElementsByClassName("__u__r2");
  
  let __p__r0 = document.getElementsByClassName("__p__r0");
  let __p__r1 = document.getElementsByClassName("__p__r1");
  let __p__r2 = document.getElementsByClassName("__p__r2");
  
  let mjf_form__e_new = document.getElementById("mjf-form--e_new");
  let mjf_form__e_submit = document.getElementById("mjf-form--e_submit");
  let mjf_form__e_cancel = document.getElementById("mjf-form--e_cancel");
  
  let mjf_form__d_cancel = document.getElementById("mjf-form--d_cancel");
  let mjf_form__d_pass = document.getElementById("mjf-form--d_pass");
  let mjf_form__d_submit = document.getElementById("mjf-form--d_submit");
  
  let manage__addpayment_cancel = document.getElementById("manage__addpayment_cancel");
  
  let mtch = undefined;
  
  $.each($("input[type='text']"), function(idx, data) {
    Enforcer(data);
  });
  $.each($("input[type='password']"), function(idx, data) {
    Enforcer(data);
  });
  $.each($("input[type='email']"), function(idx, data) {
    Enforcer(data);
  });
  
  $(mjf_form__u_cancel).click(() => {
    let parent = $(mjf_form__u_cancel).closest("li");
    if($(parent).hasClass("mjf__dropdown")) {
      $(parent).find(".mjf-form").removeClass("mjf-form__show");
      $(parent).removeClass("mjf__dropdown");
      $(parent).find(".mjf--opt").removeClass("mjf-icn-fd");
      $(mjf_form__u_input).val("");
      $(mjf_form__u_submit).addClass("l--a-f-f_disable");
      $(mjf_form__u_chrcnt).text("");
      $(mjf_form__u_chrcnt).html('&zwnj;');
      $(__u__r0).css("color", "#C43C3C");
      $(__u__r1).css("color", "#C43C3C");
      $(__u__r2).css("color", "#C43C3C");
    }
  });
  $(mjf_form__u_input).keyup(() => {
    if($(mjf_form__u_input).val().length == 1) {
      $(mjf_form__u_chrcnt).text($(mjf_form__u_input).val().length+" character");
    } else if($(mjf_form__u_input).val().length == 0) {
      $(mjf_form__u_chrcnt).text("");
      $(mjf_form__u_chrcnt).html('&zwnj;');
    } else {
      $(mjf_form__u_chrcnt).text($(mjf_form__u_input).val().length+" characters");
    }
    
    if($(mjf_form__u_input).val().length >= 4) {
      $(__u__r0).css("color", "#3CC46C");
    } else {
      $(__u__r0).css("color", "#C43C3C");
    }
    
    if($(mjf_form__u_input).val().length <= 30) {
      $(__u__r1).css("color", "#3CC46C");
    } else {
      $(__u__r1).css("color", "#C43C3C");
    }
    
    if(!$(mjf_form__u_input).val().match(/(?![-._])[\W]/)) {
      $(__u__r2).css("color", "#3CC46C");
    } else {
      $(__u__r2).css("color", "#C43C3C");
    }
    
    if($(mjf_form__u_input).val().length >= 4 && $(mjf_form__u_input).val().length <= 30 && !$(mjf_form__u_input).val().match(/(?![-._])[\W]/)) $(mjf_form__u_submit).removeClass("l--a-f-f_disable");
    else $(mjf_form__u_submit).addClass("l--a-f-f_disable");
  });
  
  $(mjf_form__p_cancel).click(() => {
    let parent = $(mjf_form__p_cancel).closest("li");
    if($(parent).hasClass("mjf__dropdown")) {
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
    }
  });
  $(mjf_form__p_old).keyup(() => {
    
  });
  $(mjf_form__p_new).keyup(() => {
    mtch = chkpmtch(err_102, msg_103, mjf_form__p_new, mjf_form__p_newre, mjf_form__p_match);
    // some frontend validation
    if($(mjf_form__p_new).val().length >= 8) {
      $(__p__r0).css("color", "#3CC46C");
    } else {
      $(__p__r0).css("color", "#C43C3C");
    }
    
    if($(mjf_form__p_new).val().match(upper_case) && $(mjf_form__p_new).val().match(lower_case)) {
      $(__p__r1).css("color", "#3CC46C");
    } else {
      $(__p__r1).css("color", "#C43C3C");
    }
    
    if($(mjf_form__p_new).val().match(/[\W_]/)) {
      $(__p__r2).css("color", "#3CC46C");
    } else {
      $(__p__r2).css("color", "#C43C3C");
    }
    
    if($(mjf_form__p_new).val().length >= 8 && ($(mjf_form__p_new).val().match(upper_case) && $(mjf_form__p_new).val().match(lower_case)) && $(mjf_form__p_new).val().match(/[\W_]/) && mtch) {
      $(mjf_form__p_submit).removeClass("l--a-f-f_disable");
    } else {
      $(mjf_form__p_submit).addClass("l--a-f-f_disable");
    }
  });
  $(mjf_form__p_newre).keyup(() => {
    mtch = chkpmtch(err_102, msg_103, mjf_form__p_new, mjf_form__p_newre, mjf_form__p_match);
    
    if($(mjf_form__p_new).val().length >= 8 && ($(mjf_form__p_new).val().match(upper_case) && $(mjf_form__p_new).val().match(lower_case)) && $(mjf_form__p_new).val().match(/[\W_]/) && mtch) {
      $(mjf_form__p_submit).removeClass("l--a-f-f_disable");
    } else {
      $(mjf_form__p_submit).addClass("l--a-f-f_disable");
    }
  });
  
  $(mjf_form__e_new).keyup(() => {
    if(ve($(mjf_form__e_new).val())) {
      $(mjf_form__e_submit).removeClass("l--a-f-f_disable");
    } else {
      $(mjf_form__e_submit).addClass("l--a-f-f_disable");
    }
  });
  $(mjf_form__e_cancel).click(() => {
    let parent = $(mjf_form__e_cancel).closest("li");
    if($(parent).hasClass("mjf__dropdown")) {
      $(parent).removeAttr("style");
      $(parent).find(".mjf-form").removeClass("mjf-form__show");
      $(parent).removeClass("mjf__dropdown");
      $(parent).find(".mjf--opt").removeClass("mjf-icn-fd");
      $(mjf_form__e_new).val("");
      $(mjf_form__e_submit).addClass("l--a-f-f_disable");
    }
  });
  
  $(mjf_form__d_cancel).click(() => {
    let parent = $(mjf_form__d_cancel).closest("li");
    if($(parent).hasClass("mjf__dropdown")) {
      $(parent).removeAttr("style");
      $(parent).find(".mjf-form").removeClass("mjf-form__show");
      $(parent).removeClass("mjf__dropdown");
      $(parent).find(".mjf--opt").removeClass("mjf-icn-fd");
      $(mjf_form__d_pass).val("");
    }
  });
  
  $(manage__addpayment_cancel).click(() => {
    let parent = $(manage__addpayment_cancel).closest("li");
    if($(parent).hasClass("mjf__dropdown")) {
      $(parent).removeAttr("style");
      $(parent).find(".mjf-form").removeClass("mjf-form__show");
      $(parent).removeClass("mjf__dropdown");
      $(parent).find(".mjf--opt").removeClass("mjf-icn-fd");
    }
  });
  
});
