function initLinkedIn(){"object"!=typeof IN?$.ajax({url:"https://platform.linkedin.com/in.js",method:"get",dataType:"script",timeout:6e3}).done(function(){}).fail(function(){}):IN.parse()}function widgetsListener(e){var t=!1,n=null,i=null,o=null,s=1e4,r=1e4,a=function(e,t){console.log("1",typeof t),setTimeout(function(){console.log("2",t),window.removeEventListener("message",t,!1)},e)},c=function(){var e=arguments[0];e.find("iframe").width()!==e.find('script[type*="MemberProfile"]').data("width")&&e.remove()},l=function(s){var d;s.origin||s.originalEvent.origin;s.origin.includes("linkedin")&&s.data.includes("-ready")&&null===n?n=parseInt(s.data.match(/\w+_(\d+)-ready/)[1],10):s.origin.includes("linkedin")&&s.data.includes("widgetReady")&&(i=parseInt(s.data.match(/\w+_(\d+)\s/)[1],10),o=i-n,d=e.find(".linkedin-widget").eq(o),d.addClass("cs-loaded"),setTimeout(c,1e3,d),t||(t=!0,a(r,l)),e.find(".linkedin-widget").toArray().every(function(e){return $(e).hasClass("cs-loaded")})&&e.find(".story-contributors").removeClass("hidden"))};a(s,l),window.addEventListener("message",l,!1),$(document).one("click",".cs-content.content--show .close-button",function(){window.removeEventListener("message",l,!1)})}+function(e){"use strict";function t(t,i){return this.each(function(){var o=e(this),s=o.data("bs.modal"),r=e.extend({},n.DEFAULTS,o.data(),"object"==typeof t&&t);s||o.data("bs.modal",s=new n(this,r)),"string"==typeof t?s[t](i):r.show&&s.show(i)})}var n=function(t,n){this.options=n,this.$body=e(document.body),this.$element=e(t),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,e.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};n.VERSION="3.3.6",n.TRANSITION_DURATION=300,n.BACKDROP_TRANSITION_DURATION=150,n.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},n.prototype.toggle=function(e){return this.isShown?this.hide():this.show(e)},n.prototype.show=function(t){var i=this,o=e.Event("show.bs.modal",{relatedTarget:t});this.$element.trigger(o),this.isShown||o.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',e.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){i.$element.one("mouseup.dismiss.bs.modal",function(t){e(t.target).is(i.$element)&&(i.ignoreBackdropClick=!0)})}),this.backdrop(function(){var o=e.support.transition&&i.$element.hasClass("fade");i.$element.parent().length||i.$element.appendTo(i.$body),i.$element.show().scrollTop(0),i.adjustDialog(),o&&i.$element[0].offsetWidth,i.$element.addClass("in"),i.enforceFocus();var s=e.Event("shown.bs.modal",{relatedTarget:t});o?i.$dialog.one("bsTransitionEnd",function(){i.$element.trigger("focus").trigger(s)}).emulateTransitionEnd(n.TRANSITION_DURATION):i.$element.trigger("focus").trigger(s)}))},n.prototype.hide=function(t){t&&t.preventDefault(),t=e.Event("hide.bs.modal"),this.$element.trigger(t),this.isShown&&!t.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),e(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),e.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",e.proxy(this.hideModal,this)).emulateTransitionEnd(n.TRANSITION_DURATION):this.hideModal())},n.prototype.enforceFocus=function(){e(document).off("focusin.bs.modal").on("focusin.bs.modal",e.proxy(function(e){this.$element[0]===e.target||this.$element.has(e.target).length||this.$element.trigger("focus")},this))},n.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",e.proxy(function(e){27==e.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},n.prototype.resize=function(){this.isShown?e(window).on("resize.bs.modal",e.proxy(this.handleUpdate,this)):e(window).off("resize.bs.modal")},n.prototype.hideModal=function(){var e=this;this.$element.hide(),this.backdrop(function(){e.$body.removeClass("modal-open"),e.resetAdjustments(),e.resetScrollbar(),e.$element.trigger("hidden.bs.modal")})},n.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},n.prototype.backdrop=function(t){var i=this,o=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var s=e.support.transition&&o;if(this.$backdrop=e(document.createElement("div")).addClass("modal-backdrop "+o).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",e.proxy(function(e){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(e.target===e.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),s&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!t)return;s?this.$backdrop.one("bsTransitionEnd",t).emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION):t()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var r=function(){i.removeBackdrop(),t&&t()};e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",r).emulateTransitionEnd(n.BACKDROP_TRANSITION_DURATION):r()}else t&&t()},n.prototype.handleUpdate=function(){this.adjustDialog()},n.prototype.adjustDialog=function(){var e=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&e?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!e?this.scrollbarWidth:""})},n.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},n.prototype.checkScrollbar=function(){var e=window.innerWidth;if(!e){var t=document.documentElement.getBoundingClientRect();e=t.right-Math.abs(t.left)}this.bodyIsOverflowing=document.body.clientWidth<e,this.scrollbarWidth=this.measureScrollbar()},n.prototype.setScrollbar=function(){var e=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",e+this.scrollbarWidth)},n.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},n.prototype.measureScrollbar=function(){var e=document.createElement("div");e.className="modal-scrollbar-measure",this.$body.append(e);var t=e.offsetWidth-e.clientWidth;return this.$body[0].removeChild(e),t};var i=e.fn.modal;e.fn.modal=t,e.fn.modal.Constructor=n,e.fn.modal.noConflict=function(){return e.fn.modal=i,this},e(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(n){var i=e(this),o=i.attr("href"),s=e(i.attr("data-target")||o&&o.replace(/.*(?=#[^\s]+$)/,"")),r=s.data("bs.modal")?"toggle":e.extend({remote:!/#/.test(o)&&o},s.data(),i.data());i.is("a")&&n.preventDefault(),s.one("show.bs.modal",function(e){e.isDefaultPrevented()||s.one("hidden.bs.modal",function(){i.is(":visible")&&i.trigger("focus")})}),t.call(s,r,this)})}(jQuery),+function(e){"use strict";function t(){var e=document.createElement("bootstrap"),t={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var n in t)if(void 0!==e.style[n])return{end:t[n]};return!1}e.fn.emulateTransitionEnd=function(t){var n=!1,i=this;e(this).one("bsTransitionEnd",function(){n=!0});var o=function(){n||e(i).trigger(e.support.transition.end)};return setTimeout(o,t),this},e(function(){e.support.transition=t(),e.support.transition&&(e.event.special.bsTransitionEnd={bindType:e.support.transition.end,delegateType:e.support.transition.end,handle:function(t){if(e(t.target).is(this))return t.handleObj.handler.apply(this,arguments)}})})}(jQuery),Modernizr=function(e,t,n){function i(e){y.cssText=e}function o(e,t){return typeof e===t}function s(e,t){return!!~(""+e).indexOf(t)}function r(e,t){for(var i in e){var o=e[i];if(!s(o,"-")&&y[o]!==n)return"pfx"!=t||o}return!1}function a(e,t,i){for(var s in e){var r=t[e[s]];if(r!==n)return i===!1?e[s]:o(r,"function")?r.bind(i||t):r}return!1}function c(e,t,n){var i=e.charAt(0).toUpperCase()+e.slice(1),s=(e+" "+w.join(i+" ")+i).split(" ");return o(t,"string")||o(t,"undefined")?r(s,t):(s=(e+" "+T.join(i+" ")+i).split(" "),a(s,t,n))}var l,d,u,f="2.6.2",h={},p=!0,m=t.documentElement,g="modernizr",v=t.createElement(g),y=v.style,b=({}.toString,"Webkit Moz O ms"),w=b.split(" "),T=b.toLowerCase().split(" "),E={},$=[],k=$.slice,S={}.hasOwnProperty;u=o(S,"undefined")||o(S.call,"undefined")?function(e,t){return t in e&&o(e.constructor.prototype[t],"undefined")}:function(e,t){return S.call(e,t)},Function.prototype.bind||(Function.prototype.bind=function(e){var t=this;if("function"!=typeof t)throw new TypeError;var n=k.call(arguments,1),i=function(){if(this instanceof i){var o=function(){};o.prototype=t.prototype;var s=new o,r=t.apply(s,n.concat(k.call(arguments)));return Object(r)===r?r:s}return t.apply(e,n.concat(k.call(arguments)))};return i}),E.csstransitions=function(){return c("transition")};for(var C in E)u(E,C)&&(d=C.toLowerCase(),h[d]=E[C](),$.push((h[d]?"":"no-")+d));return h.addTest=function(e,t){if("object"==typeof e)for(var i in e)u(e,i)&&h.addTest(i,e[i]);else{if(e=e.toLowerCase(),h[e]!==n)return h;t="function"==typeof t?t():t,"undefined"!=typeof p&&p&&(m.className+=" "+(t?"":"no-")+e),h[e]=t}return h},i(""),v=l=null,function(e,t){function n(e,t){var n=e.createElement("p"),i=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",i.insertBefore(n.lastChild,i.firstChild)}function i(){var e=v.elements;return"string"==typeof e?e.split(" "):e}function o(e){var t=g[e[p]];return t||(t={},m++,e[p]=m,g[m]=t),t}function s(e,n,i){if(n||(n=t),d)return n.createElement(e);i||(i=o(n));var s;return s=i.cache[e]?i.cache[e].cloneNode():h.test(e)?(i.cache[e]=i.createElem(e)).cloneNode():i.createElem(e),s.canHaveChildren&&!f.test(e)?i.frag.appendChild(s):s}function r(e,n){if(e||(e=t),d)return e.createDocumentFragment();n=n||o(e);for(var s=n.frag.cloneNode(),r=0,a=i(),c=a.length;r<c;r++)s.createElement(a[r]);return s}function a(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return v.shivMethods?s(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+i().join().replace(/\w+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(v,t.frag)}function c(e){e||(e=t);var i=o(e);return v.shivCSS&&!l&&!i.hasCSS&&(i.hasCSS=!!n(e,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),d||a(e,i),e}var l,d,u=e.html5||{},f=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,h=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,p="_html5shiv",m=0,g={};!function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",l="hidden"in e,d=1==e.childNodes.length||function(){t.createElement("a");var e=t.createDocumentFragment();return"undefined"==typeof e.cloneNode||"undefined"==typeof e.createDocumentFragment||"undefined"==typeof e.createElement}()}catch(e){l=!0,d=!0}}();var v={elements:u.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:u.shivCSS!==!1,supportsUnknownElements:d,shivMethods:u.shivMethods!==!1,type:"default",shivDocument:c,createElement:s,createDocumentFragment:r};e.html5=v,c(t)}(this,t),h._version=f,h._domPrefixes=T,h._cssomPrefixes=w,h.testProp=function(e){return r([e])},h.testAllProps=c,h.prefixed=function(e,t,n){return t?c(e,t,n):c(e,"pfx")},m.className=m.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(p?" js "+$.join(" "):""),h}(this,this.document),function(e,t,n){function i(e){return"[object Function]"==g.call(e)}function o(e){return"string"==typeof e}function s(){}function r(e){return!e||"loaded"==e||"complete"==e||"uninitialized"==e}function a(){var e=v.shift();y=1,e?e.t?p(function(){("c"==e.t?f.injectCss:f.injectJs)(e.s,0,e.a,e.x,e.e,1)},0):(e(),a()):y=0}function c(e,n,i,o,s,c,l){function d(t){if(!h&&r(u.readyState)&&(b.r=h=1,!y&&a(),u.onload=u.onreadystatechange=null,t)){"img"!=e&&p(function(){T.removeChild(u)},50);for(var i in C[n])C[n].hasOwnProperty(i)&&C[n][i].onload()}}var l=l||f.errorTimeout,u=t.createElement(e),h=0,g=0,b={t:i,s:n,e:s,a:c,x:l};1===C[n]&&(g=1,C[n]=[]),"object"==e?u.data=n:(u.src=n,u.type=e),u.width=u.height="0",u.onerror=u.onload=u.onreadystatechange=function(){d.call(this,g)},v.splice(o,0,b),"img"!=e&&(g||2===C[n]?(T.insertBefore(u,w?null:m),p(d,l)):C[n].push(u))}function l(e,t,n,i,s){return y=0,t=t||"j",o(e)?c("c"==t?$:E,e,t,this.i++,n,i,s):(v.splice(this.i++,0,e),1==v.length&&a()),this}function d(){var e=f;return e.loader={load:l,i:0},e}var u,f,h=t.documentElement,p=e.setTimeout,m=t.getElementsByTagName("script")[0],g={}.toString,v=[],y=0,b="MozAppearance"in h.style,w=b&&!!t.createRange().compareNode,T=w?h:m.parentNode,h=e.opera&&"[object Opera]"==g.call(e.opera),h=!!t.attachEvent&&!h,E=b?"object":h?"script":"img",$=h?"script":E,k=Array.isArray||function(e){return"[object Array]"==g.call(e)},S=[],C={},x={timeout:function(e,t){return t.length&&(e.timeout=t[0]),e}};f=function(e){function t(e){var t,n,i,e=e.split("!"),o=S.length,s=e.pop(),r=e.length,s={url:s,origUrl:s,prefixes:e};for(n=0;n<r;n++)i=e[n].split("="),(t=x[i.shift()])&&(s=t(s,i));for(n=0;n<o;n++)s=S[n](s);return s}function r(e,o,s,r,a){var c=t(e),l=c.autoCallback;c.url.split(".").pop().split("?").shift(),c.bypass||(o&&(o=i(o)?o:o[e]||o[r]||o[e.split("/").pop().split("?")[0]]),c.instead?c.instead(e,o,s,r,a):(C[c.url]?c.noexec=!0:C[c.url]=1,s.load(c.url,c.forceCSS||!c.forceJS&&"css"==c.url.split(".").pop().split("?").shift()?"c":n,c.noexec,c.attrs,c.timeout),(i(o)||i(l))&&s.load(function(){d(),o&&o(c.origUrl,a,r),l&&l(c.origUrl,a,r),C[c.url]=2})))}function a(e,t){function n(e,n){if(e){if(o(e))n||(u=function(){var e=[].slice.call(arguments);f.apply(this,e),h()}),r(e,u,t,0,l);else if(Object(e)===e)for(c in a=function(){var t,n=0;for(t in e)e.hasOwnProperty(t)&&n++;return n}(),e)e.hasOwnProperty(c)&&(!n&&!--a&&(i(u)?u=function(){var e=[].slice.call(arguments);f.apply(this,e),h()}:u[c]=function(e){return function(){var t=[].slice.call(arguments);e&&e.apply(this,t),h()}}(f[c])),r(e[c],u,t,c,l))}else!n&&h()}var a,c,l=!!e.test,d=e.load||e.both,u=e.callback||s,f=u,h=e.complete||s;n(l?e.yep:e.nope,!!d),d&&n(d)}var c,l,u=this.yepnope.loader;if(o(e))r(e,0,u,0);else if(k(e))for(c=0;c<e.length;c++)l=e[c],o(l)?r(l,0,u,0):k(l)?f(l):Object(l)===l&&a(l,u);else Object(e)===e&&a(e,u)},f.addPrefix=function(e,t){x[e]=t},f.addFilter=function(e){S.push(e)},f.errorTimeout=1e4,null==t.readyState&&t.addEventListener&&(t.readyState="loading",t.addEventListener("DOMContentLoaded",u=function(){t.removeEventListener("DOMContentLoaded",u,0),t.readyState="complete"},0)),e.yepnope=d(),e.yepnope.executeStack=a,e.yepnope.injectJs=function(e,n,i,o,c,l){var d,u,h=t.createElement("script"),o=o||f.errorTimeout;h.src=e;for(u in i)h.setAttribute(u,i[u]);n=l?a:n||s,h.onreadystatechange=h.onload=function(){!d&&r(h.readyState)&&(d=1,n(),h.onload=h.onreadystatechange=null)},p(function(){d||(d=1,n(1))},o),c?h.onload():m.parentNode.insertBefore(h,m)},e.yepnope.injectCss=function(e,n,i,o,r,c){var l,o=t.createElement("link"),n=c?a:n||s;o.href=e,o.rel="stylesheet",o.type="text/css";for(l in i)o.setAttribute(l,i[l]);r||(m.parentNode.insertBefore(o,m),p(n,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},function(e){"use strict";function t(e){return new RegExp("(^|\\s+)"+e+"(\\s+|$)")}function n(e,t){var n=i(e,t)?s:o;n(e,t)}var i,o,s;"classList"in document.documentElement?(i=function(e,t){return e.classList.contains(t)},o=function(e,t){e.classList.add(t)},s=function(e,t){e.classList.remove(t)}):(i=function(e,n){return t(n).test(e.className)},o=function(e,t){i(e,t)||(e.className=e.className+" "+t)},s=function(e,n){e.className=e.className.replace(t(n)," ")});var r={hasClass:i,addClass:o,removeClass:s,toggleClass:n,has:i,add:o,remove:s,toggle:n};"function"==typeof define&&define.amd?define(r):"object"==typeof exports?module.exports=r:e.classie=r}(window),function(){function e(e){var t,n;return"x"===e?(t=u.clientWidth,n=window.innerWidth):"y"===e&&(t=u.clientHeight,n=window.innerHeight),t<n?n:t}function t(){return window.pageXOffset||u.scrollLeft}function n(){return window.pageYOffset||u.scrollTop}function i(){o()}function o(){[].slice.call(b).forEach(function(e,t){e.addEventListener("click",function(n){return n.preventDefault(),!(S||E===t||!$(e).hasClass("cs-loaded"))&&(S=!0,E=t,classie.add(e,"grid__item--loading"),void setTimeout(function(){classie.add(e,"grid__item--animate"),setTimeout(function(){s(e)},0)},0))})}),T.addEventListener("click",function(){$("body").css("overflow-y",C),r()}),document.addEventListener("keydown",function(e){if(!S&&E!==-1){var t=e.keyCode||e.which;27===t&&(e.preventDefault(),"activeElement"in document&&document.activeElement.blur(),document.activeElement.blur(),document.activeElement.blur(),document.activeElement.blur(),r())}})}function s(t){var i=document.createElement("div");i.className="placeholder",i.style.WebkitTransform="translate3d("+t.offsetLeft+"px, "+t.offsetTop+"px, 0px) scale3d("+t.offsetWidth/v.offsetWidth+","+t.offsetHeight/e("y")+",1)",i.style.transform="translate3d("+t.offsetLeft+"px, "+t.offsetTop+"px, 0px) scale3d("+t.offsetWidth/v.offsetWidth+","+t.offsetHeight/e("y")+",1)",classie.add(i,"placeholder--trans-in"),v.appendChild(i),classie.add(d,"view-single"),setTimeout(function(){i.style.WebkitTransform="translate3d(-5px, "+(-5-($("section.cs-grid").offset().top-n()))+"px, 0px)",i.style.transform="translate3d(-5px, "+(-5-($("section.cs-grid").offset().top-n()))+"px, 0px)",window.addEventListener("scroll",a)},25),m(i,function(){classie.remove(i,"placeholder--trans-in"),classie.add(i,"placeholder--trans-out"),y.style.top=n()-$("section.cs-grid").offset().top+"px",classie.add(y,"content--show"),classie.add(w[E],"content__item--show"),classie.add(T,"close-button--show"),classie.addClass(d,"noscroll"),S=!1,$("body").css("overflow-y","hidden")})}function r(){var t=b[E],n=w[E];classie.remove(n,"content__item--show"),classie.remove(y,"content--show"),classie.remove(T,"close-button--show"),classie.remove(d,"view-single"),setTimeout(function(){var i=v.querySelector(".placeholder");classie.removeClass(d,"noscroll"),i.style.WebkitTransform="translate3d("+t.offsetLeft+"px, "+t.offsetTop+"px, 0px) scale3d("+t.offsetWidth/v.offsetWidth+","+t.offsetHeight/e("y")+",1)",i.style.transform="translate3d("+t.offsetLeft+"px, "+t.offsetTop+"px, 0px) scale3d("+t.offsetWidth/v.offsetWidth+","+t.offsetHeight/e("y")+",1)",m(i,function(){n.parentNode.scrollTop=0,v.removeChild(i),classie.remove(t,"grid__item--loading"),classie.remove(t,"grid__item--animate"),k=!1,window.removeEventListener("scroll",a)}),E=-1},25)}function a(){k||(k=!0,c=t(),l=n()),window.scrollTo(c,l)}var c,l,d=document.body,u=window.document.documentElement,f={transitions:Modernizr.csstransitions},h={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",msTransition:"MSTransitionEnd",transition:"transitionend"},p=h[Modernizr.prefixed("transition")],m=function(e,t){var n=function(e){if(f.transitions){if(e.target!=this)return;this.removeEventListener(p,n)}t&&"function"==typeof t&&t.call(this)};f.transitions?e.addEventListener(p,n):n()},g=document.getElementById("cs-gallery"),v=g.querySelector("section.cs-grid"),y=g.querySelector("section.cs-content"),b=v.querySelectorAll(".grid__item"),w=y.querySelectorAll(".content__item"),T=y.querySelector(".close-button"),E=-1,k=!1,S=!1,C=$("body").css("overflow-y");i()}();