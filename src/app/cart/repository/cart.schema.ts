import { prop, Typegoose } from 'typegoose';
import { Cart } from '../cart.model';

export class CartSchema extends Typegoose implements Cart {
  
  @prop({ required: true , unique: true})
  userId: string;

  @prop({ required: true ,default: []})
  productIds: string[];

}
