
function templateActionsListeners () {

  var restoreTemplates = function (templates) {
    var templateIds = templates.map(function (t) { return t.id; });
    $.ajax({
      // pass array of template ids to the route
      url: '/companies/' + CSP.company.id + '/invitation_templates/' + JSON.stringify(templateIds),
      method: 'put',
      data: {
        restore: true,
        template_ids: templateIds,
        needs_refresh: templateIds.indexOf($('select.invitation-template').select2('data')[0].id) !== -1
      },
      dataType: 'script'
    });
  };

  $(document)

    .on('click', 'button.new-template, button.copy-template', function () {
      $('.submission-footer--invitation-template').removeClass('show');
      if ($(this).hasClass('copy-template')) {
        sourceTemplateId = $('select.invitation-template').val();
      } else {
        sourceTemplateId = undefined;
      }
      $.ajax({
        url: '/companies/' + CSP.company.id + '/invitation_templates/new',
        method: 'get',
        data: { source_template_id: sourceTemplateId },
        dataType: 'html'
      })
        .done(function (html, status, xhr) {

          $.when($('#invitation-template-container').empty().append(html))
            .then(function () {
              initInvitationEditor();
              $('select.contributor-questions')
                .select2({
                  theme: 'bootstrap',
                  placeholder: 'Add a Question'
                });
              $('#invitation-template-form input[id="invitation_template_name"]')[0].focus();
              // reset select to placeholder
              $('select.invitation-template').val('').trigger('change.select2');
              $('.submission-footer--invitation-template p').empty().append('New template');
              $('.submission-footer--invitation-template').find('button').css('width', '135px').find('span').text('Create template');
              $('.submission-footer--invitation-template').addClass('show');
            });
        });
    })

    .on('click', 'button.delete-template', function () {
      var deleteTemplateId = $('select.invitation-template').select2('data')[0].id;
      bootbox.confirm({
        size: 'small',
        className: 'confirm-delete-template',
        closeButton: false,
        message: "<i class='fa fa-warning'></i>\xa0\xa0\xa0<span>Are you sure?</span>",
        buttons: {
          confirm: {
            label: 'Delete',
            className: 'btn-danger'
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-default'
          }
        },
        callback: function (confirmDelete) {
          if (confirmDelete) {
            $.ajax({
              url: '/companies/' + CSP.company.id + '/invitation_templates/' + deleteTemplateId,
              method: 'delete',
              dataType: 'script'
            });
          }
        }
      });
    })

    .on('click', 'button.restore-template', function () {
      // removed 'restore-selected' and 'restore-all'
      var $action = $(this),
          $select = $('select.invitation-template'),
          templates = [],
          confirmMesg = '<p>This action will restore the following invitation templates to factory default content</p>';

      // the if block will always execute
      if ($action.hasClass('restore-template')) {
        templates = [ { id: $select.val(), name: $select.find('option:selected').text() } ];
      }
      else {
        templates = $.map(
          $select.find('optgroup[label="Defaults"] option'), function (option) {
            return { id: option.value, name: option.label };
          }
        );
      }
      bootbox.confirm({
        className: 'confirm-restore',
        closeButton: false,
        title: "<i class='fa fa-question-circle-o'></i>\xa0\xa0\xa0<span>Confirm</span>",
        message: confirmMesg + '<ul><li>' + templates.map(function (t) { return t.name; }).join('</li><li>') + '</li></ul>',
        buttons: {
          confirm: {
            label: 'Restore',
            className: 'btn-secondary'
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-default'
          }
        },
        callback: function (confirmRestore) {
          if (confirmRestore) { restoreTemplates(templates); }
        }
      });
    });

}