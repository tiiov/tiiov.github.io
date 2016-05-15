var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
// $.<plugin-name> call plugin from node_modules without require
// $.imagemin
var $ = require('gulp-load-plugins')();

var sassPaths = [
  'node_modules/bootstrap-sass/assets/stylesheets',
];

var jsPaths = [
  'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
];

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: "./dist"
    },
    port: 8000,
    open: true
  });
});

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('images', function() {
	gulp.src('src/images/**/*')
	.pipe($.imagemin({
		optimizationLevel: 3,
		progressive: true,
		interlaced: true
	}))
	.pipe(gulp.dest('dist/images'));
});

gulp.task('sprite', function() {
  var spriteData = gulp.src('src/images/sprites/*.png')
    .pipe($.spritesmith({
      imgName: '/images/sprite.png',
      cssName: 'sprite.scss',
    }));
    spriteData.img.pipe(gulp.dest('dist/images'));
    spriteData.css.pipe(gulp.dest('src/scss'));
});

gulp.task('scripts', function() {
  return gulp.src([
		'src/scripts/*.js',
    'node_modules/jquery/dist/jquery.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
	])
    .pipe($.uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function() {
  return gulp.src('src/scss/app.scss')
    .pipe($.sass({
      includePaths: sassPaths
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('default', ['scripts', 'sprite', 'sass', 'browser-sync'], function() {
  gulp.watch(['src/scripts/**/*.js'], ['scripts']);
  gulp.watch(['src/scss/**/*.scss', 'dist/css/**/*.css'], ['sass']);
  gulp.watch(['src/images/sprites/**/*'], ['sprite']);
  gulp.watch('dist/*.html', ['reload']);
});
