import { Sequelize } from "sequelize";
import 'dotenv/config';

const connection = new Sequelize(process.env.SCHEMA, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DATABASE
})

try{
    connection.authenticate()
    console.log(`conectado ao ${process.env.DATABASE}!`)
} catch (error) {
    console.error('Não foi possivel conectar ao banco', error)
}



export default connection