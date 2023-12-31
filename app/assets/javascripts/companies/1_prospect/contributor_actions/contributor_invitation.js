
function contributorInvitationListeners() {

  var invitation,  // { contributor: ..., subject: ..., body: ... }
      contributionPath = function (contributionId) {
        return '/contributions/' + contributionId;
      },
      missingCuratorInfo = function () {
        return ['first_name', 'last_name', 'photo', 'phone', 'title']
          .filter(function (item) {
            return CSP.current_user[item] === '' ;
          });
      },
      showInvitation = function (invitation, type) { // type is 'send' or 'readonly'
        // things go haywire if a different selector is used, e.g. $('textarea')
        var $modal = $('#contribution-request-modal'),
            $editor = $modal.find("[data-provider='summernote']");
            formattedDate = function (date) {
              return moment(date).calendar(null, {
                sameDay: '[today]',
                lastDay: '[yesterday]',
                lastWeek: '['+ moment(date).fromNow() +']',
                sameElse: 'M/DD/YY'
              }).split('at')[0];
            };

        $modal.one('hidden.bs.modal', function () {
          $(this).find('#to-contributor, .modal-body, .modal-footer').css('visibility', 'hidden');
        });

        $modal.one('shown.bs.modal', function () {
          // send or readonly
          $modal.find('.modal-content').addClass(type);
          if (type === 'send') {
            $modal.find('.modal-content').removeClass('readonly');
          } else {
            $modal.find('.modal-content').removeClass('send');
          }
          $modal
            // set the readonly title (null is ok; formattedDate returns "Invalid")
            .find('.readonly.modal-title span:last-child').text(formattedDate(invitation.sent_at)).end()
            // set the path
            .find('form').attr('action', contributionPath(invitation.contributionId)).end()
            // recipient
            .find('#to-contributor span:last-child')
              .html(invitation.contributor.full_name + '&nbsp;&nbsp;' + '&lt' + invitation.contributor.email + '&gt')
              .end()
            // request subject
            .find('[name="contribution[request_subject]"]')
              .val(invitation.subject)
              .attr('readonly', type === 'readonly' ? true : false);
          // request body
          $editor.summernote('code', invitation.body);
          $editor.summernote(type === 'readonly' ? 'disable' : 'enable');
          $modal
            .find('.submit-link').attr('contenteditable', 'false').end()
            .find('#to-contributor, .modal-body, .modal-footer').css('visibility', 'visible');
        });
        $modal.modal('show');
      },
      getInvitation = function (contributionId, type) {
        $.ajax({
          url: contributionPath(contributionId),
          method: 'get',
          data: {
            get_invitation: true,
            send: type == 'send' ? true : false
          },
          dataType: 'json',
        })
          .done(function (contribution, status, xhr) {
            invitation = {
              contributionId: contribution.id,
              subject: contribution.request_subject,
              body: contribution.request_body,
              contributor: {
                full_name: contribution.contributor.full_name,
                email: contribution.contributor.email
              },
              sent_at: contribution.request_sent_at
            };
            showInvitation(invitation, type);
          });
      },
      modifyLinkDialog = function () {
        $('.link-dialog .note-link-url').prop('disabled', true);
        $('.link-dialog input[type="checkbox"]').prop('checked', true);
        $('.link-dialog input[type="checkbox"]').prop('disabled', true);
        $('.link-dialog .note-link-btn').removeClass('btn-primary').addClass('btn-success');  // for stying
      };

  $(document)
    .on('click', '.contributor-actions .compose-invitation', function (e) {
      if ($(this).hasClass('disabled')) {
        return false;
      }
      else if (missingCuratorInfo().length > 0) {
        flashDisplay("Can't send email because the following Curator fields are missing: "  +
          missingCuratorInfo().join(', '), 'danger');
        return false;
      } else {
        var contributionId = $(this).closest('tr').data('contribution-id');
        getInvitation(contributionId, 'send');
      }

    })
    .on('click', '.contributor-actions .re-send-invitation', function () {
      var contributionId = $(this).closest('tr').data('contribution-id');

      if (missingCuratorInfo().length > 0) {
        flashDisplay("Can't send email because the following Curator fields are missing: "  +
          missingCuratorInfo().join(', '), 'danger');
        return false;

      } else {
        getInvitation(contributionId, 'send');
      }

    })
    .on('click', '.contributor-actions .view-request, td.invitation-template.view-request a',
      function () {
        var contributionId = $(this).closest('tr').data('contribution-id');
        getInvitation(contributionId, 'readonly');
      }
    )

    /**
     * don't allow submit on hitting enter from subject input
     * ref https://stackoverflow.com/questions/895171
     */
    .on('keypress', '#contribution-request-form :input:not(textarea):not([type="submit"])', function (e) {
      return e.keyCode != 13;
    })

    // scroll can't be adjusted while the modal is hidden
    .on('hide.bs.modal', '#contribution-request-modal', function () {
      // there are a bunch of modals within the summernote editor, hence indexing
      $(this).find('.modal-body').eq(0).scrollTop(0);
    })
    .on('hidden.bs.modal', '#contribution-request-modal', function () {
      $('#contribution-request-form').data('submitted', '');
      $('button[type="submit"][form="contribution-request-form"] span').css('display', 'inline');
      $('button[type="submit"][form="contribution-request-form"] i').css('display', 'none');
    })
    // keep link dialog modifications limited to contribution request
    .on('shown.bs.modal', '#contribution-request-modal', function () {
      $(document).on('shown.bs.modal', '.link-dialog', modifyLinkDialog);
    })
    .on('hidden.bs.modal', '#contribution-request-modal', function () {
      $(document).off('shown.bs.modal', '.link-dialog', modifyLinkDialog);
    })
    // when link dialog closes, add .modal-open to body, else scroll will affect body instead of modal
    .on('hidden.bs.modal', function () {
      if ($('#contribution-request-modal').hasClass('in')) {
        $('body').addClass('modal-open');
      }
    });

}