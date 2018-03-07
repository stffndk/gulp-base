// Require all the things:
var gulp          = require("gulp");
var plumber       = require("gulp-plumber");
var rename        = require("gulp-rename");
var autoprefixer  = require("gulp-autoprefixer");
var concat        = require("gulp-concat");
var cache         = require("gulp-cache");
var imagemin      = require("gulp-imagemin");
var inlineCss     = require("gulp-inline-css");

// CSS stuff
var sass          = require("gulp-sass");
var sourcemaps    = require('gulp-sourcemaps');
var minifyCSS     = require("gulp-minify-css");
var browserSync   = require("browser-sync");
var postcss       = require('gulp-postcss');
var split         = require("postcss-split");

// SVG stuff
var svgSprite     = require("gulp-svg-sprites");
var filter        = require('gulp-filter');
var svg2png       = require('gulp-svg2png');

var clean         = require("gulp-clean");
var notify        = require("gulp-notify");

var paths = {
   sass_src : "assets/src/sass/**/*.scss",
   css_dest : "assets/build/css/",
   img_src: [
              "assets/src/img/**/*.jpg",
              "assets/src/img/**/*.png"
   ],
   img_dest:  "assets/build/img/",
   svg_src:   "assets/src/svg/**/*.svg",
   svg_dest:  "assets/build/svg/"
};

// Delete unwanted files
gulp.task("clean", function() {
  return gulp.src("**/.DS_Store")
    .pipe(clean())
    .pipe(notify("Clean complete!"));
});

// Minify images
gulp.task("minifyImages", function() {
  gulp.src(paths.img_src)
    .pipe(cache(imagemin({
      optimizationLevel: 2,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(paths.img_dest))
    .pipe(notify("Images complete!"));
});

// Compile SASS to CSS
gulp.task("compileSass", function() {
  gulp.src([paths.sass_src])
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit("end");
      }
    }))
    .pipe(sass())
    .pipe(autoprefixer("last 2 versions"))
    .pipe(gulp.dest(paths.css_dest))
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.css_dest))
    .pipe(notify("SASS complete!"));
});

// Generate sprites
gulp.task('svgSprites', function () {
  return gulp.src(paths.svg_src)
    .pipe(svgSprite({
      mode: "symbols",
      baseSize: 16
    }))
    .pipe(gulp.dest(paths.svg_dest))
    .pipe(filter(paths.svg_src))
    .pipe(svg2png())
    .pipe(gulp.dest(paths.svg_dest))
    .pipe(notify("SVG complete!"));
});

// Watch files
gulp.task("watch", () => {
  gulp.watch(paths.img_src,  ["minifyImages"])
  gulp.watch(paths.sass_src, ["compileSass"])
  gulp.watch(paths.svg_src,  ["svgSprites"])
});

// Start everything with the default task
gulp.task("default", [
  "clean",
  "minifyImages",
  "compileSass",
  "svgSprites",
  "watch"
]);
