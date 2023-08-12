const express = require('express')
const ctrl =require('../../controllers/contacts')
 const {validateBody, isValidId} =require('../../middelwares')
 const {schemas} =require ('../../models/contact')
const router = express.Router()

router.get('/', ctrl.getContacts)

router.get('/:id', isValidId, ctrl.getContactById )

router.post('/', validateBody(schemas.addSchema, `missing required name field`), ctrl.addNewContact)

 router.delete('/:id', isValidId, ctrl.deleteContact)

 router.put('/:id', isValidId, validateBody(schemas.addSchema, `missing fields`), ctrl.updateContactById )

 router.patch('/:id/favorite', isValidId, validateBody(schemas.updateFavoriteSchema, `missing fields favorite`), ctrl.updateFavorite )

module.exports = router
