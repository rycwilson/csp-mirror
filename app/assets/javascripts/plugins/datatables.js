
function initDataTables () {


  // make sure daterangepicker is initialized prior to datatables,
  // else the prior selected date range will be used instead of default
  if ($('#measure-visitors-container').hasClass('active')) {
    $('a[href="#measure-visitors-container"]')[0].click();
  }
  if ($('#measure-stories-container').hasClass('active')) {
    $('a[href="#measure-stories-container"]')[0].click();
  }

  $('#customers-table').DataTable({
    paging: false,
    columnDefs: [
      { orderable: false, targets: [ 2 ] },
      { width: '160px', targets: 2 }
    ],
  });

  var customerIndex = 2, succColumnsCount = 5;
  $('#successes-table').DataTable({
    paging: false,
    order: [[ customerIndex, 'asc' ]],
    columnDefs: [
      { visible: false, targets: [ customerIndex ] },
      { orderable: false, targets: [ 0, succColumnsCount - 1 ] },
      { width: '5%', targets: 0 },
      { width: '55%', targets: 1 },
      { width: '0%', targets: 2 },
      { width: '30%', targets: 3 },
      { width: '10%', targets: 4 },
    ],
    drawCallback: function (settings) {
      var api = this.api();
      var rows = api.rows( { page:'current' } ).nodes();
      var last = null;
      // row grouping
      api.column(customerIndex, { page: 'current' }).data().each(function (group, i) {
        if (last !== group) {
          $(rows).eq(i).before(
            '<tr class="group" style="font-weight:600"><td colspan="' + (succColumnsCount - 1).toString() + '">' + group + '</td></tr>'
          );
          last = group;
        }
      });
    },
    initComplete: function (settings, json) {
      $('#successes-table_wrapper > .row:first-child')
        .css({
          display: 'flex',
          'align-items': 'center'
        })
        .children('[class*="col-"]:first-child')
        .append('<label for="toggle-group-by-customer">' +
                  '<input type="checkbox" id="toggle-group-by-customer" checked>' +
                  '&nbsp;&nbsp;<span>Group Candidates by Customer</span>' +
                '</label>');

      $('#successes-table_wrapper')
        .prepend('<div class="row" style="display:flex; align-items:center; margin-bottom:15px">' +
                   '<div class="col-sm-6">' +
                     '<button type="button" class="btn btn-secondary" ' +
                        'data-toggle="modal" data-target="">' +
                       'Import Story Candidates' +
                     '</button>' +
                   '</div>' +
                   '<div class="col-sm-6 pull-right">' +
                     '<select>' +
                     '</select>' +
                   '</div>' +
                 '</div>');

      $('#successes-table_filter > label')
        .append('<i class="clear-search glyphicon glyphicon-remove"></i>');

    }
  });

  var successIndex = 2, conColumnsCount = 6;
  $('#contributors-table').DataTable({
    paging: false,
    autoWidth: false,
    order: [[ successIndex, 'asc' ]],
    // columns: [ { width: '60px' }, null, null, null, null, null, null ],
    columnDefs: [
      { visible: false, targets: [ successIndex ] },
      { orderable: false, targets: [ 0, conColumnsCount - 1 ] },
      { width: '5%', targets: 0 },
      { width: '30%', targets: 1 },
      { width: '0%', targets: 2 },
      { width: '30%', targets: 3 },
      { width: '25%', targets: 4 },
      { width: '10%', targets: 5 }
    ],
    drawCallback: function (settings) {
      var api = this.api();
      var rows = api.rows( { page:'current' } ).nodes();
      var last = null;
      api.column(successIndex, { page: 'current' }).data().each(function (group, i) {
        if (last !== group) {
          $(rows).eq(i).before(
            '<tr class="group"><td colspan="' + (conColumnsCount - 1).toString() + '">' + group + '</td></tr>'
          );
          last = group;
        }
      });
    },
    initComplete: function (settings, json) {
      $('#contributors-table_wrapper > .row:first-child')
        .css({
          display: 'flex',
          'align-items': 'center'
        })
        .children('[class*="col-"]:first-child')
        .append('<label for="toggle-group-by-success">' +
                  '<input type="checkbox" id="toggle-group-by-success" checked>' +
                  '&nbsp;&nbsp;<span>Group Contributors by Customer&nbsp;&nbsp;&#8211;&nbsp;&nbsp;Story Candidate</span>' +
                '</label>');

      $('#contributors-table_wrapper')
        .prepend('<div class="row" style="display:flex; align-items:center; margin-bottom:15px">' +
                   '<div class="col-sm-6">' +
                     '<button type="button" class="btn btn-secondary" ' +
                        'data-toggle="modal" data-target="">' +
                       'Import Contributors' +
                     '</button>' +
                   '</div>' +
                   '<div class="col-sm-6">' +
                     '<select>' +
                     '</select>' +
                   '</div>' +
                 '</div>');

      $('#contributors-table_filter > label')
        .append('<span class="clear-search glyphicon glyphicon-remove"></span>');
    }
  });

  $('#curate-table').DataTable({
    paging: false
  });

  $('#sponsored-stories-table').DataTable({
    paging: false,
    columnDefs: [{
      orderable: false,
      targets: [ 2, 4 ]
    }]
  });

  // Don't specify first column as type: 'date'
  // with moment.js install, doing so will only screw it up
  $('#story_views-table:not(.short)').DataTable({
    order: [0, 'desc'],
    columns: [
      { type: 'datetime-moment' }, null, null, null, null
    ]
  });
  $('#stories_published-table:not(.short)').DataTable({
    order: [0, 'desc'],
    columns: [
      { type: 'datetime-moment' }, null, null, null
    ]
  });
  $('#contributions_submitted-table:not(.short)').DataTable({
    order: [0, 'desc'],
    columns: [
      { type: 'datetime-moment' }, null, null, null
    ]
  });
  $('#contribution_requests_received-table:not(.short)').DataTable({
    order: [0, 'desc'],
    columns: [
      { type: 'datetime-moment' }, null, null, null
    ]
  });
  $('#stories_logo_published-table:not(.short)').DataTable({
    order: [0, 'desc'],
    columns: [
      { type: 'datetime-moment' }, null, null, null
    ]
  });
  $('#stories_created-table:not(.short)').DataTable({
    order: [0, 'desc'],
    columns: [
      { type: 'datetime-moment' }, null, null, null
    ]
  });

}