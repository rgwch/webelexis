var appRoot = 'src/';
var outputRoot = 'dist/';
// var exporSrvtRoot = 'export/'
var exporSrvtRoot='../Janus/public/webapp/'

module.exports = {
  root: appRoot,
  source: appRoot + '**/*.ts',
  html: appRoot + '**/*.html',
  pug: appRoot + '**/*.pug',
  style: ['src/**/*.scss', 'styles/**/*.scss'],
  output: outputRoot,
  exportSrv: exporSrvtRoot,
  doc: './doc',
  e2eSpecsSrc: 'test/e2e/src/**/*.ts',
  e2eSpecsDist: 'test/e2e/dist/',
  dtsSrc: [
    './typings/**/*.d.ts',
    './custom_typings/**/*.d.ts'
  ]
}
