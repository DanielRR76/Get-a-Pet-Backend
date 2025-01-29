import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    // Conectando ao banco de dados
    await prisma.$connect();
    console.log("Autenticado com sucesso!");
  } catch (error) {
    console.error("Não foi possível conectar ao banco", error);
  }
}

main();
