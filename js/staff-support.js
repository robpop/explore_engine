"use strict";

function cdt() {
  let dt = new Date();
  return dt.getTime();
}

$(() => {
  /*
  
  /api/staff/tickets/queue/ - GET
  	GET:
  		Description: Retrieves a list of unsolved tickets for staff to respond to.
  		URL Parameters: None
  		Fields: None
  		Note: Staff usage only.
  
  
  /api/tickets/id-here/ - GET
  	GET:
  		Description: Retrieves a ticket instance, not including attached ticket messages.
  		URL Parameters: ticket-id
  		Fields: None
  		Note: Only staff may view tickets not belonging to their own account.

  
  /api/tickets/id-here/messages/ - GET
  	GET:
  		Description: Retrieves a list of ticket messages associated with a ticket.
  		URL Parameters: ticket-id
  		Fields: None
  		Note: None
  
  
  /api/tickets/id-here/new-message/ - POST
  	POST:
  		Description: Attaches a new message to a ticket.
  		URL Parameters: ticket-id
  		Fields: ‘message’
          Note: 
              Staff must use this endpoint to attach staff messages to a ticket. 
              This designation is set automatically.
  
  */
  
  let support_commentlog_send_wrapper = document.getElementById("support-commentlog-send_wrapper");
  let support_dialog_backdrop = document.getElementById("support-dialog-backdrop");
  let support_commentlog = document.getElementById("support-commentlog");
  let support_commentlog_message_wrapper = document.getElementById("support-commentlog-message_wrapper");
  let support_commentlog_send_wrapper__crt = document.getElementById("support-commentlog-send_wrapper").getElementsByTagName("button")[0];
  let support_commentlog_send_wrapper__cnl = document.getElementById("support-commentlog-send_wrapper").getElementsByTagName("button")[1];
  let support_commentlog_send_message = document.getElementById("support-commentlog-send_message");
  
  const apit = "apitoken";
  let st = Cookies.get(apit);
  const s_030 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/tickets/queue/";
  const s_031 = "http://"+window.location.hostname+":"+window.location.port+"/api/tickets/id-here/";
  const s_034 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/tickets/id-here/delete/";
  
  const open_text = "Open";
  const closed_text = "Closed";
  
  const send_nomenclature = "from ";
  const send_staff_badge = " (Staff)"
  
  let can_send_message = false;
  let comment_tid = null;
  
  if(st) {
    
    $(support_commentlog).css({
      "top":"50%",
      "height":($(window).height()-150)*0.8,
      "margin-top":((($(window).height()-150)*0.8)/2)*-1
    });
    
    $.ajax({
      method: "GET",
      url: s_030,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        console.log(json);
        $.each(json.results, function(idx, data) {
          console.log(data);
          let ticket = $(".__sse-dummy").clone(true, true);
          $(ticket).find(".__sse_created").text(data.timestamp.split("T")[0]);
          $(ticket).find(".__sse_subject").text(data.subject);
          $(ticket).find(".__sse_message").text(data.message);
          $(ticket).find(".__sse_status").text(data.solved ? closed_text:open_text);
          $($(ticket).removeClass("__sse-dummy").addClass("__sse_entry").attr("data-tid", data.id)).insertAfter(".__sse_headers");
        });
      },
      error:function(request, status, error) {
        console.log(error);
        console.log(request.status);
        alert(error);
      }
    });
    
    $(".__sse_field").click((e) => {
      let tid = $(e.target).closest(".__sse_entry").attr("data-tid");
      comment_tid = tid;
      const s_032 = "http://"+window.location.hostname+":"+window.location.port+"/api/tickets/"+tid+"/messages/";
      $.ajax({
        method: "GET",
        url: s_032,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          // show messaging dialog
          $(support_commentlog_send_wrapper).show();
          $("#support-commentlog ul").css("height", "calc(100% - 215px)");
          $(support_dialog_backdrop).show();
          $(support_commentlog).show();
          $("#support-commentlog-options_wrapper").css({
            top: ($("#support-commentlog-send_message").innerHeight()/2 - $("#support-commentlog-options_wrapper").innerHeight()/2)+"px"
          });
          $("#support-commentlog-options_wrapper").css({
            left: ($("#support-commentlog-send_message").innerWidth()-$("#support-commentlog-options_wrapper").innerWidth()/2)-4.5+"px",
          });
          $.each(json.results, function(idx, data) {
            let cmnt = $(".support-comment-item-dummy").clone(true, true);
            let main_cmnt = $(cmnt).find("p");
            let header_cmnt = $(cmnt).find("span");
            let sender;
            if(data.staff) {
              $(cmnt).addClass("support_isstaff");
              sender = send_nomenclature+data.username+send_staff_badge;
            } else {
              $(cmnt).addClass("support_isuser");
              sender = send_nomenclature+data.username;
            }
            
            $(main_cmnt).text(data.message);
            $(header_cmnt).text(sender);
            $($(cmnt).removeClass("support-comment-item-dummy").addClass("sm__item")).appendTo(support_commentlog_message_wrapper);
            
          });
          $('#support-commentlog ul').scrollTop($('#support-commentlog ul')[0].scrollHeight);
        },
        error:function(request, status, error) {
          console.log(error);
          console.log(request.status);
          alert(error);
        }
      });
    });
    
    $(support_commentlog_send_message).keyup((e) => {
      if($(e.target).val().length > 0 && $(e.target).val().length <= 1024) {
        can_send_message = true;
        $(support_commentlog_send_wrapper__crt).removeClass("l--a-f-f_disable");
      } else {
        can_send_message = false;
        $(support_commentlog_send_wrapper__crt).addClass("l--a-f-f_disable");
      }
    });
    
    $(support_commentlog_send_wrapper__crt).click(() => {
      if(can_send_message && comment_tid!==null) {
        const m752_url = "http://"+window.location.hostname+":"+window.location.port+"/api/tickets/"+comment_tid+"/new-message/";
        const send_nomenclature = "from ";
        const send_staff_badge = " (Staff)"
        $.ajax({
          method: "POST",
          url: m752_url,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            message: $(support_commentlog_send_message).val(),
          },
          success:function(json) {
            let result = json;
            $(support_commentlog_send_message).val('');
            can_send_message = false;
            $(support_commentlog_send_wrapper__crt).addClass("l--a-f-f_disable");
            
            let cmnt = $(".support-comment-item-dummy").clone(true, true);
            let main_cmnt = $(cmnt).find("p");
            let header_cmnt = $(cmnt).find("span");
            let sender;
            if(result.staff) {
              $(cmnt).addClass("support_isstaff");
              sender = send_nomenclature+result.username+send_staff_badge;
            } else {
              $(cmnt).addClass("support_isuser");
              sender = send_nomenclature+result.username;
            }
            
            $(main_cmnt).text(result.message);
            $(header_cmnt).text(sender);
            $($(cmnt).removeClass("support-comment-item-dummy").addClass("sm__item")).appendTo(support_commentlog_message_wrapper);
            $('#support-commentlog ul').scrollTop($('#support-commentlog ul')[0].scrollHeight);
          },
          error:function(request, status, error) {
            alert(error);
          }
        });
        
      }
    });
    
    $(support_commentlog_send_wrapper__cnl).click(() => {
      $(support_dialog_backdrop).hide();
      $(support_commentlog).hide();
      $(".sm__item").remove();
      comment_tid = null;
      $(support_commentlog_send_message).val('');
      can_send_message = false;
      $(support_commentlog_send_wrapper__crt).addClass("l--a-f-f_disable");
    });
    
    
    $(".__sse_delete").click((e) => {
      $('body').css({
        "pointer-events":"none",
        "opacity":0.5
      });
      /*
      
      /api/staff/tickets/id-here/delete/ - DELETE
      	DELETE:
              Description: A staff endpoint to be used only when necessary to delete a given ticket.
              URL Parameters: ticket-id
              Fields: ‘password’ (staff password), ‘token’ (optional staff 2FA token)
              Notes: 
                  Staff usage only. 
                  This endpoint should only be used to stop abuse of the ticketing system.
      
      */
      let tid = $(e.target).closest(".__sse_entry").attr("data-tid");
      let trash_can = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/tickets/"+tid+"/delete/";
      $.ajax({
        method: "DELETE",
        url: trash_can,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          password: $("#support-delete-ticket_auth").children().eq(1).val(),
          token: $("#support-delete-ticket_auth").children().eq(2).val()
        },
        success: function(json) {
          window.location.reload();
        },
        error: function(request, status, error) {
          alert(error);
          $('body').css({
            "pointer-events":"auto",
            "opacity":1
          });
        }
      });
    });
    
  }
  
});