({
    block : 'page',
    js : true,
    title : 'Desktop blocks',
    head : [{ elem : 'css', url : 'options.css' }],
    scripts : [{ elem : 'js', url : 'options.js' }],
    mods : { theme : 'islands' },
    content : [
        {
            tag : 'h1',
            content : 'Search by selection plugin settings'
        },

        { block : 'settings' }
    ]
});
