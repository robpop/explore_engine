"use strict";

function cdt() {
  let dt = new Date();
  return dt.getTime();
}

$(() => {  
  
  let __gmc_0 = document.getElementById("__gmc_0");
  let __gmc_1 = document.getElementById("__gmc_1");
  let __gmc_2 = document.getElementById("__gmc_2");
  
  const apit = "apitoken";
  let st = Cookies.get(apit);
  const s_012 = "http://"+window.location.hostname+":"+window.location.port+"/api/staff/global-metrics/";
  let refresh = 300000;
  const none = "None";
  
  if(st) {
    $.ajax({
      method: "GET",
      url: s_012,
      headers: {
        "Authorization" : "Token "+""+st
      },
      data: {
        nocache: cdt()
      },
      success:function(json) {
        console.log(json);
        if(json.avgShowingsYD) {
          $(__gmc_0).children().eq(0).find("span").text((json.avgShowingsYD).toFixed(2));
        } else {
          $(__gmc_0).children().eq(0).find("span").text(none);
        }
        
        if(json.avgViewsYD) {
          $(__gmc_0).children().eq(1).find("span").text((json.avgViewsYD).toFixed(2));
        } else {
          $(__gmc_0).children().eq(1).find("span").text(none);
        }
        
        if(json.avgClicksYD) {
          $(__gmc_0).children().eq(2).find("span").text((json.avgClicksYD).toFixed(2));
        } else {
          $(__gmc_0).children().eq(2).find("span").text(none);
        }
        
        if(json.avgSavesYD) {
          $(__gmc_0).children().eq(3).find("span").text((json.avgSavesYD).toFixed(2));
        } else {
          $(__gmc_0).children().eq(3).find("span").text(none);
        }
        
        if(json.maxShowingsYD) {
          $(__gmc_1).children().eq(0).find("span").text(json.maxShowingsYD);
        } else {
          $(__gmc_1).children().eq(0).find("span").text(none);
        }
        
        if(json.minShowingsYD) {
          $(__gmc_1).children().eq(1).find("span").text(json.minShowingsYD);
        } else {
          $(__gmc_1).children().eq(1).find("span").text(none);
        }
        
        $(__gmc_2).children().eq(0).find("span").text(json.numFreeSites);
        $(__gmc_2).children().eq(1).find("span").text(json.numRegSites);
        $(__gmc_2).children().eq(2).find("span").text(json.totalSites);
        $(__gmc_2).children().eq(3).find("span").text(json.numAwaitingApproval);
        $(__gmc_2).children().eq(4).find("span").text(json.freeSitesAddedPastWeek);
        $(__gmc_2).children().eq(5).find("span").text(json.regSitesAddedPastWeek);
        $(__gmc_2).children().eq(6).find("span").text((json.estimatedRevenueNextMonth).toFixed(2));
      },
      error:function(request, status, error) {
        console.log(error);
      }
    });
  }
  
  
  setInterval(() => {
    if(st) {
      $.ajax({
        method: "GET",
        url: s_012,
        headers: {
          "Authorization" : "Token "+""+st
        },
        data: {
          nocache: cdt()
        },
        success:function(json) {
          console.log(json);
          if(json.avgShowingsYD) {
            $(__gmc_0).children().eq(0).find("span").text((json.avgShowingsYD).toFixed(2));
          } else {
            $(__gmc_0).children().eq(0).find("span").text(none);
          }
          
          if(json.avgViewsYD) {
            $(__gmc_0).children().eq(1).find("span").text((json.avgViewsYD).toFixed(2));
          } else {
            $(__gmc_0).children().eq(1).find("span").text(none);
          }
          
          if(json.avgClicksYD) {
            $(__gmc_0).children().eq(2).find("span").text((json.avgClicksYD).toFixed(2));
          } else {
            $(__gmc_0).children().eq(2).find("span").text(none);
          }
          
          if(json.avgSavesYD) {
            $(__gmc_0).children().eq(3).find("span").text((json.avgSavesYD).toFixed(2));
          } else {
            $(__gmc_0).children().eq(3).find("span").text(none);
          }
          
          if(json.maxShowingsYD) {
            $(__gmc_1).children().eq(0).find("span").text(json.maxShowingsYD);
          } else {
            $(__gmc_1).children().eq(0).find("span").text(none);
          }
          
          if(json.minShowingsYD) {
            $(__gmc_1).children().eq(1).find("span").text(json.minShowingsYD);
          } else {
            $(__gmc_1).children().eq(1).find("span").text(none);
          }
          
          $(__gmc_2).children().eq(0).find("span").text(json.numFreeSites);
          $(__gmc_2).children().eq(1).find("span").text(json.numRegSites);
          $(__gmc_2).children().eq(2).find("span").text(json.totalSites);
          $(__gmc_2).children().eq(3).find("span").text(json.numAwaitingApproval);
          $(__gmc_2).children().eq(4).find("span").text(json.freeSitesAddedPastWeek);
          $(__gmc_2).children().eq(5).find("span").text(json.regSitesAddedPastWeek);
          $(__gmc_2).children().eq(6).find("span").text((json.estimatedRevenueNextMonth).toFixed(2));
        },
        error:function(request, status, error) {
          console.log(error);
        }
      });
    }
  }, refresh);
  
  
  /*
  
  avgShowingsYD: 16.88888888888889
  avgViewsYD: 1
  avgClicksYD: 0
  avgSavesYD: 0
  maxShowingsYD: 17
  minShowingsYD: 16
  
  numFreeSites: 9
  numRegSites: 0
  totalSites: 9
  numAwaitingApproval: 0
  freeSitesAddedPastWeek: 0
  regSitesAddedPastWeek: 0
  estimatedRevenueNextMonth: 0
  
  */
});