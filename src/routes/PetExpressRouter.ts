import PetController from '@controllers/PetController';
import { HttpMethod } from '@enums/HttpMethod';
import { Router } from '@contracts/Router';
import { ExpressTokenMiddleware } from '../middlewares/ExpressTokenMiddleware';
import { MulterMiddleware } from '../middlewares/MulterMiddleware';

export class PetExpressRouter extends Router {
    private petController: PetController;
    private jwtMiddleware: ExpressTokenMiddleware;
    private mediaMiddleware: MulterMiddleware;
    constructor(petController: PetController, mediaMiddleware: MulterMiddleware, jwtMiddleware: ExpressTokenMiddleware) {
        super();
        this.petController = petController;
        this.jwtMiddleware = jwtMiddleware;
        this.mediaMiddleware = mediaMiddleware;
        this.addRoute({
            method: HttpMethod.POST,
            path: '/create',
            middleware: [this.jwtMiddleware.verifyToken, this.mediaMiddleware.upload('images', 5)],
            handler: this.petController.create,
        });
        this.addRoute({
            method: HttpMethod.GET,
            path: '/colors',
            middleware: [],
            handler: this.petController.getColors,
        });
        this.addRoute({ method: HttpMethod.GET, path: '/', middleware: [], handler: this.petController.getAll });
        this.addRoute({
            method: HttpMethod.GET,
            path: '/mypets',
            middleware: [this.jwtMiddleware.verifyToken],
            handler: this.petController.getAllUserPets,
        });
        this.addRoute({
            method: HttpMethod.GET,
            path: '/myadoptions',
            middleware: [this.jwtMiddleware.verifyToken],
            handler: this.petController.getAllUserAdoptions,
        });
        this.addRoute({ method: HttpMethod.GET, path: '/:id', middleware: [], handler: this.petController.getPetById });
        this.addRoute({
            method: HttpMethod.DELETE,
            path: '/:id',
            middleware: [this.jwtMiddleware.verifyToken],
            handler: this.petController.deletePetById,
        });
        this.addRoute({
            method: HttpMethod.PATCH,
            path: '/:id',
            middleware: [this.jwtMiddleware.verifyToken, this.mediaMiddleware.upload('images', 5)],
            handler: this.petController.updatePet,
        });
        this.addRoute({
            method: HttpMethod.PATCH,
            path: '/schedule/:id',
            middleware: [this.jwtMiddleware.verifyToken],
            handler: this.petController.scheduleAdoption,
        });
        this.addRoute({
            method: HttpMethod.PATCH,
            path: '/complete/:id',
            middleware: [this.jwtMiddleware.verifyToken],
            handler: this.petController.completeAdoption,
        });
    }
}
