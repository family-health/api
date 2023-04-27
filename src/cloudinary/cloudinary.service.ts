import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import * as uuid from 'uuid';
import { CloudinaryUploadResult } from './model';

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });
    }

    async uploadImageUserProfile2(file: Express.Multer.File) {
        const result = await cloudinary.v2.uploader.upload(file.path);
        return result.secure_url;
    }

    async uploadImageUserProfile(file: Express.Multer.File): Promise<CloudinaryUploadResult> {
        const uniqueId = uuid.v4();
        return new Promise<CloudinaryUploadResult>((resolve, reject) => {
            cloudinary.v2.uploader.upload_stream({
                folder: 'userProfile',
                public_id: uniqueId,
                overwrite: true
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                console.log(result);
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id
                });
            }).end(file.buffer);
        });
    }
}
