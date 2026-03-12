import { MediaService } from '@contracts/MediaService';
import { v2 as cloudinary } from 'cloudinary';
import { MediaError } from '@errors/MediaError';
import { FileDTO } from '@dtos/FileDTO';
import { File } from '@domain/File';

export class CloudinaryService implements MediaService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async upload(media: FileDTO | FileDTO[]): Promise<File | File[]> {
        try {
            if (Array.isArray(media)) {
                return Promise.all(
                    media.map((file) =>
                        new Promise<string>((resolve, reject) => {
                            cloudinary.uploader
                                .upload_stream({ folder: file.folder }, (error, result) => {
                                    if (error) {
                                        reject(error);
                                    } else if (result) {
                                        resolve(result.secure_url);
                                    } else {
                                        reject(new Error('Upload result is undefined'));
                                    }
                                })
                                .end(file.buffer);
                        }).then((url) => new File(url)),
                    ),
                );
            } else {
                const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream({ folder: media.folder }, (error, result) => {
                            if (error) {
                                return reject(error);
                            } else if (result) {
                                return resolve(result);
                            } else {
                                return reject(new Error('Upload result is undefined'));
                            }
                        })
                        .end(media.buffer);
                });
                return new File(result.secure_url);
            }
        } catch (error: any) {
            console.error('Media upload error:', error.message);
            throw new MediaError('Error uploading media');
        }
    }
    async delete(media: File | File[]): Promise<void> {
        try {
            if (Array.isArray(media)) {
                return Promise.all(
                    media.map((image) => {
                        const publicId = image.getUrl().split('/').slice(-2).join('/').split('.')[0];
                        return cloudinary.uploader.destroy(publicId);
                    }),
                ).then(() => undefined);
            } else {
                const publicId = media.getUrl().split('/').slice(-2).join('/').split('.')[0];
                return cloudinary.uploader.destroy(publicId).then(() => undefined);
            }
        } catch (error: any) {
            console.error('Media deletion error:', error.message);
            throw new MediaError('Error deleting media');
        }
    }
}
