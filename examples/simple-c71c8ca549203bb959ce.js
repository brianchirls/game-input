!function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/game-input/",n(n.s=5)}({0:function(t,e,n){var r,o,i=function(){var t=0,e=/[\s,]+/g;function n(t){this.head=new r,this.tail=new r(this.head),this.head.next=this.tail,this.linkConstructor=t,this.reg={}}function r(t,e,n){this.prev=t,this.next=e,this.fn=n||o}function o(){}function i(){this.events={}}return n.prototype={insert:function(t){var e=new r(this.tail.prev,this.tail,t);return e.next.prev=e.prev.next=e,e},remove:function(t){t.prev.next=t.next,t.next.prev=t.prev}},r.prototype.run=function(t){this.fn(t),this.next&&this.next.run(t)},i.prototype={constructor:i,on:function(r,o){var i=this;r.split(e).forEach((function(e){var r=i.events[e]||(i.events[e]=new n),u=o._eev||(o._eev=++t);r.reg[u]||(r.reg[u]=r.insert(o))}))},off:function(t,n){var r=this;n&&t.split(e).forEach((function(t){var e=r.events[t];if(e){var o=e.reg[n._eev];e.reg[n._eev]=void 0,e&&o&&e.remove(o)}}))},emit:function(t,e){var n=this.events[t];n&&n.head.run(e)}},i}();r=function(){return i},(o=this.define)&&o.amd?o([],r):t.exports&&(t.exports=r())},5:function(t,e,n){"use strict";n.r(e);var r={dpadUp:12,dpadDown:13,dpadLeft:14,dpadRight:15,L1:4,L2:6,L3:10,R1:5,R2:7,R3:11,A:0,B:1,X:2,Y:3,start:9,select:8,home:16},o=[];Object.keys(r).forEach((function(t){o[r[t]]=t}));var i=["leftStick","rightStick"],u=function(t,e){return e(t)};function c(t,e){return t.reduce(u,e)}function a(t,e){e&&Object.keys(t).forEach((function(n){n in e&&"function"!=typeof t[n]&&(t[n]=e[n])}))}function f(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function l(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var s=function(){function t(e,n){var r=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),l(this,"name",""),l(this,"parent",null),l(this,"children",new Map),l(this,"device",null),l(this,"processors",[]),a(this,n),this.read=this.processors.length?function(){return c(r.processors,e())}:e||this.read}var e,n,r;return e=t,(n=[{key:"find",value:function(t){if(!t)return this;var e=t.indexOf("/");if(e>0){var n=t.substring(0,e),r=this.children.get(n);if(r)return r.find(t.substring(n+1))}return this.children.get(t)||null}},{key:"read",value:function(){return this.prototype.defaultValue}},{key:"magnitude",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.read();return Math.abs(t)}}])&&f(e.prototype,n),r&&f(e,r),t}();function p(t){return(p="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function y(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function d(t,e){return(d=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function h(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=b(t);if(e){var o=b(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return v(this,n)}}function v(t,e){return!e||"object"!==p(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function b(t){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}l(s,"defaultValue",0);var m=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&d(t,e)}(n,t);var e=h(n);function n(){var t,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){return 0},o=arguments.length>1?arguments[1]:void 0;return y(this,n),(t=e.call(this,r,o)).axis=t.read,t}return n}(s);function g(t){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function w(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function O(t,e){return(O=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function j(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=P(t);if(e){var o=P(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return S(this,n)}}function S(t,e){return!e||"object"!==g(e)&&"function"!=typeof e?x(t):e}function x(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function P(t){return(P=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var E=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&O(t,e)}(i,t);var e,n,r,o=j(i);function i(t,e){var n,r,u,c;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),n=o.call(this,t,e),r=x(n),c=.5,(u="pressPoint")in r?Object.defineProperty(r,u,{value:c,enumerable:!0,configurable:!0,writable:!0}):r[u]=c,a(x(n),e),n}return e=i,(n=[{key:"pressed",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.magnitude();return t>=this.pressPoint}}])&&w(e.prototype,n),r&&w(e,r),i}(m);function _(t){return(_="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function R(){return(R=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function C(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function k(t,e){return(k=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function A(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=M(t);if(e){var o=M(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return L(this,n)}}function L(t,e){return!e||"object"!==_(e)&&"function"!=typeof e?T(t):e}function T(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function M(t){return(M=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var I,D,X,Y=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&k(t,e)}(i,t);var e,n,r,o=A(i);function i(t,e){var n;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),(n=o.call(this,t,e)).vector2=n.read,n.x=new m((function(){return n.read()[0]}),R({},e&&e.x,{parent:T(n)})),n.y=new m((function(){return n.read()[1]}),R({},e&&e.y,{parent:T(n)})),n.children.set("x",n.x),n.children.set("y",n.x),n}return e=i,(n=[{key:"magnitude",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.read();return Math.hypot(t[0],t[1])}}])&&C(e.prototype,n),r&&C(e,r),i}(s);function B(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var u,c=t[Symbol.iterator]();!(r=(u=c.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return V(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return V(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function V(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function U(t,e,n){var r=B(t,2),o=r[0],i=r[1],u=Math.hypot(o,i),c=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.125,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:.925,r=Math.abs(t);return r<e?0:r>n?Math.sign(t):Math.sign(t)*(r-e)/(n-e)}(u,e,n);if(0===c)return[0,0];var a=c/u;return[o*a,i*a]}function F(t){return(F="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function q(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var u,c=t[Symbol.iterator]();!(r=(u=c.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return W(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return W(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function W(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function $(t,e){return($=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function N(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=H(t);if(e){var o=H(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return z(this,n)}}function z(t,e){return!e||"object"!==F(e)&&"function"!=typeof e?G(t):e}function G(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function H(t){return(H=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function J(){return(J=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function K(t,e,n,r,o){var i=J({},o&&o[e],{parent:t});t[e]=new E((function(){return function(t,e,n){var r=t()[e],o=Math.abs(n?-r:r);return Math.max(0,o)}(n,r)}),i),t.children.set(e,t[e])}X=[0,0],(D="defaultValue")in(I=Y)?Object.defineProperty(I,D,{value:X,enumerable:!0,configurable:!0,writable:!0}):I[D]=X;var Q=[["left",0,!0],["right",0,!1],["down",1,!0],["up",1,!1]],Z=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&$(t,e)}(n,t);var e=N(n);function n(t,r){var o;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),o=e.call(this,t,J({processors:[U]},r)),Q.forEach((function(t){var e=q(t,3),n=e[0],i=e[1],u=e[2];K(G(o),n,i,u,r)})),o}return n}(Y),tt=n(0),et=n.n(tt);function nt(){return(nt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}var rt=new Set(o);i.forEach((function(t){return rt.add(t)}));var ot=new Map([[E,function(t,e){return t.buttons[e].value}],[Z,function(t,e){return[t.axes[e],-t.axes[e+1]]}],[m,function(t,e){return t.axes[e]}]]);function it(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=n.updatePeriod,u=void 0===r?1e3/120:r;et.a.call(this);var c=new Map,a=new Map,f=null,l=0;function s(){var t=navigator.getGamepads()[e],n=t&&t.timestamp||performance.now();t&&n-l>=u&&(f=t,l=n)}o.forEach((function(t,e){c.set(t,E),a.set(t,e)})),i.forEach((function(t,e){c.set(t,Z),a.set(t,2*e)}));var p=function(n){var r=n.gamepad;if(r.index===e){s();for(var i=o.length;i<r.buttons.length;i++){var u="button"+i;c.set(u,E),a.set(u,i)}for(var f=4;f<r.axes.length;f++){var l="axis"+f;c.set(l,m),a.set(l,f)}t.emit("connected")}},y=function(n){n.gamepad.index===e&&(c.forEach((function(t,e){rt.has(e)||(c.delete(e),a.delete(e))})),t.emit("disconnected"))};this.getControl=function(e,n){var r=c.get(e);if(!r)throw new Error("Control not found");var o=ot.get(r),i=a.get(e);return new r((function(){return s(),f?o(f,i):r.defaultValue}),nt({name:e},n,{device:t}))},this.controls=function(){return c.keys()},this.destroy=function(){window.removeEventListener("gamepadconnected",p),window.removeEventListener("gamepaddisconnected",y)},Object.defineProperties(this,{device:{get:function(){return f}},id:{get:function(){return f&&f.id||null}},connected:{get:function(){return!!f&&f.connected}},timestamp:{get:function(){return l}}}),s(),window.addEventListener("gamepadconnected",p),window.addEventListener("gamepaddisconnected",y)}it.prototype=Object.create(et.a.prototype);var ut=function(t){return function(){return t()?1:0}};function ct(){return(ct=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function at(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function ft(){return(ft=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}var lt=[{mouse:"leftMouseButton",touch:"touch",pen:"penTip"},{mouse:"middleMouseButton"},{mouse:"rightMouseButton",pen:"penBarrelButton"},{mouse:"mouseBackButton"},{mouse:"mouseForwardButton"},{pen:"penEraser"}],st=new Set;function pt(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t.button;if(e>=0&&e<lt.length&&t.isPrimary){var n=lt[e];return n[t.pointerType]||""}return""}lt.forEach((function(t){for(var e=0,n=Object.values(t);e<n.length;e++){var r=n[e];st.add(r)}}));var yt={position:{constructor:Y,reader:function(t){return[t.x,t.y]}},pagePosition:{constructor:Y,reader:function(t){return[t.pageX,t.pageY]}},screenPosition:{constructor:Y,reader:function(t){return[t.screenX,t.screenY]}},tilt:{constructor:Y,reader:function(t){return[t.screenX/90,t.screenY/90]}},contact:{constructor:Y,reader:function(t){return[t.width,t.height]}},delta:{constructor:Y,reader:function(t,e,n){return e?[t.x-e.x,t.y-e.y]:n}},pageDelta:{constructor:Y,reader:function(t,e,n){return e?[t.pageX-e.pageX,t.pageY-e.pageY]:n}},screenDelta:{constructor:Y,reader:function(t,e,n){return e?[t.screenX-e.screenX,t.screenY-e.screenY]:n}},pressure:{constructor:m,reader:function(t){return t.pressure||0}}};function dt(t){return(dt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function ht(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function vt(t,e){return(vt=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function bt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=gt(t);if(e){var o=gt(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return mt(this,n)}}function mt(t,e){return!e||"object"!==dt(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function gt(t){return(gt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var wt=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&vt(t,e)}(n,t);var e=bt(n);function n(t){var r,o=t.left,i=t.right,u=t.up,c=t.down,a=ht(t,["left","right","up","down"]);!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n);return(r=e.call(this,(function(){return[(i.read()-o.read())/2,(u.read()-c.read())/2]}),a)).children.set("left",o),r.children.set("right",i),r.children.set("up",u),r.children.set("down",c),r}return n}(Y);function Ot(t){return(Ot="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function jt(t,e){if(null==t)return{};var n,r,o=function(t,e){if(null==t)return{};var n,r,o={},i=Object.keys(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||(o[n]=t[n]);return o}(t,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);for(r=0;r<i.length;r++)n=i[r],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(o[n]=t[n])}return o}function St(t,e){return(St=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function xt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Et(t);if(e){var o=Et(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Pt(this,n)}}function Pt(t,e){return!e||"object"!==Ot(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function Et(t){return(Et=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var _t=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&St(t,e)}(n,t);var e=xt(n);function n(t){var r,o=t.negative,i=t.positive,u=jt(t,["negative","positive"]);!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n);return(r=e.call(this,(function(){var t=o.read();return(i.read()-t)/2}),u)).children.set("negative",o),r.children.set("positive",i),r}return n}(m);function Rt(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var Ct=function(){function t(){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t)}var e,n,r;return e=t,(n=[{key:"process",value:function(t){return t.control.magnitude()>0?"complete":"inactive"}},{key:"reset",value:function(){}}])&&Rt(e.prototype,n),r&&Rt(e,r),t}();function kt(t){return(kt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var At=void 0===("undefined"==typeof performance?"undefined":kt(performance))?function(){return performance.now()}:function(){return Date.now()},Lt=new Ct;function Tt(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};et.a.call(this);var n=this;this.name=e.name||"";var r,o=[],i=[],u=[],a=[],f=!1,l=!0,p=null,y=0,d="inactive";this.bindings=o,this.processors=i,this.interactions=u;var h=function e(n,r){if(n!==d&&l&&("active"!==n||"complete"!==d)){var o=[];if("complete"===n)e("active",r),o.push("completed");else if("inactive"===n)"complete"!==d&&o.push("canceled"),o.push("ended");else{if("active"!==n)throw new Error("Unsupported state: "+n);o.push("started")}d=n,o.forEach((function(e){return t.emit(e,r)}))}};function v(){a.forEach((function(t){return t.interaction.reset()})),a.length=0}function b(t,e){var r=a.findIndex((function(n){return n.binding===t&&n.interaction===e})),o=r>=0&&a[r],i=e.process(t,n)||o&&o.state||"inactive";r<0&&"inactive"!==i&&(r=a.length,o={binding:t,interaction:e,state:"inactive"},a.push(o)),o&&(o.state=i)}this.bind=function(t,e){if(e||t instanceof s||(e=t),e&&e.control&&(t=e.control),!(t instanceof s))throw new Error("Binding requires an InputControl");var n={control:t,processors:e&&e.processors,interactions:e&&e.interactions};return o.push(n),o.length-1},this.unbind=function(t){if(t<o.length)o.splice(t,1)},this.update=function(){if(l){var t=p;p=null;for(var e=-1/0,n=0;n<o.length;n++){var f=o[n],s=f.control,d=f.processors?c(f.processors,s.read()):s.read(),m=s.magnitude(d);m>e&&(r=d,e=m,m>0&&(p=f,y||(y=At())))}p||(y=0),void 0!==r&&(r=c(i,r));var g=p||t,w=u.length>0;for(g&&g.interactions&&(w=w||g.interactions.length>0,g.interactions.forEach((function(t){return b(g,t)}))),g&&u.forEach((function(t){return b(g,t)})),g&&!w&&b(g,Lt);a.length;){var O=a[0];if("inactive"!==O.state){"complete"===O.state&&(v(),h("complete",O.binding));break}a.shift(),O.interaction.reset(),h(O.state,O.binding)}a.length||h("inactive")}},this.destroy=function(){f=!0,l=!1,v(),h("inactive"),d="destroyed"},Object.defineProperties(this,{enabled:{set:function(t){(t=!!t)===l||f||(l=t,h("inactive"),d=l?"inactive":"disabled",v())},get:function(){return l}},activeControl:{get:function(){return p&&p.control}},state:{get:function(){return d}},value:{get:function(){return r}}}),e.bindings&&e.bindings.forEach((function(e){t.bind(e)})),e.processors&&i.push.apply(i,e.processors),e.interactions&&u.push.apply(u,e.interactions),!1==!e.enabled&&(this.enabled=!1)}function Mt(t){return(Mt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function It(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Dt(t,e){return(Dt=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Xt(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=Vt(t);if(e){var o=Vt(this).constructor;n=Reflect.construct(r,arguments,o)}else n=r.apply(this,arguments);return Yt(this,n)}}function Yt(t,e){return!e||"object"!==Mt(e)&&"function"!=typeof e?Bt(t):e}function Bt(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function Vt(t){return(Vt=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}Tt.prototype=Object.create(et.a.prototype);var Ut=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&Dt(t,e)}(i,t);var e,n,r,o=Xt(i);function i(t){var e;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,i),function(t,e,n){e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n}(Bt(e=o.call(this)),"pressPoint",.5),t>=0&&(e.pressPoint=t),e}return e=i,(n=[{key:"process",value:function(t){return t.control.magnitude()>this.pressPoint?"complete":"inactive"}}])&&It(e.prototype,n),r&&It(e,r),i}(Ct);function Ft(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:.5;Ct.call(this),this.pressPoint=e;var n=!1;this.update=function(e){var r=n;return(n=e.control.magnitude()>t.pressPoint)?"active":r?"complete":""},this.reset=function(){n=!1}}function qt(){return(qt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function Wt(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.element,r=void 0===n?document.body:n,o=e.radius,i=void 0===o?60:o,u=e.x,c=void 0===u?0:u,a=e.y,f=void 0===a?0:a,l=e.mode,s=void 0===l?"dynamic":l,p=e.lockX,y=void 0!==p&&p,d=e.lockY,h=void 0!==d&&d,v=e.touch,b=void 0===v||v,m=e.pen,g=void 0===m||m,w=e.mouse,O=void 0!==w&&w,j=e.filter,S=void 0===j?null:j,x=e.touchActionStyle,P=void 0===x||x,E=null,_=null,R=0,C=0,k=0,A=0,L="static"===s,T=O||g||b&&navigator.maxTouchPoints>0,M={pen:g,mouse:O,touch:b};function I(t){if(!E&&M[t.pointerType]&&(!S||S(t))){if(L){var e=t.offsetX-c,n=t.offsetY-f;if(Math.hypot(e,n)>i)return;R=c,C=f}else R=t.offsetX,C=t.offsetY;E=t,_=t}}function D(t){if(E&&E.pointerId===t.pointerId){_=t;var e=y?0:t.offsetX-R,n=h?0:t.offsetY-C,r=Math.hypot(e,n),o=Math.max(r,i);k=e/o,A=-n/o}}function X(t){E&&E.pointerId===t.pointerId&&(_=t,E=null)}var Y=P&&r.style?r:document.body;P&&(Y.style.touchAction="none"),this.getControl=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=function(){return E?[k,A]:Z.defaultValue};return new Z(n,qt({},e,{device:t}))},this.destroy=function(){P&&(Y.style.touchAction=""),r.removeEventListener("pointerdown",I),r.removeEventListener("pointermove",D),r.removeEventListener("pointerup",X),r.removeEventListener("pointercancel",X)},Object.defineProperties(this,{pointerType:{get:function(){return _&&_.pointerType||""}},connected:{enumerable:!1,configurable:!1,writable:!1,value:T},timestamp:{get:function(){return _&&_.timeStamp||0}},element:{enumerable:!1,configurable:!1,writable:!1,value:r},x:{get:function(){return L?c:R},set:function(t){c=t}},y:{get:function(){return L?f:C},set:function(t){f=t}},radius:{get:function(){return i},set:function(t){i=t}}}),T&&(r.addEventListener("pointerdown",I),r.addEventListener("pointermove",D),r.addEventListener("pointerup",X),r.addEventListener("pointercancel",X))}function $t(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var u,c=t[Symbol.iterator]();!(r=(u=c.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return Nt(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Nt(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Nt(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function zt(){return(zt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}function Gt(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.device,r=e.innerRadius,o=void 0===r?Math.max(24,n.radius/4):r,i=e.parentElement,u=void 0===i?document.body:i,c=document.createElement("div");zt(c.style,{position:"fixed",pointerEvents:"none",borderRadius:"9.99e+22px",transition:"opacity 0.1s",backgroundColor:"rgba(128, 128, 128, 0.5)"});var a=document.createElement("div");zt(a.style,{position:"fixed",pointerEvents:"none",borderRadius:"9.99e+22px",transition:"opacity 0.1s",backgroundColor:"rgba(128, 128, 128, 0.5)"}),c.appendChild(a);var f=0;function l(){var e=$t(t.read(),2),r=e[0],i=e[1];if("static"===t.mode||r||i){var u=2*n.radius,s=n.x-n.radius,p=n.y-n.radius;c.style.left=s+"px",c.style.top=p+"px",c.style.width=c.style.height=u+"px",c.style.opacity=1;var y=2*o;a.style.left=n.x+r*n.radius-o+"px",a.style.top=n.y-i*n.radius-o+"px",a.style.width=a.style.height=y+"px",a.style.opacity=1}else c.style.opacity=0,a.style.opacity=0;f=requestAnimationFrame(l)}return u.appendChild(c),f=requestAnimationFrame(l),{destroy:function(){cancelAnimationFrame(f),c.parentNode&&c.parentNode.removeChild(c)}}}function Ht(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var u,c=t[Symbol.iterator]();!(r=(u=c.next()).done)&&(n.push(u.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return n}(t,e)||function(t,e){if(!t)return;if("string"==typeof t)return Jt(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);"Object"===n&&t.constructor&&(n=t.constructor.name);if("Map"===n||"Set"===n)return Array.from(t);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return Jt(t,e)}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Jt(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}function Kt(){return(Kt=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t}).apply(this,arguments)}Ft.prototype=Object.create(Ct.prototype);var Qt=new it,Zt=Qt.getControl("leftStick"),te=Qt.getControl("rightStick").find("x"),ee=new function(){var t=new Set,e=function(e){t.add(e.key.toLowerCase())},n=function(e){t.delete(e.key.toLowerCase())};function r(){return t.size>0}function o(e){return t.has(e.toLowerCase())}function i(e){return r()&&e(new Set(t))}function u(t){return t.some(o)}this.getControl=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=e.filter,c=void 0===n?t:n,a=at(e,["filter"]),f=r;return c&&("string"==typeof c?f=function(){return o(c)}:"function"==typeof c?f=function(){return i(c)}:Array.isArray(c)&&(f=function(){return u(c)})),new E(ut(f),ct({name:"string"==typeof t&&e.filter?t:"string"==typeof c?"key:".concat(c):String(t||c)},a))},this.destroy=function(){t.clear(),window.removeEventListener("keydown",e),window.removeEventListener("keyup",n)},Object.defineProperty(this,"connected",{enumerable:!1,configurable:!1,writable:!1,value:!0}),window.addEventListener("keydown",e),window.addEventListener("keyup",n)},ne=new wt({up:ee.getControl("W"),left:ee.getControl("A"),down:ee.getControl("S"),right:ee.getControl("D")}),re=new function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.updatePeriod,r=void 0===n?1e3/60:n,o=e.element,i=void 0===o?document.body:o,u=e.touch,c=void 0===u||u,a=e.pen,f=void 0===a||a,l=e.mouse,s=void 0===l||l,p=e.touchActionStyle,y=void 0===p||p,d=null,h=null,v=null,b={pen:f,mouse:s,touch:c},m=new Set,g=function(t){if(t.isPrimary&&b[t.pointerType]){d=h,h=t;for(var e=0;e<lt.length;e++){var n=1<<e,r=t.buttons&n,o=pt(t,e);r?m.add(o):m.delete(o)}}},w=function(t){v=t};function O(){h&&performance.now()-h.timeStamp>r&&(d=h),v&&performance.now()-v.timeStamp>r&&(v=null)}function j(t){return m.has(t.toLowerCase())}var S=y&&i.style?i:document.body;y&&(S.style.touchAction="none"),this.getControl=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=yt[e];if(r){var o=r.constructor,i=r.reader,u=function(){return O(),h?i(h,d,o.defaultValue):o.defaultValue};return new o(u,ft({name:e},n,{device:t}))}if(st.has(e))return new E(ut((function(){return j(e)})),ft({name:e},n));if("wheel"===e)return new Y((function(){return O(),v?[v.deltaX,v.deltaY]:Y.defaultValue}),ft({name:e},n,{device:t}));throw new Error("Control not found")},this.destroy=function(){y&&(S.style.touchAction=""),m.clear(),window.removeEventListener("pointerdown",g),window.removeEventListener("pointerup",g),window.removeEventListener("pointermove",g),window.removeEventListener("wheel",w)},Object.defineProperties(this,{pointerType:{get:function(){return h&&h.pointerType||""}},connected:{enumerable:!1,configurable:!1,writable:!1,value:!0},timestamp:{get:function(){return h&&h.timeStamp||0}}}),window.addEventListener("pointerdown",g),window.addEventListener("pointerup",g),window.addEventListener("pointermove",g),window.addEventListener("wheel",w)}({touch:!1}),oe=new _t({negative:ee.getControl("arrowleft"),positive:ee.getControl("arrowright")}),ie=new Wt({filter:function(t){return t.pageX<Math.max(200,.4*window.innerWidth)}}).getControl(),ue=new Wt({filter:function(t){return t.pageX>window.innerWidth-Math.max(200,.4*window.innerWidth)}}).getControl(),ce=new Tt({bindings:[Zt,ne,ie,{control:re.getControl("delta"),processors:[function(t){return[t[0]/8,-t[1]/8]}]}]}),ae=new Tt({bindings:[te,oe,ue.find("x"),re.getControl("wheel")]}),fe=new Tt({bindings:[ee.getControl(" ")],interactions:[new Ut,new Ft]});fe.on("completed",(function(t){return console.log("interaction",t)}));var le=document.createElement("div");Kt(le.style,{position:"absolute",width:"30px",height:"60px",backgroundColor:"rebeccapurple",margin:"-15px 30px"}),document.body.appendChild(le);var se=100,pe=100,ye=30,de=performance.now();Gt(ie),Gt(ue),function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:performance.now(),n=e-de;de=e,ce.update(),ae.update(),fe.update();var r=Ht(ce.value,2),o=r[0],i=r[1],u=ae.value,c=.3*n;se+=o*c,pe-=i*c,ye+=.36*u*n,le.style.transform="translate(".concat(se,"px, ").concat(pe,"px) rotate(").concat(ye,"deg)"),requestAnimationFrame(t)}()}});
//# sourceMappingURL=simple-c71c8ca549203bb959ce.js.map