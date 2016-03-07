/* global chrome */

/** @class content */
modules.require('keypress', function(keypress) {
    var listener = new keypress.Listener(),
        comboPressHandler = function(url) {
            var text = document.getSelection().toString();

            if(!text) return true;

            window.open(url.replace('%s', text));
        },
        listenCombosFromConfig = function() {
            chrome.storage.sync.get('settings', function(res) {
                var data = res.settings || {};

                Object.keys(data).forEach(function(url) {
                    if(!(data[url].enabled && data[url].combo)) return;

                    listener.simple_combo(data[url].combo.map(function(key) {
                        return keypress._keycode_dictionary[key];
                    }).join(' '), function() { comboPressHandler(url); });
                });
            });
        };

    // listen extension settings change
    chrome.storage.onChanged.addListener(function() {
        listener.reset();
        listenCombosFromConfig();
    });

    listenCombosFromConfig();
});
