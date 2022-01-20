"use strict";

function show_info_notification(m,t) {
  if(!t) t = "Success!";
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": window.innerWidth<=1000 ? "toast-top-full-width" : "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "250",
    "hideDuration": "250",
    "timeOut": "4000",
    "extendedTimeOut": "1000",
    "showEasing": "linear",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  toastr["success"](m,t);
}

function show_removedsiteslibrary_notification(m,t) {
  if(!t) t = "Success!";
  toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": window.innerWidth<=1000 ? "toast-top-full-width" : "toast-bottom-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "250",
    "hideDuration": "250",
    "timeOut": "4000",
    "extendedTimeOut": "1000",
    "showEasing": "linear",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  toastr["success"](m,t);
}

function show_details_notification(m,t) {
  if(!t) t = "Info";
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": window.innerWidth<=1000 ? "toast-top-full-width" : "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "250",
    "hideDuration": "250",
    "timeOut": "30000",
    "extendedTimeOut": "30000",
    "showEasing": "linear",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  toastr["info"](m,t);
}

function show_error_notification(e,t) {
  if(!t) t = "Oops!";
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": window.innerWidth<=1000 ? "toast-top-full-width" : "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "250",
    "hideDuration": "250",
    "timeOut": "30000",
    "extendedTimeOut": "30000",
    "showEasing": "linear",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  toastr["warning"](e,t);
}

function show_sys_error_notification(err) {
  if(!err) err = "0";
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": window.innerWidth<=1000 ? "toast-top-full-width" : "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "250",
    "hideDuration": "250",
    "timeOut": "30000",
    "extendedTimeOut": "30000",
    "showEasing": "linear",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  toastr["warning"]("Something went wrong, please try refreshing this page. Provide this code to support: "+err.toString(),"It broke");
}


function show_error_looped_notification(e,t) {
  if(!t) t = "Oops!";
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": window.innerWidth<=1000 ? "toast-top-full-width" : "toast-bottom-right",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "250",
    "hideDuration": "250",
    "timeOut": "30000",
    "extendedTimeOut": "30000",
    "showEasing": "linear",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  toastr["warning"](e,t);
}

$(() => {
  let errors = document.getElementsByClassName("notification-err");
  let email = document.getElementsByClassName("notification-email");
  $.each(email, function(idx, data) {
    show_error_notification($(data).text(), "Verify your email");
  });
  $.each(errors, function(idx, data) {
    show_error_notification($(data).text(), "Oops!");
  });
});
