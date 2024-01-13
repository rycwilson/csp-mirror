//= require js-cookie/dist/js.cookie
//= require imagesloaded/imagesloaded.pkgd
//= require tom-select/dist/js/tom-select.base
//= require tom-select/dist/js/plugins/clear_button

// story page modals (video, web form)
// TODO replace with native js
//= require jquery3
//= require bootstrap/modal

;(function CSP() {
  'use strict';

  // DOM elements
  let featuredStories, relatedStories, searchAndFilters, searchForms, filters, matchTypeInputs, searchResults, filterResults;

  
  // stories gallery
  if (location.pathname === '/') {
    featuredStories = document.querySelectorAll('.story-card');
    // console.log('featuredStories', featuredStories)
    searchAndFilters = document.querySelectorAll('.search-and-filters');
    searchForms = document.querySelectorAll('.search-stories');
    filters = document.querySelectorAll('.stories-filter__select:not(.ts-wrapper)');
    searchResults = document.querySelectorAll('.search-stories__results');
    filterResults = document.querySelectorAll('.filter-results > span:last-child');
    matchTypeInputs = document.querySelectorAll('[name="match-type"]');

    // the has-combined-results class is only present when > 1 filters are applied
    const searchParams = new URLSearchParams(location.search);
    const hasFilterResults = searchParams.has('category') || searchParams.has('product');
    const hasSearchResults = [...searchAndFilters].some(container => container.classList.contains('has-search-results'));
    const results = (hasSearchResults || hasFilterResults) ?
      [...featuredStories].filter(card => !card.parentElement.classList.contains('hidden')).length :
      undefined;
    const renderResults = (el) => el.textContent = `${results} ${results === 1 ? 'story' : 'stories'}`; 
    if (hasSearchResults) searchResults.forEach(renderResults);
    if (hasFilterResults) filterResults.forEach(renderResults);

    imagesLoaded('#stories-gallery', (e) => e.elements[0].classList.remove('hidden'));
    initFilters();
    initSearchForms();
    initStoryCards(featuredStories);

  // story
  } else {
    const socialShareRedirectURI = (new URL(location)).searchParams.get('redirect_uri');
    if (socialShareRedirectURI) location = socialShareRedirectURI;

    relatedStories = document.querySelectorAll('.story-card');
    imagesLoaded('.story-wrapper', (e) => {
      e.elements[0].classList.remove('hidden')
      initFixedCta();
    });
    initStoryCards(relatedStories)
    initMobileCta();
    initMoreStories();
    initVideo();
    // initFixedCta();
    initShareButtons();
    
    const editStoryLink = document.querySelector('.stories-header__edit');
    if (editStoryLink) editStoryLink.addEventListener('click', () => Cookies.set('csp-edit-story-tab', '#story-content'));
  }

  // function hasCombinedResults() {
  //   const searchParams = new URLSearchParams(location.search);
  //   const tagTypes = ['category', 'product'];
  //   let tagCount = 0;
  //   for (const tagType of searchParams.keys()) {
  //     if (tagTypes.includes(tagType)) tagCount++;
  //   }
  //   return tagCount >= 2;
  // }

  function initVideo() {
    document.querySelectorAll('.video-thumb-container').forEach(container => {
      ['click', 'touchend'].forEach(event => container.addEventListener(event, loadVideo));
    })
  }
  
  function loadVideo(e) {
    if (e.target.closest('iframe')) return;
    const provider = this.dataset.provider;
    const url = this.dataset.videoUrl;
    const sharedParams = 'autoplay=1';
    const youtubeParams = 'enablejsapi=1&controls=0&iv_load_policy=3&showinfo=0&rel=0';
    const params = (
      `${url.includes('?') ? '&' : '?'}` + sharedParams + `${provider === 'youtube' ? `&${youtubeParams}` : ''}`
    );
    const modal = document.getElementById('video-modal');
    const videoFrame = isMobileView() ? document.querySelector('.story-video-xs iframe') : modal.querySelector('iframe');
    const pauseVideo = (e) => {
      videoFrame.contentWindow.postMessage(
        provider === 'youtube' ? '{"event":"command","func":"pauseVideo","args":""}' : '{"method":"pause"}', 
        '*'
      );
    }
    if (isMobileView()) {
      videoFrame.addEventListener('load', (e) => {
        const frame = e.currentTarget;
        frame.classList.remove('hidden');
        [...frame.parentElement.children].forEach(el => { if (!el.isSameNode(frame)) el.remove(); });
      }, { once: true });
      videoFrame.src = url + params;

    // attach one-time listeners since the postMessage will differ by provider
    } else {
      const closeBtn = modal.querySelector('button.close');
      videoFrame.contentWindow.location.replace(url + params);
      closeBtn.addEventListener('click', pauseVideo);
      $(modal)
        .on('hide.bs.modal', pauseVideo)
        .one('hidden.bs.modal', (e) => {
          closeBtn.removeEventListener('click', pauseVideo);
          $(modal).off('hide.bs.modal', pauseVideo);
        })
    }
  }

  function initMoreStories() {
    if (isMobileView() && document.querySelector('.primary-cta-xs')) return false;
    const minStories = 4;
    const delay = 5;
    const storySlug = location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
    const shouldInit = (
      document.body.className.search(/pixlee|varmour/) === -1 && 
      window.innerWidth >= 768
      // TODO: # of featured|related stories >= minStories (implement in server)
    )
    if (!shouldInit) return false;
    const carousel = document.createElement('div');
    carousel.id = 'cs-tabbed-carousel';
    carousel.classList.add('cs-plugin');
    const scriptTag = document.createElement('script');
    scriptTag.src = `${location.origin}/plugins/tabbed_carousel/cs.js`; 
    scriptTag.setAttribute('data-delay', delay);
    scriptTag.setAttribute('data-title', 'More Stories');
    scriptTag.setAttribute('data-skip', storySlug)
    document.body.appendChild(carousel);
    document.body.appendChild(scriptTag);

    // prevent the carousel tab from covering up user sign in
    const signInFooter = document.getElementById('sign-in-footer');
    if (signInFooter) addFooterScrollListener(carousel, signInFooter);    
  }

  // TODO how to determine if carousel is present given that it won't appear until X seconda after load?
  function addFooterScrollListener(carousel, footer) {
    document.addEventListener('scroll', (e) => {
      // TODO memoize this?
      const scrollBottom = document.documentElement.scrollHeight - document.documentElement.clientHeight - scrollY;

      if (scrollBottom < footer.clientHeight) {
        carousel.classList.add('hidden');
      } else if (!document.cookie.includes('cs-tabbed-carousel-removed')) {
        carousel.classList.remove('hidden');
      }
    }, { passive: true });
  }

  function initMobileCta() {
    const cta = document.querySelector('.primary-cta-xs');
    if (cta) {
      const removeCta = (e) => { if (e.target.closest('button')) cta.remove(); };
      setTimeout(() => cta.classList.add('open'), 3000);
      cta.addEventListener('click', removeCta);
      cta.addEventListener('touchend', removeCta);
    }
  }

  function initShareButtons(e) {
    document.querySelectorAll('.share-button').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();   // don't follow the link
        const width = parseInt(link.dataset.windowWidth);
        const height = parseInt(link.dataset.windowHeight);
        const top = screenTop + (document.documentElement.clientHeight / 2) - (height / 2);
        const left = screenLeft + (document.documentElement.clientWidth / 2) - (width / 2);
        window.open(
          e.currentTarget.href, 
          'Share Customer Story', 
          `width=${width},height=${height},top=${top},left=${left},resizable=no`
        );
      });
    });
  }

  function initSearchForms() {
    const syncInputs = (e) => {
      [...searchForms]
        .filter(form => !form.isSameNode(e.currentTarget))
        .forEach(form => form.querySelector('.search-stories__input').value = e.target.value);
    }
    searchForms.forEach(form => {
      form.addEventListener('input', syncInputs);
      form.addEventListener('click', (e) => { if (e.target.type === 'submit') beforeSearchSubmit(e) });
      form.querySelector('.search-stories__clear').addEventListener('click', (e) => {
        clearSearch();
        renderStories([...featuredStories]);
      });
    });
  }

  function clearSearch(e) {
    const isUserInput = e;
    searchAndFilters.forEach(container => container.classList.remove('has-search-results'));
    searchForms.forEach(form => form.querySelector('.search-stories__input').value = '');
    if (isUserInput) renderStories([...featuredStories]);
  }

  function initFilters() {
    const hasCombinedResults = [...filters].filter(select => select.value).length >= 2
    // if (hasCombinedResults) {
      //   showResults({ combined: document.querySelectorAll().length });
      // }
    initFilterControls();

    filters.forEach(select => {
      const otherSelects = [...filters].filter(_select => !_select.isSameNode(select));
      const tsOptions = Object.assign(
        sharedSelectOptions(select, otherSelects),  
        select.multiple ? multiSelectOptions() : singleSelectOptions()
      );
      const ts = new TomSelect(select, tsOptions);
      if (select.multiple) {
        // add clearing behavior
        ts.wrapper.querySelectorAll('.item').forEach(item => onMultiSelectItemAdd(ts, item));
        ts.on('item_add', (value, item) => onMultiSelectItemAdd(ts, item));
      };
    });
    setTimeout(() => searchAndFilters.forEach(container => container.setAttribute('data-init', 'true')));
  }
      
  function initFilterControls() {
    const clearFiltersBtn = document.querySelector('[data-action="stories#clearFilters"]');
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);
    matchTypeInputs.forEach(input => input.addEventListener('change', (e) => {
      if (input.checked) {
        Cookies.set('csp-filters-match-type', input.value);
        // apply filters combinatorially or disjunctively
        
      }
    }));
  }

  function initStoryCards(cards) {
    cards.forEach(card => {
      const link = card.children[0];
      if (link.classList.contains('published')) {
        link.addEventListener('click', visitStory);

        // set passive: false to override Chrome default behavior; see TouchEvent MDN docs
        link.addEventListener('touchstart', visitStory, { passive: false });
      }
    })    
  }

  function visitStory(e) {
    e.preventDefault();
    const link = this;
    // if (!link.dataset.ready) {
    //   e.preventDefault();
    // } else {
    //   link.dataset.ready = false;
    //   return false;
    // }
    const card = link.parentElement;
    const otherCards = [...(location.pathname === '/' ? featuredStories : relatedStories)]
      .filter(_card => !_card.isSameNode(card));
    let loadingTimer;
    const toggleOtherCards = (shouldEnable) => {
      otherCards.forEach(_card => _card.style.pointerEvents = shouldEnable ? '' : 'none');
    }
    const revertStyle = (e) => {
      if (e.persisted) {
        clearTimeout(loadingTimer);
        card.classList.remove('loading', 'still-loading', 'hover');
        toggleOtherCards(true);
      }
    };
    const followLink = () => {
      toggleOtherCards(false);
      addEventListener('pagehide', revertStyle, { once: true });
      card.classList.add('loading');
      loadingTimer = setTimeout(() => card.classList.add('still-loading'), 1000);
      
      location = link.href;
      // setTimeout(() => location = link.href)
      // link.dataset.ready = true;
      // link.click();
    }
    if (e.type === 'click') {
      followLink();
    } else if (e.type === 'touchstart' && !card.classList.contains('hover')) {
      card.classList.add('hover');

      // next tap => load story
      link.addEventListener('touchstart', followLink, { once: true });

      // undo hover and touchstart listener if clicking anywhere outside the story card
      document.addEventListener('touchstart', (e) => {
        if (card.contains(e.target)) return false;
        card.classList.remove('hover');  
        link.removeEventListener('touchstart', followLink);
      }, { once: true, capture: true });
    }
  }
  
  function onChangeFilter(changedSelect, otherSelects, value) {
    const isMulti = Array.isArray(value);
    const searchParams = new URLSearchParams(location.search);
    const getTagSlug = (select, value) => (
      value ? Object.values(select.tomselect.options).find(option => option.value === value).slug : ''
    );

    // { category: { id: 4, slug: 'some-category-slug' }, product: { id: 7, slug: 'some-product-slug' } }
    let tags;

    if (isMulti) {
      const tagTypeIds = value;   // e.g. 'category-4', 'product-7'

      // reverse => ensures FIFO behavior
      // reduce => build the tags object, with only one instance of a given tag type
      // sort => category always goes first
      const newTagTypeIds = tagTypeIds
        .reverse()   
        .reduce((acc, tagTypeId) => {
          const tagType = tagTypeId.slice(0, tagTypeId.lastIndexOf('-'));
          const isRepeatedType = acc.find(_tagTypeId => _tagTypeId.includes(tagType));
          if (isRepeatedType) {
            return acc;
          } else {
            // build the tags object
            tags[`${tagType}`] = { 
              id: parseInt(tagTypeId.slice(tagTypeId.lastIndexOf('-') + 1), 10), 
              slug: getTagSlug(changedSelect, tagTypeId) 
            };
            return [...acc, tagTypeId];
          }
        }, [])
        .sort(byTagType.bind(null, 'category'));
      if (newTagTypeIds.length) changedSelect.tomselect.setValue(newTagTypeIds, true);

    } else {
      const tagSlug = getTagSlug(changedSelect, value);
      if (value) {
        searchParams.set(singleSelectTagType(changedSelect), tagSlug);
      } else {
        searchParams.delete(singleSelectTagType(changedSelect));
      }
      tags = Object.fromEntries(
        [...searchParams]
          .filter(([tagType, tagSlug]) => /^(category|product)$/.test(tagType))
          .map(([tagType, tagSlug]) => [tagType, { id: parseInt(value, 10), slug: tagSlug }])
      )
    }
    clearSearch();
    // clearFilterResults();
    // filterStories(tags).then(showResults);
    renderStories(filterStories(tags), "Sorry, we couldn't find any stories matching the selected filters");
    syncFilters(changedSelect, otherSelects, tags, isMulti);
    history.replaceState(null, '', `${formatTagParams(tags)}`);
  }

  function beforeSearchSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const searchString = form.querySelector('.search-stories__input').value;
    if (!searchString) {
      location.reload(false);   // false => reload from cache if available; true => reload from server
    } else {
      renderStories([]);
      clearFilters();
      fetch('/stories?' + new URLSearchParams({ q: searchString }), {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        }
      }).then(res => res.json()).then((storyIds) => {
        const filteredStories = [...featuredStories].filter(card => storyIds.includes(parseInt(card.dataset.storyId, 10)));
        // form.classList.add('was-executed');
        renderStories(filteredStories, `Sorry, we couldn't find any stories matching \"${query}\"`); 
        // showResults({ search: filteredStories.length, searchString });
      })
    }
  }

  function filterStories(tags) {
    const matchType = [...matchTypeInputs].find(input => input.checked).value;
    console.log('matchType', matchType)
    const storyIsTagged = (card, tagType) => JSON.parse(card.dataset[tagType]).includes(tags[tagType].id);
    return Object.keys(tags).length === 0 ?
      [...featuredStories] :
      [...featuredStories].filter(card => {
        if (matchType == 'all') {
          return Object.keys(tags).every(tagType => storyIsTagged(card, tagType));
        } else if (matchType == 'any') {
          return Object.keys(tags).some(tagType => storyIsTagged(card, tagType));
        }
      })

    // const results = Object.fromEntries( 
    //   Object.entries(tags).reduce((activeFilters, [tagType, { id: tagId, slug: tagSlug }]) => {
    //     if (tagId) activeFilters.push([ tagType, [...featuredStories].filter(card => storyIsTagged(card, tagType)).length ]);
    //     return activeFilters;
    //   }, [])
    // );
    // if (Object.keys(results).length) Object.assign(results, { combined: filteredStories.length })
    // return Promise.resolve(results);
  }
  
  function renderStories(filteredStories, noResultsMesg) {
    const gallery = document.getElementById('stories-gallery');
    const createItem = (content) => {
      const li = document.createElement('li');
      if (typeof content === 'string') {
        li.insertAdjacentHTML('afterbegin', content);
      } else {
        li.appendChild(content);
      }
      return li;
    }
    if (!filteredStories.length && noResultsMesg) {
      gallery.replaceChildren(createItem(`<h4 id="no-search-results">${noResultsMesg}</h4>`));
    } else {
      gallery.replaceChildren(...filteredStories.map(createItem));
    }
  }

  function showResults(results) {
    // console.log('results', results)
    const format = (count) => `${count} ${count === 1 ? 'story' : 'stories'}`;
    if (results.search) {
      document.querySelector('.search-stories__search-string').textContent = results.searchString;
      document.querySelectorAll('.search-stories__results').forEach(el => el.textContent = format(results.search));
      searchAndFilters.forEach(container => {
        container.classList.remove('has-combined-results');
        container.classList.add('has-search-results');
      });
    } else {
      // - keep existing results display for xs and sm, including individual filters



      for (const [tagType, count] of Object.entries(results)) {
        document.querySelectorAll(`.stories-filter__results--${tagType}`).forEach(result => {
          result.textContent = `${tagType === 'combined' ? 'Applied filters:\xa0\xa0' : ''}${format(count)}`;
        });
      }
    }
  }

  function syncFilters(changedSelect, otherSelects, tags, multiChanged) {
    otherSelects.forEach(select => {
      if (multiChanged) {
        select.tomselect.setValue(
          tags[singleSelectTagType(select)] ? tags[singleSelectTagType(select)].id : '', 
          true
        );
      } else {
        const changedType = singleSelectTagType(changedSelect);
        if (singleSelectTagType(select) === changedType) {
          select.tomselect.setValue(changedSelect.value, true);
        }
      }
    });
    if (!multiChanged) {
      const multiSelect = otherSelects.find(select => select.multiple);
      if (multiSelect) {
        const newTagTypeIds = Object.entries(tags)
          .flatMap(([tagType, { id: tagId }]) => tagId ? `${tagType}-${tagId}` : [])
          .sort(byTagType.bind(null, 'category'));
         multiSelect.tomselect.setValue(newTagTypeIds, true);
      }
    }
  }

  function clearFilters(e) {
    if ([...filters].filter(select => select.value).length === 0) return;
    const isUserInput = Boolean(e);
    filters.forEach(select => select.tomselect.clear(true));
    if (isUserInput) renderStories([...featuredStories]);
    searchAndFilters.forEach(container => container.classList.remove('has-combined-results'));
    history.replaceState(null, '', '/');
  }

  function onMultiSelectItemAdd(ts, item) {
    item.querySelector('.clear-button').addEventListener('click', (e) => {
      e.stopPropagation();  // don't highlight active or open dropdown
      removeMultiSelectItem(ts, item);
    });
  }

  function removeMultiSelectItem(multiTomSelect, item) {
    multiTomSelect.removeItem(item.dataset.value);
    multiTomSelect.blur();
  };

  function sharedSelectOptions(select, otherSelects) {
    return {
      controlInput: null,   // disable search; note this causes placeholder to disappear (fixed with ::before content)
      onInitialize() {},
      onFocus() {
        const dropdownMaxHeight = document.documentElement.clientHeight - this.wrapper.getBoundingClientRect().bottom;
        this.dropdown.children[0].style.maxHeight = `${dropdownMaxHeight - 10}px`;
      },
      onChange: onChangeFilter.bind(null, select, otherSelects)
    };
  }
  
  function singleSelectOptions() {
    TomSelect.define('clear_button', globalThis.clear_button);
    return {
      plugins: {
        'clear_button': {
          title: 'Clear selection',
          html: (config) => (`<button type="button" class="btn ${config.className}" title="${config.title}">&times;</button>`)
        }
      }
    };
  }

  function multiSelectOptions() {
    return { 
      closeAfterSelect: true,
      render: {
        item: (data, escape) => {
          const tagType = (
            data.value[0].toUpperCase() + (data.value.slice(1, data.value.lastIndexOf('-')).split('-').join(' '))
          );
  
          // tom-select will add .item class to this template
          return `
            <div>
              <div>
                <span class="tag-type">${tagType}:</span>&nbsp;<span class="tag-name">${escape(data.text)}</span>
              </div>
              <button type="button" class="btn clear-button" title="Clear selection">&times;</button>
            </div>
          `
        }
      },
      onInitialize() {},
      onItemAdd(value, item) {
        // disable highlighting of item when clicked
        const observer = new MutationObserver(mutations => {
          if (item.classList.contains('active')) item.classList.remove('active');
        });
        observer.observe(item, { attributes: true })
      }
    };
  }

  function formatTagParams(tags) {
    return Object.keys(tags).length === 0 ?
      '/' :
      Object.keys(tags).reduce((params, tagType, i) => (
        params + `${i === 0 ? '?' : '&'}${tagType}=${tags[tagType].slug}`
      ), '');
  }

  function singleSelectTagType(select) {
    return select.dataset.tomselectTypeValue;
  }

  function byTagType(tagType, a, b) {
    return a.includes(tagType) ? -1 : (b.includes(tagType) ? 1 : 0);
  }

  function isMobileView() {
    return document.documentElement.clientWidth < 768;
  }
  
  //TODO: move this behavior to html + css (position: sticky)
  function initFixedCta() {
    const isPixleeStory = ['stories', 'show', 'pixlee'].every(token => document.body.classList.contains(token));
    const sidebar = document.querySelector('.story-sidebar');
    const cta = document.querySelector('.pixlee-cta');
    if (!isPixleeStory || isMobileView() || !sidebar || !cta) return false;
    const backgroundDiv = cta.querySelector('.cta__image');
    const ctaTop = scrollY + backgroundDiv.getBoundingClientRect().top;
    document.addEventListener('scroll', (e) => {
      if (scrollY > ctaTop - 95) {
        // console.log('fix', scrollY, ctaTop)
        cta.style.position = 'fixed';
        cta.style.top = '95px';
        cta.style.left = `${sidebar.getBoundingClientRect().left + parseFloat(getComputedStyle(sidebar).paddingLeft)}px`;
        cta.style.height = '400px';
        cta.style.width = `${
          parseFloat(getComputedStyle(sidebar).width) - 
          parseFloat(getComputedStyle(sidebar).paddingLeft) - 
          parseFloat(getComputedStyle(sidebar).paddingRight)
        }px`;
      } else {
        // console.log('no fix')
        cta.style.position = 'static';
      }
    }, { passive: true });
  }
})();