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

1. Download file `/locale/original.json`
2. Find your language code in ISO 639-1. See http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
3. Rename recently downloaded file using language code. For example, 'original.json' become 'ru.json'.
4. Open this file in your favorite editor and translate it. For example,
  "Boards" : "place translation here"
5. Send translated file to vlad.savitsky@gmail.com.

# Development

1. Clone repository:
` git clone git@github.com:VladSavitsky/trello.lanugages.git`
2. Open folder:
`cd trello.languages`
3. Happy hacking!

