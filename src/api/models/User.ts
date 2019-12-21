import mongoose from "mongoose";
import { GifticonModel } from "./Gifticon";

export interface UserModel extends mongoose.Document {
    kakao_id: String;
    nickname: String;
    gifticons: GifticonModel[];
}

const UserSchema: mongoose.Schema<UserModel> = new mongoose.Schema({
     kakao_id: {type: String, required: true, unique: true},
     nickname: {type: String, required: true},
     gifticons: [{type: mongoose.Schema.Types.ObjectId, ref: "Gifticon"}]
})

export default mongoose.model("User", UserSchema);
