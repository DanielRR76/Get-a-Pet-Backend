import { File } from '@domain/File';
import { FileDTO } from '@dtos/FileDTO';

export interface MediaService {
    upload(file: FileDTO | FileDTO[]): Promise<File | File[]>;
    delete(fileUrl: File | File[]): Promise<void>;
}
