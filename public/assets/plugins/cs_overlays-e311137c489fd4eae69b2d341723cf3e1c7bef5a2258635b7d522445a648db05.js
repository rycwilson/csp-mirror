function cspInitOverlays(r,s,n,t,i){function o(e){"customerstories.net"!==i||t||e.append('<iframe class="cs-iframe" height="0" width="0" style="display:none" src="'+e.attr("href")+'?track=1"></iframe>')}function c(){var t=r(".story-contributors"),e=t.find(".LI-profile-badge"),n=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,i=function(e){return"attributes"===e.type&&"data-uid"===e.attributeName};observer=new n(function(e){e.forEach(function(e){"attributes"===e.type||e.type,i(e)&&new ResizeSensor(r(e.target),function(){setTimeout(function(){t.css({visibility:"visible"})},200)})})}),e.each(function(){observer.observe(this,{attributes:!0,childList:!0})})}function e(){r.fn.popupWindow=function(e,t,n){e.preventDefault();var i=window.screenLeft!==undefined?window.screenLeft:screen.left,o=window.screenTop!==undefined?window.screenTop:screen.top,r=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,s=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height,c=r/2-(t=t||r)/2+i,a=s/2-(n=n||s)/2+o,l=(void 0!==this.attr("title")&&this.attr("title"),"width="+t+",height="+n+",top="+a+",left="+c+",resizable=no");window.open(this.attr("href"),"shareWindow",l).focus()}}var a,l,d,f=function(){var t=200;d=function(e){e?setTimeout(function(){r("button.olark-launch-button").css({opacity:"1","pointer-events":"auto"})},t):r("button.olark-launch-button").css({opacity:"0","pointer-events":"none"})},l=function(e){return parseInt(e.find(".cs-story-wrapper").css("margin-top"),10)+e.find(".cs-story-header").outerHeight(!0)+e.find(".cs-testimonial").outerHeight(!0)+(e.find(".story-results.hidden-xs:not(.visible-xs-block .story-results)").length?e.find(".story-results.hidden-xs:not(.visible-xs-block .story-results)").outerHeight(!0):0)+(e.find(".story-ctas.hidden-xs:not(.visible-xs-block .story-ctas)").length?e.find(".story-ctas.hidden-xs:not(.visible-xs-block .story-ctas)").outerHeight(!0):0)-25},document.addEventListener("scroll",function(e){if(r(e.target).is("section.content--show .scroll-wrap")){var t=r(e.target).scrollTop();a<t?r(".pixlee-cta").css({position:"fixed",height:"400px",width:r(".story-sidebar").width().toString()+"px",top:"25px",left:(r(".story-sidebar").offset().left+parseInt(r(".story-sidebar").css("padding-left"),10)).toString()+"px"}):r(".pixlee-cta").css({position:"static"})}},!0)},u=function(e){s.find("a.published, a.preview-published").css("pointer-events","none"),e.addClass("cs-loading cs-still-loading")},h=function(e){setTimeout(function(){e.find(".primary-cta-xs").addClass("open")},3e3)},p=function(e,t){t.find("*").addClass("cs"),t.find(".cs-share-buttons a").each(function(){var t,e,n;if(location.href.match(/\?cs=/))t=location.href;else{var i=r(this).attr("href").slice(r(this).attr("href").lastIndexOf("%2F")+3,r(this).attr("href").length);t=location.href+"?cs="+i}r(this).is('[href*="facebook"]')?e=new RegExp(/sharer.php\?u=.+$/):r(this).is('[href*="twitter"]')?e=new RegExp(/share\?url=.+$/):r(this).is('[href*="linkedin"]')&&(e=new RegExp(/shareArticle\?mini=true&url=.+$/)),r(this).is('[href*="mailto"]')?(e=/&body=.+$/,n="&body="+encodeURIComponent(t)):n=function(e){return e+encodeURIComponent("?redirect_uri="+t)},r(this).attr("href",r(this).attr("href").replace(e,n))}),e.find("a").hasClass("has-video")&&cspInitVideo(r,t,e),c(t),o(e)},m=function(){if(s.find(".story-card.cs-loaded").length){var e=r(".story-card.cs-loaded"),t=s.is("#cs-gallery")?e.index()+1:e.parent().index()+1,n=s.find(".content__item:nth-of-type("+t+")");p(e,n)}},v=function(t,n){r.ajax({url:t.find("a").attr("href"),method:"GET",data:{is_plugin:!0,window_width:window.innerWidth},dataType:"jsonp"}).done(function(e){r.when(n.html(e.html),t.removeClass("cs-still-loading").addClass("cs-loaded")).then(function(){p(t,n),t.find("a")[0].click(),h(n)})}).fail(function(){})},y=function(e,t){e.hasClass("cs-loaded")?(h(t),"pixlee"===n&&(a=l(t),d(!1))):(u(e),v(e,t))},g=function(t){setTimeout(function(){r("body").one("touchstart",function(e){r(e.target).is(t)||t.has(e.target).length||t.removeClass("cs-hover")})},100)};(function(){var n,i=0;s.find(".scroll-wrap").on("touchstart",function(e){i=e.originalEvent.touches[0].pageY}).end().find(".scroll-wrap").on("touchmove",function(e){var t;n=r(this).prop("scrollHeight")-r(this).prop("offsetHeight"),t=i-e.originalEvent.touches[0].pageY,(r(this).prop("scrollTop")+t<0||r(this).prop("scrollTop")+t>n)&&(e.preventDefault(),r(this).prop("scrollTop",Math.max(0,Math.min(n,r(this).prop("scrollTop")+t))))})})(),m(),e(),"pixlee"===n&&f(),s.on("click",".cs-close-xs",function(){r(".content__item--show .cs-close").first().trigger("click")}).on("click",".cs-close",function(){"pixlee"===n&&d(!0)}).on("click",".linkedin-widget",function(){window.open(r(this).data("linkedin-url"),"_blank")}).on("click",".primary-cta-xs.open",function(e){r(e.target).is('[class*="remove"]')?r(".primary-cta-xs").each(function(){r(this).remove()}):r(e.target).is("a")||r(this).find("a")[0].click()}).on("click touchstart",".story-card--published a",function(e){var t=r(this),n=r(this).parent(),i=s.is("#cs-gallery")?n.index()+1:n.parent().index()+1,o=s.find(".content__item:nth-of-type("+i+")");e.preventDefault(),"click"===e.type?y(n,o):n.hasClass("cs-hover")?t[0].click():(n.addClass("cs-hover"),s.find(".story-card").not(n).each(function(){r(this).removeClass("cs-hover")}),t.one("touchend",function(e){e.preventDefault()}),g(n))}).on("click",".cs-share-button",function(e){var t=r(this).is('[class*="facebook"]')?600:r(this).is('[class*="twitter"]')?500:550,n=r(this).is('[class*="facebook"]')?424:r(this).is('[class*="twitter"]')?446:540;r(window).width()<768?r(this).popupWindow(e):r(this).popupWindow(e,t,n)})}!function(){Modernizr=function(e,t,r){function n(e){y.cssText=e}function s(e,t){return typeof e===t}function o(e,t){return!!~(""+e).indexOf(t)}function c(e,t){for(var n in e){var i=e[n];if(!o(i,"-")&&y[i]!==r)return"pfx"!=t||i}return!1}function a(e,t,n){for(var i in e){var o=t[e[i]];if(o!==r)return!1===n?e[i]:s(o,"function")?o.bind(n||t):o}return!1}function i(e,t,n){var i=e.charAt(0).toUpperCase()+e.slice(1),o=(e+" "+w.join(i+" ")+i).split(" ");return s(t,"string")||s(t,"undefined")?c(o,t):a(o=(e+" "+b.join(i+" ")+i).split(" "),t,n)}var l,d,f="2.6.2",u={},h=!0,p=t.documentElement,m="modernizr",v=t.createElement(m),y=v.style,g=({}.toString,"Webkit Moz O ms"),w=g.split(" "),b=g.toLowerCase().split(" "),x={},E=[],C=E.slice,S={}.hasOwnProperty;for(var T in d=s(S,"undefined")||s(S.call,"undefined")?function(e,t){return t in e&&s(e.constructor.prototype[t],"undefined")}:function(e,t){return S.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(i){var o=this;if("function"!=typeof o)throw new TypeError;var r=C.call(arguments,1),s=function(){if(this instanceof s){var e=function(){};e.prototype=o.prototype;var t=new e,n=o.apply(t,r.concat(C.call(arguments)));return Object(n)===n?n:t}return o.apply(i,r.concat(C.call(arguments)))};return s}),x.csstransitions=function(){return i("transition")},x)d(x,T)&&(l=T.toLowerCase(),u[l]=x[T](),E.push((u[l]?"":"no-")+l));return u.addTest=function(e,t){if("object"==typeof e)for(var n in e)d(e,n)&&u.addTest(n,e[n]);else{if(e=e.toLowerCase(),u[e]!==r)return u;t="function"==typeof t?t():t,void 0!==h&&h&&(p.className+=" "+(t?"":"no-")+e),u[e]=t}return u},n(""),v=null,function(e,s){function n(e,t){var n=e.createElement("p"),i=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",i.insertBefore(n.lastChild,i.firstChild)}function c(){var e=y.elements;return"string"==typeof e?e.split(" "):e}function a(e){var t=v[e[p]];return t||(t={},m++,e[p]=m,v[m]=t),t}function i(e,t,n){return t||(t=s),d?t.createElement(e):(n||(n=a(t)),(i=n.cache[e]?n.cache[e].cloneNode():h.test(e)?(n.cache[e]=n.createElem(e)).cloneNode():n.createElem(e)).canHaveChildren&&!u.test(e)?n.frag.appendChild(i):i);var i}function t(e,t){if(e||(e=s),d)return e.createDocumentFragment();for(var n=(t=t||a(e)).frag.cloneNode(),i=0,o=c(),r=o.length;i<r;i++)n.createElement(o[i]);return n}function o(t,n){n.cache||(n.cache={},n.createElem=t.createElement,n.createFrag=t.createDocumentFragment,n.frag=n.createFrag()),t.createElement=function(e){return y.shivMethods?i(e,t,n):n.createElem(e)},t.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+c().join().replace(/\w+/g,function(e){return n.createElem(e),n.frag.createElement(e),'c("'+e+'")'})+");return n}")(y,n.frag)}function r(e){e||(e=s);var t=a(e);return y.shivCSS&&!l&&!t.hasCSS&&(t.hasCSS=!!n(e,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),d||o(e,t),e}var l,d,f=e.html5||{},u=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,h=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,p="_html5shiv",m=0,v={};!function(){try{var e=s.createElement("a");e.innerHTML="<xyz></xyz>",l="hidden"in e,d=1==e.childNodes.length||function(){s.createElement("a");var e=s.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(f){d=l=!0}}();var y={elements:f.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:!1!==f.shivCSS,supportsUnknownElements:d,shivMethods:!1!==f.shivMethods,type:"default",shivDocument:r,createElement:i,createDocumentFragment:t};e.html5=y,r(s)}(this,t),u._version=f,u._domPrefixes=b,u._cssomPrefixes=w,u.testProp=function(e){return c([e])},u.testAllProps=i,u.prefixed=function(e,t,n){return t?i(e,t,n):i(e,"pfx")},p.className=p.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(h?" js "+E.join(" "):""),u}(0,this.document),function(e,u,a){function f(e){return"[object Function]"==o.call(e)}function h(e){return"string"==typeof e}function p(){}function m(e){return!e||"loaded"==e||"complete"==e||"uninitialized"==e}function v(){var e=b.shift();x=1,e?e.t?g(function(){("c"==e.t?y.injectCss:y.injectJs)(e.s,0,e.a,e.x,e.e,1)},0):(e(),v()):x=0}function r(n,i,e,t,o,r,s){function c(e){if(!l&&m(a.readyState)&&(f.r=l=1,!x&&v(),a.onload=a.onreadystatechange=null,e))for(var t in"img"!=n&&g(function(){C.removeChild(a)},50),z[i])z[i].hasOwnProperty(t)&&z[i][t].onload()}s=s||y.errorTimeout;var a=u.createElement(n),l=0,d=0,f={t:e,s:i,e:o,a:r,x:s};1===z[i]&&(d=1,z[i]=[]),"object"==n?a.data=i:(a.src=i,a.type=n),a.width=a.height="0",a.onerror=a.onload=a.onreadystatechange=function(){c.call(this,d)},b.splice(t,0,f),"img"!=n&&(d||2===z[i]?(C.insertBefore(a,E?null:w),g(c,s)):z[i].push(a))}function t(e,t,n,i,o){return x=0,t=t||"j",h(e)?r("c"==t?d:c,e,t,this.i++,n,i,o):(b.splice(this.i++,0,e),1==b.length&&v()),this}function l(){var e=y;return e.loader={load:t,i:0},e}var n,y,i=u.documentElement,g=e.setTimeout,w=u.getElementsByTagName("script")[0],o={}.toString,b=[],x=0,s="MozAppearance"in i.style,E=s&&!!u.createRange().compareNode,C=E?i:w.parentNode,c=(i=e.opera&&"[object Opera]"==o.call(e.opera),i=!!u.attachEvent&&!i,s?"object":i?"script":"img"),d=i?"script":c,S=Array.isArray||function(e){return"[object Array]"==o.call(e)},T=[],z={},k={timeout:function(e,t){return t.length&&(e.timeout=t[0]),e}};(y=function(e){function c(e){e=e.split("!");var t,n,i,o=T.length,r=e.pop(),s=e.length;r={url:r,origUrl:r,prefixes:e};for(n=0;n<s;n++)i=e[n].split("="),(t=k[i.shift()])&&(r=t(r,i));for(n=0;n<o;n++)r=T[n](r);return r}function d(e,t,n,i,o){var r=c(e),s=r.autoCallback;r.url.split(".").pop().split("?").shift(),r.bypass||(t&&(t=f(t)?t:t[e]||t[i]||t[e.split("/").pop().split("?")[0]]),r.instead?r.instead(e,t,n,i,o):(z[r.url]?r.noexec=!0:z[r.url]=1,n.load(r.url,r.forceCSS||!r.forceJS&&"css"==r.url.split(".").pop().split("?").shift()?"c":a,r.noexec,r.attrs,r.timeout),(f(t)||f(s))&&n.load(function(){l(),t&&t(r.origUrl,o,i),s&&s(r.origUrl,o,i),z[r.url]=2})))}function t(e,t){function n(n,e){if(n){if(h(n))e||(c=function(){var e=[].slice.call(arguments);a.apply(this,e),l()}),d(n,c,t,0,r);else if(Object(n)===n)for(o in i=function(){var e,t=0;for(e in n)n.hasOwnProperty(e)&&t++;return t}(),n)n.hasOwnProperty(o)&&(!e&&!--i&&(f(c)?c=function(){var e=[].slice.call(arguments);a.apply(this,e),l()}:c[o]=function(t){return function(){var e=[].slice.call(arguments);t&&t.apply(this,e),l()}}(a[o])),d(n[o],c,t,o,r))}else!e&&l()}var i,o,r=!!e.test,s=e.load||e.both,c=e.callback||p,a=c,l=e.complete||p;n(r?e.yep:e.nope,!!s),s&&n(s)}var n,i,o=this.yepnope.loader;if(h(e))d(e,0,o,0);else if(S(e))for(n=0;n<e.length;n++)h(i=e[n])?d(i,0,o,0):S(i)?y(i):Object(i)===i&&t(i,o);else Object(e)===e&&t(e,o)}).addPrefix=function(e,t){k[e]=t},y.addFilter=function(e){T.push(e)},y.errorTimeout=1e4,null==u.readyState&&u.addEventListener&&(u.readyState="loading",u.addEventListener("DOMContentLoaded",n=function(){u.removeEventListener("DOMContentLoaded",n,0),u.readyState="complete"},0)),e.yepnope=l(),e.yepnope.executeStack=v,e.yepnope.injectJs=function(e,t,n,i,o,r){var s,c,a=u.createElement("script");i=i||y.errorTimeout;for(c in a.src=e,n)a.setAttribute(c,n[c]);t=r?v:t||p,a.onreadystatechange=a.onload=function(){!s&&m(a.readyState)&&(s=1,t(),a.onload=a.onreadystatechange=null)},g(function(){s||t(s=1)},i),o?a.onload():w.parentNode.insertBefore(a,w)},e.yepnope.injectCss=function(e,t,n,i,o,r){var s;i=u.createElement("link"),t=r?v:t||p;for(s in i.href=e,i.rel="stylesheet",i.type="text/css",n)i.setAttribute(s,n[s]);o||(w.parentNode.insertBefore(i,w),g(t,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))}}(),function(e){"use strict";function n(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")}function t(e,t){(i(e,t)?r:o)(e,t)}var i,o,r;"classList"in document.documentElement?(i=function(e,t){return e.classList.contains(t)},o=function(e,t){e.classList.add(t)},r=function(e,t){e.classList.remove(t)}):(i=function(e,t){return n(t).test(e.className)},o=function(e,t){i(e,t)||(e.className=e.className+" "+t)},r=function(e,t){e.className=e.className.replace(n(t)," ")});var s={hasClass:i,addClass:o,removeClass:r,toggleClass:t,has:i,add:o,remove:r,toggle:t};"function"==typeof define&&define.amd?define(s):"object"==typeof exports?module.exports=s:e.classie=s}(window),function(i){function o(e){var t;return"x"===e?t=window.innerWidth:"y"===e&&(t=window.innerHeight),t}function e(){return window.pageXOffset||p.scrollLeft}function n(){return window.pageYOffset||p.scrollTop}function t(){r()}function r(){[].slice.call(x).forEach(function(t,n){t.addEventListener("click",function(e){if(e.preventDefault(),T||C===n||!i(t).parent().hasClass("cs-loaded"))return!1;T=!0,C=n,classie.add(t,"grid__item--loading"),setTimeout(function(){classie.add(t,"grid__item--animate"),setTimeout(function(){s(t)},0)},0)})}),document.addEventListener("keydown",function(e){T||-1===C||27===(e.keyCode||e.which)&&(e.preventDefault(),"activeElement"in document&&document.activeElement.blur(),document.activeElement.blur(),document.activeElement.blur(),document.activeElement.blur(),c())})}function s(e){var t=document.createElement("div");t.className="placeholder",f=i(e).offset().left-j,u=i(e).hasClass("grid__item--carousel")?i(".cs-carousel__carousel").offset().top+parseInt(i(".row-horizon").css("padding-top"))-i(g).offset().top:e.parentNode.offsetTop,t.style.WebkitTransform="translate3d("+f+"px, "+u+"px, 0px) scale3d("+e.offsetWidth/(w.offsetWidth+j+L+_)+","+e.offsetHeight/o("y")+",1)",t.style.transform="translate3d("+f+"px, "+u+"px, 0px) scale3d("+e.offsetWidth/(w.offsetWidth+j+L+_)+","+e.offsetHeight/o("y")+",1)",classie.add(t,"placeholder--trans-in"),w.appendChild(t),setTimeout(function(){i(".cs-main").css("z-index","100000"),i("body").css("overflow-x","hidden"),t.style.WebkitTransform="translate3d("+-1*j+"px,"+-1*(i(".cs-grid").offset().top-n())+"px, 0px)",t.style.transform="translate3d("+-1*j+"px,"+-1*(i(".cs-grid").offset().top-n())+"px, 0px)",window.addEventListener("scroll",a)},25),y(t,function(){i("#cs-loading-pre-select").remove(),i(".cs-overlay-container").removeClass("pre-selected"),classie.remove(t,"placeholder--trans-in"),classie.add(t,"placeholder--trans-out"),b.style.top=n()-i(".cs-grid").offset().top+"px",classie.add(b,"content--show"),classie.add(E[C],"content__item--show"),classie.addClass(h,"noscroll"),T=!1,i(".content__item--show .cs-close").one("click",c),i(g).find('.story-card a:not([style*="display: none"])').each(function(){i(this).parent().removeClass("cs-hover cs-loading cs-still-loading").end().removeAttr("style")}),i("body").css("overflow-y","hidden"),i("body").css("overflow-x",k),i(".scroll-wrap").css("overflow-y","scroll"),history.replaceState({},null,window.location.pathname+"?cs="+e.href.slice(e.href.lastIndexOf("/")+1,e.href.length))})}function c(){var t=x[C],n=E[C];i(".scroll-wrap").css("overflow-y","hidden"),i("body").css("overflow-y",z),classie.remove(n,"content__item--show"),classie.remove(b,"content--show"),classie.remove(h,"view-single"),setTimeout(function(){var e=w.querySelector(".placeholder");classie.removeClass(h,"noscroll"),e.style.WebkitTransform="translate3d("+f+"px, "+u+"px, 0px) scale3d("+t.offsetWidth/(w.offsetWidth+j+L+_)+","+t.offsetHeight/o("y")+",1)",e.style.transform="translate3d("+f+"px, "+u+"px, 0px) scale3d("+t.offsetWidth/(w.offsetWidth+j+L+_)+","+t.offsetHeight/o("y")+",1)",y(e,function(){n.parentNode.scrollTop=0,w.removeChild(e),classie.remove(t,"grid__item--loading"),classie.remove(t,"grid__item--animate"),S=!1,window.removeEventListener("scroll",a),i(".cs-main").css("z-index","50"),history.replaceState({},null,window.location.pathname),i(".primary-cta-xs").each(function(){i(this).removeClass("open")})}),C=-1},25)}function a(){S||(S=!0,l=e(),d=n()),window.scrollTo(l,d)}var l,d,f,u,h=document.body,p=window.document.documentElement,m={transitions:Modernizr.csstransitions},v={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"}[Modernizr.prefixed("transition")],y=function(e,t){var n=function(e){if(m.transitions){if(e.target!=this)return;this.removeEventListener(v,n)}t&&"function"==typeof t&&t.call(this)};m.transitions?e.addEventListener(v,n):n()},g=document.getElementById("cs-gallery")||document.getElementById("cs-carousel"),w=g.querySelector(".cs-grid"),b=g.querySelector(".cs-content"),x=w.querySelectorAll(".grid__item"),E=b.querySelectorAll(".content__item"),C=-1,S=!1,T=!1,z=i("body").css("overflow-y"),k=i("body").css("overflow-x"),_=window.innerWidth-document.body.clientWidth,j=i(g).offset().left,L=i(window).width()-(i(g).offset().left+i(g).outerWidth());i(".cs-content").css("margin-left","-"+j+"px"),t()}(jQuery),function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.ResizeSensor=t()}("undefined"!=typeof window?window:this,function(){function o(e,t){var n=Object.prototype.toString.call(e),i="[object Array]"===n||"[object NodeList]"===n||"[object HTMLCollection]"===n||"[object Object]"===n||"undefined"!=typeof jQuery&&e instanceof jQuery||"undefined"!=typeof Elements&&e instanceof Elements,o=0,r=e.length;if(i)for(;o<r;o++)t(e[o]);else t(e)}function b(e){if(!e.getBoundingClientRect)return{width:e.offsetWidth,height:e.offsetHeight};var t=e.getBoundingClientRect();return{width:Math.round(t.width),height:Math.round(t.height)}}if("undefined"==typeof window)return null;var x=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(e){return window.setTimeout(e,20)},r=function(t,n){function w(){var n,i,o=[];this.add=function(e){o.push(e)},this.call=function(){for(n=0,i=o.length;n<i;n++)o[n].call()},this.remove=function(e){var t=[];for(n=0,i=o.length;n<i;n++)o[n]!==e&&t.push(o[n]);o=t},this.length=function(){return o.length}}function i(i,e){if(i)if(i.resizedAttached)i.resizedAttached.add(e);else{i.resizedAttached=new w,i.resizedAttached.add(e),i.resizeSensor=document.createElement("div"),i.resizeSensor.dir="ltr",i.resizeSensor.className="resize-sensor";var t="position: absolute; left: -10px; top: -10px; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;",n="position: absolute; left: 0; top: 0; transition: 0s;";i.resizeSensor.style.cssText=t,i.resizeSensor.innerHTML='<div class="resize-sensor-expand" style="'+t+'"><div style="'+n+'"></div></div><div class="resize-sensor-shrink" style="'+t+'"><div style="'+n+' width: 200%; height: 200%"></div></div>',i.appendChild(i.resizeSensor);var o=window.getComputedStyle(i).getPropertyValue("position");"absolute"!==o&&"relative"!==o&&"fixed"!==o&&(i.style.position="relative");var r,s,c,a,l=i.resizeSensor.childNodes[0],d=l.childNodes[0],f=i.resizeSensor.childNodes[1],u=b(i),h=u.width,p=u.height,m=function(){var e=0===i.offsetWidth&&0===i.offsetHeight;if(e){var t=i.style.display;i.style.display="block"}d.style.width="100000px",d.style.height="100000px",l.scrollLeft=1e5,l.scrollTop=1e5,f.scrollLeft=1e5,f.scrollTop=1e5,e&&(i.style.display=t)};i.resizeSensor.resetSensor=m;var v=function(){s=0,r&&(h=c,p=a,i.resizedAttached&&i.resizedAttached.call())},y=function(){var e=b(i),t=e.width,n=e.height;(r=t!=h||n!=p)&&!s&&(s=x(v)),m()},g=function(e,t,n){e.attachEvent?e.attachEvent("on"+t,n):e.addEventListener(t,n)};g(l,"scroll",y),g(f,"scroll",y),x(m)}}o(t,function(e){i(e,n)}),this.detach=function(e){r.detach(t,e)},this.reset=function(){t.resizeSensor.resetSensor()}};return r.reset=function(e){o(e,function(e){e.resizeSensor.resetSensor()})},r.detach=function(e,t){o(e,function(e){e&&(e.resizedAttached&&"function"==typeof t&&(e.resizedAttached.remove(t),e.resizedAttached.length())||e.resizeSensor&&(e.contains(e.resizeSensor)&&e.removeChild(e.resizeSensor),delete e.resizeSensor,delete e.resizedAttached))})},r});