const express = require("express");
const { cloudinary } = require("../config/cloudinary/cloudinary");
const {
  isLoggedIn,
  isLoggedInAdmin,
} = require("../config/middleware/userAuth");
const router = new express.Router();

router.post("/", isLoggedInAdmin, async (req, res) => {
  const { file64 } = req.body;
  if (file64) {
    try {
      const uploadRes = await cloudinary.uploader.upload(file64, {
        upload_preset: "moonblog_image",
      });
      return res.status(200).send({
        msg: "success upload image to cloudinary",
        url: uploadRes.url,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        msg: "Upload Image to Cloudinary Failed",
      });
    }
  } else {
    return res.status(404).send({ msg: "no images sent to server" });
  }
});

module.exports = router;
