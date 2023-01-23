$(function() {
  const leftNavCollapseKey = 'leftNavCollapse';
  const menu = $('#menu');
  const btnCollapse = menu.find('a.btn-expand-collapse');

  function setCookie(name, value, days=365) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  const leftNavTooltips = () => {
    // Set the tooltip to show the menu item text.
    menu.find('a.list-group-item').each((index, e) => {
      $(e).attr('title', menu.hasClass('collapsed') ? $(e).text() : '');
    });
  };

  const onCollapseLeftNav = () => {
    // Toggle collapsed state of left-nav menu.
    menu.toggleClass('collapsed');
    // Hide right chevrons of left-nav menu items.
    menu.find('a.list-group-item i.pull-right').toggleClass('fa fa-chevron-right');
    // Toggle the chevron in the collapse button right/left or left/right.
    btnCollapse.find('i').toggleClass('fa-chevron-left fa-chevron-right');
    // Set tooltips on left-nav menu.
    leftNavTooltips();
    // Expand width of the page when left-nav is collapsed.
    $('.container').toggleClass('w-100');
    // Save settings, use a cookie for smooth rendering of page upon load from server.
    const isCollapse = getCookie('leftNavCollapse') || false;
    setCookie('leftNavCollapse', !isCollapse);
  };

  const initializeLeftNav = () => {
    // Initialize left-nav menu state.
    const isCollapse = getCookie('leftNavCollapse');
    isCollapse && leftNavTooltips();

    // Setup event handler on left-nav collapse button click.
    btnCollapse.click(onCollapseLeftNav);

    // Enable animation effort on left-nav collapse.
    $('.container').addClass('animated');
  };

  const notifyProjectComplete = () => {
    // When the url parameter contains ?completed=true, show a notification.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("completed") == "true") {
      pybossaNotify('Congratulations, you have completed the job.', true, 'success', true);
    }
};

  initializeLeftNav();
  notifyProjectComplete()
});
