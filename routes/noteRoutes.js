const express = require('express')
const router = express.Router()
const noteController = require('../controllers/noteController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNewNote)
    .patch(noteController.updateExistingNote)
    .delete(noteController.deleteExistingNote)

module.exports = router