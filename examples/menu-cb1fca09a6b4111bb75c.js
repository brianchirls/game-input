"use strict";(this.webpackChunk_brianchirls_game_input=this.webpackChunk_brianchirls_game_input||[]).push([[465],{179:(e,t,n)=>{var i=n(93),r=(n(88),n(684),n(173),n(714),n(496),n(611),n(332),n(99)),a=n(439),o=n(398);document.body.innerHTML='<div class="tabbed"> <ul> <li> <a href="#section1">Section 1</a> </li> <li> <a href="#section2">Section 2</a> </li> <li> <a href="#section3">Section 3</a> </li> <li> <a href="#section4">Section 4</a> </li> </ul> <section id="section1"> <h2>Section 1</h2> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam euismod, tortor nec pharetra ultricies, ante erat imperdiet velit, nec laoreet enim lacus a velit. <a href="#">Nam luctus</a>, enim in interdum condimentum, nisl diam iaculis lorem, vel volutpat mi leo sit amet lectus. Praesent non odio bibendum magna bibendum accumsan.</p> </section> <section id="section2" hidden> <h2>Section 2</h2> <p>Nullam at diam nec arcu suscipit auctor non a erat. Sed et magna semper, eleifend magna non, facilisis nisl. Proin et est et lorem dictum finibus ut nec turpis. Aenean nisi tortor, euismod a mauris a, mattis scelerisque tortor. Sed dolor risus, varius a nibh id, condimentum lacinia est. In lacinia cursus odio a aliquam. Curabitur tortor magna, laoreet ut rhoncus at, sodales consequat tellus.</p> </section> <section id="section3" hidden> <h2>Section 3</h2> <p>Phasellus ac tristique orci. Nulla maximus <a href="">justo nec dignissim consequat</a>. Sed vehicula diam sit amet mi efficitur vehicula in in nisl. Aliquam erat volutpat. Suspendisse lorem turpis, accumsan consequat consectetur gravida, <a href="#">pellentesque ac ante</a>. Aliquam in commodo ligula, sit amet mollis neque. Vestibulum at facilisis massa.</p> </section> <section id="section4" hidden> <h2>Section 4</h2> <p>Nam luctus, enim in interdum condimentum, nisl diam iaculis lorem, vel volutpat mi leo sit amet lectus. Praesent non odio bibendum magna bibendum accumsan. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam euismod, tortor nec pharetra ultricies, ante erat imperdiet velit, nec laoreet enim lacus a velit. </p> </section> </div> <section> <p>Switch through the tabs by any of the following:</p> <ul> <li>Click directly on each tab with the pointer (mouse, pen or touch)</li> <li>Left and right "shoulder" buttons on a <strong>gamepad</strong>. i.e. "L1" or "R1"</li> <li>Page-Down or Page-Up keys on <strong>keyboard</strong></li> <li>Cycle through all controls with the tab key. Hit Enter key to activate selected tab. Note: May not work on Mac without <a href="https://support.apple.com/en-us/HT204434">changing keyboard settings.</a></li> </ul> </section> ';var c=document.querySelector(".tabbed"),u=c.querySelector("ul"),l=Array.from(u.querySelectorAll("a")),s=Array.from(c.querySelectorAll("section")),d=0;function f(e){for(;e<0;)e+=l.length;e>=l.length&&(e%=l.length);var t=l[e];t.focus(),t.setAttribute("aria-selected","true"),l[d].removeAttribute("aria-selected"),s[d].hidden=!0,s[e].hidden=!1,d=e}u.setAttribute("role","tablist"),l.forEach((function(e,t){e.setAttribute("role","tab"),e.setAttribute("id","tab"+(t+1)),e.setAttribute("tabindex","0"),e.parentElement.setAttribute("role","presentation"),e.addEventListener("click",(function(t){var n;t.preventDefault(),n=e,f(Array.prototype.indexOf.call(l,n))}))})),s.forEach((function(e,t){e.setAttribute("role","tabpanel"),e.setAttribute("aria-labelledby",l[t].id),e.hidden=!0})),l[0].setAttribute("aria-selected","true"),s[0].hidden=!1;var h=new r.Z,m=new a.Z({keyCode:!0}),p=new o.Z(new i.Z([m.getControl("PageUp"),h.getControl("L1")])),v=new o.Z(new i.Z([m.getControl("PageDown"),h.getControl("R1")]));p.on("complete",(function(){return f(d-1)})),v.on("complete",(function(){return f(d+1)})),function e(){h.update(),setTimeout(e,8)}()},496:(e,t,n)=>{n.d(t,{Z:()=>d});var i=n(925),r=n(144),a=n(671),o=n(340),c=n(963),u=n(120),l=n(332),s=["left","right","up","down"];var d=function(e){(0,o.Z)(d,e);var t,n,l=(t=d,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,i=(0,u.Z)(t);if(n){var r=(0,u.Z)(this).constructor;e=Reflect.construct(i,arguments,r)}else e=i.apply(this,arguments);return(0,c.Z)(this,e)});function d(e){var t,n=e.left,r=e.right,o=e.up,c=e.down,u=(0,i.Z)(e,s);(0,a.Z)(this,d),(t=l.call(this,(function(){return[t.children.get("right").read()-t.children.get("left").read(),t.children.get("up").read()-t.children.get("down").read()]}),u)).children.set("left",n),t.children.set("right",r),t.children.set("up",o),t.children.set("down",c);var f=function(){return t.emit("change")};return t.children.forEach((function(e){e.on("change",f)})),t}return(0,r.Z)(d)}(l.Z)},398:(e,t,n)=>{n.d(t,{Z:()=>f});var i=n(671),r=n(144),a=n(326),o=n(340),c=n(963),u=n(120),l=n(942),s=n(305);var d={disabled:{started:["cancel","disable"],"*":["disable"]},ready:{started:["cancel","ready"],"*":["ready"]},started:{disabled:["enable","start"],"*":["start"]},complete:{disabled:["enable","start","complete"],started:["complete"],"*":["start","complete"]}};var f=function(e){(0,o.Z)(d,e);var t,n,s=(t=d,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,i=(0,u.Z)(t);if(n){var r=(0,u.Z)(this).constructor;e=Reflect.construct(i,arguments,r)}else e=i.apply(this,arguments);return(0,c.Z)(this,e)});function d(e,t){var n;return(0,i.Z)(this,d),n=s.call(this,e),(0,l.Z)((0,a.Z)(n),"pressPoint",.5),t>=0&&(n.pressPoint=t),n}return(0,r.Z)(d,[{key:"evaluate",value:function(){var e;return((null===(e=this.action.activeControl)||void 0===e?void 0:e.magnitude())||0)>=this.pressPoint?1:0}}]),d}(function(e){(0,o.Z)(f,e);var t,n,s=(t=f,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,i=(0,u.Z)(t);if(n){var r=(0,u.Z)(this).constructor;e=Reflect.construct(i,arguments,r)}else e=i.apply(this,arguments);return(0,c.Z)(this,e)});function f(e){var t;if((0,i.Z)(this,f),!e)throw new Error("Interaction requires an Action");t=s.call(this),(0,l.Z)((0,a.Z)(t),"enabled",void 0),(0,l.Z)((0,a.Z)(t),"action",void 0),(0,l.Z)((0,a.Z)(t),"state",void 0),(0,l.Z)((0,a.Z)(t),"update",void 0);var n=!1,r=!0,o="ready",c=0,u=function(e){if(o!==e){var n=d[e],i=n[o]||n["*"];o=e,i.forEach((function(e){return t.emit(e)}))}},h=function(){c=r?t.evaluate():0,u(c<=0?"ready":c>=1?"complete":"started")};e.on("change",h),e.on("enable",h),e.on("disable",h),t.update=h;var m=t.destroy;return t.destroy=function(){n=!0,r=!1,m()},t.destroy=function(){e.off("change",h),e.off("enable",h),e.off("disable",h),m()},Object.defineProperties((0,a.Z)(t),{enabled:{set:function(e){(e=!!e)===r||n||u((r=e)?"ready":"disabled")},get:function(){return r}},action:{get:function(){return e}},state:{get:function(){return o}}}),t}return(0,r.Z)(f,[{key:"evaluate",value:function(){var e;return((null===(e=this.action.activeControl)||void 0===e?void 0:e.magnitude())||0)>0?1:0}}]),f}(s.Z))}},e=>{e.O(0,[532],(()=>(179,e(e.s=179)))),e.O()}]);
//# sourceMappingURL=menu-cb1fca09a6b4111bb75c.js.map