import { CategoryRepository } from './category.repository';
import { Model } from 'mongoose';
import { CategorySchema } from './category.schema';
import { Category } from '../category.model';
import { Service } from 'typedi';
import { InstanceType } from 'typegoose';

@Service()
export class CategoryMongoRepository implements CategoryRepository {

  private categoryModel: Model<InstanceType<CategorySchema>>;

  constructor() {
    this.categoryModel = new CategorySchema().getModelForClass(
      CategorySchema,
      { schemaOptions: { collection: 'categories' } }
    );
  }

  async create(category: Category): Promise<Category> {
    const categoryObj = new this.categoryModel(category);

    return await categoryObj.save();
  }

  async update(category: Category): Promise<Category | null> {
    const updateDoc = {
      $set: category
    };

    const updateResult =
      await this.categoryModel.updateOne({_id:category.id}, updateDoc).exec();

    if (category.id && updateResult && updateResult.nModified === 1) {
      return await this.findById(category.id);
    }

    return null;
  }

  async findById(categoryId: string): Promise<Category | null> {
    return await this.categoryModel.findById(categoryId);
  } 

  async findByName(categName: string): Promise<Category | null> {
    return await this.categoryModel.findOne({name:categName});
  }

  async findAll(): Promise<Array<Category>> {
    return await this.categoryModel.find().exec();
  }

  async delete(categoryId: string): Promise<null> {
    const {
      ok, n
    } = await this.categoryModel.deleteOne({_id: categoryId});

    return null;
  }

}