const express = require('express')
const ctrl =require('../../controllers/contacts')
const {validateBody} =require('../../middelwares')
const schemas =require ('../../schemas/contacts')
const router = express.Router()

router.get('/', ctrl.getContacts)

router.get('/:id', ctrl.getContactById )

router.post('/', validateBody(schemas.addSchema, `missing required name field`), ctrl.addNewContact)

router.delete('/:id', ctrl.deleteContact)

router.put('/:id', validateBody(schemas.addSchema, `missing fields`), ctrl.updateContactById )

module.exports = router
