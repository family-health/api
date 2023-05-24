export const fileFilters = (req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!file) {
        return callback(new Error('File is empty'), false);
    }
    // Validar tipo de archivo
    const fileType = file.originalname.split('.')[1];
    
    const validExtensions = ['png', 'jpg', 'jpeg'];
    if (!validExtensions.includes(fileType)) {
        return callback(new Error('Invalid file type. Only PNG, JPG and JPEG are allowed.'), false);
    }
    

    // Validar tamaño de archivo
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
        return callback(new Error('File is too large. Maximum size is 5 MB.'), false);
    }

    callback(null, true);
};