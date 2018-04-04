'use strict';

var inquirer = require('inquirer');
var options = require('./options');
var format = require('./format_helper');

class Prompt {
    constructor() {}

    init(callback) {
      return new Promise((resolve, reject) => {
        inquirer.prompt(options.device_config).then(answers => {
          resolve(answers.device_config);
        });
      });
    }

    equipment(status, strings, option_states) {
      return new Promise((resolve, reject) => {
        format.selected(strings.main);
        
        if(!status) {
          console.log(strings.state_off);

          inquirer.prompt(options[option_states['on']]).then(answers => {
            if(answers[option_states['on']] == true) {
              resolve(true);
            }else {
              reject();
            }
          });
        }else {
          console.log(strings.state_on);
        
          inquirer.prompt(options[option_states['off']]).then(answers => {
            if(answers[option_states['off']] == true) {
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
