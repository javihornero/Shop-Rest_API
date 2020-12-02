import { Service, Inject } from "typedi";
import { SaleRepository } from "./repository/sale.repository";
import { Sale } from './sale.model';
import { ErrorService } from '../../error/error';
import 'reflect-metadata';

@Service()
export class SaleService {

  constructor(
    @Inject('sale.repository') private saleRepository: SaleRepository,
    private readonly errorService: ErrorService
  ) {}

  async create(sales: Sale[]): Promise<Sale[]> {

    if(sales === undefined){
      return Promise.reject(this.errorService.createInputValidationError('Sale'));
      
    }

    for(let i=0;i<sales.length;i++) {
      let elem = sales[i];
      if( !this.isValidSale(elem) ){
        return Promise.reject(this.errorService.createInputValidationError('Sale'));
      }
    }
    return await this.saleRepository.create(sales);

  }

  async update(sale: Sale): Promise<Sale | null> {
    if( this.isValidSale(sale) ){
      return await this.saleRepository.update(sale);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('Sale'));
    }
  }

  async findAll(filter): Promise<Array<Sale>> {
    return await this.saleRepository.findAll(filter);
  }

  async delete(saleId: string): Promise<null> {
    if( saleId !== undefined ){
      return await this.saleRepository.delete(saleId);
    }
    else{
      return Promise.reject(this.errorService.createInvalidIdError('Sale'));
    }
  }

  private isValidSale(sale:Sale):boolean{
    return sale && sale.userId !== null && sale.userId !== undefined &&
            sale.productId !== null && sale.productId !== undefined;
  }

}