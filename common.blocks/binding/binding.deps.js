([
    {
        tech : 'js',
        shouldDeps : [
            { elem : 'status', tech : 'bemhtml' },
            {
                block : 'button',
                mods : { theme : 'islands' },
                tech : 'bemhtml'
            },
            {
                block : 'input',
                mods : { 'has-clear' : true, theme : 'islands' },
                tech : 'bemhtml'
            }
        ]
    },
    {
        shouldDeps : [
            { elems : ['status'] },
            'keypress',
            { block : 'functions', elem : 'debounce' },
            { block : 'button', mods : { theme : 'islands' } },
            { block : 'input', mods : { 'has-clear' : true, theme : 'islands' } }
        ]
    }
])
