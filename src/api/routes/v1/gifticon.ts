import express from "express";
import multer from "multer";
import randomstring from "randomstring";
import path from "path"
import mkdirp from "mkdirp"
const Clipper = require('image-clipper');

const router = express.Router();
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      const dir = `public`;
      mkdirp(dir, err => cb(err, dir));
    },
  filename: function(req, file, cb) {
      cb(null, `${file.fieldname}-${randomstring.generate(5)}${path.extname(file.originalname)}`);
    }
});
var upload = multer({ storage: storage });

router.post("/", upload.array("images", 30), (req, res, next) => {
    try {
        console.log(req.files)
        const {files} = req
        const datas = files.map((pre, file) => {
            // const p = await pre;
            const thumbnail = `public/${file.filename}.thumbnail.jpg`
            const full = `public/${file.filename}`
            Clipper(`public/${file.filename}`, function() {
                this.crop(34, 35, 409, 473).toFile(thumbnail, function() {
                    console.log('saved!');
                })
            }) 
            // return p
            return {thumbnail, full}
        })
        console.log(datas)
    } catch(e) {
        next(e);
    }
})

export default router;
