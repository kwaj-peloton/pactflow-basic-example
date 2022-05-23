// TODO: Replace these endpoints with your actual provider endpoints

const router = require('express').Router()
const controller = require('./dog.controller')

router.get("/dogs/:id", controller.getById)
router.get("/dogs", controller.getAll)

module.exports = router
