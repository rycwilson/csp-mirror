!function(e){e.fn.textfill=function(i){function t(){o.debug&&"undefined"!=typeof console&&"undefined"!=typeof console.debug&&console.debug.apply(console,arguments)}function n(){"undefined"!=typeof console&&"undefined"!=typeof console.warn&&console.warn.apply(console,arguments)}function l(e,i,n,l,s,h){function o(e,i){var t=" / ";return e>i?t=" > ":e==i&&(t=" = "),t}t("[TextFill] "+e+" { font-size: "+i.css("font-size")+",Height: "+i.height()+"px "+o(i.height(),n)+n+"px,Width: "+i.width()+o(i.width(),l)+l+",minFontPixels: "+s+"px, maxFontPixels: "+h+"px }")}function s(e,i,t,n,s,h,o,c){for(l(e,i,s,h,o,c);o<c-1;){var a=Math.floor((o+c)/2);if(i.css("font-size",a),t.call(i)<=n){if(o=a,t.call(i)==n)break}else c=a;l(e,i,s,h,o,c)}return i.css("font-size",c),t.call(i)<=n&&(o=c,l(e+"* ",i,s,h,o,c)),o}var h={debug:!1,maxFontPixels:40,minFontPixels:4,innerTag:"span",widthOnly:!1,success:null,callback:null,fail:null,complete:null,explicitWidth:null,explicitHeight:null,changeLineHeight:!1},o=e.extend(h,i);return t("[TextFill] Start Debug"),this.each(function(){var i=e(o.innerTag+":visible:first",this),l=o.explicitHeight||e(this).height(),h=o.explicitWidth||e(this).width(),c=i.css("font-size"),a=parseFloat(i.css("line-height"))/parseFloat(c);t("[TextFill] Inner text: "+i.text()),t("[TextFill] All options: ",o),t("[TextFill] Maximum sizes: { Height: "+l+"px, Width: "+h+"px }");var f=o.minFontPixels,d=o.maxFontPixels<=0?l:o.maxFontPixels,u=void 0;o.widthOnly||(u=s("Height",i,e.fn.height,l,l,h,f,d));var x=void 0;if(x=s("Width",i,e.fn.width,h,l,h,f,d),o.widthOnly)i.css({"font-size":x,"white-space":"nowrap"}),o.changeLineHeight&&i.parent().css("line-height",a*x+"px");else{var r=Math.min(u,x);i.css("font-size",r),o.changeLineHeight&&i.parent().css("line-height",a*r+"px")}t("[TextFill] Finished { Old font-size: "+c+", New font-size: "+i.css("font-size")+" }"),i.width()>h||i.height()>l&&!o.widthOnly?(i.css("font-size",c),o.fail&&o.fail(this),t("[TextFill] Failure { Current Width: "+i.width()+", Maximum Width: "+h+", Current Height: "+i.height()+", Maximum Height: "+l+" }")):o.success?o.success(this):o.callback&&(n("callback is deprecated, use success, instead"),o.callback(this))}),o.complete&&o.complete(this),t("[TextFill] End Debug"),this}}(window.jQuery);