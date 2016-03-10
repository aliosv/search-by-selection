([
    {
        tech : 'js',
        shouldDeps : [
            { block : 'settings', elem : 'item', tech : 'bemhtml' }
        ]
    },
    {
        shouldDeps : [
            { elems : ['add', 'item'] },
            'autocomplete',
            'search-systems',
            { block : 'functions', elem : 'debounce' }
        ]
    }
])
