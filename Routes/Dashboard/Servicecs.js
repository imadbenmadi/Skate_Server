const express = require("express");
const router = express.Router();
const ServicesController = require("../../Controllers/Dashboard/ServicesController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const destinationPath = path.join(
                __dirname,
                "../../Public/Services"
            );
            // Create the destination directory if it doesn't exist
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }
            cb(null, destinationPath);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix =
                Date.now() + "-" + Math.round(Math.random() * 1e9);
            const fileExtension = path.extname(file.originalname);
            const generatedFilename = `${uniqueSuffix}${fileExtension}`;
            req.generatedFilename = generatedFilename;
            cb(null, generatedFilename);
        },
    }),
});
router.post(
    "/",
    upload.single("image"),
    (req, res, next) => {
        req.body.generatedFilename = req.generatedFilename;
        next();
    },
    ServicesController.handle_add_Service
);
router.delete("/:id", ServicesController.handle_delete_Service);
router.put(
    "/:id",
    upload.single("image"),
    (req, res, next) => {
        req.body.generatedFilename = req.generatedFilename;
        next();
    },
    ServicesController.handle_update_Service
);
router.get("/Requests", ServicesController.handle_get_Services_Request);
router.post("/Requests/Accept", ServicesController.handle_Accept_Service_request);
router.post(
    "/Requests/Reject",
    ServicesController.handle_Reject_Service_request
);

module.exports = router;
