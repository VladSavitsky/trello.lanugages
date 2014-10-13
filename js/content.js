// TODO: Dates translation.
// TODO: add language names http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
// TODO: Add card creation form to wait it's appearence.
// TODO: Fix bug with 'Subscribe' with check icon in the text.
// TODO: store translations at server.


/*
 Regexp to build correct keys from real strings in the message.json files:
 :%s/^"\(.*\)[ …\.,@’:;#-'"!?]\(.*\)"\s*:\s*{/"\1_\2" : {/g
 Working solution for mapping.json:
 :%s/^\(\s*".*\)[ …\.,@’:;#-'"!?]\(.*\)"\s*:/\1_\2" :/g
 Note: this command should be run several times.
*/

(function() {
  // Set Development Environment Flag which allows to show various messages in console.
  var debug = chrome.extension.getURL('/manifest.json').indexOf('alhoallabckfhacphbkkideohcgbchhl') <= 0;


  // Replace strings at page using mapping from translation object.
  function l10n(element) {
    // TODO: Translate only new DOM elements.
    if (isEmpty('mapping', mapping)) return;
    $.each(mapping, function(type, data) {
      $.each(data, function(code, selectors) {
        if (!chrome.i18n.getMessage(code)) return;
        // Convert strings to arrays to minimize code.
        if ($.type(selectors) === 'string') selectors = selectors.split();
        $.each(selectors, function(index, cssPath) {
          var $element = $(cssPath);
          if ($.isEmptyObject($element)) return;
          if (type == 'title' || type == 'placeholder') {
            // Do not check 'data-language' attribute because some elements should be translated
            // several times. Eg., title and inner HTML.
            // We assume that element should be only one. It's not right.
            $element.attr(type, chrome.i18n.getMessage(code));
            // TODO: Fix strings with plurals here. See Notification icon.
          } else if (type == 'html') {
            $.each($element, function() {
              // Get/Store original translation.
              $(this).html(function(index, html) {
                return html.replace($(this).text().trim(), chrome.i18n.getMessage(code));
              });
            });
          } else if (type == 'form elements') {
            $.each($element, function() {
              $element.val(chrome.i18n.getMessage(code));
            });
          } else if (type == 'substrings') {
            // First we need to check if there is a span tag with original string.
            // If tag exists we simply replace it's content with new translation.
            var $tag = $element.find('.language-source-text[data-original="' + code + '"]');
            if ($tag.length) {
              // Tag exists. Just translate text in SPAN.
              $.each($tag, function() {
                $(this).html(' ' + chrome.i18n.getMessage(code) + ' ');
              });
            }
            else {
              // There is no tag and we should wrap substring with SPAN tag to store original sring.
              // This should be done to allow translations to another languages.
              $tag = $('<span />').addClass('language-source-text').attr('data-original', code).html(chrome.i18n.getMessage(code));
              // Replace substring with special tag.
              $element.html(function(index, html) {
                // We should add trailing spaces to avoid translations in card name or etc.
                // trello.com uses extra spaces for words which are common but this could be changed anytime
                // and we shouldn't rely on this.
                // TODO: implement translations of phrases with placeholders. Eg., '%name added %cardname'.
                return html.replace(' ' + code + ' ', ' ' + $tag[0].outerHTML + ' ');
              });
            }
          }
        });
      });
    });
  };

  // Load mapping data.
  var mapping = getFile(chrome.extension.getURL('/mapping.json'));
  /*
  var selectedLanguage = translation = null;
  // Get stored selected language and load translation. Default language is 'en'.
  chrome.storage.sync.get({'selectedLanguage': 'en'}, function (data) {
    selectedLanguage = data.selectedLanguage;
    translation = getFile(chrome.extension.getURL('/locale/' + selectedLanguage + '.json'));
  });


  // Insert new menu item to right sidebar to allow language selection.
  $('#content .board-widget-nav .nav-list').waitUntilExists(function() {
    if ($('#language-list').length == 0) {
      // Insert a placeholder to sidebar. Should run only once.
      $(this).parent().after(
      '<div class="board-widget-language clearfix collapsed">' +
       '<h3 class="dark-hover toggle-widget-language js-toggle-widget-language" title="Click here to see more available languages.">Languages' +
       '<span class="icon-sm icon-menu toggle-menu-icon"></span></h3></div>');
      $('<ul/>').attr('id', 'language-list').addClass('checkable').appendTo('.board-widget-language');

      // Get stored language.
      renderLanguageMenu(selectedLanguage);
    }
  });
  */

  // TODO: (high priority) reduce number of l10n() calls.
  // This element appears last at page and we use it to add the Menu to page and set status for each List.
  $('#board .list form .js-open-add-list').waitUntilExists(function() {l10n()});
  // List's context menu.
  $('.pop-over .js-close-list').waitUntilExists(function() {l10n()});
  // Card's quick context menu.
  $('div.quick-card-editor').waitUntilExists(function() {l10n()});
  // Activity in Sidebar.
  $('.js-sidebar-list-actions .phenom-desc').waitUntilExists(function() {l10n()});
  $('body > div.window-overlay > div > div > div > div > a.js-more-actions').waitUntilExists(function() {l10n()});
  // Card edit window.
  $('body > div.window-overlay > div > div > div > p.dropzone').waitUntilExists(function() {l10n()});
  // Notification popup.
  $('body > div.pop-over.popover-notifications > div.content > div > ul > li > a.js-change-email-frequency').waitUntilExists(function() {l10n()});
  // Home page. List of all boards.
  $('#content > div > div > div > a.js-view-org-profile').waitUntilExists(function() {l10n()});
  $('#boards-drawer > div > div.board-drawer-content > div.js-boards-list-container > div.js-all-boards').waitUntilExists(function() {l10n()});
  // Closed boards window.
  $('body > div.window-overlay > div > div > div > div.window-sidebar > p.helper').waitUntilExists(function() {l10n()});
  // Search window.
  $('body > div.pop-over.search-over > div.content.js-tab-parent > div > p.search-warning.js-err').waitUntilExists(function() {l10n()});
  // Caledar window.
  $('#content > div > div.board-canvas > div.calendar-wrapper > div.calendar-content > div').waitUntilExists(function() {l10n()});

  /*
  function renderLanguageMenu(selectedLanguage) {
    // TODO: Dynamically build list of existing languages.
    var languages = {'en' : 'English', 'ru' : 'Russian', 'uk' : 'Ukrainian', 'it' : 'Italian'};
    var li = '<hr style="margin-top: 0;">';
    var checkIcon = '<span class="icon-sm icon-check"/>';
    $.each(languages, function (code, name) {
      if (code && name) {
        var url = chrome.extension.getURL('/flags/' + code + '.png');
        var $img = $("<img />",{"src" : url, "alt" : name , 'height': 12, 'width': 18, 'class' : 'language-icon', 'id' : 'language-' + code});
        var $link = $('<a>').attr('href', '#').attr('class', 'language-list-item language-list-sub-item')
          .html($img[0].outerHTML + name + checkIcon);
        // TODO: Rewrite to avoid '[0].outerHTML'.
        var item = $('<li/>').attr('data-language-code', code).html($link[0].outerHTML);
        li += item[0].outerHTML;
      }
    });

    // Replace tabs in the Menu.
    $('#language-list').empty().append(li);

    // Set Check Icon for selected language.
    $('li[data-language-code="' + selectedLanguage + '"]').find('.icon-check').show();

    // Language Menu was clicked.
    $('.js-toggle-widget-language').click(function() {
      var menu = $(this).closest(".board-widget-language");
      menu.hasClass("collapsed") ? menu.removeClass("collapsed") : menu.addClass("collapsed");
    });

    // ====================
    // Language was clicked.
    $('.language-list-item').click(function() {
      var selectedLanguage = $(this).parent().attr('data-language-code');
      // Store selected language.
      chrome.storage.sync.set({'selectedLanguage': selectedLanguage});
      // Hide Icon Check for all languages.
      $('#language-list').each(function() {$(this).find('.icon-check').hide();});
      // Set Check Icon near selected language.
      $(this).find('.icon-check').show();
      // Get translation.
      translation = getFile(chrome.extension.getURL('/locale/' + selectedLanguage + '.json'));
      if (debug && $.isEmptyObject(translation)) console.log(selectedLanguage + '.json file is broken or missing.');
      // Remove all markers about translation.
      $('[data-language]').removeAttr('data-language');
      // Translate page.
      l10n();
    });
  };
  */

  // ================= //
  // Useful functions. //
  // ================= //

  /**
   * Synchronously load file and return it's content.
   * @var string File URL.
   * @return string Returns file content as a string.
   * @see http://forum.jquery.com/topic/how-do-i-access-json-data-outside-of-getjson
   */
  function getFile(url) {
    var result = null;
    $.ajax({
      async: false,
      url: url,
      dataType: 'json',
      success: function (data) {result = data},
      error: function (request, status, error) {result = {};}
    });
    return result;
  }

  /**
   * Check if JSON file was loaded and given object not empty.
   * @param filename string Filename which stores JSON data.
   * @param entity Object An Object which should be checked.
   * @return Returns TRUE if entity is an empty object and FALSE otherwise.
   */
  function isEmpty(filename, entity) {
    if (jQuery.isEmptyObject(entity)) {
      if (debug) {console.log(filename + '.json file is missing or broken. Please check.')};
      return true;
    }
    return false;
  }


}) ();
