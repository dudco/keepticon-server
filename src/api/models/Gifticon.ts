import mongoose from "mongoose";

export interface GifticonModel extends mongoose.Document {
    img: {
        thumbnail: String,
        full: String,
        barcode: String
    },
    title: String,
    desc: String,
    date: String
}


const GifticonSchema: mongoose.Schema<GifticonModel> = new mongoose.Schema({
    img: {
        thumbnail: {type: String},
        full: {type: String},
        barcode: {type: String}
    },
    title: {type: String},
    desc: {type: String},
    date: {type: String, default: Date.now}
})

export default mongoose.model("Gifticon", GifticonSchema);
