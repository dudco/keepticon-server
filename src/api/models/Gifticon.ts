import mongoose from "mongoose";

export interface GifticonModel extends mongoose.Document {
    img: {
        thumbnail: String,
        full: String,
        barcode: String
    },
    title: String,
    desc: String,
    date: Date
}


const GifticonSchema: mongoose.Schema<GifticonModel> = new mongoose.Schema({
    img {
        thumbnail: {type: String},
        full: {type: String},
        barcode: {type: String}
    },
    title: {type: String},
    desc: {type: String},
    date: {type: Date, default: Date.now}
})

export default mongoose.model("Gifticon", GifticonSchema);
