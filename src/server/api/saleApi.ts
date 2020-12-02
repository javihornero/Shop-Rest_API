import { Router } from 'express';
import { Service, Inject } from 'typedi';
import { BaseApi } from './baseApi';
import { SaleController } from '../../app/sale/sale.controller';
import { verifyUser, verifyAdmin, verifyStore, verifyStoreAdmin } from '../../app/auth/auth.controller';


@Service()
export class SaleApi extends BaseApi{

  constructor(
    private controller: SaleController,
    )
    {super();}

  public initRouterAndSetApiRoutes(): void {
    this.apiRouter = Router();

    this.apiRouter.post( '/' ,verifyUser,
      (req, res, next) => this.controller.create(req, res, next)
    );

    this.apiRouter.get( '/' , verifyStoreAdmin,
      (req, res, next) => this.controller.getAll(req, res, next)
    );

    this.apiRouter.delete( '/:id' , 
      (req, res, next) => this.controller.delete(req, res, next)
    );

  }
 
}