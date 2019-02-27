const gulp = require("gulp")
const sass = require("gulp-sass")
const pug = require("gulp-pug")
const browserSync = require("browser-sync").create()
const minifyCss = require("gulp-clean-css")
const rimraf = require('rimraf')

const dest = "target"

const copy = () => {
  return gulp.src("img/*").pipe(gulp.dest(dest))
}

const stylesTask = cb => {
  gulp
    .src("*.scss")
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }))
  cb()
}

const pugTask = () => {
  return gulp
    .src(["*.pug", "partials/*.pug", "!layout.pug"])
    .pipe(pug())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }))
}

const clean = cb => {
  rimraf(dest, cb)
}
const run = cb => {
  browserSync.init({
    server: {
      baseDir: dest,
    },
    port: 2345
  })
  cb()
}

const watch = cb => {
  gulp.watch("*.pug", pugTask)
  gulp.watch("*.scss", stylesTask)
  cb()
}

module.exports = {
  default: gulp.series(gulp.parallel(stylesTask, pugTask, copy), watch, run),
  watch: watch,
  clean: clean
}
