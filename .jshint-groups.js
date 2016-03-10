module.exports = {
    options : {
        boss : true,
        eqeqeq : true,
        evil : true,
        expr : true,
        forin : true,
        immed : true,
        loopfunc : true,
        maxdepth : 4,
        maxlen : 120,
        newcap : true,
        noarg : true,
        noempty : true,
        nonew : true,
        onecase : true,
        quotmark : 'single',
        sub : true,
        supernew : true,
        trailing : true,
        undef : true,
        unused : true
    },

    groups : {
        browserjs : {
            options : {
                browser : true,
                predef : ['modules']
            },
            includes : ['*.blocks/**/*.js'],
            excludes : [
                '**/*.bemdecl.js',
                '**/*.deps.js'
            ]
        },

        bemdecl : {
            options : {
                asi : true,
                quotmark : false,
                predef : ['exports']
            },
            includes : ['*.bundles/**/*.bemdecl.js']
        },

        bemjson : {
            includes : ['*.bundles/**/*.bemjson.js']
        },

        bemhtml : {
            options : {
                predef : [
                    'apply',
                    'applyCtx',
                    'applyNext',
                    'attrs',
                    'bem',
                    'block',
                    'cls',
                    'content',
                    'def',
                    'elem',
                    'js',
                    'local',
                    'match',
                    'mix',
                    'mod',
                    'mode',
                    'tag'
                ]
            },
            includes : ['*.blocks/**/*.bemhtml']
        },

        depsjs : {
            options : {
                asi : true
            },
            includes : ['*.blocks/**/*.deps.js']
        }
    }
};
