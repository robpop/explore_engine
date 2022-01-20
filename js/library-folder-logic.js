"use strict";
$(() => {
  const apit = "apitoken";
  let st = Cookies.get(apit);
  let fid = (window.location.href).split('/');
  let snele;
  let lsid=1;
  let can_save=false;
  let can_move=false;
  const old_name = $(".library-folder-header-name").text();
  let new_name=old_name;
  for(let i=fid.length;i>=0;i--) {
    if (fid[i] !== "" && !isNaN(fid[i])) {
      fid = fid[i];
      break;
    }
  }
    
  $(".library-item-folder--modname").click(() => {
    
    /*
    1. change pencil to checkmark
    2. disable delete
    3. hide current title
    4. show input
    5. on checkmark click, run ajax
    */
    
    $(".library-item-folder--modname").addClass("library-folder__hide_disable");
    $(".library-item-folder--delete").addClass("library-folder__hide_disable");
    $(".library-item-folder--modname__save").removeClass("library-folder__hide_disable");
    $(".library-folder-header-name").css("display","none");
    $(".library-folder-header-name__modify").css("display","block");
    $(".library-folder-header-name__modify").focus();
  });
  
  $(".library-folder-header-name__modify").keyup(() => {
    if($(".library-folder-header-name__modify").val().trim().length > 0) {
      can_save=true;
      $(".library-item-folder--modname__save").css("opacity", "1");
      new_name=$(".library-folder-header-name__modify").val().trim();
    } else {
      can_save=false;
      $(".library-item-folder--modname__save").css("opacity", "0.5");
      new_name=old_name;
    }
  });
  
  $(".library-item-folder--modname__save").click(() => {
    if(st) {
      if(!isNaN(fid) && can_save===true) {
        const m66_url = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/"+""+fid+"/";

        $.ajax({
          method: "PUT",
          url: m66_url,
          headers: {
            "Authorization" : "Token "+""+st
          },
          data: {
            name: new_name
          },
          success:function(json) {
            console.log(json);
          },
          error:function(request, status, error) {
            console.log(error);
          },
          complete:function(data) {
            // revert modification state and show success notif
            $(".library-item-folder--modname").removeClass("library-folder__hide_disable");
            $(".library-item-folder--delete").removeClass("library-folder__hide_disable");
            $(".library-item-folder--modname__save").addClass("library-folder__hide_disable");
            $(".library-folder-header-name").css("display","block");
            $(".library-folder-header-name__modify").css("display","none");
            $(".library-folder-header-name__modify").val("");
            $(".library-folder-header-name__modify").attr("placeholder", new_name);
            $(".library-item-folder--modname__save").css("opacity", "0.5");
            can_save=false;
            $(".library-folder-header-name").text(new_name);
            show_info_notification("Changed folder name to"+" "+new_name, "Folder name changed");
            new_name=old_name;
          }
        });
      }
    }
  });
  
  $(".library-item-folder--delete").click(() => {
    if(st) {
      if(!isNaN(fid)) {
        $("#library--delete-folder-form").css("display","block");
        $("#library-items").addClass("lifpen");
      }
    }
  });
  
  $(".library-del--optbtn_cnl").click(() => {
    $("#library--delete-folder-form").css("display","none");
    $("#library-items").removeClass("lifpen");
  });
  
  $(".library-del--optbtn_fldr").click(() => {
    const m67_url = "http://"+window.location.hostname+":"+window.location.port+"/api/folders/"+""+fid+"/";
    $.ajax({
      method: "DELETE",
      url: m67_url,
      headers: {
        "Authorization" : "Token "+""+st
      },
      success:function(json) {
        // redirect back to library page
        $("#library-items").removeClass("lifpen");
        window.location.replace("http://"+window.location.hostname+":"+window.location.port+"/library/");
      },
      error:function(request, status, error) {
        console.log(error);
      }
    });
  });
  
});