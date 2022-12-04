const multer = require('multer');
const uploadStorage = multer.diskStorage({
    destination:(req,file, cb)=>{
        console.log('came in middleware ',file);
            cb(null,'public');

    },
    filename:(req, file, cb)=>{
        
        cb(null, `${new Date.now()}-${file.originalname}`);
        
    }
})

const upload = multer({
    storage: uploadStorage,
})
module.exports = upload;