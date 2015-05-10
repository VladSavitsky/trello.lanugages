/*
* @file
* Helpers functions.
*/

// Set Development Environment Flag which allows to show various messages in console.
var debug = chrome.extension.getURL('/manifest.json').indexOf('alhoallabckfhacphbkkideohcgbchhl') <= 0;

/**
 * Synchronously load file and return it's content.
 *
 * @var string File URL.
 *
 * @return string Returns file content as a string.
 * @see http://forum.jquery.com/topic/how-do-i-access-json-data-outside-of-getjson
 */
var getFile = (function getFile(url) {
  var result = null;
  $.ajax({
    async: false,
    // @todo make this calls syncroniuose and run only when get results.
    url: url,
    dataType: 'json',
    success: function (data) {
      result = data;
    },
    error: function (request, status, error) {
      result = {};
    }
  });
  return result;
/* }).memoize();*/
});

/**
 * Check if JSON file was loaded and given object not empty.
 *
 * @param context string Filename which stores JSON data and context name.
 *
 * @return Returns mapping object and FALSE otherwise.
 */
function getMapping(context) {
  var filename = '/mapping/' + context + '.json';
  var mapping = getFile(chrome.extension.getURL(filename));
  if (jQuery.isEmptyObject(mapping)) {
    if (debug) {
      console.error(filename + ' is missing or broken.')
    };
    return false;
  }
  if (debug) {
    console.log(filename + ' was loaded.');
  }
  return mapping;
}

/**
 * Replace all special symbols in string with '_' (underscore).
 * @param String String which should be modified.
 * @return Returns already updated string.
 */
function escapeString(string) {
  return newstring = string.replace(new RegExp("[ …“”.,@’:;#-'\"!?-]", 'g'), "_");
}


function getElement(type, code, cssPath, context) {
  var $element = $(cssPath);
  if (!$element.length) {
    buildMessage(type, code, cssPath, context, "Element wasn't found at page.");
    return false;
  }
  return $element;
}

function buildMessage(type, code, cssPath, context, message) {
  if (debug) {
    var logMessage = {
        "Message" : {"value" : message},
        "Context" : {"value" : context},
        "Type" : {"value" : type},
        "Code" : {"value" : code},
        "Translation" : {"value" : chrome.i18n.getMessage(code)},
        "cssPath" : {"value" : cssPath}
    };
    console.table(logMessage);
  }
}

// Replace strings at page using mapping from translation object.
function l10n(context) {
  var mapping = getMapping(context);
  if (typeof mapping == 'string') {
    mapping = $.parseJSON(mapping);
  }
  $.each(mapping, function(type, data) {
    if (type == 'meta') return;
    $.each(data, function(code, selectors) {
//        if (!chrome.i18n.getMessage(code)) return;
      if ($.type(selectors) === 'string') selectors = selectors.split();
      $.each(selectors, function(index, cssPath) {
        translateElement(type, code, mapping["meta"]['basePath'] + ' ' + cssPath, context);
      });
    });
  });
};

// Translate element by given cssPath.
function translateElement(type, code, cssPath, context) {
  var $element = getElement(type, code, cssPath, context);
  if (!$element.length) {
    buildMessage(type, code, cssPath, context, "Element was NOT found.");
    return;
  }
  if (!chrome.i18n.getMessage(code)) {
    buildMessage(type, code, cssPath, context, "No translation found for this element.");
    return;
  }
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
