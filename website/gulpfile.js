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

const stylesTask = () => {
  return gulp
    .src("*.scss")
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }))

}

const pugTask = () => {
  return gulp
    .src(["*.pug", "partials/*", "!layout.pug"])
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

const move = () => {
  return gulp.src("target/**/*")
    .pipe(gulp.dest(process.env.WEBSITE))
}

module.exports = {
  develop: gulp.series(gulp.parallel(stylesTask, pugTask, copy), watch, run),
  deploy: gulp.series(gulp.parallel(stylesTask,pugTask,copy), move),
  watch: watch,
  clean: clean,
  styles: stylesTask,
  pug: pugTask,
  copy: copy
}

module.exports.default=module.exports.develop