import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const connection = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Pode ser necessário dependendo do provedor
    },
  },
});

try {
  connection.authenticate();
  console.log(`autenticado com sucesso!`);
} catch (error) {
  console.error("Não foi possivel conectar ao banco", error);
}

export default connection;
