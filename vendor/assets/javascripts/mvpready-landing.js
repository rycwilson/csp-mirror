/* ========================================================
*
* MVP Ready - Lightweight & Responsive Admin Template
*
* ========================================================
*
* File: mvpready-landing.js
* Theme Version: 2.1.0
* Bootstrap Version: 3.3.5
* Author: Jumpstart Themes
* Website: http://mvpready.com
*
* ======================================================== */

var mvpready_landing = function () {

  "use strict"

  var currItem = null

  var initMastheadCarousel = function () {
    if (!$.fn.carousel) { return false }

      currItem = $('.masthead-carousel .item.active')

    $('.masthead-carousel')
      .carousel ({ interval: false })
      .on('slide.bs.carousel', function (e) {
        var next = $(e.relatedTarget)
            , nextH = next.height()
            , active = $(this).find ('.active.item')

        if (currItem.height () > nextH) {
          next.height (active.height ())
        }

        active.parent().animate({ height: nextH }, 500, function () {
          next.height (nextH)
          currItem = $(e.relatedTarget)
        })
    })

    $(window).resize (function () {
      var item = $('.active.item')
          , curH = item.height ()

      item.parent ().height (curH)
    })

  }

  return {
    init: function () {
      mvpready_core.navHoverInit ({ delay: { show: 250, hide: 350 } })

      initMastheadCarousel ()

      mvpready_helpers.initAccordions ()
      mvpready_helpers.initTooltips ()
      mvpready_core.initBackToTop ()
      mvpready_helpers.initLightbox ()

    }
  }

} ()

$(function () {
  mvpready_landing.init ()
})