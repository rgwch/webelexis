({
    mainConfigFile: 'src/main/resources/web/app/requirejs.config.js',
    optimize: "none",
    inlineText: true,
    fileExclusionRegExp: /\.jade/,
    appDir: "src/main/resources/web",
    dir: "dist/web",
    keepBuildDir: true,
    modules: [{
            name: "app/main"
    }, {
            name: "components/agenda/ch-webelexis-agenda"
    }, {
            name: "components/consultation/ch-webelexis-consdetail"
    }, {
            name: 'components/login/ch-webelexis-login'
    }, {
            name: 'components/patdetail/ch-webelexis-patdetail'
    }, {
            name: 'components/patlist/ch-webelexis-patlist'
    }, {
            name: 'components/menubar/ch-webelexis-menubar'
    }, {
            name: 'components/page404/ch-webelexis-page404'
    }

 ]
});