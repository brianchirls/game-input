"use strict";(this.webpackChunk_brianchirls_game_input=this.webpackChunk_brianchirls_game_input||[]).push([[114],{636:(e,t,n)=>{var o=n(99),i=n(439),r=n(684),a=n(93),c=n(780),u=n(906),l=n(398),d=document.createElement("canvas");document.body.appendChild(d);var s=d.getContext("2d"),f=document.createElement("div");f.id="score",document.body.appendChild(f);var v=document.createElement("div");v.id="lives",document.body.appendChild(v);var p=document.createElement("button");p.id="start-button",p.innerText="Start Game",document.body.appendChild(p);var h=new o.Z,y=new i.Z({keyCode:!0}),m=new r.Z({negative:y.getControl("arrowleft"),positive:y.getControl("arrowright")}),Z=new r.Z({negative:y.getControl("KeyA"),positive:y.getControl("KeyD")}),g=new c.Z({lockY:!0,element:d}).getControl();(0,u.Z)(g);var b=new a.Z({bindings:[h.getControl("leftStick").x,h.getControl("rightStick").x,m,Z,g.x]}),x=new l.Z(new a.Z([h.getControl("start"),y.getControl("Enter")])),w=function(e){return e/480*d.width},C=function(e){return e/320*d.height},R=w,E=!1,P=240,k=290,O=2,A=-2,S=210,L=0,M=1,T=3,I=[];function B(){I.length=0;for(var e=0;e<5;e++){I[e]=[];for(var t=0;t<10;t++)I[e][t]={x:0,y:0,status:1}}E=!1,P=240,k=290,O=2,A=-2,S=210,L=0,M=1,T=3}function Y(){B(),E=!0,p.style.display="none"}function _(){E=!1,p.style.display=""}function j(){s.clearRect(0,0,d.width,d.height),function(){for(var e=0;e<5;e++){var t=300*e/5;s.fillStyle="hsl(".concat(t,", 90%, 50%)");for(var n=0;n<10;n++)if(1===I[e][n].status){var o=42*n+30,i=24*e+30;I[e][n].x=o,I[e][n].y=i,s.beginPath(),s.rect(w(o),C(i),R(30),R(12)),s.fill(),s.closePath()}}}(),s.beginPath(),s.arc(w(P),C(k),R(6),0,2*Math.PI),s.fillStyle="#CCC",s.fill(),s.closePath(),s.beginPath(),s.rect(w(S),C(308),R(60),R(12)),s.fillStyle="#0095DD",s.fill(),s.closePath(),f.innerText="Score: "+L,v.innerText="Lives: "+T}p.onclick=Y;var q,F=performance.now();q=window.innerWidth/window.innerHeight,M=q>1.5?window.innerHeight/320:window.innerWidth/480,d.width=480*M*devicePixelRatio,d.height=320*M*devicePixelRatio,B(),function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:performance.now(),n=t-F;F=t,h.update(),S+=.5*b.value*n,S=Math.max(0,Math.min(S,420));var o=.06*n;if(((P+=O*o)+O>474||P+O<6)&&(O=-O),(k+=A*o)+A<6?A=-A:k+A>302&&P>S&&P<S+60?A=-Math.abs(A):k+A>314&&(E?--T?(P=240,k=290,O=3,A=-3,S=210):(console.log("GAME OVER"),_()):A=-A),E)for(var i=P-6,r=P+6,a=k-6,c=k+6,u=0;u<5;u++)for(var l=0;l<10;l++){var d=I[u][l];1===d.status&&r>d.x&&i<d.x+30&&c>d.y&&a<d.y+12&&(A=-A,d.status=0,50==++L&&(console.log("YOU WIN, CONGRATS!"),_()))}j(),requestAnimationFrame(e)}(),x.on("complete",(function(){E||Y()}))},780:(e,t,n)=>{n.d(t,{Z:()=>s});var o=n(144),i=n(671),r=n(326),a=n(340),c=n(963),u=n(120),l=n(942),d=n(611);var s=function(e){(0,a.Z)(f,e);var t,n,s=(t=f,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,o=(0,u.Z)(t);if(n){var i=(0,u.Z)(this).constructor;e=Reflect.construct(o,arguments,i)}else e=o.apply(this,arguments);return(0,c.Z)(this,e)});function f(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,i.Z)(this,f),e=s.call(this),(0,l.Z)((0,r.Z)(e),"x",void 0),(0,l.Z)((0,r.Z)(e),"y",void 0),(0,l.Z)((0,r.Z)(e),"radius",void 0),(0,l.Z)((0,r.Z)(e),"pointerType",void 0),(0,l.Z)((0,r.Z)(e),"mode",void 0),(0,l.Z)((0,r.Z)(e),"timestamp",void 0),(0,l.Z)((0,r.Z)(e),"element",void 0);var n=t.element,o=void 0===n?document.body:n,a=t.mode,c=void 0===a?"dynamic":a,u=t.lockX,v=void 0!==u&&u,p=t.lockY,h=void 0!==p&&p,y=t.touch,m=void 0===y||y,Z=t.pen,g=void 0===Z||Z,b=t.mouse,x=void 0!==b&&b,w=t.filter,C=t.touchActionStyle,R=void 0===C||C,E=t.radius,P=void 0===E?60:E,k=t.x,O=void 0===k?0:k,A=t.y,S=void 0===A?0:A,L=t.enabled,M=void 0===L||L,T=null,I=null,B=0,Y=0,_=0,j=0,q="static"===c,F=x||g||m&&navigator.maxTouchPoints>0,N={pen:g,mouse:x,touch:m};function X(e){if(!T&&N[e.pointerType]&&(!w||w(e))){if(q){var t=e.offsetX-O,n=e.offsetY-S;if(Math.hypot(t,n)>P)return;B=O,Y=S}else B=e.offsetX,Y=e.offsetY;T=e,I=e}}var D=function(t){if(T&&T.pointerId===t.pointerId){I=t;var n=v?0:t.offsetX-B,o=h?0:t.offsetY-Y,i=Math.hypot(n,o),r=Math.max(i,P);_=n/r,j=-o/r,e.emit("change")}},G=function(t){T&&T.pointerId===t.pointerId&&(I=t,T=null,(_||j)&&(_=0,j=0,e.emit("change")))},W=R&&o.style?o:document.body;function H(){M=!0,F&&(R&&(W.style.touchAction="none"),o.addEventListener("pointerdown",X),o.addEventListener("pointermove",D),o.addEventListener("pointerup",G),o.addEventListener("pointercancel",G))}function K(){M=!1,R&&(W.style.touchAction=""),o.removeEventListener("pointerdown",X),o.removeEventListener("pointermove",D),o.removeEventListener("pointerup",G),o.removeEventListener("pointercancel",G)}return e.getControl=function(t,n){return new d.Z((function(){return T?[_,j]:d.Z.defaultValue}),Object.assign({name:t},n,{device:(0,r.Z)(e),active:function(){return!!T}}))},e.destroy=function(){K()},Object.defineProperties((0,r.Z)(e),{pointerType:{get:function(){return I&&I.pointerType||""}},mode:{get:function(){return c}},connected:{enumerable:!1,configurable:!1,writable:!1,value:F},timestamp:{get:function(){return I&&I.timeStamp||0}},element:{enumerable:!1,configurable:!1,writable:!1,value:o},x:{get:function(){return q?O:B},set:function(e){O=e}},y:{get:function(){return q?S:Y},set:function(e){S=e}},radius:{get:function(){return P},set:function(e){P=e}},enabled:{get:function(){return M},set:function(e){!!e!=!!M&&(e?H():K())}}}),M&&H(),e}return(0,o.Z)(f)}(n(902).AS)},906:(e,t,n)=>{n.d(t,{Z:()=>i});var o=n(885);function i(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.device,i=t.innerRadius,r=void 0===i?Math.max(24,n.radius/4):i,a=t.parentElement,c=void 0===a?document.body:a,u=document.createElement("div");Object.assign(u.style,{position:"fixed",pointerEvents:"none",borderRadius:"9.99e+22px",transition:"opacity 0.1s",backgroundColor:"rgba(128, 128, 128, 0.5)"});var l=document.createElement("div");Object.assign(l.style,{position:"fixed",pointerEvents:"none",borderRadius:"9.99e+22px",transition:"opacity 0.1s",backgroundColor:"rgba(128, 128, 128, 0.5)"}),u.appendChild(l);var d=0;function s(){var t,i=e.read(),a=(0,o.Z)(i,2),c=a[0],f=a[1];if("static"===(null===(t=e.device)||void 0===t?void 0:t.mode)||e.active()){var v=2*n.radius,p=n.x-n.radius,h=n.y-n.radius;u.style.left=p+"px",u.style.top=h+"px",u.style.width=u.style.height=v+"px",u.style.opacity="1";var y=2*r;l.style.left=n.x+c*n.radius-r+"px",l.style.top=n.y-f*n.radius-r+"px",l.style.width=l.style.height=y+"px",l.style.opacity="1"}else u.style.opacity="0",l.style.opacity="0";d=requestAnimationFrame(s)}return c.appendChild(u),d=requestAnimationFrame(s),{destroy:function(){cancelAnimationFrame(d),u.parentNode&&u.parentNode.removeChild(u)}}}},398:(e,t,n)=>{n.d(t,{Z:()=>f});var o=n(671),i=n(144),r=n(326),a=n(340),c=n(963),u=n(120),l=n(942),d=n(305);var s={disabled:{started:["cancel","disable"],"*":["disable"]},ready:{started:["cancel","ready"],"*":["ready"]},started:{disabled:["enable","start"],"*":["start"]},complete:{disabled:["enable","start","complete"],started:["complete"],"*":["start","complete"]}};var f=function(e){(0,a.Z)(s,e);var t,n,d=(t=s,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,o=(0,u.Z)(t);if(n){var i=(0,u.Z)(this).constructor;e=Reflect.construct(o,arguments,i)}else e=o.apply(this,arguments);return(0,c.Z)(this,e)});function s(e,t){var n;return(0,o.Z)(this,s),n=d.call(this,e),(0,l.Z)((0,r.Z)(n),"pressPoint",.5),t>=0&&(n.pressPoint=t),n}return(0,i.Z)(s,[{key:"evaluate",value:function(){var e;return((null===(e=this.action.activeControl)||void 0===e?void 0:e.magnitude())||0)>=this.pressPoint?1:0}}]),s}(function(e){(0,a.Z)(f,e);var t,n,d=(t=f,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}(),function(){var e,o=(0,u.Z)(t);if(n){var i=(0,u.Z)(this).constructor;e=Reflect.construct(o,arguments,i)}else e=o.apply(this,arguments);return(0,c.Z)(this,e)});function f(e){var t;if((0,o.Z)(this,f),!e)throw new Error("Interaction requires an Action");t=d.call(this),(0,l.Z)((0,r.Z)(t),"enabled",void 0),(0,l.Z)((0,r.Z)(t),"action",void 0),(0,l.Z)((0,r.Z)(t),"state",void 0),(0,l.Z)((0,r.Z)(t),"update",void 0);var n=!1,i=!0,a="ready",c=0,u=function(e){if(a!==e){var n=s[e],o=n[a]||n["*"];a=e,o.forEach((function(e){return t.emit(e)}))}},v=function(){c=i?t.evaluate():0,u(c<=0?"ready":c>=1?"complete":"started")};e.on("change",v),e.on("enable",v),e.on("disable",v),t.update=v;var p=t.destroy;return t.destroy=function(){n=!0,i=!1,p()},t.destroy=function(){e.off("change",v),e.off("enable",v),e.off("disable",v),p()},Object.defineProperties((0,r.Z)(t),{enabled:{set:function(e){(e=!!e)===i||n||u((i=e)?"ready":"disabled")},get:function(){return i}},action:{get:function(){return e}},state:{get:function(){return a}}}),t}return(0,i.Z)(f,[{key:"evaluate",value:function(){var e;return((null===(e=this.action.activeControl)||void 0===e?void 0:e.magnitude())||0)>0?1:0}}]),f}(d.Z))}},e=>{e.O(0,[532],(()=>(636,e(e.s=636)))),e.O()}]);
//# sourceMappingURL=breakout-f000b14abfddb0b1f9bb.js.map