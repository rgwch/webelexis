/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

 define(['knockout', 'app/datetools', 'app/eb', 'app/config', 'text!tmpl/ch-webelexis-detailagenda.html', 'domReady!'], function (ko, dt, bus, cfg, html) {


     function LabViewModel() {
       
     }
     return {
       viewmodel: LabViewModel,
       template: html
     };
 });
