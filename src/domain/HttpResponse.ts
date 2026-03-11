export class HttpResponse {
    readonly statusCode: number;
    readonly message: string;
    readonly payload?: any;
    constructor(statusCode: number, message: string, payload?: any) {
        this.statusCode = statusCode;
        this.message = message;
        this.payload = payload;
    }
}
