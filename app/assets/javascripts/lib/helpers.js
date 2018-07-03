
function currentStory () {
  if ($('body').hasClass('stories show')) {
    return CSP.stories.find(function (story) {
      return story.csp_story_path === window.location.pathname;
    });
  } else if ($('body').hasClass('stories edit')) {
    return CSP.stories.find(function (story) {
      return story.id === parseInt(window.location.pathname.match(/\/(\d+)\//)[1], 10);
    });

  } else {
    return null;
  }
}
