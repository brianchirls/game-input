!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="/game-input/",n(n.s=1)}([,function(e,t,n){"use strict";n.r(t);n(2);var r=document.getElementById("sidebar");document.getElementById("menu-button").addEventListener("click",(function(){r.classList.toggle("open")}));var o=null,c=document.getElementById("viewer");function u(e){return document.querySelector("[data-src=".concat(e,"]"))||null}function i(){var e=window.location.hash.substr(1);(e&&u(e)||null)&&(c.src="../examples/".concat(e,".html"))}document.querySelectorAll(".category + ul > li[data-src] > a").forEach((function(e){var t=e.parentNode.dataset.src;e.addEventListener("click",(function(){!function(e){o&&o.classList.remove("selected"),(o=u(e))&&(o.classList.add("selected"),window.location.hash=e)}(t),r.classList.remove("open")}))})),window.addEventListener("hashchange",i),i(),window.addEventListener("touchstart",(function(){}))},function(e,t,n){}]);
//# sourceMappingURL=index-3b38a411c9fb075f2031.js.map