const express = require('express')
const ctrl =require('../../controllers/contacts')
 const {validateBody,authenticate , isValidId} =require('../../middelwares')
 const {schemas} =require ('../../models/contact')
const router = express.Router()

router.get('/', authenticate, ctrl.getContacts)

router.get('/:id', authenticate, isValidId, ctrl.getContactById )

router.post('/', authenticate, validateBody(schemas.addSchema, `missing required name field`), ctrl.addNewContact)

 router.delete('/:id', authenticate, isValidId, ctrl.deleteContact)

 router.put('/:id', authenticate, isValidId, validateBody(schemas.addSchema, `missing fields`), ctrl.updateContactById )

 router.patch('/:id/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema, `missing fields favorite`), ctrl.updateFavorite )

module.exports = router
