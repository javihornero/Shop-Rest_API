import { CartRepository } from './cart.repository';
import { Model } from 'mongoose';
import { CartSchema } from './cart.schema';
import { Cart } from '../cart.model';
import { Service } from 'typedi';
import { InstanceType } from 'typegoose';

@Service()
export class CartMongoRepository implements CartRepository {
  


  private cartModel: Model<InstanceType<CartSchema>>;

  constructor() {
    this.cartModel = new CartSchema().getModelForClass(
      CartSchema,
      { schemaOptions: { collection: 'carts' } }
    );
  }

  async create(cart: Cart): Promise<Cart> {
    const cartObj = new this.cartModel(cart);

    return await cartObj.save();
  }

  async update(cart: Cart): Promise<Cart | null> {
    const updateDoc = {
      $set: cart
    };

    const updateResult =
      await this.cartModel.updateOne({_id:cart.id}, updateDoc).exec();

    if (cart.id && updateResult && updateResult.nModified === 1) {
      return await this.findById(cart.id);
    }

    return null;
  }

  async findById(cartId: string): Promise<Cart | null> {
    return await this.cartModel.findById(cartId);
  } 

  async findByUserId(userId: string): Promise<Cart | null> {
    return await this.cartModel.findOne({userId:userId});
  }

  async findAll(): Promise<Array<Cart>> {
    return await this.cartModel.find().exec();
  }

  async delete(cartId: string): Promise<null> {
    const {
      ok, n
    } = await this.cartModel.deleteOne({_id: cartId});

    return null;
  }

  async deleteByUserId(userId: string): Promise<null> {
    const {
      ok, n
    } = await this.cartModel.deleteOne({userId: userId});

    return null;
  }


}