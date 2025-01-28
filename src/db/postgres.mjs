import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const connection = new Sequelize(
  process.env.SCHEMA,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: "postgres",
  }
);

try {
  connection.authenticate();
  console.log(`autenticado com sucesso!`);
} catch (error) {
  console.error("Não foi possivel conectar ao banco", error);
}

export default connection;
