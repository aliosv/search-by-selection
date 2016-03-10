([
    {
        tech : 'js',
        shouldDeps : [
            { block : 'i-bem', tech : 'bemhtml' },
            { block : 'menu', mods : { theme : 'islands' }, tech : 'bemhtml' },
            { block : 'menu-item', mods : { theme : 'islands' } },
            { block : 'popup', mods : { target : 'anchor', theme : 'islands' }, tech : 'bemhtml' },
            { block : 'spin', mods : { theme : 'islands' }, tech : 'bemhtml' }
        ]
    },
    {
        shouldDeps : [
            'vow',
            { block : 'functions', elems : ['debounce'] },
            { block : 'menu', mods : { theme : 'islands' } },
            { block : 'menu-item', mods : { theme : 'islands' } },
            { block : 'popup', mods : { target : 'anchor', theme : 'islands' } },
            { block : 'spin', mods : { theme : 'islands' } }
        ]
    }
])
