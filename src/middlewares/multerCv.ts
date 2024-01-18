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
  console.log(file.mimetype.split("/"));

  if (
    file.mimetype.split("/")[0] === "application" ||
    file.mimetype.split("/")[1] === "pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("file is not of the correct type"), false);
  }
};

export const uploadCv = multer({ storage, fileFilter });
