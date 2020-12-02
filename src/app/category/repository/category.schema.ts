import { prop, Typegoose } from 'typegoose';
import { Category } from '../category.model';

export class CategorySchema extends Typegoose implements Category {
  
  @prop({ required: true , unique:true})
  name: string;

}
