import { prop, Typegoose } from 'typegoose';
import { User } from '../user.model';

export class UserSchema extends Typegoose implements User {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true , unique:true })
  email: string;

  @prop({ required: true })
  rol: string;

}