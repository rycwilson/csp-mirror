//= require ./contributor_invitation

function contributorActionsListeners () {
  $(document)
    .on('click', '[id*="contributors-table"] .view-contribution', showContribution)
    .on('click', '.contributor-actions .view-success', showSuccess)
    .on('click', '.contributor-actions [class^="story-"]', (e) => {
      e.preventDefault();
      Cookies.set('csp-edit-story-tab', `#${e.currentTarget.classList[0]}`);
      window.location = e.currentTarget.querySelector('a').href;
    })
    .on('click', '.contributor-actions .completed', markAsCompleted)
    .on('click', '.contributor-actions .remove', confirmDelete);


  function showContribution(e) {
    const contributionId = e.target.closest('tr').dataset.contributionId;
    fetch(`/contributions/${contributionId}.json?get_submission=true`)
      .then(res => res.json())
      .then(contribution => {
        const modal = document.querySelector('.contributions-modal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
        for (const el of [modalTitle, modalBody]) el.replaceChildren();
        modalTitle.insertAdjacentHTML(
          'afterbegin', `Contribution &#8212; submitted ${formattedDate(contribution.submitted_at)}`
        );
        modalBody.insertAdjacentHTML('afterbegin', contributionTemplate(contribution));
        // setTimeout(() => $(modal).modal('show'));
        $(modal).modal('show')
      })
  }

  function showSuccess(e) {
    const successId = e.target.closest('tr').dataset.successId;
    const $successesFilter = $('#successes-filter')
    $successesFilter.val(`success-${successId}`).trigger('change');
      
    // Why doesn't this work? (Uncaught TypeError: instance[options] is not a function)
    // $('#successes-filter').select2('focus');
    $successesFilter.next('.select2').addClass('select2-container--focus');
    $(document)
      .one('click', () => $('#successes-filter').next().removeClass('select2-container--focus'))
      .one('shown.bs.tab', 'a[href="#successes"]', () => {
        scrollTo(0,0);
        console.log($('#successes-table').find(`tr[data-success-id="${successId}"]`))
        $('#successes-table').find(`tr[data-success-id="${successId}"] .toggle-child button`).trigger('click');
      });
    $('a[href="#successes"]').tab('show');
  }

  function markAsCompleted(e) {
    const table = e.target.closest('table');
    const otherTable = document.getElementById(
      `${table.id.includes('prospect') ? 'curate' : 'prospect'}-contributors-table`
    );
    const dt = $(table).DataTable();
    const dtOther = otherTable ? $(otherTable).DataTable() : null;
    const row = e.target.closest('tr');
    const rowData = dt.row(row).data();
    // const $tdStatus = $row.find('td.status');
    const newStatus = `${rowData.status.includes('contribution') ? 'contribution' : 'feedback'}_completed`;
    const csrfToken = document.querySelector('[name="csrf-token"]').content;
    fetch(`/contributions/${rowData.id}?completed=true`, { 
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify({ contribution: { status: newStatus } }) 
    })
      .then(res => res.json())
      .then(contribution => {
        for (const _dt of [dt, dtOther]) {
          if (_dt) _dt.row(`[data-contribution-id="${contribution.id}"]`).data(Object.assign({}, rowData, contribution));
        };
        //     $tdStatus.find('i').toggle();
        //     setTimeout(function () {
        //       $tdStatus.find('i').toggle();
        //     }, 2000);
        //     setTimeout(function () {
        //       if ( $('#show-completed').length &&
        //            $('#show-completed').prop('checked') === false ) {
        //         $('#show-completed').trigger('change');
        //       }
        //     }, 2200);
      })
  }

  function confirmDelete(e) {
    const contributionId = e.target.closest('tr').dataset.contributionId;
    bootbox.confirm({
      size: 'small',
      className: 'confirm-remove-contributor',
      closeButton: false,
      message: "<i class='fa fa-warning'></i>\xa0\xa0\xa0<span>Are you sure?</span>",
      buttons: {
        confirm: {
          label: 'Remove',
          className: 'btn-danger'
        },
        cancel: {
          label: 'Cancel',
          className: 'btn-default'
        }
      },
      callback: (confirmed) => { if (confirmed) deleteContribution(contributionId); }
    });
  }

  async function deleteContribution(contributionId) {
    const csrfToken = document.querySelector('[name="csrf-token"]').content;
    const response = await fetch(`/contributions/${contributionId}`, { 
      method: 'DELETE', 
      headers: {
        'X-CSRF-Token': csrfToken
      } 
    });
    await response.text();  // console will report that fetch failed if the empty body is not read
    if (response.ok) {
      $('#prospect-contributors-table, #curate-contributors-table').each((i, table) => {
        $(table).DataTable().row(`[data-contribution-id="${contributionId}"]`).remove().draw();
  
        // if this was the only contribution under a group, remove the group
        $(table).find('tr.group').each((i, rowGroup) => {
          if ($(rowGroup).next().is('tr.group')) $(rowGroup).remove();
        });
      });
    }
  }

  // see also contributionsTemplate in success_actions.js
  function contributionTemplate(contribution) {
    return `
      <section class="contribution">
        <div class="contribution__contributor">
          <p>${contribution.contributor.full_name}</p>
          <p>${contribution.contributor.title || '<span style="color:#D9534F">No job title specified</span>'}</p>
          <p>${contribution.customer.name}</p>
        </div>
        ${contribution.answers.length ? `
            <ul>
              ${contribution.answers.sort((a,b) => a.contributor_question_id - b.contributor_question_id).map(answer => `
                  <li>
                    <p>${answer.question.question}</p>
                    <p><em>${answer.answer}</em></p>
                  </li>
                `).join('')
              }
            </ul>
          ` : (
            contribution.contribution ?
              `<p><em>${contribution.contribution}</em></p>` :
              (contribution.feedback ? `<p><em>${contribution.feedback}</em></p>` : '')
          )
        }
      </section>
    `;
  }

  function formattedDate(date) {
    return moment(date).calendar(null, {
      sameDay: '[today]',
      lastDay: '[yesterday]',
      lastWeek: '['+ moment(date).fromNow() +']',
      sameElse: 'M/DD/YY'
    }).split('at')[0];
  }
}