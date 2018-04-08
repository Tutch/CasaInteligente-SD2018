var SerialPort = require('serialport'); 
var serialData = '';
var jsonData = {};
var COM = 'COM6'; // porta serial para conectar
var BAUD_RATE = 9600; 

var serialPort = new SerialPort(COM, {
  baudRate: BAUD_RATE,
});

serialPort.on("open", function () {
  console.log('Arduino presente.');
});

serialPort.on('data', function(data) {
   	serialData += data.toString('utf8').trim();
  });

function sendData(data, callback) {
  serialPort.write(data, function(err) {
    if (err) {
      console.log('Error on write: ', err.message);
    }
    callback();
  });  
}
 
function getData() {
  let returnData = serialData;
  var data_array = returnData.split(',');

  data_array.forEach(pair => {
    if(pair != '') {
      let split_pair = pair.split(':');
      jsonData[split_pair[0]] = split_pair[1];
    }  
  });

	serialData = '';
	return jsonData != null ? jsonData : {};
}

module.exports = {
  serialPort: serialPort,
  getData: getData
}