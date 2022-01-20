"use strict";
let nav_visibility = null;
function toggle_nav_visibility(b) {
  if(b) {
    if($("#global-title-bar").css("display")!=="none") {
      $("#global-title-bar").css("pointer-events", "none");
      $("#mobile-explore-tags-bar").css("pointer-events", "none");
      $("#global-title-bar").addClass("animated faster fadeOutUp");
      $("#mobile-explore-tags-bar").addClass("animated faster fadeOutUp");
      nav_visibility = window.setTimeout(() => {
        $("#global-title-bar").hide();
        $("#mobile-explore-tags-bar").hide();
        $("#global-title-bar").removeClass("animated faster fadeOutUp");
        $("#mobile-explore-tags-bar").removeClass("animated faster fadeOutUp");
      },500);
    }
  } else {
    //if($("#global-title-bar").css("display")==="none") {
      $("#global-title-bar").css("pointer-events", "auto");
      $("#mobile-explore-tags-bar").css("pointer-events", "auto");
      $("#global-title-bar").addClass("animated faster fadeInDown");
      $("#mobile-explore-tags-bar").addClass("animated faster fadeInDown");
      $("#global-title-bar").show();
      if(window.innerWidth<=1000) $("#mobile-explore-tags-bar").show();
      window.clearTimeout(nav_visibility);
      setTimeout(() => {
        $("#global-title-bar").removeClass("animated faster fadeInDown");
        $("#mobile-explore-tags-bar").removeClass("animated faster fadeInDown");
      },500);
    //}
  }
}