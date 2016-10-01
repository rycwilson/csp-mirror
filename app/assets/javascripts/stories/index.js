
function storiesIndexHandlers () {

  $(document).on('layoutComplete', '.grid', function () {
    centerLogos();
  });

  $(document).on('change', '.stories-filter', function () {
    console.log('filter change');
    var $categorySelect = $("[name='category_select']"),
        $productSelect = $("[name='product_select']"),
        filterTag = $(this).attr('name').replace('_select', ''),
        filterId = $(this).val(),
        filterSlug = $(this).find("option[value='" + filterId + "']").data('slug'),
        storiesTemplate = _.template($('#stories-template').html()),
        filteredStories = [];

    filteredStories = filterStories(filterTag, filterId);
    updateGallery($(storiesTemplate({
                      stories: filteredStories,
                      isCurator: app.current_user && app.current_user.is_curator
                    })));
    replaceStateStoriesIndex(filterTag, filterId, filterSlug);
    mutuallyExcludeFilters(filterTag, filterId, $categorySelect, $productSelect);
  });
}

function filterStories (filterTag, filterId, filterSlug) {
  // console.log('filterStories');
  // if (app.stories.length === 0) {
  //   if (filterId === '0') {
  //     Turbolinks.visit('/');
  //     console.log('visit /');
  //   } else {
  //     console.log('visit /?' + filterTag + '=' + filterSlug);
  //     Turbolinks.visit('/?' + filterTag + '=' + filterSlug);
  //   }
  // }
  if (filterId === '0') {  // all stories
    return app.current_user.is_curator ? app.stories :
           app.stories.filter(function (story) { return story.logo_published; });
  }
  return app.stories.filter(function (story, index) {
    if (filterTag === 'category') {
      if (app.current_user.is_curator) {
        return story.success.story_categories.some(function (category) {
          // loosely typed because former is string, latter is number ...
          return category.id == filterId;
        });
      } else {
        return story.logo_published &&
          story.success.story_categories.some(function (category) {
            // loosely typed because former is string, latter is number ...
            return category.id == filterId;
          });
      }
    } else if (filterTag === 'product') {
      if (app.current_user.is_curator) {
        return story.success.products.some(function (product) {
          return product.id == filterId;
        });
      } else {
        return story.logo_published &&
          story.success.products.some(function (product) {
            return product.id == filterId;
          });
      }
    } else {
      // TODO: error
    }
  });
}

function mutuallyExcludeFilters (filterTag, filterId, $categorySelect, $productSelect) {
  if (filterTag === 'category' && $productSelect.length) {
    // change the selected option without triggering the 'change' event
    $productSelect.val('0').trigger('change.select2');
  } else if (filterTag === 'product' && $categorySelect.length) {
    $categorySelect.val('0').trigger('change.select2');
  }
}

function selectBoxesTrackQueryString ($categorySelect, categorySlug, $productSelect, productSlug) {
  var filterId = null;
  if (categorySlug) {
    filterId = $categorySelect.find("option[data-slug='" + categorySlug + "']").val();
    $categorySelect.val(filterId).trigger('change.select2');
    if ($productSelect.length) { $productSelect.val('0').trigger('change.select2'); }
  } else if (productSlug) {
    filterId = $productSelect.find("option[data-slug='" + productSlug + "']").val();
    $productSelect.val(filterId).trigger('change.select2');
    if ($categorySelect.length) { $categorySelect.val('0').trigger('change.select2'); }
  } else {
    $categorySelect.val('0').trigger('change.select2');
    $productSelect.val('0').trigger('change.select2');
  }
  $("[name='category_select'] + span").find('.select2-selection')
                                        .each(function () { $(this).blur(); });
  $("[name='product_select'] + span").find('.select2-selection')
                                       .each(function () { $(this).blur(); });
}

function updateGallery ($stories) {

  var $gallery = $('#stories-gallery');

  if ($gallery.children().length) {  // trying to empty an already empty .grid element can lead to problems
    $gallery.empty().masonry();
  }
  $stories.imagesLoaded(function () {
    $gallery.append($stories)
            .masonry('appended', $stories);
  });
}

// turbolinks will not save filter info to the state, so it's not included
function replaceStateStoriesIndex (filterTag, filterId, filterSlug) {
  if (filterId === '0') {  // all
    history.replaceState({ turbolinks: true }, null, '/');
  } else if (filterTag === 'category') {
    history.replaceState({ turbolinks: true }, null, '/?category=' + filterSlug);
  } else if (filterTag === 'product') {
    history.replaceState({ turbolinks: true }, null, '/?product=' + filterSlug);
  } else {
    // error
  }
}


//
// With { turbolinks: true } in all calls to history.pushState(),
// turbolinks is handling the browser history.
//
// function popstateHandler ($categorySelect, $productSelect, storiesTemplate) {

//   window.onpopstate = function (event) {

//     // if (event.state.turbolinks) { return false; }

//     var categorySlug = getQueryString('category'),
//         productSlug = getQueryString('product');
//         // categoryId = $categorySelect ? $categorySelect.find(':selected').val() : null,
//         // productId = $productSelect ? $productSelect.find(':selected').val() : null,

//     if (event.state.filter) {

//       var filterTag = event.state.filter.tag;
//       var filterId = event.state.filter.id; // this may be a slug

//       filteredStories = filterStories(filterTag, filterId);
//       updateGallery($(storiesTemplate({
//                          stories: filteredStories,
//                          isCurator: app.current_user.is_curator })));
//       selectBoxesTrackQueryString($categorySelect, categorySlug, $productSelect, productSlug);

//     // Safari only (calls window.onpopstate on initial load)
//     // } else {
//       // replacePageState($categorySelect, categorySlug, $productSelect, productSlug);
//     }
//   };
// }