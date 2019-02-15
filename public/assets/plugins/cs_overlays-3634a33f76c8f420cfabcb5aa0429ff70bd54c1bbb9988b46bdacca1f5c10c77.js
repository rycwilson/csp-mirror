function cspInitOverlays(e,t,n,i,o){function r(e){"customerstories.net"!==o||i||e.append('<iframe class="cs-iframe" height="0" width="0" style="display:none" src="'+e.attr("href")+'?track=1"></iframe>')}function s(){"object"!=typeof IN?e.ajax({url:"https://platform.linkedin.com/in.js",method:"get",dataType:"script",timeout:5e3}).done(function(){}).fail(function(){}):IN.parse()}function a(t){var n,i=t.find(".story-contributors"),o=i.find(".linkedin-widget"),r=!1,s=null,a=null,c=null,l=o.length,d=0,u=1e4,f=function(e,t){n=setTimeout(function(){window.removeEventListener("message",t,!1),i.remove()},e)},p=function(e,t){t!==e.find('script[type*="MemberProfile"]').data("width")&&(e.remove(),l--)},h=function(e){var t,u,f=e.origin||e.originalEvent.origin,h=f.includes("linkedin")&&e.data.includes("-ready")&&null===s,m=f.includes("linkedin")&&e.data.includes("widgetReady"),v=f.includes("linkedin")&&e.data.includes("resize");s=h&&parseInt(e.data.match(/\w+_(\d+)-ready/)[1],10),(m||v)&&(a=parseInt(e.data.match(/\w+_(\d+)\s/)[1],10),c=a-s,t=o.eq(c)),m&&(r=!0,new ResizeSensor(t,function(){d++,d===l&&(clearTimeout(n),i.css("visibility","visible"))})),v&&(u=JSON.parse(e.data.split(" ")[1]).params[0],p(t,u))};window.addEventListener("message",h,!1),f(u,h),e(document).one("click",".cs-content.content--show .close-button",function(){window.removeEventListener("message",h,!1)})}function c(){e.fn.popupWindow=function(e,t,n){e.preventDefault();var i=void 0!==window.screenLeft?window.screenLeft:screen.left,o=void 0!==window.screenTop?window.screenTop:screen.top,r=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,s=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height;t=t||r,n=n||s;var a=r/2-t/2+i,c=s/2-n/2+o,l=("undefined"!=typeof this.attr("title")?this.attr("title"):"Social Share","width="+t+",height="+n+",top="+c+",left="+a+",resizable=no");window.open(this.attr("href"),"shareWindow",l).focus()}}var l,d,u,f=function(){var t=200;u=function(n){n?setTimeout(function(){e("button.olark-launch-button").css({opacity:"1","pointer-events":"auto"})},t):e("button.olark-launch-button").css({opacity:"0","pointer-events":"none"})},d=function(e){return parseInt(e.find(".cs-story-wrapper").css("margin-top"),10)+e.find(".cs-story-header").outerHeight(!0)+e.find(".cs-testimonial").outerHeight(!0)+(e.find(".story-results.hidden-xs:not(.visible-xs-block .story-results)").length?e.find(".story-results.hidden-xs:not(.visible-xs-block .story-results)").outerHeight(!0):0)+(e.find(".story-ctas.hidden-xs:not(.visible-xs-block .story-ctas)").length?e.find(".story-ctas.hidden-xs:not(.visible-xs-block .story-ctas)").outerHeight(!0):0)-25},document.addEventListener("scroll",function(t){if(e(t.target).is("section.content--show .scroll-wrap")){var n=e(t.target).scrollTop();n>l?e(".pixlee-cta").css({position:"fixed",height:"400px",width:e(".story-sidebar").width().toString()+"px",top:"25px",left:(e(".story-sidebar").offset().left+parseInt(e(".story-sidebar").css("padding-left"),10)).toString()+"px"}):e(".pixlee-cta").css({position:"static"})}},!0)},p=function(){var n,i=0;t.find(".scroll-wrap").on("touchstart",function(e){i=e.originalEvent.touches[0].pageY}).end().find(".scroll-wrap").on("touchmove",function(t){var o;n=e(this).prop("scrollHeight")-e(this).prop("offsetHeight"),o=i-t.originalEvent.touches[0].pageY,(e(this).prop("scrollTop")+o<0||e(this).prop("scrollTop")+o>n)&&(t.preventDefault(),e(this).prop("scrollTop",Math.max(0,Math.min(n,e(this).prop("scrollTop")+o))))})},h=function(e){t.find("a.published, a.preview-published").css("pointer-events","none"),e.addClass("cs-loading cs-still-loading")},m=function(e){setTimeout(function(){e.find(".primary-cta-xs").addClass("open")},3e3)},v=function(t,n){console.log("initOverlay()"),n.find('[class*="share__button"] a').each(function(){var t;e(this).parent().is('[class*="--facebook')?t=new RegExp(/sharer.php\?u=.+$/):e(this).parent().is('[class*="--linkedin')?t=new RegExp(/shareArticle\?mini=true&url=.+$/):e(this).parent().is('[class*="--twitter')&&(t=new RegExp(/intent\/tweet\?url=.+$/)),e(this).attr("href",e(this).attr("href").replace(t,function(e){return e+encodeURIComponent("?redirect_uri="+location.href)}))}),t.hasClass("has-video")&&cspInitVideo(e,n),s(),r(t)},y=function(){if(t.find("a.cs-loaded").length){var n=e("a.cs-loaded"),i=t.is("#cs-gallery")?n.index()+1:n.parent().index()+1,o=t.find(".content__item:nth-of-type("+i+")");v(n,o)}},g=function(t,n){e.ajax({url:t.attr("href"),method:"GET",data:{is_plugin:!0,window_width:window.innerWidth},dataType:"jsonp"}).done(function(i){e.when(n.html(i.html),t.removeClass("cs-still-loading").addClass("cs-loaded")).then(function(){a(n)}).then(function(){v(t,n),t[0].click(),m(n)})}).fail(function(){})},w=function(e,t){e.hasClass("cs-loaded")?(m(t),"pixlee"===n&&(l=d(t),u(!1))):(h(e),g(e,t))},b=function(t){setTimeout(function(){e("body").one("touchstart",function(n){e(n.target).is(t)||t.has(n.target).length||t.removeClass("cs-hover")})},100)};p(),y(),c(),"pixlee"===n&&f(),t.on("click",".cs-close-xs",function(){e(".content__item--show .cs-close").first().trigger("click")}).on("click",".cs-close",function(){"pixlee"===n&&u(!0)}).on("click",".linkedin-widget",function(){window.open(e(this).data("linkedin-url"),"_blank")}).on("click",".primary-cta-xs.open",function(t){e(t.target).is('[class*="remove"]')?e(".primary-cta-xs").each(function(){e(this).remove()}):e(t.target).is("a")||e(this).find("a")[0].click()}).on("click touchstart","a.published, a.preview-published",function(n){var i=e(this),o=t.is("#cs-gallery")?i.index()+1:i.parent().index()+1,r=t.find(".content__item:nth-of-type("+o+")");n.preventDefault(),"click"===n.type?w(i,r):i.hasClass("cs-hover")?i[0].click():(i.addClass("cs-hover"),t.find("a.published, a.preview-published").not(i).each(function(){e(this).removeClass("cs-hover")}),i.one("touchend",function(e){e.preventDefault()}),b(i))}).on("click",".share__button--linkedin a",function(t){window.width<768?e(this).popupWindow(t):e(this).popupWindow(t,550,540)}).on("click",".share__button--twitter a",function(t){window.width<768?e(this).popupWindow(t):e(this).popupWindow(t,500,448)}).on("click",".share__button--facebook a",function(t){window.width<768?e(this).popupWindow(t):e(this).popupWindow(t,600,424)})}!function(){Modernizr=function(e,t,n){function i(e){g.cssText=e}function o(e,t){return typeof e===t}function r(e,t){return!!~(""+e).indexOf(t)}function s(e,t){for(var i in e){var o=e[i];if(!r(o,"-")&&g[o]!==n)return"pfx"!=t||o}return!1}function a(e,t,i){for(var r in e){var s=t[e[r]];if(s!==n)return i===!1?e[r]:o(s,"function")?s.bind(i||t):s}return!1}function c(e,t,n){var i=e.charAt(0).toUpperCase()+e.slice(1),r=(e+" "+b.join(i+" ")+i).split(" ");return o(t,"string")||o(t,"undefined")?s(r,t):(r=(e+" "+x.join(i+" ")+i).split(" "),a(r,t,n))}var l,d,u,f="2.6.2",p={},h=!0,m=t.documentElement,v="modernizr",y=t.createElement(v),g=y.style,w=({}.toString,"Webkit Moz O ms"),b=w.split(" "),x=w.toLowerCase().split(" "),E={},S=[],k=S.slice,C={}.hasOwnProperty;u=o(C,"undefined")||o(C.call,"undefined")?function(e,t){return t in e&&o(e.constructor.prototype[t],"undefined")}:function(e,t){return C.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=k.call(arguments,1),i=function(){if(this instanceof i){var o=function(){};o.prototype=t.prototype;var r=new o,s=t.apply(r,n.concat(k.call(arguments)));return Object(s)===s?s:r}return t.apply(e,n.concat(k.call(arguments)))};return i}),E.csstransitions=function(){return c("transition")};for(var T in E)u(E,T)&&(d=T.toLowerCase(),p[d]=E[T](),S.push((p[d]?"":"no-")+d));return p.addTest=function(e,t){if("object"==typeof e)for(var i in e)u(e,i)&&p.addTest(i,e[i]);else{if(e=e.toLowerCase(),p[e]!==n)return p;t="function"==typeof t?t():t,"undefined"!=typeof h&&h&&(m.className+=" "+(t?"":"no-")+e),p[e]=t}return p},i(""),y=l=null,function(e,t){function n(e,t){var n=e.createElement("p"),i=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",i.insertBefore(n.lastChild,i.firstChild)}function i(){var e=y.elements;return"string"==typeof e?e.split(" "):e}function o(e){var t=v[e[h]];return t||(t={},m++,e[h]=m,v[m]=t),t}function r(e,n,i){if(n||(n=t),d)return n.createElement(e);i||(i=o(n));var r;return r=i.cache[e]?i.cache[e].cloneNode():p.test(e)?(i.cache[e]=i.createElem(e)).cloneNode():i.createElem(e),r.canHaveChildren&&!f.test(e)?i.frag.appendChild(r):r}function s(e,n){if(e||(e=t),d)return e.createDocumentFragment();n=n||o(e);for(var r=n.frag.cloneNode(),s=0,a=i(),c=a.length;s<c;s++)r.createElement(a[s]);return r}function a(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return y.shivMethods?r(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+i().join().replace(/\w+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(y,t.frag)}function c(e){e||(e=t);var i=o(e);return y.shivCSS&&!l&&!i.hasCSS&&(i.hasCSS=!!n(e,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),d||a(e,i),e}var l,d,u=e.html5||{},f=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,p=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,h="_html5shiv",m=0,v={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",l="hidden"in e,d=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(e){l=!0,d=!0}}();var y={elements:u.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:u.shivCSS!==!1,supportsUnknownElements:d,shivMethods:u.shivMethods!==!1,type:"default",shivDocument:c,createElement:r,createDocumentFragment:s};e.html5=y,c(t)}(this,t),p._version=f,p._domPrefixes=x,p._cssomPrefixes=b,p.testProp=function(e){return s([e])},p.testAllProps=c,p.prefixed=function(e,t,n){return t?c(e,t,n):c(e,"pfx")},m.className=m.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(h?" js "+S.join(" "):""),p}(this,this.document),function(e,t,n){function i(e){return"[object Function]"==v.call(e)}function o(e){return"string"==typeof e}function r(){}function s(e){return!e||"loaded"==e||"complete"==e||"uninitialized"==e}function a(){var e=y.shift();g=1,e?e.t?h(function(){("c"==e.t?f.injectCss:f.injectJs)(e.s,0,e.a,e.x,e.e,1)},0):(e(),a()):g=0}function c(e,n,i,o,r,c,l){function d(t){if(!p&&s(u.readyState)&&(w.r=p=1,!g&&a(),u.onload=u.onreadystatechange=null,t)){"img"!=e&&h(function(){x.removeChild(u)},50);for(var i in T[n])T[n].hasOwnProperty(i)&&T[n][i].onload()}}var l=l||f.errorTimeout,u=t.createElement(e),p=0,v=0,w={t:i,s:n,e:r,a:c,x:l};1===T[n]&&(v=1,T[n]=[]),"object"==e?u.data=n:(u.src=n,u.type=e),u.width=u.height="0",u.onerror=u.onload=u.onreadystatechange=function(){d.call(this,v)},y.splice(o,0,w),"img"!=e&&(v||2===T[n]?(x.insertBefore(u,b?null:m),h(d,l)):T[n].push(u))}function l(e,t,n,i,r){return g=0,t=t||"j",o(e)?c("c"==t?S:E,e,t,this.i++,n,i,r):(y.splice(this.i++,0,e),1==y.length&&a()),this}function d(){var e=f;return e.loader={load:l,i:0},e}var u,f,p=t.documentElement,h=e.setTimeout,m=t.getElementsByTagName("script")[0],v={}.toString,y=[],g=0,w="MozAppearance"in p.style,b=w&&!!t.createRange().compareNode,x=b?p:m.parentNode,p=e.opera&&"[object Opera]"==v.call(e.opera),p=!!t.attachEvent&&!p,E=w?"object":p?"script":"img",S=p?"script":E,k=Array.isArray||function(e){return"[object Array]"==v.call(e)},C=[],T={},z={timeout:function(e,t){return t.length&&(e.timeout=t[0]),e}};f=function(e){function t(e){var t,n,i,e=e.split("!"),o=C.length,r=e.pop(),s=e.length,r={url:r,origUrl:r,prefixes:e};for(n=0;n<s;n++)i=e[n].split("="),(t=z[i.shift()])&&(r=t(r,i));for(n=0;n<o;n++)r=C[n](r);return r}function s(e,o,r,s,a){var c=t(e),l=c.autoCallback;c.url.split(".").pop().split("?").shift(),c.bypass||(o&&(o=i(o)?o:o[e]||o[s]||o[e.split("/").pop().split("?")[0]]),c.instead?c.instead(e,o,r,s,a):(T[c.url]?c.noexec=!0:T[c.url]=1,r.load(c.url,c.forceCSS||!c.forceJS&&"css"==c.url.split(".").pop().split("?").shift()?"c":n,c.noexec,c.attrs,c.timeout),(i(o)||i(l))&&r.load(function(){d(),o&&o(c.origUrl,a,s),l&&l(c.origUrl,a,s),T[c.url]=2})))}function a(e,t){function n(e,n){if(e){if(o(e))n||(u=function(){var e=[].slice.call(arguments);f.apply(this,e),p()}),s(e,u,t,0,l);else if(Object(e)===e)for(c in a=function(){var t,n=0;for(t in e)e.hasOwnProperty(t)&&n++;return n}(),e)e.hasOwnProperty(c)&&(!n&&!--a&&(i(u)?u=function(){var e=[].slice.call(arguments);f.apply(this,e),p()}:u[c]=function(e){return function(){var t=[].slice.call(arguments);e&&e.apply(this,t),p()}}(f[c])),s(e[c],u,t,c,l))}else!n&&p()}var a,c,l=!!e.test,d=e.load||e.both,u=e.callback||r,f=u,p=e.complete||r;n(l?e.yep:e.nope,!!d),d&&n(d)}var c,l,u=this.yepnope.loader;if(o(e))s(e,0,u,0);else if(k(e))for(c=0;c<e.length;c++)l=e[c],o(l)?s(l,0,u,0):k(l)?f(l):Object(l)===l&&a(l,u);else Object(e)===e&&a(e,u)},f.addPrefix=function(e,t){z[e]=t},f.addFilter=function(e){C.push(e)},f.errorTimeout=1e4,null==t.readyState&&t.addEventListener&&(t.readyState="loading",t.addEventListener("DOMContentLoaded",u=function(){t.removeEventListener("DOMContentLoaded",u,0),t.readyState="complete"},0)),e.yepnope=d(),e.yepnope.executeStack=a,e.yepnope.injectJs=function(e,n,i,o,c,l){var d,u,p=t.createElement("script"),o=o||f.errorTimeout;p.src=e;for(u in i)p.setAttribute(u,i[u]);n=l?a:n||r,p.onreadystatechange=p.onload=function(){!d&&s(p.readyState)&&(d=1,n(),p.onload=p.onreadystatechange=null)},h(function(){d||(d=1,n(1))},o),c?p.onload():m.parentNode.insertBefore(p,m)},e.yepnope.injectCss=function(e,n,i,o,s,c){var l,o=t.createElement("link"),n=c?a:n||r;o.href=e,o.rel="stylesheet",o.type="text/css";for(l in i)o.setAttribute(l,i[l]);s||(m.parentNode.insertBefore(o,m),h(n,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))}}(),function(e){"use strict";function t(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")}function n(e,t){var n=i(e,t)?r:o;n(e,t)}var i,o,r;"classList"in document.documentElement?(i=function(e,t){return e.classList.contains(t)},o=function(e,t){e.classList.add(t)},r=function(e,t){e.classList.remove(t)}):(i=function(e,n){return t(n).test(e.className)},o=function(e,t){i(e,t)||(e.className=e.className+" "+t)},r=function(e,n){e.className=e.className.replace(t(n)," ")});var s={hasClass:i,addClass:o,removeClass:r,toggleClass:n,has:i,add:o,remove:r,toggle:n};"function"==typeof define&&define.amd?define(s):"object"==typeof exports?module.exports=s:e.classie=s}(window),function(e){function t(e){var t;return"x"===e?t=window.innerWidth:"y"===e&&(t=window.innerHeight),t}function n(){return window.pageXOffset||h.scrollLeft}function i(){return window.pageYOffset||h.scrollTop}function o(){r()}function r(){[].slice.call(E).forEach(function(t,n){t.addEventListener("click",function(i){return i.preventDefault(),!(T||k===n||!e(t).hasClass("cs-loaded"))&&(T=!0,k=n,classie.add(t,"grid__item--loading"),void setTimeout(function(){classie.add(t,"grid__item--animate"),setTimeout(function(){s(t)},0)},0))})}),document.addEventListener("keydown",function(e){if(!T&&k!==-1){var t=e.keyCode||e.which;27===t&&(e.preventDefault(),"activeElement"in document&&document.activeElement.blur(),document.activeElement.blur(),document.activeElement.blur(),document.activeElement.blur(),a())}})}function s(n){var o=document.createElement("div");o.className="placeholder",u=e(n).offset().left-L,f=e(n).hasClass("grid__item--carousel")?e(".cs-rh-container").offset().top+parseInt(e(".row-horizon").css("padding-top"))-e(w).offset().top:n.offsetTop,o.style.WebkitTransform="translate3d("+u+"px, "+f+"px, 0px) scale3d("+n.offsetWidth/(b.offsetWidth+L+W+j)+","+n.offsetHeight/t("y")+",1)",o.style.transform="translate3d("+u+"px, "+f+"px, 0px) scale3d("+n.offsetWidth/(b.offsetWidth+L+W+j)+","+n.offsetHeight/t("y")+",1)",classie.add(o,"placeholder--trans-in"),b.appendChild(o),setTimeout(function(){e(".cs-main").css("z-index","100000"),e("body").css("overflow-x","hidden"),o.style.WebkitTransform="translate3d("+-1*L+"px,"+-1*(e(".cs-grid").offset().top-i())+"px, 0px)",o.style.transform="translate3d("+-1*L+"px,"+-1*(e(".cs-grid").offset().top-i())+"px, 0px)",window.addEventListener("scroll",c)},25),g(o,function(){e("#cs-loading-pre-select").remove(),e(".cs-overlay-container").removeClass("pre-selected"),classie.remove(o,"placeholder--trans-in"),classie.add(o,"placeholder--trans-out"),x.style.top=i()-e(".cs-grid").offset().top+"px",classie.add(x,"content--show"),classie.add(S[k],"content__item--show"),classie.addClass(p,"noscroll"),T=!1,e(".content__item--show .cs-close").one("click",a),e(w).find('a.cs-thumbnail:not([style*="display: none"])').each(function(){e(this).removeClass("cs-hover cs-loading cs-still-loading").removeAttr("style")}),e("body").css("overflow-y","hidden"),e("body").css("overflow-x",_),e(".scroll-wrap").css("overflow-y","scroll"),history.replaceState({},null,window.location.pathname+"?cs="+n.href.slice(n.href.lastIndexOf("/")+1,n.href.length))})}function a(){var n=E[k],i=S[k];e(".scroll-wrap").css("overflow-y","hidden"),e("body").css("overflow-y",z),classie.remove(i,"content__item--show"),classie.remove(x,"content--show"),classie.remove(p,"view-single"),setTimeout(function(){var o=b.querySelector(".placeholder");classie.removeClass(p,"noscroll"),o.style.WebkitTransform="translate3d("+u+"px, "+f+"px, 0px) scale3d("+n.offsetWidth/(b.offsetWidth+L+W+j)+","+n.offsetHeight/t("y")+",1)",o.style.transform="translate3d("+u+"px, "+f+"px, 0px) scale3d("+n.offsetWidth/(b.offsetWidth+L+W+j)+","+n.offsetHeight/t("y")+",1)",g(o,function(){i.parentNode.scrollTop=0,b.removeChild(o),classie.remove(n,"grid__item--loading"),classie.remove(n,"grid__item--animate"),C=!1,window.removeEventListener("scroll",c),e(".cs-main").css("z-index","50"),history.replaceState({},null,window.location.pathname),e(".primary-cta-xs").each(function(){e(this).removeClass("open")})}),k=-1},25)}function c(){C||(C=!0,l=n(),d=i()),window.scrollTo(l,d)}var l,d,u,f,p=document.body,h=window.document.documentElement,m={transitions:Modernizr.csstransitions},v={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},y=v[Modernizr.prefixed("transition")],g=function(e,t){var n=function(e){if(m.transitions){if(e.target!=this)return;this.removeEventListener(y,n)}t&&"function"==typeof t&&t.call(this)};m.transitions?e.addEventListener(y,n):n()},w=document.getElementById("cs-gallery")||document.getElementById("cs-carousel"),b=w.querySelector(".cs-grid"),x=w.querySelector(".cs-content"),E=b.querySelectorAll(".grid__item"),S=x.querySelectorAll(".content__item"),k=-1,C=!1,T=!1,z=e("body").css("overflow-y"),_=e("body").css("overflow-x"),j=window.innerWidth-document.body.clientWidth,L=e(w).offset().left,W=e(window).width()-(e(w).offset().left+e(w).outerWidth());e(".cs-content").css("margin-left","-"+L+"px"),o()}(jQuery),function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.ResizeSensor=t()}("undefined"!=typeof window?window:this,function(){function e(e,t){var n=Object.prototype.toString.call(e),i="[object Array]"===n||"[object NodeList]"===n||"[object HTMLCollection]"===n||"[object Object]"===n||"undefined"!=typeof jQuery&&e instanceof jQuery||"undefined"!=typeof Elements&&e instanceof Elements,o=0,r=e.length;if(i)for(;o<r;o++)t(e[o]);else t(e)}function t(e){if(!e.getBoundingClientRect)return{width:e.offsetWidth,height:e.offsetHeight};var t=e.getBoundingClientRect();return{width:Math.round(t.width),height:Math.round(t.height)}}if("undefined"==typeof window)return null;var n=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||function(e){return window.setTimeout(e,20)},i=function(o,r){function s(){var e=[];this.add=function(t){e.push(t)};var t,n;this.call=function(){for(t=0,n=e.length;t<n;t++)e[t].call()},this.remove=function(i){var o=[];for(t=0,n=e.length;t<n;t++)e[t]!==i&&o.push(e[t]);e=o},this.length=function(){return e.length}}function a(e,i){if(e){if(e.resizedAttached)return void e.resizedAttached.add(i);e.resizedAttached=new s,e.resizedAttached.add(i),e.resizeSensor=document.createElement("div"),e.resizeSensor.dir="ltr",e.resizeSensor.className="resize-sensor";var o="position: absolute; left: -10px; top: -10px; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;",r="position: absolute; left: 0; top: 0; transition: 0s;";e.resizeSensor.style.cssText=o,e.resizeSensor.innerHTML='<div class="resize-sensor-expand" style="'+o+'"><div style="'+r+'"></div></div><div class="resize-sensor-shrink" style="'+o+'"><div style="'+r+' width: 200%; height: 200%"></div></div>',e.appendChild(e.resizeSensor);var a=window.getComputedStyle(e).getPropertyValue("position");"absolute"!==a&&"relative"!==a&&"fixed"!==a&&(e.style.position="relative");var c,l,d,u,f=e.resizeSensor.childNodes[0],p=f.childNodes[0],h=e.resizeSensor.childNodes[1],m=t(e),v=m.width,y=m.height,g=function(){var t=0===e.offsetWidth&&0===e.offsetHeight;if(t){var n=e.style.display;e.style.display="block"}p.style.width="100000px",p.style.height="100000px",f.scrollLeft=1e5,f.scrollTop=1e5,h.scrollLeft=1e5,h.scrollTop=1e5,t&&(e.style.display=n)};e.resizeSensor.resetSensor=g;var w=function(){l=0,c&&(v=d,y=u,e.resizedAttached&&e.resizedAttached.call())},b=function(){var i=t(e),o=i.width,r=i.height;c=o!=v||r!=y,c&&!l&&(l=n(w)),g()},x=function(e,t,n){e.attachEvent?e.attachEvent("on"+t,n):e.addEventListener(t,n)};x(f,"scroll",b),x(h,"scroll",b),n(g)}}e(o,function(e){a(e,r)}),this.detach=function(e){i.detach(o,e)},this.reset=function(){o.resizeSensor.resetSensor()}};return i.reset=function(t){e(t,function(e){e.resizeSensor.resetSensor()})},i.detach=function(t,n){e(t,function(e){e&&(e.resizedAttached&&"function"==typeof n&&(e.resizedAttached.remove(n),e.resizedAttached.length())||e.resizeSensor&&(e.contains(e.resizeSensor)&&e.removeChild(e.resizeSensor),delete e.resizeSensor,delete e.resizedAttached))})},i});