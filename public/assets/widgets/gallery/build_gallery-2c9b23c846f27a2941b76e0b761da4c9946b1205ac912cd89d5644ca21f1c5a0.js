function cspBuildGalleryWidget(e,s){var t=function(e){e.addClass("cs-loading"),$("#cs-gallery a").css("pointer-events","none"),setTimeout(function(){e.hasClass("cs-loaded")||e.addClass("cs-still-loading")},1e3)};$.getScript(s+"/assets/widgets/gallery/story_overlays-b2a53ed19677321f36e6905afca8650f6d6411643563edc17c39941b6edd2d17.js"),e.on("click","a.published",function(a){a.preventDefault();var d=$(this);return d.hasClass("cs-loaded")?(setTimeout(function(){d.removeClass("cs-loading cs-still-loading")},300),!1):(t(d),void $.ajax({url:d.attr("href"),method:"GET",data:{is_widget:!0},dataType:"jsonp"}).done(function(t){$.when(e.find(".content__item:nth-of-type("+(d.index()+1)+")").html(t.html)).done(function(){d.addClass("cs-loaded"),"function"!=typeof cspInitVideo?$.getScript(s+"/assets/widgets/gallery/story_video-339c3c3dae22f69458ea58aad980596368bdf732cd1f7498448c285a50072afc.js",function(){cspInitVideo(d)}):cspInitVideo(d),e.find("a").removeAttr("style"),d[0].click()})}).fail(function(){}))}).find(".cs-grid").removeClass("hidden")}