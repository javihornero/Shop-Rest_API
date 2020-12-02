import { Service, Inject } from "typedi";
import { ProductRepository } from "./repository/product.repository";
import { Product } from './product.model';
import 'reflect-metadata';
import { ErrorService } from '../../error/error';

@Service()
export class ProductService {

  constructor(
    @Inject('product.repository') private productRepository: ProductRepository,
    private readonly errorService: ErrorService
  ) {}

  async create(product: Product): Promise<Product> {
    if(this.isValidProduct(product)){
      return await this.productRepository.create(product);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('Product'));
    }
  }

  async update(product: Product): Promise<Product | null> {
    if(this.isValidProduct(product)){
      return await this.productRepository.update(product);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('Product'));
    }
  }

  async findById(productId: string): Promise<Product | null> {
    if( productId !== undefined ){
      return await this.productRepository.findById(productId);
    }
    else{
      return Promise.reject(this.errorService.createInvalidIdError('Product'));
    }
    
  }

  async findByStoreId(storeId: string): Promise<Array<Product>> {
    if( storeId !== undefined ){
      return await this.productRepository.findByStoreId(storeId);
    }
    else{
      return Promise.reject(this.errorService.createInvalidIdError('Store'));
    }
    
  }

  async findAll(filter= {}): Promise<Array<Product>> {
    return await this.productRepository.findAll(filter);
  }

  async delete(productId: string): Promise<null> {
    if( productId !== undefined ){
      return await this.productRepository.delete(productId);
    }
    else{
      return Promise.reject(this.errorService.createInvalidIdError('Product'));
    }
  }

  private isValidProduct(product:Product):boolean{
    return product && product.storeId !== null && product.storeId !== undefined;
  }
}