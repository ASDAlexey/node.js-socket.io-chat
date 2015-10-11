var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var livereload = require('gulp-livereload');

gulp.task('default', function () {
    nodemon({
        script: 'index.js',
        ext: 'js',
        env: {
            PORT: 8080
        },
        egnore: ['./node_modules/**']
    }).on('restart', function () {
        gulp.src('index.js')
            .pipe(livereload());
            //.pipe(notify('Reloading page, please wait...'));
    });
});