import { prop, Typegoose } from 'typegoose';
import { Product } from '../product.model';

export class ProductSchema extends Typegoose implements Product {
  
  @prop({ required: true })
  name: string;
  @prop({default: "Description of product"})
  description: string;
  @prop({ required: true })
  category: string;
  @prop({ required: true , default:0})
  price: number;
  @prop({ required: true , default:0})
  stock: number;
  @prop({ required: true })
  storeId: string;
  

}
