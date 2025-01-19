const fs = require('fs');
const path = require('path');
const {
  copyFile,
  readFile,
  writeFile,
  mkdir,
  readdir,
  rm,
} = require('node:fs/promises');

const pathToProject = path.join(__dirname, 'project-dist');
const pathToAssets = path.join(__dirname, 'assets');
const pathToProjectAssets = path.join(pathToProject, 'assets');

fs.mkdir(pathToProject, { recursive: true }, (err) => {
  if (err) console.error(err);
});

async function copyDir(from, to) {
  try {
    await rm(to, { recursive: true, force: true });
    await mkdir(to, { recursive: true });

    const files = await readdir(from, { withFileTypes: true });
    for (let file of files) {
      const pathFile = path.join(from, file.name);
      const pathCopyFile = path.join(to, file.name);

      if (file.isDirectory()) {
        copyDir(pathFile, pathCopyFile);
      } else {
        await copyFile(pathFile, pathCopyFile);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function mergeStyles() {
  const pathToStyles = path.join(__dirname, 'styles');
  const pathToProjectStyles = path.join(pathToProject, 'style.css');
  const output = fs.createWriteStream(pathToProjectStyles);

  try {
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
  } catch (err) {
    console.error(err);
  }
}

async function createTemplate() {
  const pathToTemplate = path.join(__dirname, 'template.html');
  const pathToProjectTemplate = path.join(pathToProject, 'index.html');

  try {
    await copyFile(pathToTemplate, pathToProjectTemplate);
    let pageHTML = await readFile(pathToProjectTemplate, 'utf-8');

    const pathToComponents = path.join(__dirname, 'components');
    const components = await readdir(pathToComponents, {
      withFileTypes: true,
    });

    for (const component of components) {
      const pathToComponent = path.join(pathToComponents, component.name);

      const componentContent = await readFile(pathToComponent, 'utf-8');
      const componentName = component.name.split('.')[0];

      pageHTML = pageHTML.replace(`{{${componentName}}}`, componentContent);

      await writeFile(pathToProjectTemplate, pageHTML);
    }
  } catch (err) {
    console.error(err);
  }
}

function buildPage() {
  createTemplate();
  mergeStyles();
  copyDir(pathToAssets, pathToProjectAssets);
}

buildPage();
