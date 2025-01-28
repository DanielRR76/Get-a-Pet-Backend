import User from '../models/User.mjs'
import bcrypt from 'bcrypt'
import createUserToken from '../helpers/create-user-token.mjs'
import getToken from '../helpers/get-token.mjs'
import getUserByToken from '../helpers/get-user-by-token.mjs'
import jwt from 'jsonwebtoken'
export default class UserController {
    //register user
    static async Register(req, res) {
        const{name, email, phone,password, confirmPassword} = req.body

        //validations
        if(!name){
            res.status(422).json({message: 'O nome é obrigatorio'})
            return
        }
        if(!email){
            res.status(422).json({message: 'O email é obrigatorio'})
            return
        }
        if(!phone){
            res.status(422).json({message: 'O numero de celular é obrigatorio'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é obrigatoria'})
            return
        }
        if(!confirmPassword){
            res.status(422).json({message: 'A confirmação da senha é obrigatoria'})
            return
        }
        if(password !== confirmPassword){
            res.status(422).json({message: 'A senha e a confirmação precisam ser iguais'})
            return
        }

        const userExists = await User.findOne({where: {email: email}})
        if(userExists){
            res.status(422).json({message: 'O usuario ja existe. Por favor, utilize outro email'})
            return
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = {
            name: name,
            email: email,
            phone: phone,
            password: passwordHash
        }
        
        try{

            const newUser = await User.create(user)

            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({message: error})
        }


    }

    static async Login(req, res) {
        const {email, password} = req.body
        
        if(!email){
            res.status(422).json({message: 'O email é obrigatorio'})
            return
        }
        if(!password){
            res.status(422).json({message: 'A senha é obrigatoria'})
            return
        }

        const user = await User.findOne({where: {email: email}})
        if(!user){
            res.status(422).json({message: 'O usuario não foi encontrado'})
            return
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if(!checkPassword){
            res.status(422).json({message: 'Senha invalida'})
            return
        }
        await createUserToken(user, req, res)
    }

    static async CheckUser(req, res) {
        let currentUser
        console.log(req.headers)
        if(req.headers.authorization){
            const token = getToken(req)
            const decoded = jwt.verify(token, "nossosecret")
            currentUser = await User.findOne({raw: true, where: {id: decoded.id}})
            currentUser.password = undefined
        } else{
            currentUser = null
        }
        res.status(200).send(currentUser)
        
    }

    static async getUserById(req, res) {
        const id = req.params.id
        const user = await User.findOne({raw: true, where: {id: id}, attributes: {exclude: ['password']}})//exclude: ['password']
        if(!user){
            res.status(404).json({message: 'O usuario não foi encontrado'})
            return
        }
        res.status(200).send(user)
    }

    static async editUser(req, res) {
        const id = req.params.id
        const token= getToken(req)
        const user = await getUserByToken(token)

        const {name, email, phone, password, confirmPassword} = req.body
        let image = ''

        if(req.file){
            image = req.file.filename
        }

        if(!name){
            res.status(422).json({message: 'O nome é obrigatorio'})
            return
        }

        if(!email){
            res.status(422).json({message: 'O email é obrigatorio'})
            return
        }

        const userExists = await User.findOne({where: {email: email}})
        if(user.email !== email && userExists){
            res.status(422).json({message: 'O email ja existe. Por favor, utilize outro email'})
            return
        }

        if(!phone){
            res.status(422).json({message: 'O numero de celular é obrigatorio'})
            return
        }

        if(password!==confirmPassword){
            res.status(422).json({message: 'A senha e a confirmação precisam ser iguais'})
            return
        }

        const updatedData = {
            name: name,
            email: email,
            phone: phone
        }
        if(image){
            updatedData.image = image
        }
        if((password || confirmPassword) && password === confirmPassword){

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)
            updatedData.password = passwordHash
        }
        try{
            await User.update(updatedData, {where: {id: id}})
            res.status(200).json({message: 'O usuario foi atualizado com sucesso'})
        } catch (error) {
            res.status(500).json({message: error})
            return
        }
    }
}