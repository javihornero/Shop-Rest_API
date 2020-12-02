import { SaleRepository } from './sale.repository';
import { Model } from 'mongoose';
import { SaleSchema } from './sale.schema';
import { Sale } from '../sale.model';
import { Service } from 'typedi';
import { InstanceType } from 'typegoose';

@Service()
export class SaleMongoRepository implements SaleRepository {

  private saleModel: Model<InstanceType<SaleSchema>>;

  constructor() {
    this.saleModel = new SaleSchema().getModelForClass(
      SaleSchema,
      { schemaOptions: { collection: 'sales' } }
    );
  }

  async create(sales: Sale[]): Promise<Sale[]> {
    return await this.saleModel.insertMany(sales);
  }

  async update(sale: Sale): Promise<Sale | null> {
    const updateDoc = {
      $set: sale
    };

    const updateResult =
      await this.saleModel.updateOne({_id:sale.id}, updateDoc).exec();

    if (sale.id && updateResult && updateResult.nModified === 1) {
      return await this.findById(sale.id);
    }

    return null;
  }

  async findById(saleId: string): Promise<Sale | null> {
    return await this.saleModel.findById(saleId);
  } 

  async findAll(filter): Promise<Array<Sale>> {
    return await this.saleModel.find(filter).exec();
  }

  async delete(saleId: string): Promise<null> {
    const {
      ok, n
    } = await this.saleModel.deleteOne({_id: saleId});

    return null;
  }

}