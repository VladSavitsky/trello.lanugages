/*
* @file
* Helpers functions.
*/

// Set Development Environment Flag which allows to show various messages in console.
var debug = chrome.extension.getURL('/manifest.json').indexOf('alhoallabckfhacphbkkideohcgbchhl') <= 0;

/**
 * Synchronously load file and return it's content.
 * @var string File URL.
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
}).memoize();

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
      console.log(filename + ' is missing or broken.')
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


function getElement(cssPath) {
  var $element = $(cssPath);
  if (!$element.length) {
    if (debug) {
      console.log(cssPath, "\n", 'Message: element exists in [mapping].json but wasn\'t found at page.');
    }
    return false;
  }
  return $element;
}
