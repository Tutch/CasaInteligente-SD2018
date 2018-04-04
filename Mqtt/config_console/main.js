'use strict';

const Prompt = require('./app/prompt');
const format = require('./app/format_helper');
var values = require('./app/values');
var mqtt = require('mqtt');
var cliente = mqtt.connect('mqtt://localhost:1883');

var mqtt_conectado = false;
const TIMEOUT = 10000;

const topicos_lista = values.topicos_lista;
var estado = values.estado;

cliente.on('message', function(topic, msg){
    let message = JSON.parse(msg.toString());

    switch(topic) {
        case 'porta-out':
            estado.porta.control.aberta = message.aberta;
            break;
        case 'televisao-out':
            estado.televisao.control.ligada = message.ligada;
            break;
        case 'ar-out':
            estado.ar.control.ligado = message.ligado;
            break;
        case 'lampada-out':
            estado.lampada.control.ligada = message.ligada;
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
                prompt.equipment(estado.porta.control.aberta, 
                                 estado.porta.strings, 
                                 estado.porta.states).then(status => {
                    let obj_copy = estado.porta.control;
                    obj_copy.aberta = status
                    cliente.publish('porta-in', JSON.stringify(obj_copy));
                    estadoPrompt(prompt);
                }).catch(err => {
                    //usado como rejeição do prompt
                    estadoPrompt(prompt);
                });
                break; 
            case 'televisão da sala':
                prompt.equipment(estado.televisao.control.ligada,
                                 estado.televisao.strings,
                                 estado.televisao.states).then(status => {
                    let obj_copy = estado.televisao.control;
                    obj_copy.ligada = status
                    cliente.publish('televisao-in', JSON.stringify(obj_copy));
                    estadoPrompt(prompt);
                }).catch(err => {
                    //usado como rejeição do prompt
                    estadoPrompt(prompt);
                });
                break;
            case 'ar-condicionado':
                prompt.equipment(estado.ar.control.ligado,
                          estado.ar.strings,
                          estado.ar.states).then(status => {
                    let obj_copy = estado.ar.control;
                    obj_copy.ligado = status
                    cliente.publish('ar-in', JSON.stringify(obj_copy));
                    estadoPrompt(prompt);
                }).catch(err => {
                    //usado como rejeição do prompt
                    estadoPrompt(prompt);
                });
                break;
            case 'lâmpada':
                prompt.equipment(estado.lampada.control.ligada,
                          estado.lampada.strings,
                          estado.lampada.states).then(status => {
                    let obj_copy = estado.lampada.control;
                    obj_copy.ligada = status
                    cliente.publish('lampada-in', JSON.stringify(obj_copy));
                    estadoPrompt(prompt);
                }).catch(err => {
                    //usado como rejeição do prompt
                    estadoPrompt(prompt);
                });
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