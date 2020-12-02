import { SaleService } from './sale.service';
import { Sale } from './sale.model';
import { User } from '../user/user.model';
import { SaleMongoRepository } from './repository/sale.mongo.repository';
import { Database } from '../../database/database';
import { Mongoose } from 'mongoose';
import { MongoIdValidator } from '../validator/validator.mongo';
import { ErrorService } from '../../error/error';
import Container from 'typedi';

describe("Sale Module" , ()=> {

    let saleService: SaleService;
    let saleId: string;

    beforeAll(() => {
        const containerDB = Container.get(Database);

        Container.set('sale.repository', new SaleMongoRepository());
        Container.set('database.validator', new MongoIdValidator());
        Container.set(ErrorService, new ErrorService());

        saleService = Container.get(SaleService);

        return containerDB.connectWithDatabase()
            .then((conn: Mongoose) => {
                return containerDB.flushDb(conn);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    describe("#create", () => {

        it('should create a new sales', () => {

            let salesEx :Sale[] = [{
                productId: "productId",
                storeId: "storeId",
                userId: "userId",
                date: "date"
            }];

            return saleService.create( salesEx )
                .then( (result: Sale[] ) => {
                    saleId = result[0].id;
                    expect(result).not.toBeNull();
                    expect(result.length).toBe(salesEx.length);

                    for(let i=0;i<result.length;i++){
                        let sale :Sale= result[i];
                        let saleEx: Sale = salesEx[i];
                        expect(sale).not.toBeNull();
                        expect(sale.date).toBe(saleEx.date);
                        expect(sale.userId).toBe(saleEx.userId);
                        expect(sale.storeId).toBe(saleEx.storeId);
                        expect(sale.productId).toBe(saleEx.productId);
                    }
                });
        });
    
        it('should throw an SaleValidationError', () => {
            return expect(saleService.create(undefined)).rejects.toThrow('SaleInputValidationError');
        });
    
    });

    describe("#update", () => {

        it('should update the sale', () => {

            let saleEx :Sale = {
                id: saleId,
                date : "dateUPdated",
                productId: "productId",
                storeId: "storeId",
                userId: "userId",
            }

            return saleService.update(saleEx)
                .then( (result: Sale) => {
                    expect(result).not.toBeNull();
                    expect(result.id).toBe(saleEx.id);
                    expect(result.date).toBe(saleEx.date);
                    expect(result.productId).toBe(saleEx.productId);
                    expect(result.storeId).toBe(saleEx.storeId);
                    expect(result.userId).toBe(saleEx.userId);
                });
        });
    
        it('should throw an SaleValidationError', () => {
            return expect(saleService.update(undefined)).rejects.toThrow('SaleInputValidationError');
        });
    
    });

    describe("#delete", () => {

        it('should delete a user\'s sale', () => {
            return saleService.delete(saleId)
                .then( (result) => {
                    expect(result).toBeNull();
                });
        });
    
        it('should throw an InvalidSaleIdError', () => {
            return expect(saleService.delete(undefined)).rejects.toThrow('InvalidSaleIdError');
        });
    
    });

});
