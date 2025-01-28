import express from 'express'
const Router = express.Router()
import PetController from '../controllers/PetController.mjs'
import verifyToken from '../helpers/verify-token.mjs'
import imageUpload from '../helpers/image-upload.mjs'

Router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)
Router.get('/colors', PetController.getColors)
Router.get('/', PetController.getAll)
Router.get('/mypets', verifyToken, PetController.getAllUserPets)
Router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)
Router.get('/:id', PetController.getPetById)
Router.delete('/:id', verifyToken, PetController.deletePet)
Router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePet)
Router.patch('/schedule/:id', verifyToken, PetController.scheduleAdoption)
Router.patch('/complete/:id', verifyToken, PetController.completeAdoption)


export default Router