import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config(); // Carrega variáveis do .env

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuração do storage para Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req) => (req.baseUrl.includes("users") ? "users" : "pets"),
    format: async (req, file) => "png", // Força PNG
    public_id: (req, file) => {
      const filename = path.parse(file.originalname).name; // Remove a extensão
      return `${Date.now()}-${filename}`;
    },
  },
});

// Middleware Multer para upload
const imageUpload = multer({
  storage,
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return callback(new Error("Por favor, envie apenas arquivos PNG ou JPG"));
    }
    callback(undefined, true);
  },
});

export default imageUpload;
