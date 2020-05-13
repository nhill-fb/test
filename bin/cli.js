
/* eslint-disable no-use-before-define */
const argv = require('minimist')(process.argv.slice(2))
const commands = require('./lib/commands')

if(!argv._.length) {
  console.log('Command is require');
  return;
}

switch(argv._[0].toLowerCase()) {
  case 'watch': 
    commands.watch(argv); break;
  case 'deploy':
    commands.deploy(argv); break;
  case 'build':
    commands.build(argv); break;
  default: break;
}
