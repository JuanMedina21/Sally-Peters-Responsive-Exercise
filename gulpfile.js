'use strict';
var host = '';
var user = '';
var pass = '';
var path = '';

var gulp =      require('gulp'),
    gutil =     require('gulp-util'),
    concat =    require('gulp-concat'),
    pug =       require('gulp-pug'),
    sass =      require('gulp-sass'),
    gmin =      require('gulp-imagemin'),
    ftp =       require('gulp-ftp'),
    watch =     require('gulp-watch'),
    connect =   require('gulp-connect'),
    eslint =    require('gulp-eslint'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify =    require('gulp-uglify'),
    babel =     require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps');

var staticFolder = 'static';
var themeFolder = 'wp-theme';

//Compiles .pug files into .html files at the root level.
gulp.task('html', function(){
    return gulp.src('markup/*.pug')
        .pipe(pug({
            pretty: true,
            basedir: __dirname + '/markup/'
        }))
        .pipe(gulp.dest('../' + staticFolder + '/'))
        .pipe(connect.reload());
});

//Compiles .scss files into .css files at the root level.
gulp.task('styles', function(){
    return gulp.src('styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('../' + staticFolder))
        .pipe(gulp.dest('../wp-content/themes/' + themeFolder))
        .pipe(connect.reload());
});

gulp.task('lint', function(){
    return gulp.src(['scripts/**/*.js'])
        .pipe(eslint({fix: true}))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

//Compiles .js files into .js files in the JS folder inside of the Assets folder.
gulp.task('scripts', function(){
    return gulp.src('scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('../' + staticFolder + '/assets/js'))
        .pipe(gulp.dest('../wp-content/themes/' + themeFolder + '/assets/js'))
        .pipe(connect.reload());
});

//Compiles image files (.jpg, .jpeg, .png, .gif, .svg) into the Images folder inside of the Assets folder.
gulp.task('images', function(){
    return gulp.src('images/**/*.{jpg,jpeg,png,gif,svg}')
        .pipe(gmin())
        .pipe(gulp.dest('../' + staticFolder + '/assets/images/'))
        .pipe(gulp.dest('../wp-content/themes/' + themeFolder + '/assets/images'))
        .pipe(connect.reload());
});

gulp.task('server', function() {
    return connect.server({
        port: 8181,
        livereload: true,
        root: '../' + staticFolder
    });
});

gulp.task('build', ['html', 'styles', 'images', 'scripts']);

//Minify Images
gulp.task('default', ['server'], function(){
    gulp.watch('markup/**/*.pug', ['html']);
    gulp.watch('styles/**/*.scss', ['styles']);
    gulp.watch('scripts/*.js', ['scripts']);
    gulp.watch('images/**/*', ['images']);
});

gulp.task('deploy', function(){
    return gulp.src('../' + folder + '/**/*')
        .pipe(ftp({
            host: host,
            user: user,
            pass: pass,
            remotePath: path
        }))
        .pipe(gutil.noop());
});


