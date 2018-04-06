'use strict';

var mqtt = require('mqtt');
var ArduinoComm = require('./arduino_comm');
var cliente = mqtt.connect('mqtt://localhost:1883');
var mqtt_conectado = false;
const TIMEOUT = 10000;
var WRITE_DELAY = 5000; 
const MAIN_TOPIC = 'arduino';
    
var estado = {
    arduino: {
        'led':false,
        status: {}
    }
}

function topic_handler(message) {
    if(message == 'status') {
        return JSON.stringify(estado.arduino);
    }

    let json = JSON.parse(message);
    
    try{
        if (json && typeof(json) === "object") {
            estado.arduino.led = json.led;
            let data = json.led ? 'ON' : 'OFF';
            
            // Escreve para a Serial
            ArduinoComm.serialPort.write(data, function(err) {
                if (err) {
                    return console.log('Error on write: ', err.message);
                }
            });  
            
            return JSON.stringify(estado.arduino);
        }
    } catch(e) {
        return '';
    }
}

cliente.on('message', function(topic, msg){
    let message = topic_handler(msg.toString());
    cliente.publish(`${MAIN_TOPIC}-out`, message);
}) 

// Tenta conectar com o Mqtt de antemão
cliente.on('connect', function () { 	
    console.log('--- Conectado ao Mqtt ---');
    mqtt_conectado = true;
    cliente.subscribe(`${MAIN_TOPIC}-in`);

    setInterval(function() { 
        let arduino_data = ArduinoComm.getData();
        estado.arduino.status = arduino_data;
    }, WRITE_DELAY);
})

setTimeout(function() {
    if(!mqtt_conectado) {
        console.log('ERRO: Falha ao tentar conectar com o Mqtt.');
        process.exit();
    }
}, TIMEOUT);