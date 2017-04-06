<img align="right" src="docs/webelexis_small.png">

# Webelexis

Webelexis consists of two parts:

* _Janus_ (based on NodeJS/Express) turns an [Elexis](http://www.elexis.ch/ungrad) Database into a [FHIR](https://www.hl7.org/fhir/) server.

* _client_ (based on Aurelia/Materialize) is a FHIR-Client, which can, among others, use the Webelexis-Janus server as its data source.


## Prerequisites

* Node.js Version 7.5.0 or higher (several ECMA ES6 features needed)
* NPM
* A modern browser

## Setup and first steps

[Read the docs](http://webelexis.readthedocs.io/de/latest/firststeps.html)

## Repository design

* _master_ contains always a state which is ready to compile and run.
* _develop_ is the working branch.
* all feature branches go from and merge to _develop_.

Recommended tool: [git flow](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/)

[![](https://imgs.xkcd.com/comics/the_general_problem.png)](https://xkcd.com/974/)
