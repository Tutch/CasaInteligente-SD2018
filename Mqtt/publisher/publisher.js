var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1883')
var SerialPort = require('serialport'); 
var serialData = '';
var COM = 'COM5'; // porta serial para conectar
var BAUD_RATE = 9600; 
var WRITE_DELAY = 5000; // tempo de espera entre escrita

var serialPort = new SerialPort(COM, {
  baudRate: BAUD_RATE,
});

serialPort.on("open", function () {
  console.log('Arduino presente.');
});

serialPort.on('data', function(data) {
   	serialData += data.toString('utf8');
  });
 
function sendData() {
	let returnData = serialData;
	serialData = '';
	return returnData;
}

client.on('connect', function () { 	
  console.log('Conectado ao mosquitto.')
  setInterval(function() { 
  	let data = sendData();
  	client.publish('info', data);
  }, WRITE_DELAY);
})