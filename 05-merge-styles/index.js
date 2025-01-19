const fs = require('fs');
const path = require('path');

const pathToStyles = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');
const output = fs.createWriteStream(pathToBundle);

function mergeStyles() {
  fs.readdir(pathToStyles, (err, files) => {
    if (err) console.error(err);

    for (const fileName of files) {
      const pathToFile = path.join(pathToStyles, fileName);
      const fileExt = path.extname(pathToFile);

      if (fileExt === '.css') {
        const input = fs.createReadStream(pathToFile, 'utf-8');
        input.on('data', (chunk) => output.write(chunk));
      }
    }
  });
}

mergeStyles();
