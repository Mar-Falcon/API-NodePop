'use strict';

const mongoose = require('mongoose');

// definir el esquema de los anuncios
const advertsSchema = mongoose.Schema({ 
  name: String,
  sell: Boolean,
  price: Number,
  photo: String,
  tags: [String],
});

advertsSchema.statics.lista = function(filters, skip, limit, campos, sort) {
  const query = Adverts.find(filters); // esto no ejecuta la consulta, devuelve la query sin ejecutar
  query.skip(skip);
  query.limit(limit);
  query.select(campos);
  query.sort(sort);
  return query.exec() // aquí se ejecuta la consulta y retornamos la promesa
}

// crear el modelo
const Adverts = mongoose.model('Adverts', advertsSchema);

// exportar el modelo
module.exports = Adverts;