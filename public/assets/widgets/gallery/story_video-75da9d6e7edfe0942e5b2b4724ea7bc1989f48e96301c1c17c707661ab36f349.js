!function(){function e(){if($(".testimonial, .cs-testimonial").hasClass("no-video")||0===s.length)return!1;var e=function(){"xs"===CSP.screenSize&&$.when($(".cs-video-xs").remove()).then()},n=function(){s.append('<div><img class="video-thumb" src="'+i+'"></div>')},t=function(){s.empty().append('<img id="video-placeholder" src="'+u+'" alt="video placeholder">')};"youtube"===d?(i="//img.youtube.com/vi/"+c+"/hqdefault.jpg",$.when(n()).then(function(){console.log($(thumbContainers.find("img"))),s.imagesLoaded().done(function(){120===s.find("img")[0].naturalWidth?$("body").hasClass("stories show")?e():t():$.when(s.find("img").after('<div class="play-button"><i class="fa fa-2x fa-inverse fa-play"></i></div>')).then(function(){o()})})})):"vimeo"===d&&$.ajax({url:"//vimeo.com/api/oembed.json?url=https%3A//vimeo.com/"+c,method:"get",dataType:"json"}).done(function(e){i=e.thumbnail_url_with_play_button,$.when(n()).then(o)}).fail(function(){$("body").hasClass("stories show")?e():(t(),s.css("padding-bottom","0"))})}function o(){$(document).on("click",".cs-content .close-button",function(){}).on("click",".video-thumb-container img, .video-thumb-container .play-button",function(e){var o=function(){"youtube"===d?a.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*"):"vimeo"===d&&a.postMessage('{"method":"pause"}',"*")};"youtube"===d?n=(l.includes("?")?"&":"?")+"autoplay=1&enablejsapi=1&controls=0&iv_load_policy=3&showinfo=0&rel=0":"vimeo"===d&&(n=(l.includes("?")?"&":"?")+""),$(document).width()<768?(e.stopPropagation(),$(this).parent().replaceWith($("<iframe src='"+l+n+"'frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"))):(console.log("loading",l+n),window.addEventListener("message",function(e){console.log(e)},!1),t.find("iframe").attr("src",l+n),t.find("button.close").on("click",o).end().one("hide.bs.modal",o))})}var n,i,t=$("#video-modal, #cs-video-modal"),a=t.find("iframe")[0].contentWindow,s=$(".video-thumb-container"),d=s.data("provider"),c=s.data("video-id"),l=s.data("video-url"),u="/assets/video_placeholder-865dd38072045fea311aab1e5d19e29bd4db0bc02f79c5a066121c8f0ac3ba90.jpg";console.log(d,c,l),e()}();