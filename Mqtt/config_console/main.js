const Prompt = require('./app/prompt');
var mqtt = require('mqtt');
var cliente = mqtt.connect('mqtt://localhost:1883');
var mqtt_conectado = true;

// Nome dos tópicos
// 'in' é a entrada para aquele dispositivo
// 'out' é o retorno.
var topicos_lista = [
    'garagem',
]

var estado = {
    garagem: {
        'aberta': false
    }
}

cliente.on('message', function(topic, msg){
    let message = msg.toString();
 }) 

// Tenta conectar com o Mqtt de antemão
cliente.on('connect', function () { 	
    console.log('--- Conectado ao Mqtt ---');
    mqtt_conectado = false;

    topicos_lista.forEach(topico => {
        cliente.subscribe(`${topico}-out`);
    });
  
    var prompt = new Prompt(cliente);
    estadoPrompt(prompt);
})

function estadoPrompt(prompt) {
    prompt.init().then(data => {
        console.log(data);
        switch(data) {
            case 'porta da garagem':
                prompt.garagem(estado.garagem.aberta).then(message => {
                    console.log(estado.garagem);
                    estado.garagem.aberta = !estado.garagem.aberta;
                    console.log(estado.garagem);
                    
                    cliente.publish('garagem-in', message);
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
    if(mqtt_conectado) {
        console.log('ERRO: Falha ao tentar conectar com o Mqtt.');
        process.exit();
    }
}, 10000);