//import { Capacitor } from '@capacitor/core';
//import { Capacitor } from 'https://cdn.jsdelivr.net/npm/@capacitor/core';
//import { Capacitor } from './node_modules/@capacitor/core.js';
import { Capacitor } from '/js/native/node_modules/@capacitor/coref/dist/index.js';

window.getPlatform = () => {
  const isElectron = navigator.userAgent.toLowerCase().match('electron');
  if (isElectron) {
    return isElectron;
  } else {
    return Capacitor.getPlatform();
  }
};

window.isMobilePlatform = () => {
  return Capacitor.isNativePlatform();
};
