/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */

(function() {
  var bodyEl = document.body,
    docElem = window.document.documentElement,
    support = { transitions: Modernizr.csstransitions },
    // transition end event name
    transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    onEndTransition = function( el, callback ) {
      var onEndCallbackFn = function( ev ) {
        if( support.transitions ) {
          if( ev.target != this ) return;
          this.removeEventListener( transEndEventName, onEndCallbackFn );
        }
        if( callback && typeof callback === 'function' ) { callback.call(this); }
      };
      if( support.transitions ) {
        el.addEventListener( transEndEventName, onEndCallbackFn );
      }
      else {
        onEndCallbackFn();
      }
    },
    gridEl = document.getElementById('cs-gallery') || document.getElementById('cs-carousel');
    console.log(gridEl)
    var gridItemsContainer = gridEl.querySelector('.cs-grid');
    console.log(gridItemsContainer)
    var contentItemsContainer = gridEl.querySelector('.cs-content');
    console.log(contentItemsContainer)
    var gridItems = gridItemsContainer.querySelectorAll('.grid__item'),
    contentItems = contentItemsContainer.querySelectorAll('.content__item'),
    closeCtrl = contentItemsContainer.querySelector('.close-button'),
    current = -1,
    lockScroll = false, xscroll, yscroll,
    isAnimating = false,
    // csp...
    bodyScrollSetting = $('body').css('overflow-y');

  /**
   * gets the viewport width and height
   * based on http://responsejs.com/labs/dimensions/
   */
  function getViewport( axis ) {
    var client, inner;
    if( axis === 'x' ) {
      client = docElem['clientWidth'];
      inner = window['innerWidth'];
    }
    else if( axis === 'y' ) {
      client = docElem['clientHeight'];
      inner = window['innerHeight'];
    }

    return client < inner ? inner : client;
  }
  function scrollX() { return window.pageXOffset || docElem.scrollLeft; }
  function scrollY() { return window.pageYOffset || docElem.scrollTop; }

  function init() {
    initEvents();
  }

  function initEvents() {
    [].slice.call(gridItems).forEach(function(item, pos) {
      item.addEventListener('click', function(ev) {
        ev.preventDefault();
        // csp modify... (last expression)
        if(isAnimating || current === pos || !$(item).hasClass('cs-loaded')) {
          return false;
        }
        isAnimating = true;
        // index of current item
        current = pos;
        // simulate loading time..
        classie.add(item, 'grid__item--loading');
        setTimeout(function() {
          classie.add(item, 'grid__item--animate');
          // reveal/load content after the last element animates out (todo: wait for the last transition to finish)
          setTimeout(function() { loadContent(item); }, 0);
        }, 0);

      });
    });

    closeCtrl.addEventListener('click', function() {
      // csp modify: return setting to whatever it was before overlay was opened
      $('body').css('overflow-y', bodyScrollSetting);
      hideContent();
    });

    // keyboard esc - hide content
    document.addEventListener('keydown', function(ev) {
      if(!isAnimating && current !== -1) {
        var keyCode = ev.keyCode || ev.which;
        if( keyCode === 27 ) {
          ev.preventDefault();
          if ("activeElement" in document)
              document.activeElement.blur();
              document.activeElement.blur();
              document.activeElement.blur();
              document.activeElement.blur();
          hideContent();
        }
      }
    } );
  }

  /**
   * some csp modifications to ensure overlay opens correctly in a container that can be at any y-position on the page
   */
  function loadContent(item) {
    // add expanding element/placeholder
    var dummy = document.createElement('div');
    dummy.className = 'placeholder';
    // set the width/heigth and position
    dummy.style.WebkitTransform = 'translate3d(' + item.offsetLeft + 'px, ' + item.offsetTop + 'px, 0px) scale3d(' + item.offsetWidth/gridItemsContainer.offsetWidth + ',' + (item.offsetHeight)/getViewport('y') + ',1)';
    dummy.style.transform = 'translate3d(' + item.offsetLeft + 'px, ' + item.offsetTop + 'px, 0px) scale3d(' + item.offsetWidth/gridItemsContainer.offsetWidth + ',' + (item.offsetHeight)/getViewport('y') + ',1)';

    // add transition class
    classie.add(dummy, 'placeholder--trans-in');

    // insert it after all the grid items
    gridItemsContainer.appendChild(dummy);

    // body overlay
    classie.add(bodyEl, 'view-single');
    setTimeout(function() {

      // expands the placeholder
      // csp removed...
      // dummy.style.WebkitTransform = 'translate3d(-5px, ' + (scrollY() - 5) + 'px, 0px)';
      // dummy.style.transform = 'translate3d(-5px, ' + (scrollY() - 5) + 'px, 0px)';
      // csp modified...
      dummy.style.WebkitTransform = 'translate3d(-5px, ' + (- 5 - ($('section.cs-grid').offset().top - scrollY())) + 'px, 0px)';
      dummy.style.transform = 'translate3d(-5px, ' + (- 5 - ($('section.cs-grid').offset().top - scrollY())) + 'px, 0px)';
      // disallow scroll
      window.addEventListener('scroll', noscroll);
    }, 25);

    onEndTransition(dummy, function() {
      // add transition class
      classie.remove(dummy, 'placeholder--trans-in');
      classie.add(dummy, 'placeholder--trans-out');

      // position the content container
      // csp removed...
      // contentItemsContainer.style.top = scrollY() + 'px';
      // csp modified...
      contentItemsContainer.style.top = (scrollY() - $('section.cs-grid').offset().top) + 'px';

      /**
       * csp modification:
       * with transition complete, and content about to be made visible (.content--show),
       * add mix-blend-mode setting to image (does not play well with translate3d)
       *
       * => doesn't work
       */

      // show the main content container
      classie.add(contentItemsContainer, 'content--show');
      // show content item:
      classie.add(contentItems[current], 'content__item--show');
      // show close control
      classie.add(closeCtrl, 'close-button--show');
      // sets overflow hidden to the body and allows the switch to the content scroll
      classie.addClass(bodyEl, 'noscroll');

      isAnimating = false;

      // csp modify... (the overlay will have its own scroll bar)...
      $('body').css('overflow-y', 'hidden');

    });
  }

  function hideContent() {
    var gridItem = gridItems[current], contentItem = contentItems[current];

    classie.remove(contentItem, 'content__item--show');
    classie.remove(contentItemsContainer, 'content--show');
    classie.remove(closeCtrl, 'close-button--show');
    classie.remove(bodyEl, 'view-single');

    setTimeout(function() {
      var dummy = gridItemsContainer.querySelector('.placeholder');
      classie.removeClass(bodyEl, 'noscroll');
      dummy.style.WebkitTransform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth/gridItemsContainer.offsetWidth + ',' + gridItem.offsetHeight/getViewport('y') + ',1)';
      dummy.style.transform = 'translate3d(' + gridItem.offsetLeft + 'px, ' + gridItem.offsetTop + 'px, 0px) scale3d(' + gridItem.offsetWidth/gridItemsContainer.offsetWidth + ',' + gridItem.offsetHeight/getViewport('y') + ',1)';
      onEndTransition(dummy, function() {
        // reset content scroll..
        contentItem.parentNode.scrollTop = 0;
        gridItemsContainer.removeChild(dummy);
        classie.remove(gridItem, 'grid__item--loading');
        classie.remove(gridItem, 'grid__item--animate');
        lockScroll = false;
        window.removeEventListener( 'scroll', noscroll );

      });

      // reset current
      current = -1;
    }, 25);
  }

  function noscroll() {
    if(!lockScroll) {
      lockScroll = true;
      xscroll = scrollX();
      yscroll = scrollY();
    }
    window.scrollTo(xscroll, yscroll);
  }

  init();

})();