import { Service, Inject } from "typedi";
import { CategoryRepository } from "./repository/category.repository";
import { Category } from './category.model';
import { ErrorService } from '../../error/error';
import 'reflect-metadata';

@Service()
export class CategoryService {

  constructor(
    @Inject('category.repository') private categoryRepository: CategoryRepository,
    private errorService: ErrorService,
  ) {}

  async create(category: Category): Promise<Category> {
    if(this.errorService === undefined){
      console.log("WHAT THE FUCK");
    }
    if( this.isValidCategory(category) ){
      return await this.categoryRepository.create(category);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('Category'));
    }
  }

  async update(category: Category): Promise<Category | null> {
    if( this.isValidCategory(category) ){
      return await this.categoryRepository.update(category);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('Category'));
    }
  }

  async findById(categoryId: string): Promise<Category | null> {
    if(categoryId)
      return await this.categoryRepository.findById(categoryId);
    else
      return Promise.reject(this.errorService.createInvalidIdError('Category'));
  }

  async findByName(categName: string): Promise<Category | null> {
    if(categName)
      return await this.categoryRepository.findByName(categName);
    else
      return Promise.reject(this.errorService.createInputValidationError('Category'));
  }

  async findAll(): Promise<Array<Category>> {
    return await this.categoryRepository.findAll();
  }

  async delete(categoryId: string): Promise<null> {
    if(categoryId)
      return await this.categoryRepository.delete(categoryId);
    else
      return Promise.reject(this.errorService.createInvalidIdError('Category'));
  }

  private isValidCategory(cat:Category): boolean{
    return cat && cat.name !== undefined && cat.name !== null;
  }

}