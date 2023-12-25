import { Request } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

/* const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "temp"); // Establecer la ruta del directorio de destino
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`); // Utilizar el nombre original del archivo
  },
}); */
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new Error("file is not of the correct type"), false);
  }
};

export const uploadImagesService = multer({
  storage,
  fileFilter,
  limits: { files: 3 },
});
