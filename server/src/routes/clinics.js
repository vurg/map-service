const express = require('express');
const router = express.Router();
const ClinicModel = require('../models/ClinicModel');

router.get('/clinics', async (req, res) => {
    try {
        const clinics = await ClinicModel.find();
        res.status(200).json(clinics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

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