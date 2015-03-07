({
    mainConfigFile: 'src/main/resources/web/app/requirejs.config.js',
    optimize: "none",
    inlineText: true,
    fileExclusionRegExp: /\.jade/,
    appDir: "src/main/resources/web",
    dir: "dist/web",
    keepBuildDir: true,
    modules: [
        {
            name: "app/main"
        },
        {
            name: "components/agenda/ch-webelexis-agenda"
        },
        {
            name: "components/consultation/ch-webelexis-consdetail"
        }
    ]
});