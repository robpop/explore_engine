$(() => {
  $(window).bind("pageshow", function(event) {
    if (event.originalEvent.persisted) {
      window.location.reload();
    }
  });
  try {
    Enforcer(document.getElementById("id_auth-username"));
    Enforcer(document.getElementById("id_auth-password"));
  } catch(e) {}
});