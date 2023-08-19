export function newContributionPath(customerWinId, params) {
  return `/successes/${customerWinId || '0'}/contributions/new${params.size > 0 ? `?${params}` : ''}`;
}

export function tableConfig(workflowStage = 'prospect') {
  const colIndices = {
    contributor: 1,
    success: 2,
    invitationTemplate: 3,
    curator: 4,
    customer: 5,
    status: 6,
    actions: 7,
    storyPublished: 8
  };
  return {
    data: CSP.contributions,
    // select: true,  // https://datatables.net/extensions/select/
    
    language: {
      emptyTable: 'No Contributors found',
      zeroRecords: 'No Contributors found'
    },
    
    order: [[colIndices.customer, 'asc'], [colIndices.success, 'asc'], [colIndices.contributor, 'desc']],

    columns: [
      {
        name: 'childRow',
        data: 'success.id',
        render: (data, type, row) => `
          <button type="button" class="btn">
            <i class="fa fa-caret-right"></i>
            <i class="fa fa-caret-down"></i>
          </button>
        `,
        createdCell: (td) => td.classList.add('toggle-child')
      },
      {
        name: 'contributor',
        data: {
          _: (row, type, set, meta) => ({
            id: row.contributor.id,
            fullName: row.contributor.full_name,
            contributionId: row.id,
            curatorId: row.success.curator.id
          }),
          display: 'contributor.full_name',
          filter: 'contributor.id',
          sort: 'timestamp'  // contribution.created_at
        },
      },
      {
        name: 'success',
        defaultContent: 'Customer Win',
        data: {
          _: (row, type, set, meta) => ({ id: row.success.id, name: row.success.name }),
          filter: 'success.id',
          sort: 'success.name'
        }
      },
      // <td data-search="t<%#= contribution.invitation_template_id  %>" class='invitation-template'>
      {
        name: 'invitation_template',
        data: {
          _: 'invitation_template.id',
          display: 'invitation_template.name'
        },
        defaultContent: '<span class="placeholder">Select</span>',
        createdCell: (td) => td.classList.add('invitation-template')
      },

      {  // <td data-search="<%= contribution.success.curator.id %>"></td>
        name: 'curator',
        data: {
          _: (row, type, set, meta) => ({ id: row.success.curator.id, fullName: row.success.curator.full_name }),
          filter: 'success.curator.id'
        }
      },      // curator
       // <td data-search="c<%= contribution.customer.id %>"><%= contribution.customer.name %></td>
      {
        name: 'customer',
        data: {
          _: (row, type, set, meta) => ({ id: row.success.customer.id, name: row.success.customer.name }),
          filter: 'success.customer.id',
          sort: 'success.customer.name'
        },
        // orderData: [[colIndices.customer, 'asc'], [colIndices.success, 'asc'], [colIndices.contributor, 'desc']]
      },
      {
        name: 'status',
        data: {
          _: 'status',
          display: 'display_status'
        },
        createdCell: (td) => td.classList.add('status')
      },
      {
        // data is status as this will determine actions available
        data: 'status',
        render: (data, type, row, meta) => '',
        createdCell: (td) => {
          td.classList.add('dropdown');
          td.setAttribute('data-controller', 'actions-dropdown');
          td.setAttribute('data-contribution-target', 'actionsDropdown');
        }
      },
      {
        name: 'storyPublished',
        data: 'success.story.published',
        defaultContent: 'false'
      },
    ],

    columnDefs: [
      {
        targets: [colIndices.success, colIndices.curator, colIndices.customer, colIndices.storyPublished],
        visible: false
      },
      {
        targets: [0, colIndices.actions],
        orderable: false,
      },
      {
        targets: [colIndices.actions],
        searchable: false,
      },
      { targets: [colIndices.success, colIndices.curator, colIndices.customer, colIndices.storyPublished], width: '0%' },
      { targets: 0, width: '5%' },
      { targets: [colIndices.contributor, colIndices.invitationTemplate], width: '33%' },
      { targets: colIndices.status, width: '22%' },
      { targets: colIndices.actions, width: '8%' }
    ],

    rowGroup: workflowStage === 'curate' ? null : { dataSrc: 'success.name', startRender: rowGroupTemplate },

    createdRow: (row, data, index) => {
      // const isPreInvite = data.status === 'pre_request';
      // const didNotRespond = data.status === 'did_not_respond';
      // $(row)
      //   .attr('data-contribution-id', data.id)
      //   .attr('data-success-id', data.success.id)
      //   .attr('data-contributor-id', data.contributor.id)
      //   .children()
      //     .eq(0).addClass('toggle-contributor-child').end()
      //     .eq(1).addClass('contributor').end()
      //     .eq(2)
      //       .addClass('invitation-template')
      //       .addClass(isPreInvite || didNotRespond ? '' : 'disabled')
      //       .append(isPreInvite || didNotRespond ? '<i class="fa fa-caret-down"></i>' : '')
      //       .end()
      //     .eq(3).addClass('status').end()
      //     .eq(4).addClass('actions dropdown')

      const { id, status, contributor, invitation_template: invitationTemplate, success: customerWin } = data;
      row.setAttribute('data-controller', 'contribution');
      row.setAttribute('data-contribution-contributors-outlet', '#contributors')
      row.setAttribute(
        'data-contribution-row-data-value', JSON.stringify({ id, status, contributor, invitationTemplate, customerWin })
      );
      row.setAttribute('data-datatable-target', 'row');
    }
  }
}

function rowGroupTemplate(groupRows, successName) {
  // console.log(successName + ': ', groupRows);
  // customer and story (if exists) data same for all rows, so just look at [0]th row
  const customerWin = groupRows.data()[0].success;
  const story = customerWin.story;
  const storySlug = story && story.slug;
  const storyTitle = story && story.title;
  const storyPath = story && (story.published ? story.csp_story_path : `/curate/${customerWin.customer.slug}/${storySlug}`);
  return $('<tr/>').append(`
    <td colspan="5">
      <span>${customerWin.customer.name}</span>
      <span class="emdash">&nbsp;&nbsp;&#8211;&nbsp;&nbsp;</span>
      ${story ? 
        `<a href="${storyPath}" id="contributors-row-group-link-story-${story.id}">${storyTitle}</a>` :
        `<a href="javascript:;" id="contributors-row-group-link-cw-${customerWin.id}">${successName}</a>`
      }
    </td>
  `);
}