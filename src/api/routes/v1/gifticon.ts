import express from "express";
import multer from "multer";
import randomstring from "randomstring";
import path from "path"
import mkdirp from "mkdirp"
import User from "../../models/User";
import Gifticon from "../../models/Gifticon";

const tesseract = require("node-tesseract-ocr")
const vision = require('@google-cloud/vision');
const Clipper = require('image-clipper');
Clipper.configure({
    canvas: require('canvas')
});


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

router.post("/", upload.array("images", 30), async (req, res, next) => {
    try {
        console.log(req.files)
        const {files} = req
        const datas = await (files as Express.Multer.File[]).reduce(async (prev, file) => {
            const p = await prev;
                       
            const thumbnail = `public/${file.filename.slice(0, -(path.extname(file.originalname).length + 1))}.thumbnail.jpg`
            const full = `public/${file.filename}`
            const barcode = `public/${file.filename.slice(0, -(path.extname(file.originalname).length + 1))}.barcode.jpg`
            const title = `public/${file.filename.slice(0, -(path.extname(file.originalname).length + 1))}.title.jpg`
            const term = `public/${file.filename.slice(0, -(path.extname(file.originalname).length + 1))}.term.jpg`
            
            new Promise((res, rej) => {
                const data = {
                    img: {
                        thumbnail: "",
                        barcode: "",
                        full
                    },
                    title: "",
                    desc: "",
                    date: ""
                }


                Clipper(full, function() {
                    this.crop(50, 100, 700, 600).toFile(thumbnail, () => {
                        data.img.thumbnail = thumbnail;
                    })
                }) 

                Clipper(full, function() {
                    this.crop(120, 864, 558, 239).toFile(barcode, () => {
                        data.img.barcode = barcode;
                    })
                })


                const client = new vision.ImageAnnotatorClient();
            
                Clipper(full, function() {
                    this.crop(74, 741, 489, 200).toFile(title, async () => {
                        const [result] = await client.textDetection(title);
                        const detections = result.textAnnotations;
                        const datas = detections[0].description.split('\n');

                        data.title = datas[0]
                        data.desc = datas[1]
                        console.log('title: ', detections[0].description.split("\n"));
                    })
                })

                Clipper(full, function() {
                    this.crop(538, 1242, 176, 61).toFile(term, async () => {
                        const [result] = await client.textDetection(term);
                        const detections = result.textAnnotations;

                        data.date = detections[0].description.replace(/\s/g, '');
                        console.log('term: ', detections[0].description)
                    })
                })
            })

            const gifticon = await new Gifticon(data).save();
            
            p.push(gifticon._id)
            return p;
        }, Promise.resolve([]))
        console.log(datas)

        const user = await User.findOneAndUpdate({kakao_id: req.body.kakao_id}, {$push: {gifticons: { $each: datas}}}, {new: true});
        if(user) {
            res.status(200).json({success: true, data: user})
        } else {
            throw new Error("user not found");
        }
    } catch(e) {
        next(e);
    }
})

export default router;
