var VIDEO_LIB={loadThumbnail:function(){var o=$(".video-thumb-container"),e=o.data("provider"),i=o.data("video-id"),a=o.data("video-url"),n="",t="";"youtube"===e?(n="/?autoplay=1&enablejsapi=1&controls=0&iv_load_policy=3&showinfo=0&rel=0",t="//i1.ytimg.com/vi/"+i+"/0.jpg",o.append("<div><img class='video-thumb' src='"+t+"'><i class='fa fa-5x fa-inverse fa-play-circle-o'></i></div>")):"vimeo"===e&&(n="/?autoplay=1",$.getJSON("//vimeo.com/api/oembed.json?url=https%3A//vimeo.com/"+i+".json",function(e,i){t=e.thumbnail_url_with_play_button,o.append("<div><img class='video-thumb' src='"+t+"'></div>")})),o.on("click","img, i",function(o){var i=$("#story-video-modal"),t=i.find("iframe")[0].contentWindow,l=function(){"youtube"===e?t.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*"):"vimeo"===e&&t.postMessage('{"method":"pause"}',"*")};$(document).width()<600?(o.stopPropagation(),$(this).parent().replaceWith($("<iframe src='"+a+n+"'frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"))):(t.location.replace(a+n),i.find("button.close").on("click",function(){l()}),i.one("hide.bs.modal",function(){l()}),i.one("hidden.bs.modal",function(){t.location.replace("")}))})}};