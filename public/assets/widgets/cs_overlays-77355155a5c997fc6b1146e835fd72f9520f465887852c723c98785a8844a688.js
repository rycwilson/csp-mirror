function cspInitOverlays(e,t){function n(e){}function o(){"object"!=typeof IN?e.ajax({url:"https://platform.linkedin.com/in.js",method:"get",dataType:"script",timeout:6e3}).done(function(){}).fail(function(){}):IN.parse()}function i(t){var n=!1,o=null,i=null,r=null,s=1e4,a=1e4,c=function(e,t){setTimeout(function(){window.removeEventListener("message",t,!1)},e)},l=function(){var e=arguments[0];e.find("iframe").width()!==e.find('script[type*="MemberProfile"]').data("width")&&e.remove()},f=function(s){var d;s.origin||s.originalEvent.origin;s.origin.includes("linkedin")&&s.data.includes("-ready")&&null===o?o=parseInt(s.data.match(/\w+_(\d+)-ready/)[1],10):s.origin.includes("linkedin")&&s.data.includes("widgetReady")&&(i=parseInt(s.data.match(/\w+_(\d+)\s/)[1],10),r=i-o,d=t.find(".linkedin-widget").eq(r),d.addClass("cs-loaded"),setTimeout(l,1e3,d),n||(n=!0,c(a,f)),t.find(".linkedin-widget").toArray().every(function(t){return e(t).hasClass("cs-loaded")})&&t.find(".story-contributors").css("visibility","visible"))};c(s,f),window.addEventListener("message",f,!1),e(document).one("click",".cs-content.content--show .close-button",function(){window.removeEventListener("message",f,!1)})}var r=(window.location.href.match(/(\/plugins\/demo|weebly)/),function(e){e.addClass("cs-loading"),t.find("a").css("pointer-events","none"),setTimeout(function(){e.hasClass("cs-loaded")||e.addClass("cs-still-loading")},1e3)}),s=function(){var n,o=0;t.find(".scroll-wrap").on("touchstart",function(e){o=e.originalEvent.touches[0].pageY}).end().find(".scroll-wrap").on("touchmove",function(t){var i;n=e(this).prop("scrollHeight")-e(this).prop("offsetHeight"),i=o-t.originalEvent.touches[0].pageY,(e(this).prop("scrollTop")+i<0||e(this).prop("scrollTop")+i>n)&&(t.preventDefault(),e(this).prop("scrollTop",Math.max(0,Math.min(n,e(this).prop("scrollTop")+i))))})};s(),t.on("click","a.published, a.preview-published",function(s){s.preventDefault();var a,c=e(this);return!c.hasClass("cs-loaded")&&(r(c),void e.ajax({url:c.attr("href"),method:"GET",data:{is_widget:!0,window_width:window.innerWidth},dataType:"jsonp"}).done(function(r){var s=t.is("#cs-gallery")?c.index()+1:c.parent().index()+1;a=t.find(".content__item:nth-of-type("+s+")"),n(c),e.when(a.html(r.html),c.removeClass("cs-still-loading").addClass("cs-loaded")).then(function(){i(a)}).then(function(){c.hasClass("has-video")&&cspInitVideo(e,a),o(),t.on("click touchend",".cs-close-xs",function(){e(".content__item--show .cs-close").first().trigger("click")}),c[0].click()})}).fail(function(){}))})}!function(){Modernizr=function(e,t,n){function o(e){y.cssText=e}function i(e,t){return typeof e===t}function r(e,t){return!!~(""+e).indexOf(t)}function s(e,t){for(var o in e){var i=e[o];if(!r(i,"-")&&y[i]!==n)return"pfx"!=t||i}return!1}function a(e,t,o){for(var r in e){var s=t[e[r]];if(s!==n)return o===!1?e[r]:i(s,"function")?s.bind(o||t):s}return!1}function c(e,t,n){var o=e.charAt(0).toUpperCase()+e.slice(1),r=(e+" "+E.join(o+" ")+o).split(" ");return i(t,"string")||i(t,"undefined")?s(r,t):(r=(e+" "+b.join(o+" ")+o).split(" "),a(r,t,n))}var l,f,d,u="2.6.2",p={},m=!0,h=t.documentElement,v="modernizr",g=t.createElement(v),y=g.style,w=({}.toString,"Webkit Moz O ms"),E=w.split(" "),b=w.toLowerCase().split(" "),x={},T=[],C=T.slice,_={}.hasOwnProperty;d=i(_,"undefined")||i(_.call,"undefined")?function(e,t){return t in e&&i(e.constructor.prototype[t],"undefined")}:function(e,t){return _.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=C.call(arguments,1),o=function(){if(this instanceof o){var i=function(){};i.prototype=t.prototype;var r=new i,s=t.apply(r,n.concat(C.call(arguments)));return Object(s)===s?s:r}return t.apply(e,n.concat(C.call(arguments)))};return o}),x.csstransitions=function(){return c("transition")};for(var S in x)d(x,S)&&(f=S.toLowerCase(),p[f]=x[S](),T.push((p[f]?"":"no-")+f));return p.addTest=function(e,t){if("object"==typeof e)for(var o in e)d(e,o)&&p.addTest(o,e[o]);else{if(e=e.toLowerCase(),p[e]!==n)return p;t="function"==typeof t?t():t,"undefined"!=typeof m&&m&&(h.className+=" "+(t?"":"no-")+e),p[e]=t}return p},o(""),g=l=null,function(e,t){function n(e,t){var n=e.createElement("p"),o=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",o.insertBefore(n.lastChild,o.firstChild)}function o(){var e=g.elements;return"string"==typeof e?e.split(" "):e}function i(e){var t=v[e[m]];return t||(t={},h++,e[m]=h,v[h]=t),t}function r(e,n,o){if(n||(n=t),f)return n.createElement(e);o||(o=i(n));var r;return r=o.cache[e]?o.cache[e].cloneNode():p.test(e)?(o.cache[e]=o.createElem(e)).cloneNode():o.createElem(e),r.canHaveChildren&&!u.test(e)?o.frag.appendChild(r):r}function s(e,n){if(e||(e=t),f)return e.createDocumentFragment();n=n||i(e);for(var r=n.frag.cloneNode(),s=0,a=o(),c=a.length;s<c;s++)r.createElement(a[s]);return r}function a(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return g.shivMethods?r(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+o().join().replace(/\w+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(g,t.frag)}function c(e){e||(e=t);var o=i(e);return g.shivCSS&&!l&&!o.hasCSS&&(o.hasCSS=!!n(e,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),f||a(e,o),e}var l,f,d=e.html5||{},u=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,m="_html5shiv",h=0,v={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",l="hidden"in e,f=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(e){l=!0,f=!0}}();var g={elements:d.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:d.shivCSS!==!1,supportsUnknownElements:f,shivMethods:d.shivMethods!==!1,type:"default",shivDocument:c,createElement:r,createDocumentFragment:s};e.html5=g,c(t)}(this,t),p._version=u,p._domPrefixes=b,p._cssomPrefixes=E,p.testProp=function(e){return s([e])},p.testAllProps=c,p.prefixed=function(e,t,n){return t?c(e,t,n):c(e,"pfx")},h.className=h.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(m?" js "+T.join(" "):""),p}(this,this.document),function(e,t,n){function o(e){return"[object Function]"==v.call(e)}function i(e){return"string"==typeof e}function r(){}function s(e){return!e||"loaded"==e||"complete"==e||"uninitialized"==e}function a(){var e=g.shift();y=1,e?e.t?m(function(){("c"==e.t?u.injectCss:u.injectJs)(e.s,0,e.a,e.x,e.e,1)},0):(e(),a()):y=0}function c(e,n,o,i,r,c,l){function f(t){if(!p&&s(d.readyState)&&(w.r=p=1,!y&&a(),d.onload=d.onreadystatechange=null,t)){"img"!=e&&m(function(){b.removeChild(d)},50);for(var o in S[n])S[n].hasOwnProperty(o)&&S[n][o].onload()}}var l=l||u.errorTimeout,d=t.createElement(e),p=0,v=0,w={t:o,s:n,e:r,a:c,x:l};1===S[n]&&(v=1,S[n]=[]),"object"==e?d.data=n:(d.src=n,d.type=e),d.width=d.height="0",d.onerror=d.onload=d.onreadystatechange=function(){f.call(this,v)},g.splice(i,0,w),"img"!=e&&(v||2===S[n]?(b.insertBefore(d,E?null:h),m(f,l)):S[n].push(d))}function l(e,t,n,o,r){return y=0,t=t||"j",i(e)?c("c"==t?T:x,e,t,this.i++,n,o,r):(g.splice(this.i++,0,e),1==g.length&&a()),this}function f(){var e=u;return e.loader={load:l,i:0},e}var d,u,p=t.documentElement,m=e.setTimeout,h=t.getElementsByTagName("script")[0],v={}.toString,g=[],y=0,w="MozAppearance"in p.style,E=w&&!!t.createRange().compareNode,b=E?p:h.parentNode,p=e.opera&&"[object Opera]"==v.call(e.opera),p=!!t.attachEvent&&!p,x=w?"object":p?"script":"img",T=p?"script":x,C=Array.isArray||function(e){return"[object Array]"==v.call(e)},_=[],S={},k={timeout:function(e,t){return t.length&&(e.timeout=t[0]),e}};u=function(e){function t(e){var t,n,o,e=e.split("!"),i=_.length,r=e.pop(),s=e.length,r={url:r,origUrl:r,prefixes:e};for(n=0;n<s;n++)o=e[n].split("="),(t=k[o.shift()])&&(r=t(r,o));for(n=0;n<i;n++)r=_[n](r);return r}function s(e,i,r,s,a){var c=t(e),l=c.autoCallback;c.url.split(".").pop().split("?").shift(),c.bypass||(i&&(i=o(i)?i:i[e]||i[s]||i[e.split("/").pop().split("?")[0]]),c.instead?c.instead(e,i,r,s,a):(S[c.url]?c.noexec=!0:S[c.url]=1,r.load(c.url,c.forceCSS||!c.forceJS&&"css"==c.url.split(".").pop().split("?").shift()?"c":n,c.noexec,c.attrs,c.timeout),(o(i)||o(l))&&r.load(function(){f(),i&&i(c.origUrl,a,s),l&&l(c.origUrl,a,s),S[c.url]=2})))}function a(e,t){function n(e,n){if(e){if(i(e))n||(d=function(){var e=[].slice.call(arguments);u.apply(this,e),p()}),s(e,d,t,0,l);else if(Object(e)===e)for(c in a=function(){var t,n=0;for(t in e)e.hasOwnProperty(t)&&n++;return n}(),e)e.hasOwnProperty(c)&&(!n&&!--a&&(o(d)?d=function(){var e=[].slice.call(arguments);u.apply(this,e),p()}:d[c]=function(e){return function(){var t=[].slice.call(arguments);e&&e.apply(this,t),p()}}(u[c])),s(e[c],d,t,c,l))}else!n&&p()}var a,c,l=!!e.test,f=e.load||e.both,d=e.callback||r,u=d,p=e.complete||r;n(l?e.yep:e.nope,!!f),f&&n(f)}var c,l,d=this.yepnope.loader;if(i(e))s(e,0,d,0);else if(C(e))for(c=0;c<e.length;c++)l=e[c],i(l)?s(l,0,d,0):C(l)?u(l):Object(l)===l&&a(l,d);else Object(e)===e&&a(e,d)},u.addPrefix=function(e,t){k[e]=t},u.addFilter=function(e){_.push(e)},u.errorTimeout=1e4,null==t.readyState&&t.addEventListener&&(t.readyState="loading",t.addEventListener("DOMContentLoaded",d=function(){t.removeEventListener("DOMContentLoaded",d,0),t.readyState="complete"},0)),e.yepnope=f(),e.yepnope.executeStack=a,e.yepnope.injectJs=function(e,n,o,i,c,l){var f,d,p=t.createElement("script"),i=i||u.errorTimeout;p.src=e;for(d in o)p.setAttribute(d,o[d]);n=l?a:n||r,p.onreadystatechange=p.onload=function(){!f&&s(p.readyState)&&(f=1,n(),p.onload=p.onreadystatechange=null)},m(function(){f||(f=1,n(1))},i),c?p.onload():h.parentNode.insertBefore(p,h)},e.yepnope.injectCss=function(e,n,o,i,s,c){var l,i=t.createElement("link"),n=c?a:n||r;i.href=e,i.rel="stylesheet",i.type="text/css";for(l in o)i.setAttribute(l,o[l]);s||(h.parentNode.insertBefore(i,h),m(n,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))}}(),function(e){"use strict";function t(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")}function n(e,t){var n=o(e,t)?r:i;n(e,t)}var o,i,r;"classList"in document.documentElement?(o=function(e,t){return e.classList.contains(t)},i=function(e,t){e.classList.add(t)},r=function(e,t){e.classList.remove(t)}):(o=function(e,n){return t(n).test(e.className)},i=function(e,t){o(e,t)||(e.className=e.className+" "+t)},r=function(e,n){e.className=e.className.replace(t(n)," ")});var s={hasClass:o,addClass:i,removeClass:r,toggleClass:n,has:o,add:i,remove:r,toggle:n};"function"==typeof define&&define.amd?define(s):"object"==typeof exports?module.exports=s:e.classie=s}(window),function(e){function t(e){var t,n;return"x"===e?(t=u.clientWidth,n=window.innerWidth):"y"===e&&(t=u.clientHeight,n=window.innerHeight),t<n?n:t}function n(){return window.pageXOffset||u.scrollLeft}function o(){return window.pageYOffset||u.scrollTop}function i(){r()}function r(){[].slice.call(E).forEach(function(t,n){t.addEventListener("click",function(o){return o.preventDefault(),!(C||x===n||!e(t).hasClass("cs-loaded"))&&(C=!0,x=n,classie.add(t,"grid__item--loading"),void setTimeout(function(){classie.add(t,"grid__item--animate"),setTimeout(function(){s(t)},0)},0))})}),document.addEventListener("keydown",function(e){if(!C&&x!==-1){var t=e.keyCode||e.which;27===t&&(e.preventDefault(),"activeElement"in document&&document.activeElement.blur(),document.activeElement.blur(),document.activeElement.blur(),document.activeElement.blur(),a())}})}function s(n){var i=document.createElement("div");i.className="placeholder";var r,s;e(n).hasClass("grid__item--carousel")?(r=e(n).offset().left-e(g).offset().left,s=e(".cs-rh-container").offset().top+parseInt(e(".row-horizon").css("padding-top"))-e(g).offset().top):(r=n.offsetLeft,s=n.offsetTop),console.log("item.offsetHeight",n.offsetHeight),console.log("item.offsetWidth",n.offsetWidth),console.log("gridItemsContainer.offsetWidth",y.offsetWidth),i.style.WebkitTransform="translate3d("+r+"px, "+s+"px, 0px) scale3d("+n.offsetWidth/y.offsetWidth+","+n.offsetHeight/t("y")+",1)",i.style.transform="translate3d("+r+"px, "+s+"px, 0px) scale3d("+n.offsetWidth/y.offsetWidth+","+n.offsetHeight/t("y")+",1)",classie.add(i,"placeholder--trans-in"),y.appendChild(i),classie.add(d,"view-single"),setTimeout(function(){e(".cs-main").css("z-index","100000"),i.style.WebkitTransform="translate3d(-5px, "+(-5-(e(".cs-grid").offset().top-o()))+"px, 0px)",i.style.transform="translate3d(-5px, "+(-5-(e(".cs-grid").offset().top-o()))+"px, 0px)",window.addEventListener("scroll",c)},25),v(i,function(){classie.remove(i,"placeholder--trans-in"),classie.add(i,"placeholder--trans-out"),console.log("scrollY",o),console.log(".cs-grid offset.top",e(".cs-grid").offset().top),console.log(".cs-content top",o()-e(".cs-grid").offset().top),w.style.top=o()-e(".cs-grid").offset().top+"px",classie.add(w,"content--show"),classie.add(b[x],"content__item--show"),classie.addClass(d,"noscroll"),C=!1,e(".content__item--show .cs-close").one("click",a),e(g).find("a").each(function(){e(this).removeClass("cs-loading cs-still-loading").removeAttr("style")}),e("body").css("overflow-y","hidden"),e(".scroll-wrap").css("overflow-y","scroll")})}function a(){e(".scroll-wrap").css("overflow-y","hidden"),e("body").css("overflow-y",bodyScrollSetting);var n=E[x],o=b[x];classie.remove(o,"content__item--show"),classie.remove(w,"content--show"),classie.remove(d,"view-single"),setTimeout(function(){var i=y.querySelector(".placeholder");classie.removeClass(d,"noscroll"),e(n).hasClass("grid__item--carousel")?(itemOffsetLeft=e(n).offset().left,itemOffsetTop=e(".cs-rh-container").offset().top+parseInt(e(".row-horizon").css("padding-top"))-e(g).offset().top):(itemOffsetLeft=n.offsetLeft,itemOffsetTop=n.offsetTop),i.style.WebkitTransform="translate3d("+itemOffsetLeft+"px, "+itemOffsetTop+"px, 0px) scale3d("+n.offsetWidth/y.offsetWidth+","+n.offsetHeight/t("y")+",1)",i.style.transform="translate3d("+itemOffsetLeft+"px, "+itemOffsetTop+"px, 0px) scale3d("+n.offsetWidth/y.offsetWidth+","+n.offsetHeight/t("y")+",1)",i.style.backgroundColor="rgba(0, 0, 0, 0.6)",v(i,function(){e(".cs-main").css("z-index","50"),o.parentNode.scrollTop=0,y.removeChild(i),classie.remove(n,"grid__item--loading"),classie.remove(n,"grid__item--animate"),T=!1,window.removeEventListener("scroll",c)}),x=-1},25)}function c(){T||(T=!0,l=n(),f=o()),window.scrollTo(l,f)}var l,f,d=document.body,u=window.document.documentElement,p={transitions:Modernizr.csstransitions},m={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},h=m[Modernizr.prefixed("transition")],v=function(e,t){var n=function(e){if(p.transitions){if(e.target!=this)return;this.removeEventListener(h,n)}t&&"function"==typeof t&&t.call(this)};p.transitions?e.addEventListener(h,n):n()},g=document.getElementById("cs-gallery")||document.getElementById("cs-carousel"),y=g.querySelector(".cs-grid"),w=g.querySelector(".cs-content"),E=y.querySelectorAll(".grid__item"),b=w.querySelectorAll(".content__item"),x=-1,T=!1,C=!1;e("html").css("overflow-y");bodyScrollSetting=e("body").css("overflow-y"),i()}(jQuery);