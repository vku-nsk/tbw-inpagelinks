'use strict';

const gulp = require('gulp');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass')(require('sass'));
const rename=require('gulp-rename');
const terser=require('gulp-terser');

const paths = {
    scripts: ['inpagelinks/**.js'],
    styles: ['inpagelinks/ui/sass/**.scss']
};

const clean = function () {
    return del([
      'dist/**/*',
    ]);};

const pluginScripts = function () {
    return gulp.src(paths.scripts)
        .pipe(gulp.dest('dist/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(terser())
        .pipe(gulp.dest('dist/'));
};

const pluginStyles = function () {
    return gulp.src(paths.styles)
        .pipe(sass())
        .pipe(gulp.dest('dist/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/'))
};


const build = gulp.series(clean, gulp.parallel(pluginScripts, pluginStyles));

module.exports = {
    default: build,
    clean,
    build,
};