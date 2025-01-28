import express from 'express'
const Router = express.Router()
import UserController from '../controllers/UserController.mjs'
import verifyToken from '../helpers/verify-token.mjs'
import imageUpload from '../helpers/image-upload.mjs'

Router.post('/register', UserController.Register)
Router.post('/login', UserController.Login)
Router.get('/checkuser', UserController.CheckUser)
Router.get('/:id', UserController.getUserById)
Router.patch('/edit/:id',verifyToken, imageUpload.single('image'), UserController.editUser)


export default Router