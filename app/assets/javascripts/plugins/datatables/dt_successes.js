
function initSuccessesTable (dtSuccessesInit) {

  var successIndex = 1, customerIndex = 2, curatorIndex = 3,
      successContactIndex = 4, storyIndex = 5, actionsIndex = 6;

  $('#successes-table').DataTable({
    ajax: {
      url: '/successes',
      dataSrc: ''
    },
    dom: 'tip',
    pageLength: 100,
    language: {
      emptyTable: 'No Story Candidates found',
      zeroRecords: 'No Story Candidates found'
    },
    order: [[ customerIndex, 'asc' ]],
    columns: [
      {
        data: null,
        render: function (data, type, row) {
            return "<i class='fa fa-caret-right'></i>" +
                   "<i class='fa fa-caret-down' style='display:none'></i>";
          }
      },
      {
        name: 'success',
        data: {
          _: function (row, type, set, meta) {
            return {
              id: row.id,
              name: row.name,
              curatorId: row.curator.id,
              customerId: row.customer.id
            };
          },
          display: 'name',
          filter: 'name'
        },
      },
      {
        name: 'customer',
        data: {
          _: function (row, type, set, meta) {
            return { id: row.customer.id, name: row.customer.name };
          },
          display: 'customer.name'
        }
      },
      {  // curator
        name: 'curator',
        data: {
          _: 'curator.full_name',
          filter: 'curator.id'
        }
      },
      // using curator as placeholder for real successContact data
      {
        name: 'curator',
        data: {
          _: 'curator',
          display: function (row, type, set, meta) {
            return '';
          }
        }
      },
      {
        name: 'story',
        data: {
          _: function (row, type, set, meta) {
            return row.story && { id: row.story.id, title: row.story.title };
          }
        },
        defaultContent: 'false'
      },
      {  // td.dropdown.actions-dropdown
        data: 'contributions_count',
        render: function (data, type, row, meta) {
                  return _.template(
                            $('#success-actions-dropdown-template').html()
                          )({ contributionsCount: data });
                }
      }
    ],
    columnDefs: [
      { visible: false, targets: [customerIndex, curatorIndex, storyIndex] },
      {
        targets: [0, actionsIndex],
        orderable: false,
        searchable: false,
        createdCell: function (td, cellData, rowData, row, col) {
          if (col === 0) {
            $(td).addClass('success-details');
          } else {
            $(td).addClass('dropdown actions-dropdown');
          }
        }
      },
      { width: '0%', targets: [customerIndex, curatorIndex, storyIndex] },  // hidden
      { width: '5%', targets: 0 },
      { width: '50%', targets: successIndex },
      { width: '35%', targets: successContactIndex },
      { width: '10%', targets: actionsIndex }
    ],
    rowGroup: {
      dataSrc: 'customer.name',
      startRender: function (groupRows, successName) {
        // console.log($(this))   //  [RowGroup]
        return $('<tr/>').append(
                  '<td colspan="4">' +
                     '<span style="font-weight:600">' +
                        groupRows.data()[0].customer.name +
                     '</span>' +
                  '</td>');
      }
    },
    createdRow: function (row, data, index) {
      $(row).attr('data-customer-id', data.customer.id);
      $(row).attr('data-success-id', data.id);
    },
    initComplete: function (settings, json) {

      var $table = $(this),
          $tableWrapper = $table.closest('[id*="table_wrapper"]');

      // remove default search field.  Disabling via options also disables api, so can't do that
      $tableWrapper.children('.row:first-child').remove();

      $tableWrapper.prepend(
        _.template( $('#successes-table-header-template').html() )({
          currentUser: app.current_user,
          curators: app.company.curators,
          selectWidth: 250
        })
      );

      // trigger curator select and show tables
      dtSuccessesInit.resolve();

    }
  });
}