System.config({
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "*": "dist/*",
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*",
    "models/*": "dist/models/*",
    "services/*": "dist/services/*"
  },
  map: {
    "aurelia-animator-css": "npm:aurelia-animator-css@1.0.1",
    "aurelia-bootstrapper": "npm:aurelia-bootstrapper@1.0.1",
    "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
    "aurelia-dialog": "npm:aurelia-dialog@1.0.0-beta.3.0.1",
    "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
    "aurelia-framework": "npm:aurelia-framework@1.0.8",
    "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0",
    "aurelia-http-client": "npm:aurelia-http-client@1.0.4",
    "aurelia-i18n": "npm:aurelia-i18n@1.3.0",
    "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0",
    "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0",
    "aurelia-materialize-bridge": "npm:aurelia-materialize-bridge@0.20.6",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.1.0",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.1.1",
    "aurelia-router": "npm:aurelia-router@1.1.1",
    "aurelia-templating-binding": "npm:aurelia-templating-binding@1.2.0",
    "aurelia-templating-resources": "npm:aurelia-templating-resources@1.2.0",
    "aurelia-templating-router": "npm:aurelia-templating-router@1.0.1",
    "aurelia-testing": "npm:aurelia-testing@1.0.0-beta.2.0.1",
    "aurelia-validation": "npm:aurelia-validation@1.0.0-beta.1.0.1",
    "bluebird": "npm:bluebird@3.4.1",
    "font-awesome": "npm:font-awesome@4.6.3",
    "i18next-xhr-backend": "npm:i18next-xhr-backend@1.3.0",
    "jquery": "npm:jquery@2.2.4",
    "materialize": "github:Dogfalo/materialize@0.97.8",
    "moment": "npm:moment@2.17.1",
    "pikaday": "github:dbushell/Pikaday@1.5.1",
    "text": "github:systemjs/plugin-text@0.0.8",
    "github:Dogfalo/materialize@0.97.8": {
      "css": "github:systemjs/plugin-css@0.1.33",
      "jquery": "npm:jquery@2.2.4"
    },
    "github:dbushell/Pikaday@1.5.1": {
      "css": "github:systemjs/plugin-css@0.1.33"
    },
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.9"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:aurelia-animator-css@1.0.1": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-binding@1.1.1": {
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0"
    },
    "npm:aurelia-bootstrapper@1.0.1": {
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
      "aurelia-framework": "npm:aurelia-framework@1.0.8",
      "aurelia-history": "npm:aurelia-history@1.0.0",
      "aurelia-history-browser": "npm:aurelia-history-browser@1.0.0",
      "aurelia-loader-default": "npm:aurelia-loader-default@1.0.0",
      "aurelia-logging-console": "npm:aurelia-logging-console@1.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-pal-browser": "npm:aurelia-pal-browser@1.1.0",
      "aurelia-polyfills": "npm:aurelia-polyfills@1.1.1",
      "aurelia-router": "npm:aurelia-router@1.1.1",
      "aurelia-templating": "npm:aurelia-templating@1.2.0",
      "aurelia-templating-binding": "npm:aurelia-templating-binding@1.2.0",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.2.0",
      "aurelia-templating-router": "npm:aurelia-templating-router@1.0.1"
    },
    "npm:aurelia-dependency-injection@1.3.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.2.0"
    },
    "npm:aurelia-dialog@1.0.0-beta.3.0.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-event-aggregator@1.0.1": {
      "aurelia-logging": "npm:aurelia-logging@1.3.0"
    },
    "npm:aurelia-framework@1.0.8": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-history-browser@1.0.0": {
      "aurelia-history": "npm:aurelia-history@1.0.0",
      "aurelia-pal": "npm:aurelia-pal@1.2.0"
    },
    "npm:aurelia-http-client@1.0.4": {
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-path": "npm:aurelia-path@1.1.1"
    },
    "npm:aurelia-i18n@1.3.0": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0",
      "aurelia-templating-resources": "npm:aurelia-templating-resources@1.2.0",
      "i18next": "npm:i18next@3.5.2",
      "intl": "npm:intl@1.2.5"
    },
    "npm:aurelia-loader-default@1.0.0": {
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.2.0"
    },
    "npm:aurelia-loader@1.0.0": {
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-path": "npm:aurelia-path@1.1.1"
    },
    "npm:aurelia-logging-console@1.0.0": {
      "aurelia-logging": "npm:aurelia-logging@1.3.0"
    },
    "npm:aurelia-materialize-bridge@0.20.6": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-router": "npm:aurelia-router@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0",
      "jquery": "npm:jquery@2.2.4",
      "materialize": "github:Dogfalo/materialize@0.97.8"
    },
    "npm:aurelia-metadata@1.0.3": {
      "aurelia-pal": "npm:aurelia-pal@1.2.0"
    },
    "npm:aurelia-pal-browser@1.1.0": {
      "aurelia-pal": "npm:aurelia-pal@1.2.0"
    },
    "npm:aurelia-polyfills@1.1.1": {
      "aurelia-pal": "npm:aurelia-pal@1.2.0"
    },
    "npm:aurelia-route-recognizer@1.1.0": {
      "aurelia-path": "npm:aurelia-path@1.1.1"
    },
    "npm:aurelia-router@1.1.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-event-aggregator": "npm:aurelia-event-aggregator@1.0.1",
      "aurelia-history": "npm:aurelia-history@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-route-recognizer": "npm:aurelia-route-recognizer@1.1.0"
    },
    "npm:aurelia-task-queue@1.1.0": {
      "aurelia-pal": "npm:aurelia-pal@1.2.0"
    },
    "npm:aurelia-templating-binding@1.2.0": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-templating-resources@1.2.0": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-templating-router@1.0.1": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-router": "npm:aurelia-router@1.1.1",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-templating@1.2.0": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-loader": "npm:aurelia-loader@1.0.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-metadata": "npm:aurelia-metadata@1.0.3",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-path": "npm:aurelia-path@1.1.1",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0"
    },
    "npm:aurelia-testing@1.0.0-beta.2.0.1": {
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-framework": "npm:aurelia-framework@1.0.8",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:aurelia-validation@1.0.0-beta.1.0.1": {
      "aurelia-binding": "npm:aurelia-binding@1.1.1",
      "aurelia-dependency-injection": "npm:aurelia-dependency-injection@1.3.0",
      "aurelia-logging": "npm:aurelia-logging@1.3.0",
      "aurelia-pal": "npm:aurelia-pal@1.2.0",
      "aurelia-task-queue": "npm:aurelia-task-queue@1.1.0",
      "aurelia-templating": "npm:aurelia-templating@1.2.0"
    },
    "npm:bluebird@3.4.1": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.8",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:font-awesome@4.6.3": {
      "css": "github:systemjs/plugin-css@0.1.33"
    },
    "npm:i18next@3.5.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:intl@1.2.5": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:process@0.11.9": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    }
  },
  bundles: {
    "materialize-bundle.js": [
      "npm:aurelia-binding@1.1.1.js",
      "npm:aurelia-binding@1.1.1/aurelia-binding.js",
      "npm:aurelia-dependency-injection@1.3.0.js",
      "npm:aurelia-dependency-injection@1.3.0/aurelia-dependency-injection.js",
      "npm:aurelia-event-aggregator@1.0.1.js",
      "npm:aurelia-event-aggregator@1.0.1/aurelia-event-aggregator.js",
      "npm:aurelia-history@1.0.0.js",
      "npm:aurelia-history@1.0.0/aurelia-history.js",
      "npm:aurelia-loader@1.0.0.js",
      "npm:aurelia-loader@1.0.0/aurelia-loader.js",
      "npm:aurelia-logging@1.3.0.js",
      "npm:aurelia-logging@1.3.0/aurelia-logging.js",
      "npm:aurelia-materialize-bridge@0.20.6.js",
      "npm:aurelia-materialize-bridge@0.20.6/autocomplete/autocomplete.js",
      "npm:aurelia-materialize-bridge@0.20.6/badge/badge.js",
      "npm:aurelia-materialize-bridge@0.20.6/box/box.js",
      "npm:aurelia-materialize-bridge@0.20.6/breadcrumbs/breadcrumbs.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/breadcrumbs/breadcrumbs.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/breadcrumbs/breadcrumbs.js",
      "npm:aurelia-materialize-bridge@0.20.6/breadcrumbs/instructionFilter.js",
      "npm:aurelia-materialize-bridge@0.20.6/button/button.js",
      "npm:aurelia-materialize-bridge@0.20.6/card/card.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/card/card.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/card/card.js",
      "npm:aurelia-materialize-bridge@0.20.6/carousel/carousel-item.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/carousel/carousel-item.js",
      "npm:aurelia-materialize-bridge@0.20.6/carousel/carousel.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/carousel/carousel.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/carousel/carousel.js",
      "npm:aurelia-materialize-bridge@0.20.6/char-counter/char-counter.js",
      "npm:aurelia-materialize-bridge@0.20.6/checkbox/checkbox.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/checkbox/checkbox.js",
      "npm:aurelia-materialize-bridge@0.20.6/chip/chip.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/chip/chip.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/chip/chip.js",
      "npm:aurelia-materialize-bridge@0.20.6/chip/chips.js",
      "npm:aurelia-materialize-bridge@0.20.6/click-counter.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/click-counter.js",
      "npm:aurelia-materialize-bridge@0.20.6/collapsible/collapsible.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/collection-header.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/collection-header.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/collection-header.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/collection-item.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/collection-item.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/collection-item.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/collection.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/collection.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/md-collection-selector.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/md-collection-selector.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/collection/md-collection-selector.js",
      "npm:aurelia-materialize-bridge@0.20.6/colors/colorValueConverters.js",
      "npm:aurelia-materialize-bridge@0.20.6/colors/md-colors.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/colors/md-colors.js",
      "npm:aurelia-materialize-bridge@0.20.6/common/attributeManager.js",
      "npm:aurelia-materialize-bridge@0.20.6/common/attributes.js",
      "npm:aurelia-materialize-bridge@0.20.6/common/constants.js",
      "npm:aurelia-materialize-bridge@0.20.6/common/events.js",
      "npm:aurelia-materialize-bridge@0.20.6/common/polyfills.js",
      "npm:aurelia-materialize-bridge@0.20.6/config-builder.js",
      "npm:aurelia-materialize-bridge@0.20.6/datepicker/datepicker-default-parser.js",
      "npm:aurelia-materialize-bridge@0.20.6/datepicker/datepicker.js",
      "npm:aurelia-materialize-bridge@0.20.6/dropdown/dropdown-element.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/dropdown/dropdown-element.js",
      "npm:aurelia-materialize-bridge@0.20.6/dropdown/dropdown-fix.js",
      "npm:aurelia-materialize-bridge@0.20.6/dropdown/dropdown.js",
      "npm:aurelia-materialize-bridge@0.20.6/exports.js",
      "npm:aurelia-materialize-bridge@0.20.6/fab/fab.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/fab/fab.js",
      "npm:aurelia-materialize-bridge@0.20.6/file/file.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/file/file.js",
      "npm:aurelia-materialize-bridge@0.20.6/footer/footer.js",
      "npm:aurelia-materialize-bridge@0.20.6/index.js",
      "npm:aurelia-materialize-bridge@0.20.6/input/input-prefix.js",
      "npm:aurelia-materialize-bridge@0.20.6/input/input-update-service.js",
      "npm:aurelia-materialize-bridge@0.20.6/input/input.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/input/input.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/input/input.js",
      "npm:aurelia-materialize-bridge@0.20.6/modal/modal-trigger.js",
      "npm:aurelia-materialize-bridge@0.20.6/modal/modal.js",
      "npm:aurelia-materialize-bridge@0.20.6/navbar/navbar.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/navbar/navbar.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/navbar/navbar.js",
      "npm:aurelia-materialize-bridge@0.20.6/pagination/pagination.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/pagination/pagination.js",
      "npm:aurelia-materialize-bridge@0.20.6/parallax/parallax.js",
      "npm:aurelia-materialize-bridge@0.20.6/progress/progress.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/progress/progress.js",
      "npm:aurelia-materialize-bridge@0.20.6/pushpin/pushpin.js",
      "npm:aurelia-materialize-bridge@0.20.6/radio/radio.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/radio/radio.js",
      "npm:aurelia-materialize-bridge@0.20.6/range/range.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/range/range.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/range/range.js",
      "npm:aurelia-materialize-bridge@0.20.6/scrollfire/scrollfire-patch.js",
      "npm:aurelia-materialize-bridge@0.20.6/scrollfire/scrollfire-target.js",
      "npm:aurelia-materialize-bridge@0.20.6/scrollfire/scrollfire.js",
      "npm:aurelia-materialize-bridge@0.20.6/scrollspy/scrollspy.js",
      "npm:aurelia-materialize-bridge@0.20.6/select/select.js",
      "npm:aurelia-materialize-bridge@0.20.6/sidenav/sidenav-collapse.js",
      "npm:aurelia-materialize-bridge@0.20.6/sidenav/sidenav.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/sidenav/sidenav.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/sidenav/sidenav.js",
      "npm:aurelia-materialize-bridge@0.20.6/slider/slider.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/slider/slider.js",
      "npm:aurelia-materialize-bridge@0.20.6/switch/switch.css!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/switch/switch.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-materialize-bridge@0.20.6/switch/switch.js",
      "npm:aurelia-materialize-bridge@0.20.6/tabs/tabs.js",
      "npm:aurelia-materialize-bridge@0.20.6/toast/toastService.js",
      "npm:aurelia-materialize-bridge@0.20.6/tooltip/tooltip.js",
      "npm:aurelia-materialize-bridge@0.20.6/transitions/fadein-image.js",
      "npm:aurelia-materialize-bridge@0.20.6/transitions/staggered-list.js",
      "npm:aurelia-materialize-bridge@0.20.6/validation/validationRenderer.js",
      "npm:aurelia-materialize-bridge@0.20.6/waves/waves.js",
      "npm:aurelia-materialize-bridge@0.20.6/well/md-well.html!github:systemjs/plugin-text@0.0.8.js",
      "npm:aurelia-metadata@1.0.3.js",
      "npm:aurelia-metadata@1.0.3/aurelia-metadata.js",
      "npm:aurelia-pal@1.2.0.js",
      "npm:aurelia-pal@1.2.0/aurelia-pal.js",
      "npm:aurelia-path@1.1.1.js",
      "npm:aurelia-path@1.1.1/aurelia-path.js",
      "npm:aurelia-route-recognizer@1.1.0.js",
      "npm:aurelia-route-recognizer@1.1.0/aurelia-route-recognizer.js",
      "npm:aurelia-router@1.1.1.js",
      "npm:aurelia-router@1.1.1/aurelia-router.js",
      "npm:aurelia-task-queue@1.1.0.js",
      "npm:aurelia-task-queue@1.1.0/aurelia-task-queue.js",
      "npm:aurelia-templating@1.2.0.js",
      "npm:aurelia-templating@1.2.0/aurelia-templating.js"
    ],
    "app-build.js": [
      "app.html!github:systemjs/plugin-text@0.0.8.js",
      "app.js",
      "components/address-box.html!github:systemjs/plugin-text@0.0.8.js",
      "components/address-box.js",
      "components/appointment-view.html!github:systemjs/plugin-text@0.0.8.js",
      "components/appointment-view.js",
      "components/checkbox-inputs.html!github:systemjs/plugin-text@0.0.8.js",
      "components/checkbox-inputs.js",
      "components/ck-editor.html!github:systemjs/plugin-text@0.0.8.js",
      "components/ck-editor.js",
      "components/comm-box.html!github:systemjs/plugin-text@0.0.8.js",
      "components/comm-box.js",
      "components/condition-view.html!github:systemjs/plugin-text@0.0.8.js",
      "components/condition-view.js",
      "components/drop-down.html!github:systemjs/plugin-text@0.0.8.js",
      "components/drop-down.js",
      "components/encounter-view.html!github:systemjs/plugin-text@0.0.8.js",
      "components/encounter-view.js",
      "components/flag-view.html!github:systemjs/plugin-text@0.0.8.js",
      "components/flag-view.js",
      "components/floater.html!github:systemjs/plugin-text@0.0.8.js",
      "components/item-collection.html!github:systemjs/plugin-text@0.0.8.js",
      "components/item-collection.js",
      "components/lockable-input.html!github:systemjs/plugin-text@0.0.8.js",
      "components/lockable-input.js",
      "components/medication-order-view.html!github:systemjs/plugin-text@0.0.8.js",
      "components/medication-order-view.js",
      "components/pickdate.html!github:systemjs/plugin-text@0.0.8.js",
      "components/pickdate.js",
      "components/pickresource.html!github:systemjs/plugin-text@0.0.8.js",
      "components/pickresource.js",
      "components/radio-inputs.html!github:systemjs/plugin-text@0.0.8.js",
      "components/radio-inputs.js",
      "components/searchfield.html!github:systemjs/plugin-text@0.0.8.js",
      "components/searchfield.js",
      "components/select-control.html!github:systemjs/plugin-text@0.0.8.js",
      "components/select-control.js",
      "components/slot-view.html!github:systemjs/plugin-text@0.0.8.js",
      "components/slot-view.js",
      "components/text-area.html!github:systemjs/plugin-text@0.0.8.js",
      "components/text-area.js",
      "components/text-input.html!github:systemjs/plugin-text@0.0.8.js",
      "components/text-input.js",
      "components/unit.html!github:systemjs/plugin-text@0.0.8.js",
      "components/unit.js",
      "components/user-dropdown.css!github:systemjs/plugin-text@0.0.8.js",
      "components/user-dropdown.html!github:systemjs/plugin-text@0.0.8.js",
      "components/user-dropdown.js",
      "config.js",
      "dialogs/confirm.html!github:systemjs/plugin-text@0.0.8.js",
      "dialogs/confirm.js",
      "dialogs/create-flag.html!github:systemjs/plugin-text@0.0.8.js",
      "dialogs/create-flag.js",
      "dialogs/create-person.html!github:systemjs/plugin-text@0.0.8.js",
      "dialogs/create-person.js",
      "left-nav.css!github:systemjs/plugin-text@0.0.8.js",
      "left-nav.html!github:systemjs/plugin-text@0.0.8.js",
      "left-nav.js",
      "login.html!github:systemjs/plugin-text@0.0.8.js",
      "login.js",
      "main.js",
      "models/address-list.js",
      "models/appointment.js",
      "models/codeable-concept.js",
      "models/communications-list.js",
      "models/condition.js",
      "models/encounter.js",
      "models/fhir.js",
      "models/fhirobj.js",
      "models/flag.js",
      "models/medication-administration.js",
      "models/medication-order.js",
      "models/medication.js",
      "models/patient.js",
      "models/schedule.js",
      "models/slot.js",
      "models/user.js",
      "models/xid.js",
      "resources/date-format-value-converter.js",
      "resources/datetime.js",
      "resources/fhir-resource-value-converter.js",
      "resources/role-filter-value-converter.js",
      "resources/route-filter-value-converter.js",
      "routes/admin/index.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/admin/index.js",
      "routes/agenda/index.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/agenda/index.js",
      "routes/basicdata/index.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/basicdata/index.js",
      "routes/dashboard/detail.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/dashboard/detail.js",
      "routes/dashboard/fragment_appnt.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/dashboard/fragment_basic.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/dashboard/fragment_conditions.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/dashboard/fragment_cons.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/dashboard/fragment_prescriptions.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/dashboard/fragment_remarks.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/dashboard/index.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/dashboard/index.js",
      "routes/intro/index.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/intro/index.js",
      "routes/showcase/index.html!github:systemjs/plugin-text@0.0.8.js",
      "routes/showcase/index.js",
      "services/appointments.js",
      "services/data-store.js",
      "services/dev-http-wrapper.js",
      "services/fhirservice.js",
      "services/http-wrapper.js",
      "services/local-http-wrapper.js",
      "services/login.js",
      "services/session.js",
      "services/validator.js",
      "styles.css!github:systemjs/plugin-text@0.0.8.js"
    ],
    "aurelia.js": [
      "github:Dogfalo/materialize@0.97.8.js",
      "github:Dogfalo/materialize@0.97.8/css/materialize.css!github:systemjs/plugin-css@0.1.33.js",
      "github:Dogfalo/materialize@0.97.8/js/materialize.js",
      "github:dbushell/Pikaday@1.5.1.js",
      "github:dbushell/Pikaday@1.5.1/css/pikaday.css!github:systemjs/plugin-css@0.1.33.js",
      "github:dbushell/Pikaday@1.5.1/pikaday.js",
      "github:jspm/nodelibs-process@0.1.2.js",
      "github:jspm/nodelibs-process@0.1.2/index.js",
      "npm:aurelia-animator-css@1.0.1.js",
      "npm:aurelia-animator-css@1.0.1/aurelia-animator-css.js",
      "npm:aurelia-binding@1.1.1.js",
      "npm:aurelia-binding@1.1.1/aurelia-binding.js",
      "npm:aurelia-bootstrapper@1.0.1.js",
      "npm:aurelia-bootstrapper@1.0.1/aurelia-bootstrapper.js",
      "npm:aurelia-dependency-injection@1.3.0.js",
      "npm:aurelia-dependency-injection@1.3.0/aurelia-dependency-injection.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/ai-dialog-body.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/ai-dialog-footer.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/ai-dialog-header.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/ai-dialog.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/attach-focus.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/aurelia-dialog.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-configuration.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-controller.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-options.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-renderer.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-result.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/dialog-service.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/lifecycle.js",
      "npm:aurelia-dialog@1.0.0-beta.3.0.1/renderer.js",
      "npm:aurelia-event-aggregator@1.0.1.js",
      "npm:aurelia-event-aggregator@1.0.1/aurelia-event-aggregator.js",
      "npm:aurelia-framework@1.0.8.js",
      "npm:aurelia-framework@1.0.8/aurelia-framework.js",
      "npm:aurelia-history-browser@1.0.0.js",
      "npm:aurelia-history-browser@1.0.0/aurelia-history-browser.js",
      "npm:aurelia-history@1.0.0.js",
      "npm:aurelia-history@1.0.0/aurelia-history.js",
      "npm:aurelia-http-client@1.0.4.js",
      "npm:aurelia-http-client@1.0.4/aurelia-http-client.js",
      "npm:aurelia-i18n@1.3.0.js",
      "npm:aurelia-i18n@1.3.0/aurelia-i18n-loader.js",
      "npm:aurelia-i18n@1.3.0/aurelia-i18n.js",
      "npm:aurelia-i18n@1.3.0/base-i18n.js",
      "npm:aurelia-i18n@1.3.0/defaultTranslations/relative.time.js",
      "npm:aurelia-i18n@1.3.0/df.js",
      "npm:aurelia-i18n@1.3.0/i18n.js",
      "npm:aurelia-i18n@1.3.0/nf.js",
      "npm:aurelia-i18n@1.3.0/relativeTime.js",
      "npm:aurelia-i18n@1.3.0/rt.js",
      "npm:aurelia-i18n@1.3.0/t.js",
      "npm:aurelia-i18n@1.3.0/utils.js",
      "npm:aurelia-loader-default@1.0.0.js",
      "npm:aurelia-loader-default@1.0.0/aurelia-loader-default.js",
      "npm:aurelia-loader@1.0.0.js",
      "npm:aurelia-loader@1.0.0/aurelia-loader.js",
      "npm:aurelia-logging-console@1.0.0.js",
      "npm:aurelia-logging-console@1.0.0/aurelia-logging-console.js",
      "npm:aurelia-logging@1.3.0.js",
      "npm:aurelia-logging@1.3.0/aurelia-logging.js",
      "npm:aurelia-metadata@1.0.3.js",
      "npm:aurelia-metadata@1.0.3/aurelia-metadata.js",
      "npm:aurelia-pal-browser@1.1.0.js",
      "npm:aurelia-pal-browser@1.1.0/aurelia-pal-browser.js",
      "npm:aurelia-pal@1.2.0.js",
      "npm:aurelia-pal@1.2.0/aurelia-pal.js",
      "npm:aurelia-path@1.1.1.js",
      "npm:aurelia-path@1.1.1/aurelia-path.js",
      "npm:aurelia-polyfills@1.1.1.js",
      "npm:aurelia-polyfills@1.1.1/aurelia-polyfills.js",
      "npm:aurelia-route-recognizer@1.1.0.js",
      "npm:aurelia-route-recognizer@1.1.0/aurelia-route-recognizer.js",
      "npm:aurelia-router@1.1.1.js",
      "npm:aurelia-router@1.1.1/aurelia-router.js",
      "npm:aurelia-task-queue@1.1.0.js",
      "npm:aurelia-task-queue@1.1.0/aurelia-task-queue.js",
      "npm:aurelia-templating-binding@1.2.0.js",
      "npm:aurelia-templating-binding@1.2.0/aurelia-templating-binding.js",
      "npm:aurelia-templating-resources@1.2.0.js",
      "npm:aurelia-templating-resources@1.2.0/abstract-repeater.js",
      "npm:aurelia-templating-resources@1.2.0/analyze-view-factory.js",
      "npm:aurelia-templating-resources@1.2.0/array-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.2.0/attr-binding-behavior.js",
      "npm:aurelia-templating-resources@1.2.0/aurelia-hide-style.js",
      "npm:aurelia-templating-resources@1.2.0/aurelia-templating-resources.js",
      "npm:aurelia-templating-resources@1.2.0/binding-mode-behaviors.js",
      "npm:aurelia-templating-resources@1.2.0/binding-signaler.js",
      "npm:aurelia-templating-resources@1.2.0/compose.js",
      "npm:aurelia-templating-resources@1.2.0/css-resource.js",
      "npm:aurelia-templating-resources@1.2.0/debounce-binding-behavior.js",
      "npm:aurelia-templating-resources@1.2.0/dynamic-element.js",
      "npm:aurelia-templating-resources@1.2.0/focus.js",
      "npm:aurelia-templating-resources@1.2.0/hide.js",
      "npm:aurelia-templating-resources@1.2.0/html-resource-plugin.js",
      "npm:aurelia-templating-resources@1.2.0/html-sanitizer.js",
      "npm:aurelia-templating-resources@1.2.0/if.js",
      "npm:aurelia-templating-resources@1.2.0/map-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.2.0/null-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.2.0/number-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.2.0/repeat-strategy-locator.js",
      "npm:aurelia-templating-resources@1.2.0/repeat-utilities.js",
      "npm:aurelia-templating-resources@1.2.0/repeat.js",
      "npm:aurelia-templating-resources@1.2.0/replaceable.js",
      "npm:aurelia-templating-resources@1.2.0/sanitize-html.js",
      "npm:aurelia-templating-resources@1.2.0/set-repeat-strategy.js",
      "npm:aurelia-templating-resources@1.2.0/show.js",
      "npm:aurelia-templating-resources@1.2.0/signal-binding-behavior.js",
      "npm:aurelia-templating-resources@1.2.0/throttle-binding-behavior.js",
      "npm:aurelia-templating-resources@1.2.0/update-trigger-binding-behavior.js",
      "npm:aurelia-templating-resources@1.2.0/with.js",
      "npm:aurelia-templating-router@1.0.1.js",
      "npm:aurelia-templating-router@1.0.1/aurelia-templating-router.js",
      "npm:aurelia-templating-router@1.0.1/route-href.js",
      "npm:aurelia-templating-router@1.0.1/route-loader.js",
      "npm:aurelia-templating-router@1.0.1/router-view.js",
      "npm:aurelia-templating@1.2.0.js",
      "npm:aurelia-templating@1.2.0/aurelia-templating.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/aurelia-validation.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/implementation/rules.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/implementation/standard-validator.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/implementation/util.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/implementation/validation-messages.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/implementation/validation-parser.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/implementation/validation-rules.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/property-info.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/validate-binding-behavior-base.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/validate-binding-behavior.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/validate-result.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/validate-trigger.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/validation-controller-factory.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/validation-controller.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/validation-errors-custom-attribute.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/validation-renderer-custom-attribute.js",
      "npm:aurelia-validation@1.0.0-beta.1.0.1/validator.js",
      "npm:bluebird@3.4.1.js",
      "npm:bluebird@3.4.1/js/browser/bluebird.js",
      "npm:font-awesome@4.6.3.js",
      "npm:font-awesome@4.6.3/css/font-awesome.css!github:systemjs/plugin-css@0.1.33.js",
      "npm:i18next-xhr-backend@1.3.0.js",
      "npm:i18next-xhr-backend@1.3.0/dist/commonjs/ajax.js",
      "npm:i18next-xhr-backend@1.3.0/dist/commonjs/index.js",
      "npm:i18next-xhr-backend@1.3.0/dist/commonjs/utils.js",
      "npm:i18next-xhr-backend@1.3.0/index.js",
      "npm:i18next@3.5.2.js",
      "npm:i18next@3.5.2/dist/commonjs/BackendConnector.js",
      "npm:i18next@3.5.2/dist/commonjs/CacheConnector.js",
      "npm:i18next@3.5.2/dist/commonjs/EventEmitter.js",
      "npm:i18next@3.5.2/dist/commonjs/Interpolator.js",
      "npm:i18next@3.5.2/dist/commonjs/LanguageUtils.js",
      "npm:i18next@3.5.2/dist/commonjs/PluralResolver.js",
      "npm:i18next@3.5.2/dist/commonjs/ResourceStore.js",
      "npm:i18next@3.5.2/dist/commonjs/Translator.js",
      "npm:i18next@3.5.2/dist/commonjs/compatibility/v1.js",
      "npm:i18next@3.5.2/dist/commonjs/defaults.js",
      "npm:i18next@3.5.2/dist/commonjs/i18next.js",
      "npm:i18next@3.5.2/dist/commonjs/index.js",
      "npm:i18next@3.5.2/dist/commonjs/logger.js",
      "npm:i18next@3.5.2/dist/commonjs/postProcessor.js",
      "npm:i18next@3.5.2/dist/commonjs/utils.js",
      "npm:i18next@3.5.2/index.js",
      "npm:jquery@2.2.4.js",
      "npm:jquery@2.2.4/dist/jquery.js",
      "npm:moment@2.17.1.js",
      "npm:moment@2.17.1/locale/de.js",
      "npm:moment@2.17.1/moment.js",
      "npm:process@0.11.9.js",
      "npm:process@0.11.9/browser.js"
    ]
  },
  depCache: {
    "app.js": [
      "aurelia-router",
      "./services/session",
      "aurelia-dependency-injection"
    ],
    "components/address-box.js": [
      "aurelia-framework"
    ],
    "components/appointment-view.js": [
      "aurelia-framework",
      "../models/appointment",
      "aurelia-i18n",
      "../config",
      "../services/fhirservice"
    ],
    "components/checkbox-inputs.js": [
      "aurelia-framework"
    ],
    "components/ck-editor.js": [
      "aurelia-framework"
    ],
    "components/comm-box.js": [
      "aurelia-framework"
    ],
    "components/condition-view.js": [
      "aurelia-framework",
      "../models/condition"
    ],
    "components/drop-down.js": [
      "aurelia-framework"
    ],
    "components/encounter-view.js": [
      "aurelia-framework",
      "../models/encounter"
    ],
    "components/flag-view.js": [
      "../models/fhirobj",
      "aurelia-framework"
    ],
    "components/item-collection.js": [
      "aurelia-framework"
    ],
    "components/lockable-input.js": [
      "aurelia-framework"
    ],
    "components/medication-order-view.js": [
      "../models/medication",
      "aurelia-framework",
      "../services/fhirservice",
      "../models/medication-order"
    ],
    "components/pickdate.js": [
      "aurelia-framework",
      "aurelia-event-aggregator",
      "moment",
      "pikaday",
      "aurelia-i18n",
      "moment/locale/de"
    ],
    "components/pickresource.js": [
      "../config",
      "aurelia-event-aggregator",
      "aurelia-framework"
    ],
    "components/radio-inputs.js": [
      "aurelia-framework"
    ],
    "components/searchfield.js": [
      "aurelia-framework",
      "aurelia-i18n",
      "aurelia-dependency-injection"
    ],
    "components/select-control.js": [
      "aurelia-framework"
    ],
    "components/slot-view.js": [
      "aurelia-framework",
      "../models/slot",
      "../config",
      "../services/fhirservice",
      "../models/patient",
      "aurelia-event-aggregator",
      "../routes/agenda/index"
    ],
    "components/text-area.js": [
      "aurelia-framework"
    ],
    "components/text-input.js": [
      "aurelia-framework"
    ],
    "components/unit.js": [
      "aurelia-framework"
    ],
    "components/user-dropdown.js": [
      "../services/session",
      "aurelia-router"
    ],
    "config.js": [
      "./services/http-wrapper",
      "aurelia-framework"
    ],
    "dialogs/confirm.js": [
      "aurelia-dialog",
      "aurelia-framework"
    ],
    "dialogs/create-flag.js": [
      "aurelia-dialog",
      "aurelia-framework",
      "aurelia-i18n"
    ],
    "dialogs/create-person.js": [
      "aurelia-dialog",
      "aurelia-framework",
      "aurelia-i18n",
      "moment"
    ],
    "left-nav.js": [
      "./services/session",
      "aurelia-router"
    ],
    "login.js": [
      "aurelia-router",
      "./services/login",
      "./services/session",
      "aurelia-framework"
    ],
    "main.js": [
      "i18next-xhr-backend",
      "./services/http-wrapper",
      "./services/local-http-wrapper",
      "./config"
    ],
    "models/address-list.js": [
      "../services/validator"
    ],
    "models/appointment.js": [
      "./fhirobj",
      "aurelia-framework",
      "moment",
      "moment/locale/de"
    ],
    "models/communications-list.js": [
      "../services/validator"
    ],
    "models/condition.js": [
      "./fhirobj"
    ],
    "models/encounter.js": [
      "./fhirobj",
      "aurelia-framework",
      "./xid"
    ],
    "models/fhirobj.js": [
      "aurelia-framework",
      "aurelia-i18n",
      "moment",
      "../resources/fhir-resource-value-converter",
      "../services/fhirservice"
    ],
    "models/flag.js": [
      "./fhirobj"
    ],
    "models/medication-administration.js": [
      "./fhirobj"
    ],
    "models/medication-order.js": [
      "./fhirobj"
    ],
    "models/medication.js": [
      "./fhirobj"
    ],
    "models/patient.js": [
      "aurelia-framework",
      "aurelia-i18n",
      "moment",
      "../services/validator",
      "./address-list",
      "./communications-list",
      "./fhirobj"
    ],
    "models/schedule.js": [
      "../models/fhirobj"
    ],
    "models/slot.js": [
      "../models/fhirobj",
      "../models/patient"
    ],
    "resources/date-format-value-converter.js": [
      "moment",
      "aurelia-i18n",
      "aurelia-framework"
    ],
    "resources/datetime.js": [
      "aurelia-i18n",
      "aurelia-framework",
      "moment"
    ],
    "routes/admin/index.js": [
      "../../services/session"
    ],
    "routes/agenda/index.js": [
      "moment",
      "../../services/fhirservice",
      "../../models/appointment",
      "../../models/schedule",
      "../../models/slot",
      "aurelia-framework",
      "aurelia-event-aggregator",
      "../../config",
      "aurelia-dialog"
    ],
    "routes/dashboard/detail.js": [
      "../../services/fhirservice",
      "../../models/patient",
      "../../models/appointment",
      "aurelia-framework",
      "aurelia-i18n",
      "moment",
      "../../models/encounter",
      "../../models/medication-order",
      "../../models/condition",
      "../../models/flag",
      "aurelia-dialog"
    ],
    "routes/dashboard/index.js": [
      "../../services/fhirservice",
      "../../models/patient",
      "aurelia-framework",
      "../../config",
      "aurelia-router"
    ],
    "routes/intro/index.js": [
      "../../services/fhirservice",
      "../../models/patient",
      "aurelia-framework",
      "../../config",
      "aurelia-router",
      "aurelia-event-aggregator",
      "moment"
    ],
    "services/appointments.js": [
      "../models/appointment",
      "../models/schedule",
      "./fhirservice",
      "aurelia-framework"
    ],
    "services/dev-http-wrapper.js": [
      "./http-wrapper"
    ],
    "services/fhirservice.js": [
      "./http-wrapper",
      "aurelia-framework",
      "./validator",
      "./data-store"
    ],
    "services/http-wrapper.js": [
      "aurelia-http-client",
      "./session"
    ],
    "services/local-http-wrapper.js": [
      "./http-wrapper"
    ],
    "services/login.js": [
      "./http-wrapper",
      "../models/user",
      "aurelia-framework"
    ]
  }
});