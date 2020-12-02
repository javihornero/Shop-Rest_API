import { Router } from 'express';
import { Service } from 'typedi';
import { BaseApi } from './baseApi';
import { ProductController } from '../../app/product/product.controller';
import { verifyUser,verifyStore } from '../../app/auth/auth.controller';

@Service()
export class ProductApi extends BaseApi{

  
  constructor(protected controller: ProductController){super();}

  public initRouterAndSetApiRoutes(): void {
    this.apiRouter = Router();

    this.apiRouter.post( '/' ,verifyStore,
      (req, res, next) => this.controller.create(req, res, next)
    );

    this.apiRouter.get( '/' ,
      (req, res, next) => this.controller.getAll(req, res, next)
    );

    this.apiRouter.get( '/:id' , verifyStore,
      (req, res, next) => this.controller.getById(req, res, next)
    );

    this.apiRouter.put( '/:id' ,verifyStore,
      (req, res, next) => this.controller.update(req, res, next)
    );

    this.apiRouter.delete( '/:id' , verifyStore,
      (req, res, next) => this.controller.delete(req, res, next)
    )

  }

 
}