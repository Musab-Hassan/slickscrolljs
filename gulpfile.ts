/*

To build index.ts, use one of the following commands:

* gulp build-dev - Builds source JS files
* gulp build-prod - Builds source JS files and minified production files
* gulp watch-dev - Watches for changes in index.ts and then runs build-dev
* gulp watch-dev - Watches for changes in index.ts and then runs build-prod

*/


const { src, dest, task, parallel, watch } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

let tsConfigs = {
    es6: {
        noImplicitAny: true,
        target: "es6",
        module: "es2015",
        lib: ["DOM", "es6", "es2015"],
        strict: true,
    },

    es5: {
        noImplicitAny: true,
        target: "es5",
        module: "es2015",
        lib: ["DOM", "es5"]
    },

    node: {
        noImplicitAny: true,
        target: "es5",
        module: "commonjs",
        lib: ["DOM", "es5"],
        moduleResolution: "node",
    }
}

// ES6
const transpileMinifyES6 = function () {
    return src("src/index.ts")
        .pipe(ts(tsConfigs.es6))
        .pipe(rename('index.es.js'))
        .pipe(dest('src/'))

        .pipe(uglify())
        .pipe(rename('slickscroll.es.min.js'))
        .pipe(dest('dist/'));
}

const transpileES6 = function () {
    return src("src/index.ts")
        .pipe(ts(tsConfigs.es6))
        .pipe(rename('index.es.js'))
        .pipe(dest('src/'));
}


// ES5
const transpileMinifyES5 = function () {
    return src("src/index.ts")
        .pipe(ts(tsConfigs.es5))
        // remove 'export' from es5 file
        .pipe(replace(/export(.*?)\;/, ' '))
        .pipe(rename('index.js'))
        .pipe(dest('src/'))

        .pipe(uglify())
        .pipe(rename('slickscroll.min.js'))
        .pipe(dest('dist/'));
}

const transpileES5 = function () {
    return src("src/index.ts")
        .pipe(ts(tsConfigs.es5))
        // remove 'export' from es5 file
        .pipe(replace(/export(.*?)\;/, ' '))
        .pipe(rename('index.js'))
        .pipe(dest('src/'));
}


// Node
const transpileMinifyNode = function () {
    return src("src/index.ts")
        .pipe(ts(tsConfigs.node))

        .pipe(uglify())
        .pipe(rename('slickscroll.min.node.js'))
        .pipe(dest('dist/'));
}

const transpileNode = function () {
    return src("src/index.ts")
        .pipe(ts(tsConfigs.node));
}


// Build tasks that should be used

const buildDev = parallel(transpileES6, transpileES5, transpileNode);
buildDev.description = "Builds src/index.ts into source js files";

const buildProd = parallel(transpileMinifyES6, transpileMinifyES5, transpileMinifyNode);
buildProd.description = "Builds src/index.ts into source js files and minified production js files";

task('build-dev', buildDev);
task('build-prod', buildProd);

task('watch-dev', function () {
    watch('src/index.ts', buildDev);
})

task('watch-prod', function () {
    watch('src/index.ts', buildProd);
})