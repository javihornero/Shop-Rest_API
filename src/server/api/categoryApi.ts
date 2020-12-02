import { Router } from 'express';
import { Service, Inject } from 'typedi';
import { BaseApi } from './baseApi';
import { CategoryController } from '../../app/category/category.controller';
import { verifyAdmin ,AuthController} from '../../app/auth/auth.controller';


@Service()
export class CategoryApi extends BaseApi{

  constructor(
    private controller: CategoryController,
    private authController: AuthController,
    )
    {super();}

  public initRouterAndSetApiRoutes(): void {
    this.apiRouter = Router();

    this.apiRouter.post( '/' ,verifyAdmin,
      (req, res, next) => this.controller.create(req, res, next)
    );

    this.apiRouter.put( '/:id' ,verifyAdmin,
      (req, res, next) => this.controller.update(req, res, next)
    );

    this.apiRouter.get( '/' , verifyAdmin,
      (req, res, next) => this.controller.getAll(req, res, next)
    );

    this.apiRouter.get( '/:id' ,verifyAdmin,
      (req, res, next) => this.controller.getById(req, res, next)
    );

    this.apiRouter.delete( '/:id' , verifyAdmin,
      (req, res, next) => this.controller.delete(req, res, next)
    )

  }

 
}