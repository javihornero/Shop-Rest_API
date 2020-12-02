import { ProductService } from './product.service';
import { Product } from './product.model';
import { User } from '../user/user.model';
import { ProductMongoRepository } from './repository/product.mongo.repository';
import { Database } from '../../database/database';
import { Mongoose } from 'mongoose';
import { MongoIdValidator } from '../validator/validator.mongo';
import { ErrorService } from '../../error/error';
import Container from 'typedi';

describe("Product Module" , ()=> {

    let productService: ProductService;
    let productId: string;
    let storeId: string = "newStore";

    beforeAll(() => {
        const containerDB = Container.get(Database);

        Container.set('product.repository', new ProductMongoRepository());
        Container.set('database.validator', new MongoIdValidator());
        Container.set(ErrorService, new ErrorService());

        productService = Container.get(ProductService);

        return containerDB.connectWithDatabase()
            .then((conn: Mongoose) => {
                return containerDB.flushDb(conn);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    describe("#create", () => {

        it('should create a new product', () => {


            let productEx :Product = {
                name:"newProduct",
                price: 5,
                stock: 1,
                storeId: storeId,
                category: "sports"
            }

            return productService.create(productEx)
                .then( (result: Product) => {
                    productId = result.id;
                    expect(result).not.toBeNull();
                    expect(result.name).toBe(productEx.name);
                    expect(result.price).toBe(productEx.price);
                    expect(result.stock).toBe(productEx.stock);
                    expect(result.storeId).toBe(productEx.storeId);
                    expect(result.category).toBe(productEx.category);
                });
        });
    
        it('should throw an ProductValidationError', () => {
            return expect(productService.create(undefined)).rejects.toThrow('ProductInputValidationError');
        });
    
    });

    describe("#update", () => {

        it('should update the product', () => {

            let productEx :Product = {
                id: productId,
                name:"updatedProduct",
                price: 8,
                stock: 2,
                storeId: storeId,
                category: "sports"
            }


            return productService.update(productEx)
                .then( (result: Product) => {
                    expect(result).not.toBeNull();
                    expect(result.id).toBe(productEx.id);
                    expect(result.name).toBe(productEx.name);
                    expect(result.price).toBe(productEx.price);
                    expect(result.stock).toBe(productEx.stock);
                    expect(result.storeId).toBe(productEx.storeId);
                    expect(result.category).toBe(productEx.category);
                });
        });
    
        it('should throw an ProductValidationError', () => {
            return expect(productService.update(undefined)).rejects.toThrow('ProductInputValidationError');
        });
    
    });

    describe("#findById", () => {

        it('should find the product given an id', () => {
            return productService.findById(productId)
                .then( (result: Product) => {
                    productId = result.id;
                    expect(result).not.toBeNull();
                    expect(result.id).toBe(productId);
                    
                });
        });
    
        it('should throw an InvalidProductIdError', () => {
            return expect(productService.findById(undefined)).rejects.toThrow('InvalidProductIdError');
        });
    
    });

    describe("#findByStoreId", () => {

        it('should find the products of a given store', () => {
            return productService.findByStoreId(storeId)
                .then( (result: Product[]) => {
                    const prodId = result[0].id;
                    expect(result).not.toBeNull();
                    expect(prodId).toBe(productId);
                    
                });
        });
    
        it('should throw an InvalidProductIdError', () => {
            return expect(productService.findByStoreId(undefined)).rejects.toThrow('InvalidStoreIdError');
        });
    
    });

    describe("#delete", () => {

        it('should delete a user\'s product', () => {
            return productService.delete(productId)
                .then( (result) => {
                    expect(result).toBeNull();
                });
        });
    
        it('should throw an InvalidProductIdError', () => {
            return expect(productService.delete(undefined)).rejects.toThrow('InvalidProductIdError');
        });
    
    });

});
