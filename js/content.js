// TODO: Dates translation.
// TODO: Translate HTML attributes.
//       #board > div > div.list-cards > div.card-composer > div.cc-controls.clearfix > input value="Add"
// TODO: Translate parts of phrases.
// TODO: add language names http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
// TODO: Add card creation form to wait it's appearence.
// TODO: Fix bug with 'Subscribe' with check icon in the text.

(function() {

  // Replace strings at page using mapping from translation object.
  function l10n() {
    if (jQuery.isEmptyObject(mapping)) {
      console.log('mapping.json file is broken.');
    }
    else if ($.isEmptyObject(translation)) {
      console.log(selectedLanguage + ' translation is missing.');
    }
    else {
      $.each(mapping, function(type, data) {
        console.log(data);
        $.each(data, function(code, cssPath) {
          if (!translation[code]) {
            console.log('There is no translation for "' + code + '" in ' + selectedLanguage);
            return;
          }
          var $element = $(cssPath);
          if (type == 'title') {
            if (!$element.attr('data-language')) {
              $element.attr(type, translation[code]).attr('data-language', selectedLanguage);
            }
          } else if (type == 'html') {
            if (!$element.attr('data-language')) {
              $element.html(translation[code]).attr('data-language', selectedLanguage);
            }
          } else if (type == 'form elements') {
            if (!$element.attr('data-language')) {
              $element.val(translation[code]).attr('data-language', selectedLanguage);
            }
          } else if (type == 'substrings') {
            $element.html(function(index, html) {
              return html.replace(' ' + code + ' ', ' ' + translation[code] + ' ');
            });
          }
        });
      });
    }
  };

  // Load mapping data.
  var mapping = getFile(chrome.extension.getURL('/mapping.json'));
  var selectedLanguage = translation = null;
  // Get stored selected language and load translation. Default language is 'en'.
  chrome.storage.sync.get({'selectedLanguage': 'en'}, function (data) {
    selectedLanguage = data.selectedLanguage;
    translation = getFile(chrome.extension.getURL('/locale/' + data.selectedLanguage + '.json'));
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

  // This element appears last at page and we use it to add the Menu to page and set status for each List.
  $('#board .list form .js-open-add-list').waitUntilExists(function() {l10n()});
  // List's context menu.
  $('.pop-over .js-close-list').waitUntilExists(function() {l10n()});
  // Card's quick context menu.
  $('div.quick-card-editor').waitUntilExists(function() {l10n()});
  // Activity in Sidebar.
  $('.js-sidebar-list-actions .phenom-desc').waitUntilExists(function() {l10n()});


  function renderLanguageMenu(selectedLanguage) {
    // TODO: Dynamically build list of existing languages.
    var languages = {'en' : 'English', 'ru' : 'Russian', 'uk' : 'Ukrainian'};
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
      if ($.isEmptyObject(translation)) {
        console.log(selectedLanguage + '.json file is broken or missing.');
      }
      // Remove all markers about translation.
      $('[data-language]').removeAttr('data-language');
      // Translate page.
      l10n();
    });
  };

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

}) ();
