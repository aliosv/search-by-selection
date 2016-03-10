/* global chrome */

/** @class settings */
modules.define('settings', [
    'i-bem__dom', 'BEMHTML', 'jquery', 'search-systems', 'functions__debounce'
], function(provide, BEMDOM, BEMHTML, $, searchSystems, debounce) {
    provide(BEMDOM.decl(this.name, /** @lends settings.prototype */{
        onSetMod : {
            js : {
                inited : function() {
                    var _this = this,
                        defaultSettings = searchSystems,
                        autocomplete = $(BEMHTML.apply({
                            block : 'autocomplete',
                            directions : ['bottom-left']
                        })).bem('autocomplete'),
                        addItem = function(prepend, val) {
                            var $item = this.__self.addItem.bind(this.__self, this.elem('items'))(prepend, val),
                                binding = this.findBlockOn($item, 'binding');

                            autocomplete.setAnchor([binding.findBlockInside(binding.elem('url'), 'input')]);
                        }.bind(this);

                    BEMDOM.append(this.domElem, autocomplete.domElem);
                    autocomplete.setData(Object.keys(defaultSettings).map(function(key) {
                        return { text : key, val : defaultSettings[key] };
                    }));
                    // input for disable autocomplete destructing, when all target anchors destructed
                    autocomplete.setAnchor($(BEMHTML.apply({ block : 'input' })).bem('input'));

                    chrome.storage.sync.get('settings', function(res) {
                        var data = res && res.settings || {};

                        Object.keys(data).forEach(function(key) {
                            addItem({ url : key, combo : data[key].combo, enabled : data[key].enabled });
                        });
                        addItem(true);
                        _this.domElem.find('input:eq(0)').focus();
                    });

                    this.findBlockOn(this.elem('add'), 'button').on('click', addItem.bind(null, true));

                    BEMDOM.blocks.binding.on('change delete', debounce(function() {
                        var data = Array.prototype.reduce.call(_this.findBlocksInside('binding'), function(prev, v) {
                            var val = v.getVal();
                            prev[val.url] = { combo : val.combo, enabled : val.enabled };
                            return prev;
                        }, {});

                        _this.__self.save(data);
                    }, 200));
                }
            }
        }
    }, /** @lends settings */{
        getItem : function(obj) {
            var data = obj || {};

            return $(BEMHTML.apply({
                block : 'settings',
                elem : 'item',
                elemMods : { disabled : !data.enabled },
                url : data.url,
                combo : data.combo && data.combo.join(','),
                'combo-string' : BEMDOM.blocks.binding.keyCodesToString(data.combo),
                ico : BEMDOM.blocks.binding.getIcoUrl(data.url)
            }));
        },
        addItem : function(target, prepend, obj) {
            var $item = this.getItem(typeof prepend === 'object' ? prepend : obj);

            BEMDOM[prepend === true ? 'prepend' : 'append'](target, $item);

            return $item;
        },
        /**
         * Saves settings
         * @param {Object} data Format: key - url<String>, value - { combo<Number[]>, enabled<Boolean> }
         */
        save : function(data) {
            chrome.storage.sync.set({
                settings : Object.keys(data)
                    .filter(function(key) { return !!key; })
                    .reduce(function(prev, key) {
                        prev[key] = data[key];
                        if(!data[key].combo) delete prev[key].enabled;
                        return prev;
                    }, {})
            });
        }
    }));
});
