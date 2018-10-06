/** @class search-systems */
modules.define('search-systems', ['jquery'], function(provide, $) {
    $.get('search-systems.json').always(function(res, type) {
        provide(type === 'success' ? res : {});
    });
});
