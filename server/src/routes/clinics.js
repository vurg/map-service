const express = require('express');
const router = express.Router();
const ClinicModel = require('../models/ClinicModel');


router.post('/clinics', async (req, res, next) => {
    const clinics = new ClinicModel(req.body);
    clinics
      .save()
      .then(function (clinics) {
        res.status(201).json(clinics);
      })
      .catch(function (error) {
       if(error.code===11000){
        return res.status(409).send({error: 'Clinic already exist'}); // status 409 states conflicts
       }
        return next(error);
      });
})

module.exports = router;