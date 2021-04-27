
const { src, dest, task, parallel, watch } = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');


task('transpileES6', function() {
    return src("src/index.ts")
        .pipe(ts({
            noImplicitAny: true,
            target: "es6",
            module: "es2015",
            lib: ["DOM", "es6", "es2015"],
            strict: true,

        }))
        .pipe(rename('index.es.js'))
        .pipe(dest('src/'))

        .pipe(uglify())
        .pipe(rename('slickscroll.es.min.js'))
        .pipe(dest('dist/'));
});


task('transpileES5', function() {
    return src("src/index.ts")
        .pipe(ts({
            noImplicitAny: true,
            target: "es5",
            module: "es2015",
            lib: ["DOM", "es5"]
        }))
        // remove 'export' from es5 file
        .pipe(replace(/export(.*?)\;/, ' '))
        .pipe(rename('index.js'))
        .pipe(dest('src/'))

        .pipe(uglify())
        .pipe(rename('slickscroll.min.js'))
        .pipe(dest('dist/'));
});

task('build', parallel('transpileES6', 'transpileES5'));

task('watch', function() {
    watch('src/index.ts', parallel('build'));
})