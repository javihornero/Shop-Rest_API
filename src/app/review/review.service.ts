import { Service, Inject } from "typedi";
import { ReviewRepository } from "./repository/review.repository";
import { Review } from './review.model';
import { ErrorService } from '../../error/error';
import 'reflect-metadata';

@Service()
export class ReviewService {

  constructor(
    @Inject('review.repository') private reviewRepository: ReviewRepository,
    private readonly errorService: ErrorService
  ) {}

  async create(review: Review): Promise<Review> {
    if(this.isValidReview(review)){
      return await this.reviewRepository.create(review);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('Review'));
    }
  }

  async findAll(productId:string): Promise<Array<Review>> {
    if( productId !== undefined ){
      return await this.reviewRepository.findAll(productId);
    }
    else{
      return Promise.reject(this.errorService.createInvalidIdError('Product'));
    }
  }

  async delete(reviewId: string): Promise<null> {
    if( reviewId !== undefined ){
      return await this.reviewRepository.delete(reviewId);
    }
    else{
      return Promise.reject(this.errorService.createInvalidIdError('Review'));
    }
  }

  private isValidReview(review:Review):boolean{
    return review && review.userId !== null && review.userId !== undefined &&
            review.productId !== null && review.productId !== undefined;
  }

}