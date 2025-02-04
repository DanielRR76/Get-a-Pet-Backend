import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes.mjs";
import PetRoutes from "./routes/PetRoutes.mjs";
import { PrismaClient } from "@prisma/client"; // Importando o Prisma Client

const app = express();

// Inicializando o Prisma Client
const prisma = new PrismaClient();

// Config JSON response
app.use(express.json());

// Config URL encoded
app.use(express.urlencoded({ extended: true }));

// Solução para CORS
app.use(cors({ credentials: true, origin: "https://danielrr76.github.io" }));

// Pasta pública para imagens
app.use(express.static("public"));

// Rotas
app.use("/users", UserRoutes);
app.use("/pets", PetRoutes);

// Conectar ao banco de dados com Prisma
prisma
  .$connect()
  .then(() => {
    app.listen(5000, () => console.log("Backend is running on port 5000!"));
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados com Prisma:", error);
  });
