import { v2 as cloudinary } from "cloudinary";

export const deleteImage = async (imageUrl) => {
  if (!imageUrl) return;

  try {
    // Extrai o `public_id` removendo a parte inicial da URL e a extensão
    for (let i = 0; i < imageUrl.length; i++) {
      const parts = imageUrl[i].split("/");
      const filenameWithExt = parts.pop(); // Última parte da URL (ex: "1691423435123-foto.jpg")
      const folder = parts.slice(-1)[0]; // Pasta (ex: "pets")

      const publicId = `${folder}/${filenameWithExt.split(".")[0]}`; // pets/1691423435123-foto

      // Deleta a imagem do Cloudinary pelo `public_id`
      await cloudinary.uploader.destroy(publicId);
    }
    console.log(`Imagem deletada do Cloudinary.`);
  } catch (error) {
    console.error("Erro ao excluir imagem do Cloudinary:", error);
  }
};
