
function initPromotedStoriesTable () {

  var imageIndex = 0, titleIndex = 1, customerIndex = 2, statusIndex = 3, actionsIndex = 4,
      storyTitleRequirements = "Max 90 characters";

  $('#promoted-stories-table').DataTable({

    ajax: {
      url: '/companies/' + app.company.id + '/stories/promoted',
      dataSrc: ''
    },

    dom: 't',
    language: {
      emptyTable: 'No Promoted Stories found',
      zeroRecords: 'No Promoted Stories found'
    },
    order: [[ statusIndex, 'asc' ]],

    columns: [
      {
        name: 'image_url',
        data: 'ads_image_url',
        render: function (image_url, type, row, meta) {
          return '<div class="fileinput fileinput-exists" data-provides="fileinput">' +
                   '<div class="fileinput-preview thumbnail">' +
                     '<img src="' + image_url + '" alt="promoted story image">' +
                   '</div>' +
                   '<input type="file" name="image_url" id="image_url" class="hidden" ' +
                 '</div>';
        }
      },
      {
        name: 'long_headline',
        data: 'ads_long_headline'
      },
      {
        name: 'customer',
        data: 'success.customer.name'
      },
      {
        name: 'status',
        data: 'ads_status',
        render: function (data, type, row, meta) {
          if (type === 'display') {
            return _.template( $('#adwords-status-dropdown-template').html() )({
                     promoteEnabled: app.company.promote_tr,
                     adsEnabled: data === 'ENABLED' ? true : false
                   });
          } else {
            return data;
          }
        }
      },
      {
        name: 'actions',
        data: null,
        render: function (data, type, row, meta) {
          return _.template( $('#promoted-story-actions-dropdown-template').html() )({
            viewStoryPath: row.csp_story_path
          });
        }
      },
    ],

    columnDefs: [
      {
        targets: [imageIndex, titleIndex, actionsIndex],
        orderable: false
      },
      {
        targets: [statusIndex, titleIndex, actionsIndex],
        searchable: false
      },
      // { width: '31%', targets: storyTitleIndex },
      // { width: '22%', targets: [imageIndex, customerIndex] },
      { width: '20%', targets: imageIndex },
      { width: '44%', targets: titleIndex },
      { width: '20%', targets: customerIndex },
      { width: '8%', targets: statusIndex },
      { width: '8%', targets: actionsIndex },
    ],

    createdRow: function (row, data, index) {
      $(row).attr('data-story-id', data.id);
      $(row).children().eq(0).addClass('promoted-story-image');
      $(row).children().eq(1).addClass('promoted-story-title')
                             .attr('data-title', data.title);
      $(row).children().eq(2).addClass('promoted-story-customer');
      $(row).children().eq(3).addClass('status dropdown');
      $(row).children().eq(4).addClass('actions dropdown');
    },

    initComplete: function (settings, json) {
      // console.log($table.find('[data-toggle="tooltip"]'))

      var $table = $(this),
          initTooltips = function() {
            $table.find('[data-toggle="tooltip"]').tooltip({ container: 'body' });
            // add a tooltip message to stories that don't have an image
            $table.find('img[src=""]').each(
              function () {
                if ($('#ad-image-select-modal li').length === 0) {
                  $(this).closest('.fileinput')
                    .tooltip({
                      container: 'body',
                      placement: 'top',
                      title: 'To assign an image to this Promoted Story, upload images under Settings'
                    });
                }
              });
          };

      initTooltips();
      promotedStoriesEditor = newPromotedStoriesEditor();
      promotedStoriesEditor.on('open', function() {
        $('#DTE_Field_long_headline').attr('maxlength', '90');
        $('.DTE_Form_Buttons')
          .prepend('<span class="help-block">' + storyTitleRequirements + '</span>');
      });
      $(this).css('visibility', 'visible');

    },

  });
}