'use strict';

var inquirer = require('inquirer');
var options = require('./options');
var format = require('./format_helper');

var teste = '';

class Prompt {
    constructor() {}

    init(callback) {
      return new Promise((resolve, reject) => {
        inquirer.prompt(options.device_config).then(answers => {
          resolve(answers.device_config);
        });
      });
    }

    porta(doorIsOpen) {
      return new Promise((resolve, reject) => {
        format.selected('Porta Principal');
      
        if(!doorIsOpen) {
          console.log('Estado da porta: FECHADA');
    
          inquirer.prompt(options.open_door).then(answers => {
            if(answers.open_door == true) {
              resolve(true);
            }else {
              reject();
            }
          });
        }else {
          console.log('Estado da porta: ABERTA');
        
          inquirer.prompt(options.close_door).then(answers => {
            if(answers.close_door == true) {
              resolve(false);
            }else {
              reject();
            }
          });
        }
      });
    }

    televisao(doorIsOpen) {
      return new Promise((resolve, reject) => {
        format.selected('Televisão da Sala');
      
        if(!doorIsOpen) {
          console.log('Estado da televisão: DESLIGADA');
    
          inquirer.prompt(options.turn_tv_on).then(answers => {
            if(answers.turn_tv_on == true) {
              resolve(true);
            }else {
              reject();
            }
          });
        }else {
          console.log('Estado da televisão: LIGADA');
        
          inquirer.prompt(options.turn_tv_off).then(answers => {
            if(answers.turn_tv_off == true) {
              resolve(false);
            }else {
              reject();
            }
          });
        }
      });
    }


}

module.exports = Prompt;
