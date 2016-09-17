
function storiesEditHandlers () {
  storiesEditSettingsHandlers();
  storiesEditVideoHandlers();
  storiesEditTagsHandlers();
  storiesEditNewContributorHandlers();
  storiesEditResultsHandlers();
  storiesEditPromptsHandlers();
  storiesEditContributionsHandlers();
}

function storiesEditInitBIP () {
  // best-in-place errors
  $(document).on('best_in_place:error', function (event, data, status, xhr) {
    var errors = JSON.parse(data.responseText);
    flashDisplay(errors.join(', '), "danger");
  });

  /*
    tabindex=-1 on these elements prevents them from gaining focus
    after a bip field is submitted (with tab)()
    also has the side-effect of keeping focus on the element,
    which we'll prevent with ...
  */
  $('a.accordion-toggle').on('focus', function () {
    var $_this = $(this);
    window.setTimeout(function () { $_this.blur(); }, 200);
  });
}

function storiesEditSettingsHandlers () {

  $('.bs-switch').on('switchChange.bootstrapSwitch', function (event, state) {
    $(this).parent().submit();
  });

  $('#story-publish-form').on('ajax:success', function (event, data) {
    var $publish = $("#story_published"),
        $logoPublish = $("#story_logo_published");
    /*
      server may have changed values to prevent invalid state ...
      it either ...
        - turned logo_publish on to track story_publish=on
        - turned story_publish off to track logo_publish=off
    */
    if (!data.published && $publish.bootstrapSwitch('state') === true) {
      $publish.bootstrapSwitch('state', false);
    } else if (data.logo_published && $logoPublish.bootstrapSwitch('state') === false) {
      $logoPublish.bootstrapSwitch('state', true);
    }
  });

  $('#approval-pdf-btn').on('click', function (e) {
    var missingInfo = $(this).data('missing-curator-info');
    if (missingInfo.length) {
      e.preventDefault();
      var flashMesg = "Can't generate document because the following Curator fields are missing: " + missingInfo.join(', ');
      flashDisplay(flashMesg, 'danger');
    }
  });

}

function storiesEditVideoHandlers () {

  var videoPlaceholderText = "Video URL (YouTube, Vimeo, or Wistia)";

  $(".best_in_place[data-bip-attribute='embed_url']").on("ajax:success",
    function (event, data) {
      var newUrl = JSON.parse(data).embed_url,
          $newVideo = null;

      if (!newUrl) {
        $newVideo = $("<img src='" + $('.video-container').data('placeholder') + "'>");
      } else if (newUrl.includes("youtube")) {
        $newVideo =
          "<iframe id='youtube-iframe' width='320' height='180' " +
            "src='" + newUrl + "?autohide=2&&enablejsapi=1&controls=0&showinfo=0&iv_load_policy=3&rel=0'" +
            "frameborder='0'></iframe>";

      } else if (newUrl.includes("vimeo")) {
        $newVideo =
          "<iframe id='vimeo-iframe' width='320' height='180' " +
            "src='" + newUrl + "' " +
            "frameborder='0'></iframe>";

      } else if (newUrl.includes("wistia")) {  // wistia
        // are wistia assets already defined?
        if (typeof Wistia === 'undefined') {
          $.getScript(newUrl);
          $.getScript('//fast.wistia.com/assets/external/E-v1.js');
        }
        // this must come after the $.getScript statements above!
        $newVideo =
          "<div class='wistia_embed wistia_async_" +
            newUrl.match(/\/(\w+)($|\.\w+$)/)[1] +
            "' style='width:320px;height:180px'>&nbsp;</div>";
      }

      $('.video-container').empty().append($newVideo);

      $(".best_in_place[data-bip-attribute='embed_url']").text(newUrl || videoPlaceholderText);

  });
}

function storiesEditTagsHandlers () {
  /*
    Remember the initial <option>s of the tag select inputs
    If user cancels changes, revert to these (skipping for now)

    var categoryTagsOptions = $('.select2-selection__rendered').eq(0).html();
    var categoryTagsVal = $('#story_category_tags_').val();
    var productCatTags = $('.select2-selection__rendered').eq(1).html();
    var productTags = $('.select2-selection__rendered').eq(2).html();
  */

  $('#story-tags-form select').on('change', function (e) {

    if ($('.edit-tags').hasClass('hidden')) {
      // un-hide the save/cancel buttons
      $('.edit-tags').toggleClass('hidden');
    }
    // console.log('category tags on change: ', $('#story_category_tags_').val());
  });

  // TODO: figure out how to reset select2 inputs
  // commented code results in error when attempting
  // to make changes after reset
  $('#edit-tags-cancel').on('click', function (e) {
    e.preventDefault();
    // reset the select input values
    // $('.select2-selection__rendered').eq(0).html(categoryTagsOptions);
    // $('#story_category_tags_').val(categoryTagsVal);
    // $('.select2-selection__rendered').eq(1).html(productCatTags);
    // $('.select2-selection__rendered').eq(2).html(productTags);
    // console.log('category tags after cancel: ', $('#story_category_tags_').val());
    // hide the save/cancel buttons
    // $('.edit-tags').toggleClass('hidden');
    // tagsFormDirty = false;
  });

}

function storiesEditNewContributorHandlers () {

  // separate 'shown' handler necessary for setting input focus
  $('.modal').on('shown.bs.modal', function () {
    // the selector $('input:first') doesn't work for some reason
    $(this).find('#contributor_first_name').focus();
  });

  // reset new contributor modal form when the modal closes
  $('#new-contributor-modal').on('hidden.bs.modal', function () {
    // input elements to default values (first, last, email)
    $(this).find('form')[0].reset();
    // select2 inputs to default values (role, referred-by)
    $('.new-contributor-role').select2('val', 'customer');  // single select
    $('.new-contributor-referrer').select2('val', '');
  });

  // blur buttons after they're clicked
  $('#new-contributor-button').on('focus', function () {
    var _this = $(this);
    window.setTimeout(function () {
      _this.blur();
    }, 220);
  });

}

function storiesEditResultsHandlers () {
  /*
    new result form - submit is disabled until value entered.
    listens for input event instead of change event, as latter only fires after
    focus moves away from input field, while former fires after all edits
  */
  $('#new-result').on('input', function () {
    if ($(this).val().length > 0)
      $(this).closest('form').find('button').prop('disabled', false);
    else
      $(this).closest('form').find('button').prop('disabled', true);
  });

   // delete a result
  $('#results-list').on('click', '.delete-result', function () {
    var $deleteButton = $(this);
    $.ajax({
      url: $deleteButton.data('action'),
      method: 'delete',
      success: function (data, status, xhr) {
        $deleteButton.closest('.row').next('br').remove();
        $deleteButton.closest('.row').remove();
      }
    });
  });

}

function storiesEditPromptsHandlers () {

  $('#new-prompt').on('input', function () {
    if ($(this).val().length > 0)
      $(this).closest('form').find('button').prop('disabled', false);
    else
      $(this).closest('form').find('button').prop('disabled', true);
  });

  // delete a prompt
  $('#prompts-list').on('click', '.delete-prompt', function () {
    var $deleteButton = $(this);
    $.ajax({
      url: $deleteButton.data('action'),
      method: 'delete',
      success: function (data, status, xhr) {
        $deleteButton.closest('.row').next('br').remove();
        $deleteButton.closest('.row').remove();
      }
    });
  });

}

function storiesEditContributionsHandlers () {
  /*
   *  hide the email confirmation modal after sending
   */
  $('#confirm-email-form').on('submit', function () {
    $(this).closest('.modal-content').find('.modal-title')
                                     .addClass('hidden');
    $(this).closest('.modal-content').find('.progress')
                                     .removeClass('hidden');
  });

  /*
   *  on successful addition of linkedin profile to contributor card
  */
  $(".contribution-cards").on("ajax:success", ".best_in_place[data-bip-attribute='linkedin_url']",
    function (event, data) {
      var linkedinUrl = $(this).text(),
          $card = $(this).closest('.contribution-card'),
          $research = $card.find('.research');
      // add ...
      if ($card.find('iframe').length === 0 && linkedinUrl !== "add url ..." ) {
        $card.append(
          "<br style='line-height:10px'>" +
          "<div class='row text-center'>" +
            "<script type='IN/MemberProfile' " +
              "data-id='" + linkedinUrl + "' " +
              "data-format='inline' data-related='false' " +
              "data-width='340'></script>" +
          "</div>");
        IN.parse();
        initLinkedIn();
        $research.attr('href', linkedinUrl);
        $research.html("<i class='fa fa-linkedin-square bip-clickable-fa'>");
      // remove ...
      } else if ($card.find('iframe').length !== 0 && linkedinUrl === "add url ...") {
        $card.find('br:last').remove();
        $card.find('div:last').remove();
        // get contribution data so we can set research button
        // (needs contributor and customer data)
        $.get('/contributions/' + $card.data('contribution-id'), function (contribution, status) {
          if (contribution.role == 'customer') {
            $research.attr('href',
              "//google.com/search?q=" +
              contribution.contributor.first_name + "+" +
              contribution.contributor.last_name + "+" +
              contribution.success.customer.name);
          } else {
            $research.attr('href',
              "//google.com/search?q=" +
              contribution.contributor.first_name + "+" +
              contribution.contributor.last_name + "+");
          }
        }, 'json');
        $research.html("<i class='glyphicon glyphicon-user bip-clickable'></i>");
      // replace ...
      } else {
        $card.find('br:last').remove();
        $card.find('div:last').remove();
        $card.append(
          "<br style='line-height:10px'>" +
          "<div class='row text-center'>" +
            "<script type='IN/MemberProfile' " +
              "data-id='" + linkedinUrl + "' " +
              "data-format='inline' data-related='false' " +
              "data-width='340'></script>" +
          "</div>");
        IN.parse();
        initLinkedIn();
      }
  });

  /*
   *  only one accordion panel open at a time
  */
  $('.accordion-toggle').on('click', function () {
    if ($(this).attr('href').match(/info/)) {
      var $readPanel = $(this).closest('.accordion')
                              .find("div.accordion-body[id*='submission']");
      if ($readPanel.hasClass('in'))
        $readPanel.removeClass('in');
    } else if ($(this).attr('href').match(/submission/)) {
      var $infoPanel = $(this).closest('.accordion')
                              .find("div.accordion-body[id*='info']");
      if ($infoPanel.hasClass('in'))
        $infoPanel.removeClass('in');
    }
  });

  /*
    Propagate any changes to contribution notes dynamically.
    There are issues with updating an existing best_in_place input with jquery,
    so instead this function finds the notes field that needs updating,
    removes and replaces it with a clone of itself, with attributes updated
    as necessary
  */
  $(".contribution-cards").on("ajax:success", ".best_in_place[data-bip-attribute='notes']",
    function (event, data) {

      var $_this = $(this), // the notes field that was modified
          contributionId = $(this).attr('id').match(/_(\d+)_notes$/)[1];

      $(".best_in_place[id*='" + contributionId + "_notes']")
        .each(function (index) {
          // update any instance of this contribution notes field
          // besides the one that was just modified ...
          if ( !$(this).is($_this) ) {
            var $newNotesField = $(this).clone();
            $newNotesField.html($_this.html());
            $newNotesField.attr('data-bip-value', $_this.html());
            $newNotesField.attr('data-bip-original-content', $_this.html());
            $(this).parent().empty()
                            .append($newNotesField);
            $newNotesField.best_in_place();
          }
      });

  });

  // mirrors above function for phone field
  $(".contribution-cards").on("ajax:success", ".best_in_place[data-bip-attribute='phone']",
    function (event, data) {

      var $_this = $(this), // the phone field that was modified
          userId = $(this).attr('id').match(/_(\d+)_phone$/)[1];

      $(".best_in_place[id*='" + userId + "_phone']")
        .each(function (index) {
          // console.log('phone fields: ', $(this));
          // update any instance of this phone field
          // besides the one that was just modified ...
          if ( !$(this).is($_this) ) {
            var $newPhoneField = $(this).clone();
            $newPhoneField.html($_this.html());
            $newPhoneField.attr('data-bip-value', $_this.html());
            $newPhoneField.attr('data-bip-original-content', $_this.html());
            $(this).parent().empty()
                            .append("<span>Phone:&nbsp;&nbsp;</span>", $newPhoneField);
            $newPhoneField.best_in_place();
          }
      });

  });

}

function storiesEditInitContentEditor () {

  var $storyContentEditor = $('#story-content-editor'),
      $summernote = $storyContentEditor.next(),
      $saveButton = $("[type='submit'][form='story-content-form']"),
      $cancelButton = $("[type='reset'][form='story-content-form']"),
      $formButtons = $("[form='story-content-form']"),
      $editor = $summernote.find('.note-editable'),
      $toolbarButtons = $summernote.find('.note-toolbar > .note-btn-group > button, .note-toolbar > .note-btn-group > .note-btn-group > button');

  // disable the editor until edit button is clicked
  $editor.attr('contenteditable', 'false')
         .css({
          'background-color': '#f5f5f5',
          'pointer-events': 'none'
         });

  $toolbarButtons.css({
                  'background-color': '#f5f5f5',
                  'pointer-events': 'none'
                 });

  $('#edit-story-content').on('click', function () {
    $(this).css({
      'pointer-events': 'none',
      color: '#e3e3e3'
    });
    $editor.attr('contenteditable', 'true')
           .css({
            'background-color': 'white',
            'pointer-events': 'auto'
           });
    $toolbarButtons.css({
                      'background-color': 'white',
                      'pointer-events': 'auto'
                    });
    $formButtons.removeClass('hidden');
  });

  $summernote.on('click', '.note-view', function () {
    if ($formButtons.prop('disabled')) {
      $formButtons.prop('disabled', false);
    } else {
      $formButtons.prop('disabled', true);
    }
  });

  // this function can be generalized and used elsewhere ...
  // $('form').has('[data-provider="summernote"]').on('reset', function () {
  $('#story-content-form').on('reset', function () {
    // revert to last saved content ...
    $storyContentEditor.summernote('code', $storyContentEditor.text());
    $saveButton.click();
  });
}

