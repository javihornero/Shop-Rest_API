import { ReviewRepository } from './review.repository';
import { Model } from 'mongoose';
import { ReviewSchema } from './review.schema';
import { Review } from '../review.model';
import { Service } from 'typedi';
import { InstanceType } from 'typegoose';

@Service()
export class ReviewMongoRepository implements ReviewRepository {

  private reviewModel: Model<InstanceType<ReviewSchema>>;

  constructor() {
    this.reviewModel = new ReviewSchema().getModelForClass(
      ReviewSchema,
      { schemaOptions: { collection: 'reviews' } }
    );
  }

  async create(review: Review): Promise<Review> {
    const reviewObj = new this.reviewModel(review);

    return await reviewObj.save();
  }

  async update(review: Review): Promise<Review | null> {
    const updateDoc = {
      $set: review
    };

    const updateResult =
      await this.reviewModel.updateOne({_id:review.id}, updateDoc).exec();

    if (review.id && updateResult && updateResult.nModified === 1) {
      return await this.findById(review.id);
    }

    return null;
  }

  async findById(reviewId: string): Promise<Review | null> {
    return await this.reviewModel.findById(reviewId);
  } 

  async findAll(productId:string): Promise<Array<Review>> {
    return await this.reviewModel.find({productId:productId}).exec();
  }

  async delete(reviewId: string): Promise<null> {
    const {
      ok, n
    } = await this.reviewModel.deleteOne({_id: reviewId});

    return null;
  }

}