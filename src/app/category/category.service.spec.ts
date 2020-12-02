import { CategoryService } from './category.service';
import { Category } from './category.model';
import { CategoryMongoRepository } from './repository/category.mongo.repository';
import { Database } from '../../database/database';
import { Mongoose } from 'mongoose';
import { MongoIdValidator } from '../validator/validator.mongo';
import { ErrorService } from '../../error/error';
import Container from 'typedi';

describe("Category Module" , ()=> {

    let categoryService: CategoryService;
    let categoryId: string;
    let categoryName: string = "newname";

    beforeAll(() => {
        const containerDB = Container.get(Database);

        Container.set('category.repository', new CategoryMongoRepository());
        Container.set('database.validator', new MongoIdValidator());
        Container.set(ErrorService, new ErrorService());

        categoryService = Container.get(CategoryService);

        return containerDB.connectWithDatabase()
            .then((conn: Mongoose) => {
                return containerDB.flushDb(conn);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    describe("#create", () => {

        it('should create a new category', () => {

            let categoryEx :Category = {
                name:"newCategory"
            }

            return categoryService.create(categoryEx)
                .then( (result: Category) => {
                    categoryId = result.id;
                    expect(result).not.toBeNull();
                    expect(result.name).toBe(categoryEx.name);
                    
                });
        });
    
        it('should throw an CategoryValidationError', () => {
            return expect(categoryService.create(undefined)).rejects.toThrow('CategoryInputValidationError');
        });
    
    });

    describe("#update", () => {

        it('should update the category', () => {

            let categoryEx :Category = {
                id: categoryId,
                name: categoryName
            }

            return categoryService.update(categoryEx)
                .then( (result: Category) => {
                    expect(result).not.toBeNull();
                    expect(result.id).toBe(categoryEx.id);
                    expect(result.name).toBe(categoryEx.name);
                });
        });
    
        it('should throw an CategoryValidationError', () => {
            return expect(categoryService.update(undefined)).rejects.toThrow('CategoryInputValidationError');
        });
    
    });

    describe("#findById", () => {

        it('should find the category given an id', () => {
            return categoryService.findById(categoryId)
                .then( (result: Category) => {
                    categoryId = result.id;
                    expect(result).not.toBeNull();
                    expect(result.id).toBe(categoryId);
                    
                });
        });
    
        it('should throw an InvalidCategoryIdError', () => {
            return expect(categoryService.findById(undefined)).rejects.toThrow('InvalidCategoryIdError');
        });
    
    });

    describe("#findByName", () => {

        it('should find the category given a name', () => {
            return categoryService.findByName(categoryName)
                .then( (result: Category) => {
                    categoryId = result.id;
                    expect(result).not.toBeNull();
                    expect(result.name).toBe(categoryName);
                });
        });
    
        it('should throw an InvalidCategoryIdError', () => {
            return expect(categoryService.findByName(undefined)).rejects.toThrow('CategoryInputValidationError');
        });
    
    });

    describe("#delete", () => {

        it('should delete a user\'s category', () => {
            return categoryService.delete(categoryId)
                .then( (result) => {
                    expect(result).toBeNull();
                });
        });
    
        it('should throw an InvalidCategoryIdError', () => {
            return expect(categoryService.delete(undefined)).rejects.toThrow('InvalidCategoryIdError');
        });
    
    });

});
