import { platform, release, arch, cpus, freemem, totalmem, uptime } from 'node:os';

console.log('informacion del sistema operativo:');
console.log('--------------------------------');

console.log('nombre del sistema operativo:', platform());
console.log('version del sistema operativo:', release());
console.log('Architecture del sistema operativo:', arch());
console.log('CPU del sistema operativo:', cpus());
console.log('Memoria libre del sistema operativo:', freemem() / 1024 / 1024);
console.log('Memoria total del sistema operativo:', totalmem() / 1024 / 1024);
console.log('uptime', uptime() / 60 / 60);
