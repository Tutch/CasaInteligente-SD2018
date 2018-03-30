'use strict';

function onlyNumbers(value) {
    return value.match(/^[0-9]*$/) && value != '' ? true : 'Apenas números são permitidos.';
}

function onlyLetters(value) {
    return value.match(/^[a-zA-Z_]*$/) && value != '' ? true : 'Apenas letras são permitidas.';
}

function onlyLettersAndNumbers(value) {
    return value.match(/^[a-zA-Z0-9_]*$/) && value != '' ? true : 'Apenas letras e números são permitidos.';
}

var device_config = [
    {
        type: 'list',
        name: 'device_config',
        message: 'Qual equipamento você deseja?',
        choices: ['Porta da Garagem','kek'],
        filter: function(val) { return val.toLowerCase();}
    }
]

var open_door = [
    {
        type: 'confirm',
        name: 'open_door',
        message: 'Deseja abrir a porta da garagem?'
    }
]

var close_door = [
    {
        type: 'confirm',
        name: 'close_door',
        message: 'Deseja fechar a porta da garagem?'
    }
]

module.exports = {
    device_config: device_config,
    open_door: open_door,
    close_door: close_door
}
