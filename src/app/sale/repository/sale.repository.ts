import { Sale } from '../sale.model';

export interface SaleRepository {
  create(sale: Sale[]): Promise<Sale[]>;
  update(sale: Sale): Promise<Sale | null>;
  findById(saleId: string): Promise<Sale | null>;
  findAll(filter): Promise<Array<Sale>>;
  delete(saleId: string): Promise<null>;
}