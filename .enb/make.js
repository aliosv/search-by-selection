var levels = require('enb-bem-techs/techs/levels'),
    provide = require('enb/techs/file-provider'),
    bemdeclFromBemjson = require('enb-bem-techs/techs/bemdecl-from-bemjson'),
    deps = require('enb-bem-techs/techs/deps-old'),
    files = require('enb-bem-techs/techs/files'),
    fileCopy = require('enb/techs/file-copy'),
    bemhtml = require('enb-bemxjst/techs/bemhtml-old'),
    browserJs = require('enb-diverse-js/techs/browser-js'),
    ym = require('enb-modules/techs/prepend-modules'),
    css = require('enb-stylus/techs/css-stylus'),
    html = require('enb/techs/html-from-bemjson'),
    borschik = require('enb-borschik/techs/borschik'),
    autoprefixer = require('enb-autoprefixer/techs/css-autoprefixer'),
    depsByTechToBemdecl = require('enb-bem-techs/techs/deps-by-tech-to-bemdecl'),
    mergeFiles = require('enb/techs/file-merge'),

    pathSep = process.platform === 'win32'? '\\' : '/';

module.exports = function(config) {
    config.nodes([
        'desktop.bundles' + pathSep + 'background',
        'desktop.bundles' + pathSep + 'content'
    ], function(nodeConfig) {
        configureFiles(nodeConfig, 'bemdecl');
        configureJs(nodeConfig, { ym : nodeConfig._baseName !== 'background' });
    });

    config.node('desktop.bundles' + pathSep + 'options', function(nodeConfig) {
        configureFiles(nodeConfig, 'bemjson');
        configureBemhtml(nodeConfig);
        configureCss(nodeConfig);
        configureJs(nodeConfig, { bemhtml : true, ym : true });
        configureHtml(nodeConfig);
    });

    config.node('desktop.bundles' + pathSep + 'plugin', function(nodeConfig) {
        var targets = [
            'background.js',
            'content.js',
            'options.html',
            'options.js',
            'options.css'
        ];

        nodeConfig.addTechs(targets.map(function(target) {
            var bundleName = target.split('.')[0],
                targetExt = target.split('.')[1];

            return [fileCopy, {
                sourceNode : 'desktop.bundles' + pathSep + bundleName,
                source : (targetExt === 'html' ? '' : '_') + '?.' + targetExt,
                target : bundleName + '.' + targetExt
            }];
        }));

        nodeConfig.addTargets(targets);
    });
};

function getLevels() {
    return [
        'libs/bem-core/common.blocks',
        'libs/bem-core/desktop.blocks',
        'libs/bem-components/common.blocks',
        'libs/bem-components/desktop.blocks',
        'libs/bem-components/design/common.blocks',
        'libs/bem-components/design/desktop.blocks',
        'common.blocks'
    ];
}

/**
 * Добавляет таргеты ?.files и ?.dirs в сборку.
 * @param {Object} nodeConfig
 * @param {String} provideTech
 * @returns {Array}
 */
function configureFiles(nodeConfig, provideTech) {
    nodeConfig.addTechs((provideTech === 'bemjson' ? [
        [provide, { target : '?.bemjson.js' }],
        [bemdeclFromBemjson]
    ] : [
        [provide, { target : '?.bemdecl.js' }]
    ]).concat([
        [levels, { levels : getLevels([nodeConfig._baseName]) }],
        [deps],
        [files]
    ]));
}

/**
 * Добавляет таргет ?.bemhtml в сборку. Зависит от files.
 * @param {Object} nodeConfig
 * @returns {Array}
 */
function configureBemhtml(nodeConfig) {
    nodeConfig.addTechs([[bemhtml, { devMode : false }]]);

    nodeConfig.mode('development', function(nodeConfig) {
        nodeConfig.addTechs([[fileCopy, { source : '?.bemhtml.js', target : '_?.bemhtml.js' }]]);
    });

    nodeConfig.mode('production', function(nodeConfig) {
        nodeConfig.addTechs([[borschik, { source : '?.bemhtml.js', target : '_?.bemhtml.js' }]]);
    });

    nodeConfig.addTargets(['_?.bemhtml.js']);
}

/**
 * Добавляет таргет ?.css в сбоку. Зависит от files.
 * @param {Object} nodeConfig
 * @returns {Array}
 */
function configureCss(nodeConfig) {
    nodeConfig.addTechs([
        [css, { target : '?.noprefix.css', filesTarget : '?.files' }],
        [autoprefixer, {
            sourceTarget : '?.noprefix.css',
            destTarget : '?.css',
            browserSupport : [
                'last 2 versions',
                'ie 10',
                'ff 24',
                'opera 12.16'
            ]
        }]
    ]);

    nodeConfig.mode('development', function(nodeConfig) {
        nodeConfig.addTechs([
            // борщик нужен для фриза картинок и шрифтов, раскрытия инклудов
            [borschik, { source : '?.css', target : '_?.css', freeze : true, minify : false }]
        ]);
    });

    nodeConfig.mode('production', function(nodeConfig) {
        nodeConfig.addTechs([
            [borschik, { source : '?.css', target : '_?.css', freeze : true, tech : 'cleancss' }]
        ]);
    });

    nodeConfig.addTargets(['_?.css']);
}

/**
 * Добавляет таргет ?.js в сборку. Зависит от files.
 * @param {Object} nodeConfig
 * @param {Object} params
 * @param {Boolean} params.bemhtml
 * @param {Boolean} params.ym
 * @returns {Array}
 */
function configureJs(nodeConfig, params) {
    var addBemhtml = !!(params && params.bemhtml),
        addYm = !!(params && params.ym);

    nodeConfig.addTechs([
        [browserJs, { filesTarget : '?.files' }]
    ].concat(addBemhtml ? [
            [depsByTechToBemdecl, {
                target : '?.bemhtmlFromJs.bemdecl.js',
                sourceTech : 'js',
                destTech : 'bemhtml'
            }],
            [deps, {
                bemdeclFile : '?.bemhtmlFromJs.bemdecl.js',
                target : '?.bemhtmlFromJs.deps.js'
            }],
            [files, {
                depsFile : '?.bemhtmlFromJs.deps.js',
                filesTarget : '?.bemhtmlFromJs.files',
                dirsTarget : '?.bemhtmlFromJs.dirs'
            }],
            [bemhtml, {
                target : '?.client.bemhtml.js',
                filesTarget : '?.bemhtmlFromJs.files',
                devMode : false
            }],
            [mergeFiles, {
                target : '?.js',
                sources : ['?.browser.js', '?.client.bemhtml.js']
            }]
        ] : [
            [fileCopy, { source : '?.browser.js', target : '?.js' }]
        ]).concat(addYm ? [[ym, { source : '?.js', target : '?.ym.js' }]] : []));

    nodeConfig.mode('development', function(nodeConfig) {
        nodeConfig.addTechs([[borschik, { source : addYm ? '?.ym.js' : '?.js', target : '_?.js', minify : false }]]);
    });

    nodeConfig.mode('production', function(nodeConfig) {
        nodeConfig.addTechs([[borschik, { source : addYm ? '?.ym.js' : '?.js', target : '_?.js', freeze : true }]]);
    });

    nodeConfig.addTargets(['_?.js']);
}

/**
 * Добавляет таргет ?.css в сбоку. Зависит от files.
 * @param {Object} nodeConfig
 * @returns {Array}
 */
function configureHtml(nodeConfig) {
    nodeConfig.addTechs([
        [html]
    ]);

    nodeConfig.addTargets(['?.html']);
}
