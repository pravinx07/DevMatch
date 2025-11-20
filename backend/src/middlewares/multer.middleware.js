import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
    console.log("In Multer middleware");
  },
  
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    console.log("In multer getting next");
    
  },
});

export const upload = multer({
  storage,
});
