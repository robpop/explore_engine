$(() => {
  /*
  
  /api/disable-2fa/ - POST
  	POST:
  		Description: Disables 2FA on a given account.
  		URL Parameters: None
          Fields: ‘password’, ‘token’
          Note: Token is a six-digit 2FA token, not an API token.
  
  
  */
  
  let disable_2fa__password = false;
  let disable_2fa__token = false;
  
  $("#disable_2fa__password_field").keyup((e) => {
    if($(e.target).val().length >= 8) {
      disable_2fa__password = true;
    } else {
      disable_2fa__password = false;
    }
    
    if(disable_2fa__password && disable_2fa__token) {
      $("#disable_2fa__optwrap button").removeClass("l--a-f-f_disable");
    } else {
      $("#disable_2fa__optwrap button").addClass("l--a-f-f_disable");
    }
  });
  
  $("#disable_2fa__token_field").keyup((e) => {
    if($(e.target).val().length === 6 && $.isNumeric($(e.target).val())) {
      disable_2fa__token = true;
    } else {
      disable_2fa__token = false;
    }
    
    if(disable_2fa__password && disable_2fa__token) {
      $("#disable_2fa__optwrap button").removeClass("l--a-f-f_disable");
    } else {
      $("#disable_2fa__optwrap button").addClass("l--a-f-f_disable");
    }
  });
  
  $("#disable_2fa__optwrap button").click(() => {
    const apit = "apitoken";
    let st = Cookies.get(apit);
    const disable2fa = "http://"+window.location.hostname+":"+window.location.port+"/api/disable-2fa/";
    if(disable_2fa__password && disable_2fa__token) {
      // disable 2fa
      $.ajax({
        method: "POST",
        url: disable2fa,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          password: $("#disable_2fa__password_field").val(),
          token: $("#disable_2fa__token_field").val()
        },
        success:function(json) {
          window.location.href = "/account/manage/";
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
    } else {
      $("#disable_2fa__optwrap button").addClass("l--a-f-f_disable");
    }
  });
  
});