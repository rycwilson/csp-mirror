function cspInitVideo(o){function e(){if(s.find(".cs-testimonial").hasClass("no-video")||0===r.length||0!==r.find("img").not("#cs-video-placeholder").length)return console.log("loadVIdeoThumbnail() return false"),!1;var o=function(){r.append('<img src="'+d+'">')},e=function(){r.empty().append('<img id="cs-video-placeholder" src="'+h+'" alt="video placeholder">')};"youtube"===u?(d="//img.youtube.com/vi/"+m+"/hqdefault.jpg",$.when(o()).done(function(){var o=s.find(".cs-story-video-xs img, .cs-story-video img"),e=0;o.on("load",function(){++e===o.length&&(120===o[0].naturalWidth?n():$.when(r.find("img").after('<div class="play-button"><i class="fa fa-2x fa-inverse fa-play"></i></div>')).done(i))})})):"vimeo"===u&&$.ajax({url:"//vimeo.com/api/oembed.json?url=https%3A//vimeo.com/"+m,method:"GET",dataType:"json"}).done(function(e){d=e.thumbnail_url_with_play_button,$.when(o()).then(i)}).fail(function(){$("body").hasClass("stories show")?n():(e(),r.css("padding-bottom","0"))})}function n(){$(".cs-story-video-xs").remove(),$.ajax({url:o.attr("href"),method:"GET",data:{remove_video:!0},dataType:"html"}).done(function(){$(".cs-testimonial").empty().append(html)})}function t(){"youtube"===u?c.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*"):"vimeo"===u&&c.postMessage('{"method":"pause"}',"*")}function i(){$("#cs-video-modal").on("show.bs.modal",function(o){o.preventDefault()}).on("hide.bs.modal",t),$(".cs-content").on("click",".close-button",t).on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",function(){}),$(".video-thumb-container").on("click","img, .play-button",function(o){"youtube"===u?a=(f.includes("?")?"&":"?")+"autoplay=1&enablejsapi=1&controls=0&iv_load_policy=3&showinfo=0&rel=0":"vimeo"===u&&(a=(f.includes("?")?"&":"?")+"autoplay=1"),f+=a,$(document).width()<768?(o.stopPropagation(),$(this).parent().replaceWith($("<iframe src='"+f+"'frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"))):l.one("load",function(){$(this).closest(".video-thumb-container").children(":not(iframe)").remove(),$(this).removeClass("hidden")}).attr("src",f)})}var a,d,s=$(".content__item:nth-of-type("+(o.index()+1)+")"),l=s.find("iframe"),c=l[0].contentWindow,r=s.find(".video-thumb-container"),u=r.data("provider"),m=r.data("video-id"),f=r.data("video-url"),h="/assets/video_placeholder-865dd38072045fea311aab1e5d19e29bd4db0bc02f79c5a066121c8f0ac3ba90.jpg";e()}