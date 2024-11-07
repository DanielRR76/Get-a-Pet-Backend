import jwt from 'jsonwebtoken'

const createUserToken = async(user, req, res) => {
    const token = jwt.sign({
        id: user.id,
        name: user.name

    },"nossosecret")
    res.status(200).json({message:'Você foi autenticado',token: token, userId: user.id})
}

export default createUserToken