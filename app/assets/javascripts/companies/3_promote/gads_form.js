
function promoteSettingsListeners () {

  let imageTimer, inputObserver;

  // the data-validate attribute is to prevent premature validation (per bootstrap-validator)
  const imageDidLoad = ($imageCard, $img) => {
    if ($img[0].complete) {
      clearInterval(imageTimer);
      console.log('image did load')
      $imageCard
        .addClass($imageCard.is('.gads-default') ? 'ad-image-card--new' : '')
        .find('input:file').attr('data-validate', 'true');
      $('#gads-form').validator('update').validator('validate');
      return true;
    }
  };

  // const isPrematureSuccess = ($formGroup, mutation) => {
  //   const isImageSuccess = (
  //     $(mutation.target).is($formGroup) &&
  //     mutation.type === 'attributes' &&
  //     mutation.attributeName === 'class' &&
  //     $(mutation.target).is('.has-success')
  //   );
  //   // const isPremature = !($(mutation.target).is('.to-be-added'));
  //   return isImageSuccess && isPremature;
  // };

  const isSuccessfulUpload = ($formGroup, $urlInput, mutation) => (
    $(mutation.target).is($urlInput) &&
    mutation.type === 'attributes' &&
    mutation.attributeName === 'value' &&
    $formGroup.is(':not(.has-error)')
  );
      
  const handleS3Upload = ($imageCard) => {
    console.log('handleS3Upload()')
    const $img = $imageCard.find('img');
    const $formGroup = $imageCard.find('.form-group');
    const $urlInput = $imageCard.children('input[name*="[image_url]"]');
    // const formGroupObserver = new MutationObserver(mutations => {
    //   // jasny bootstrap is prematurely adding the has-success class;
    //   // remove and add manually pending successful validation
    //   mutations.forEach(m => {
    //     if (isPrematureSuccess($formGroup, m)) $formGroup.removeClass('has-success');
    //   });
    // });
    inputObserver = new MutationObserver((mutations) => {
      for (m of mutations) {
        if (isSuccessfulUpload($formGroup, $urlInput, m)) {
          inputObserver.disconnect();
          console.log('isSuccessfulUpload', $urlInput.val())
          // formGroupObserver.disconnect();

          if ($imageCard.is('.gads-default.has-image')) {
            const $idInput = $imageCard.children('input[name*="[id]"]');
            const prevDefaultId = $idInput.val();
            keepPreviousDefault(prevDefaultId);
            $idInput.val('');
          }

          // pre-load the image so it will be in browsder cache when response arrives (no flicker)
          $formGroup.find('img')
            .one('load', () => $formGroup.find('.btn-success').trigger('click'))
            .attr('src', $urlInput.val());
          break;
        }
      };
    });
    // formGroupObserver.observe($formGroup[0], { attributes: true });
    inputObserver.observe($urlInput[0], { attributes: true });
    if (!imageDidLoad($imageCard, $img)) imageTimer = setInterval(imageDidLoad, 100, $imageCard, $img);
  };

  const keepPreviousDefault = (id) => {
    const $form = $('#gads-form');
    const i = $form.find('.ad-image-card').length;
    $form.append(`
      <input type="hidden" name="company[adwords_images_attributes][${i}][id]" value="${id}">
      <input type="hidden" name="company[adwords_images_attributes][${i}][default]" value="false">
      <input class="hidden" type="checkbox" name="company[adwords_images_attributes][${i}][default]" value="true">
    `);
  };

  const confirmImageRemoval = ($imageCard, affectedStories) => {
    bootbox.confirm({
      className: 'confirm-ad-image-removal',
      closeButton: false,
      title: '<i class="fa fa-warning"></i>\xa0\xa0\xa0\xa0<span>Are you sure?</span>',
      message: `
        <p>The selected image is utilized in these Promoted Stories:<p>
        <ul style="margin: 25px 0">
          ${affectedStories.reduce((listItems, storyTitle) => {
            return `${listItems}<li>${storyTitle}</li>`
          })}
        </ul>
        <p>You can remove the image and it will be replaced by the current default image of the same type (square or landscape).\ 
        The Promoted Stories will be updated to include the replacement image and no further action will be required.</p>
      `,
      buttons: {
        confirm: {
          label: 'Remove & Replace',
          className: 'btn-danger',
          callback: function () {
            // => button callbacks can't be overridden (per bootbox docs)
          }
        },
        cancel: {
          label: 'Cancel',
          className: 'btn-default'
        }
      },
      callback: function (confirmRemoval) {
        if (confirmRemoval) {
          $(this)
            .find('[data-bb-handler="confirm"]')
            .css('width', $(this).find('[data-bb-handler="confirm"]').css('width'))
            .html('<i class="fa fa-spin fa-circle-o-notch"></i>');
          $imageCard
            .find('input:checkbox[name*="_destroy"]').prop('checked', true).end()
            .find('button:submit.btn-danger').trigger('click');
          return false;  // don't close the modal yet => wait for server response
        }
      }
    });
  };
            
  $(document)
    .on('input', '[name="company[adwords_short_headline]"]', (e) => {
      const btn = e.target.nextElementSibling;
      if (e.target.checkValidity()) {
        btn.classList.remove('hidden');
      } else {
        btn.classList.add('hidden');
      }
    })

    .on('show.bs.tab', '.image-library__collection a[data-toggle="tab"]', (e) => {
      const btnGroup = e.target.parentElement;
      for (link of btnGroup.children) link.classList.toggle('active');
    })

    .on('click', '.image-library .add-image, .image-library .add-logo', (e) => {
      const collection = $(e.currentTarget).hasClass('add-logo') ? 'logos' : 'images';
      $(`.image-library__all-${collection}`)
        .children('.ad-image-card--new').find('input:file').trigger('click');
    })

    .on('change.bs.fileinput', '.ad-image-card', (e) => {
      if ($(e.target).is('.fileinput')) {
        console.log('change.bs.fileinput')
        handleS3Upload($(e.currentTarget));
      }
    })

    // why doesn't this fire?
    .on('validated.bs.validator', '#gads-form', (e) => {
      console.log('validated.bs.validator')
      const $input = $(e.relatedTarget)
      if ($input.is('input:file:not([data-default-type])')) {
        $input.closest('.ad-image-card--new').removeClass('hidden');
      }
    })

    .on('valid.bs.validator', '#gads-form', (e) => {
      const $input = $(e.relatedTarget);
      const isNewImage = $input.is(':file') && $input.val();
      if (isNewImage) {
        console.log('valid.bs.validator', e)
        initS3Upload($(e.currentTarget), $input);

        // Change event on the input will trigger the s3 upload
        // => stop the event propagation so that the upload handler does not re-execute
        $input.closest('.ad-image-card').one('change.bs.fileinput', () => false);
        $input.trigger('change');
      }
    })

    .on('invalid.bs.validator', '#gads-form', (e) => {
      const $input = $(e.relatedTarget);
      console.log('invalid.bs.validator', e.relatedTarget, e.detail)
      inputObserver.disconnect();
      // if ($input.is(':file')) {
      //   $input.closest('.ad-image-card').removeClass('ad-image-card--uploading');
      // }
    })

    .on('click', '.set-as-default', (e) => (
      $(e.currentTarget).closest('.ad-image-card').find('input:checkbox[name*="[default]"]')
        .click()
    ))

    .on('change', '.ad-image-card:not(.gads-default) input:checkbox[name*="[default]"]', (e) => {
      const $input = $(e.target);
      const cardClassName = $input.closest('.ad-image-card').prop('class')
        .match(/(gads-image|gads-logo)--(square|landscape)/)[0];
      const toggleExistingDefault = (isChecked) => (
        $(`.${cardClassName}.gads-default`)
          .find('input:checkbox[name*="[default]"]')
            .prop('checked', isChecked)
      );
      const toggleOtherInputs = () => (
        $(`.${cardClassName}:not(.gads-default) input:checkbox[name*="[default]"]`).not($input)
          .each((i, _input) => (
            $(_input).prop('checked', false).nextAll('.form-group').removeClass('to-be-default')
          ))
      );
      $input.nextAll('.form-group').toggleClass('to-be-default');
      if ($input.prop('checked')) {
        toggleExistingDefault(false);
        toggleOtherInputs();
      } else {
        toggleExistingDefault(true);
      }
    })

    .on('click', '.ad-image-card .btn-remove', function () {
      const $imageCard = $(this).closest('.ad-image-card');
      if ($imageCard.is('.ad-image-card--new')) {
        // reset the new image card...
        $imageCard
          .addClass('hidden gads-image')    // TODO make this work for logos too
          .children('.fileinput')
            .removeClass('has-error has-danger')
            .fileinput('reset')
            .find('input:file').attr('data-validate', 'false');
        $('#gads-form').validator('update');
        return false;
      }
      const dt = $('#promoted-stories-table').DataTable();
      const imageToRemove = { 
        id: $imageCard.find('[name*="[id]"]').val(),
        type: $imageCard.find('[name*="[type]"]').val()
      };
      if (!imageToRemove.id) return $imageCard.remove();
      const affectedStories = (
        ['SquareImage', 'LandscapeImage'].includes(imageToRemove.type) &&
        dt
          .rows((index, data, node) => (
            data.ads_images.some((image) => image.id == imageToRemove.id) &&
            // only need to update ads if this is the only required image of its type
            data.ads_images.filter((image) => image.type === imageToRemove.type).length === 1
          ))
          .data().toArray().map((row) => row.ads_long_headline)
      );
      if (affectedStories?.length) {
        confirmImageRemoval($imageCard, affectedStories);
      } else {
        $imageCard
          .find('input:checkbox[name*="_destroy"]').prop('checked', true).end()
          .find('.form-group').addClass('to-be-removed');
      }
    })

    // TODO don't allow .btn-cancel to be clicked while submitting form
    .on('click', '#gads-form .btn-cancel', (e) => {
      const $imageCard = $(e.currentTarget).closest('.ad-image-card');
      const $formGroup = $imageCard.children('.form-group');
      if ($formGroup.is('.to-be-default') || $formGroup.is('.to-be-removed')) {
        $imageCard.find('input:checkbox').prop('checked', false).trigger('change');
        $formGroup.removeClass('to-be-default to-be-removed');
      }
    })

    // .on('rails.submit', '#gads-form', (e) => console.log(e))

    .on('click', '#gads-form button:submit', (e) => {
      e.preventDefault();
      const $submitBtn = $(e.currentTarget);
      const $form = $($submitBtn.prop('form'));
      const $formGroup = $submitBtn.closest('.form-group');
      const $imageCard = $formGroup.closest('.ad-image-card');
      const cardClassName = $imageCard.length && (
        $imageCard.prop('class').match(/(gads-image|gads-logo)--(square|landscape)/)[0]
      );
      const $defaultImageCard = $(`.ad-image-card.gads-default.${cardClassName || 'foo'}`);
      const defaultImageIsPresent = $defaultImageCard.children('input[name*="[id]"]').val();
      const $companyInputs = $form.find('input').filter((i, input) => (
        $(input).prop('name').includes('company[')
      ));
      const isInactiveInput = (input) => {
        const isFileInput = $(input).parent().is('.btn-file');
        const isReplacedDefaultInput = $(input).parent().is($form);
        const isSwappedDefaultInput = (
          defaultImageIsPresent && 
          $defaultImageCard.find(input).length &&
          $imageCard.find('.to-be-default').length
        );
        const isOtherImage = $imageCard && !$imageCard.find(input).length;
        const isOtherFormGroup = !$imageCard && !$formGroup.find(input).length;
        const isPrevDefaultInput = isReplacedDefaultInput || isSwappedDefaultInput;
        return isFileInput || ((isOtherImage || isOtherFormGroup) && !isPrevDefaultInput);
      };
      const disableInactiveInputs = (i, input) => {
        $companyInputs.each((i, input) => { input.disabled = isInactiveInput(input) });
      };
      const reEnableInputs = () => $companyInputs.each((i, input) => { input.disabled = false });
      disableInactiveInputs();
      
      // console.log('form inputs', decodeURIComponent($form.serialize()).split('&'));
      console.log('form inputs before submit', $form.serializeArray())

      $imageCard.addClass('ad-image-card--saving');
      $form.trigger('submit');
      reEnableInputs();
      if ($formGroup.is('.to-be-removed')) $imageCard.remove();
    })
}