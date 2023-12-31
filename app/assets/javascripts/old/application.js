/* jquery-ui must appear before bootstrap, per https://stackoverflow.com/questions/13731400 */
//= require jquery3
//= require jquery_ujs
//= require jquery-ui
//= require bootstrap-sprockets
//= require turbolinks
//= require underscore/underscore
//= require_tree ./lib
//= require vendor/vendor
//= require companies/companies
//= require stories/stories
//= require contributions/contributions
//= require profile/profile
//= require site
//= require init

// attach listeners BEFORE running any page-specific js
// (e.g. if page-specific js manually triggers an event as in promote settings)
$(document).one('turbolinks:load', function () {
  attachAppListeners();
  attachCompaniesListeners();
  attachStoriesListeners();
  attachProfileListeners();
  attachContributionsListeners();
});

$(document).on('turbolinks:load', function (e) {
  setAppData();
  constructPlugins();
  CSP.init();

  // ref: https://clicky.com/help/apps-plugins#rails4turbo
  // clicky.log( document.location.pathname + document.location.search, document.title, 'pageview' )
});

function setAppData () {
  if (window.gon) {  // use global namespace in case gon is undefined
    console.log('gon: ', gon);
  } else {
    console.log('gon undefined');
  }
  CSP.company = (window.gon && gon.company) || CSP.company || null;
  CSP.stories = (window.gon && gon.stories) || CSP.stories || null;
  CSP.current_user = (window.gon && gon.current_user) || CSP.current_user || null;
  CSP.env = (window.gon && gon.env) || CSP.env || null;
  CSP.charts = (window.gon && gon.charts) || CSP.charts || null;
  // console.log('app: ', app);
  getScreenSize();
}

function attachAppListeners () {

  xScrollBoundaries();

  window.onpopstate = showActiveTabContent;

  $(document)

    .on('click', '.nav-workflow a', workflowTurboVisit)

    // apply styling when clicking on a company nav dropdown option,
    .on('click', 'a[href*="/settings"], a[href="/user-profile"]', (e) => {
      const thisDropdown = e.target.closest('li.dropdown');
      const otherDropdown = thisDropdown.nextElementSibling || thisDropdown.previousElementSibling;
      thisDropdown.classList.add('active');
      otherDropdown.classList.remove('active');
    })

    /**
     * some forms excluded as they have their own handler, e.g. #new-success-form, #gads-form
     */
    .on('click', 'button:submit', function (e) {
      if ($(this).hasClass('disabled')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
      var $form = ($(this).closest('form').length && $(this).closest('form')) ||
                  $('#' + $(this).attr('form')),
          $button = $(this);
      if ($form.is('#company-profile-form') ||
          $form.is('#company-tags-form') ||
          $form.is('#customer-form') ||
          $form.is('#contribution-request-form') ||
          $form.is('#ads-images-form') ||
          $form.is('[id*="contribution-form-"]') ||
          $form.is('#new-story-form') ||
          $form.is('#story-settings-form') ||
          $form.is('#story-content-form') ||
          $form.is('#new-cta-form') ||
          $form.is('[id*="cta-"]') ||
          $form.is('#submission-form')) {
        if ($form.data('submitted')) {
          e.preventDefault();
          return false;
        } else {
          toggleFormWorking($form, $button);
        }
      }
    });

  //
  

  // window.onorientationchange = function () { window.location.reload(); };

  $(document)
    .on('turbolinks:click', function () {
      // console.log('turbolinks:click');
    })

    .on('turbolinks:before-visit', function (e) {
      // console.log('turbolinks:before-visit');
      // console.log($(e).originalEvent.data.url)
      // debugger;
    })

    .on('turbolinks:request-start', function () {
      // console.log('turbolinks:request-start');
      // debugger;
    })
    .on('turbolinks:visit', function () {
      // console.log('turbolinks:visit');
      // debugger;
    })

    .on('turbolinks:request-end', function () {
      // console.log('turbolinks:request-end');
      // debugger;
    })

    // this event appears to work best for doing stuff prior to leaving a page
    // note: this event occurs after the history state has been changed
    .on('turbolinks:before-cache', function () {
      // console.log('turbolinks:before-cache');
      deconstructPlugins();
    })

    .on('turbolinks:before-render', function (event) {
      // console.log('turbolinks:before-render');
    })

    .on('turbolinks:render', function () {
      // console.log('turbolinks:render');
      if (document.documentElement.hasAttribute('data-turbolinks-preview')) {
        constructPlugins();
      }
    });
}

function workflowTurboVisit(e) {
  e.preventDefault();
  const link = e.currentTarget;
  const newWorkflowPath = `/${link.getAttribute('href').slice(1, link.getAttribute('href').length)}`;
  const isDashboard = document.body.classList.contains('companies') && document.body.classList.contains('show');
  if (isDashboard) {
    // replacing state ensures turbolinks:false for the first tab state
    history.replaceState({ turbolinks: false }, null, location.pathname);
    history.pushState({ turbolinks: true }, null, newWorkflowPath);
  } else {
    Turbolinks.visit(newWorkflowPath);
  }
}

function showActiveTabContent(e) {
  const workflowMatch = location.pathname.match(/(prospect|curate|promote|measure)(\/(\w|-)+)?/);
  const workflowStage = workflowMatch && workflowMatch[1];
  const curateView = workflowStage && (workflowStage === 'curate') ? (workflowMatch[2] ? 'story' : 'stories') : null;
  if (workflowStage) {
    $(`.nav-workflow a[href="#${workflowStage}"]`).tab('show');
    if (curateView) {
      curateView === 'stories' ? 
        $('a[href=".curate-stories"]').tab('show') :
        $('a[href=".edit-story"]').tab('show');
      
      // don't scroll to panel
      setTimeout(() => scrollTo(0, 0));
      if (curateView === 'stories') {
        $('#curate-filters .curator')
          .val($('#curate-filters .curator').children(`[value="${CSP.current_user.id}"]`).val())
          .trigger('change', { auto: true });
      }
    }
  }
}