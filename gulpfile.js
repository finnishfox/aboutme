const gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-html-minifier2'),
    cleanCSS = require('gulp-clean-css'),
    svgmin = require('gulp-svgmin'),
    svgSprite = require('gulp-svg-sprite'),
    imagemin = require('gulp-imagemin'),
    include = require("gulp-include");


gulp.task('connect', () =>
    connect.server({
        root: 'dist'
    }));

gulp.task('html',
    () =>
    gulp.src('./src/pages/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload()));


gulp.task('sass-to-css', () => gulp.src(['src/styles/reset.css', 'src/styles/blocks/*.scss'])
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./dist/styles')));


gulp.task('imagemin', () =>
    gulp.src('src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
);

gulp.task('watch', () =>
    gulp.watch(['./src/**/**'], [
        'html',
        'sass-to-css',
        ]));

gulp.task('default', ['html', 'connect', 'sass-to-css', 'imagemin', 'watch']);
