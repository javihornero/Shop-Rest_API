import { Review } from '../review.model';

export interface ReviewRepository {
  create(review: Review): Promise<Review>;
  update(review: Review): Promise<Review | null>;
  findById(reviewId: string): Promise<Review | null>;
  findAll(productId:string): Promise<Array<Review>>;
  delete(reviewId: string): Promise<null>;
}