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

## Using Online Editor.

1. Open your favorite online JSON editor or http://www.jsoneditoronline.org/.
2. Select 'Open/Open url' in top menu.
3. Insert URL: https://raw.githubusercontent.com/VladSavitsky/trello.lanugages/master/locale/original.json
4. Translate strings using 'original string' : 'translation' pattern. See https://github.com/VladSavitsky/trello.lanugages/blob/master/locale/ru.json
5. If you're happy with translation - press 'Save'. File will be downloaded to your computer.
6. Send translated file to vlad.savitsky@gmail.com. Thanks a lot! Your translation will be published with next version of extension and updated automatically at all computers.

## Using your favorite editor at local computer.

1. Download file https://raw.githubusercontent.com/VladSavitsky/trello.lanugages/master/locale/original.json
2. Open this file in your favorite editor and translate it. For example, "Boards" : "place translation here".
3. Save your changes (Ctrl + S or File/Save)
4. Send translated file to vlad.savitsky@gmail.com. Thanks a lot! Your translation will be published with next version of extension and updated automatically at all computers.

# Development

## Get code

1. Clone repository: ` git clone git@github.com:VladSavitsky/trello.lanugages.git`
2. Open folder: `cd trello.languages`
3. Happy hacking!

## Use newest version in browser.

To add recently downloaded extension to chrome use this instruction: https://developer.chrome.com/extensions/getstarted#unpacked



