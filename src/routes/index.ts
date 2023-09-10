import { Router } from "express";
import { readdirSync } from "fs";
const router = Router();

const PATH_ROUTER = `${__dirname}`;

const cleanFileName = (fileName: string) => {
  const file = fileName.split(".").shift();
  return file;
};

readdirSync(PATH_ROUTER).map((fileName) => {
  const cleanName = cleanFileName(fileName);
  console.log(cleanName);

  if (cleanName != "index") {
    import(`./${cleanName}`).then((moduleRouter) => {
      router.use(`/${cleanName}`, moduleRouter.router);
    });
  }
});

export default router;
