import { JsonWebToken } from '@contracts/JsonWebToken';
import { HttpStatusCode } from '@enums/HttpStatusCode';
import { Request, Response, NextFunction } from 'express';

export class ExpressTokenMiddleware {
    private jwtService: JsonWebToken;
    constructor(jwtService: JsonWebToken) {
        this.jwtService = jwtService;
        this.verifyToken = this.verifyToken.bind(this);
    }

    getToken(req: Request) {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        return token;
    }

    verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = this.getToken(req);
        if (!token) {
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Token is required' });
        }
        try {
            const authUser = this.jwtService.verify(token);
            req.authUser = authUser;
            next();
        } catch (error: any) {
            console.error('Error verifying token:', error.message);
            return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Invalid token' });
        }
    }
}
