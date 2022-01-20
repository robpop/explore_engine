"use strict";

function cdt() {
  let dt = new Date();
  return dt.getTime();
}

$(() => {
  let support_open_ticket_wrapper__button = document.getElementById("support-open-ticket-wrapper").getElementsByTagName("button")[0];
  let support_dialog = document.getElementById("support-dialog");
  let support_dialog_backdrop = document.getElementById("support-dialog-backdrop");
  let support_dialog_opt__crt = document.getElementById("support-dialog").getElementsByTagName("button")[0];
  let support_dialog_opt__cnl = document.getElementById("support-dialog").getElementsByTagName("button")[1];
  let support_dialog_opt_subject = document.getElementById("support-dialog").getElementsByTagName("input")[0];
  let support_dialog_opt_message = document.getElementById("support-dialog").getElementsByTagName("textarea")[0];
  let support_view_ticket_wrapper__open = document.getElementById("support-view-ticket-wrapper").getElementsByTagName("button")[0];
  let support_view_ticket_wrapper__closed = document.getElementById("support-view-ticket-wrapper").getElementsByTagName("button")[1];
  let support_noopen_tickets = document.getElementById("support-noopen-tickets");
  let support_noclosed_tickets = document.getElementById("support-noclosed-tickets");
  let support_list_ticket_wrapper__open = document.getElementById("support-list-ticket-wrapper__open");
  let support_list_ticket_wrapper__closed = document.getElementById("support-list-ticket-wrapper__closed");
  let support_commentlog = document.getElementById("support-commentlog");
  let support_commentlog_message_wrapper = document.getElementById("support-commentlog-message_wrapper");
  let support_commentlog_send_wrapper = document.getElementById("support-commentlog-send_wrapper");
  let support_commentlog_send_wrapper__crt = document.getElementById("support-commentlog-send_wrapper").getElementsByTagName("button")[0];
  let support_commentlog_send_wrapper__cnl = document.getElementById("support-commentlog-send_wrapper").getElementsByTagName("button")[1];
  let support_commentlog_send_message = document.getElementById("support-commentlog-send_message");
  let support_commentlog_closed_close = document.getElementById("support-commentlog-closed_close");
  
  let good_subject, good_message;
  good_subject = good_message = false;
  
  const apit = "apitoken";
  let st = Cookies.get(apit);
  
  const open_text = "Open";
  const closed_text = "Closed";
  
  let can_send_message = false;
  
  let no_initial_tickets = true;
  let no_closed_tickets = true;
  
  let comment_tid = null;
  
  // this array keeps track of valid tid on the backend so that
  // they can't be tampered and look up arbitrary ticket comments
  let available_tid = [];
  
  // use this to track tickets that are closed to disable comment adding
  let closed_ticket_tid = [];
  
  $(support_view_ticket_wrapper__open).addClass("support-viewing");
  
  $.Lazy('sitecard_loader', function(element, response) {
      element.addClass("loaded");
      response(true);
  });
  
  if(st) {
    // load tickets
    const m793_url = "http://"+window.location.hostname+":"+window.location.port+"/api/tickets/unsolved/";
    $.ajax({
      method: "GET",
      url: m793_url,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        if(json.results.length > 0) {
          no_initial_tickets = false;
          console.log(json.results);
          $.each(json.results, function(idx, result){
            if(!result.solved) {
              let ticket = $(".support-ticket-dummy__open").clone(true, true);
              $(ticket).find(".st_timestamp").text(result.timestamp.split("T")[0]);
              $(ticket).find(".st_subject").text(result.subject);
              $(ticket).find(".st_message").html(result.message);
              $(ticket).find(".st_status").text(open_text);
              $($(ticket).removeClass("support-ticket-dummy__open").attr("tid", result.id).addClass("_stfr")).insertAfter("#support-list-ticket-wrapper__open .support-list-headers");
              available_tid.push(result.id);
            }
          });
        } else {
          no_initial_tickets = true;
          $(support_list_ticket_wrapper__open).hide();
          $(support_noopen_tickets).show();
        }
      },
      error:function(request, status, error) {
        console.log(error);
      }
    });
  }
  
  $(support_view_ticket_wrapper__open).click(() => {
    if(st) {
      // load tickets
      $(support_view_ticket_wrapper__closed).removeClass("support-viewing");
      $(support_view_ticket_wrapper__open).addClass("support-viewing");
      
      $("._stfr").remove();
      $(support_noclosed_tickets).hide();
      $(support_list_ticket_wrapper__closed).hide();
      $(support_list_ticket_wrapper__open).show();
      const m793_url = "http://"+window.location.hostname+":"+window.location.port+"/api/tickets/unsolved/";
      $.ajax({
        method: "GET",
        url: m793_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          if(json.results.length > 0) {
            no_initial_tickets = false;
            console.log(json.results);
            $.each(json.results, function(idx, result){
              if(!result.solved) {
                let ticket = $(".support-ticket-dummy__open").clone(true, true);
                $(ticket).find(".st_timestamp").text(result.timestamp.split("T")[0]);
                $(ticket).find(".st_subject").text(result.subject);
                $(ticket).find(".st_message").html(result.message/*+$(ticket).find(".st_message").html()*/);
                $(ticket).find(".st_status").text(open_text);
                $($(ticket).removeClass("support-ticket-dummy__open").attr("tid", result.id).addClass("_stfr")).insertAfter("#support-list-ticket-wrapper__open .support-list-headers");
                available_tid.push(result.id);
              }
            });
          } else {
            no_initial_tickets = true;
            $(support_list_ticket_wrapper__open).hide();
            $(support_noopen_tickets).show();
          }
        },
        error:function(request, status, error) {
          console.log(error);
        },
        complete:function(jqXHR, textStatus) {
          $('.lazy').Lazy({
            afterLoad: function(element) {
              console.log(element);
            },
          });
        }
      });
    }
  });
  
  $(support_view_ticket_wrapper__closed).click(() => {
    if(st) {
      $(support_view_ticket_wrapper__open).removeClass("support-viewing");
      $(support_view_ticket_wrapper__closed).addClass("support-viewing");

      $("._stfr").remove();
      $(support_noopen_tickets).hide();
      $(support_list_ticket_wrapper__open).hide();
      $(support_list_ticket_wrapper__closed).show();
      const m792_url = "http://"+window.location.hostname+":"+window.location.port+"/api/tickets/solved/";
      $.ajax({
        method: "GET",
        url: m792_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          console.log(json);
          if(json.results.length > 0) {
            no_closed_tickets = false;
            $.each(json.results, function(idx, result){
              if(result.solved) {
                let ticket = $(".support-ticket-dummy__closed").clone(true, true);
                $(ticket).find(".st_timestamp").text(result.timestamp.split("T")[0]);
                $(ticket).find(".st_subject").text(result.subject);
                $(ticket).find(".st_message").html(result.message/*+$(ticket).find(".st_message").html()*/);
                $(ticket).find(".st_status").text(closed_text);
                $($(ticket).removeClass("support-ticket-dummy__closed").attr("tid", result.id).addClass("_stfr")).insertAfter("#support-list-ticket-wrapper__closed .support-list-headers");
                available_tid.push(result.id);
                closed_ticket_tid.push(result.id);
              }
            });
          } else {
            no_closed_tickets = true;
            $(support_list_ticket_wrapper__closed).hide();
            $(support_noclosed_tickets).show();
          }
        },
        error:function(request, status, error) {
          console.log(error);
        },
        complete:function(jqXHR, textStatus) {
          $('.lazy').Lazy({
            afterLoad: function(element) {
              console.log(element);
            },
          });
        }
      });
    }
  });
  
  $(".st_closeticket").click((e) => {
    /*
    
    /api/tickets/id-here/solved/ - GET
    	GET:
    		Description: Marks a ticket as solved.
    		URL Parameters: ticket-id
    		Fields: None
            Note: Staff may not mark a ticket as solved, but they may delete the ticket with a separate endpoint if necessary.
    
    
    */
    let parent = $(e.target).parent().parent();
    let tid = jQuery.inArray(parseInt($(parent).attr("tid")), available_tid);
    if(tid!==-1 && st) {
      const m797_url = "http://"+window.location.hostname+":"+window.location.port+"/api/tickets/"+available_tid[tid]+"/solved/";
      $.ajax({
        method: "GET",
        url: m797_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          // remove from open tickets list
          // copy it to closed tickets list
          show_info_notification("Your ticket has been closed and marked as solved", "Ticket closed");
          $(parent).appendTo(support_list_ticket_wrapper__closed);
          $(parent).remove();
          
        },
        error:function(request, status, error) {}
      });
    }
    
  });
  
  $(support_open_ticket_wrapper__button).click(() => {
    $(support_dialog_backdrop).show();
    $(support_dialog).show();
  });
  
  $("._stf").click((e) => {
    let parent = $(e.target).parent();
    // get comments
    // show dialog
    // put comments in dialog
    let tid = jQuery.inArray(parseInt($(parent).attr("tid")), available_tid);
    comment_tid = tid;
    if(tid!==-1 && st) {
      // if a comment is deleted, that change won't show until a page reload
      const m798_url = "http://"+window.location.hostname+":"+window.location.port+"/api/tickets/"+available_tid[tid]+"/messages/";
      const send_nomenclature = "from ";
      const send_staff_badge = " (Staff)"
      $.ajax({
        method: "GET",
        url: m798_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        success:function(json) {
          // show comment dialog
          if(json.results.length > 0) {
            $("#support--empty-messages").hide();
          } else {
            $("#support--empty-messages").show();
          }
          if(jQuery.inArray(available_tid[tid], closed_ticket_tid)!==-1) {
            $(support_commentlog_send_wrapper).hide();
            $("#support-commentlog ul").css("height", "80%");
            $(support_commentlog_closed_close).css("display", "block");
          } else {
            $(support_commentlog_send_wrapper).show();
            $("#support-commentlog ul").css("height", "calc(100% - 215px)");
            $(support_commentlog_closed_close).hide();
          }
          console.log(jQuery.inArray(available_tid[tid], closed_ticket_tid));
          $(support_dialog_backdrop).show();
          $(support_commentlog).show();
          $("#support-commentlog-options_wrapper").css({
            top: ($("#support-commentlog-send_message").innerHeight()/2 - $("#support-commentlog-options_wrapper").innerHeight()/2)+"px"
          });
          if(window.innerWidth <= 1000) {
            $("#support-commentlog-options_wrapper").css({
              left: "",
            });
          } else {
            $("#support-commentlog-options_wrapper").css({
              left: ($("#support-commentlog-send_message").innerWidth()-$("#support-commentlog-options_wrapper").innerWidth()/2)-4.5+"px",
            });
          }
          $.each(json.results, function(idx, result){
            console.log(result);
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
            
          });
          $('#support-commentlog ul').scrollTop($('#support-commentlog ul')[0].scrollHeight);
        },
        error:function(request, status, error) {
          console.log(error);
        },
        complete:function(jqXHR, textStatus) {
          $('.lazy').Lazy({
            afterLoad: function(element) {
              console.log(element);
            },
          });
        }
      });
    }
  });
  
  $(support_commentlog_closed_close).click(() => {
    $(support_dialog_backdrop).hide();
    $(support_commentlog).hide();
    $(".sm__item").remove();
  });
  
  $(support_dialog_opt__cnl).click(() => {
    $(support_dialog_backdrop).hide();
    $(support_dialog).hide();
    good_subject=false;
    good_message=false;
    $(support_dialog_opt__crt).addClass("l--a-f-f_disable");
    $(support_dialog_opt_subject).val('');
    $(support_dialog_opt_message).val('');
  });

  $(support_dialog_opt__crt).click(() => {
    if(good_message && good_subject && st) {
      const m791_url = "http://"+window.location.hostname+":"+window.location.port+"/api/tickets/create/";
      $.ajax({
        method: "POST",
        url: m791_url,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          subject: $(support_dialog_opt_subject).val(),
          message: $(support_dialog_opt_message).val(),
        },
        success:function(json) {
          let result = json;
          if(no_initial_tickets) {
            $(support_list_ticket_wrapper__open).show();
            $(support_noopen_tickets).hide();
            no_initial_tickets = false;
          }
          $(support_dialog_backdrop).hide();
          $(support_dialog).hide();
          show_info_notification("Click or tap your ticket to view and send messages", "Ticket submitted")
          let ticket = $(".support-ticket-dummy__open").clone(true, true);
          $(ticket).find(".st_timestamp").text(result.timestamp.split("T")[0]);
          $(ticket).find(".st_subject").text(result.subject);
          $(ticket).find(".st_message").html(result.message/*+$(ticket).find(".st_message").html()*/);
          $(ticket).find(".st_status").text(open_text);
          $($(ticket).removeClass("support-ticket-dummy__open").attr("tid", result.id).addClass("_stfr")).insertAfter("#support-list-ticket-wrapper__open .support-list-headers");
          good_subject=false;
          good_message=false;
          $(support_dialog_opt__crt).addClass("l--a-f-f_disable");
          $(support_dialog_opt_subject).val('');
          $(support_dialog_opt_message).val('');
          available_tid.push(result.id);
          $('#support-commentlog ul').scrollTop($('#support-commentlog ul')[0].scrollHeight);
        },
        error:function(request, status, error) {
          console.log(error);
        }
      });
    }
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
    if(can_send_message && st && comment_tid!==null) {
      const m752_url = "http://"+window.location.hostname+":"+window.location.port+"/api/tickets/"+available_tid[comment_tid]+"/new-message/";
      const send_nomenclature = "from ";
      const send_staff_badge = " (Staff)"
      if(jQuery.inArray(available_tid[comment_tid], closed_ticket_tid)===-1) {
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
            $("#support--empty-messages").remove();
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
  
  if(window.innerWidth <= 1000) {
    $(support_commentlog).css({
      "top":$("#global-title-bar").height()+"px",
      "height":+($(window).height() - $("#global-title-bar").height())+"px",
      "margin-top":""
    });
    $(support_dialog).css({
      "top":$("#global-title-bar").height()+"px",
      "height":($(window).height() - $("#global-title-bar").height())+"px"
    });
  } else {
    $(support_commentlog).css({
      "top":"50%",
      "height":($(window).height()-150)*0.8,
      "margin-top":((($(window).height()-150)*0.8)/2)*-1
    });
    $(support_dialog).css({
      "top":"50%",
      "height":"350px"
    });
  }
  $(window).resize(() => {
    if(window.innerWidth <= 1000) {
      $(support_commentlog).css({
        "top":$("#global-title-bar").height()+"px",
        "height":($(window).height() - $("#global-title-bar").height())+"px",
        "margin-top":""
      });
      $("#support-commentlog-options_wrapper").css({
        left: ""
      });
      $(support_dialog).css({
        "top":$("#global-title-bar").height()+"px",
        "height":($(window).height() - $("#global-title-bar").height())+"px",
      });
    } else {
      $(support_commentlog).css({
        "top":"50%",
        "height":($(window).height()-150)*0.8,
        "margin-top":((($(window).height()-150)*0.8)/2)*-1
      });
      $("#support-commentlog-options_wrapper").css({
        left: ($("#support-commentlog-send_message").innerWidth()-$("#support-commentlog-options_wrapper").innerWidth()/2)-4.5+"px"
      });
      $(support_dialog).css({
        "top":"50%",
        "height":"350px"
      });
    }
    
    $("#support-commentlog-options_wrapper").css({
      top: ($("#support-commentlog-send_message").innerHeight()/2 - $("#support-commentlog-options_wrapper").innerHeight()/2)+"px"
    });
    
  });
  
  $(support_dialog_opt_subject).keyup((e) => {
    if($(e.target).val().length >= 4 && $(e.target).val().length <= 64) {good_subject = true;} else {good_subject=false;}
    if(good_subject && good_message) {
      $(support_dialog_opt__crt).removeClass("l--a-f-f_disable");
    } else {
      $(support_dialog_opt__crt).addClass("l--a-f-f_disable");
    }
  });
  $(support_dialog_opt_message).keyup((e) => {
    if($(e.target).val().length >= 8 && $(e.target).val().length <= 1024) {good_message = true;} else {good_message=false;}
    if(good_subject && good_message) {
      $(support_dialog_opt__crt).removeClass("l--a-f-f_disable");
    } else {
      $(support_dialog_opt__crt).addClass("l--a-f-f_disable");
    }
  });  
  
  $.each($("input[type='text']"), function(idx, data) {
    Enforcer(data);
  });
  $.each($("textarea"), function(idx, data) {
    Enforcer(data);
  });
});