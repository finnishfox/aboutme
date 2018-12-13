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

gulp.task('html', ['svg-sprite'], () =>
    gulp.src('./src/pages/*.html')
        .pipe(include())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload()));

gulp.task('svg-sprite', () =>
    gulp.src('src/images/svg/*.svg')
        .pipe(svgmin())
        .pipe(svgSprite({
            shape: {
                transform: [
                    {
                        svgo: {
                            plugins: [
                                {removeStyleElement: false},
                                {inlineStyles: false}
                            ]
                        }
                    }
                ]
            },
            svg: {
                xmlDeclaration: false,
                doctypeDeclaration: false,
                namespaceIDs: false,
                namespaceClassnames: false,
                dimensionAttributes: true,
            },
            mode:
                {
                    symbol: {
                        inline: true,
                        sprite: "sprite.svg",
                        dest: 'svgsprite',
                        example: false,
                    }
                }
        }))
        .pipe(gulp.dest('./dist'))
);

gulp.task('copy', () =>
    gulp.src('src/fonts/**/*', {
        base: 'src'
    }).pipe(gulp.dest('./dist')));


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
        'copy']));

gulp.task('default', ['html', 'connect', 'sass-to-css', 'imagemin', 'watch']);
