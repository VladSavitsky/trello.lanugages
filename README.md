trello.lanugages
================

Chrome browser extension which allow to translate trello.com site to any language.

It's very simple and to keep it simple as possible it's almost have no interface for translation.
All translations stored in JSON files and any translator could translate them in any editor.

# Installation

There are two steps: install extension and configure browser's default language (locale).

# Get an extension.

1. Open https://chrome.google.com/webstore/detail/languages-for-trellocom/alhoallabckfhacphbkkideohcgbchhl
2. Click "Add" button.
3. Confirm permissions.
4. Open https://trello.com or refresh already opened page (press ``Ctrl+R``)

## Set language in Chrome browser.

If you set default language before you could safely skip this step. Here's how to change the locale using the UI on Google Chrome for Windows:

1. Wrench icon > Options
2. Choose the Under the Hood tab
3. Scroll down to Web Content
4. Click Change font and language settings
5. Choose the Languages tab
6. Use the drop down to set the Google Chrome language
7. Restart Chrome

# How it works

Trello.com builds page dynamically (content loading using AJAX, dynamically created elements at page).
So a lot of strings do not exists at page until you click somewhere or press some keys and there is other way to translate them but just wait untilthose elements appears at page and then do a translation for them.

# How to translate trello.com into your language.

1. Open http://interpr.it/extension/34
2. Log in (required to translate).
3. Do your best!


#Support

* Comment: https://trello.com/b/RC09y2Zn
* Email: vlad.savitsky@gmail.com
* Skype: vlad_savitsky
* Extension's support page: https://chrome.google.com/webstore/support/alhoallabckfhacphbkkideohcgbchhl?hl=ru&gl=UA#bug

# Development

## Get code

1. Clone repository: ` git clone git@github.com:VladSavitsky/trello.lanugages.git`
2. Open folder: `cd trello.languages`
3. Happy hacking!

## Use newest version in browser.

To add recently downloaded extension to chrome use this instruction: https://developer.chrome.com/extensions/getstarted#unpacked



