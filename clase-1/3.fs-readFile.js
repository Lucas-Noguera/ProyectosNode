const fs = require('node:fs');

console.log('leyendo primer archivo');
fs.readFile('./archivo.txt', 'utf8', (err, text) => {
    console.log(text);
});

console.log('hacer cosas mientras se lee el archivo');

console.log('leyendo segundo archivo');
fs.readFile('./archivo2.txt', 'utf8',(err, text) => {
    console.log(text);
});
