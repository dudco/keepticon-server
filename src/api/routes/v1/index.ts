import fs from "fs";
import path from "path";
import express from "express";

const router = express.Router();
const indexJs = path.basename(__filename);

router.get("/status", (req, res) => res.send("Ok"));

fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf(".") !== 0 &&
      file !== indexJs &&
      file.slice(-3) === ".ts"
  )
  .forEach(routeFile =>
    router.use(`/${routeFile.split(".")[0]}`, require(`./${routeFile}`).default)
  );

export default router;
