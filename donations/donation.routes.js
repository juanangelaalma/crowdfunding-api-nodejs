import express from 'express'
const router = express.Router()

import donationController from "./donation.controller.js";

router.post('/', donationController.createDonation)

router.get('/:donationId', (req, res, next) => {
    res.send(`get donation by id: ${req.params.donationId}`)
})

export default router