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

  // Load mapping data.
  var flags = $.parseJSON(getFile(chrome.extension.getURL('/flags.json')));
  $.each(flags, function(context, cssPath) {
    if (cssPath != "") {
      $(cssPath + ':not(.translated)').waitUntilExists(function() {
        l10n(context);
      }).addClass('translated');
    }
  });

  // Replace strings at page using mapping from translation object.
  function l10n(context) {
    var mapping = $.parseJSON(getMapping(context));
    $.each(mapping, function(type, data) {
      if (type == 'meta') return;
      $.each(data, function(code, selectors) {
//        if (!chrome.i18n.getMessage(code)) return;
        if ($.type(selectors) === 'string') selectors = selectors.split();
        $.each(selectors, function(index, cssPath) {
          translateElement(type, code, mapping["meta"]['basePath'] + cssPath);
        });
      });
    });
  };

  // Translate element by given cssPath.
  function translateElement(type, code, cssPath) {
    var $element = getElement(cssPath);
    if (!$element.length) return;
    // Store original string.
    $element.prop('data-translation-code-' + type, code);

    // Do the magic: replace original string with translation.
    if (type == 'title' || type == 'placeholder') {
      $.each($element, function() {
        $(this).attr(type, function(index, el) {
          if (cssPath == "#permission-level" && type == 'title') {
            if (escapeString($(this).attr(type).trim()) == code) {
              // We must to do that extra check because some elements
              // has the same CSS Path but different content text.
              return el.replace($(this).attr(type).trim(), chrome.i18n.getMessage(code));
            }
          }
          else {
            return el.replace($(this).attr(type).trim(), chrome.i18n.getMessage(code));
          }
        });
      });
    } else if (type == 'html') {
      $.each($element, function() {
        $(this).html(function(index, el) {
          return el.replace($(this).text().trim(), chrome.i18n.getMessage(code));
        });
      });
    } else if (type == 'inputs') {
      $.each($element, function() {
        $element.val(chrome.i18n.getMessage(code));
      });
    } else if (type == 'substrings') {
      // First we need to check if there is a span tag with original string.
      // If tag exists we simply replace it's content with new translation.
      var $tag = $element.find('.language-source-text[data-original="' + code + '"]');
      if ($tag.length) {
        // Tag exists. Just translate text in SPAN.
        $.each($tag, function() {$(this).html(' ' + chrome.i18n.getMessage(code) + ' ')});
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
  }

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
