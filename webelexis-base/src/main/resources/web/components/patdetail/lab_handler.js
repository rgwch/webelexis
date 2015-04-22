/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

 define({

/* rows in sqlResult are sorted by date. We jusrt crunch all rows into a hashmap, so
  at the end, the latest values are set */
   loadLatest: function(sqlResult){
     if(sqlResult.status !== 'ok'){
       return null
     }
     var cruncher={}
     cruncher._fields=sqlResult.fields
     cruncher._rows=sqlResult.results
     cruncher._latest={}
     for(var i=0;i<cruncher._rows.length;i++){
       var row=cruncher._rows[i]
       var key=row[1]+row[2] // itemId + title
       cruncher._latest[key]=row
     }
     return cruncher
   }

 })
