import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const getUserByToken = async (token) => {
  if (!token) {
    return res.status(401).json({ message: "Acesso negado" });
  }

  const decoded = jwt.verify(token, "nossosecret");
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });
  return user;
};

export default getUserByToken;
