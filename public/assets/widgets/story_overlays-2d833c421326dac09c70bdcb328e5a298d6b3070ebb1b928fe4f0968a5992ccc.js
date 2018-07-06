Modernizr=function(e,t,n){function o(e){g.cssText=e}function r(e,t){return typeof e===t}function i(e,t){return!!~(""+e).indexOf(t)}function a(e,t){for(var o in e){var r=e[o];if(!i(r,"-")&&g[r]!==n)return"pfx"!=t||r}return!1}function s(e,t,o){for(var i in e){var a=t[e[i]];if(a!==n)return o===!1?e[i]:r(a,"function")?a.bind(o||t):a}return!1}function c(e,t,n){var o=e.charAt(0).toUpperCase()+e.slice(1),i=(e+" "+b.join(o+" ")+o).split(" ");return r(t,"string")||r(t,"undefined")?a(i,t):(i=(e+" "+w.join(o+" ")+o).split(" "),s(i,t,n))}var l,f,u,d="2.6.2",p={},m=!0,h=t.documentElement,v="modernizr",y=t.createElement(v),g=y.style,E=({}.toString,"Webkit Moz O ms"),b=E.split(" "),w=E.toLowerCase().split(" "),x={},T=[],C=T.slice,S={}.hasOwnProperty;u=r(S,"undefined")||r(S.call,"undefined")?function(e,t){return t in e&&r(e.constructor.prototype[t],"undefined")}:function(e,t){return S.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=C.call(arguments,1),o=function(){if(this instanceof o){var r=function(){};r.prototype=t.prototype;var i=new r,a=t.apply(i,n.concat(C.call(arguments)));return Object(a)===a?a:i}return t.apply(e,n.concat(C.call(arguments)))};return o}),x.csstransitions=function(){return c("transition")};for(var L in x)u(x,L)&&(f=L.toLowerCase(),p[f]=x[L](),T.push((p[f]?"":"no-")+f));return p.addTest=function(e,t){if("object"==typeof e)for(var o in e)u(e,o)&&p.addTest(o,e[o]);else{if(e=e.toLowerCase(),p[e]!==n)return p;t="function"==typeof t?t():t,"undefined"!=typeof m&&m&&(h.className+=" "+(t?"":"no-")+e),p[e]=t}return p},o(""),y=l=null,function(e,t){function n(e,t){var n=e.createElement("p"),o=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",o.insertBefore(n.lastChild,o.firstChild)}function o(){var e=y.elements;return"string"==typeof e?e.split(" "):e}function r(e){var t=v[e[m]];return t||(t={},h++,e[m]=h,v[h]=t),t}function i(e,n,o){if(n||(n=t),f)return n.createElement(e);o||(o=r(n));var i;return i=o.cache[e]?o.cache[e].cloneNode():p.test(e)?(o.cache[e]=o.createElem(e)).cloneNode():o.createElem(e),i.canHaveChildren&&!d.test(e)?o.frag.appendChild(i):i}function a(e,n){if(e||(e=t),f)return e.createDocumentFragment();n=n||r(e);for(var i=n.frag.cloneNode(),a=0,s=o(),c=s.length;a<c;a++)i.createElement(s[a]);return i}function s(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return y.shivMethods?i(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+o().join().replace(/\w+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(y,t.frag)}function c(e){e||(e=t);var o=r(e);return y.shivCSS&&!l&&!o.hasCSS&&(o.hasCSS=!!n(e,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),f||s(e,o),e}var l,f,u=e.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,m="_html5shiv",h=0,v={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",l="hidden"in e,f=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(e){l=!0,f=!0}}();var y={elements:u.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:u.shivCSS!==!1,supportsUnknownElements:f,shivMethods:u.shivMethods!==!1,type:"default",shivDocument:c,createElement:i,createDocumentFragment:a};e.html5=y,c(t)}(this,t),p._version=d,p._domPrefixes=w,p._cssomPrefixes=b,p.testProp=function(e){return a([e])},p.testAllProps=c,p.prefixed=function(e,t,n){return t?c(e,t,n):c(e,"pfx")},h.className=h.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(m?" js "+T.join(" "):""),p}(this,this.document),function(e,t,n){function o(e){return"[object Function]"==v.call(e)}function r(e){return"string"==typeof e}function i(){}function a(e){return!e||"loaded"==e||"complete"==e||"uninitialized"==e}function s(){var e=y.shift();g=1,e?e.t?m(function(){("c"==e.t?d.injectCss:d.injectJs)(e.s,0,e.a,e.x,e.e,1)},0):(e(),s()):g=0}function c(e,n,o,r,i,c,l){function f(t){if(!p&&a(u.readyState)&&(E.r=p=1,!g&&s(),u.onload=u.onreadystatechange=null,t)){"img"!=e&&m(function(){w.removeChild(u)},50);for(var o in L[n])L[n].hasOwnProperty(o)&&L[n][o].onload()}}var l=l||d.errorTimeout,u=t.createElement(e),p=0,v=0,E={t:o,s:n,e:i,a:c,x:l};1===L[n]&&(v=1,L[n]=[]),"object"==e?u.data=n:(u.src=n,u.type=e),u.width=u.height="0",u.onerror=u.onload=u.onreadystatechange=function(){f.call(this,v)},y.splice(r,0,E),"img"!=e&&(v||2===L[n]?(w.insertBefore(u,b?null:h),m(f,l)):L[n].push(u))}function l(e,t,n,o,i){return g=0,t=t||"j",r(e)?c("c"==t?T:x,e,t,this.i++,n,o,i):(y.splice(this.i++,0,e),1==y.length&&s()),this}function f(){var e=d;return e.loader={load:l,i:0},e}var u,d,p=t.documentElement,m=e.setTimeout,h=t.getElementsByTagName("script")[0],v={}.toString,y=[],g=0,E="MozAppearance"in p.style,b=E&&!!t.createRange().compareNode,w=b?p:h.parentNode,p=e.opera&&"[object Opera]"==v.call(e.opera),p=!!t.attachEvent&&!p,x=E?"object":p?"script":"img",T=p?"script":x,C=Array.isArray||function(e){return"[object Array]"==v.call(e)},S=[],L={},j={timeout:function(e,t){return t.length&&(e.timeout=t[0]),e}};d=function(e){function t(e){var t,n,o,e=e.split("!"),r=S.length,i=e.pop(),a=e.length,i={url:i,origUrl:i,prefixes:e};for(n=0;n<a;n++)o=e[n].split("="),(t=j[o.shift()])&&(i=t(i,o));for(n=0;n<r;n++)i=S[n](i);return i}function a(e,r,i,a,s){var c=t(e),l=c.autoCallback;c.url.split(".").pop().split("?").shift(),c.bypass||(r&&(r=o(r)?r:r[e]||r[a]||r[e.split("/").pop().split("?")[0]]),c.instead?c.instead(e,r,i,a,s):(L[c.url]?c.noexec=!0:L[c.url]=1,i.load(c.url,c.forceCSS||!c.forceJS&&"css"==c.url.split(".").pop().split("?").shift()?"c":n,c.noexec,c.attrs,c.timeout),(o(r)||o(l))&&i.load(function(){f(),r&&r(c.origUrl,s,a),l&&l(c.origUrl,s,a),L[c.url]=2})))}function s(e,t){function n(e,n){if(e){if(r(e))n||(u=function(){var e=[].slice.call(arguments);d.apply(this,e),p()}),a(e,u,t,0,l);else if(Object(e)===e)for(c in s=function(){var t,n=0;for(t in e)e.hasOwnProperty(t)&&n++;return n}(),e)e.hasOwnProperty(c)&&(!n&&!--s&&(o(u)?u=function(){var e=[].slice.call(arguments);d.apply(this,e),p()}:u[c]=function(e){return function(){var t=[].slice.call(arguments);e&&e.apply(this,t),p()}}(d[c])),a(e[c],u,t,c,l))}else!n&&p()}var s,c,l=!!e.test,f=e.load||e.both,u=e.callback||i,d=u,p=e.complete||i;n(l?e.yep:e.nope,!!f),f&&n(f)}var c,l,u=this.yepnope.loader;if(r(e))a(e,0,u,0);else if(C(e))for(c=0;c<e.length;c++)l=e[c],r(l)?a(l,0,u,0):C(l)?d(l):Object(l)===l&&s(l,u);else Object(e)===e&&s(e,u)},d.addPrefix=function(e,t){j[e]=t},d.addFilter=function(e){S.push(e)},d.errorTimeout=1e4,null==t.readyState&&t.addEventListener&&(t.readyState="loading",t.addEventListener("DOMContentLoaded",u=function(){t.removeEventListener("DOMContentLoaded",u,0),t.readyState="complete"},0)),e.yepnope=f(),e.yepnope.executeStack=s,e.yepnope.injectJs=function(e,n,o,r,c,l){var f,u,p=t.createElement("script"),r=r||d.errorTimeout;p.src=e;for(u in o)p.setAttribute(u,o[u]);n=l?s:n||i,p.onreadystatechange=p.onload=function(){!f&&a(p.readyState)&&(f=1,n(),p.onload=p.onreadystatechange=null)},m(function(){f||(f=1,n(1))},r),c?p.onload():h.parentNode.insertBefore(p,h)},e.yepnope.injectCss=function(e,n,o,r,a,c){var l,r=t.createElement("link"),n=c?s:n||i;r.href=e,r.rel="stylesheet",r.type="text/css";for(l in o)r.setAttribute(l,o[l]);a||(h.parentNode.insertBefore(r,h),m(n,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},function(e){"use strict";function t(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")}function n(e,t){var n=o(e,t)?i:r;n(e,t)}var o,r,i;"classList"in document.documentElement?(o=function(e,t){return e.classList.contains(t)},r=function(e,t){e.classList.add(t)},i=function(e,t){e.classList.remove(t)}):(o=function(e,n){return t(n).test(e.className)},r=function(e,t){o(e,t)||(e.className=e.className+" "+t)},i=function(e,n){e.className=e.className.replace(t(n)," ")});var a={hasClass:o,addClass:r,removeClass:i,toggleClass:n,has:o,add:r,remove:i,toggle:n};"function"==typeof define&&define.amd?define(a):"object"==typeof exports?module.exports=a:e.classie=a}(window),function(){function e(e){var t,n;return"x"===e?(t=u.clientWidth,n=window.innerWidth):"y"===e&&(t=u.clientHeight,n=window.innerHeight),t<n?n:t}function t(){return window.pageXOffset||u.scrollLeft}function n(){return window.pageYOffset||u.scrollTop}function o(){r()}function r(){[].slice.call(E).forEach(function(e,t){e.addEventListener("click",function(n){return n.preventDefault(),!(C||x===t||!$(e).hasClass("cs-loaded"))&&(C=!0,x=t,classie.add(e,"grid__item--loading"),void setTimeout(function(){classie.add(e,"grid__item--animate"),setTimeout(function(){i(e)},0)},0))})}),w.addEventListener("click",function(){$("body").css("overflow-y","auto"),a()}),document.addEventListener("keydown",function(e){if(!C&&x!==-1){var t=e.keyCode||e.which;27===t&&(e.preventDefault(),"activeElement"in document&&document.activeElement.blur(),document.activeElement.blur(),document.activeElement.blur(),document.activeElement.blur(),a())}})}function i(t){var o=document.createElement("div");o.className="placeholder",o.style.WebkitTransform="translate3d("+(t.offsetLeft-5)+"px, "+(t.offsetTop-5)+"px, 0px) scale3d("+t.offsetWidth/y.offsetWidth+","+t.offsetHeight/e("y")+",1)",o.style.transform="translate3d("+(t.offsetLeft-5)+"px, "+(t.offsetTop-5)+"px, 0px) scale3d("+t.offsetWidth/y.offsetWidth+","+t.offsetHeight/e("y")+",1)",classie.add(o,"placeholder--trans-in"),y.appendChild(o),classie.add(f,"view-single"),setTimeout(function(){o.style.WebkitTransform="translate3d(-5px, "+(-5-($("section.grid").offset().top-n()))+"px, 0px)",o.style.transform="translate3d(-5px, "+(-5-($("section.grid").offset().top-n()))+"px, 0px)",window.addEventListener("scroll",s)},25),h(o,function(){classie.remove(o,"placeholder--trans-in"),classie.add(o,"placeholder--trans-out"),g.style.top=n()-$("section.grid").offset().top+"px",classie.add(g,"content--show"),classie.add(b[x],"content__item--show"),classie.add(w,"close-button--show"),classie.addClass(f,"noscroll"),C=!1,$("body").css("overflow-y","hidden")})}function a(){var t=E[x],n=b[x];classie.remove(n,"content__item--show"),classie.remove(g,"content--show"),classie.remove(w,"close-button--show"),classie.remove(f,"view-single"),setTimeout(function(){var o=y.querySelector(".placeholder");classie.removeClass(f,"noscroll"),o.style.WebkitTransform="translate3d("+t.offsetLeft+"px, "+t.offsetTop+"px, 0px) scale3d("+t.offsetWidth/y.offsetWidth+","+t.offsetHeight/e("y")+",1)",o.style.transform="translate3d("+t.offsetLeft+"px, "+t.offsetTop+"px, 0px) scale3d("+t.offsetWidth/y.offsetWidth+","+t.offsetHeight/e("y")+",1)",h(o,function(){n.parentNode.scrollTop=0,y.removeChild(o),classie.remove(t,"grid__item--loading"),classie.remove(t,"grid__item--animate"),T=!1,window.removeEventListener("scroll",s)}),x=-1},25)}function s(){T||(T=!0,c=t(),l=n()),window.scrollTo(c,l)}var c,l,f=document.body,u=window.document.documentElement,d={transitions:Modernizr.csstransitions},p={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},m=p[Modernizr.prefixed("transition")],h=function(e,t){var n=function(e){if(d.transitions){if(e.target!=this)return;this.removeEventListener(m,n)}t&&"function"==typeof t&&t.call(this)};d.transitions?e.addEventListener(m,n):n()},v=document.getElementById("cs-gallery"),y=v.querySelector("section.grid"),g=v.querySelector("section.content"),E=y.querySelectorAll(".grid__item"),b=g.querySelectorAll(".content__item"),w=g.querySelector(".close-button"),x=-1,T=!1,C=!1;o()}();