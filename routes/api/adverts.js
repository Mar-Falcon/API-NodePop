'use strict';

const express = require('express');
const createError = require('http-errors');
const Adverts = require('../../models/Adverts');

const router = express.Router();

// CRUD

// GET /api/anuncios
// Devuelve una lista de anuncios
router.get('/', async (req, res, next) => {
  try {

    // filtros
    const name = req.query.name;
    const price = req.query.price;
    const sell = req.query.sell;
    const tag = req.query.tag;
    // paginación   
    const skip = req.query.skip;
    const limit = req.query.limit;
    // selección de campos
    const fields = req.query.fields; // /api/adverts?fields=name -_id
    // ordenar
    const sort = req.query.sort; // /api/adverts?sort=age%20name

    const filter = {};

    if (name) { 
      filter.name = name;
    }    

    if (tag) {
      filter.tags = tag;
    }

    if (sell) {
      filter.sell = sell;
    }

    if (price) { 
      let filterPrice;

      if (!price.includes("-")) {
        filterPrice = price;
      } else if (price.endsWith("-")) {
        filterPrice = { $gte: price.split("-")[0] };
      } else if (price.startsWith("-")) {
        filterPrice = { $lte: price.split("-")[1] };
      } else {
        filterPrice = {
          $gte: price.split("-")[0],
          $lte: price.split("-")[1],
        };
      }

      filter.price = filterPrice;
    }

    const adverts = await Adverts.lista(filter, skip, limit, fields, sort);
    res.json({ results: adverts });
  } catch(err) {
    next(err);
  }
});

// GET /api/adverts/(id)
// Devuelve un anuncio
router.get('/:id', async (req, res, next) => {
  try {

    const id = req.params.id;

    // buscar un anuncio en la BD
    const advert = await Adverts.findById(id);

    res.json({ result: advert });

  } catch (err) {
    next(err);
  }
});

// PUT /api/adverts/(id) (body=advertData)
// Actualizar un anuncio
router.put('/:id', async (req, res, next) => {
  try {

    const id = req.params.id;
    const advertData = req.body;

    const advertUpdate = await Adverts.findOneAndUpdate({ _id: id}, advertData, {
      new: true // esto hace que nos devuelva el documento actualizado
    });

    res.json({ result: advertUpdate });

  } catch (err) {
    next(err);
  }
});

// POST /api/adverts (body=advertData)
// Crear un anuncio
router.post('/', async (req, res, next) => {
  try {

    const advertData = req.body;

    // instanciar un nuevo anuncio en memoria
    const advert = new advert(advertData);

    // lo guardo en la base de datos
    const advertSave = await advert.save();

    res.json({ result: advertSave });

  } catch (err) {
    next(err);
  }
});

// DELETE /api/adverts/:id
// Eliminar un anuncio
router.delete('/:id', async (req, res, next) => {
  try {

    const id = req.params.id;

    const advert = await Adverts.findById(id);

    if (!advert) {
      // const err = new Error('not found');
      // err.status = 404;
      return next(createError(404));
    }

    await Adverts.deleteOne({ _id: id });

    res.json();

  } catch (err) {
    next(err);
  }
});

module.exports = router;
