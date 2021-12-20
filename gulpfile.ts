const { src, dest, task, parallel, watch } = require('gulp');
const webpack = require("webpack-stream");

const webpackConfig = require('./webpack.config.js');

const buildES6 = function() {

    let config = {...webpackConfig, ...{
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
            output: {
                filename: 'slickscroll.min.js',
                library: {
                    name: "slickscroll",
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
            output: {
                filename: 'slickscroll.node.min.js',
                library: {
                    name: "slickscroll",
                    type: 'commonjs'
                }
            }
        }
    };

    return src("src/index.ts")
        .pipe(webpack(config))
        .pipe(dest("dist/"))
}

task("build", parallel(buildES5, buildES6, buildNode))
task('watch', function () {
    watch('src/index.ts', parallel(buildES5, buildES6, buildNode));
})