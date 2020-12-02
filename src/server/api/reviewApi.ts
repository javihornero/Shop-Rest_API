import { Router } from 'express';
import { Service, Inject } from 'typedi';
import { BaseApi } from './baseApi';
import { ReviewController } from '../../app/review/review.controller';
import { verifyUser ,verifyAdmin} from '../../app/auth/auth.controller';


@Service()
export class ReviewApi extends BaseApi{

  constructor(
    private controller: ReviewController,
    )
    {super();}

  public initRouterAndSetApiRoutes(): void {
    this.apiRouter = Router();

    this.apiRouter.post( '/:productId/reviews' ,verifyUser,
      (req, res, next) => this.controller.create(req, res, next)
    );

    this.apiRouter.get( '/:productId/reviews' , verifyUser,
      (req, res, next) => this.controller.getAll(req, res, next)
    );

    this.apiRouter.delete( '/:productId/reviews/:id' , verifyAdmin,
      (req, res, next) => this.controller.delete(req, res, next)
    );

  }

}