import { Router } from 'express';
import { Service } from 'typedi';
import { BaseApi } from './baseApi';
import { CartController } from '../../app/cart/cart.controller';
import { verifyUser } from '../../app/auth/auth.controller';


@Service()
export class CartApi extends BaseApi{

  
  constructor(protected controller: CartController){super();}

  public initRouterAndSetApiRoutes(): void {
    this.apiRouter = Router();

    this.apiRouter.post( '/' , verifyUser,
      (req, res, next) => this.controller.create(req, res, next)
    );

    this.apiRouter.put( '/' , verifyUser,
      (req, res, next) => this.controller.update(req, res, next)
    );

    this.apiRouter.get( '/' , verifyUser,
      (req, res, next) => this.controller.get(req, res, next)
    );

  }

}