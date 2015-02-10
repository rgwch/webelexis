
<script>

    var eb = new vertx.EventBus('http://localhost:8080/eventbus');

    eb.onopen = function() {

      eb.registerHandler('ch.webelexis.agenda.appointments', function(message) {

        console.log('received a message: ' + JSON.stringify(message);

      });

      eb.send('ch.webelexis.agenda.appointments', {begin: '20150201', end: '20150210', resource: 'gerry'});

    }

</script>