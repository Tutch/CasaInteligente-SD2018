'use strict';

var mqtt = require('mqtt');
var cliente = mqtt.connect('mqtt://localhost:1883');
var mqtt_conectado = false;
const TIMEOUT = 10000;
const MAIN_TOPIC = 'televisao';
    
var estado = {
    televisao: {
        'ligada':false
    }
}

function topic_handler(message) {
    if(message == 'status') {
        console.log('Pediram meu status.')
        return JSON.stringify(estado.televisao);
    }

    let json = JSON.parse(message);

    try{
        if (json && typeof(json) === "object") {
            console.log('Comando recebido:')
            estado.televisao.ligada = json.ligada;
            return JSON.stringify(estado.televisao);
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