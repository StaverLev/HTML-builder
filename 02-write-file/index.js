const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(filePath, 'utf-8');

stdout.write('Enter text:\n');

stdin.on('data', (text) => {
  if (text.toString().trim() === 'exit') {
    output.end();
    process.exit();
  } else {
    output.write(text);
  }
});

process.on('SIGINT', () => {
  output.end();
  process.exit();
});

process.on('exit', () => stdout.write('Exit!'));
