const express = require('express');
const router = express.Router();
const ClinicModel = require('../models/ClinicModel');
const mqttClient = require('../mqtt');

router.get('/clinics', async (req, res) => {
    try {
        const clinics = await ClinicModel.find();
        mqttClient.sendMessage('clinic location fetched');
        res.status(200).json({ message: "Clinic has been fetched", clinics: clinics });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

router.post('/clinics', async (req, res, next) => {
    const clinic = new ClinicModel(req.body);
    clinic
      .save()
      .then(function (clinic) {
        mqttClient.sendMessage('clinic location created');
        res.status(201).json({ message: "Clinic has been created", clinic: clinic });
      })
      .catch(function (error) {
       if(error.code===11000){
        return res.status(409).send({error: 'Clinic already exist'}); // status 409 states conflicts
       }
        return next(error);
      });
})

router.patch('/clinics/:id', async (req, res, next) => {
    const id = req.params.id;
    ClinicModel.findById(id).then(function (clinic){
      Object.assign(clinic, req.body);
      clinic.save().then(function (clinic){
        mqttClient.sendMessage('clinic location updated');
        return res.status(200).json({ message: "Clinic has been updated", clinic: clinic }); 
      })

    }).catch(err=>{
      return next(err);
    })
})

router.delete('/clinics/:id', async (req, res, next) => {
  const id = req.params.id;
  ClinicModel.findByIdAndDelete(id)
    .then(clinic => {
      if (!clinic) {
        return res.status(404).json({ error: 'Clinic not found' });
      }
      mqttClient.sendMessage('clinic location deleted');
      res.status(200).json({ message: "Clinic has been deleted", deletedClinic: clinic });
    })
    .catch(err => {
      return next(err);
    });
});


module.exports = router;