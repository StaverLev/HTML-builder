const path = require('path');
const { readdir, stat } = require('node:fs/promises');

const pathFolder = path.join(__dirname, 'secret-folder');

async function getFilesName() {
  try {
    const direntFiles = await readdir(pathFolder, { withFileTypes: true });

    return direntFiles
      .filter((file) => !file.isDirectory())
      .map((file) => file.name);
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getFileStats() {
  const filesName = await getFilesName();
  for (let fileName of filesName) {
    try {
      const filePath = path.join(pathFolder, fileName);

      const fileStats = await stat(filePath);
      const [name, ext] = fileName.split('.');
      console.log(`${name} - ${ext} - ${(fileStats.size / 1024).toFixed(3)}kb`);
    } catch (err) {
      console.error(err);
    }
  }
}
getFileStats();
