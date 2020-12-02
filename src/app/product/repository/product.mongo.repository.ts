import { ProductRepository } from './product.repository';
import { Model, Query } from 'mongoose';
import { ProductSchema } from './product.schema';
import { Product } from '../product.model';
import { Service } from 'typedi';
import { InstanceType } from 'typegoose';

@Service()
export class ProductMongoRepository implements ProductRepository {

  private productModel: Model<InstanceType<ProductSchema>>;

  constructor() {
    this.productModel = new ProductSchema().getModelForClass(
      ProductSchema,
      { schemaOptions: { collection: 'products' } }
    );
  }

  async create(product: Product): Promise<Product> {
    const productObj = new this.productModel(product);

    return await productObj.save();
  }

  async update(product: Product): Promise<Product | null> {
    const updateDoc = {
      $set: product
    };

    const updateResult =
      await this.productModel.updateOne({_id:product.id}, updateDoc).exec();

    if (product.id && updateResult && updateResult.nModified === 1) {
      return await this.findById(product.id);
    }

    return null;
  }

  async findById(productId: string): Promise<Product | null> {
    return await this.productModel.findById(productId);
  } 

  async findAll(filter): Promise<Array<Product>> {
    //console.log("Filter: ",filter);
    if (!filter.minPrice) filter.minPrice = 0;
    if (!filter.maxPrice) filter.maxPrice = 50000;
    let query = {$and: [{price: {$gte: filter.minPrice}} , {price: { $lte: filter.maxPrice } }]  }
    
    if (filter.category) query["category"] = filter.category;
    return await this.productModel.find(query).exec();
  }

  async findByStoreId(storeId:string): Promise<Array<Product>> {
    return await this.productModel.find({storeId:storeId}).exec();
  }

  async delete(productId: string): Promise<null> {
    const {
      ok, n
    } = await this.productModel.deleteOne({_id: productId});

    return null;
  }

}