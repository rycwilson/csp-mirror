
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

  // curator index applies to both successes and contributors
  var customerIndex = 2, curatorIndex = 4, successesColCount = 6;
  $('#successes-table').DataTable({
    paging: true,
    pageLength: 100,
    lengthChange: false,
    order: [[ customerIndex, 'asc' ]],
    columnDefs: [
      { visible: false, targets: [ customerIndex, curatorIndex ] },
      { orderable: false, targets: [ 0, successesColCount - 1 ] },
      { width: '5%', targets: 0 },
      { width: '55%', targets: 1 },
      { width: '0%', targets: 2 },  // customer
      { width: '30%', targets: 3 },
      { width: '0%', targets: 4 },  // curator
      { width: '10%', targets: 5 }
    ],
    drawCallback: function (settings) {
      var api = this.api();
      var rows = api.rows( { page:'current' } ).nodes();
      var last = null;
      // row grouping
      api.column(customerIndex, { page: 'current' }).data().each(function (group, i) {
        if (last !== group) {
          // subtract two rows (customer, curator)
          $(rows).eq(i).before(
            '<tr class="group" style="font-weight:600"><td colspan="' + (successesColCount - 2).toString() + '">' + group + '</td></tr>'
          );
          last = group;
        }
      });
    },
    initComplete: function (settings, json) {
      var $table = $('#successes-table_wrapper'),
          template = _.template( $('#successes-table-header-template').html() );
      // remove default search field.  Disabling via options also disables api, so can't do that
      $table.children('.row:first-child').remove();
      $table.prepend(
        template({
          currentUser: app.current_user,
          curators: app.company.curators,
          selectWidth: 250
        })
      );
      var $curatorSelect = $table.find('.curator-select');
      $curatorSelect.select2({
        theme: 'bootstrap',
        width: 'style',
        minimumResultsForSearch: -1   // hides text input
      });
      // select2 is inserting an empty <option> for some reason
      $curatorSelect.children('option').not('[value]').remove();
      $('#successes-filter').select2({
        theme: 'bootstrap',
        width: 'style',
        placeholder: 'type or select'
        // allowClear: true
      });

    }
  });

  var successIndex = 2, contributorsColCount = 7;
  $('#contributors-table').DataTable({
    paging: false,
    autoWidth: false,
    order: [[ successIndex, 'asc' ]],
    // columns: [ { width: '60px' }, null, null, null, null, null, null ],
    columnDefs: [
      { visible: false, targets: [ successIndex, curatorIndex ] },
      { orderable: false, targets: [ 0, contributorsColCount - 1 ] },
      { width: '5%', targets: 0 },
      { width: '30%', targets: 1 },
      { width: '0%', targets: 2 },  // success
      { width: '30%', targets: 3 },
      { width: '0%', targets: 4 },  // curator
      { width: '25%', targets: 5 },
      { width: '10%', targets: 6 }
    ],
    drawCallback: function (settings) {
      var api = this.api();
      var rows = api.rows( { page:'current' } ).nodes();
      var last = null;
      api.column(successIndex, { page: 'current' }).data().each(function (group, i) {
        if (last !== group) {
          // subtract two rows - success and curator
          $(rows).eq(i).before(
            '<tr class="group"><td colspan="' + (contributorsColCount - 2).toString() + '">' + group + '</td></tr>'
          );
          last = group;
        }
      });
    },
    initComplete: function (settings, json) {
      var $table = $('#contributors-table_wrapper'),
          template = _.template( $('#contributors-table-header-template').html() );
      // remove default search field.  Disabling via options also disables api, so can't do that
      $table.children('.row:first-child').remove();
      $table.prepend(
        template({
          currentUser: app.current_user,
          curators: app.company.curators,
          selectWidth: 250
        })
      );
      $table.find('.curator-select').select2({
        theme: 'bootstrap',
        width: 'style',
        minimumResultsForSearch: -1   // hides text input
      });
      // select2 is inserting an empty <option> for some reason
      $table.find('.curator-select > option').not('[value]').remove();
      $('#contributors-filter').select2({
        theme: 'bootstrap',
        width: 'style'
        // placeholder: 'type or select'
        // allowClear: true
      });
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