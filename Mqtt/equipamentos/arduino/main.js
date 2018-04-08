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
        console.log('Pediram meu status.')
        return JSON.stringify(estado.arduino);
    }

    let json = JSON.parse(message);
    
    try{
        if (json && typeof(json) === "object") {
            console.log('Comando recebido:')
            estado.arduino.led = json.led;
            let data = json.led ? 'ON' : 'OFF';
            
            // Escreve para a Serial
            ArduinoComm.serialPort.write(data, function(err) {
                console.log('Enviando comando para o Arduino.')
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
    console.log('Publicando mensagem no tópico.');
    cliente.publish(`${MAIN_TOPIC}-out`, message);
}) 

// Atualiza o tópico a cada 5 segundos independente 
// do status ter sido requisitado por alguém
setInterval(() => {
    if(estado.arduino.status != undefined) {
        console.log('Atualizando status.');
        cliente.publish(`${MAIN_TOPIC}-out`, JSON.stringify(estado.arduino));
    }
}, 10000);

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