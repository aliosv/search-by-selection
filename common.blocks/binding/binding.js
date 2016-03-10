/** @class binding */
modules.define('binding', [
    'i-bem__dom', 'BEMHTML', 'jquery', 'keypress', 'functions__debounce'
], function(provide, BEMDOM, BEMHTML, $, keypress, debounce) {
    provide(BEMDOM.decl(this.name, /** @lends binding.prototype */{
        onSetMod : {
            js : {
                inited : function() {
                    var _this = this;

                    this.on('change', debounce(function(e) {
                        if(_this.findElem(e.target.domElem, 'url').length) {
                            BEMDOM.replace(_this.findBlockInside(_this.findElem('status'), 'icon').domElem,
                                $(BEMHTML.apply({
                                    block : 'icon',
                                    url : _this.__self.getIcoUrl(e.target.getVal().url)
                                })));
                        }
                    }, 200));
                }
            },

            disabled : function() {
                this.emit('change');

                BEMDOM.replace(this.findElem('status'), $(BEMHTML.apply({
                    block : 'binding',
                    elem : 'status',
                    checked : this.getVal().enabled,
                    ico : this.__self.getIcoUrl(this.getVal().url)
                })));
            }
        },

        getVal : function() {
            return {
                url : this.findBlockOn(this.elem('url'), 'input').getVal(),
                combo : this.elem('combo-val').val().split(','),
                enabled : !this.hasMod('disabled')
            };
        },

        setVal : function(val) {
            if(!val) return this;

            val.hasOwnProperty('url') && this.findBlockOn(this.elem('url'), 'input').setVal(val.url);
            if(val.hasOwnProperty('combo')) {
                this.findBlockOn(this.elem('combo'), 'input').setVal(this.__self.keyCodesToString(val.combo));
                this.elem('combo-val').val(val.combo.join(','));
            }
        }
    }, /** @lends binding */{
        keyCodeToString : function(code) {
            var str = code !== '' && keypress._keycode_dictionary[+code];

            return str ? str[0].toUpperCase() + str.slice(1) : code;
        },
        keyCodesToString : function(keys) {
            return (keys || []).map(this.keyCodeToString).join(' + ');
        },
        getIcoUrl : function(url) {
            var re = /^(?:.*\/\/)?([^/]+(?:\.[^/]+)+).*$/,
                domain = url && re.test(url) && url.replace(re, '$1');

            return domain && 'http://www.google.com/s2/favicons?domain=' + domain || undefined;
        },

        live : function() {
            var pressedKeys = [],
                sequence = [],
                timeout;

            this.liveBindTo('combo', 'keydown', function(e) {
                pressedKeys.indexOf(e.keyCode) === -1 && pressedKeys.push(e.keyCode);
                sequence = pressedKeys.slice();
                this.setVal({ combo : pressedKeys });

                e.preventDefault();
            });
            this.liveBindTo('combo', 'keyup', function(e) {
                pressedKeys.splice(pressedKeys.indexOf(e.keyCode), 1);

                timeout = timeout || setTimeout(function() {
                    this.setVal({ combo : !pressedKeys.length && sequence.length > 1 ? sequence : pressedKeys });
                    sequence = pressedKeys.slice();
                    timeout = undefined;
                }.bind(this), 100);

                e.preventDefault();
            });
            this.liveBindTo('combo', 'blur', function() { pressedKeys = []; });
            this.liveInitOnBlockInsideEvent('click', 'button', function(e) {
                if(this.findElem(e.target.domElem, 'delete').length) {
                    this.emit('delete');
                    BEMDOM.destruct(this.domElem);
                } else if(this.findElem(e.target.domElem, 'status').length) {
                    this.setMod('disabled', !e.target.getMod('checked'));
                }
            });
            this.liveInitOnBlockInsideEvent('change', 'input', function() { this.emit('change'); });
        }
    }));
});
