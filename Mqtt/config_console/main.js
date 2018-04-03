'use strict';

const Prompt = require('./app/prompt');
const format = require('./app/format_helper');
var mqtt = require('mqtt');
var cliente = mqtt.connect('mqtt://localhost:1883');
var mqtt_conectado = false;
const TIMEOUT = 10000;

// Nome dos tópicos
// 'in' é a entrada para aquele dispositivo
// 'out' é o retorno.
var topicos_lista = [
    'porta',
    'televisao'
]

var estado = {
    porta: {
        'aberta': false
    },
    televisao: {
        'ligada': false
    }
}

cliente.on('message', function(topic, msg){
    let message = JSON.parse(msg.toString());

    switch(topic) {
        case 'porta-out':
            estado.porta.aberta = message.aberta;
            break;
        case 'televisao-out':
            estado.televisao.ligada = message.ligada;
            break;
    }

 }) 

// Tenta conectar com o Mqtt de antemão
cliente.on('connect', function () { 	
    console.log('--- Conectado ao Mqtt ---');
    mqtt_conectado = true;

    topicos_lista.forEach(topico => {
        let out_topic = `${topico}-out`;
        let in_topic = `${topico}-in`;

        cliente.subscribe(out_topic);
        cliente.publish(in_topic, 'status');
    });
  
    var prompt = new Prompt(cliente);
    estadoPrompt(prompt);
})

function estadoPrompt(prompt) {
    prompt.init().then(data => {
        format.separation();

        switch(data) {
            case 'porta':
                prompt.porta(estado.porta.aberta).then(status => {
                    estado.porta.aberta = status;
                    cliente.publish('porta-in', JSON.stringify(estado.porta));
                    estadoPrompt(prompt);
                }).catch(err => {
                    //usado como rejeição do prompt
                    estadoPrompt(prompt);
                });
                break;
            case 'televisão da sala':
                prompt.televisao(estado.televisao.ligada).then(status => {
                    estado.televisao.ligada = status;
                    cliente.publish('televisao-in', JSON.stringify(estado.televisao));
                    estadoPrompt(prompt);
                }).catch(err => {
                    //usado como rejeição do prompt
                    estadoPrompt(prompt);
                });
                break;
            case 'ar-condicionado':
                break;
            case 'lâmpada':
                break;
        }
    });
}

setTimeout(function() {
    if(!mqtt_conectado) {
        console.log('ERRO: Falha ao tentar conectar com o Mqtt.');
        process.exit();
    }
}, TIMEOUT);