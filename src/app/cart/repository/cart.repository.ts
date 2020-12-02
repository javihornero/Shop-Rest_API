import { Cart } from '../cart.model';

export interface CartRepository {
  create(cart: Cart): Promise<Cart>;
  update(cart: Cart): Promise<Cart | null>;
  findById(cartId: string): Promise<Cart | null>;
  findByUserId(userId: string): Promise<Cart | null>;
  findAll(): Promise<Array<Cart>>;
  delete(cartId: string): Promise<null>;
  deleteByUserId(userId: string): Promise<null>;

}