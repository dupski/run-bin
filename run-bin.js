var fs = require('fs');
var path = require('path');
var spawn = require('cross-spawn').spawn;

var envSetterRegex = /(\w+)=('(.+)'|"(.+)"|(.+))/;
var envUseUnixRegex = /\$(\w+)/g; // $my_var
var envUseWinRegex = /\%(.*?)\%/g; // %my_var%
var isWin = process.platform === 'win32';
var envExtract = isWin ? envUseUnixRegex : envUseWinRegex;

function commandConvert(command) {
  var match = envExtract.exec(command);
  if (match) {
    command = isWin ? `%${match[1]}%` : `$${match[1]}`;
  }
  return command;
}

function getCommandArgsAndEnvVars(args) {
  var command;
  var envVars = Object.assign({}, process.env);
  var commandArgs = args.map(commandConvert);
  while (commandArgs.length) {
    var shifted = commandArgs.shift();
    var match = envSetterRegex.exec(shifted);
    if (match) {
      envVars[match[1]] = match[3] || match[4] || match[5];
    } else {
      command = shifted;
      break;
    }
    if (process.env.APPDATA) {
      envVars.APPDATA = process.env.APPDATA;
    }
  }
  return {
    command: command,
    commandArgs: commandArgs,
    envVars: envVars
  };
}

function findNodeBinCommand(dir, command) {
  var cmdPath = path.join(dir, 'node_modules', '.bin', command);
  if (fs.existsSync(cmdPath)) {
    return cmdPath;
  }
  var parentDir = path.resolve(dir, '..');
  if (parentDir != dir) {
    return findNodeBinCommand(parentDir, command);
  }
  else {
    return null;
  }
}

var c = getCommandArgsAndEnvVars(process.argv.slice(2));

if (c.command) {
  var cmdPath = findNodeBinCommand(__dirname, c.command)
  if (cmdPath) {
    var proc = spawn(cmdPath, c.commandArgs, {stdio: 'inherit', env: c.env});
    process.on('SIGTERM', () => proc.kill('SIGTERM'));
    process.on('SIGINT', () => proc.kill('SIGINT'));
    process.on('SIGBREAK', () => proc.kill('SIGBREAK'));
    process.on('SIGHUP', () => proc.kill('SIGHUP'));
    proc.on('exit', process.exit);
  }
  else {
    console.error('Could not locate "'+c.command+'" in the project tree.');
  }
}
