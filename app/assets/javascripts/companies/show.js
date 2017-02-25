
function companiesShow () {
  adjustPromoCSSChecker();
}

function companiesShowListeners () {
  newStoryModalListeners();
  measureCharts();
  measureStories();
  measureVisitors();

  // toggle display Recent activity groups
  $(document).on('show.bs.collapse hidden.bs.collapse',
                 '#activity-groups .hiddenRow',
    function () {
      $(this).parent().prev().find('i').toggle();
  });

}

function measureCharts () {
  var getCharts = function (isInitialLoad) {
    $.get({
      url: '/analytics/charts',
      data: {
        story_id: $('#charts-story-select').val(),
        date_range: $('#charts-date-range-input').val(),
        initial_load: isInitialLoad
      },
      success: function (data, status, jqxhr) {
        initGoogleCharts(true, data.charts);
      },
      dataType: 'json'
    });
  };

  $(document)
    .on('click', 'a[href="#measure-panel"]',
      function () {
        // if current page is not companies#show, let initGoogleCharts handle it
        if ($('#measure-summary-container').length === 0) {
          return false;
        }
        if ($('#visitors-bar-graph').children().length === 0) {
          getCharts(true);
        }
      })
    .on('submit', '#charts-filter-form',
      function (e) {
        e.preventDefault();
        getCharts(false);
      });
}

function measureStories () {
  var initTable = function ($table, data) {
        $table.DataTable({
          data: data,
          columns: [
            { title: 'Customer' },
            { title: 'Title' },
            { title: 'Publish Date' },
            { title: 'Unique Visitors' },
            // { title: 'Visits' },
            { title: 'Landing' }
          ],
          paging: false,
          info: false,
          order: [[3, 'desc']]
        });
        $table.css('visibility', 'visible');
      },
      getStories = function () {
        var $table = $('#measure-stories-table');
        $.get({
          url: '/analytics/stories',
          success: function (data, status, jqxhr) {
            initTable($table, data.data);
          },
          dataType: 'json'
        });
      };

  $(document).on('click', 'a[href="#measure-stories-container"]',
    function () {
      if (!$.fn.DataTable.isDataTable($('#measure-stories-table'))) {
        getStories();
      }
    });
}

function measureVisitors () {

  var formatChildRow = function (org, $parentRow) {
        var tbody = '<tbody>',
            cellStyle = function ($parentRow, column) {
              var width = $parentRow.find('td:nth-of-type(' + column.toString() + ')').css('width'),
                  padding = $parentRow.find('td:nth-of-type(' + column.toString() + ')').css('padding'),
                  lineHeight = $parentRow.find('td:nth-of-type(' + column.toString() + ')').css('line-height');
              if (column === 1 || column === 3) {
                width = (parseInt(width, 10) - parseInt(padding, 10)).toString() + "px";
              }
              return 'width:' + width + ';padding:' + padding + ';line-height:' + lineHeight;
            };
        org[3].forEach(function (story, storyIndex) {
          tbody += '<tr ' + 'style="' + ((storyIndex < org[3].length - 1) ? 'border-bottom:1px solid #ddd' : '') + '"><td style="' + cellStyle($parentRow, 1) + '"></td>';
          story.forEach(function (cellData, index) {
            tbody += '<td style="' + cellStyle($parentRow, index + 2) + '">' + cellData + '</td>';
          });
          tbody += '</tr>';
        });
        tbody += '</tbody>';
        return '<table cellpadding="5" cellspacing="0" border="0">' +
                  tbody +
               '</table>';
      },

      initTable = function ($table, data) {
        $table.DataTable({
          data: data,
          columns: [
            {
              className:      'details-control',
              orderable:      false,
              data:           null,
              defaultContent: '<i class="fa fa-chevron-right"></i><i class="fa fa-chevron-down"></i>'
            },
            { title: 'Organization' },
            { title: 'Unique Visitors' },
            // { title: 'Visits' }
          ],
          order: [[1, 'asc']]
        });
        $table.css('visibility', 'visible');
      },
      updateTable = function ($table, data) {
        $table.DataTable().clear();
        $table.DataTable().rows.add(data);
        $table.DataTable().draw();
      },
      getVisitors = function (isInitialLoad) {
        var $table = $('#measure-visitors-table');
        $.get({
          url: '/analytics/visitors',
          data: {
            story_id: $('#visitors-story-select').val(),
            date_range: $('#visitors-date-range-input').val(),
            initial_load: isInitialLoad
          },
          success: function (data, status, jqxhr) {
            if ($.fn.DataTable.isDataTable($table)) {
              updateTable($table, data.data);
            } else {
              initTable($table, data.data);
            }
          },
          dataType: 'json'
        });
      };

  $(document)
    .on('submit', '#visitors-filter-form',
      function (e) {
        e.preventDefault();
        getVisitors(false);
      })
    .on('click', 'a[href="#measure-visitors-container"]',
      function () {
        if (!$.fn.DataTable.isDataTable($('#measure-visitors-table'))) {
          getVisitors(true);
        }
      })
    .on('click', 'td.details-control',
      function () {
        var table = $('#measure-visitors-table').DataTable(),
            $parentRow = $(this).closest('tr'),
            row = table.row($parentRow);
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            $parentRow.removeClass('shown');
        }
        else {
            // Open this row
            row.child( formatChildRow(row.data(), $parentRow) ).show();
            $parentRow.addClass('shown');
        }
        $parentRow.find('i').toggle();
      });
}

function newStoryModalListeners () {

  // jquery-ujs functionality gets lost after turbolinks navigation,
  // so handle it manually ... (limited to modals?)
  $(document).on('click', '#new-story-modal input[type="submit"]',
    function (event) {
      event.preventDefault();
      $.rails.handleRemote($('#new-story-modal form'));
    });

  /*
    Detect changes in new story modal required inputs, and enable
    submit button accordingly.
    'change' event is for the select boxes; 'input' for text box
  */
  $(document).on('change input', '#new-story-modal', function () {
    if ($('#story_customer').val() &&
        $('#story_title').val()) {
      $(this).find("[type='submit']").prop('disabled', false);
    }
    else {
      $(this).find("[type='submit']").prop('disabled', true);
    }
  });

  // reset new story modal form
  $(document).on('hidden.bs.modal', '#new-story-modal', function () {
    // form inputs to default values... (in this case just title)
    $(this).find('form')[0].reset();
    // select2 inputs to default values...
    $('.new-story-customer').select2('val', '');  // single select
    $('.new-story-tags').val('').trigger('change');  // multiple select
  });
}

function adjustPromoCSSChecker () {
  if ($('#promote').hasClass('active')) {
    adjustPromoCSS();
  } else {
    $(document).on('shown.bs.tab', "a[href='#promote-panel']", function () {
      adjustPromoCSS();
    });
  }
}

function adjustPromoCSS () {

  var ad2LogoWidth = parseInt($('.ad2-logo').css('width'), 10);

  $('.ad1-text').each(function () {
    if ($(this).data('text-length') >= 85) {
      $(this).css('font-size', '22px');
    }
  });

  $('.ad2-text').each(function () {
    $(this).css('padding-left', ad2LogoWidth + 20);
    if ($(this).data('text-length') >= 85) {
      $(this).css('font-size', '20px');
      $(this).css('top', '10px');
    } else if ($(this).data('text-length') >= 75) {
      $(this).css('font-size', '22px');
      $(this).css('top', '8px');
    }
  });
}




