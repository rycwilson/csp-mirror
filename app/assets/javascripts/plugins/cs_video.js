
function cspInitVideo ($, $storyOverlay, $storyCard) {
  // console.log('cspInitVideo')

  // two containers: regular and xs
  var $thumbContainers = $storyOverlay.find('.video-thumb-container'),
      provider = $thumbContainers.data('provider'),
      videoId = $thumbContainers.data('video-id'),
      videoUrl = $thumbContainers.data('video-url'),
      videoQueryString,
      thumbSrc;

  if (['youtube', 'vimeo'].includes(provider)) {
    // var $iframe = $('#cs-video-modal iframe'),
    var $iframe = $(window).width() < 768 ? $storyOverlay.find('.cs-story-video-xs iframe') : $storyOverlay.find('.cs-story-video iframe'),
        videoPlayerWindow = $iframe[0].contentWindow;

  }

  loadVideoThumbnail();

  // this doesn't work...
  // videoPlayerWindow.document.body.style.cursor = "pointer";

  function loadVideoThumbnail () {
    // no video, or wistia video
    if ($storyOverlay.find('.cs-testimonial').hasClass('no-video') ||
        $thumbContainers.length === 0 ||
        $thumbContainers.find('img').not('#cs-video-placeholder').length !== 0) {
      return false;
    }

    var appendThumbnail = function () {
          $thumbContainers.append(
            '<img src="' + thumbSrc + '">'
          );
        },
        loadPlaceholder = function () {
          $thumbContainers.empty().append(
            '<img id="cs-video-placeholder" src="' + VIDEO_PLACEHOLDER_URL + '" alt="video placeholder">'
          );
        };

    if (provider === 'youtube') {
      // ref: http://stackoverflow.com/questions/2068344
      thumbSrc = 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg';
      $.when(appendThumbnail())
        .done(function () {
          var $images = $storyOverlay.find('.cs-story-video-xs img, .cs-story-video img'),
              loadedImages = 0;
          $images.on('load', function () {
            if (++loadedImages === $images.length) {
              // original width of 120 indicates youtube thumbnail not available
              if ($images[0].naturalWidth === 120) {
                removeVideo($storyCard);
              } else {
                $.when(
                  $thumbContainers.find('img').after(
                    '<div class="play-button">' +
                      '<i class="fa fa-2x fa-inverse fa-play"></i>' +
                    '</div>'
                  )
                ).done(videoListeners);
              }
            }
          });
        });

    } else if (provider === 'vimeo') {
      $.ajax({
        url: 'https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/' + videoId,
        method: 'GET',
        dataType: 'json',
      })
        .done(function (data, status, xhr) {
          thumbSrc = data.thumbnail_url_with_play_button;
          $.when(appendThumbnail())
            .then(videoListeners);
        })
        .fail(function (data, status) {
          if ($('body').hasClass('stories show')) {
            removeVideo();
          } else {
            loadPlaceholder();
            // strange but necessary css setting adds a huge bottom padding, see video.scss
            // needs to be removed for the placeholder
            $thumbContainers.css('padding-bottom', '0');
          }
        });
    }
  }

  function removeVideo () {
    $('.cs-story-video-xs').remove();

    // TODO: some issues here
    // $.ajax({
    //   url: $storyCard.attr('href'),
    //   method: 'GET',
    //   data: { 
    //     remove_video: true, 
    //     is_plugin: true 
    //   },
    //   dataType: 'html'
    // })
    //   .done(function (html) {
    //     $('.cs-testimonial').empty().append(html);
    //   });
  }

  function pauseVideo () {
    if (provider === 'youtube') {
      videoPlayerWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}', '*'
      );
    } else if (provider === 'vimeo') {
      videoPlayerWindow.postMessage(
        '{"method":"pause"}', '*'
      );
    }
  }

  function videoListeners () {

    // listen for iframe post messages
    // window.addEventListener("message", function (mesg) { console.log(mesg); }, false);

    $('#cs-video-modal')
      .on('show.bs.modal', function (e) { e.preventDefault(); })  // disable modal video
      .on('hide.bs.modal', pauseVideo);

    // empty the modal iframe when any story is closed
    $('.cs-content')
      .on('click', '.cs-close', pauseVideo)
      .on(
        'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
        function () {
          // console.log('transition');
          // if ($('.content__item--show').length === 0) {
          //   $iframe.attr('src', '');
          // }
        }
      );

    $('.video-thumb-container').on('click', 'img, .play-button', function (e) {

      if (provider === 'youtube') {
        videoQueryString = (videoUrl.includes('?') ? '&' : '?') + 'autoplay=1&enablejsapi=1&controls=0&iv_load_policy=3&showinfo=0&rel=0';
      } else if (provider === 'vimeo') {
        videoQueryString = (videoUrl.includes('?') ? '&' : '?') + 'autoplay=1';
      }
      videoUrl = videoUrl + videoQueryString;

      // if ($(document).width() < 768) {
      //   $(this).parent().replaceWith($('<iframe src="' + videoUrl + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'));

      // } else {
        // console.log('loading', videoUrl)
        $iframe
          .one('load', function () {
              $(this).closest('.video-thumb-container')
                     .children(':not(iframe)').remove();  // remove thumbnail image and play button
              $(this).removeClass('hidden');
            })
          .attr('src', videoUrl);

        // this will cause browser to hang
        // videoPlayerWindow.location.replace(videoUrl + videoQueryString);
        //

        // if ($iframe.attr('src') !== videoUrl + videoQueryString) {
        //   $iframe.attr('src', videoUrl + videoQueryString);
        // }

      // }
    });
  }

}

