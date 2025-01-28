import jwt from 'jsonwebtoken'
import User from '../models/User.mjs'
const getUserByToken = async(token) => {
    if(!token){
        return res.status(401).json({message: 'Acesso negado'})
    }
    
    const decoded = jwt.verify(token, "nossosecret")
    const user = await User.findOne({where: {id: decoded.id}})
    return user
}

export default getUserByToken