$(function(){$(".grid").masonry({itemSelector:".grid-item",columnWidth:160,gutter:30,isInitLayout:!1}),$(".grid").imagesLoaded(function(){$(".grid").masonry()}),$(".grid").masonry("on","layoutComplete",function(){$(".grid").css("visibility","visible")});var i=0;setInterval(function(){$(".slide-up-down").animate({top:i%2===0?"-=50":"+=50"},600),i++},4e3),$("#image-horizontal-sm .slide-up-down #text2").textfill({minFontPixels:10,maxFontPixels:16}),$("#text-horizontal-sm .short-headline").textfill({minFontPixels:12,maxFontPixels:22}),$("#text-horizontal-sm .long-headline").textfill({minFontPixels:13,maxFontPixels:18}),$("#text-vertical .short-headline").textfill({minFontPixels:25,maxFontPixels:32}),$("#text-vertical .long-headline").textfill({minFontPixels:20,maxFontPixels:25}),$("#image-logo .long-headline").textfill({minFontPixels:10,maxFontPiexls:16}),$("#image-no-logo .long-headline").textfill({minFontPixels:10,maxFontPiexls:16,complete:function(){var i=$("#image-no-logo #url"),t=$("#image-no-logo .long-headline span");parseInt(t.css("font-size"),10)<=14?i.css("font-size",t.css("font-size")):i.css("font-size","14px"),"10px"===i.css("font-size")?i.css("top","231px"):"12px"===i.css("font-size")?i.css("top","228px"):"14px"===i.css("font-size")&&i.css("top","226px")}}),$("#text-square .long-headline").textfill({minFontPixels:20,maxFontPixels:26}),$("#image-vertical .long-headline").textfill({minFontPixels:14,maxFontPixels:18})});