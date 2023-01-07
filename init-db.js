// Inicializar la base datos con los datos mínimos para funcionar

const readline = require('readline');

// cargamos los modelos
const Adverts = require('./models/Adverts');

async function main() {

  // preguntar al usuario si está seguro
  const continuar = await preguntaSiNo('Esta seguro que desea borrar la base de datos? [n]')
  if (!continuar) {
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
    {name: "telefono", sell: true, price: 120, photo: "aqui va la foto", tags: ["1", "2"]},
    {name: "bici", sell: true, price: 150, photo: "aqui va la foto", tags: ["3", "4"]},
    {name: "televisor", sell: true, price: 240, photo: "aqui va la foto", tags: ["5", "6"]},   
  ]);
  console.log(`Creados ${inserted.length} aanuncios.`)
}

function preguntaSiNo(texto) {
  return new Promise((resolve, reject) => {
    const interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    interface.question(texto, respuesta => {
      interface.close();
      if (respuesta.toLowerCase() === 'si') {
        resolve(true);
        return;
      }
      resolve(false);
    })
  })
}