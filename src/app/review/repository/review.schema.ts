import { prop, Typegoose } from 'typegoose';
import { Review } from '../review.model';

export class ReviewSchema extends Typegoose implements Review {
 
  @prop({ required: true })
  userId: string;
  @prop({ required: true })
  productId: string;
  @prop({ required: true , default:"Example review"})
  content: string;

}
