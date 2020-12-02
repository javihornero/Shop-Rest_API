import { prop, Typegoose } from 'typegoose';
import { Sale } from '../sale.model';

export class SaleSchema extends Typegoose implements Sale {
  
  @prop({ required: true })
  date: string;
  @prop({ required: true })
  productId: string;
  @prop({ required: true })
  userId: string;
  @prop({ required: true })
  storeId: string;
}
