function cspInitVideo(o,e){function n(){if(e.find(".cs-testimonial").hasClass("no-video")||0===c.length||0!==c.find("img").not("#cs-video-placeholder").length)return!1;var n=function(){c.append('<img src="'+s+'">')},t=function(){c.empty().append('<img id="cs-video-placeholder" src="'+m+'" alt="video placeholder">')};"youtube"===l?(s="https://img.youtube.com/vi/"+r+"/hqdefault.jpg",o.when(n()).done(function(){var n=e.find(".cs-story-video-xs img, .cs-story-video img"),t=0;n.on("load",function(){++t===n.length&&(120===n[0].naturalWidth?i():o.when(c.find("img").after('<div class="play-button"><i class="fa fa-2x fa-inverse fa-play"></i></div>')).done(a))})})):"vimeo"===l&&o.ajax({url:"https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/"+r,method:"GET",dataType:"json"}).done(function(e){s=e.thumbnail_url_with_play_button,o.when(n()).then(a)}).fail(function(){o("body").hasClass("stories show")?i():(t(),c.css("padding-bottom","0"))})}function i(){o(".cs-story-video-xs").remove(),o.ajax({url:$storyCard.attr("href"),method:"GET",data:{remove_video:!0},dataType:"html"}).done(function(){o(".cs-testimonial").empty().append(html)})}function t(){"youtube"===l?v.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*"):"vimeo"===l&&v.postMessage('{"method":"pause"}',"*")}function a(){o("#cs-video-modal").on("show.bs.modal",function(o){o.preventDefault()}).on("hide.bs.modal",t),o(".cs-content").on("click",".cs-close",t).on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){}),o(".video-thumb-container").on("click","img, .play-button",function(){"youtube"===l?d=(u.includes("?")?"&":"?")+"autoplay=1&enablejsapi=1&controls=0&iv_load_policy=3&showinfo=0&rel=0":"vimeo"===l&&(d=(u.includes("?")?"&":"?")+"autoplay=1"),u+=d,f.one("load",function(){o(this).closest(".video-thumb-container").children(":not(iframe)").remove(),o(this).removeClass("hidden")}).attr("src",u)})}var d,s,c=e.find(".video-thumb-container"),l=c.data("provider"),r=c.data("video-id"),u=c.data("video-url"),m="/assets/video_placeholder-865dd38072045fea311aab1e5d19e29bd4db0bc02f79c5a066121c8f0ac3ba90.jpg";if(["youtube","vimeo"].includes(l))var f=o(window).width()<768?e.find(".cs-story-video-xs iframe"):e.find(".cs-story-video iframe"),v=f[0].contentWindow;n()}