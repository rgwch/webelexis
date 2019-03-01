/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

 /**
  * Build file for the webelexis website
  * use 'gulp' to develop and watch
  * use 'WEBSITE=/path/to/website gulp deploy' to deploy
  * If you don't want to install gulp globally,
  * use 'npx gulp' instead of 'gulp'.
  */
const gulp = require("gulp")
const sass = require("gulp-sass")
const pug = require("gulp-pug")
const browserSync = require("browser-sync").create()
const minifyCss = require("gulp-clean-css")
const rimraf = require('rimraf')

// destination directory (will be created if doesn't exist)
const dest = "target"

/**
 * copy static files
 */
const copy = () => {
  return gulp.src("img/*").pipe(gulp.dest(dest))
}

/**
 * compile scss to minified css
 */
const stylesTask = () => {
  return gulp
    .src("*.scss")
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }))

}

/**
 * compile pug to html
 */
const pugTask = () => {
  return gulp
    .src(["*.pug", "!layout.pug"])
    .pipe(pug())
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({ stream: true }))
}

/**
 * remove dest directory
 */
const clean = cb => {
  rimraf(dest, cb)
}

/**
 * launch development server and browserSync to reload on changes
 */
const run = cb => {
  browserSync.init({
    server: {
      baseDir: dest,
    },
    port: 2345
  })
  cb()
}

/**
 * Watch directories and recompile on changes
 */
const watch = cb => {
  gulp.watch("./**/*.pug", pugTask)
  gulp.watch("*.scss", stylesTask)
  cb()
}

/**
 * move contents of target directory to $WEBSITE
 */
const move = () => {
  return gulp.src(`${dest}/**/*`)
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
