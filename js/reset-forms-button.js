"use strict";
$(() => {
  $(".btn-primary").click((e) => {
    $(e.target).addClass("l--a-f-f_disable");
    setTimeout(() => {
      $(e.target).removeClass("l--a-f-f_disable");
    },20000);
  });
});