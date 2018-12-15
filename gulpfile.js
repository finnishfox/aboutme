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

const distFolder = 'dist';


gulp.task('connect', () =>
    connect.server({
        root: distFolder
    }));

gulp.task('html', ['svg-sprite'], () =>
    gulp.src('./src/pages/*.html')
        .pipe(include())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(`./${distFolder}`))
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
        .pipe(gulp.dest(`./${distFolder}`))
);



gulp.task('sass-to-css', () => gulp.src(['src/styles/reset.css', 'src/styles/blocks/*.scss'])
    .pipe(sass())
    .pipe(concat('styles.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(`./${distFolder}/styles`)));


gulp.task('imagemin', () =>
    gulp.src('src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(`./${distFolder}/images`))
);

gulp.task('watch', () =>
    gulp.watch(['./src/**/**'], [
        'html',
        'sass-to-css']));

gulp.task('default', ['html', 'connect', 'sass-to-css', 'imagemin', 'watch']);
