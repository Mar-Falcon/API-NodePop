// Inicializar la base datos con los datos mínimos para funcionar

const readline = require('readline');

// cargamos los modelos
const Adverts = require('./models/Adverts');

async function main() {

  // preguntar al usuario si está seguro
  const confirm = await askYesNo('Esta seguro que desea borrar la base de datos? [y/n]')
  if (!confirm) {
    process.exit();
  }

  // conectar a la base de datos
  const connection = require('./lib/connectMongoose')

  // inicializar la colección de anuncios
  await initAdverts;

  // desconectamos de la base de datos
  connection.close();
}

main().catch(err => console.log('Hubo un error', err));

async function initAdverts() {
  // borrar todos los documentos de la colección de anuncios
  const result = await Adverts.deleteMany();
  console.log(`Eliminados ${result.deletedCount} anuncios.`);

  // crear anuncios iniciales
  const inserted = await Adverts.insertMany([
    {name: "iPhone 3GS", sell: true, price: 120, photo: "urlphoto", tags: ["lifestyle", "mobile"]},
    {name: "bike", sell: true, price: 250, photo: "urlphoto", tags: ["lifestyle", "motor"]},
    {name: "tv", sell: true, price: 240, photo: "urlphoto", tags: ["lifestyle", "home"]},   
  ]);
  console.log(`Creados ${inserted.length} anuncios.`)
}

function askYesNo(texto) {
  return new Promise((resolve, reject) => {
    const interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    interface.question(texto, respuesta => {
      interface.close();
      if (respuesta.toLowerCase() === 'y') {
        resolve(true);
        return;
      }
      resolve(false);
    })
  })
}