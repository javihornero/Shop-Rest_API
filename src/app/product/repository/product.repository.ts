import { Product } from '../product.model';

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product | null>;
  findById(productId: string): Promise<Product | null>;
  findByStoreId(storeId:string): Promise<Array<Product>>;
  findAll(filter): Promise<Array<Product>>;
  delete(productId: string): Promise<null>;
}