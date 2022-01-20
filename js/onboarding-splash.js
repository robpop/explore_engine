"use strict";
function cdt() {
  let dt = new Date();
  return dt.getTime();
}
$(() => {
  
  const apit = "apitoken";
  let st = Cookies.get(apit);
  const m522_url = "http://"+window.location.hostname+":"+window.location.port+"/api/sites/total-active/";
  
  $("#onboard-splash-attribute").show();

  
  setTimeout(() => {
    $("#ssi-itm0").css("visibility", "visible");
    $("#ssi-itm0").addClass("fadeInUp");
    setTimeout(() => {
      $("#ssi-itm1").css("visibility", "visible");
      $("#ssi-itm1").addClass("fadeInUp");
      setTimeout(() => {
        $("#ssi-itm2").css("visibility", "visible");
        $("#ssi-itm2").addClass("fadeInUp");
      },150);
    },150);
  },150);
  
  
  $.ajax({
    method: "GET",
    url: m522_url,
    data: {
      nocache: cdt()
    },
    success: function(json) {
      $("#share-splash-total_sites").text(numeral(json).format('0,0'));
    },
    error:function(request, status, error) {
      show_sys_error_notification();
    },
  });
  

});
