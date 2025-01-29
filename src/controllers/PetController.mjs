import { PrismaClient } from "@prisma/client";
import getToken from "../helpers/get-token.mjs";
import getUserByToken from "../helpers/get-user-by-token.mjs";
import colorpets from "../helpers/verify-color-pet.mjs";

const prisma = new PrismaClient();

export default class PetController {
  //create new pet
  static async create(req, res) {
    const { name, age, weight } = req.body;
    let color = req.body.color;
    const available = true;
    const images = req.files;

    if (!name) {
      res.status(422).json({ message: "O nome é obrigatorio" });
      return;
    }

    if (!age) {
      res.status(422).json({ message: "A idade é obrigatoria" });
      return;
    }

    if (!weight) {
      res.status(422).json({ message: "O peso é obrigatorio" });
      return;
    }

    if (!color) {
      res.status(422).json({ message: "A cor é obrigatoria" });
      return;
    }

    if (!colorpets.includes(color.toUpperCase())) {
      res
        .status(422)
        .json({ message: `as cores permitidas são: ${colorpets}.` });
      return;
    }

    if (!images || images.length === 0) {
      res.status(422).json({ message: "A imagem é obrigatoria" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);
    const oldPet = await prisma.pet.findFirst({
      where: { name, ownerId: user.id, age: parseInt(age) },
    });

    if (oldPet) {
      res.status(422).json({ message: "O pet já existe" });
      return;
    }

    const pet = {
      name,
      age: parseInt(age),
      weight: parseFloat(weight),
      color: color.toUpperCase(),
      available,
      images: [],
      ownerId: user.id,
    };

    images.forEach((image) => {
      pet.images.push(image.filename);
    });

    try {
      const petCreated = await prisma.pet.create({
        data: { ...pet, images: JSON.stringify(pet.images) }, // convert array to string
      });
      res.status(201).json({ message: "Pet criado com sucesso", petCreated });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const pets = await prisma.pet.findMany();
      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static getColors(req, res) {
    res.status(200).json({ colorpets });
  }

  static async getAllUserPets(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    try {
      const pets = await prisma.pet.findMany({
        where: { ownerId: user.id },
      });
      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllUserAdoptions(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);
    try {
      const pets = await prisma.pet.findMany({
        where: { adopterId: user.id },
      });
      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getPetById(req, res) {
    const id = req.params.id;
    try {
      const pet = await prisma.pet.findUnique({ where: { id: parseInt(id) } });
      if (!pet) {
        res.status(404).json({ message: "O pet não foi encontrado" });
        return;
      }
      res.status(200).json({ pet });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deletePet(req, res) {
    const id = req.params.id;
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pet = await prisma.pet.findUnique({ where: { id: parseInt(id) } });

    if (!pet) {
      res.status(404).json({ message: "O pet não foi encontrado" });
      return;
    }

    if (pet.ownerId !== user.id) {
      res.status(422).json({ message: "O pet não pertence ao usuário" });
      return;
    }

    try {
      await prisma.pet.delete({ where: { id } });
      res.status(200).json({ message: "Pet excluído com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updatePet(req, res) {
    const id = req.params.id;
    const { name, age, weight } = req.body;
    let color = req.body.color;
    let images = req.body.images;
    let updatedData = {};

    const token = getToken(req);
    const user = await getUserByToken(token);
    const pet = await prisma.pet.findUnique({ where: { id: parseInt(id) } });

    if (!pet) {
      res.status(404).json({ message: "O pet não foi encontrado" });
      return;
    }

    if (pet.ownerId !== user.id) {
      res.status(422).json({ message: "O pet não pertence ao usuário" });
      return;
    }

    if (!name) {
      res.status(422).json({ message: "O nome é obrigatorio" });
      return;
    }

    if (!age) {
      res.status(422).json({ message: "A idade é obrigatoria" });
      return;
    }

    if (!weight) {
      res.status(422).json({ message: "O peso é obrigatorio" });
      return;
    }

    if (!color) {
      res.status(422).json({ message: "A cor é obrigatoria" });
      return;
    }

    if (!colorpets.includes(color.toUpperCase())) {
      res
        .status(422)
        .json({ message: `as cores permitidas são: ${colorpets}.` });
      return;
    }

    updatedData = {
      name,
      age: parseInt(age),
      weight: parseFloat(weight),
      color: color.toUpperCase(),
    };

    if (images === "") {
      res.status(422).json({ message: "A imagem é obrigatoria" });
      return;
    } else if (images !== "" && images === undefined) {
      images = req.files;
      updatedData.images = [];

      images.forEach((image) => {
        updatedData.images.push(image.filename);
      });
      if (updatedData.images.length === 0) {
        updatedData.images = pet.images;
      } else {
        updatedData.images = JSON.stringify(updatedData.images);
      }
    }

    try {
      await prisma.pet.update({
        where: { id: parseInt(id) },
        data: updatedData,
      });
      res.status(200).json({ message: "Pet atualizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async scheduleAdoption(req, res) {
    const id = req.params.id;
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pet = await prisma.pet.findUnique({ where: { id: parseInt(id) } });

    if (!pet) {
      res.status(404).json({ message: "O pet não foi encontrado" });
      return;
    }

    if (pet.ownerId === user.id) {
      res.status(422).json({ message: "Esse pet já é seu. Escolha outro pet" });
      return;
    }

    if (pet.adopterId !== null) {
      if (pet.adopterId === user.id) {
        res
          .status(422)
          .json({ message: "Você já agendou uma adoção para esse pet" });
        return;
      }
    }

    try {
      await prisma.pet.update({
        where: { id: parseInt(id) },
        data: { adopterId: user.id },
      });
      res.status(200).json({ message: "Adoção agendada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async completeAdoption(req, res) {
    const id = req.params.id;

    const token = getToken(req);
    const user = await getUserByToken(token);

    const pet = await prisma.pet.findUnique({ where: { id: parseInt(id) } });

    if (!pet) {
      res.status(404).json({ message: "O pet não foi encontrado" });
      return;
    }

    if (pet.ownerId !== user.id) {
      res.status(422).json({
        message: "Você não pode concluir uma adoção para o pet que não é seu",
      });
      return;
    }

    const complete = {
      available: false,
      ownerId: pet.adopterId,
      adopterId: null,
    };

    try {
      await prisma.pet.update({ where: { id: parseInt(id) }, data: complete });
      res.status(200).json({ message: "Adoção concluída com sucesso" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
