function cspBuildGallery(e,t){var s,i=function(e){e.addClass("cs-loading"),$("#cs-gallery a").css("pointer-events","none"),setTimeout(function(){e.hasClass("cs-loaded")||e.addClass("cs-still-loading")},1e3)},n=function(e){"function"!=typeof cspInitVideo?$.getScript(t+"/assets/widgets/gallery/story_video-43fe8aa3f7b935f07cb5d310d22a14ae7ef200da6e5331a9204175fe4b17ef60.js",function(){cspInitVideo(e)}):cspInitVideo(e)};$.getScript(t+"/assets/widgets/gallery/story_overlays-03247d7126b8b0b9721c8713fc132805dac776cdb21ee8d9ebed129f6ce7e764.js"),e.on("click","a.published, a.preview-published",function(t){t.preventDefault();var d=$(this);return d.hasClass("cs-loaded")?(setTimeout(function(){d.removeClass("cs-loading cs-still-loading")},300),!1):(i(d),void $.ajax({url:d.attr("href"),method:"GET",data:{is_widget:!0,window_width:$(window).width()},dataType:"jsonp"}).done(function(t){s=e.find(".content__item:nth-of-type("+(d.index()+1)+")"),$.when(s.html(t.html),d.addClass("cs-loaded")).then(function(){widgetsListener(s)}).then(function(){d.hasClass("has-video")&&n(s),initLinkedIn(),e.find("a").removeAttr("style"),e.on("click touchend",".close-button-xs",function(){$(this).closest(".cs-content").find(".close-button").trigger("click")}),d[0].click()})}).fail(function(){}))}).find(".cs-grid").removeClass("hidden")}