# Webelexis-base

## General Informations
This is the main subproject. Please see the [Wiki](http://github.com/rgwch/webelexis/wiki) for more informations. A description of the build process is [here](https://github.com/rgwch/webelexis/wiki/Build).

Binary distributions exist as [fat-jars](http://elexis.ch/files/public-docs/webelexis/jar/) (include vertx runtime)  or as zipped [vert.x-Module](http://elexis.ch/files/public-docs/webelexis/zip/) (requires local vert.x installation)


## Programming

Webelexis will never be a complete Project. I will just add components I need for myself, but anyone is welcome to make their own components. Here, I'll show a way to go.

### Prerequisites

* A basic understanding of JavaScript and HTML might be helpful.
* Set up a builed environment, as discussed [here](https://github.com/rgwch/webelexis/wiki/Build)

### Concept

Webelexis is made up of following parts:

* Server
  * source code in src/main/java

* Client
  * the single HTML page: index.jade
  * basic functions, located in src/resources/web/app
  * components, located in src/resources/web/components

* Tests
  * Server side tests, located in test/java
  * Client side tests, located in test/resources/web/app

The basic element of Webelexis functionality is the 'component'. A component is for webelexis, what a plug-in is for Elexis. In contrast to Elexis, where eclipse loads plug-ins dynamically during application startup, in Webelexis, components are hard wired at build time.

### Server

The server part of a Webelexis component is essentially a vert.x Verticle. Its job is, to listen at the eventBus, make requests to the Elexis database accordingly, and send the answer back. Since vert.x is polyglot, the Verticle is not necessarily programmed in Java. Other languages like Scala, Ruby, Pathon are supported as well.

All verticles must be registered in the Array "verticles" of ch.webelexis.CoreVerticle.java to be part of the Webelexis server.

### Client

The client part of a Webelexis component is essentially a [Knockout.js](http://www.knockoutjs.com) component. As such, it consists of separate ViewModel- and View parts. Each component is in its own subdirectory within src/resources/web/components.To understand the concept, you'd probably want to consider a very simple example: The component ch-webelexis-alert, which you can find in the directory src/resources/web/components/alert.

There are 2 files:

#### 1. ch-webelexis-alert.jade  -  The View

      .row
        .col-xs-12.col-sm-8.col-md-6.col-sm-offset-2.col-md-offset-3
          .panel.panel-warning
            .panel-heading
              h3.panel-title(data-bind="text: heading")
            .panel-body
              p(data-bind="text: body")

which compiles to the following HTML in dist/web/tmpl/ch-webelexis-alert.html:

        1 <div class="row">
        2  <div class="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3">
        3    <div class="panel panel-warning">
        4      <div class="panel-heading">
        5        <h3 data-bind="text: heading" class="panel-title"></h3>
        6      </div>
        7      <div class="panel-body">
        8        <p data-bind="text: body"></p>
               </div>
              </div>
            </div>
          </div>

The "class" attributes are from [Twitter Bootstrap](http://getbootstrap.com).

Line 2: The meaning of this is:
* On very small panels (smartphones), use the full width (col-xs-12)
* On small devices (tablets), take 8/12 of the available width (col-sm-8)
* On medium devices (standard screen computers) use half of the screen (col-md-6)
* On large screens, copy the settings from medium screens (col-lg-X is not set)
* On small screens, shift the box 2 units to right (col-sm-offset-2)
* On medium and large devices, shift it 3 units to the right (col-md-offset-3)

So, this line defines a display, that consumes the whole screen on smartphones, and appears centered on other devices. The next lines define the type and contents of the display.

Line 3: A Display of the type panel-warning (See Bootstrap doc)

Line 5: Contents of the heading-Part (knockout-variable)

Line 8: Contents of the body-part (knockout-variable)

#### 2. ch-webelexis-alert.js - The ViewModel

      1 define(['knockout', 'text!tmpl/ch-webelexis-alert.html', 'app/config'], function(ko, html, cfg) {
      2   var Locale = {

          de: {
            ...
          },
          en: {
            ...
          }
        }

      3  var R = Locale[cfg.locale()]

      4  function AlertModel(p) {
           var self = this;
           self.heading = ko.observable(R[p.params[0]])
           self.body = ko.observable(R[p.params[1]])
         }
      5  return {
           viewModel: AlertModel,
           template: html
         }
      })


Line 1: The component registers itself as a RequireJS/AMD Module and pulls in its dependencies (knockout, the view and the Webelexis configuration object)

Then, it defines Strings to display, depending on the locale. The locale is set in Line 3, according to the setting in "app/config", which was loaded into the variable "cfg".

The interesting part, i.e. the ViewModel is from Line 4

The variables "heading" ad "body" are the ones, we found in the View (LIne 5 and Line 8). The variables are "ko.observable"'s which means, the view gets an update, if they change.

They are set with the Parameter array p.params. That's an iteresting feature of the routing system. See next chapter "wiring up".

Line 5 defines the return value, which follows the convention for a Knockout-Component: Definition of viewModel and template.

#### 3: Wiring up

Actually, this won't work. Webelexis does not know, when it should load and display this component at all. We have to tell.
The place to do so, is in app/config.js:

      modules: [{
        ...
        {
          title: R.alert,
          baseURL: "#alert",
          match: /^alert\/(\w+)\/(\w+)$/,
          component: 'ch-webelexis-alert',
          location: 'components/alert',
          active: true,
          menuItem: false,
          role: 'guest'
        }
      ]

Here, we tell the system where ot can find the component, and which URL should open it. The interesting part ist the "match" expression: This regex matches an URL of the type server/#alert/foo/bar and captures the foo and bar parts of the URL. The captured texts ar sent to the viewmodel in the parameter Array p.params.

So, to recap: This component listens for an URL of the form #alert/header/body and then displays a bootstrap-panel with heading and body with that name and the matching locale.

Thatttt's all about it, folks
