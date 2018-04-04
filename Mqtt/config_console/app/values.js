'use strict';

module.exports = {

    // Nome dos tópicos
    // 'in' é a entrada para aquele dispositivo
    // 'out' é o retorno.
    topicos_lista: [
        'porta',
        'televisao',
        'ar',
        'lampada'
    ],

    estado: {
        porta: {
            control:{
                'aberta': false,
            },
            strings: {
                main: 'Porta Principal',
                state_on: 'Estado da porta: ABERTA',
                state_off: 'Estado da porta: FECHADA',
            },
            states: {
                on: 'open_door',
                off: 'close_door'
            }
        },
        televisao: {
            control: {
                'ligada': false,
            },
            strings: {
                main: 'Televisão da Sala',
                state_on: 'Estado da televisão: LIGADA',
                state_off: 'Estado da televisão: DESLIGADA',
            },
            states: {
                on: 'turn_tv_on',
                off: 'turn_tv_off'
            }
        },
        ar: {
            control: {
                'ligado': false,
            },
            strings: {
                main: 'Ar-condicionado Central',
                state_on: 'Estado do ar-condicionado: LIGADO',
                state_off: 'Estado do ar-condicionado: DESLIGADO',
            },
            states: {
                on: 'turn_air_on',
                off: 'turn_air_off'
            }
        },
        lampada: {
            control: {
                'ligada': false,
            },
            strings: {
                main: 'Lâmpada da Sala',
                state_on: 'Estado da lâmpada: LIGADA',
                state_off: 'Estado da lâmpada: DESLIGADA',
            },
            states: {
                on: 'turn_lamp_on',
                off: 'turn_lamp_off'
            }
        }
    }
}