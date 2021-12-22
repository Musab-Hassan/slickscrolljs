/**************************************
*
*  Build production builds with 'npm run build'
*  Watch to build for production with 'npm run watch'
*  Build dev builds with 'npm run dev'
*  Watch to build dev builds with 'npm run watch-dev'
*
***************************************/


const { src, dest, task, parallel, watch } = require('gulp');
const webpack = require("webpack-stream");

const webpackConfig = require('./webpack.config.js');

/* Production Builds */
const buildES6 = function() {

    let config = {...webpackConfig, ...{
        mode: "production",
        experiments: {
            outputModule: true,
        },
        output: {
            filename: 'slickscroll.es.min.js',
            library: {
                type: 'module'
            }
        }
    }};

    return src("src/index.ts")
    .pipe(webpack(config))
    .pipe(dest("dist/"))
}

const buildES5 = function() {
    let config = {
        ...webpackConfig, ...{
            mode: "production",
            output: {
                filename: 'slickscroll.min.js',
                library: {
                    name: "slickScroll",
                    type: 'var'
                }
            }
        }
    };

    return src("src/index.ts")
        .pipe(webpack(config))
        .pipe(dest("dist/"))
}

const buildNode = function() {
    let config = {
        ...webpackConfig, ...{
            mode: "production",
            output: {
                filename: 'slickscroll.node.min.js',
                library: {
                    name: "slickScroll",
                    type: 'commonjs'
                }
            }
        }
    };

    return src("src/index.ts")
        .pipe(webpack(config))
        .pipe(dest("dist/"))
}

task("build", parallel(buildES5, buildES6, buildNode));
task('watch', function () {
    watch('src/**', parallel(buildES5, buildES6, buildNode));
});










/* Dev Builds */
const buildES6Dev = function () {

    let config = {
        ...webpackConfig, ...{
            mode: "development",
            devtool: "source-map",
            experiments: {
                outputModule: true,
            },
            output: {
                filename: 'build.es.js',
                library: {
                    type: 'module'
                }
            }
        }
    };

    return src("src/index.ts")
        .pipe(webpack(config))
        .pipe(dest("builds/"))
}

const buildES5Dev = function () {
    let config = {
        ...webpackConfig, ...{
            mode: "development",
            devtool: "source-map",
            output: {
                filename: 'build.js',
                library: {
                    name: "slickScroll",
                    type: 'var'
                }
            }
        }
    };

    return src("src/index.ts")
        .pipe(webpack(config))
        .pipe(dest("builds/"))
}

const buildNodeDev = function () {
    let config = {
        ...webpackConfig, ...{
            mode: "development",
            devtool: "source-map",
            output: {
                filename: 'build.node.js',
                library: {
                    name: "slickScroll",
                    type: 'commonjs'
                }
            }
        }
    };

    return src("src/index.ts")
        .pipe(webpack(config))
        .pipe(dest("builds/"))
}

task("dev", parallel(buildES5Dev, buildES6Dev, buildNodeDev));
task('watch-dev', function () {
    watch('src/**', parallel(buildES5Dev, buildES6Dev, buildNodeDev));
});