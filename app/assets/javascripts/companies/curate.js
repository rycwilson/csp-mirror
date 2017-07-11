
function curate () {


  // filterCurateGallery();
}

function curateListeners () {

  $(document)
    .on('click', '#curate-gallery a.logo-published, #curate-gallery a.pending-curation',
      function (e) {
        e.preventDefault();
        var $story = $(this).closest('li');
        selectStory($story);
        $.ajax({
          url: '/stories/' + $story.data('story-id') + '/edit',
          method: 'get',
          dataType: 'html',
          success: function (html, status, xhr) {
            $('#curate-panel .container').children()
                .fadeOut({ duration: 150, easing: 'linear',
                  complete: function () {
                    $('#curate-panel .container').append(html)
                      .fadeIn({ duration: 150, easing: 'linear' });
                  }
              });
            initContributorsTable('curate');
            var $table = $('#curate-contributors-table'), dt = $table.DataTable(),
                curatorCol = $table.data('curator-col'),
                curatorId = app.current_user.id,
                successCol = $table.data('success-col'),
                successId = $('#story-settings-tab-pane').data('success-id');
            dt.columns(curatorCol).search(curatorId)
              .columns(successCol).search(successId)
              .draw();
          }
        });
      })

    .on('change', '.curate.curator-select, .curate.category-select,' +
        '.curate.product-select, .curate.published, .curate.logo-published,' +
        '.curate.pending-curation',
      function (e) {
        filterCurateGallery();
      });

}

function filterCurateGallery () {
  var stories = [], $gallery= $('#curate-gallery'),
      storiesTemplate = _.template($('#stories-template').html()),
      curatorId = $('.curate.curator-select').val(),
      categoryId = $('.curate.category-select').val(),
      productId = $('.curate.product-select').val(),
      showPublished = $('.curate.published').prop('checked'),
      showLogoPublished = $('.curate.logo-published').prop('checked'),
      showPendingCuration = $('.curate.pending-curation').prop('checked');
      console.log('curator: ', curatorId);
      console.log('category: ', categoryId, typeof categoryId);
      console.log('product: ', productId);
      console.log('published: ', showPublished);
      console.log('logo published: ', showLogoPublished);
      console.log('pending curation: ', showPendingCuration);

  var curatorStoryIds = (curatorId === '0') ? _.pluck(app.stories, 'id') :
        _.pluck(app.stories.filter(function (story) {
                  return story.success.curator_id == curatorId;
        }), 'id');
        console.log(curatorStoryIds)
  var categoryStoryIds = (categoryId === '0') ? _.pluck(app.stories, 'id') :
        _.pluck(app.stories.filter(function (story) {
                  return story.success.story_categories &&
                     story.success.story_categories.some(function (category) {
                       return category.id == categoryId;
                     });
        }), 'id');
        console.log(categoryStoryIds)
  var productStoryIds = (productId === '0') ? _.pluck(app.stories, 'id') :
        _.pluck(app.stories.filter(function (story) {
                  return story.success.products &&
                    story.success.products.some(function (product) {
                      return product.id == productId;
                    });
        }), 'id');
        console.log(productStoryIds)
  var publishedStoryIds =
        _.pluck(app.stories.filter(function (story) {
                  return story.published;
        }), 'id');
        // console.log(publishedStoryIds)
  var logoStoryIds =
        _.pluck(app.stories.filter(function (story) {
                  return !story.published && story.logo_published;
        }), 'id');
        // console.log(logoStoryIds)
  var pendingStoryIds =
        _.pluck(app.stories.filter(function (story) {
                  return !story.published && !story.logo_published;
        }), 'id');
// console.log(pendingStoryIds)

  storyIds = _.intersection(curatorStoryIds, categoryStoryIds, productStoryIds);
  console.log('after intersection: ', storyIds);
  storyIds = showPublished ? storyIds : _.difference(storyIds, publishedStoryIds);
  console.log('after removing published (if necessary): ', storyIds)
  storyIds = showLogoPublished ? storyIds : _.difference(storyIds, logoStoryIds);
  console.log('after removing logo published (if necessary): ', storyIds)
  storyIds = showPendingCuration ? storyIds : _.difference(storyIds, pendingStoryIds);
  console.log('after removing pending (if necessary): ', storyIds)
  stories = app.stories.filter(function (story) {
              return storyIds.includes(story.id);
            });

  // stories = app.stories.filter(function (story) {
  //   return (
  //     (curatorId === '0' ? true : story.success.curator_id == curatorId) &&
  //     (categoryId === '0' ? true :
  //       story.success.story_categories && story.success.story_categories.some(
  //         function (category) { return category.id == categoryId; }
  //       )) &&
  //     (productId === '0' ? true :
  //       story.success.products && story.success.products.some(
  //         function (product) { return product.id == productId; }
  //       )) &&
  //     (isPublished ? story.published : !story.published) &&
  //     (isLogoPublished ? story.logo_published : !story.logo_published) &&
  //     (isPendingCuration ? story.pending_curation : !story.pending_curation)
  //   );
  // });

  console.log('results: ', stories);

  $gallery.empty()
    .append(
      $(storiesTemplate({ stories: stories, isCurator: true }))
    ).hide().show('fast');

}

// when a story is selected,
// - disallow pointer events on other stories
// - stay in persistent hover state
function selectStory ($story) {
  $story.addClass('selected');
  $('#curate-gallery li').not($story).css('pointer-events', 'none');
  $story.find('.thumbnail-view-hover').css('transform', 'none');
  $story.find('img').css('opacity', '0.1');
}




