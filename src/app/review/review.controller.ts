import { Service, Inject } from 'typedi';
import { ReviewService } from './review.service';
import { Review } from './review.model';
import * as HttpCode from 'http-status-codes';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';

@Service() 
export class ReviewController{

  constructor(
    private reviewService: ReviewService,
    private productService: ProductService,
  ) {
   
  }

  /**
   * @api POST /reviews 
   * 
   * This method creates a new review
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  async create(req, res, next) {
    const {content } = req.body;
    const productId = req.params.productId;

    //console.log("Creating review",req.params);
    if(!content || !productId ) return res.status(HttpCode.BAD_REQUEST).send("Bad request");

    try{

      const review : Review = {
        "content": content,
        "userId": req.user.id,
        "productId": productId
      }

      console.log("New review",review);

      const newreview: Review = await this.reviewService.create(review);
      res.status(HttpCode.CREATED).send(newreview);

    }catch(err){
      res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        message: "Something failed",
        error: err.message
      });
    }
    
  }


  /**
   * @api GET /reviews
   * 
   * @param req
   * @param res 
   * @param next 
   */
  async getAll(req, res, next) {
    const productId = req.params.productId;

    if(!productId) return res.status(HttpCode.BAD_REQUEST).send("Need 'id' of the product");

    this.reviewService.findAll(productId)
    .then((reviewList:Review[])=> {
      return res.send(reviewList);
    })
    .catch((er:Error) => {
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send("Something failed");
    });
      
  }


  /**
   * 
   * @api DELETE /reviews/:id
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  async delete(req, res, next) {
    const reviewId = req.params.id;

    if (reviewId) {
      
      this.reviewService.delete(reviewId)
        .then(()=> {
          res.sendStatus(200);
        });
    }
  }

}