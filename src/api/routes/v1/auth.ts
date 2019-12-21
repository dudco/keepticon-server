import express from "express";
import User from "../../models/User";

const router = express.Router();

router.post("/login", async (req, res, next)=> {
    try {
        const user = await User.findOne({kakao_id: req.body.kakao_id});
        if(user) {
            res.status(200).json({success: true, data: user})
        } else {
            res.status(403).json({success: false, data: "user not found"})
        }
    } catch(e) {
        next(e);
    }
})

router.post("/reg", async (req, res, next) => {
    try {
        const user = await new User({
            kakao_id: req.body.kakao_id,
            nickname: req.body.nickname
        }).save();

        if(user) {
            res.status(200).json({success: true, data: user});
        }
    } catch(e) {
        next(e);
    }
})

export default router;
