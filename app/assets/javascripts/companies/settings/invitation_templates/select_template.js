
function selectTemplateListeners () {
  var previousTemplateId, // keep track of previous selection in case a change is canceled
      initTemplate = function () {
        initInvitationEditor();
        $('select.contributor-questions')
          // .prepend('<option selected/>')  // empty option for placeholder
          .select2({
            theme: 'bootstrap',
            placeholder: 'Add a Question'
          });
      },
      toggleButtons = function (isDefault) {
        $('button.copy-template').prop('disabled', false);

        // restore current template only applies to defaults
        if (isDefault) {
          $('button.restore-template').prop('disabled', false);
          $('button.delete-template').prop('disabled', true);
        } else {
          $('button.restore-template').prop('disabled', true);
          $('button.delete-template').prop('disabled', false);
        }
      },
      selectTemplate = function ($select, templateId) {
        // new selection (now that we're past confirmation)
        $select.val(templateId).trigger('change.select2');

        var isDefault = $select.find('option:selected').closest('optgroup')
                            .attr('label') == 'Defaults' ? true : false,
            initFormControls = function () {
              setTimeout(function () {
                var $form = $('#invitation-template-form'),
                    $button = $('button[type="submit"][form="invitation-template-form"]'),
                    isNewTemplate = $form.find('input[name="_method"][value="put"]').length === 0,
                    $submissionFooter = $('.submission-footer--invitation-template');
                $submissionFooter.find('p').empty();
                if (isNewTemplate) {
                  $button.css('width', '135px').find('span').text('Create template');
                  $submissionFooter.find('p').append('New template');
                } else {
                  $button.css('width', '114px').find('span').text('Save changes');
                  $submissionFooter.find('p').append(
                    'Template:\xa0\xa0' + $('select.invitation-template').find('option:selected').text()
                  );
                }
                $submissionFooter.addClass('show');
              }, 200);
            };

        // new template
        if ($select.val() === '0') {
          // reset select to placeholder
          $select.val('').trigger('change.select2');
          $('.btn-toolbar button.new-template').trigger('click');
          initFormControls();
          return;
        }

        $('.btn-toolbar button').prop('disabled', true);

        $.ajax({
          url: '/companies/' + CSP.company.id + '/invitation_templates/' + $select.val() + '/edit',
          method: 'get',
          data: {
            // was this template just created? (if undefined nothing will be sent)
            new_template: $('#invitation-template-form').data('new')
          },
          dataType: 'html'
        })
          .done(function (html, status, xhr) {
            if ($('button[type="submit"][form="invitation-template-form"]').find('span').css('display') === 'none') {
              $('button[type="submit"][form="invitation-template-form"]').find('span, .fa-spin').toggle();
            }
            $.when($('#invitation-template-container').empty().append(html))
              .then(function () {
                $('#invitation-template-form').data('new', '');
                $('#edit-crowdsource .btn-toolbar button').prop('disabled', false);
                toggleButtons(isDefault);
                initTemplate();
                initFormControls();
                previousTemplateId = templateId;
              });
          });
      };

  $(document)
    .on('focus', 'select.invitation-template', function () {
      previousTemplateId = $(this).val();
    })

    .on('change', 'select.invitation-template', function () {
      var $select = $(this);
      // keep the existing selection in place pending confirmation
      var templateId = $select.val();

      $('.submission-footer--invitation-template').removeClass('show');
      // why is the timeout necessary??
      // setTimeout(function () { $('.submission-footer--invitation-template').removeClass('show'); }, 0);
      $select.val(previousTemplateId).trigger('change.select2');

      if ( $('#invitation-template-form').data('dirty') ) {
        bootbox.confirm({
          size: 'small',
          className: 'confirm-unsaved-changes',
          closeButton: false,
          message: "<i class='fa fa-warning'></i>\xa0\xa0\xa0<span>Unsaved changes will be lost</span>",
          buttons: {
            confirm: {
              label: 'Continue',
              className: 'btn-default'
            },
            cancel: {
              label: 'Cancel',
              className: 'btn-default'
            }
          },
          callback: function (continueWithoutSave) {
            if (continueWithoutSave) { selectTemplate($select, templateId); }
          }
        });
      } else {
        selectTemplate($select, templateId);
      }
    });
}

