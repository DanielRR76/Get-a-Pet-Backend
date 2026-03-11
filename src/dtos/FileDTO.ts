import { HttpStatusCode } from '@enums/HttpStatusCode';
import { FileError } from '@errors/FileError';

export class FileDTO {
    readonly path: string;
    readonly folder: string;
    readonly buffer: Buffer;
    constructor(path: string, folder: string, buffer: Buffer) {
        this.path = path;
        this.folder = folder;
        if (!path.match(/\.(jpg|jpeg|png|gif)$/)) {
            throw new FileError('Invalid image format', HttpStatusCode.BAD_REQUEST);
        }
        this.buffer = buffer;
    }
}
