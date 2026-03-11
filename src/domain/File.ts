import { FileError } from '@errors/FileError';

export class File {
    url: string;
    constructor(url: string) {
        this.url = url;
        if (!url.match(/\.(jpg|jpeg|png|gif)$/)) {
            throw new FileError('Invalid image format');
        }
    }
    getUrl(): string {
        return this.url;
    }
}
