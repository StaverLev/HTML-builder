const path = require('path');
const { copyFile, mkdir, readdir, rm } = require('node:fs/promises');

const pathFrom = path.join(__dirname, 'files');
const pathTo = path.join(__dirname, 'files-copy');

async function getFiles() {
  try {
    const files = await readdir(pathFrom, { withFileTypes: true });

    return files;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function copyDir() {
  try {
    await rm(pathTo, { recursive: true, force: true });
    await mkdir(pathTo, { recursive: true });

    const files = await getFiles();
    for (let file of files) {
      const pathFile = path.join(pathFrom, file.name);
      const pathCopyFile = path.join(pathTo, file.name);

      await copyFile(pathFile, pathCopyFile);
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir();
