const { Router } = require("express");
const router = Router();

const UploadController = require("../controllers/uploadImageController");
const { Upload } = require("../middlewares/Uploads");

router.get("/uploads", UploadController.getAllRecord);
router.get("/uploads/:yr", UploadController.get_all_by_gradyear);
router.post("/upload", Upload.single("file"), UploadController.uploadRecord);
router.patch(
  "/uploads/:id",
  Upload.single("file"),
  UploadController.updateRecord
);
router.delete("/uploads/:id", UploadController.deleteRecord);
router.delete("/uploads/", UploadController.delete_all_record);

// router.delete("/uploads/:id", UploadController.deleteImage);

module.exports = router;

// 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
