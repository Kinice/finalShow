var gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create(),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    reload = browserSync.reload;


gulp.task('less', function(){
    gulp.src('public/less/*.less')
        .pipe(less())
        .pipe(minifycss())
        .pipe(gulp.dest('public/static/css'))
        .pipe(reload({stream:true}));
});
gulp.task('script', function(){
    gulp.src('public/js/*.js')
        .pipe(rename({suffix:'.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/static/js'));
});
gulp.task('browser-sync',['script','less'],function(){
    browserSync.init({
        proxy: 'http://localhost:3000',
        baseDir: './',
        port: 3000,
        uiPort: 3000
    });
    gulp.watch('public/less/*.less',['less']);
    gulp.watch('public/js/*.js',['script']);
    gulp.watch('public/static/css/*.css').on('change',reload);
    gulp.watch('public/static/js/*.js').on('change',reload);
    gulp.watch('views/*.ejs').on('change',reload);
});
gulp.task('default',['browser-sync'], function(){
    console.log('Mission Complete');
});