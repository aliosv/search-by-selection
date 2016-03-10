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
        },
        extension = {
            init : function() {
                var checkBackgroundTimer,
                    destroy = function() {
                        extension.destroy();
                        clearInterval(checkBackgroundTimer);
                    };

                // Not respond background page means, that extension was disabled, in this case need to destroy client
                // script(it will created again, when extension would be enabled).
                checkBackgroundTimer = setInterval(function() {
                    try {
                        chrome.runtime.sendMessage('echo', function(res) {
                            if(!res) destroy();
                        });
                    } catch(e) {
                        destroy();
                    }
                }, 1000);

                listenCombosFromConfig();
            },
            update : function() {
                listener.reset();
                listenCombosFromConfig();
            },
            destroy : function() {
                listener.destroy();
                extension = undefined;
            }
        };

    // listen extension settings change
    chrome.storage.onChanged.addListener(extension.update);

    extension.init();
});
