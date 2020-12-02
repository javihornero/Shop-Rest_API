import { Service, Inject } from "typedi";
import { CartRepository } from "./repository/cart.repository";
import { Cart } from './cart.model';
import { ErrorService } from '../../error/error';
import 'reflect-metadata';

@Service()
export class CartService {

  constructor(
    @Inject('cart.repository') private cartRepository: CartRepository,
    private readonly errorService: ErrorService
  ) {}

  async create(cart: Cart): Promise<Cart> {

    if(this.isValidCart(cart)){
      return await this.cartRepository.create(cart);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('Cart'));
    }
  }

  async update(cart: Cart): Promise<Cart | null> {
    if(this.isValidCart(cart)){
      return await this.cartRepository.update(cart);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('Cart'));
    }
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    if(userId)
      return await this.cartRepository.findByUserId(userId);
    else
      return Promise.reject(this.errorService.createInvalidIdError('Cart'));
  }

  async deleteByUserId(userId: string): Promise<null> {
    if(userId)
      return await this.cartRepository.deleteByUserId(userId);
    else
      return Promise.reject(this.errorService.createInvalidIdError('Cart'));
  }

  private isValidCart(cart:Cart):boolean{
    return cart && cart.userId !== null && cart.userId !== undefined;
  }

}