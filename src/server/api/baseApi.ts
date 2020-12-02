import { Router } from 'express';
import { AuthController } from '../../app/auth/auth.controller';

export abstract class BaseApi{

    protected apiRouter: Router;
    //protected authController: AuthController;

    constructor(){
        this.initRouterAndSetApiRoutes();
    }

    public getApiRouter(): Router {
        return this.apiRouter;
    }
/*
    public setAuthController(authControl: AuthController): void {
        this.authController = authControl;
    }*/

    protected abstract initRouterAndSetApiRoutes():void;

}