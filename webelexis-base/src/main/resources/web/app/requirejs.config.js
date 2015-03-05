var require={
    baseUrl: "web",
    paths: {
        "bootstrap":    "lib/bobootstrap.min.js",
        "jquery":       "lib/jquery.js",
        "knockout":     "lib/knockout.js",
        "sockjs":       "lib/sockjs.js",
        "vertxbus":     "lib/vertxbus"
    },
    shim:{
        "bootstrap":    { deps: ["jquery"]},
        "knockout":     {deps: ["jquery"]}
    }
};
