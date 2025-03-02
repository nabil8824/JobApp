import multer from "multer";
export const fileTypes={
    image:[ "image/png", "image/jpeg","image/gif","image/jpg" ],
    video:["video/mp4", "video/quicktime"],
    document:["application/pdf", "text/plain", "application/msword"],
    audio:["audio/mp3", "audio/wav", "audio/mpeg"],
    pdf:["application/pdf"]
}
export const multerHost = (customeValidation = []) => {
    const storage = multer.diskStorage({});
    function fileFilter(req, file, cb) {
        if (customeValidation.includes( file.mimetype )) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file format'), false);
        }
    }  
    const upload = multer({ storage,fileFilter });
    return upload;  
};
