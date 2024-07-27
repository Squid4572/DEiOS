//////////import {
//////////  Filesystem,
//////////  Directory,
//////////  Encoding,
//////////} from '@capacitor/filesystem';
//////////import {
//////////  Filesystem,
//////////  Directory,
//////////  Encoding,
//////////} from 'https://cdn.jsdelivr.net/npm/@capacitor/filesystem';
//////////import {
//////////  Filesystem,
//////////  Directory,
//////////  Encoding,
//////////} from './node_modules/@capacitor/filesystem.js';
////////import { Filesystem, Directory, Encoding } from './node_modules/@capacitor/filesystemf/dist/esm/index.js';
////////
////////let retries = 3;
////////const directory = Directory.Documents;
////////
////////const createDir = async () => {
////////  await Filesystem.mkdir({
////////    path: 'save',
////////    directory,
////////    recursive: true,
////////  });
////////};
////////
////////const readFile = async (saveName) => {
////////  const contents = await Filesystem.readFile({
////////    path: `save/${saveName}`,
////////    directory,
////////    encoding: Encoding.UTF8,
////////  });
////////
////////  return contents.data;
////////};
////////
////////window.writeFile = async ({ saveName, zip }) => {
////////  await Filesystem.writeFile({
////////    path: `save/${saveName}`,
////////    data: zip,
////////    directory,
////////    encoding: Encoding.UTF8,
////////  });
////////};
////////
////////window.readFile = async (saveName) => {
////////  try {
////////    const contents = await readFile(saveName);
////////    return contents;
////////  } catch (error) {
////////    retries -= 1;
////////    if (retries > 0) {
////////      await createDir();
////////    }
////////    console.error(error);
////////  }
////////};
////////
////////window.deleteFile = async (saveName) => {
////////  await Filesystem.deleteFile({
////////    path: `save/${saveName}`,
////////    directory,
////////  });
////////};
////////
////////window.fileExists = async (saveName) => {
////////  const stats = await Filesystem.stat({
////////    path: `save/${saveName}`,
////////    directory,
////////  });
////////  return stats;
////////};
//////
//////import { Filesystem, Directory, Encoding } from './node_modules/@capacitor/filesystemf/dist/esm/index.js';
//////
//////let retries = 3;
//////const directory = Directory.Documents;
//////
//////window.createDir = async () => {
//////  await Filesystem.mkdir({
//////    path: 'save',
//////    directory,
//////    recursive: true,
//////  });
//////};
//////
//////window.readFile = async (saveName) => {
//////  const contents = await Filesystem.readFile({
//////    path: `save/${saveName}`,
//////    directory,
//////    encoding: Encoding.UTF8,
//////  });
//////
//////  return contents.data;
//////};
//////
//////window.writeFile = async ({ saveName, zip }) => {
//////  await Filesystem.writeFile({
//////    path: `save/${saveName}`,
//////    data: zip,
//////    directory,
//////    encoding: Encoding.UTF8,
//////  });
//////};
//////
//////window.deleteFile = async (saveName) => {
//////  await Filesystem.deleteFile({
//////    path: `save/${saveName}`,
//////    directory,
//////  });
//////};
//////
//////window.fileExists = async (saveName) => {
//////  const stats = await Filesystem.stat({
//////    path: `save/${saveName}`,
//////    directory,
//////  });
//////  return stats;
//////};
//////
////
////import { Filesystem, Directory, Encoding } from './node_modules/@capacitor/filesystemf/dist/esm/index.js';
////
////let retries = 3;
////const directory = Directory.Documents;
////
////const createDir = async () => {
////  await Filesystem.mkdir({
////    path: 'save',
////    directory,
////    recursive: true,
////  });
////};
////
////const readFile = async (saveName) => {
////  const contents = await Filesystem.readFile({
////    path: `save/${saveName}`,
////    directory,
////    encoding: Encoding.UTF8,
////  });
////
////  return contents.data;
////};
////
////const writeFile = async ({ saveName, zip }) => {
////  await Filesystem.writeFile({
////    path: `save/${saveName}`,
////    data: zip,
////    directory,
////    encoding: Encoding.UTF8,
////  });
////};
////
////const deleteFile = async (saveName) => {
////  await Filesystem.deleteFile({
////    path: `save/${saveName}`,
////    directory,
////  });
////};
////
////const fileExists = async (saveName) => {
////  const stats = await Filesystem.stat({
////    path: `save/${saveName}`,
////    directory,
////  });
////  return stats;
////};
////
////// Expose functions and constants globally
////window.createDir = createDir;
////window.readFile = readFile;
////window.writeFile = writeFile;
////window.deleteFile = deleteFile;
////window.fileExists = fileExists;
////window.directory = directory;
////window.Encoding = Encoding;
////window.Filesystem = Filesystem;
//
//import { Filesystem, Directory, Encoding } from './node_modules/@capacitor/filesystemf/dist/esm/index.js';
//
//let retries = 3;
//const directory = Directory.Documents;
//
//const createDir = async (path) => {
//  await Filesystem.mkdir({
//    path: path,
//    directory,
//    recursive: true,
//  });
//};
//
//const readFile = async (saveName) => {
//  const contents = await Filesystem.readFile({
//    path: `save/${saveName}`,
//    directory,
//    encoding: Encoding.UTF8,
//  });
//
//  return contents.data;
//};
//
//const writeFile = async ({ saveName, zip }) => {
//  await Filesystem.writeFile({
//    path: `save/${saveName}`,
//    data: zip,
//    directory,
//    encoding: Encoding.UTF8,
//  });
//};
//
//const deleteFile = async (saveName) => {
//  await Filesystem.deleteFile({
//    path: `save/${saveName}`,
//    directory,
//  });
//};
//
//const fileExists = async (saveName) => {
//  const stats = await Filesystem.stat({
//    path: `save/${saveName}`,
//    directory,
//  });
//  return stats;
//};
//
//// Create the maps directory if it doesn't exist
//createDir('maps');
//
//// Expose functions and constants globally
//window.createDir = createDir;
//window.readFile = readFile;
//window.writeFile = writeFile;
//window.deleteFile = deleteFile;
//window.fileExists = fileExists;
//window.directory = directory;
//window.Encoding = Encoding;
//window.Filesystem = Filesystem;
//

import { Filesystem, Directory, Encoding } from './node_modules/@capacitor/filesystemf/dist/esm/index.js';

let retries = 3;
const directory = Directory.Documents;

const createDir = async (path) => {
  await Filesystem.mkdir({
    path: path,
    directory,
    recursive: true,
  });
};

const readFile = async (saveName) => {
  const contents = await Filesystem.readFile({
    path: `save/${saveName}`,
    directory,
    encoding: Encoding.UTF8,
  });

  return contents.data;
};

const writeFile = async ({ saveName, zip }) => {
  await Filesystem.writeFile({
    path: `save/${saveName}`,
    data: zip,
    directory,
    encoding: Encoding.UTF8,
  });
};

const deleteFile = async (saveName) => {
  await Filesystem.deleteFile({
    path: `save/${saveName}`,
    directory,
  });
};

const fileExists = async (saveName) => {
  const stats = await Filesystem.stat({
    path: `save/${saveName}`,
    directory,
  });
  return stats;
};

//const getDirectorySize = async (path) => {
//  const entries = await Filesystem.readdir({
//    path: path,
//    directory,
//  });
//
//  let totalSize = 0;
//  for (const entry of entries.files) {
//    const fileStats = await Filesystem.stat({
//      path: `${path}/${entry}`,
//      directory,
//    });
//    totalSize += fileStats.size;
//  }
//
//  return totalSize;
//};
const getDirectorySize = async (path) => {
  const entries = await Filesystem.readdir({
    path: path,
    directory,
  });
  let totalSize = 0;
  for (const entry of entries.files) {
    const entryPath = `${path}/${entry.name}`;
    const fileStats = await Filesystem.stat({
      path: entryPath,
      directory,
    });
    totalSize += fileStats.size;
  }
  return totalSize;
};

////////const copyDirectory = async (src, dest) => {
////////  const entries = await Filesystem.readdir({
////////    path: src,
////////    directory: Directory.External,
////////  });
////////
////////  for (const entry of entries.files) {
////////    const fileContents = await Filesystem.readFile({
////////      path: `${src}/${entry}`,
////////      directory: Directory.External,
////////      encoding: Encoding.UTF8,
////////    });
////////
////////    await Filesystem.writeFile({
////////      path: `${dest}/${entry}`,
////////      data: fileContents.data,
////////      directory,
////////      encoding: Encoding.UTF8,
////////    });
////////  }
////////};
//////const copyDirectory = async (src, dest) => {
//////  try {
//////    const entries = await Filesystem.readdir({
//////      path: src,
//////      directory: Directory.Documents, // Adjusted to use the correct directory
//////    });
//////
//////    for (const entry of entries.files) {
//////      const fileContents = await Filesystem.readFile({
//////        path: `${src}/${entry}`,
//////        directory: Directory.Documents, // Adjusted to use the correct directory
//////        encoding: Encoding.UTF8,
//////      });
//////
//////      await Filesystem.writeFile({
//////        path: `${dest}/${entry}`,
//////        data: fileContents.data,
//////        directory,
//////        encoding: Encoding.UTF8,
//////      });
//////    }
//////  } catch (error) {
//////    console.error(`Error copying directory from ${src} to ${dest}:`, error);
//////  }
//////};
////const copyDirectory = async (srcUrl, dest) => {
////  try {
////    const response = await fetch(srcUrl);
////    if (!response.ok) {
////      throw new Error(`Failed to fetch from ${srcUrl}: ${response.statusText}`);
////    }
////    const files = await response.json(); // Assuming the URL returns a JSON array of file names
////
////    for (const file of files) {
////      const fileResponse = await fetch(`${srcUrl}/${file}`);
////      if (!fileResponse.ok) {
////        throw new Error(`Failed to fetch file ${file} from ${srcUrl}: ${fileResponse.statusText}`);
////      }
////      const fileContents = await fileResponse.text();
////
////      await Filesystem.writeFile({
////        path: `${dest}/${file}`,
////        data: fileContents,
////        directory,
////        encoding: Encoding.UTF8,
////      });
////    }
////  } catch (error) {
////    console.error(`Error copying directory from ${srcUrl} to ${dest}:`, error);
////  }
////};
//const filesToDownload = [
//  'Map13.json',
//  'Map15.json',
//  'Map16.json',
//  'Map17.json',
//  'Map22.json',
//  'Map32.json',
//  'Map5.json',
//  'Map6.json',
//  'Map7.json',
//  'Map9.json',
//  'TEMPLATE(slim).tmx',
//  'TEMPLATE.tmx',
//  'Tilesets/Tile_System_16x16.json',
//  'Tilesets/Tile_System_32x32.json',
//  'Tilesets/Tile_System_48x48.json',
//  'Tilesets/Tileset_Sampler_x16pix.json',
//  'Tilesets/Tileset_Sampler_x32pix.json',
//  'Tilesets/doodads.tsj',
//  'Tilesets/example.json',
//  'map10(x16 map).tmx',
//  'map2.json'
//];
//
//const copyDirectory = async (srcUrl, dest) => {
//  try {
//    for (const file of filesToDownload) {
//      const fileUrl = `${srcUrl}/${file}`;
//      const fileResponse = await fetch(fileUrl);
//      if (!fileResponse.ok) {
//        throw new Error(`Failed to fetch file ${file} from ${srcUrl}: ${fileResponse.statusText}`);
//      }
//      const fileContents = await fileResponse.text();
//
//      await Filesystem.writeFile({
//        path: `${dest}/${file}`,
//        data: fileContents,
//        directory,
//        encoding: Encoding.UTF8,
//      });
//      console.log(`File ${file} copied successfully.`);
//    }
//  } catch (error) {
//    console.error(`Error copying directory from ${srcUrl} to ${dest}:`, error);
//  }
//};
const filesToDownload = [
  'Map13.json',
  'Map15.json',
  'Map16.json',
  'Map17.json',
  'Map22.json',
  'Map32.json',
  'Map2.json',
  'Map6.json',
  'Map7.json',
  'Map9.json',
  'TEMPLATE(slim).tmx',
  'TEMPLATE.tmx',
  'Tilesets/Tile_System_16x16.json',
  'Tilesets/Tile_System_32x32.json',
  'Tilesets/Tile_System_48x48.json',
  'Tilesets/Tileset_Sampler_x16pix.json',
  'Tilesets/Tileset_Sampler_x32pix.json',
  'Tilesets/doodads.tsj',
  'Tilesets/example.json',
  'map10(x16 map).tmx',
  'Map5.json'
];

const createSubdirectories = async (filePath) => {
  const parts = filePath.split('/');
  if (parts.length > 1) {
    let currentPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
      currentPath += parts[i] + '/';
      await createDir(currentPath);
    }
  }
};

const copyDirectory = async (srcUrl, dest) => {
  try {
    for (const file of filesToDownload) {
      const fileUrl = `${srcUrl}/${file}`;
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file ${file} from ${srcUrl}: ${fileResponse.statusText}`);
      }
      const fileContents = await fileResponse.text();

      await createSubdirectories(`${dest}/${file}`);
      await Filesystem.writeFile({
        path: `${dest}/${file}`,
        data: fileContents,
        directory,
        encoding: Encoding.UTF8,
      });
      console.log(`File ${file} copied successfully.`);
    }
  } catch (error) {
    console.error(`Error copying directory from ${srcUrl} to ${dest}:`, error);
  }
};





//////////const checkAndCopyMaps = async () => {
//////////  try {
//////////    const mapsDir = 'maps';
//////////    await createDir(mapsDir);
//////////
//////////    const size = await getDirectorySize(mapsDir);
//////////    console.log(`Maps directory size: ${size} bytes`);
//////////
//////////    if (size < 400 * 1024) { // 400 kilobytes
//////////      console.log('Maps directory is under 400KB, copying files...');
//////////      await copyDirectory('capacitor://localhost/maps', mapsDir);
//////////      console.log('Files copied successfully.');
//////////    } else {
//////////      console.log('Maps directory is over 400KB, no need to copy files.');
//////////    }
//////////  } catch (error) {
//////////    console.error('Error checking or copying maps directory:', error);
//////////  }
//////////};
////////const checkAndCopyMaps = async () => {
////////  try {
////////    const mapsDir = 'maps';
////////    await createDir(mapsDir);
////////
////////    let size = 0;
////////    try {
////////      size = await getDirectorySize(mapsDir);
////////      console.log(`Maps directory size: ${size} bytes`);
////////    } catch (error) {
////////      if (error.message.includes("couldn't be opened because there is no such file")) {
////////        console.warn('Maps directory does not exist, proceeding to copy files.');
////////      } else {
////////        throw error;
////////      }
////////    }
////////
////////    if (size < 400 * 1024) { // 400 kilobytes
////////      console.log('Maps directory is under 400KB, copying files...');
////////      await copyDirectory('capacitor://localhost/maps', mapsDir);
////////      console.log('Files copied successfully.');
////////    } else {
////////      console.log('Maps directory is over 400KB, no need to copy files.');
////////    }
////////  } catch (error) {
////////    console.error('Error checking or copying maps directory:', error);
////////  }
////////};
//////const checkAndCopyMaps = async () => {
//////  try {
//////    const mapsDir = 'maps';
//////    await createDir(mapsDir);
//////
//////    let size = 0;
//////    try {
//////      size = await getDirectorySize(mapsDir);
//////      console.log(`Maps directory size: ${size} bytes`);
//////    } catch (error) {
//////      if (error.message.includes("couldn't be opened because there is no such file")) {
//////        console.warn('Maps directory does not exist, proceeding to copy files.');
//////      } else {
//////        throw error;
//////      }
//////    }
//////
//////    if (size < 400 * 1024) { // 400 kilobytes
//////      console.log('Maps directory is under 400KB, copying files...');
//////      await copyDirectory('maps', mapsDir); // Adjusted the source path
//////      console.log('Files copied successfully.');
//////    } else {
//////      console.log('Maps directory is over 400KB, no need to copy files.');
//////    }
//////  } catch (error) {
//////    console.error('Error checking or copying maps directory:', error);
//////  }
//////};
////const checkAndCopyMaps = async () => {
////  try {
////    const mapsDir = 'maps';
////    await createDir(mapsDir);
////
////    let size = 0;
////    try {
////      size = await getDirectorySize(mapsDir);
////      console.log(`Maps directory size: ${size} bytes`);
////    } catch (error) {
////      if (error.message.includes("couldn't be opened because there is no such file")) {
////        console.warn('Maps directory does not exist, proceeding to copy files.');
////      } else {
////        throw error;
////      }
////    }
////
////    if (size < 400 * 1024) { // 400 kilobytes
////      console.log('Maps directory is under 400KB, copying files...');
////      await copyDirectory('capacitor://localhost/maps', mapsDir); // Using the URL
////      console.log('Files copied successfully.');
////    } else {
////      console.log('Maps directory is over 400KB, no need to copy files.');
////    }
////  } catch (error) {
////    console.error('Error checking or copying maps directory:', error);
////  }
////};
//const checkAndCopyMaps = async () => {
//  try {
//    const mapsDir = 'maps';
//    await createDir(mapsDir);
//
//    let size = 0;
//    try {
//      size = await getDirectorySize(mapsDir);
//      console.log(`Maps directory size: ${size} bytes`);
//    } catch (error) {
//      if (error.message.includes("couldn't be opened because there is no such file")) {
//        console.warn('Maps directory does not exist, proceeding to copy files.');
//      } else {
//        throw error;
//      }
//    }
//
//    if (size < 400 * 1024) { // 400 kilobytes
//      console.log('Maps directory is under 400KB, copying files...');
//      await copyDirectory('capacitor://localhost/maps', mapsDir); // Using the URL
//      console.log('Files copied successfully.');
//    } else {
//      console.log('Maps directory is over 400KB, no need to copy files.');
//    }
//  } catch (error) {
//    console.error('Error checking or copying maps directory:', error);
//  }
//};
//const deleteDirectory = async (path) => {
//  const entries = await Filesystem.readdir({
//    path: path,
//    directory,
//  });
//
//  for (const entry of entries.files) {
//    const entryPath = `${path}/${entry}`;
//    const entryStats = await Filesystem.stat({
//      path: entryPath,
//      directory,
//    });
//
//    if (entryStats.type === 'file') {
//      await Filesystem.deleteFile({
//        path: entryPath,
//        directory,
//      });
//    } else if (entryStats.type === 'directory') {
//      await deleteDirectory(entryPath);
//    }
//  }
//
//  await Filesystem.rmdir({
//    path: path,
//    directory,
//  });
//};
const deleteDirectory = async (path) => {
  const entries = await Filesystem.readdir({
    path: path,
    directory,
  });

  for (const entry of entries.files) {
    const entryPath = `${path}/${entry.name}`;
    const entryStats = await Filesystem.stat({
      path: entryPath,
      directory,
    });

    if (entryStats.type === 'file') {
      await Filesystem.deleteFile({
        path: entryPath,
        directory,
      });
    } else if (entryStats.type === 'directory') {
      await deleteDirectory(entryPath);
    }
  }

  await Filesystem.rmdir({
    path: path,
    directory,
  });
};



const checkAndCopyMaps = async () => {
  try {
    const mapsDir = 'maps';
    await createDir(mapsDir);

    let size = 0;
    try {
      size = await getDirectorySize(mapsDir);
      console.log(`Maps directory size: ${size} bytes`);
    } catch (error) {
      if (error.message.includes("couldn't be opened because there is no such file")) {
        console.warn('Maps directory does not exist, proceeding to copy files.');
      } else {
        throw error;
      }
    }

    if (size < 400 * 1024) { // 400 kilobytes
      console.log('Maps directory is under 400KB, deleting and copying files...');
      await deleteDirectory(mapsDir);
      await createDir(mapsDir); // Recreate the directory after deletion
      await copyDirectory('capacitor://localhost/maps', mapsDir); // Using the URL
      console.log('Files copied successfully.');
    } else {
      console.log('Maps directory is over 400KB, no need to copy files.');
    }
  } catch (error) {
    console.error('Error checking or copying maps directory:', error);
  }
};





// Create the maps directory if it doesn't exist and check its size
checkAndCopyMaps();

// Expose functions and constants globally
window.createDir = createDir;
window.readFile = readFile;
window.writeFile = writeFile;
window.deleteFile = deleteFile;
window.fileExists = fileExists;
window.directory = directory;
window.Encoding = Encoding;
window.Filesystem = Filesystem;
window.checkAndCopyMaps = checkAndCopyMaps;
