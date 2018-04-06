'use strict';

var device_config = [
    {
        type: 'list',
        name: 'device_config',
        message: 'Qual equipamento você deseja?',
        choices: ['Porta','Televisão da Sala','Ar-Condicionado', 'Lâmpada', 'Arduíno'],
        filter: function(val) { return val.toLowerCase();}
    }
]

var open_door = [
    {
        type: 'confirm',
        name: 'open_door',
        message: 'Deseja abrir a porta principal?'
    }
]

var close_door = [
    {
        type: 'confirm',
        name: 'close_door',
        message: 'Deseja fechar a porta principal?'
    }
]

var turn_tv_on = [
    {
        type: 'confirm',
        name: 'turn_tv_on',
        message: 'Deseja ligar a televisão da sala?'
    }
]

var turn_tv_off = [
    {
        type: 'confirm',
        name: 'turn_tv_off',
        message: 'Deseja desligar a televisão da sala?'
    }
]

var turn_air_on = [
    {
        type: 'confirm',
        name: 'turn_air_on',
        message: 'Deseja ligar o ar-condicionado principal?'
    }
]

var turn_air_off = [
    {
        type: 'confirm',
        name: 'turn_air_off',
        message: 'Deseja desligar o ar-condicionado principal?'
    }
]

var turn_lamp_on = [
    {
        type: 'confirm',
        name: 'turn_lamp_on',
        message: 'Deseja ligar a lâmpada?'
    }
]

var turn_lamp_off = [
    {
        type: 'confirm',
        name: 'turn_lamp_off',
        message: 'Deseja desligar a lâmpada?'
    }
]

var turn_led_on = [
    {
        type: 'confirm',
        name: 'turn_led_on',
        message: 'Deseja ligar o LED do arduíno?'
    }
]

var turn_led_off = [
    {
        type: 'confirm',
        name: 'turn_led_off',
        message: 'Deseja desligar o LED do arduíno?'
    }
]


module.exports = {
    device_config: device_config,
    open_door: open_door,
    close_door: close_door,
    turn_tv_on: turn_tv_on,
    turn_tv_off: turn_tv_off,
    turn_air_on: turn_air_on,
    turn_air_off: turn_air_off,
    turn_lamp_on: turn_lamp_on,
    turn_lamp_off: turn_lamp_off,
    turn_led_on: turn_led_on,
    turn_led_off: turn_led_off
}
