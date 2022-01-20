"use strict";
!function(f,a,c){var s,l=256,p="random",d=c.pow(l,6),g=c.pow(2,52),y=2*g,h=l-1;function n(n,t,r){function e(){for(var n=u.g(6),t=d,r=0;n<g;)n=(n+r)*l,t*=l,r=u.g(1);for(;y<=n;)n/=2,t/=2,r>>>=1;return(n+r)/t}var o=[],i=j(function n(t,r){var e,o=[],i=typeof t;if(r&&"object"==i)for(e in t)try{o.push(n(t[e],r-1))}catch(n){}return o.length?o:"string"==i?t:t+"\0"}((t=1==t?{entropy:!0}:t||{}).entropy?[n,S(a)]:null==n?function(){try{var n;return s&&(n=s.randomBytes)?n=n(l):(n=new Uint8Array(l),(f.crypto||f.msCrypto).getRandomValues(n)),S(n)}catch(n){var t=f.navigator,r=t&&t.plugins;return[+new Date,f,r,f.screen,S(a)]}}():n,3),o),u=new m(o);return e.int32=function(){return 0|u.g(4)},e.quick=function(){return u.g(4)/4294967296},e.double=e,j(S(u.S),a),(t.pass||r||function(n,t,r,e){return e&&(e.S&&v(e,u),n.state=function(){return v(u,{})}),r?(c[p]=n,t):n})(e,i,"global"in t?t.global:this==c,t.state)}function m(n){var t,r=n.length,u=this,e=0,o=u.i=u.j=0,i=u.S=[];for(r||(n=[r++]);e<l;)i[e]=e++;for(e=0;e<l;e++)i[e]=i[o=h&o+n[e%r]+(t=i[e])],i[o]=t;(u.g=function(n){for(var t,r=0,e=u.i,o=u.j,i=u.S;n--;)t=i[e=h&e+1],r=r*l+i[h&(i[e]=i[o=h&o+t])+(i[o]=t)];return u.i=e,u.j=o,r})(l)}function v(n,t){return t.i=n.i,t.j=n.j,t.S=n.S.slice(),t}function j(n,t){for(var r,e=n+"",o=0;o<e.length;)t[h&o]=h&(r^=19*t[h&o])+e.charCodeAt(o++);return S(t)}function S(n){return String.fromCharCode.apply(0,n)}if(j(c.random(),a),"object"==typeof module&&module.exports){module.exports=n;try{s=require("crypto")}catch(n){}}else"function"==typeof define&&define.amd?define(function(){return n}):c["seed"+p]=n}("undefined"!=typeof self?self:this,[],Math);
function ghost(t){return(-1<t.indexOf("//")?t.split("/")[2]:t.split("/")[0]).split(":")[0].split("?")[0]}
function intToRGB(t){var n=(16777215&t).toString(16).toUpperCase();return"00000".substring(0,6-n.length)+n}
$(function(){
  String.prototype.hashCode=function(){let t,r=0;if(0===this.length)return r;for(t=0;t<this.length;t++)r=(r<<5)-r+this.charCodeAt(t),r|=0;return r};

  let draw = SVG('pamf-media-display-logo_generate');

  $(".share-packet-0-verify-field").on('input', function() {
    // generate hash
    draw.clear();

    let d = (ghost($(this).val()));
    let subdomain = /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i;
    let subdomain_result = d.match(subdomain);
    if(subdomain_result) {
      d = d.replace(subdomain_result[0], '');
    }
    let h = d.hashCode();
    let g = intToRGB(h);


    let g_0 = g.substr(0,1); // color         (DONE)
    let g_1 = g.substr(1,1); // unused
    let g_2 = g.substr(2,1); // position (x)  (DONE)
    let g_3 = g.substr(3,1); // unused
    let g_4 = g.substr(4,1); // size          (DONE)
    let g_5 = g.substr(5,1); // modifier      (DONE)

    const size = 126;
    const logo_radius = 3;
    const c_size = 7;
    const num_of_dots = 8;

    const max_dot_radius = 21;
    const min_dot_radius = 10;
    
    const logo_letter_size = 42;
    const logo_letter__x = 63;
    const logo_letter__y = 63;
    
    const radius_seed = h;

    const colors = ["#C43C3C", "#C46C3C", "#3CC46C", "#3CC4C4", "#3C6CC4", "#6C3CC4", "#C43C6C"];


    // background
    let g_0_v = parseInt(intToRGB(new Math.seedrandom(parseInt(g_0, 16)).int32()), 16) % c_size;
    draw.rect(size, size).radius(logo_radius).fill(colors[g_0_v]).id("");

    let this_radius = new Math.seedrandom(radius_seed);

    for (let i = 0; i < num_of_dots; i++) {
      let this_radius__actual = Math.floor((max_dot_radius)*this_radius()) + min_dot_radius;
      
      let this_circle = draw.circle(this_radius__actual).fill('#fff').id("");
      switch(i) {
        case 0:
          this_circle.cx(21).cy(21);
        break;
        
        case 1:
          this_circle.cx(63).cy(21);
        break;
        
        case 2:
          this_circle.cx(105).cy(21);
        break;
        
        case 3:
          this_circle.cx(21).cy(63);
        break;
        
        case 4:
          this_circle.cx(105).cy(63);
        break;
        
        case 5:
          this_circle.cx(21).cy(105);
        break;
        
        case 6:
          this_circle.cx(63).cy(105);
        break;
        
        case 7:
          this_circle.cx(105).cy(105);
        break;
      }
    }

    let logo_letter = draw.text('null').id("");
    logo_letter.font({
      family: 'Oxygen-Bold',
      size: logo_letter_size,
      anchor: 'middle',
      dx: logo_letter__x,
    });
    logo_letter.tspan(d.substring(0,1).toUpperCase()).dy(78).fill('#fff').id("");

    if (g==="000000") draw.clear();

  });

});
