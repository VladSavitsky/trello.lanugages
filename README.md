trello.lanugages
================

Chrome browser extension which allow to translate trello.com site to any language.

To speed-up translation trello's interface and allow my wife to became a trello-power user
I've created this extension.

It's very simple and to keep it simple as possible it's almost have no interface for translation.
All translations stored in JSON files and any translator could translate them in any editor.

# How it works

Trello loads page elements using AJAX so we wait until element appears at page and then translate it.
We translate values of HTML tags, tip (mostly 'title' attributes of A tags) and form elements.

# How to translate trello.com into your language.

1. Open http://interpr.it/extension/34
2. Log in (required to translate).
3. Do your best!

# Development

## Get code

1. Clone repository: ` git clone git@github.com:VladSavitsky/trello.lanugages.git`
2. Open folder: `cd trello.languages`
3. Happy hacking!

## Use newest version in browser.

To add recently downloaded extension to chrome use this instruction: https://developer.chrome.com/extensions/getstarted#unpacked



