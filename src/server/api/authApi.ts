import { Router } from 'express';
import { Service } from 'typedi';
import { BaseApi } from './baseApi';
import { AuthController } from '../../app/auth/auth.controller';
import { UserController } from '../../app/user/user.controller';


@Service()
export class AuthApi extends BaseApi{
    
    constructor(
        private userController: UserController,
        private authController: AuthController)
        {super();}

    protected initRouterAndSetApiRoutes(): void {
        this.apiRouter = Router();

        this.apiRouter.post('/', (req,res,next) => this.authController.auth(req,res));

        this.apiRouter.post( '/users' ,
            (req, res, next) => this.userController.create(req, res, next)
        );

    }

}