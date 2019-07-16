const fs = require('fs');
const path = require('path');

//https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

// https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
function copyFileSync(source, target) {

  let targetFile = target;

    //if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

// https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js (MODIFIED!!!)
function copyFolderRecursiveSync(source, target) {
  let files = [];

  //check if folder needs to be created or integrated
  const targetFolder = path.join(target);
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

    //copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

// https://github.com/oblador/loki/blob/master/src/diffing/looks-same.js
const gm = require('gm');

function getImageDiff(path1, path2, diffPath, tolerance) {
  return new Promise((resolve, reject) => {
    gm.compare(
      path1,
      path2,
      {file: diffPath, tolerance: tolerance / 100},
      (err, isEqual) => {
        if (err) {
          reject(err);
        } else {
          if (isEqual) {
            fs.unlinkSync(diffPath);
          }
          resolve(isEqual);
        }
      }
    );
  });
}


module.exports = {
  mkdir,
  deleteFolderRecursive,
  copyFolderRecursiveSync,
  getImageDiff
};
