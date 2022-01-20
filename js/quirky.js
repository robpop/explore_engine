$(() => {
  if (navigator.appVersion.indexOf("Win")!=-1) {
    if($("#eufsr-wrap div").length) {
      $("#eufsr-wrap div").css("font-size", "23px");
    }
    if($("#pub-userfeedback_average-rating-display div").length) {
      $("#pub-userfeedback_average-rating-display div").css("font-size", "40px");
    }
    if($(".pubdash-feedback-rating-display div").length) {
      $(".pubdash-feedback-rating-display div").css("font-size", "22px");
    }
  }
});