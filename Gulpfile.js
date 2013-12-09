var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');

gulp.task('scripts', function() {
  gulp.src(["./src/TSS/Resources/js/*"])
      .pipe(concat('main.js'))
      .pipe(gulp.dest("./web/js/"))
});

gulp.task('stylesheets', function() {
  gulp.src(["./src/TSS/Resources/css/*"])
      .pipe(concat('main.css'))
      .pipe(minifyCSS({keepSpecialComments: 0}))
      .pipe(gulp.dest("./web/css/"))
});

gulp.task('fonts', function() {
  gulp.src(["./src/TSS/Resources/fonts/*"])
      .pipe(gulp.dest("./web/fonts"));
});

gulp.task('default', function() {
  gulp.run('scripts', 'stylesheets', 'fonts');
});