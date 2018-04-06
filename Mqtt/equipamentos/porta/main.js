'use strict';

var mqtt = require('mqtt');
var cliente = mqtt.connect('mqtt://localhost:1883');
var mqtt_conectado = false;
const TIMEOUT = 10000;
const MAIN_TOPIC = 'porta';
    
var estado = {
    porta: {
        'aberta':false
    }
}

function topic_handler(message) {
    if(message == 'status') {
        return JSON.stringify(estado.porta);
    }

    let json = JSON.parse(message);
    
    try{
        if (json && typeof(json) === "object") {
            estado.porta.aberta = json.aberta;
            return JSON.stringify(estado.porta);
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
})

setTimeout(function() {
    if(!mqtt_conectado) {
        console.log('ERRO: Falha ao tentar conectar com o Mqtt.');
        process.exit();
    }
}, TIMEOUT);