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

    uploadImageUserProfile(file: Express.Multer.File): Promise<CloudinaryUploadResult> {
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
                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id
                });
            }).end(file.buffer);
        });
    }

    async removeImageByPublicId(publicId: string) {
        return new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(publicId, { invalidate: true }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}
