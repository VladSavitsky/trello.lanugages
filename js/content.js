// TODO: Dates translation.
// TODO: Fix bug with 'Subscribe' with check icon in the text.
// TODO: Fix strings with plurals here. See Notification icon.

// X-Trello-Version:1.228.1

/*
 Regexp to build correct keys from real strings
 message.json:
  :%s/^"\(.*\)[ …\“”.,@’:;#-'"!?-]\(.*\)"\s*:\s*{/"\1_\2" : {/g
 mapping.json:
  :%s/^\(\s*".*\)[ …\“”.,@’:;#-'"!?-]\(.*\)"\s*:/\1_\2" :/g
 Note: this command should be run several times.
*/

(function($) {
  var flags = getFile(chrome.extension.getURL('/flags.json'));
  if (typeof flags == 'string') {
    flags = $.parseJSON(flags);
  }
  $.each(flags, function(context, cssPath) {
    if (cssPath != "") {
      $(cssPath + ':not(.translated)').waitUntilExists(function() {
        l10n(context);
        $(this).addClass('translated');
      });
    }
  });

/*

  // TODO: update mapping.json file.


  // Activity in Sidebar.
  $('.js-sidebar-list-actions .phenom-desc').waitUntilExists(function() {l10n()});
  $('body > div.window-overlay > div > div > div > div > a.js-more-actions').waitUntilExists(function() {l10n()});

  // Card edit window.
  $('body > div.window-overlay > div > div > div > p.dropzone').waitUntilExists(function() {l10n()});

  // Notification popup.
  $('body > div.pop-over.popover-notifications > div.content > div > ul > li > a.js-change-email-frequency').waitUntilExists(function() {l10n()});

  // Home page. List of all boards.
  $('#content > div > div > div > a.js-view-org-profile').waitUntilExists(function() {l10n()});


  // Closed boards window.
  $('body > div.window-overlay > div > div > div > div.window-sidebar > p.helper').waitUntilExists(function() {l10n()});

  // Search window.
  $('body > div.pop-over.search-over > div.content.js-tab-parent > div > p.search-warning.js-err').waitUntilExists(function() {
    l10n('search window', $(this).parents('.pop-over'));
  });
  // Caledar window.
  $('#content > div > div.board-canvas > div.calendar-wrapper > div.calendar-content > div').waitUntilExists(function() {
    l10n('calendar view', $(this).parents('.calendar-wrapper'));
  });
*/

}) (jQuery);
