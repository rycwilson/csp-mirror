
//= require ./settings/profile
//= require ./settings/crowdsourcing_templates/crowdsourcing_templates
//= require ./settings/tags_and_ctas
//= require ./settings/widget_config

function companiesEdit () {

  $('.dropdown.company-settings').addClass('active');

  var url = document.location.toString();
  if (url.match('#')) {
    $('.nav-layout-sidebar a[href="#' + url.split('#')[1] + '"]').tab('show');
  } else {
    $('.layout-main').show();
  }

  $(document)
    .one('turbolinks:before-visit', function () {
      if ($('.dropdown.company-settings').hasClass('active')) {
        $('.dropdown.company-settings').removeClass('active');
      }
    })
    .one('click', '.workflow-tabs', function () {
      if ($('.dropdown.company-settings').hasClass('active')) {
        $('.dropdown.company-settings').removeClass('active');
      }
    })
    .on('shown.bs.tab', '.nav-layout-sidebar a', function (e) {
      window.scrollTo(0, 0);
      window.location.hash = e.target.hash;
      $('.layout-main').show();
    });
}

function companiesEditListeners () {

  companyProfileListeners();
  crowdsourcingTemplatesListeners();
  storyCTAsListeners();
  widgetConfigListeners();

}













