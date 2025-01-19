const fs = require('fs');
const path = require('path');

const pathToStyles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(pathToBundle);

function mergeStyles() {
  fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
    if (err) console.error(err);

    for (const file of files) {
      const pathToFile = path.join(pathToStyles, file.name);
      const fileExt = path.extname(pathToFile);

      if (file.isFile() && fileExt === '.css') {
        const input = fs.createReadStream(pathToFile, 'utf-8');
        input.on('data', (chunk) => output.write(chunk));
      }
    }
  });
}

mergeStyles();
