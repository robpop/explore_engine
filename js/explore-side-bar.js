"use strict";

function cdt() {
  let dt = new Date();
  return dt.getTime();
}

$(function(){
  
  const def_tag = "EXPLORE";
  const def_tag_msg = "All Sites";
        
  let nele;
  let mnele;
  
  let explore_category_dummy = $(".explore-category-dummy");
  let mobile_explore_category_dummy = $(".mobile-explore-category-dummy");
  
  let tags_bar = []; // for getting tag currently browsing
    
  const allsites_tag = "EXPLORE";
  
  const m72_url = "http://"+window.location.hostname+":"+window.location.port+"/api/categories/";
  $.ajax({
    method: "GET",
    url: m72_url,
    data: {
      nocache: cdt()
    },
    success:function(json) {
      let rlength = json.results.length;
      for(let i=0; i<rlength; ++i) {
        let result = json.results[i];
        nele = explore_category_dummy.clone(true, true);
        $(nele).attr("href", "http://"+window.location.hostname+":"+window.location.port+"/explore/"+result.url).attr("title", "Browse "+result.name.toLowerCase());
        $(nele).text(result.name);
        tags_bar.push(result.name);
        $($(nele).removeClass("explore-category-dummy")).appendTo( "#side-bar-categories-hub" );
        
        mnele = mobile_explore_category_dummy.clone(true, true);
        $(mnele).attr("href", "http://"+window.location.hostname+":"+window.location.port+"/explore/"+result.url).attr("data-name", result.name.toUpperCase().replace(/ /g,'').replace(/_/g,'').replace(/&/g, '')).attr("title", "Browse "+result.name.toLowerCase());
        $(mnele).text(result.name);
        $($(mnele).removeClass("mobile-explore-category-dummy")).insertBefore( "#mobile-explore-category-buffer" );
      }
    },
    error:function(request, status, error) {
      console.log(error);
    },
    complete:function(data) {
      let category = window.location.href;
      category = category.split('/');
      let this_category = undefined;
      for(let i=category.length;i>=0;i--) {
        if (category[i] && isNaN(category[i])) {
          this_category = category[i];
          break;
        }
      }
      this_category = (this_category.replace(/-/g, '')).toUpperCase();
      if(this_category == def_tag) {
        $(".header-bar-explore-cb1").text(def_tag_msg);
        $("#side-bar-shuffle-categories").css("color", "#3C6CC4");
      } else {
        let rlength = tags_bar.length;
        for(let i=0; i<rlength; ++i) {
          let data = tags_bar[i];
          if(data.replace(/\s/g, '').toUpperCase() === this_category) {
            $(".header-bar-explore-cb1").text(data);
          }
        }
        $("#side-bar-shuffle-categories").css("color", "#1B2F56");
      }
      
      this_category = this_category.toUpperCase().replace(/ /g,'').replace(/_/g,'').replace(/&/g, '');
      let t = $("#mobile-explore-tags-bar").find("[data-name='"+this_category+"']");
      
      $(t).css({
        "color":"#3C6CC4",
        "font-family":'Oxygen-Bold',
        "background":"#ebf0f9",
        "padding":"6px 12px",
        "border-radius":"50px"
      });
      
      if(this_category!=allsites_tag) $(t).insertAfter("#mobile-explore-allsites-tag");
      
    }
  });
});
