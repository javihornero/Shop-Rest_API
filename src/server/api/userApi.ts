import { Router } from 'express';
import { Service } from 'typedi';
import { BaseApi } from './baseApi';
import { UserController } from '../../app/user/user.controller';
import { verifyAdmin, verifyUser } from '../../app/auth/auth.controller';
import { User } from '../../app/user/user.model';


@Service()
export class UserApi extends BaseApi{

  
  constructor(protected controller: UserController){super();}

  public initRouterAndSetApiRoutes(): void {
    this.apiRouter = Router();

    this.apiRouter.get( '/' ,
      (req, res, next) => this.controller.getAll(req, res, next)
    );

    this.apiRouter.put( '/' ,
      (req, res, next) => this.controller.update(req, res, next)
    );

    this.apiRouter.delete( '/:id' , verifyAdmin,
      (req, res, next) => this.controller.delete(req, res, next)
    )

  }

}