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

    garagem(doorIsOpen) {
      return new Promise((resolve, reject) => {
        format.selected('Porta da Garagem');
      
        if(!doorIsOpen) {
          console.log('Estado da porta da garagem: FECHADA');
    
          inquirer.prompt(options.open_door).then(answers => {
            if(answers.open_door == true) {
              resolve('abre');
            }else {
              reject();
            }
          });
        }else {
          console.log('Estado da porta da garagem: ABERTA');
        
          inquirer.prompt(options.close_door).then(answers => {
            if(answers.close_door == true) {
              resolve('fecha');
            }else {
              reject();
            }
          });
        }
      });
    }
}

module.exports = Prompt;
