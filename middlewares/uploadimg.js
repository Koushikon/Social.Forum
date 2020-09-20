const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, call) => {
        call(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
        cb(null, true);
    } else {
        cb(new Error("Profile image extention was not supperted"), false);
    }
};

module.exports.upload = multer ({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024
    },
    fileFilter: fileFilter
});