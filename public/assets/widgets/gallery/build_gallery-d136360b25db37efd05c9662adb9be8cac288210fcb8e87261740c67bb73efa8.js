function cspBuildGalleryWidget(e,t){var s=function(e){e.addClass("cs-loading"),$("#cs-gallery a").css("pointer-events","none"),setTimeout(function(){e.hasClass("cs-loaded")||e.addClass("cs-still-loading")},1e3)};$.getScript(t+"/assets/widgets/gallery/story_overlays-100f276b1db8be1b93ac5576950b91502573019b99e356db58fc80f72f68ae25.js"),e.on("click","a.published",function(n){n.preventDefault();var i=$(this);return i.hasClass("cs-loaded")?(setTimeout(function(){i.removeClass("cs-loading cs-still-loading")},300),!1):(s(i),void $.ajax({url:i.attr("href"),method:"GET",data:{is_widget:!0},dataType:"jsonp"}).done(function(s){$.when(e.find(".content__item:nth-of-type("+(i.index()+1)+")").html(s.html)).done(function(){i.addClass("cs-loaded"),"function"!=typeof cspInitVideo?$.getScript(t+"/assets/widgets/gallery/story_video-339c3c3dae22f69458ea58aad980596368bdf732cd1f7498448c285a50072afc.js",function(){cspInitVideo(i)}):cspInitVideo(i),e.find("a").removeAttr("style"),e.on("click touchend",".close-button-xs",function(){$(this).closest(".cs-content").find(".close-button").trigger("click")}),i[0].click()})}).fail(function(){}))}).find(".cs-grid").removeClass("hidden")}