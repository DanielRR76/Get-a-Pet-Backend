import multer, { Multer } from 'multer';

export class MulterMiddleware {
    private multer: Multer;
    constructor() {
        this.multer = multer({ storage: multer.memoryStorage() });
        this.upload = this.upload.bind(this);
    }
    upload(param: string, qtd?: number) {
        if (qtd && qtd > 1) {
            return this.multer.array(param, qtd);
        }
        return this.multer.single(param);
    }
}
