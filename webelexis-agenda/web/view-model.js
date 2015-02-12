//var vertx = require('vertx');
//var console= require ('vertx/console');
var eb;

function appointment(from, to, reason){
    var self=this;
    self.from= ko.observable(from);
    self.until=ko.observable(to);
    self.reason=reason;
}
function AgendaViewModel() {
    var self=this;
    
    self.appointments = ko.observableArray([
        new appointment("08:00","08:30","quatsch")
    ]);
    
    self.load = function(){
      eb.send('ch.webelexis.agenda.appointments',{begin: "1", end: "2", resource: "3"}, function(result){
        //self.appointments.clear
          console.log("result: "+JSON.stringify(result));
        if(result.status != "ok"){
            self.appointments.push(new appointment("---",result.status,"error"));
        }else{
            result.values.foreach(function(value){
                self.appointments.push(new appointment("a","b","c"))
            });
        }
      });
    }
}

function initialize() {
    eb = new vertx.EventBus('http://localhost:8080/eventbus');
    eb.onopen = function() {
        console.log("eventbus ok");   
    }
    eb.onclose = function() {
        console.log("eventbus closed")
    }
}
              
initialize();
ko.applyBindings(new AgendaViewModel());